#!/usr/bin/env python3
"""
OwningDubai — Daily Off-Plan Projects Scraper
==============================================
Pulls off-plan projects from the Bayut Unofficial API (primary) and
PropertyFinder UAE Data API (secondary) via RapidAPI, then inserts
them into Supabase.

Usage:
    python scrape_offplan.py              # normal run (both APIs)
    python scrape_offplan.py --bayut      # Bayut API only
    python scrape_offplan.py --pf         # PropertyFinder API only
    python scrape_offplan.py --dry-run    # fetch + log, no DB writes
"""

import os
import re
import sys
import json
import time
import logging
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

load_dotenv(Path(__file__).parent / ".env")

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# API hosts
BAYUT_HOST = "uae-real-estate2.p.rapidapi.com"
PF_HOST = "propertyfinder-uae-data.p.rapidapi.com"

DRY_RUN = "--dry-run" in sys.argv
BAYUT_ONLY = "--bayut" in sys.argv
PF_ONLY = "--pf" in sys.argv

# Target developers (case-insensitive matching)
TARGET_DEVELOPERS = [
    "emaar", "damac", "sobha", "nakheel", "meraas", "aldar",
    "binghatti", "danube", "azizi", "omniyat", "select group",
    "ellington", "mag", "tiger", "samana",
]

REQUEST_DELAY_SECS = 2.0

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("scraper")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text: str) -> str:
    """Convert text to URL-safe slug."""
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"(^-|-$)", "", s)
    return s[:80]


def matches_target_developer(dev_name: str) -> bool:
    """Check if a developer name matches any of our target list."""
    if not dev_name:
        return False
    lower = dev_name.lower().strip()
    return any(target in lower for target in TARGET_DEVELOPERS)


def strip_html(text: str) -> str:
    """Remove HTML tags from text."""
    return re.sub(r"<[^>]+>", "", text).strip()


def roi_estimate(price: int) -> float:
    """Simple ROI estimate based on price tier."""
    if price >= 5_000_000:
        return 6.0
    if price >= 2_000_000:
        return 7.0
    if price >= 1_000_000:
        return 6.5
    return 5.5


# ---------------------------------------------------------------------------
# Bayut API — Primary Source
# ---------------------------------------------------------------------------

def fetch_bayut_projects() -> list[dict]:
    """Fetch off-plan projects from the Bayut Unofficial API.

    Returns normalized project dicts ready for DB insertion.
    """
    if not RAPIDAPI_KEY:
        log.error("RAPIDAPI_KEY not set.")
        return []

    session = requests.Session()
    session.headers.update({
        "x-rapidapi-host": BAYUT_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
        "Content-Type": "application/json",
    })

    seen_ids: set[int] = set()
    normalized: list[dict] = []

    log.info("Fetching from Bayut API...")

    # The API returns ~24 results per page, duplicates across pages
    for page in range(5):
        if page > 0:
            time.sleep(REQUEST_DELAY_SECS)

        try:
            resp = session.post(
                f"https://{BAYUT_HOST}/new_projects_search",
                json={"page": page, "sort": "city_level_score", "location_ids": []},
                timeout=30,
            )
            if resp.status_code != 200:
                log.warning(f"  Bayut API returned {resp.status_code}")
                continue

            data = resp.json()
            results = data.get("results", [])
            if not results:
                log.info(f"  Page {page}: empty, stopping")
                break

            new_count = 0
            for item in results:
                item_id = item.get("id")
                if not item_id or item_id in seen_ids:
                    continue
                seen_ids.add(item_id)

                # Developer filter
                dev = item.get("developer", {})
                dev_name = dev.get("name", "") if isinstance(dev, dict) else ""
                if not matches_target_developer(dev_name):
                    continue

                # Normalize to our standard format
                project = _normalize_bayut_item(item)
                if project:
                    normalized.append(project)
                    new_count += 1

            log.info(f"  Page {page}: {len(results)} results, {new_count} new target projects")
            if new_count == 0:
                log.info("  No new results, stopping pagination")
                break

        except requests.RequestException as e:
            log.error(f"  Bayut request failed: {e}")
            continue

    log.info(f"Bayut: {len(normalized)} target projects fetched")
    return normalized


