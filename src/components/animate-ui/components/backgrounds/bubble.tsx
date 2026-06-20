'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type BubbleColors = {
  first: string;
  second: string;
  third: string;
  fourth: string;
};

type BubbleBackgroundProps = React.ComponentProps<'div'> & {
  colors?: BubbleColors;
};

function BubbleBackground({
  ref,
  className,
  children,
  colors = {
    first: '168,141,114',
    second: '212,165,93',
    third: '91,40,52',
    fourth: '182,139,76',
  },
  ...props
}: BubbleBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      className={cn(
        'relative w-full overflow-hidden bg-gradient-to-br from-violet-900 to-blue-900',
        className,
      )}
      {...props}
    >
      <style>
        {`
          :root {
            --b1: ${colors.first};
            --b2: ${colors.second};
            --b3: ${colors.third};
            --b4: ${colors.fourth};
          }
          @keyframes bubble-float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-40px) scale(1.05); }
          }
          @keyframes bubble-drift {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes bubble-shift {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(60px); }
          }
        `}
      </style>

      <div className="absolute inset-0" style={{ filter: 'blur(60px)' }}>
        <div
          className="absolute rounded-full size-[50%] top-[5%] left-[5%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--b1),0.6)_0%,rgba(var(--b1),0)_50%)]"
          style={{ animation: 'bubble-float 18s ease-in-out infinite' }}
        />

        <div
          className="absolute inset-0 flex justify-center items-center origin-[calc(50%-300px)]"
          style={{ animation: 'bubble-drift 25s linear infinite' }}
        >
          <div className="rounded-full size-[40%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--b2),0.5)_0%,rgba(var(--b2),0)_50%)]" />
        </div>

        <div
          className="absolute inset-0 flex justify-center items-center origin-[calc(50%+300px)]"
          style={{ animation: 'bubble-drift 35s linear infinite reverse' }}
        >
          <div className="absolute rounded-full size-[40%] bg-[radial-gradient(circle_at_center,rgba(var(--b3),0.45)_0%,rgba(var(--b3),0)_50%)] mix-blend-hard-light top-[calc(50%+100px)] left-[calc(50%-400px)]" />
        </div>

        <div
          className="absolute rounded-full size-[45%] bottom-[15%] right-[10%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--b4),0.35)_0%,rgba(var(--b4),0)_50%)] opacity-70"
          style={{ animation: 'bubble-shift 22s ease-in-out infinite' }}
        />
      </div>

      {children}
    </div>
  );
}

export { BubbleBackground, type BubbleBackgroundProps };
