

# Partnership-Ready Audit: What to Adjust for Driven Properties Standard

After reviewing the full codebase against what Driven Properties, Houza, and PropertyFinder deliver, here are the gaps grouped by priority. The security issues are now resolved — this focuses purely on business, compliance, and UX readiness.

---

## Batch 1 — Blockers (Must-fix before any partnership conversation)

### 1. Add WhatsApp Floating Button Globally
The `WhatsAppButton` component is built and fully functional but **never rendered**. It needs to be added to `App.tsx` alongside `MobileTabBar`, and the sidebar variant added to `PropertyDetail.tsx`.

### 2. Add Phone Number + Click-to-Call
Zero phone numbers anywhere on the site. Need to:
- Add phone to **Footer** (new row with phone + email)
- Add phone to **Contact page** info sidebar
- Add a **"Call" button** to `MobileCTABar` alongside "Request Access"
- Pull phone from `tenant.phone` (already exists in the tenants table)

### 3. Add RERA/ORN License to Footer + About
Legally required in Dubai. The `tenants` table already has `regulatory_body` and `regulatory_number` columns. Display them in:
- Footer bottom bar (e.g., "RERA ORN: 12345")
- About page (compliance section)

### 4. Enhance Inquiry Form (InquiryForm.tsx)
Currently captures email + phone only. Upgrade to match `PropertyInquiryForm.tsx` which already has name, message, golden visa checkbox, and Zod validation. **Replace** the minimal `InquiryForm` on `PropertyDetail.tsx` with `PropertyInquiryForm`.

### 5. Add Property Specs (sqft, units, parking, RERA permit)
The `properties` table is missing critical columns. Add via migration:
- `size_sqft_from` (numeric)
- `size_sqft_to` (numeric)  
- `total_units` (integer)
- `parking_included` (boolean, default true)
- `service_charge_sqft` (numeric)
- `rera_permit_number` (text)
- `dld_number` (text)

Then add a structured "Property Details" specs grid to `PropertyDetail.tsx` showing these fields.

### 6. Reduce Properties Page Hero to 30vh
Currently 50-55vh. Buyers come to browse, not admire a hero. Reduce to ~30vh and ensure filters + first property card are above the fold.

---

## Batch 2 — High-Impact Improvements

### 7. Multi-CTA on Property Detail (Call / WhatsApp / Brochure)
Replace single "Request Access" with three clear actions:
- **WhatsApp** (sidebar variant, already built)
- **Call** (click-to-call using tenant phone)
- **Download Brochure** (already has `DocumentDownload` component)

### 8. Currency Switcher
Add AED/USD/EUR/GBP toggle in the Header. Store selection in `localStorage`. Apply through `TenantContext.formatPrice` with conversion rates (hardcoded or fetched).

### 9. Phone Country Code Selector
Add a country code dropdown prefix to phone inputs across `InquiryForm`, `Contact`, and `PropertyInquiryForm`. Use a simple select with top 10 country codes (UAE, UK, India, Pakistan, etc.).

### 10. Pagination on Properties Grid
Add "Show More" button loading 12 properties at a time, or proper pagination. Currently loads everything at once.

---

## Batch 3 — Polish & Completeness

### 11. Move Private Advisor CTA Higher on Homepage
Currently buried at position 12 of 12 sections. Move it after `ThemedCollections` (position 7-8).

### 12. Add Share Button to Property Cards
Add a share icon to `CleanPropertyCard` that triggers native share or copies link. WhatsApp sharing of listings is massive in Dubai.

### 13. Enhanced Calculator (DLD Fees + ROI Projection)
Add tabs: "Mortgage" (existing), "Total Cost" (DLD 4% + admin 0.25% + agent 2%), "Investment Returns" (5/10 year projection with appreciation slider).

### 14. Area Guides Index Page
Create `/areas` page listing all areas with avg price, property count, and thumbnail. Currently only individual area guide pages exist with no index.

---

## Implementation Order

I recommend implementing in this order across multiple sessions:

**Session 1** (Items 1, 2, 3, 4, 6): WhatsApp button, phone numbers, RERA display, inquiry form upgrade, hero reduction — all low effort, high impact.

**Session 2** (Item 5): Database migration for property specs + UI grid — medium effort, legally important.

**Session 3** (Items 7, 8, 9, 10): Multi-CTA, currency switcher, country codes, pagination — medium effort, conversion impact.

**Session 4** (Items 11-14): Homepage reorder, card sharing, calculator upgrade, area index — polish.

Want me to start with Session 1?

