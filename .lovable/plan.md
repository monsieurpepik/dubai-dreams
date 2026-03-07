

# Real Estate Portal Audit — Driven Properties / Houza Standard

After reviewing every page and component, here is my feedback as someone running a brokerage who just paid 100K for this platform. These are the gaps that would stop me from going live.

---

## Critical Business Issues

### 1. No WhatsApp Floating Button on the Site
The `WhatsAppButton` component exists but is **never rendered anywhere** in the app. In Dubai real estate, WhatsApp is the #1 conversion channel. Every property page, every listing page, and the homepage should have the floating WhatsApp widget. This alone could be costing 30-40% of leads.

**Fix**: Add `<WhatsAppButton />` to the main layout (in `App.tsx` alongside `MobileTabBar`), and add the sidebar variant on `PropertyDetail.tsx`.

### 2. No Phone Number / Click-to-Call Anywhere
Houza and Driven both have prominent phone numbers. This platform has zero phone numbers visible. Dubai buyers — especially from GCC, India, Pakistan — want to call. The Contact page shows email but no phone. The mobile CTA bar says "Request Access" but doesn't offer a call option.

**Fix**: Add phone number to Contact page, Footer, and PropertyDetail sidebar. Add a "Call" button alongside "Request Access" on `MobileCTABar`.

### 3. Property Detail Page Missing Critical Data
As a broker, I need these on every listing and they're missing:
- **Service charges** (AED/sqft)
- **Size in sqft** (not shown anywhere)
- **Total units in project**
- **Parking included**
- **DLD registration number**
- **RERA permit number**
These are legally required disclosures in Dubai and every competitor shows them.

**Fix**: Add a structured specs grid to `PropertyDetail.tsx` below the description. May require adding columns to the `properties` table.

### 4. No Currency Switcher
International buyers see AED only. Houza shows USD/EUR/GBP. A Driven Properties client from the UK or India can't quickly gauge value.

**Fix**: Add a currency toggle (AED/USD/EUR/GBP) in the Header or Footer, stored in `localStorage`, applied globally via the `useTenant` context.

---

## Lead Capture Problems

### 5. Inquiry Form is Too Minimal
The property inquiry form asks for email + phone only. No name field, no message field, no preferred contact method, no preferred language. Compare to Houza which captures name, email, phone, nationality, and message. We're leaving money on the table.

**Fix**: Add name (required), message (optional), and preferred contact method (WhatsApp/Email/Call) to `InquiryForm.tsx`.

### 6. No "Schedule a Viewing" or "Book a Call" CTA
The only CTA is "Request Access" which is vague. Buyers want concrete actions: "Schedule a Video Call", "Book a Site Visit", "Download Brochure". These are industry standard on Driven and every competitor.

**Fix**: Replace single CTA with a button group: "Schedule Call", "WhatsApp", "Download Brochure". Add a simple date/time picker for call scheduling.

### 7. Contact Form Has No Phone Number Field Label with Country Code
The phone field just says "+971 50 XXX XXXX" — no country code selector. International buyers will enter their local number without country code, making follow-up impossible.

**Fix**: Add a country code dropdown prefix to phone inputs across all forms.

---

## Content & Trust Gaps

### 8. No RERA Broker License Display
In Dubai, displaying your RERA broker registration number is **legally required**. It's nowhere on the site. This is a compliance issue that could get the brokerage fined.

**Fix**: Add RERA number to Footer, About page, and Contact page. Add an "ORN" (Office Registration Number) field to tenant config.

### 9. No Team / Agent Profiles Page
Driven Properties has individual agent pages. Houza shows agent profiles on listings. Buyers want to know who they're dealing with. This platform feels faceless.

**Fix**: Create an `/agents` page or add team member cards to the About page. Each property listing could show the assigned agent.

### 10. Calculator is Too Basic
Compared to competitors: no DLD fee calculation (4%), no service charge estimation, no comparison between off-plan payment plan vs mortgage, no ROI projection over time. The current calculator only does basic mortgage math.

**Fix**: Enhance Calculator with tabs: "Mortgage", "Total Cost" (including DLD 4% + admin fees + agent fees), and "Investment Returns" (ROI projection over 5/10 years with appreciation).

### 11. No Area Guide Landing Page
The footer links to `/area-guide/dubai-marina` etc. but there's no `/areas` index page listing all areas with descriptions, price ranges, and property counts. Houza has comprehensive area guides with maps.

**Fix**: Create an `/areas` index page with cards for each area showing avg price, property count, and a thumbnail.

---

## UX / Conversion Optimizations

### 12. Properties Page Hero Takes 55% of Viewport
The cinematic hero banner on `/properties` is beautiful but wastes 50-55vh before users see a single property. In real estate portals, users come to browse — they want properties immediately. Houza and PropertyFinder show filters + results above the fold.

**Fix**: Reduce Properties page hero to 30vh or replace with a compact header bar. Move filters inline above the grid.

### 13. No Pagination or Infinite Scroll
The properties grid loads everything at once. With 50+ properties this will be slow. No pagination, no "Load More", no infinite scroll.

**Fix**: Add pagination (12 per page) or infinite scroll with a "Show More" button.

### 14. Homepage is Too Long
The homepage has 12+ sections. Most users never scroll past section 4-5. The Private Advisor CTA is buried at the bottom where nobody sees it.

**Fix**: Consider consolidating. Move the Advisor CTA higher (after ThemedCollections). Remove or merge redundant sections.

### 15. No Social Sharing on Property Cards
Users can share from the detail page but not directly from listing cards or the properties grid. In real estate, WhatsApp sharing of listings is massive.

**Fix**: Add a share icon to `CleanPropertyCard` that copies the link or opens native share.

---

## Summary — Priority Implementation Order

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 1 | Add WhatsApp floating button globally | High | Low |
| 2 | Add phone numbers + click-to-call | High | Low |
| 8 | Add RERA license number to Footer/About | High (legal) | Low |
| 5 | Enhance inquiry form fields | High | Low |
| 3 | Add property specs (sqft, units, parking) | High | Medium |
| 12 | Reduce Properties page hero height | Medium | Low |
| 6 | Multi-CTA buttons (Call/WhatsApp/Brochure) | High | Medium |
| 4 | Currency switcher | Medium | Medium |
| 10 | Enhance Calculator with DLD fees + ROI | Medium | Medium |
| 7 | Phone country code selector | Medium | Low |
| 13 | Add pagination to properties grid | Medium | Medium |
| 11 | Create area guides index page | Medium | Medium |
| 14 | Move Advisor CTA higher on homepage | Low | Low |
| 9 | Team/agent profiles | Low | High |
| 15 | Share from property cards | Low | Low |

I recommend implementing items 1, 2, 8, 5, 3, and 12 first — they're the difference between a portfolio site and a working brokerage platform.

