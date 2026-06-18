import { cookies } from "next/headers";
import Link from "next/link";
import ComposerForm from "./ComposerForm";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default async function ComposePage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("solace-user")?.value;

  return (
    <main className="min-h-screen bg-[var(--reading-room)] px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/letters"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-[var(--text)]/60 transition-colors hover:text-[var(--text)]"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Back to Letters</span>
        </Link>

        <ComposerForm user={user || ""} />
      </div>

      <ScrollToTop />
    </main>
  );
}
