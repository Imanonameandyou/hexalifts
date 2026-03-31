# Hexadrine Quiz Funnel — Design Spec

## Overview

A 6-question quiz funnel that categorizes users into 1 of 4 "gym bro types" based on their failure pattern. Each type gets a personalized result page with a teaser, an email gate, and a free resource stack revealed after email capture.

**Stack:** Next.js (App Router) → Vercel. Email via Klaviyo (list management + transactional flow). No database — scoring is client-side.

**Brand system:** Hexadrine brand guidelines (DM Serif Display + Barlow/Barlow Condensed, `#0A0A0A` background, `#C8352A` red accent, `#F0EDE6` chalk white text). Raw over polished. Anti-influencer. Editorial tension.

---

## Architecture

### Approach: Hybrid SPA + Server Result Page

The landing page and quiz (questions 1–6 + loading + teaser + email gate) live as a single client-side SPA flow on `/`. After email capture, redirect to `/result/[type]` — a server-rendered page with full breakdown, shareable URL, and SEO.

### Pages

| Route | Type | Purpose |
|---|---|---|
| `/` | Client SPA | Landing + quiz flow (all steps) |
| `/result/[type]` | Server-rendered (static) | Full result breakdown + resources + Pablo CTA |
| `/api/capture-email` | API route | Klaviyo profile creation + event trigger |

### Client-Side State Machine

```
landing → q1 → q2 → q3 → q4 → q5 → q6 → loading → teaser → redirect
```

State object:

```ts
type QuizState = {
  step: "landing" | "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "loading" | "teaser";
  scores: { restarter: number; ghost: number; loneWolf: number; burner: number };
  resultType: "restarter" | "ghost" | "loneWolf" | "burner" | null;
}
```

### Data Flow

1. User clicks "Find out →" on landing — step moves to `q1`
2. Each answer tap adds points to the corresponding type, advances to next question
3. After Q6 — step moves to `loading`, 2.5s timer, scores tallied, `resultType` set
4. Step moves to `teaser` — type name, one-liner, blurred content, email gate
5. Email submit → POST `/api/capture-email` with `{ email, resultType }`
6. API route: create/update Klaviyo profile, add to list, trigger `"Quiz Completed"` event
7. On success → `router.push(/result/${resultType})`

---

## Scoring Logic

Each question has 4 options, each mapping to one type with a point value:

| Question | Points | Weight |
|---|---|---|
| Q1 | +2 per type | Standard diagnostic |
| Q2 | +2 per type | Standard diagnostic |
| Q3 | +2 per type | Standard diagnostic |
| Q4 | +1 per type | Emotional/soft signal |
| Q5 | +3 per type | Heaviest diagnostic |
| Q6 | +2 per type | Standard diagnostic |

**Max possible per type:** 12 points (2+2+2+1+3+2)

**Tiebreak priority:** restarter > ghost > loneWolf > burner

The type with the highest total score wins. Implementation: find the key with max value in the scores object; on tie, iterate in priority order and return the first max.

---

## The 6 Questions

All copy is verbatim from the spec. Each question appears on its own screen with a progress bar. One answer per question, large tap-friendly cards.

### Q1: "Be honest — what actually happens when you try to get consistent at the gym?"
- A: "I start strong, then life gets in the way and I just... stop." → Restarter +2
- B: "I think about going constantly but I can never actually make myself walk in." → Ghost +2
- C: "I go whenever I feel like it. No real schedule, just vibes." → Lone Wolf +2
- D: "I go hard for a week or two, then I'm too sore or burnt out to keep going." → Burner +2

### Q2: "What does the inside of your head sound like on a day you skip the gym?"
- A: "I'll just go tomorrow. I already missed a few days so what's the point anyway." → Restarter +2
- B: "What if I do something wrong and everyone stares? I'll go when I know what I'm doing." → Ghost +2
- C: "I'm not really feeling it today. Maybe later." → Lone Wolf +2
- D: "My body is wrecked from last time. I need a break." → Burner +2

