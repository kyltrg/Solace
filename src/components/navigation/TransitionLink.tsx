"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

export default function TransitionLink({ href, children, className, ...props }: ComponentProps<typeof Link>) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("solace-loading"));
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