def _normalize_bayut_item(item: dict) -> dict | None:
    """Convert a Bayut API item to our normalized project format."""
    title = item.get("title", "")
    if not title:
        return None

    dev = item.get("developer", {})
    dev_name = dev.get("name", "")
    dev_logo = dev.get("logo_url", "")
    desc = strip_html(item.get("description", f"{title} — premium off-plan property in Dubai."))

    # Location
    loc = item.get("location", {})
    community_name = loc.get("community", {}).get("name", "") if isinstance(loc.get("community"), dict) else ""
    sub_community = loc.get("sub_community", {}).get("name", "") if isinstance(loc.get("sub_community"), dict) else ""
    city = loc.get("city", {}).get("name", "Dubai") if isinstance(loc.get("city"), dict) else "Dubai"
    location_full = f"{sub_community}, {community_name}, {city}" if sub_community else f"{community_name}, {city}"
    area = community_name or city

    coords = loc.get("coordinates", {})

    # Price
    price = int(item.get("price", 0))

    # Bedrooms — deduplicated from unit_rooms
    unit_rooms = sorted(set(item.get("unit_rooms", [])))
    if not unit_rooms:
        beds = item.get("details", {}).get("bedrooms")
        unit_rooms = [int(beds)] if beds is not None else [1, 2, 3]

    # Property type
    ptype = (item.get("type", {}).get("sub", "apartment") if isinstance(item.get("type"), dict) else "apartment").lower()
    if "villa" in ptype:
        ptype = "villa"
    elif "townhouse" in ptype:
        ptype = "townhouse"
    elif "penthouse" in ptype:
        ptype = "penthouse"
    else:
        ptype = "apartment"

    # Completion details
    comp = item.get("details", {}).get("completion_details", {})
    comp_date = comp.get("completion_date", "")[:10] if comp.get("completion_date") else None
    status = item.get("details", {}).get("completion_status", "under-construction")
    comp_percent = comp.get("percentage")

    # Payment plan
    pp = item.get("payment_plans", [{}])[0] if item.get("payment_plans") else {}
    down = pp.get("down_payment_percent") or 10
    pre_ho = pp.get("pre_handover_percent") or 70
    ho = pp.get("handover_percent") or 20
    payment = f"{down}/{pre_ho}/{ho}"

    # Size
    area_sqft = item.get("area", {}).get("built_up") if isinstance(item.get("area"), dict) else None

    # Images — cover photo + thumbnails
    media = item.get("media", {})
    images: list[str] = []
    cover = media.get("cover_photo", "")
    if cover:
        images.append(cover)
    for photo in media.get("photos", []):
        if photo and photo not in images:
            images.append(photo)

    # Slug
    slug_base = slugify(title)[:60]
    slug = f"{slug_base}-bayut-{item['id']}"

    return {
        "source": "bayut",
        "source_id": str(item["id"]),
        "name": title,
        "slug": slug,
        "developer_name": dev_name,
        "developer_logo": dev_logo,
        "description": desc,
        "location": location_full,
        "area": area,
        "community": sub_community or None,
        "price_from": price,
        "bedrooms": unit_rooms,
        "property_type": ptype,
        "completion_date": comp_date,
        "construction_stage": status,
        "construction_percent": int(comp_percent) if comp_percent else 30,
        "payment_plan": payment,
        "size_sqft_from": int(area_sqft) if area_sqft else None,
        "images": images[:6],
        "amenities": item.get("amenities", {}),
        "coordinates": {"lat": coords.get("lat"), "lng": coords.get("lng")} if coords.get("lat") else None,
    }


# ---------------------------------------------------------------------------
# PropertyFinder API — Secondary Source
# ---------------------------------------------------------------------------

# Location IDs for broad Dubai coverage
PF_LOCATION_QUERIES = [
    {"location_id": "1", "label": "Dubai (all)"},
    {"location_id": "50", "label": "Dubai Marina"},
    {"location_id": "6", "label": "Downtown Dubai"},
    {"location_id": "7", "label": "Palm Jumeirah"},
    {"location_id": "8", "label": "Business Bay"},
]


