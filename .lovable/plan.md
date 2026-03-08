

# Menu Overlay — What Feels Off and How to Fix It

After reviewing the code, here are the issues:

## Problems

1. **Too many items at equal weight** — 8 nav items with no hierarchy. "Properties" and "How It Works" sit at the same visual level. Luxury sites group secondary items separately.
2. **Non-active items are nearly invisible** — `text-muted-foreground/30` (30% opacity) makes most items look broken/disabled rather than elegant.
3. **Bottom bar is cluttered** — Search, Currency, Shortlist, Sign In/Out, "Dubai, UAE", and "Get in touch →" all crammed into one row. Too many small elements competing.
4. **Mobile has no image panel** — On mobile the right image panel is hidden, leaving 8 faded text items floating on a blank white background. Feels empty and unfinished.
5. **Numbering adds noise** — The `01`–`08` numbering is a design cliché that doesn't serve navigation here.
6. **No entrance drama** — The overlay fades in (`opacity: 0→1`) but there's no slide or stagger that feels intentional. Luxury menus typically slide from the right or top.

## The Fix

**Split items into primary (5) and secondary (3):**
- Primary (large text): Properties, Developers, Intelligence, Private Advisor, Calculator
- Secondary (small text, grouped below): About, How It Works, Contact

**Visual changes:**
- Remove numbering (`01`–`08`)
- Change non-active opacity from 30% to 60% — readable but clearly not selected
- Add more vertical spacing between items (`py-4` instead of `py-2.5`)
- Slide-in animation from right instead of just fade

**Bottom bar cleanup:**
- Left side: Search + Currency (keep)
- Right side: Sign In/Sign Out only. Move "Get in touch" and "Dubai, UAE" out — the Contact link is already in the nav list

**Mobile improvements:**
- Show a subtle background image (the first nav item's image) at low opacity behind the nav list, so the screen doesn't feel empty
- Increase font size slightly on mobile for touch targets

## Files Changed

- `src/components/layout/MenuOverlay.tsx` — all changes in this single file

