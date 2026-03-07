

# Populate Site with Bayut Property Data

## Approach

Use the **unofficial Bayut API** (hosted on RapidAPI at `uae-real-estate2.p.rapidapi.com`) to fetch real Dubai off-plan properties, developers, and images, then map and insert them into your existing database tables.

## What You Need

You'll need a **RapidAPI key** with the Bayut API subscription (has a free tier). I'll store it as a secret in your backend.

## Implementation

### 1. Edge Function: `fetch-bayut-data`
- Calls Bayut API endpoints:
  - `POST /properties_search` — fetch off-plan properties (purpose: for-sale, is_completed: false)
  - `POST /new_projects_search` — fetch new development projects
- Maps Bayut response fields to your `properties`, `developers`, and `property_images` tables
- Field mapping:
  - Bayut `title` → `name`, `price` → `price_from`, `location.name` → `area`, `rooms` → `bedrooms`, `developer.name` → developer lookup/create, `photos[].url` → `property_images`
  - Generate `slug` from title
  - Map `completion_status` → `status`, `completion_date`, etc.
- Upserts developers first, then properties, then images
- Fetches ~50-100 listings across popular Dubai areas

### 2. Frontend: Admin trigger button (or one-time invoke)
- Add a simple button on the developer dashboard (or invoke manually) to trigger the data import
- Shows progress/results

### 3. Data inserted into existing tables
- `developers` — name, slug, logo_url from Bayut developer data
- `properties` — all core fields mapped from Bayut listings
- `property_images` — photos from each listing with display_order

## Files to Create/Edit
1. **Create** `supabase/functions/fetch-bayut-data/index.ts` — edge function that fetches & inserts
2. **Edit** `supabase/config.toml` — NO, this is auto-managed. Will set `verify_jwt = false` via the tool.
3. **Add secret** `RAPIDAPI_KEY` — user provides their RapidAPI key

## Prerequisites
- You sign up at [rapidapi.com](https://rapidapi.com) and subscribe to the "UAE Real Estate" (Bayut) API (free tier available)
- Provide the RapidAPI key when prompted

