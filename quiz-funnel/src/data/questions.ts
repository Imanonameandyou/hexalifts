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
    text: "Be honest \u2014 what actually happens when you try to get consistent at the gym?",
    answers: [
      { label: "I start strong, then life gets in the way and I just... stop.", type: "restarter", points: 2 },
      { label: "I think about going constantly but I can never actually make myself walk in.", type: "ghost", points: 2 },
      { label: "I go whenever I feel like it. No real schedule, just vibes.", type: "loneWolf", points: 2 },
      { label: "I go hard for a week or two, then I'm too sore or burnt out to keep going.", type: "burner", points: 2 },
    ],
  },
  {
    id: 2,
    text: "What does the inside of your head sound like on a day you skip the gym?",
    answers: [
      { label: "\u201CI'll just go tomorrow. I already missed a few days so what's the point anyway.\u201D", type: "restarter", points: 2 },
      { label: "\u201CWhat if I do something wrong and everyone stares? I'll go when I know what I'm doing.\u201D", type: "ghost", points: 2 },
      { label: "\u201CI'm not really feeling it today. Maybe later.\u201D", type: "loneWolf", points: 2 },
      { label: "\u201CMy body is wrecked from last time. I need a break.\u201D", type: "burner", points: 2 },
    ],
  },
  {
    id: 3,
    text: "You find a new program online that looks good. What happens next?",
    answers: [
      { label: "I start it, stick with it for a few weeks, then quietly stop following it.", type: "restarter", points: 2 },
      { label: "I save it, read it a few times, tell myself I'll start Monday. Monday comes and goes.", type: "ghost", points: 2 },
      { label: "I take bits I like, skip the rest, and kind of do my own thing.", type: "loneWolf", points: 2 },
      { label: "I go all in immediately \u2014 full program, extra sets, extra days \u2014 then crash hard.", type: "burner", points: 2 },
    ],
  },
  {
    id: 4,
    text: "When you imagine yourself actually looking the way you want \u2014 what does that feel like?",
    answers: [
      { label: "Like finally becoming the person I always knew I could be, if I could just stay consistent.", type: "restarter", points: 1 },
      { label: "Like I'd finally stop feeling embarrassed when I take my shirt off or walk into a room.", type: "ghost", points: 1 },
      { label: "Like proof that I can actually do something hard without anyone holding my hand.", type: "loneWolf", points: 1 },
      { label: "Like all the effort actually meant something \u2014 not just a week of pain for nothing.", type: "burner", points: 1 },
    ],
  },
  {
    id: 5,
    text: "What's the most honest reason you haven't reached your goal yet?",
    answers: [
      { label: "I keep restarting. Every time I fall off, the restart feels impossible.", type: "restarter", points: 3 },
      { label: "I'm scared of looking stupid. The gym feels like it's for people who already know what they're doing.", type: "ghost", points: 3 },
      { label: "Nobody's told me what to actually do. I'm just guessing and hoping for the best.", type: "loneWolf", points: 3 },
      { label: "I always go too hard, burn out, and end up back at zero.", type: "burner", points: 3 },
    ],
  },
  {
    id: 6,
    text: "If you had one thing that would actually make this stick \u2014 what would it be?",
    answers: [
      { label: "Something that keeps me going even when motivation disappears.", type: "restarter", points: 2 },
      { label: "Someone to tell me I'm doing it right and that I'm not going to embarrass myself.", type: "ghost", points: 2 },
      { label: "A clear plan I can actually follow \u2014 not 50 options, just tell me exactly what to do.", type: "loneWolf", points: 2 },
      { label: "A smarter approach so I stop destroying myself and actually see results.", type: "burner", points: 2 },
    ],
  },
];
