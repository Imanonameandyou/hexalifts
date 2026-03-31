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
