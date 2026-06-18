"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type HeroButton = {
	href: string;
	label: string;
	variant?: "solid" | "ghost";
};

type PageHeroProps = {
	eyebrow: string;
	title: string;
	subtitle: string;
	description: string;
	buttons?: HeroButton[];
};

export default function PageHero({
	eyebrow,
	title,
	subtitle,
	description,
	buttons,
}: PageHeroProps) {
	return (
		<section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)]">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,var(--accent-soft),transparent_46%)]" />
				<div className="absolute left-[-6rem] top-24 h-80 w-80 rounded-full bg-[var(--accent)]/10 blur-3xl" />
				<div className="absolute right-[-5rem] top-10 h-72 w-72 rounded-full bg-[var(--glass)] blur-3xl" />
				<div className="absolute inset-0 bg-[linear-gradient(180deg,var(--glass),transparent_28%,rgba(0,0,0,0.16))]" />
			</div>

			<div className="relative mx-auto flex min-h-[88svh] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
				<div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
					<motion.div
						initial={{ opacity: 0, y: 26 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
						className="max-w-3xl"
					>
						<p className="text-[0.72rem] uppercase tracking-[0.42em] text-[var(--muted)]">
							{eyebrow}
						</p>
						<h1 className="mt-5 font-display text-[clamp(3.6rem,8vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.07em] text-[var(--text)]">
							{title}
						</h1>
						<p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
							{subtitle}
						</p>
						<p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]/70 sm:text-base">
							{description}
						</p>

						{buttons && buttons.length > 0 ? (
							<div className="mt-8 flex flex-wrap gap-3">
								{buttons.map((button) => (
									<Link
										key={button.href}
										href={button.href}
										className={
											button.variant === "solid"
												? "rounded-full bg-[var(--text)] px-5 py-3 text-sm font-medium text-[var(--bg)] transition hover:opacity-90"
												: "rounded-full border border-[var(--border)] bg-[var(--glass)] px-5 py-3 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)]"
										}
									>
										{button.label}
									</Link>
								))}
							</div>
						) : null}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
						className="relative hidden lg:block"
					>
						<div className="absolute inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_center,var(--accent-soft),transparent_58%)] blur-3xl" />
						<div className="relative aspect-[4/5] rounded-[2.2rem] border border-[var(--border)] bg-[var(--bg-soft)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.32)]">
							<div className="absolute inset-4 rounded-[1.6rem] border border-[var(--accent)]/10 bg-[linear-gradient(180deg,var(--glass),transparent)]" />
							<div className="absolute inset-x-0 top-4 flex justify-center">
								<div className="h-7 w-40 rounded-b-full border-x border-b border-[var(--accent)]/12 bg-[var(--glass)]" />
							</div>
							<div className="absolute inset-8 rounded-[1.3rem] border border-[var(--accent)]/18 bg-[radial-gradient(circle_at_top,rgba(216,196,176,0.35),transparent_34%),linear-gradient(180deg,var(--bg-elevated),var(--bg-soft)_58%,var(--bg))]">
							</div>
							<div className="absolute left-1/2 top-[15%] h-[70%] w-[1rem] -translate-x-1/2 rounded-full bg-[var(--accent)]/18" />
							<div className="absolute left-[calc(50%+3.2rem)] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[var(--accent)]/55 bg-[var(--accent)] shadow-[0_0_0_9px_var(--accent-soft)]" />
							<div className="absolute bottom-4 left-1/2 w-[76%] -translate-x-1/2 rounded-[1rem] border border-[var(--border)] bg-[var(--glass)] px-4 py-3 text-center backdrop-blur-sm">
								<p className="text-[0.68rem] uppercase tracking-[0.35em] text-[var(--muted)]">
									{eyebrow}
								</p>
								<p className="mt-1 text-sm text-[var(--text)]">
									{title}
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
