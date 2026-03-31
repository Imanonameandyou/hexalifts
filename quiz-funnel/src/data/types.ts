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
      { name: "The Restart Protocol", description: "A 2-week re-entry plan built specifically for people coming back from a break. No punishment, no \u201Cstart from scratch.\u201D You pick up where your body actually is." },
      { name: "The Accountability Framework", description: "The exact system that replaces willpower: how to create external obligation when you don\u2019t have a gym buddy." },
      { name: "The Hexadrine Workout Program", description: "The 6-day Push/Pull/Legs program built for your level, with clear progression rules so you always know what to do next." },
      { name: "The \u201CWhy You Fall Off\u201D Breakdown", description: "A short read that explains the real mechanism behind the start-stop cycle. Once you understand it, you can\u2019t unsee it." },
    ],
  },
  ghost: {
    slug: "ghost",
    name: "The Ghost",
    oneLine: "You want it. You just can\u2019t make yourself walk through the door.",
    breakdown: [
      "You\u2019ve been \u201Cabout to start\u201D for longer than you want to admit. You\u2019ve watched the videos, saved the programs, told yourself Monday is the day. Monday comes. You find a reason to wait one more week.",
      "This isn\u2019t procrastination. It\u2019s fear \u2014 specifically, the fear of walking into a room full of people who already know what they\u2019re doing, and looking like you don\u2019t. The gym feels like enemy territory. Crowded with guys who already made it, and you\u2019d be the weakest, skinniest, most clueless person there.",
      "That fear is real. It\u2019s also the only thing standing between you and the physique you\u2019ve been picturing for months.",
      "The fix isn\u2019t confidence \u2014 you don\u2019t need to feel confident to walk in. The fix is knowing exactly what you\u2019re doing before you get there, so the gym stops being a mystery and starts being just a room with weights in it.",
      "When you know your program, you know your exercises, and you know what you\u2019re walking in to do \u2014 the fear doesn\u2019t disappear, but it stops being a good enough reason to stay home.",
    ],
    resources: [
      { name: "The First Day Guide", description: "Exactly what to do on your first session. Where to go, what to do, how to not look lost. Step by step." },
      { name: "The Gym Anxiety Breakdown", description: "Why the fear feels so real, why it\u2019s lying to you, and the one mindset shift that makes it smaller every single time you go." },
      { name: "The Hexadrine Beginner Program", description: "A no-guesswork workout structure. You\u2019ll never have to wonder what to do next or stand in the gym looking confused." },
      { name: "The Exercise Execution Guide", description: "How to actually perform every movement correctly, so you\u2019re not fumbling with form when you get there." },
    ],
  },
  loneWolf: {
    slug: "lone-wolf",
    name: "The Lone Wolf",
    oneLine: "You\u2019ve been showing up. You just haven\u2019t had a real plan.",
    breakdown: [
      "You\u2019re not the guy who quits. You show up. You put in the work. But you\u2019ve been doing it without a real structure \u2014 picking exercises you like, skipping ones you don\u2019t, piecing together a routine from five different YouTube videos that all say something slightly different.",
      "And the results have been... fine. Maybe some progress. But nothing like what you were expecting for the effort you\u2019re putting in.",
      "Here\u2019s what\u2019s actually happening: without a proper program, you\u2019re probably overtrained in some areas and undertrained in others. You\u2019re not hitting the right muscle groups at the right frequency. And you have no progressive overload system \u2014 no way to know when to add weight, when to change exercises, or whether you\u2019re actually moving forward.",
      "You don\u2019t need more motivation. You need a structure that tells you exactly what to do, in what order, with clear rules for when to push harder and when to back off. When you have that, the effort you\u2019re already putting in starts paying off the way it should.",
    ],
    resources: [
      { name: "The Hexadrine 6-Day Program", description: "Push/Pull/Legs with full exercise selection, set/rep ranges, and clear progressive overload rules. You\u2019ll always know exactly what to do and when to go harder." },
      { name: "The Principles of Exercise Execution", description: "A full breakdown of how to actually perform every movement for maximum muscle growth. The difference between spinning your wheels and making real progress." },
      { name: "The Muscle Group Frequency Guide", description: "How often to train each muscle group and why. No more guessing." },
      { name: "The Progressive Overload Tracker", description: "A simple way to track weight \u00D7 reps so you know when it\u2019s time to level up." },
    ],
  },
  burner: {
    slug: "burner",
    name: "The Burner",
    oneLine: "You go too hard. Then you pay for it. Then you quit.",
    breakdown: [
      "You\u2019re not the problem either. The approach is.",
      "When you start, you go all in. Full program, extra sessions, pushing to failure on everything because if some is good, more is better. And for a week or two \u2014 it works. You\u2019re sore, you\u2019re tired, you feel like you\u2019re making progress.",
      "Then your body gives out. Everything hurts. You\u2019re dragging yourself to the gym and getting nothing out of it. So you take a few days off, which turns into a week, which turns into starting completely over.",
      "Here\u2019s what\u2019s actually happening: you\u2019re burning out your central nervous system faster than your body can recover. Training to failure on everything, going too heavy too fast, not sleeping enough to recover \u2014 and then wondering why you fall apart every time.",
      "The guys who actually build the physique you want? They don\u2019t go harder than you. They go smarter. Controlled intensity, strategic failure, real recovery. That\u2019s how you keep training for months instead of burning bright for two weeks and disappearing.",
    ],
    resources: [
      { name: "The Fatigue Management Guide", description: "How your CNS actually works, why you keep burning out, and the exact intensity rules that let you train hard without destroying yourself." },
      { name: "The Hexadrine 6-Day Program", description: "Built with strategic failure points (not everything goes to failure \u2014 only the exercises where it actually matters). You\u2019ll push hard where it counts and recover where you need to." },
      { name: "The Principles of Exercise Execution", description: "How to get more out of less. Technique, tempo, and tension \u2014 the three things that make every set more effective than going heavier ever could." },
      { name: "The Recovery Protocol", description: "Sleep, nutrition basics, and deload timing. The unsexy stuff that\u2019s actually responsible for 50% of your results." },
    ],
  },
};