### Q3: "You find a new program online that looks good. What happens next?"
- A: "I start it, stick with it for a few weeks, then quietly stop following it." → Restarter +2
- B: "I save it, read it a few times, tell myself I'll start Monday. Monday comes and goes." → Ghost +2
- C: "I take bits I like, skip the rest, and kind of do my own thing." → Lone Wolf +2
- D: "I go all in immediately — full program, extra sets, extra days — then crash hard." → Burner +2

### Q4: "When you imagine yourself actually looking the way you want — what does that feel like?"
- A: "Like finally becoming the person I always knew I could be, if I could just stay consistent." → Restarter +1
- B: "Like I'd finally stop feeling embarrassed when I take my shirt off or walk into a room." → Ghost +1
- C: "Like proof that I can actually do something hard without anyone holding my hand." → Lone Wolf +1
- D: "Like all the effort actually meant something — not just a week of pain for nothing." → Burner +1

### Q5: "What's the most honest reason you haven't reached your goal yet?"
- A: "I keep restarting. Every time I fall off, the restart feels impossible." → Restarter +3
- B: "I'm scared of looking stupid. The gym feels like it's for people who already know what they're doing." → Ghost +3
- C: "Nobody's told me what to actually do. I'm just guessing and hoping for the best." → Lone Wolf +3
- D: "I always go too hard, burn out, and end up back at zero." → Burner +3

### Q6: "If you had one thing that would actually make this stick — what would it be?"
- A: "Something that keeps me going even when motivation disappears." → Restarter +2
- B: "Someone to tell me I'm doing it right and that I'm not going to embarrass myself." → Ghost +2
- C: "A clear plan I can actually follow — not 50 options, just tell me exactly what to do." → Lone Wolf +2
- D: "A smarter approach so I stop destroying myself and actually see results." → Burner +2

---

## Quiz UI & Interactions

### Progress Bar
- 3px bar at top of quiz area: `#C8352A` fill on `#2A2A28` track
- Shows current question / 6, animates width on each transition
- Not visible on landing, loading, or teaser screens

### Question Screen
- Question text: DM Serif Display italic, emotional/editorial
- 4 answer cards: full-width, stacked vertically
- Card surface: `#1E1E1C`, border `0.5px solid #2A2A28`
- Card label text: Barlow Condensed
- On tap: red left border (`#C8352A`), 200ms pause, slide to next question
- Hover: border shifts to `#55534E`, subtle lift
- Focus-visible: red outline for keyboard accessibility

### Transitions
- Slide-left: current question exits left, next enters from right
- 200ms duration, spring-style easing
- CSS `transform: translateX()` + `opacity` only (no `transition-all`)

### Loading Screen
- "Figuring you out..." in DM Serif Display italic, centered
- Pulse animation: opacity 0.5 → 1, looping
- 2.5s hold, auto-advance to teaser

### Teaser Screen
- Type badge: Barlow Condensed uppercase, red background
- Type name: DM Serif Display, large
- One-line description: Barlow italic, `#888680`
- First 1–2 sentences visible, rest blurred: `filter: blur(4px)` + `user-select: none`
- Gradient overlay: transparent → `#0A0A0A` over blurred area
- Email input: `#1E1E1C` bg, `#2A2A28` border, red focus state
- Button: "Unlock my results →", `.btn-primary` styling

### Mobile
- Answer cards full-width, minimum 56px height
- Spacing follows brand tokens: 16px, 24px, 40px, 80px
- Headline scales with `clamp()`

---

## Landing Page

### Layout
Single viewport, vertically centered content:

1. **Wordmark** — Top left, Hex*a*drine in DM Serif Display
2. **Eyebrow** — Barlow Condensed uppercase, `#55534E`: "6 QUESTIONS · 90 SECONDS · FREE"
3. **Headline** — DM Serif Display, `clamp(36px, 6vw, 56px)`: "Why do you keep falling off — and what actually fixes it?"
4. **Subheadline** — Barlow body, `#888680`, max-width 540px: "6 questions. We'll tell you exactly what's getting in your way and give you the free resources to fix it. No BS, no email required upfront."
5. **CTA** — "Find out →", `.btn-primary`
6. **Micro text** — 12px, `#55534E`: "Takes 90 seconds. Results are free."