def fetch_pf_projects() -> list[dict]:
    """Fetch off-plan projects from the PropertyFinder API.

    Returns normalized project dicts ready for DB insertion.
    """
    if not RAPIDAPI_KEY:
        log.error("RAPIDAPI_KEY not set.")
        return []

    session = requests.Session()
    session.headers.update({
        "x-rapidapi-host": PF_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
    })

    seen_ids: set[str] = set()
    normalized: list[dict] = []

    log.info("Fetching from PropertyFinder API...")

    for i, loc in enumerate(PF_LOCATION_QUERIES):
        if i > 0:
            time.sleep(REQUEST_DELAY_SECS)

        url = f"https://{PF_HOST}/search-new-projects"
        params = {"sort": "newest", "page": "1", "location_id": loc["location_id"]}
        log.info(f"  [{i+1}/{len(PF_LOCATION_QUERIES)}] {loc['label']}")

        try:
            resp = session.get(url, params=params, timeout=30)
            if resp.status_code != 200:
                log.warning(f"    API returned {resp.status_code}")
                continue

            data = resp.json()

            # Extract items
            items: list[dict] = []
            if isinstance(data, dict) and isinstance(data.get("data"), list):
                items = data["data"]
            elif isinstance(data, list):
                items = data
            elif isinstance(data, dict):
                for key in ["hits", "results", "properties", "projects", "items", "listings"]:
                    if isinstance(data.get(key), list) and data[key]:
                        items = data[key]
                        break

            new_count = 0
            for item in items:
                item_id = str(item.get("listing_id") or item.get("id") or "")
                if not item_id or item_id in seen_ids:
                    continue
                seen_ids.add(item_id)

                # Developer filter
                dev_name = _pf_extract_developer(item)
                if not matches_target_developer(dev_name or ""):
                    continue

                project = _normalize_pf_item(item, item_id)
                if project:
                    normalized.append(project)
                    new_count += 1

            log.info(f"    → {new_count} new target projects")

        except requests.RequestException as e:
            log.error(f"    Request failed: {e}")
            continue

    log.info(f"PropertyFinder: {len(normalized)} target projects fetched")
    return normalized


def _pf_extract_developer(item: dict) -> str | None:
    """Extract developer name from PropertyFinder item."""
    if item.get("developer", {}).get("name"):
        return item["developer"]["name"]
    if item.get("developer_name"):
        return item["developer_name"]
    if item.get("agency", {}).get("name"):
        return item["agency"]["name"]
    return None


