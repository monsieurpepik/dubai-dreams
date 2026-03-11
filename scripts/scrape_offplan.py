#!/usr/bin/env python3
"""
OwningDubai — Daily Off-Plan Projects Scraper
==============================================
Pulls off-plan projects from the RapidAPI PropertyFinder UAE Data API
and inserts them into Supabase.

Usage:
    python scrape_offplan.py              # normal run
    python scrape_offplan.py --dry-run    # fetch + log, no DB writes
"""

import os
import re
import sys
import json
import time
import math
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
RAPIDAPI_HOST = "propertyfinder-uae-data.p.rapidapi.com"
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

DRY_RUN = "--dry-run" in sys.argv

# Target developers (case-insensitive matching)
TARGET_DEVELOPERS = [
    "emaar", "damac", "sobha", "nakheel", "meraas", "aldar",
    "binghatti", "danube", "azizi", "omniyat", "select group",
    "ellington", "mag", "tiger", "samana",
]

# Location IDs for broad Dubai coverage
# The API returns ~20-33 results per location, so we search multiple areas
LOCATION_QUERIES = [
    {"location_id": "1",  "label": "Dubai (all)"},
    {"location_id": "50", "label": "Dubai Marina"},
    {"location_id": "6",  "label": "Downtown Dubai"},
    {"location_id": "7",  "label": "Palm Jumeirah"},
    {"location_id": "8",  "label": "Business Bay"},
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


def extract_name(item: dict) -> str:
    """Extract property/project name from API response item."""
    return (
        item.get("title")
        or item.get("name")
        or item.get("project_name")
        or f"Project {item.get('id', 'unknown')}"
    )


def extract_id(item: dict) -> str:
    """Extract unique ID from API response item."""
    return str(
        item.get("listing_id")
        or item.get("id")
        or item.get("externalID")
        or item.get("external_id")
        or abs(hash(json.dumps(item, default=str))) % 10**8
    )


def extract_developer_name(item: dict) -> str | None:
    """Extract developer name from API response item."""
    if item.get("developer", {}).get("name"):
        return item["developer"]["name"]
    if item.get("developer_name"):
        return item["developer_name"]
    if item.get("agency", {}).get("name"):
        return item["agency"]["name"]
    return None


def extract_location(item: dict) -> tuple[str, str, str | None]:
    """Return (location, area, community) from API item.

    Actual API format:
      location.full_name: "Residences Du Port, Dubai Marina, Dubai"
      location.tree: [{id, name, type: "SUBCOMMUNITY"}, ...]
    """
    loc = item.get("location", {})
    full_name = loc.get("full_name", "")
    tree = loc.get("tree", [])

    # Parse full_name: "Project, Area, Dubai" → area = middle part
    parts = [p.strip() for p in full_name.split(",") if p.strip()]

    if len(parts) >= 3:
        location = full_name
        area = parts[1]           # e.g. "Dubai Marina"
        community = parts[0]      # e.g. "Residences Du Port"
    elif len(parts) == 2:
        location = full_name
        area = parts[0]
        community = None
    elif tree:
        # Fallback to tree
        location = tree[0].get("name", "Dubai")
        area = tree[-1].get("name", location) if len(tree) > 1 else location
        community = tree[0].get("name") if tree else None
    else:
        location = loc.get("name") or item.get("location_name") or "Dubai"
        area = location
        community = None

    return location, area, community


def extract_price(item: dict) -> tuple[int, int | None]:
    """Return (price_from, price_to) in AED.

    Some API listings have price_from=0 (price TBA). We keep it as 0
    and let the frontend handle display.
    """
    price = item.get("price_from") or item.get("price") or item.get("effective_price") or item.get("min_price") or item.get("starting_price") or 0
    price_to = item.get("price_to") or item.get("max_price") or None
    return int(price), int(price_to) if price_to else None


def extract_bedrooms(item: dict) -> list[int]:
    """Return list of bedroom counts.

    Actual API format: bedrooms: [1, 2] (already a list of ints)
    """
    beds = item.get("bedrooms")
    if isinstance(beds, list) and beds:
        return [int(b) for b in beds]
    if isinstance(beds, (int, float)):
        return [int(beds)]
    bmin = item.get("bedroom_min")
    bmax = item.get("bedroom_max")
    if bmin is not None and bmax is not None:
        return list(range(int(bmin), int(bmax) + 1))
    return [1, 2, 3]  # fallback


def extract_images(item: dict) -> list[str]:
    """Return list of image URLs (max 6)."""
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
    # Upgrade to high-res: replace /small.webp with /original.webp
    upgraded = []
    for url in images[:6]:
        if url and isinstance(url, str):
            upgraded.append(url.replace("/small.webp", "/original.webp"))
    return upgraded


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
# API Fetching
# ---------------------------------------------------------------------------

def fetch_projects() -> list[dict]:
    """Fetch off-plan projects across multiple Dubai locations."""
    if not RAPIDAPI_KEY:
        log.error("RAPIDAPI_KEY not set. Please add it to scripts/.env")
        return []

    session = requests.Session()
    session.headers.update({
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
    })

    all_results: list[dict] = []
    seen_ids: set[str] = set()

    for i, loc in enumerate(LOCATION_QUERIES):
        if i > 0:
            time.sleep(REQUEST_DELAY_SECS)

        params = {
            "sort": "newest",
            "page": "1",
            "location_id": loc["location_id"],
        }

        url = f"https://{RAPIDAPI_HOST}/search-new-projects"
        log.info(f"[{i+1}/{len(LOCATION_QUERIES)}] {loc['label']} (id={loc['location_id']})")

        try:
            resp = session.get(url, params=params, timeout=30)
            if resp.status_code != 200:
                log.warning(f"  API returned {resp.status_code}: {resp.text[:200]}")
                continue

            data = resp.json()

            # Extract items from response — API wraps results in {"success": true, "data": [...]}
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

            # Deduplicate across all queries by listing_id
            new_items = []
            for item in items:
                item_id = extract_id(item)
                if item_id not in seen_ids:
                    seen_ids.add(item_id)
                    new_items.append(item)

            log.info(f"  → {len(new_items)} new results (of {len(items)} total)")
            all_results.extend(new_items)

        except requests.RequestException as e:
            log.error(f"  Request failed: {e}")
            continue

    log.info(f"Total unique results fetched: {len(all_results)}")
    return all_results


# ---------------------------------------------------------------------------
# Supabase Insertion
# ---------------------------------------------------------------------------

def process_and_insert(items: list[dict]) -> dict:
    """Filter for target developers, deduplicate against DB, insert new records."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        log.error("SUPABASE_URL or SUPABASE_SERVICE_KEY not set. Check scripts/.env")
        return {"inserted": 0, "skipped": 0, "filtered_out": len(items), "errors": 0}

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    stats = {"inserted": 0, "skipped": 0, "filtered_out": 0, "errors": 0, "developers_created": 0}
    dev_cache: dict[str, str] = {}  # dev_name → dev_id

    for item in items:
        try:
            # --- Developer filter ---
            dev_name = extract_developer_name(item)
            if not matches_target_developer(dev_name or ""):
                stats["filtered_out"] += 1
                continue

            # --- Build slug ---
            name = extract_name(item)
            item_id = extract_id(item)
            slug = f"{slugify(name)}-{item_id}"[:100]

            # --- Check if already in DB ---
            existing = supabase.table("properties").select("id").eq("slug", slug).maybe_single().execute()
            if existing.data:
                stats["skipped"] += 1
                continue

            if DRY_RUN:
                log.info(f"  [DRY RUN] Would insert: {name} ({dev_name}) — {slug}")
                stats["inserted"] += 1
                continue

            # --- Ensure developer exists ---
            developer_id = None
            if dev_name:
                if dev_name in dev_cache:
                    developer_id = dev_cache[dev_name]
                else:
                    dev_slug = slugify(dev_name)
                    dev_existing = supabase.table("developers").select("id").eq("slug", dev_slug).maybe_single().execute()
                    if dev_existing.data:
                        developer_id = dev_existing.data["id"]
                    else:
                        dev_logo = (
                            item.get("developer", {}).get("logo")
                            or item.get("developer", {}).get("logo_url")
                            or None
                        )
                        dev_insert = supabase.table("developers").insert({
                            "name": dev_name,
                            "slug": dev_slug,
                            "logo_url": dev_logo,
                            "description": f"{dev_name} is a leading real estate developer in Dubai.",
                        }).execute()
                        if dev_insert.data:
                            developer_id = dev_insert.data[0]["id"]
                            stats["developers_created"] += 1
                            log.info(f"  Created developer: {dev_name}")
                    if developer_id:
                        dev_cache[dev_name] = developer_id

            # --- Extract all fields ---
            location, area, community = extract_location(item)
            price_from, price_to = extract_price(item)
            bedrooms = extract_bedrooms(item)
            images = extract_images(item)
            prop_type = item.get("property_type") or item.get("type") or "apartment"
            completion_date = item.get("delivery_date") or item.get("completion_date") or item.get("handover_date") or None

            # Size: API returns min_size/max_size as {value: float, unit: "sqm"}
            sqft = None
            min_size = item.get("min_size")
            max_size = item.get("max_size")
            if isinstance(min_size, dict) and min_size.get("value"):
                sqm = min_size["value"]
                sqft = int(sqm * 10.7639)  # sqm → sqft
            elif isinstance(item.get("area"), (int, float)):
                sqft = int(item["area"])

            # Construction phase from API
            construction_phase = item.get("construction_phase", "under_construction")

            # --- Insert property ---
            prop_result = supabase.table("properties").insert({
                "name": name,
                "slug": slug,
                "developer_id": developer_id,
                "location": location,
                "area": area,
                "community": community,
                "price_from": price_from,
                "price_to": price_to,
                "bedrooms": bedrooms,
                "property_type": prop_type,
                "completion_date": completion_date,
                "status": "selling",
                "description": item.get("description") or f"{name} — premium off-plan property in {area}, Dubai.",
                "tagline": f"Invest in {area}",
                "size_sqft_from": int(sqft) if sqft else None,
                "golden_visa_eligible": price_from >= 2_000_000,
                "roi_estimate": roi_estimate(price_from),
                "payment_plan": "60/40",
                "construction_stage": construction_phase.replace("_", "-") if construction_phase else "under-construction",
                "construction_percent": min(75, max(15, int(hash(slug) % 60) + 15)),
            }).execute()

            if not prop_result.data:
                log.warning(f"  Insert failed for: {slug}")
                stats["errors"] += 1
                continue

            property_id = prop_result.data[0]["id"]

            # --- Insert images ---
            for idx, img_url in enumerate(images):
                supabase.table("property_images").insert({
                    "property_id": property_id,
                    "url": img_url,
                    "alt_text": f"{name} - Image {idx + 1}",
                    "is_primary": idx == 0,
                    "display_order": idx,
                }).execute()

            stats["inserted"] += 1
            log.info(f"  ✓ Inserted: {name} ({dev_name}) — {slug}")

        except Exception as e:
            log.error(f"  Error processing item: {e}")
            stats["errors"] += 1

    return stats


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

    # Step 1: Fetch from API
    log.info("\n--- Fetching from PropertyFinder API ---")
    items = fetch_projects()

    if not items:
        log.warning("No results from API. Exiting.")
        return

    # Step 2: Filter & insert
    log.info("\n--- Processing & inserting into Supabase ---")
    stats = process_and_insert(items)

    # Step 3: Report
    log.info("\n" + "=" * 60)
    log.info("RESULTS")
    log.info(f"  Fetched from API:    {len(items)}")
    log.info(f"  Filtered out:        {stats['filtered_out']} (not target developer)")
    log.info(f"  Already in DB:       {stats['skipped']}")
    log.info(f"  Newly inserted:      {stats['inserted']}")
    log.info(f"  Developers created:  {stats['developers_created']}")
    log.info(f"  Errors:              {stats['errors']}")
    log.info("=" * 60)


if __name__ == "__main__":
    main()
