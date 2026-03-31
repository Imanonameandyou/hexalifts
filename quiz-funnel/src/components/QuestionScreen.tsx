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
