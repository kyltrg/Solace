import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import LetterContent from "./LetterContent";

interface LetterPageProps {
  params: Promise<{ id: string }>;
}

export default async function LetterPage({ params }: LetterPageProps) {
  const { id } = await params;
  const letter = await prisma.letter.findUnique({ where: { id } });

  if (!letter) notFound();

  return (
    <main className="min-h-screen bg-[var(--reading-room)] px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/letters"
          className="group inline-flex items-center gap-2 text-sm text-[var(--sepia)] transition-colors duration-300 hover:text-[var(--ink)]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Back to Letters</span>
        </Link>

        <article className="vintage-paper relative mt-6 overflow-hidden rounded-[24px] px-8 py-10 md:px-16 md:py-14">
          <LetterContent letter={letter} />
        </article>
      </div>
    </main>
  );
}
