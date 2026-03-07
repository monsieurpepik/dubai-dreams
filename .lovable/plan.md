

# Visual Standardization: Airbnb-Rounded, Premium 2026

## The Core Problem

The CSS variable `--radius: 0rem` (line 50 of `index.css`) was set intentionally for a sharp-edged Hermes aesthetic, but the codebase now has a mix of:
- Components using Tailwind's `rounded-lg` / `rounded-md` (which resolve to **0px** via the `--radius` variable)
- Components with hardcoded `rounded-xl`, `rounded-full` (which bypass the variable and render rounded)
- The `CleanPropertyCard` was updated to `rounded-xl` but `Card`, `Button`, `Input`, `Textarea`, `Select`, `Dialog`, `Toast` all still use `rounded-md` / `rounded-lg` which render as **sharp rectangles**

This creates visual inconsistency — some elements are rounded, others are sharp.

## The Fix: One Variable Change + Targeted Updates

### 1. Update `--radius` from `0rem` to `0.75rem` (12px)
This single change in `index.css` fixes `Card`, `Dialog`, `Toast`, `Alert`, `Select`, `Sidebar`, and all shadcn components at once. 12px = Airbnb's standard radius.

### 2. Update `Button` base class
Change `rounded-md` to `rounded-xl` in `buttonVariants` for the pill-like Airbnb button feel. Also update size variants that override with `rounded-md`.

### 3. Update `Input` and `Textarea`
Change `rounded-md` to `rounded-xl` for consistency with the rounded system.

### 4. Update custom CSS classes
- `.btn-primary`, `.btn-outline` in `index.css` — add `rounded-xl`
- `.card-premium` — add `rounded-xl`

### 5. Standardize section cards across the site
- `ExclusiveSelectionsSection`: image container `rounded-sm` → `rounded-xl`
- `TestimonialsSection`: blockquote cards — add `rounded-xl`
- `HeroSection`: floating property card `rounded-lg` → `rounded-2xl`
- `LatestInsightsSection`: article cards — add `rounded-xl`
- `PropertyFilters`: filter panel — add `rounded-xl`

### 6. Premium 2026 polish additions
- Add subtle `shadow-sm hover:shadow-md` transition to all interactive cards for depth
- Testimonial cards: add `rounded-2xl` for premium feel
- Hero floating card: `rounded-2xl` + slightly stronger glass effect
- "How It Works" step cards: wrap in subtle bordered `rounded-2xl` containers
- Search pill in header already `rounded-full` — keep
- Category bar pills: already good

## Files to Edit
1. `src/index.css` — `--radius` + `.btn-primary` + `.btn-outline` + `.card-premium`
2. `src/components/ui/button.tsx` — `rounded-md` → `rounded-xl`
3. `src/components/ui/input.tsx` — `rounded-md` → `rounded-xl`
4. `src/components/ui/textarea.tsx` — `rounded-md` → `rounded-xl`
5. `src/components/ui/card.tsx` — `rounded-lg` → `rounded-xl`
6. `src/components/ui/dialog.tsx` — `sm:rounded-lg` → `sm:rounded-2xl`
7. `src/components/sections/ExclusiveSelectionsSection.tsx` — `rounded-sm` → `rounded-xl`
8. `src/components/sections/TestimonialsSection.tsx` — add `rounded-2xl`
9. `src/components/sections/HeroSection.tsx` — `rounded-lg` → `rounded-2xl`
10. `src/components/sections/LatestInsightsSection.tsx` — add `rounded-xl` to article cards
11. `src/components/sections/HowItWorksMini.tsx` — wrap steps in rounded containers

All changes are purely visual — no logic or data changes.

