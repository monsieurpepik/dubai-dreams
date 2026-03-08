

# Fix: Remove Custom Cursor + Redesign Header Controls

Two changes to eliminate cheap-feeling UI elements.

## 1. Remove Custom Cursor Entirely

The white dot following the mouse is a gimmick that undermines the luxury aesthetic. No elite product site (Airbnb, Stripe, Apple) uses a custom cursor. It adds visual noise and makes the site feel like a portfolio template.

**Action:** Remove `<CustomCursor />` from `App.tsx` and delete `src/components/ui/CustomCursor.tsx`. This restores the native cursor immediately.

## 2. Redesign Header Controls (Currency + Menu)

The current currency `<select>` dropdown and the pill-shaped "Menu" button look like generic UI kit components — they don't match the luxury design language.

**Redesign approach:**

- **Currency switcher:** Replace the native `<select>` with a minimal text button showing just the currency code (e.g., "AED"). On click, show a small popover with the 4 currency options styled as a clean list. Use Radix `Popover` (already installed). No borders, no dropdown arrow — just clean typography.

- **Menu button:** Keep the hamburger lines but remove the border/pill shape and the "Menu" text label. Make it a clean icon-only button — two horizontal lines, no background, no border. This is the Airbnb/Apple pattern: minimal, confident, doesn't need a label.

**Files to edit:**
1. `src/App.tsx` — remove `CustomCursor` import and usage
2. Delete `src/components/ui/CustomCursor.tsx`
3. `src/components/ui/CurrencySwitcher.tsx` — replace `<select>` with Radix Popover
4. `src/components/layout/Header.tsx` — simplify menu button to borderless icon-only

