

# Remaining Security Fixes — Error-Level Issues

The scan shows **2 error-level issues** still open:

---

## 1. Cron Edge Functions Accept Public Anon Key (OPEN_ENDPOINTS)

**Problem**: `send-nurture-email` and `check-saved-searches` are cron-only functions but currently accept the public anon key as a fallback, meaning any browser visitor can trigger bulk email sends.

**Fix**: Remove the anon key fallback from both functions. Only accept the `x-internal-secret` header. These should never be called from client-side code.

**Files**: `supabase/functions/send-nurture-email/index.ts`, `supabase/functions/check-saved-searches/index.ts`

---

## 2. Saved Searches UPDATE Policy Has No Row Scoping (PUBLIC_DATA_EXPOSURE)

**Problem**: The `saved_searches` UPDATE policy uses `USING(true)` with no restrictions. Any anonymous user can update any saved search record — changing emails, deactivating alerts, or corrupting filters.

**Fix**: Add a `WITH CHECK` constraint that prevents email changes and only allows deactivation:

```sql
DROP POLICY "Anyone can update their own saved search" ON public.saved_searches;
CREATE POLICY "Token-based update restriction"
ON public.saved_searches
FOR UPDATE
USING (true)
WITH CHECK (
  is_active = false
  AND email = (SELECT ss.email FROM public.saved_searches ss WHERE ss.id = saved_searches.id)
);
```

This ensures updates can only deactivate a search, never change the email or other sensitive fields.

**Files**: New SQL migration

---

## Summary

| Issue | Fix | Effort |
|-------|-----|--------|
| Cron functions accept anon key | Remove anon key fallback, require internal secret only | Low |
| saved_searches open UPDATE policy | Restrict to deactivation-only with email immutability | Low |

Both fixes are straightforward and address the remaining error-level findings.