def _normalize_pf_item(item: dict, item_id: str) -> dict | None:
    """Convert a PropertyFinder API item to normalized format."""
    name = item.get("title") or item.get("name") or item.get("project_name") or ""
    if not name:
        return None

    dev_name = _pf_extract_developer(item) or ""

    # Location
    loc = item.get("location", {})
    full_name = loc.get("full_name", "")
    parts = [p.strip() for p in full_name.split(",") if p.strip()]

    if len(parts) >= 3:
        location = full_name
        area = parts[1]
        community = parts[0]
    elif len(parts) == 2:
        location = full_name
        area = parts[0]
        community = None
    else:
        location = loc.get("name") or item.get("location_name") or "Dubai"
        area = location
        community = None

    # Price
    price = int(item.get("price_from") or item.get("price") or item.get("effective_price") or 0)
    price_to = item.get("price_to") or item.get("max_price")

    # Bedrooms
    beds = item.get("bedrooms")
    if isinstance(beds, list) and beds:
        bedrooms = [int(b) for b in beds]
    elif isinstance(beds, (int, float)):
        bedrooms = [int(beds)]
    else:
        bmin = item.get("bedroom_min")
        bmax = item.get("bedroom_max")
        if bmin is not None and bmax is not None:
            bedrooms = list(range(int(bmin), int(bmax) + 1))
        else:
            bedrooms = [1, 2, 3]

    # Property type
    prop_type = item.get("property_type") or item.get("type") or "apartment"

    # Completion
    comp_date = item.get("delivery_date") or item.get("completion_date") or item.get("handover_date") or None
    construction_phase = item.get("construction_phase", "under-construction")

    # Size
    sqft = None
    min_size = item.get("min_size")
    if isinstance(min_size, dict) and min_size.get("value"):
        sqft = int(min_size["value"] * 10.7639)
    elif isinstance(item.get("area"), (int, float)):
        sqft = int(item["area"])

    # Images — upgrade to high-res
    images: list[str] = []
    if isinstance(item.get("images"), list):
        images.extend(item["images"])
    elif isinstance(item.get("photos"), list):
        for p in item["photos"]:
            images.append(p["url"] if isinstance(p, dict) else str(p))
    elif item.get("image"):
        images.append(item["image"])
    elif item.get("cover_image"):
        images.append(item["cover_image"])
    elif item.get("coverPhoto", {}).get("url"):
        images.append(item["coverPhoto"]["url"])
    images = [url.replace("/small.webp", "/original.webp") for url in images[:6] if url and isinstance(url, str)]

    # Developer logo
    dev_logo = (
        item.get("developer", {}).get("logo")
        or item.get("developer", {}).get("logo_url")
        or None
    )

    slug = f"{slugify(name)}-{item_id}"[:100]

    return {
        "source": "propertyfinder",
        "source_id": item_id,
        "name": name,
        "slug": slug,
        "developer_name": dev_name,
        "developer_logo": dev_logo,
        "description": strip_html(item.get("description") or f"{name} — premium off-plan property in {area}, Dubai."),
        "location": location,
        "area": area,
        "community": community,
        "price_from": price,
        "bedrooms": bedrooms,
        "property_type": prop_type,
        "completion_date": comp_date,
        "construction_stage": construction_phase.replace("_", "-") if construction_phase else "under-construction",
        "construction_percent": 30,
        "payment_plan": "60/40",
        "size_sqft_from": sqft,
        "images": images,
        "amenities": {},
        "coordinates": None,
    }


# ---------------------------------------------------------------------------
# Supabase Insertion
# ---------------------------------------------------------------------------

