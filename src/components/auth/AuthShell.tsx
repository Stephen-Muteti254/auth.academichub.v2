import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";

import logo from "@/assets/logo/mark-ac-dark.svg";
import { PORTALS } from "@/lib/destination";

interface AuthShellProps {
  children: ReactNode;
  /** Short tagline shown above the working card */
  panelTitle: string;
  panelSubtitle: string;
  panelPoints?: { title: string; description: string }[];
}

/**
 * Shared layout for every auth page: a single light, enterprise-grade
 * surface matching the public site — soft brand wash, centered card,
 * generous rounding. No split panels or heavy color blocks.
 */
export function AuthShell({
  children,
  panelTitle,
  panelSubtitle,
  panelPoints,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Subtle brand wash */}
      <div aria-hidden className="bg-hero-wash pointer-events-none absolute inset-0" />

      <header className="relative flex items-center justify-between px-5 py-5 sm:px-10">
        <a href={PORTALS.PUBLIC} className="flex items-center gap-2.5">
          <img src={logo} alt="AcademicHub" className="h-9 w-9" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            AcademicHub
          </span>
        </a>
        <a
          href={PORTALS.PUBLIC}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to main site
        </a>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-4 pt-4 pb-16 sm:pt-8">
        <div className="w-full max-w-xl">
          {/* Intro */}
          <div className="mb-8 space-y-2 text-center">
            <p className="text-sm font-semibold tracking-wide text-primary">
              {panelTitle}
            </p>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
              {panelSubtitle}
            </p>
          </div>

          {/* Working card */}
          <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-10">
            {children}
          </div>

          {/* Trust points */}
          {panelPoints && panelPoints.length > 0 && (
            <ul
              className={
                panelPoints.length === 2
                  ? "mt-8 grid gap-3 sm:grid-cols-2"
                  : "mt-8 grid gap-3 sm:grid-cols-3"
              }
            >
              {panelPoints.map((point) => (
                <li
                  key={point.title}
                  className="flex items-start gap-2.5 rounded-xl bg-surface px-4 py-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="text-sm leading-snug font-semibold text-foreground">
                      {point.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="relative px-6 pb-6 text-center text-xs text-muted-foreground">
        <a href={PORTALS.PUBLIC} className="transition-colors hover:text-foreground">
          academichubpro.com
        </a>
        <span className="mx-2">·</span>
        Secure access portal
      </footer>
    </div>
  );
}
