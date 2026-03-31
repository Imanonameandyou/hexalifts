# Hexadrine Quiz Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 6-question quiz funnel that categorizes users into 1 of 4 gym bro types, gates the full result behind email capture via Klaviyo, and reveals a personalized result page.

**Architecture:** Hybrid SPA + server-rendered result pages. The landing and quiz flow (`/`) are a single client-side React state machine. After email capture, users redirect to `/result/[type]` — a statically generated page with the full breakdown. A single API route `/api/capture-email` handles Klaviyo integration.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Klaviyo API v3

**Spec:** `docs/superpowers/specs/2026-03-30-quiz-funnel-design.md`

**Brand guidelines:** `brand_assets/hexadrine-brand-guidelines.html` — colors, typography, components, voice

---

## File Structure

```
quiz-funnel/                          ← Next.js project root
├── .env.local                        ← KLAVIYO_API_KEY (gitignored)
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts                ← Brand color tokens, font config
├── src/
│   ├── app/
│   │   ├── layout.tsx                ← Root layout: fonts, metadata, global styles
│   │   ├── globals.css               ← Tailwind directives + brand CSS variables
│   │   ├── page.tsx                  ← Landing + quiz SPA (client component)
│   │   ├── result/
│   │   │   └── [type]/
│   │   │       └── page.tsx          ← Static result page (server component)
│   │   └── api/
│   │       └── capture-email/
│   │           └── route.ts          ← Klaviyo API route
│   ├── components/
│   │   ├── Wordmark.tsx              ← Hex<em>a</em>drine wordmark
│   │   ├── Landing.tsx               ← Landing screen (hero + CTA)
│   │   ├── ProgressBar.tsx           ← Quiz progress bar (1-6)
│   │   ├── QuestionScreen.tsx        ← Single question + answer cards
│   │   ├── LoadingScreen.tsx         ← "Figuring you out..." screen
│   │   ├── TeaserScreen.tsx          ← Teaser + blurred content + email gate
│   │   ├── ResultContent.tsx         ← Full result breakdown (used in result page)
│   │   └── ResourceCard.tsx          ← Individual resource card
│   ├── data/
│   │   ├── questions.ts              ← All 6 questions + answer options + scores
│   │   └── types.ts                  ← All 4 type definitions (copy, resources)
│   └── lib/
│       ├── scoring.ts                ← Score tallying + tiebreak logic
│       └── klaviyo.ts                ← Klaviyo API client functions
```

---

### Task 1: Next.js Project Scaffold + Tailwind Brand Config

**Files:**
- Create: `quiz-funnel/package.json`
- Create: `quiz-funnel/tsconfig.json`
- Create: `quiz-funnel/next.config.ts`
- Create: `quiz-funnel/tailwind.config.ts`
- Create: `quiz-funnel/.gitignore`
- Create: `quiz-funnel/src/app/layout.tsx`
- Create: `quiz-funnel/src/app/globals.css`
- Create: `quiz-funnel/src/app/page.tsx`

- [ ] **Step 1: Create the Next.js project**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
npx create-next-app@latest quiz-funnel --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

Expected: Project scaffolded at `quiz-funnel/` with App Router and Tailwind.

- [ ] **Step 2: Configure Tailwind with brand tokens**

Replace `quiz-funnel/tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0A",
        concrete: "#141412",
        steel: "#1E1E1C",
        iron: "#2A2A28",
        ash: "#55534E",
        "chalk-muted": "#888680",
        chalk: "#C8C4BC",
        white: "#F0EDE6",
        red: "#C8352A",
        "red-dark": "#9E2318",
        "red-muted": "#6B1B12",
        green: "#4A7C59",
        amber: "#B87D22",
      },
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        cond: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Barlow'", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        md: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Set up globals.css with brand foundations**

Replace `quiz-funnel/src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    background: #0A0A0A;
    color: #C8C4BC;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: #C8352A;
    color: #F0EDE6;
  }
}
```

- [ ] **Step 4: Set up root layout with fonts**

Replace `quiz-funnel/src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

const barlowCond = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cond",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Hexadrine — Why do you keep falling off?",
  description:
    "6 questions. We'll tell you exactly what's getting in your way and give you the free resources to fix it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${barlowCond.variable} ${barlow.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Create a placeholder home page**

Replace `quiz-funnel/src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-display text-4xl text-white">
        Hex<em className="italic text-red">a</em>drine
      </h1>
    </main>
  );
}
```

- [ ] **Step 6: Verify the dev server runs**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts/quiz-funnel
npm run dev
```

Expected: Dev server starts at `http://localhost:3000`. Page shows "Hexadrine" wordmark with red italic "a" on black background. Fonts load correctly (DM Serif Display for the heading).

- [ ] **Step 7: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/
git commit -m "feat: scaffold Next.js project with brand Tailwind config"
```

---

### Task 2: Quiz Data — Questions + Type Definitions

**Files:**
- Create: `quiz-funnel/src/data/questions.ts`
- Create: `quiz-funnel/src/data/types.ts`

- [ ] **Step 1: Create the questions data file**

Create `quiz-funnel/src/data/questions.ts`:

```ts
export type ResultType = "restarter" | "ghost" | "loneWolf" | "burner";

export type Answer = {
  label: string;
  type: ResultType;
  points: number;
};

export type Question = {
  id: number;
  text: string;
  answers: Answer[];
};

