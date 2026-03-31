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
