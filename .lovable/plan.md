

# Next High-Impact MVP Improvements

Based on the current codebase state, here are the 5 highest-ROI changes ranked by launch readiness:

## 1. Property Truth Card on PropertyDetail (Differentiator)
The AI scoring engine (`match-deals`) already produces deal scores, verdicts, yield estimates, and liquidity scores. Currently this data only appears in `/discover`. Surface it on `PropertyDetail.tsx` where conversions actually happen.

**Implementation:**
- New component `PropertyTruthCard.tsx` — calls `match-deals` edge function for a single property
- Shows: Deal Score (0-100 gauge), Verdict badge (Undervalued/Fair/Premium), Est. Rental Yield, Liquidity Score
- Placed in the right sidebar next to the inquiry form
- Cached per property to avoid repeated AI calls

## 2. WhatsApp-First CTAs
Dubai market closes on WhatsApp. Currently WhatsApp is secondary to form-based inquiry.

**Implementation:**
- `FloatingCTA.tsx` — make WhatsApp the primary (larger) button, "Book a Call" secondary
- `MobileCTABar.tsx` — swap order so WhatsApp is the prominent action
- `PropertyDetail.tsx` — add WhatsApp button inline near the inquiry form with pre-filled message: "Hi, I'm interested in {propertyName}"
- All WhatsApp links already use `getPropertyWhatsAppUrl()` from tenant context

## 3. Dynamic SEO Meta Tags per Property
Each `PropertyDetail` page should have unique title/description/OG tags for search and social sharing.

**Implementation:**
- Update `PropertyDetail.tsx` SEO component to use property data:
  - Title: `"{name} by {developer} | From AED {price} | OwningDubai"`
  - Description: `"{bedrooms} in {area} — {short description}"`
  - OG image: primary property image URL
- Same pattern for `/properties` page with collection/filter context

## 4. Lead Visibility (Simple Admin View)
Currently leads go into the `leads` table and a notification email fires. If the email fails, you have no visibility.

**Implementation:**
- Add a simple protected `/leads` route (behind auth, hardcoded to your user ID for now)
- Query `leads` table joined with `properties` to show: email, phone, property name, date, source
- Simple table view — no CRUD needed, just read access
- Add `status` column to leads table (new, contacted, converted) via migration

## 5. Verify Analytics Pipeline
`usePageTracking` and `analytics.ts` exist but need verification that GA is receiving data.

**Implementation:**
- Check that `GA_MEASUREMENT_ID` secret is wired into the frontend (it's a secret, not a `VITE_` env var — this may be broken)
- If broken, either expose it as a VITE_ variable or hardcode it since GA IDs are public
- Verify `gtag` script is loaded in `index.html`

---

## Priority Order for Implementation

| # | Change | Impact | Effort |
|---|--------|--------|--------|
| 1 | Property Truth Card | High (differentiator) | Medium |
| 2 | WhatsApp-first CTAs | High (conversion) | Low |
| 3 | Dynamic SEO tags | High (free traffic) | Low |
| 4 | Lead admin view | Medium (ops visibility) | Medium |
| 5 | Analytics verification | Medium (data) | Low |

Recommend implementing 2 + 3 first (low effort, high impact), then 1 (the differentiator), then 4 + 5.

