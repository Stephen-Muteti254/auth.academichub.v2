import { Navigate, createFileRoute } from "@tanstack/react-router";
import { FileSearch } from "lucide-react";

import { WriterJourney } from "@/components/writer/WriterJourney";
import { useAuth } from "@/lib/auth";
import { writerOnboardingPath } from "@/lib/destination";

export const Route = createFileRoute("/writer-onboarding/pending")({
  component: PendingPage,
});

function PendingPage() {
  const { user } = useAuth();

  if (user && user.application_status !== "applied") {
    return <Navigate to={writerOnboardingPath(user?.application_status)} />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-card p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <FileSearch className="h-7 w-7 text-primary" />
        </span>
        <h1 className="font-display mt-6 text-3xl font-bold tracking-tight">
          Application under review
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          Thank you{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}.
          Our editorial team is verifying that your application meets our
          experience and skills requirements. You'll receive an email as soon
          as a decision is made — typically within 2–3 business days.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-semibold">Where you are in the journey</h2>
        <WriterJourney current="review" className="mt-6" />
      </div>
    </div>
  );
}