### Atmosphere
- Full `#0A0A0A` background
- Subtle vertical rule lines on left/right edges (brand cover style)
- No images, no gradients, no noise — raw and clean

### Load Animation
- Staggered fade-in: eyebrow (0ms) → headline (100ms) → subheadline (200ms) → button (300ms)
- `opacity` + `translateY(12px)`, spring easing

---

## Result Page (`/result/[type]`)

### URL Structure
`/result/restarter`, `/result/ghost`, `/result/lone-wolf`, `/result/burner`

### Layout — Single Column, Long Scroll

1. **Header** — Sticky nav with Hex*a*drine wordmark, links back to `/`
2. **Type hero** — "YOUR TYPE" red badge, large type name (DM Serif Display), one-line description
3. **Full breakdown** — First sentence in DM Serif Display italic (pull-quote), rest in Barlow body. Line-height 1.7, max-width ~640px
4. **Resource stack** — "YOUR FREE RESOURCES" section label (Barlow Condensed uppercase). Each resource as a card:
   - Resource name: DM Serif Display
   - Description: Barlow body
   - "Coming soon" ghost button (placeholder, links to `#`)
5. **Pablo CTA** — Divider, then short intro ("I'm Pablo. I built Hexadrine because I was you..."), soft CTA button for waitlist
6. **Footer** — Wordmark + minimal text

### Content Per Type

All 4 types fully specified in the original spec with:
- One-line teaser
- Full multi-paragraph breakdown
- 4 resources each with name + description

Types: The Restarter, The Ghost, The Lone Wolf, The Burner

### Static Generation
All 4 result pages can be statically generated at build time — no dynamic data needed. The `[type]` param maps to static content.

---

## API & Klaviyo Integration

### Endpoint: `POST /api/capture-email`

**Request:**
```json
{ "email": "string", "resultType": "restarter | ghost | loneWolf | burner" }
```

**Server-side logic:**
1. Validate email format
2. Create/update Klaviyo profile with:
   - Email address
   - `quiz_result_type` custom property
   - `quiz_completed_at` ISO timestamp
3. Add profile to "Quiz Completions" list
4. Trigger `"Quiz Completed"` event with `resultType` property (kicks off Klaviyo flow)
5. Return `{ success: true }` or `{ error: "message" }`

**Response:**
- `200` — success
- `400` — invalid email or missing fields
- `500` — Klaviyo API failure

### Environment Variables
- `KLAVIYO_API_KEY` — private key, server-side only

### Client-Side Error Handling
- On failure: inline error text below input ("Something went wrong. Try again.")
- On persistent failure (3+ retries): show a "Skip and see your results" link that redirects to `/result/[type]` without email capture — don't strand the user behind a broken gate

### Klaviyo Setup (Manual)
- Create "Quiz Completions" list
- Create Flow triggered by `"Quiz Completed"` metric
- 4 conditional email templates branching on `quiz_result_type`
- Email content: full type breakdown + resource stack + Pablo sign-off

---

## Email Template Content

**Subject:** Here's your Hexadrine result, [first name]

**Body structure:**
1. Type name + full breakdown (verbatim from spec)
2. Resource stack with descriptions
3. Pablo sign-off intro ("I'm Pablo. I built Hexadrine because I was you...")
4. Soft CTA about upcoming product

All 4 type variants are fully written in the original spec.

---

## Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Stack | Next.js (App Router) → Vercel | Supports both SPA and server rendering, API routes for Klaviyo |
| Architecture | Hybrid SPA + server result page | Smooth quiz UX + shareable/SEO-friendly results |
| Email provider | Klaviyo for everything | Single system for list management + transactional flows |
| Resource links | Placeholder ("coming soon") | Assets not ready yet, structure built for plug-in later |
| Post-result CTA | Soft Pablo intro + waitlist | Non-aggressive, brand-aligned, builds anticipation |
| Visual direction | Hexadrine brand guidelines | Full design system provided: dark, raw, editorial, red accent |