export const questions: Question[] = [
  {
    id: 1,
    text: "Be honest — what actually happens when you try to get consistent at the gym?",
    answers: [
      {
        label:
          "I start strong, then life gets in the way and I just... stop.",
        type: "restarter",
        points: 2,
      },
      {
        label:
          "I think about going constantly but I can never actually make myself walk in.",
        type: "ghost",
        points: 2,
      },
      {
        label:
          "I go whenever I feel like it. No real schedule, just vibes.",
        type: "loneWolf",
        points: 2,
      },
      {
        label:
          "I go hard for a week or two, then I'm too sore or burnt out to keep going.",
        type: "burner",
        points: 2,
      },
    ],
  },
  {
    id: 2,
    text: "What does the inside of your head sound like on a day you skip the gym?",
    answers: [
      {
        label:
          "\u201CI'll just go tomorrow. I already missed a few days so what's the point anyway.\u201D",
        type: "restarter",
        points: 2,
      },
      {
        label:
          "\u201CWhat if I do something wrong and everyone stares? I'll go when I know what I'm doing.\u201D",
        type: "ghost",
        points: 2,
      },
      {
        label:
          "\u201CI'm not really feeling it today. Maybe later.\u201D",
        type: "loneWolf",
        points: 2,
      },
      {
        label:
          "\u201CMy body is wrecked from last time. I need a break.\u201D",
        type: "burner",
        points: 2,
      },
    ],
  },
  {
    id: 3,
    text: "You find a new program online that looks good. What happens next?",
    answers: [
      {
        label:
          "I start it, stick with it for a few weeks, then quietly stop following it.",
        type: "restarter",
        points: 2,
      },
      {
        label:
          "I save it, read it a few times, tell myself I'll start Monday. Monday comes and goes.",
        type: "ghost",
        points: 2,
      },
      {
        label:
          "I take bits I like, skip the rest, and kind of do my own thing.",
        type: "loneWolf",
        points: 2,
      },
      {
        label:
          "I go all in immediately \u2014 full program, extra sets, extra days \u2014 then crash hard.",
        type: "burner",
        points: 2,
      },
    ],
  },
  {
    id: 4,
    text: "When you imagine yourself actually looking the way you want \u2014 what does that feel like?",
    answers: [
      {
        label:
          "Like finally becoming the person I always knew I could be, if I could just stay consistent.",
        type: "restarter",
        points: 1,
      },
      {
        label:
          "Like I'd finally stop feeling embarrassed when I take my shirt off or walk into a room.",
        type: "ghost",
        points: 1,
      },
      {
        label:
          "Like proof that I can actually do something hard without anyone holding my hand.",
        type: "loneWolf",
        points: 1,
      },
      {
        label:
          "Like all the effort actually meant something \u2014 not just a week of pain for nothing.",
        type: "burner",
        points: 1,
      },
    ],
  },
  {
    id: 5,
    text: "What's the most honest reason you haven't reached your goal yet?",
    answers: [
      {
        label:
          "I keep restarting. Every time I fall off, the restart feels impossible.",
        type: "restarter",
        points: 3,
      },
      {
        label:
          "I'm scared of looking stupid. The gym feels like it's for people who already know what they're doing.",
        type: "ghost",
        points: 3,
      },
      {
        label:
          "Nobody's told me what to actually do. I'm just guessing and hoping for the best.",
        type: "loneWolf",
        points: 3,
      },
      {
        label:
          "I always go too hard, burn out, and end up back at zero.",
        type: "burner",
        points: 3,
      },
    ],
  },
  {
    id: 6,
    text: "If you had one thing that would actually make this stick \u2014 what would it be?",
    answers: [
      {
        label:
          "Something that keeps me going even when motivation disappears.",
        type: "restarter",
        points: 2,
      },
      {
        label:
          "Someone to tell me I'm doing it right and that I'm not going to embarrass myself.",
        type: "ghost",
        points: 2,
      },
      {
        label:
          "A clear plan I can actually follow \u2014 not 50 options, just tell me exactly what to do.",
        type: "loneWolf",
        points: 2,
      },
      {
        label:
          "A smarter approach so I stop destroying myself and actually see results.",
        type: "burner",
        points: 2,
      },
    ],
  },
];
```

- [ ] **Step 2: Create the type definitions data file**

Create `quiz-funnel/src/data/types.ts`:

```ts
import { ResultType } from "./questions";

export type Resource = {
  name: string;
  description: string;
};

export type TypeDefinition = {
  slug: string;
  name: string;
  oneLine: string;
  breakdown: string[];
  resources: Resource[];
};

