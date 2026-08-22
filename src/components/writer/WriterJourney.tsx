import {
  BadgeCheck,
  Check,
  FileSearch,
  Send,
  UnlockKeyhole,
  UserRound,
  Wallet,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type JourneyStage =
  | "apply"
  | "review"
  | "approved"
  | "deposit"
  | "activated"
  | "profile"
  | "rejected";

interface JourneyStep {
  id: Exclude<JourneyStage, "rejected">;
  title: string;
  actor: "You" | "AcademicHub";
  description: string;
  icon: typeof Send;
}

const STEPS: JourneyStep[] = [
  {
    id: "apply",
    title: "Apply through the platform",
    actor: "You",
    description:
      "Create your writer account and complete the application — credentials, proficiency test and writing samples.",
    icon: Send,
  },
  {
    id: "review",
    title: "Application review",
    actor: "AcademicHub",
    description:
      "We verify that your application meets our required experience and skill standards.",
    icon: FileSearch,
  },
  {
    id: "approved",
    title: "Application approved",
    actor: "AcademicHub",
    description:
      "Successful applicants are notified by email and on this portal.",
    icon: BadgeCheck,
  },
  {
    id: "deposit",
    title: "Activation deposit paid",
    actor: "You",
    description:
      "A one-time, refundable activation deposit confirms your commitment to the platform.",
    icon: Wallet,
  },
  {
    id: "activated",
    title: "Account activated",
    actor: "AcademicHub",
    description:
      "Your writer account is activated and orders become available to you.",
    icon: UnlockKeyhole,
  },
  {
    id: "profile",
    title: "Profile completion",
    actor: "You",
    description:
      "Complete your public writer profile and start bidding on orders.",
    icon: UserRound,
  },
];

interface WriterJourneyProps {
  /** Highlight the stage the applicant is currently on. */
  current?: JourneyStage | undefined;
  className?: string;
}

/** The full "become a writer" pipeline, shown across the writer pages. */
export function WriterJourney({ current, className }: WriterJourneyProps) {
  const currentIndex =
    current && current !== "rejected"
      ? STEPS.findIndex((s) => s.id === current)
      : -1;

  return (
    <div className={className}>
      <ol className="space-y-0">
        {STEPS.map((step, index) => {
          const isDone = currentIndex > index;
          const isCurrent = currentIndex === index;
          const Icon = step.icon;

          return (
            <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
              {/* connector */}
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-10 left-5 h-[calc(100%-2.5rem)] w-px",
                    isDone ? "bg-success/50" : "bg-border",
                  )}
                />
              )}

              <span
                className={cn(
                  "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                  isDone && "border-success/30 bg-success/10 text-success",
                  isCurrent &&
                    "border-primary bg-primary text-primary-foreground shadow-card",
                  !isDone && !isCurrent && "bg-card text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>

              <div className="min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "font-semibold",
                      isCurrent ? "text-foreground" : "text-foreground/90",
                    )}
                  >
                    {step.title}
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
                      step.actor === "You"
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {step.actor}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {/* Rejection branch, shown under the review step */}
                {step.id === "review" && (
                  <div
                    className={cn(
                      "mt-3 flex items-start gap-2.5 rounded-xl border p-3 text-sm",
                      current === "rejected"
                        ? "border-destructive/40 bg-destructive/5 text-foreground"
                        : "border-dashed text-muted-foreground",
                    )}
                  >
                    <XCircle
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        current === "rejected" ? "text-destructive" : "text-muted-foreground",
                      )}
                    />
                    <span>
                      If the application doesn't meet the required experience
                      and skills, it is{" "}
                      <span className="font-medium text-foreground">
                        respectfully declined
                      </span>{" "}
                      with feedback from AcademicHub.
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
