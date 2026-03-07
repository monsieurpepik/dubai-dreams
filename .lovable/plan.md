

# Priority Features: Insights Hub, Content Structure & AI Lead Qualification

## Priority Assessment

Three features ranked by impact on the "Bloomberg Terminal of Off-Plan Real Estate" vision:

1. **Market Insights / Blog** — highest trust signal; positions OwningDubai as an authority, drives organic SEO, gives reasons to return weekly
2. **AI Lead Qualification Bot** — replaces the current static quiz with an intelligent conversational agent that qualifies buyers before they ever speak to a human
3. **Structural additions** — developer portfolio pages, area deep-dives, and a private investor dashboard round out the platform

---

## 1. Market Insights (Blog / Editorial)

Not a "blog" — an **Intelligence Briefing** section. Think Bloomberg Terminal meets Monocle magazine.

### Content Types
- **Weekly Market Pulse** — 3-paragraph summary of Dubai off-plan market moves (price shifts, new launches, regulatory changes)
- **Project Deep Dives** — long-form editorial on a single project (why it exists, who it's for, honest risk assessment)
- **Area Intelligence** — neighborhood analysis with data overlays (price per sqft trends, upcoming infrastructure)
- **Investor Playbooks** — educational pieces (Golden Visa mechanics, payment plan strategies, off-plan vs ready comparison)

### Database
New `articles` table:
- `id`, `slug`, `title`, `subtitle`, `content` (markdown), `excerpt`, `cover_image_url`
- `category` enum: `market_pulse`, `project_analysis`, `area_intelligence`, `investor_playbook`
- `author_name`, `author_role`
- `published_at`, `is_featured`, `reading_time_min`
- `related_property_ids` (jsonb array — link articles to projects)
- `seo_title`, `seo_description`

### Pages
- `/insights` — index page with featured article hero + category tabs + paginated grid
- `/insights/:slug` — article detail with editorial typography, related properties sidebar, and "Request Private Brief" CTA at the bottom

### Homepage Integration
Add a "Latest Intelligence" row on the homepage showing the 2-3 most recent articles in a minimal card format (date + title + category pill).

---

## 2. AI Lead Qualification Bot

Replace the static 3-step quiz with an intelligent conversational agent. The bot asks smart follow-up questions based on answers, qualifies the buyer's intent and budget, and produces a structured lead profile saved to the `leads` table.

### How It Works
- Edge function `qualify-lead` calls Lovable AI (gemini-3-flash-preview) with a system prompt that acts as a private investment advisor
- The bot asks 4-6 contextual questions: investor type, budget range, timeline, preferred areas, yield vs capital growth, residency interest
- Based on answers, it generates a brief "Investment Profile Summary" and recommended projects
- The conversation is streamed token-by-token to the UI
- At the end, the bot asks for email to send the full brief — this captures the lead

### UI
- Accessible from a "Find Your Match" CTA on homepage and nav menu
- Full-screen conversational interface (not a chatbot widget — a dedicated page at `/advisor`)
- Messages rendered with markdown, calm typography, no avatars or chat bubbles — more like a private messaging experience
- The bot's personality: knowledgeable, understated, never pushy

### Backend
- Edge function with LOVABLE_API_KEY (already available)
- System prompt includes current property data context (fetched from DB at conversation start)
- Structured output via tool calling to extract: `budget_range`, `investor_type`, `preferred_areas`, `timeline`, `risk_tolerance`
- On completion, inserts into `leads` table with `source: 'ai_advisor'` and full conversation in `quiz_responses`

---

## 3. Additional Structural Pages

### Developer Portfolio Pages (`/developers/:slug`)
- Hero with developer logo + description
- Stats: years active, total projects, projects on OwningDubai
- Grid of their properties (filtered from existing `properties` table via `developer_id`)
- Already have the `developers` table with `slug`, `description`, `years_active`, `total_projects`

### Enhanced Area Guides (`/areas/:slug`)
- The route exists but could be enriched with market data from `area_market_data` table
- Add: price trend chart (recharts, already installed), comparable areas, properties in this area

### Private Investor Dashboard (future, post-MVP)
- Saved properties, saved searches, document requests — all in one place
- Requires auth — defer this until core content is solid

---

## Implementation Plan (Ordered by Priority)

### Phase 1: Market Insights
1. Create `articles` table via migration
2. Build `/insights` index page with category filtering and pagination
3. Build `/insights/:slug` detail page with editorial layout
4. Add "Latest Intelligence" section to homepage
5. Add "Insights" to navigation

### Phase 2: AI Lead Qualification
1. Create `qualify-lead` edge function with Lovable AI streaming
2. Build `/advisor` page with conversational UI
3. Wire lead capture at conversation end
4. Replace "Discover" quiz link with "Private Advisor" in nav

### Phase 3: Developer Pages
1. Build `/developers/:slug` page using existing `developers` table
2. Link from property cards and detail pages (already partially done)

### Estimated Scope
- **Phase 1**: 1 migration + 4 new files + 2 edits
- **Phase 2**: 1 edge function + 2 new files + 1 edit
- **Phase 3**: 1 new file + 1 edit

No new dependencies required. All features use existing stack (react-query, framer-motion, recharts, Lovable AI).