export const typeDefinitions: Record<ResultType, TypeDefinition> = {
  restarter: {
    slug: "restarter",
    name: "The Restarter",
    oneLine: "You\u2019re not the problem. The cycle is.",
    breakdown: [
      "You\u2019ve started over more times than you can count. And every single time, you came back with the same hope \u2014 this time it\u2019ll stick. It doesn\u2019t. Not because you\u2019re lazy, not because you don\u2019t want it bad enough, but because you\u2019ve been doing it completely alone.",
      "Here\u2019s the thing nobody tells you: the human brain isn\u2019t built to sustain hard things in isolation. Willpower runs out. Motivation disappears. The only thing that actually keeps you showing up is something external \u2014 a system, a person, an obligation. Without that, falling off isn\u2019t weakness. It\u2019s just physics.",
      "Every time you\u2019ve had a gym buddy waiting for you, you showed up. Every time you had nothing waiting \u2014 you didn\u2019t. That\u2019s not a character flaw. That\u2019s how it works for everyone.",
      "The cycle ends when you stop relying on motivation and start relying on a system that makes not showing up feel worse than showing up.",
      "You\u2019re not a quitter. You\u2019re a returner who finally knows what was missing.",
    ],
    resources: [
      {
        name: "The Restart Protocol",
        description:
          "A 2-week re-entry plan built specifically for people coming back from a break. No punishment, no \u201Cstart from scratch.\u201D You pick up where your body actually is.",
      },
      {
        name: "The Accountability Framework",
        description:
          "The exact system that replaces willpower: how to create external obligation when you don\u2019t have a gym buddy.",
      },
      {
        name: "The Hexadrine Workout Program",
        description:
          "The 6-day Push/Pull/Legs program built for your level, with clear progression rules so you always know what to do next.",
      },
      {
        name: "The \u201CWhy You Fall Off\u201D Breakdown",
        description:
          "A short read that explains the real mechanism behind the start-stop cycle. Once you understand it, you can\u2019t unsee it.",
      },
    ],
  },
  ghost: {
    slug: "ghost",
    name: "The Ghost",
    oneLine:
      "You want it. You just can\u2019t make yourself walk through the door.",
    breakdown: [
      "You\u2019ve been \u201Cabout to start\u201D for longer than you want to admit. You\u2019ve watched the videos, saved the programs, told yourself Monday is the day. Monday comes. You find a reason to wait one more week.",
      "This isn\u2019t procrastination. It\u2019s fear \u2014 specifically, the fear of walking into a room full of people who already know what they\u2019re doing, and looking like you don\u2019t. The gym feels like enemy territory. Crowded with guys who already made it, and you\u2019d be the weakest, skinniest, most clueless person there.",
      "That fear is real. It\u2019s also the only thing standing between you and the physique you\u2019ve been picturing for months.",
      "The fix isn\u2019t confidence \u2014 you don\u2019t need to feel confident to walk in. The fix is knowing exactly what you\u2019re doing before you get there, so the gym stops being a mystery and starts being just a room with weights in it.",
      "When you know your program, you know your exercises, and you know what you\u2019re walking in to do \u2014 the fear doesn\u2019t disappear, but it stops being a good enough reason to stay home.",
    ],
    resources: [
      {
        name: "The First Day Guide",
        description:
          "Exactly what to do on your first session. Where to go, what to do, how to not look lost. Step by step.",
      },
      {
        name: "The Gym Anxiety Breakdown",
        description:
          "Why the fear feels so real, why it\u2019s lying to you, and the one mindset shift that makes it smaller every single time you go.",
      },
      {
        name: "The Hexadrine Beginner Program",
        description:
          "A no-guesswork workout structure. You\u2019ll never have to wonder what to do next or stand in the gym looking confused.",
      },
      {
        name: "The Exercise Execution Guide",
        description:
          "How to actually perform every movement correctly, so you\u2019re not fumbling with form when you get there.",
      },
    ],
  },
  loneWolf: {
    slug: "lone-wolf",
    name: "The Lone Wolf",
    oneLine:
      "You\u2019ve been showing up. You just haven\u2019t had a real plan.",
    breakdown: [
      "You\u2019re not the guy who quits. You show up. You put in the work. But you\u2019ve been doing it without a real structure \u2014 picking exercises you like, skipping ones you don\u2019t, piecing together a routine from five different YouTube videos that all say something slightly different.",
      "And the results have been... fine. Maybe some progress. But nothing like what you were expecting for the effort you\u2019re putting in.",
      "Here\u2019s what\u2019s actually happening: without a proper program, you\u2019re probably overtrained in some areas and undertrained in others. You\u2019re not hitting the right muscle groups at the right frequency. And you have no progressive overload system \u2014 no way to know when to add weight, when to change exercises, or whether you\u2019re actually moving forward.",
      "You don\u2019t need more motivation. You need a structure that tells you exactly what to do, in what order, with clear rules for when to push harder and when to back off. When you have that, the effort you\u2019re already putting in starts paying off the way it should.",
    ],
    resources: [
      {
        name: "The Hexadrine 6-Day Program",
        description:
          "Push/Pull/Legs with full exercise selection, set/rep ranges, and clear progressive overload rules. You\u2019ll always know exactly what to do and when to go harder.",
      },
      {
        name: "The Principles of Exercise Execution",
        description:
          "A full breakdown of how to actually perform every movement for maximum muscle growth. The difference between spinning your wheels and making real progress.",
      },
      {
        name: "The Muscle Group Frequency Guide",
        description:
          "How often to train each muscle group and why. No more guessing.",
      },
      {
        name: "The Progressive Overload Tracker",
        description:
          "A simple way to track weight \u00D7 reps so you know when it\u2019s time to level up.",
      },
    ],
  },
  burner: {
    slug: "burner",
    name: "The Burner",
    oneLine:
      "You go too hard. Then you pay for it. Then you quit.",
    breakdown: [
      "You\u2019re not the problem either. The approach is.",
      "When you start, you go all in. Full program, extra sessions, pushing to failure on everything because if some is good, more is better. And for a week or two \u2014 it works. You\u2019re sore, you\u2019re tired, you feel like you\u2019re making progress.",
      "Then your body gives out. Everything hurts. You\u2019re dragging yourself to the gym and getting nothing out of it. So you take a few days off, which turns into a week, which turns into starting completely over.",
      "Here\u2019s what\u2019s actually happening: you\u2019re burning out your central nervous system faster than your body can recover. Training to failure on everything, going too heavy too fast, not sleeping enough to recover \u2014 and then wondering why you fall apart every time.",
      "The guys who actually build the physique you want? They don\u2019t go harder than you. They go smarter. Controlled intensity, strategic failure, real recovery. That\u2019s how you keep training for months instead of burning bright for two weeks and disappearing.",
    ],
    resources: [
      {
        name: "The Fatigue Management Guide",
        description:
          "How your CNS actually works, why you keep burning out, and the exact intensity rules that let you train hard without destroying yourself.",
      },
      {
        name: "The Hexadrine 6-Day Program",
        description:
          "Built with strategic failure points (not everything goes to failure \u2014 only the exercises where it actually matters). You\u2019ll push hard where it counts and recover where you need to.",
      },
      {
        name: "The Principles of Exercise Execution",
        description:
          "How to get more out of less. Technique, tempo, and tension \u2014 the three things that make every set more effective than going heavier ever could.",
      },
      {
        name: "The Recovery Protocol",
        description:
          "Sleep, nutrition basics, and deload timing. The unsexy stuff that\u2019s actually responsible for 50% of your results.",
      },
    ],
  },
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts/quiz-funnel
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/data/
git commit -m "feat: add quiz questions and type definitions data"
```

---

### Task 3: Scoring Logic

**Files:**
- Create: `quiz-funnel/src/lib/scoring.ts`

- [ ] **Step 1: Create the scoring module**

Create `quiz-funnel/src/lib/scoring.ts`:

```ts
import { ResultType } from "@/data/questions";

export type Scores = Record<ResultType, number>;

const TIEBREAK_PRIORITY: ResultType[] = [
  "restarter",
  "ghost",
  "loneWolf",
  "burner",
];

export function createEmptyScores(): Scores {
  return { restarter: 0, ghost: 0, loneWolf: 0, burner: 0 };
}

export function addScore(
  scores: Scores,
  type: ResultType,
  points: number
): Scores {
  return { ...scores, [type]: scores[type] + points };
}

export function calculateResult(scores: Scores): ResultType {
  const maxScore = Math.max(...Object.values(scores));
  const winner = TIEBREAK_PRIORITY.find((type) => scores[type] === maxScore);
  return winner!;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts/quiz-funnel
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/lib/scoring.ts
git commit -m "feat: add scoring logic with tiebreak priority"
```

---

### Task 4: Wordmark Component

**Files:**
- Create: `quiz-funnel/src/components/Wordmark.tsx`

- [ ] **Step 1: Create the Wordmark component**

Create `quiz-funnel/src/components/Wordmark.tsx`:

```tsx
type WordmarkProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-[42px]",
};

export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  return (
    <span className={`font-display text-white leading-none tracking-tight ${sizes[size]} ${className}`}>
      Hex<em className="italic text-red">a</em>drine
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/components/Wordmark.tsx
git commit -m "feat: add Wordmark component"
```

---

### Task 5: Landing Screen Component

**Files:**
- Create: `quiz-funnel/src/components/Landing.tsx`

- [ ] **Step 1: Create the Landing component**

Create `quiz-funnel/src/components/Landing.tsx`:

```tsx
import Wordmark from "./Wordmark";

type LandingProps = {
  onStart: () => void;
};

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Vertical rule lines */}
      <div className="absolute top-0 left-6 md:left-12 w-px h-full bg-iron" />
      <div className="absolute top-0 right-6 md:right-12 w-px h-full bg-iron" />

      {/* Wordmark */}
      <header className="px-6 md:px-12 pt-6">
        <Wordmark size="md" />
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center">
        <p
          className="font-cond text-[11px] font-semibold tracking-[0.2em] uppercase text-ash mb-8 animate-fade-in"
          style={{ animationDelay: "0ms" }}
        >
          6 questions &middot; 90 seconds &middot; free
        </p>

        <h1
          className="font-display text-white leading-[1.05] tracking-tight max-w-[640px] mb-6 animate-fade-in"
          style={{
            fontSize: "clamp(36px, 6vw, 56px)",
            animationDelay: "100ms",
          }}
        >
          Why do you keep falling off &mdash; and what actually fixes it?
        </h1>

        <p
          className="font-body text-[15px] text-chalk-muted leading-[1.7] max-w-[540px] mb-10 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          6 questions. We&rsquo;ll tell you exactly what&rsquo;s getting in your
          way and give you the free resources to fix it. No BS, no email
          required upfront.
        </p>

        <button
          onClick={onStart}
          className="font-cond text-[13px] font-bold tracking-[0.12em] uppercase bg-red text-white px-6 py-3 rounded-sm hover:bg-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2 active:scale-[0.98] transition-colors duration-150 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          Find out &rarr;
        </button>

        <p
          className="font-body text-[12px] text-ash mt-4 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          Takes 90 seconds. Results are free.
        </p>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Add the fade-in animation to globals.css**

Append to `quiz-funnel/src/app/globals.css`:

```css
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/components/Landing.tsx quiz-funnel/src/app/globals.css
git commit -m "feat: add Landing component with staggered fade-in"
```

---

### Task 6: ProgressBar Component

**Files:**
- Create: `quiz-funnel/src/components/ProgressBar.tsx`

- [ ] **Step 1: Create the ProgressBar component**

Create `quiz-funnel/src/components/ProgressBar.tsx`:

```tsx
type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = (current / total) * 100;

  return (
    <div className="w-full h-[3px] bg-iron rounded-sm overflow-hidden">
      <div
        className="h-full bg-red rounded-sm transition-[width] duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/components/ProgressBar.tsx
git commit -m "feat: add ProgressBar component"
```

---

### Task 7: QuestionScreen Component

**Files:**
- Create: `quiz-funnel/src/components/QuestionScreen.tsx`

- [ ] **Step 1: Create the QuestionScreen component**

Create `quiz-funnel/src/components/QuestionScreen.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Question, Answer } from "@/data/questions";

type QuestionScreenProps = {
  question: Question;
  onAnswer: (answer: Answer) => void;
  direction: "enter" | "idle";
};

export default function QuestionScreen({
  question,
  onAnswer,
  direction,
}: QuestionScreenProps) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(answer: Answer, index: number) {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => onAnswer(answer), 200);
  }

  return (
    <div
      className={`w-full max-w-[640px] mx-auto px-6 ${
        direction === "enter" ? "animate-slide-in" : ""
      }`}
    >
      <h2 className="font-display italic text-white text-[clamp(22px,4vw,32px)] leading-[1.2] mb-10">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.answers.map((answer, i) => (
          <button
            key={i}
            onClick={() => handleSelect(answer, i)}
            disabled={selected !== null}
            className={`w-full text-left px-5 py-4 rounded-md border transition-colors duration-150 min-h-[56px]
              ${
                selected === i
                  ? "border-l-[3px] border-l-red border-t-iron border-r-iron border-b-iron bg-steel"
                  : "border-iron bg-steel hover:border-ash hover:bg-iron/50"
              }
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2
              disabled:cursor-default
            `}
          >
            <span className="font-cond text-[14px] font-semibold text-chalk leading-[1.5]">
              {answer.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add slide-in animation to globals.css**

Append to the `@layer utilities` block in `quiz-funnel/src/app/globals.css`:

```css
  .animate-slide-in {
    animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/components/QuestionScreen.tsx quiz-funnel/src/app/globals.css
git commit -m "feat: add QuestionScreen component with answer cards"
```

---

### Task 8: LoadingScreen Component

**Files:**
- Create: `quiz-funnel/src/components/LoadingScreen.tsx`

- [ ] **Step 1: Create the LoadingScreen component**

Create `quiz-funnel/src/components/LoadingScreen.tsx`:

```tsx
"use client";

import { useEffect } from "react";

type LoadingScreenProps = {
  onComplete: () => void;
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <p className="font-display italic text-white text-[clamp(28px,5vw,42px)] animate-pulse-slow">
        Figuring you out&hellip;
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Add pulse-slow animation to globals.css**

Append to the `@layer utilities` block in `quiz-funnel/src/app/globals.css`:

```css
  .animate-pulse-slow {
    animation: pulseSlow 2s ease-in-out infinite;
  }

  @keyframes pulseSlow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/components/LoadingScreen.tsx quiz-funnel/src/app/globals.css
git commit -m "feat: add LoadingScreen component with pulse animation"
```

---

### Task 9: TeaserScreen Component (Email Gate)

**Files:**
- Create: `quiz-funnel/src/components/TeaserScreen.tsx`

- [ ] **Step 1: Create the TeaserScreen component**

Create `quiz-funnel/src/components/TeaserScreen.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ResultType } from "@/data/questions";
import { typeDefinitions } from "@/data/types";

type TeaserScreenProps = {
  resultType: ResultType;
  onEmailSubmit: (email: string) => Promise<void>;
  onSkip: () => void;
};

export default function TeaserScreen({
  resultType,
  onEmailSubmit,
  onSkip,
}: TeaserScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const typeDef = typeDefinitions[resultType];
  const firstSentence = typeDef.breakdown[0];
  const blurredText = typeDef.breakdown.slice(1).join(" ");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      await onEmailSubmit(email);
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 animate-fade-in">
      <div className="w-full max-w-[540px] text-center">
        {/* Type badge */}
        <span className="inline-block font-cond text-[10px] font-bold tracking-[0.18em] uppercase bg-red text-white px-3 py-1 rounded-sm mb-6">
          Your type
        </span>

        {/* Type name */}
        <h1 className="font-display text-white text-[clamp(36px,6vw,52px)] leading-[1.05] tracking-tight mb-3">
          {typeDef.name}
        </h1>

        {/* One-liner */}
        <p className="font-display italic text-chalk-muted text-[18px] leading-[1.4] mb-10">
          {typeDef.oneLine}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-iron mb-8" />

        {/* Visible first sentence */}
        <p className="font-body text-[15px] text-chalk-muted leading-[1.7] text-left mb-4">
          {firstSentence}
        </p>

        {/* Blurred content */}
        <div className="relative mb-10">
          <p className="font-body text-[15px] text-chalk-muted leading-[1.7] text-left blur-[4px] select-none">
            {blurredText}
          </p>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-void pointer-events-none" />
        </div>

        {/* Email gate */}
        <div className="text-center">
          <h2 className="font-display text-white text-[24px] leading-[1.2] mb-2">
            Your full breakdown is ready.
          </h2>
          <p className="font-body text-[14px] text-chalk-muted leading-[1.6] mb-6 max-w-[420px] mx-auto">
            Enter your email and we&rsquo;ll unlock your complete results plus
            your free resource stack. Nothing paid. Nothing hidden. Just the real
            stuff.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[360px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full bg-steel border border-iron rounded-sm px-4 py-3 font-body text-[14px] text-chalk placeholder:text-ash outline-none focus:border-red transition-colors duration-150"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full font-cond text-[13px] font-bold tracking-[0.12em] uppercase bg-red text-white py-3 rounded-sm hover:bg-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2 active:scale-[0.98] transition-colors duration-150 disabled:opacity-50 disabled:cursor-wait"
            >
              {loading ? "Unlocking\u2026" : "Unlock my results \u2192"}
            </button>
          </form>

          {error && (
            <p className="font-body text-[13px] text-red mt-3">{error}</p>
          )}

          {attempts >= 3 && (
            <button
              onClick={onSkip}
              className="font-body text-[13px] text-ash underline mt-4 hover:text-chalk-muted transition-colors duration-150"
            >
              Skip and see your results
            </button>
          )}

          <p className="font-body text-[12px] text-ash mt-4">
            No spam. Unsubscribe anytime. Your results stay free.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/components/TeaserScreen.tsx
git commit -m "feat: add TeaserScreen with blurred content and email gate"
```

---

### Task 10: Wire Up the Quiz SPA (Home Page)

**Files:**
- Modify: `quiz-funnel/src/app/page.tsx`

- [ ] **Step 1: Replace the home page with the full quiz state machine**

Replace `quiz-funnel/src/app/page.tsx` with:

```tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions, Answer, ResultType } from "@/data/questions";
import { typeDefinitions } from "@/data/types";
import { createEmptyScores, addScore, calculateResult, Scores } from "@/lib/scoring";
import Landing from "@/components/Landing";
import ProgressBar from "@/components/ProgressBar";
import QuestionScreen from "@/components/QuestionScreen";
import LoadingScreen from "@/components/LoadingScreen";
import TeaserScreen from "@/components/TeaserScreen";
import Wordmark from "@/components/Wordmark";

type Step =
  | "landing"
  | "q1" | "q2" | "q3" | "q4" | "q5" | "q6"
  | "loading"
  | "teaser";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("landing");
  const [scores, setScores] = useState<Scores>(createEmptyScores);
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [questionKey, setQuestionKey] = useState(0);

  const questionSteps: Step[] = ["q1", "q2", "q3", "q4", "q5", "q6"];
  const currentQuestionIndex = questionSteps.indexOf(step);
  const isQuestionStep = currentQuestionIndex !== -1;

  function handleStart() {
    setStep("q1");
  }

  function handleAnswer(answer: Answer) {
    const newScores = addScore(scores, answer.type, answer.points);
    setScores(newScores);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questionSteps.length) {
      setQuestionKey((k) => k + 1);
      setStep(questionSteps[nextIndex]);
    } else {
      const result = calculateResult(newScores);
      setResultType(result);
      setStep("loading");
    }
  }

  const handleLoadingComplete = useCallback(() => {
    setStep("teaser");
  }, []);

  async function handleEmailSubmit(email: string) {
    const res = await fetch("/api/capture-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, resultType }),
    });

    if (!res.ok) {
      throw new Error("Failed to capture email");
    }

    const slug = typeDefinitions[resultType!].slug;
    router.push(`/result/${slug}`);
  }

  function handleSkip() {
    const slug = typeDefinitions[resultType!].slug;
    router.push(`/result/${slug}`);
  }

  if (step === "landing") {
    return <Landing onStart={handleStart} />;
  }

  if (step === "loading") {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (step === "teaser" && resultType) {
    return (
      <TeaserScreen
        resultType={resultType}
        onEmailSubmit={handleEmailSubmit}
        onSkip={handleSkip}
      />
    );
  }

  if (isQuestionStep) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 md:px-12 pt-6 pb-4">
          <Wordmark size="sm" />
        </header>

        {/* Progress */}
        <div className="px-6 md:px-12 mb-8">
          <ProgressBar current={currentQuestionIndex + 1} total={6} />
        </div>

        {/* Question */}
        <main className="flex-1 flex items-start justify-center pt-8 md:pt-16">
          <QuestionScreen
            key={questionKey}
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            direction="enter"
          />
        </main>
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 2: Verify the dev server runs and the quiz flow works**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts/quiz-funnel
npm run dev
```

Expected: Navigate through landing → all 6 questions → loading screen → teaser screen. The email submit will 404 (API route not built yet), which is expected.

- [ ] **Step 3: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/app/page.tsx
git commit -m "feat: wire up quiz SPA state machine on home page"
```

---

### Task 11: Klaviyo API Client + Email Capture Route

**Files:**
- Create: `quiz-funnel/src/lib/klaviyo.ts`
- Create: `quiz-funnel/src/app/api/capture-email/route.ts`
- Create: `quiz-funnel/.env.local`

- [ ] **Step 1: Create the Klaviyo client**

Create `quiz-funnel/src/lib/klaviyo.ts`:

```ts
const KLAVIYO_API_URL = "https://a.klaviyo.com/api";

function headers() {
  return {
    Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
    "Content-Type": "application/json",
    revision: "2024-10-15",
  };
}

export async function upsertProfile(
  email: string,
  quizResultType: string
): Promise<string> {
  const res = await fetch(`${KLAVIYO_API_URL}/profiles/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes: {
          email,
          properties: {
            quiz_result_type: quizResultType,
            quiz_completed_at: new Date().toISOString(),
          },
        },
      },
    }),
  });

  if (res.status === 409) {
    // Profile exists — update it
    const existing = await res.json();
    const profileId =
      existing.errors?.[0]?.meta?.duplicate_profile_id;

    if (profileId) {
      await fetch(`${KLAVIYO_API_URL}/profiles/${profileId}/`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({
          data: {
            type: "profile",
            id: profileId,
            attributes: {
              properties: {
                quiz_result_type: quizResultType,
                quiz_completed_at: new Date().toISOString(),
              },
            },
          },
        }),
      });
      return profileId;
    }
  }

  if (!res.ok) {
    throw new Error(`Klaviyo profile creation failed: ${res.status}`);
  }

  const data = await res.json();
  return data.data.id;
}

export async function addToList(
  profileId: string,
  listId: string
): Promise<void> {
  const res = await fetch(
    `${KLAVIYO_API_URL}/lists/${listId}/relationships/profiles/`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        data: [{ type: "profile", id: profileId }],
      }),
    }
  );

  if (!res.ok && res.status !== 204) {
    throw new Error(`Klaviyo add to list failed: ${res.status}`);
  }
}

export async function trackEvent(
  email: string,
  quizResultType: string
): Promise<void> {
  const res = await fetch(`${KLAVIYO_API_URL}/events/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          metric: {
            data: {
              type: "metric",
              attributes: { name: "Quiz Completed" },
            },
          },
          profile: {
            data: {
              type: "profile",
              attributes: { email },
            },
          },
          properties: {
            result_type: quizResultType,
          },
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Klaviyo event tracking failed: ${res.status}`);
  }
}
```

- [ ] **Step 2: Create the API route**

Create `quiz-funnel/src/app/api/capture-email/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { upsertProfile, addToList, trackEvent } from "@/lib/klaviyo";

const VALID_TYPES = ["restarter", "ghost", "loneWolf", "burner"];
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID || "";

export async function POST(req: NextRequest) {
  let body: { email?: string; resultType?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, resultType } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!resultType || !VALID_TYPES.includes(resultType)) {
    return NextResponse.json(
      { error: "Invalid result type" },
      { status: 400 }
    );
  }

  try {
    const profileId = await upsertProfile(email, resultType);

    if (KLAVIYO_LIST_ID) {
      await addToList(profileId, KLAVIYO_LIST_ID);
    }

    await trackEvent(email, resultType);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Klaviyo error:", err);
    return NextResponse.json(
      { error: "Email capture failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Create the .env.local file**

Create `quiz-funnel/.env.local`:

```
KLAVIYO_API_KEY=your-private-api-key-here
KLAVIYO_LIST_ID=your-list-id-here
```

- [ ] **Step 4: Ensure .env.local is in .gitignore**

Verify that `quiz-funnel/.gitignore` contains `.env*.local`. It should from `create-next-app`. If not, add it.

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts/quiz-funnel
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/lib/klaviyo.ts quiz-funnel/src/app/api/capture-email/route.ts
git commit -m "feat: add Klaviyo client and email capture API route"
```

---

### Task 12: ResourceCard Component

**Files:**
- Create: `quiz-funnel/src/components/ResourceCard.tsx`

- [ ] **Step 1: Create the ResourceCard component**

Create `quiz-funnel/src/components/ResourceCard.tsx`:

```tsx
import { Resource } from "@/data/types";

type ResourceCardProps = {
  resource: Resource;
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="bg-steel border border-iron rounded-lg p-6 md:p-7">
      <h3 className="font-display text-white text-[20px] leading-[1.2] mb-3">
        {resource.name}
      </h3>
      <p className="font-body text-[14px] text-chalk-muted leading-[1.7] mb-5">
        {resource.description}
      </p>
      <a
        href="#"
        className="inline-block font-cond text-[12px] font-bold tracking-[0.12em] uppercase text-chalk-muted border border-iron px-4 py-2 rounded-sm hover:border-ash hover:text-chalk transition-colors duration-150"
      >
        Coming soon
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/components/ResourceCard.tsx
git commit -m "feat: add ResourceCard component"
```

---

### Task 13: ResultContent Component

**Files:**
- Create: `quiz-funnel/src/components/ResultContent.tsx`

- [ ] **Step 1: Create the ResultContent component**

Create `quiz-funnel/src/components/ResultContent.tsx`:

```tsx
import { TypeDefinition } from "@/data/types";
import ResourceCard from "./ResourceCard";

type ResultContentProps = {
  typeDef: TypeDefinition;
};

export default function ResultContent({ typeDef }: ResultContentProps) {
  return (
    <div className="w-full max-w-[640px] mx-auto">
      {/* Type hero */}
      <div className="mb-12 md:mb-16">
        <span className="inline-block font-cond text-[10px] font-bold tracking-[0.18em] uppercase bg-red text-white px-3 py-1 rounded-sm mb-6">
          Your type
        </span>
        <h1 className="font-display text-white text-[clamp(40px,7vw,56px)] leading-[1.05] tracking-tight mb-4">
          {typeDef.name}
        </h1>
        <p className="font-display italic text-chalk-muted text-[18px] leading-[1.4]">
          {typeDef.oneLine}
        </p>
      </div>

      {/* Full breakdown */}
      <div className="mb-16 md:mb-20">
        {typeDef.breakdown.map((paragraph, i) => (
          <p
            key={i}
            className={`font-body text-[15px] leading-[1.7] mb-6 ${
              i === 0
                ? "font-display italic text-white text-[20px] leading-[1.4]"
                : "text-chalk-muted"
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Resource stack */}
      <div className="mb-16 md:mb-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-cond text-[10px] font-bold tracking-[0.22em] uppercase text-red whitespace-nowrap">
            Your free resources
          </span>
          <div className="flex-1 h-px bg-iron" />
        </div>

        <div className="flex flex-col gap-3">
          {typeDef.resources.map((resource, i) => (
            <ResourceCard key={i} resource={resource} />
          ))}
        </div>
      </div>

      {/* Pablo CTA */}
      <div className="border-t border-iron pt-12 md:pt-16 mb-16">
        <p className="font-body text-[15px] text-chalk-muted leading-[1.7] mb-6">
          I&rsquo;m Pablo. I built Hexadrine because I was you &mdash; started
          and stopped more times than I can count, fumbling alone with no real
          system. I figured out what actually works and I wanted to make sure it
          didn&rsquo;t stay locked behind a $200 coaching call.
        </p>
        <p className="font-body text-[15px] text-chalk-muted leading-[1.7] mb-6">
          Everything above is free. No catch.
        </p>
        <p className="font-body text-[15px] text-chalk-muted leading-[1.7] mb-8">
          If you want to go deeper, I&rsquo;m building something for people who
          are ready to actually lock in. I&rsquo;ll tell you about it when
          it&rsquo;s ready.
        </p>
        <button className="font-cond text-[13px] font-bold tracking-[0.12em] uppercase text-red border border-red px-6 py-3 rounded-sm hover:bg-red-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2 active:scale-[0.98] transition-colors duration-150">
          I&rsquo;m interested &mdash; keep me posted
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/components/ResultContent.tsx
git commit -m "feat: add ResultContent component with breakdown and resources"
```

---

### Task 14: Result Page (Server Component)

**Files:**
- Create: `quiz-funnel/src/app/result/[type]/page.tsx`

- [ ] **Step 1: Create the result page**

Create `quiz-funnel/src/app/result/[type]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ResultType } from "@/data/questions";
import { typeDefinitions } from "@/data/types";
import Wordmark from "@/components/Wordmark";
import ResultContent from "@/components/ResultContent";

const slugToType: Record<string, ResultType> = {
  restarter: "restarter",
  ghost: "ghost",
  "lone-wolf": "loneWolf",
  burner: "burner",
};

type Props = {
  params: Promise<{ type: string }>;
};

export async function generateStaticParams() {
  return Object.keys(slugToType).map((type) => ({ type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type: slug } = await params;
  const resultType = slugToType[slug];
  if (!resultType) return {};
  const typeDef = typeDefinitions[resultType];

  return {
    title: `You're ${typeDef.name} — Hexadrine`,
    description: typeDef.oneLine,
  };
}

export default async function ResultPage({ params }: Props) {
  const { type: slug } = await params;
  const resultType = slugToType[slug];

  if (!resultType) {
    notFound();
  }

  const typeDef = typeDefinitions[resultType];

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-void border-b border-iron">
        <div className="max-w-[880px] mx-auto flex items-center justify-between h-[52px] px-6 md:px-12">
          <a href="/">
            <Wordmark size="md" />
          </a>
          <a
            href="/"
            className="font-cond text-[11px] font-semibold tracking-[0.14em] uppercase text-ash hover:text-chalk transition-colors duration-150"
          >
            Retake quiz
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 md:px-12 py-16 md:py-20">
        <ResultContent typeDef={typeDef} />
      </main>

      {/* Footer */}
      <footer className="border-t border-iron px-6 md:px-12 py-12">
        <div className="max-w-[880px] mx-auto flex items-center justify-between">
          <Wordmark size="sm" />
          <span className="font-cond text-[10px] font-semibold tracking-[0.14em] uppercase text-ash">
            Stop starting over.
          </span>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify the result page renders**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts/quiz-funnel
npm run dev
```

Navigate to `http://localhost:3000/result/restarter`, `/result/ghost`, `/result/lone-wolf`, `/result/burner`. Each should render the full breakdown, resource stack, and Pablo CTA with correct brand styling.

- [ ] **Step 3: Commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add quiz-funnel/src/app/result/
git commit -m "feat: add static result pages for all 4 types"
```

---

### Task 15: Full Flow Smoke Test + Visual QA

**Files:** None (testing only)

- [ ] **Step 1: Start the dev server**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts/quiz-funnel
npm run dev
```

- [ ] **Step 2: Test the complete quiz flow**

Navigate to `http://localhost:3000`. Walk through:
1. Landing page loads with staggered animation
2. Click "Find out →" — transitions to Q1
3. Progress bar shows 1/6
4. Select answer — card highlights red, slides to Q2
5. Continue through Q3–Q6, progress bar advances
6. After Q6 — "Figuring you out..." loading screen appears
7. After 2.5s — teaser screen shows with type name, blurred content, email gate
8. Enter email, submit — will fail (no Klaviyo key), error appears
9. After 3 failed attempts — "Skip and see your results" link appears
10. Click skip — redirects to `/result/[type]`
11. Result page shows full breakdown, resources, Pablo CTA

- [ ] **Step 3: Test each result page directly**

Navigate to each URL and verify content renders:
- `http://localhost:3000/result/restarter`
- `http://localhost:3000/result/ghost`
- `http://localhost:3000/result/lone-wolf`
- `http://localhost:3000/result/burner`

- [ ] **Step 4: Test mobile responsiveness**

Use browser dev tools to test at 375px width. Verify:
- Answer cards are full-width and at least 56px tall
- Headlines scale properly with clamp()
- No horizontal overflow
- Touch targets are large enough

- [ ] **Step 5: Visual QA against brand guidelines**

Check:
- Fonts: DM Serif Display on headlines, Barlow Condensed on labels, Barlow on body
- Colors: `#0A0A0A` background, `#C8352A` red accent, `#F0EDE6` white text
- Spacing: Consistent brand tokens (16, 24, 40, 80px)
- Buttons: Red primary with uppercase condensed text, proper hover/focus states
- Progress bar: 3px height, red fill, smooth animation

- [ ] **Step 6: Build check**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts/quiz-funnel
npm run build
```

Expected: Build succeeds. All 4 result pages statically generated.

- [ ] **Step 7: Final commit**

```bash
cd c:/Users/jomat_nweuhlk/Desktop/Hexalifts
git add -A
git commit -m "feat: complete quiz funnel — all screens, scoring, email capture, result pages"
```
