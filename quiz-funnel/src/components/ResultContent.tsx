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
