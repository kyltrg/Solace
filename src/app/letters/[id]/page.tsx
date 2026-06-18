import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import LetterContent from "./LetterContent";
import LetterReaderWrapper from "./LetterReaderWrapper";

interface LetterPageProps {
  params: Promise<{ id: string }>;
}

export default async function LetterPage({ params }: LetterPageProps) {
  const { id } = await params;
  const letter = await prisma.letter.findUnique({ where: { id } });

  if (!letter) notFound();

  return (
    <LetterReaderWrapper>
      <main className="min-h-screen bg-[var(--reading-room)] px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/letters"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-[var(--text)]/60 transition-colors hover:text-[var(--text)]"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span>Back to Letters</span>
          </Link>

          <article className="vintage-paper rounded-[24px] px-8 py-12 md:px-14 md:py-16">
            <LetterContent letter={letter} />
          </article>
        </div>
      </main>
    </LetterReaderWrapper>
  );
}
