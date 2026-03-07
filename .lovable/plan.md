

# Two Sections to Add from Reference Image

The reference shows two patterns we can adopt and adapt for our real estate context:

## 1. Elevated Developers Logo Strip
The current `TrustedDevelopersStrip` is functional but understated. The reference shows a bolder treatment:
- Larger heading: "TRUSTED DEVELOPERS" in uppercase serif, centered
- Logos displayed larger with more spacing, in a single horizontal row
- Clean black background instead of the current subtle `secondary/50`
- No "View all" link — just the logos as a trust signal

**Changes to `TrustedDevelopersStrip.tsx`**: Restyle with dark background (`bg-foreground`), larger serif heading, bigger logos with more generous spacing, and a more impactful visual presence.

## 2. "Private Property Advisor" Split Section (New)
The "Personal Shopper" pattern maps perfectly to our lead capture strategy. A new section with:
- **Left half**: Dark accent background with a form — heading "PRIVATE PROPERTY ADVISOR", subtitle about curated selections, fields for Full Name and Email (side by side), investment interest checkboxes (Off-Plan, Ready, Golden Visa, Rental Yield), optional message textarea, and a CTA button "Start Your Personalized Search"
- **Right half**: Full-bleed cinematic Dubai skyline image
- Split 50/50 layout on desktop, stacked on mobile

This replaces or supplements the existing `WhyOwningDubaiSection` or sits above the footer as a strong lead capture CTA.

**New file**: `src/components/sections/PrivateAdvisorSection.tsx`
**Modified**: `src/pages/Index.tsx` — add the new section before the footer, and keep the updated developers strip.

### Data
- Form submits to the existing `leads` table with `source: 'private_advisor'`
- Checkboxes stored in `quiz_responses` JSON field
- Triggers the existing `send-lead-notification` edge function

