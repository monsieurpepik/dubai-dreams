

# Elevating the Entire Site to Match the New Hero Aesthetic

The new hero and Exclusive Selections carousel set a strong visual benchmark — cinematic imagery, glassmorphic overlays, left-aligned serif headlines, and rich visual density. The rest of the site currently feels lighter and more utilitarian by comparison. Here's a phased plan to unify everything.

---

## Phase 1: Properties Listing Page

**Current state**: Functional but plain — text header, simple grid, standard filters.

**Changes**:
- Add a full-width cinematic hero banner at the top (Dubai skyline or featured property image) with a dark gradient overlay, the page title ("Off-Plan Projects") and property count rendered over it — similar to the homepage hero but shorter (50vh)
- Glassmorphic filter bar overlaid at the bottom of the hero (replacing the current plain toolbar)
- Property cards already match; the page frame just needs the visual upgrade

---

## Phase 2: Property Detail Page

**Current state**: Gallery + content blocks, functional but editorial-magazine feel is missing.

**Changes**:
- Make the gallery section full-bleed (edge-to-edge) with a taller aspect ratio
- Add a glassmorphic floating info card (price, developer, bedrooms, handover) overlaid on the gallery — mirroring the hero's floating card pattern
- Sticky sidebar inquiry form gets a subtle glass treatment
- Section dividers become more cinematic (thin lines, more whitespace)

---

## Phase 3: Developers Index Page

**Current state**: Grid of bordered cards with logos and stats.

**Changes**:
- Add a cinematic hero section with a banner image and overlay text
- Replace bordered cards with image-forward cards: each developer gets a large background image (their `banner_image_url`) with glassmorphic overlay showing name, stats, and CTA — same visual language as the Exclusive Selections carousel cards
- Hover reveals full card with scale effect

---

## Phase 4: Developer Profile Page

**Current state**: Already has banner + markdown. Decent but can be elevated.

**Changes**:
- Make the banner full-bleed with the developer name and metadata overlaid (glassmorphic)
- Add a horizontal scrolling carousel of the developer's properties (same style as Exclusive Selections) below the stats

---

## Phase 5: Insights / Intelligence Page

**Current state**: Clean grid with category tabs. Functional.

**Changes**:
- Featured article becomes a full-width cinematic card with image and glassmorphic text overlay (like the hero floating card, but wider)
- Article grid cards get image-forward treatment with hover scale effects
- Category tabs get a more refined underline treatment

---

## Phase 6: About, Contact, How It Works, Calculator

**Current state**: Text-heavy pages with minimal visual interest.

**Changes**:
- **About**: Add a full-bleed hero image (Dubai cityscape) with headline overlay. Content sections get more breathing room and editorial photography between sections
- **Contact**: Hero section gets a cinematic background image with the form overlaid in a glassmorphic card
- **How It Works**: Timeline icons get larger, the hero becomes cinematic with a background image. Steps get subtle glass card treatments
- **Calculator**: Add a cinematic hero header. The calculator UI stays functional but gets housed in a glassmorphic card

---

## Phase 7: Footer

**Current state**: Minimal link clusters — fine but could be elevated.

**Changes**:
- Add a large serif brand statement above the links ("The intelligent way to invest in Dubai real estate")
- Slightly more visual weight with a subtle background treatment

---

## Implementation Strategy

This is a large scope. I recommend tackling it in **3 batches**:

1. **Batch 1** (highest impact): Properties listing + Property detail + Developers index — these are the most-visited pages
2. **Batch 2**: Insights + Developer profile + About
3. **Batch 3**: Contact + How It Works + Calculator + Footer

Each batch would be 1-2 messages. The pattern is consistent across all pages: cinematic hero images with dark gradients, glassmorphic floating cards, left-aligned serif headlines, generous whitespace, and hover scale effects on image cards.

### Files Modified Per Batch
- **Batch 1**: `Properties.tsx`, `PropertyDetail.tsx`, `Developers.tsx`
- **Batch 2**: `Insights.tsx`, `DeveloperProfile.tsx`, `About.tsx`
- **Batch 3**: `Contact.tsx`, `HowItWorks.tsx`, `Calculator.tsx`, `Footer.tsx`

