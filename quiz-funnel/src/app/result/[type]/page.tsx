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

export function generateStaticParams() {
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
