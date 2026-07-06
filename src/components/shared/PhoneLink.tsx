"use client";

import { trackEvent } from "@/lib/analytics";

interface PhoneLinkProps {
  href: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}

export function PhoneLink({ href, source, className, children }: PhoneLinkProps) {
  return (
    <a
      href={href}
      onClick={() => trackEvent({ name: "phone_clicked", source })}
      className={className}
    >
      {children}
    </a>
  );
}
