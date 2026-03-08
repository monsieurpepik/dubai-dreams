

# Trim Homepage & Routes for MVP

## Homepage (`src/pages/Index.tsx`)

**Keep** (6 sections + chrome):
- `Header`, `SEO`
- `HeroSection`
- `DealFinderBanner`
- `ExclusiveSelectionsSection`
- `RecentlyAddedSection`
- `PrivateAdvisorSection`
- `Footer`, `BackToTop`, `HomeMobileCTA`

**Remove** (9 sections):
- `TrustBar`, `EditorialStatement`, `HowItWorksMini`, `WhyDubaiStrip`, `MarketPulseSection`, `ThemedCollections`, `TrustedDevelopersStrip`, `TestimonialsSection`, `LatestInsightsSection`, `HomeSEOContent`

## Routes (`src/App.tsx`)

**Keep** (MVP core — 10 routes):
| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/properties` | Listings |
| `/properties/:slug` | Detail + conversion |
| `/discover` | Deal Finder (differentiator) |
| `/calculator` | Mortgage calculator |
| `/contact` | Lead capture |
| `/auth` | Login/signup |
| `/saved` | Saved properties (protected) |
| `/privacy`, `/terms` | Legal (required) |
| `*` | 404 |

**Remove** (13 routes):
- `/about`, `/how-it-works` — low-value standalone pages
- `/compare` — nice-to-have, not MVP
- `/areas`, `/areas/:slug` — content pages, defer
- `/insights`, `/insights/:slug` — blog, defer
- `/advisor` — fold into PrivateAdvisor CTA on homepage
- `/developers`, `/developers/:slug` — B2B, defer
- `/market` — data page, defer
- `/developer/*` (login, dashboard, properties, leads, settings) — entire B2B portal, defer

Also remove their imports and the `DeveloperProvider` context wrapper (no longer needed without developer routes).

## Header/Footer/MobileTabBar

Will need to audit nav links to remove references to deferred pages. Quick scan needed before implementation to ensure no broken links remain.

## Summary

- **Index.tsx**: Strip from 15 sections to 6
- **App.tsx**: Strip from ~23 routes to 10, remove ~13 unused imports
- **Nav cleanup**: Remove links to deferred pages from Header, Footer, MobileTabBar