def process_and_insert(projects: list[dict]) -> dict:
    """Deduplicate against DB and insert new project records."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        log.error("SUPABASE_URL or SUPABASE_SERVICE_KEY not set. Check scripts/.env")
        return {"inserted": 0, "skipped": 0, "errors": 0}

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    stats = {"inserted": 0, "skipped": 0, "errors": 0, "developers_created": 0, "images_added": 0}
    dev_cache: dict[str, str] = {}  # dev_name → dev_id

    for project in projects:
        try:
            slug = project["slug"]
            name = project["name"]
            dev_name = project["developer_name"]

            # --- Check if already in DB (by slug or similar name) ---
            existing = supabase.table("properties").select("id").eq("slug", slug).execute()
            if existing.data and len(existing.data) > 0:
                stats["skipped"] += 1
                continue

            if DRY_RUN:
                log.info(f"  [DRY RUN] Would insert: {name} ({dev_name}) — {slug}")
                stats["inserted"] += 1
                continue

            # --- Ensure developer exists ---
            developer_id = _ensure_developer(supabase, dev_name, project.get("developer_logo"), dev_cache, stats)

            # --- Insert property ---
            price = project["price_from"]
            prop_result = supabase.table("properties").insert({
                "name": name,
                "slug": slug,
                "developer_id": developer_id,
                "location": project["location"],
                "area": project["area"],
                "community": project["community"],
                "price_from": price,
                "bedrooms": project["bedrooms"],
                "property_type": project["property_type"],
                "completion_date": project["completion_date"],
                "status": "selling",
                "description": project["description"],
                "tagline": f"Invest in {project['area']}",
                "size_sqft_from": project["size_sqft_from"],
                "golden_visa_eligible": price >= 2_000_000,
                "roi_estimate": roi_estimate(price),
                "payment_plan": project["payment_plan"],
                "construction_stage": project["construction_stage"],
                "construction_percent": project["construction_percent"],
            }).execute()

            if not prop_result.data:
                log.warning(f"  Insert failed for: {slug}")
                stats["errors"] += 1
                continue

            property_id = prop_result.data[0]["id"]

            # --- Insert images ---
            for idx, img_url in enumerate(project.get("images", [])):
                supabase.table("property_images").insert({
                    "property_id": property_id,
                    "url": img_url,
                    "alt_text": f"{name} - Image {idx + 1}",
                    "is_primary": idx == 0,
                    "display_order": idx,
                }).execute()
                stats["images_added"] += 1

            stats["inserted"] += 1
            log.info(f"  ✓ Inserted: {name} ({dev_name}) [{project['source']}]")

        except Exception as e:
            log.error(f"  Error processing {project.get('name', '?')}: {e}")
            stats["errors"] += 1

    return stats


def _ensure_developer(
    supabase: Client,
    dev_name: str,
    dev_logo: str | None,
    cache: dict[str, str],
    stats: dict,
) -> str | None:
    """Look up or create a developer record. Returns developer_id."""
    if not dev_name:
        return None
    if dev_name in cache:
        return cache[dev_name]

    dev_slug = slugify(dev_name)

    # Try to find existing
    existing = supabase.table("developers").select("id").eq("slug", dev_slug).execute()
    if existing.data and len(existing.data) > 0:
        dev_id = existing.data[0]["id"]
        cache[dev_name] = dev_id
        return dev_id

    # Create new developer
    dev_insert = supabase.table("developers").insert({
        "name": dev_name,
        "slug": dev_slug,
        "logo_url": dev_logo,
        "description": f"{dev_name} is a leading real estate developer in Dubai.",
    }).execute()

    if dev_insert.data:
        dev_id = dev_insert.data[0]["id"]
        cache[dev_name] = dev_id
        stats["developers_created"] += 1
        log.info(f"  Created developer: {dev_name}")
        return dev_id

    return None


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    log.info("=" * 60)
    log.info("OwningDubai Off-Plan Scraper")
    log.info(f"Run time: {datetime.now().isoformat()}")
    if DRY_RUN:
        log.info("MODE: DRY RUN (no DB writes)")
    log.info("=" * 60)

    # Validate config
    missing = []
    if not RAPIDAPI_KEY:
        missing.append("RAPIDAPI_KEY")
    if not SUPABASE_URL:
        missing.append("SUPABASE_URL")
    if not SUPABASE_SERVICE_KEY:
        missing.append("SUPABASE_SERVICE_KEY")

    if missing:
        log.error(f"Missing environment variables: {', '.join(missing)}")
        log.error("Copy scripts/.env.example to scripts/.env and fill in your keys.")
        sys.exit(1)

    all_projects: list[dict] = []

    # Step 1: Fetch from APIs
    if not PF_ONLY:
        log.info("\n--- Fetching from Bayut API (primary) ---")
        bayut_projects = fetch_bayut_projects()
        all_projects.extend(bayut_projects)

    if not BAYUT_ONLY:
        log.info("\n--- Fetching from PropertyFinder API (secondary) ---")
        pf_projects = fetch_pf_projects()
        # Deduplicate: skip PF projects whose name matches a Bayut project
        bayut_names = {p["name"].lower() for p in all_projects}
        for p in pf_projects:
            if p["name"].lower() not in bayut_names:
                all_projects.append(p)
            else:
                log.info(f"  Skipping PF duplicate: {p['name']}")

    if not all_projects:
        log.warning("No results from APIs. Exiting.")
        return

    log.info(f"\nTotal projects to process: {len(all_projects)}")

    # Step 2: Filter & insert
    log.info("\n--- Processing & inserting into Supabase ---")
    stats = process_and_insert(all_projects)

    # Step 3: Report
    log.info("\n" + "=" * 60)
    log.info("RESULTS")
    log.info(f"  Total from APIs:     {len(all_projects)}")
    log.info(f"  Already in DB:       {stats['skipped']}")
    log.info(f"  Newly inserted:      {stats['inserted']}")
    log.info(f"  Images added:        {stats['images_added']}")
    log.info(f"  Developers created:  {stats['developers_created']}")
    log.info(f"  Errors:              {stats['errors']}")
    log.info("=" * 60)


if __name__ == "__main__":
    main()
