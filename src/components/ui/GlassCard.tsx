type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps): React.JSX.Element {
  return (
    <div
      className={`
        rounded-[2rem]
        border
        border-[var(--border)]
        bg-[var(--glass)]
        backdrop-blur-2xl
        shadow-[0_20px_60px_rgba(0,0,0,.25)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
