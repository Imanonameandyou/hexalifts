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
