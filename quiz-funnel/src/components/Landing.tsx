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
