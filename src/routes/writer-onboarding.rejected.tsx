import { Link, Navigate, createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WriterJourney } from "@/components/writer/WriterJourney";
import { useAuth } from "@/lib/auth";
import { writerOnboardingPath, PORTALS } from "@/lib/destination";

export const Route = createFileRoute("/writer-onboarding/rejected")({
  component: RejectedPage,
});

function RejectedPage() {
  const { user } = useAuth();

  if (user && user.application_status !== "rejected") {
    return <Navigate to={writerOnboardingPath(user?.application_status)} />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-card p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-7 w-7 text-destructive" />
        </span>
        <h1 className="font-display mt-6 text-3xl font-bold tracking-tight">
          Application not approved
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          After careful review, your application didn't meet our current
          experience and skills requirements. This isn't the end — many of our
          best writers were accepted on a later attempt.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          You're welcome to reapply in a future hiring round with a stronger
          application. Feedback specific to your submission was sent to{" "}
          <span className="font-medium text-foreground">{user?.email}</span>.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <a href={PORTALS.PUBLIC}>Visit AcademicHub</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href={`${PORTALS.PUBLIC}/contact`}>
              <LifeBuoy className="h-4 w-4" />
              Contact support
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-semibold">Your application journey</h2>
        <WriterJourney current="rejected" className="mt-6" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Want to use AcademicHub as a client instead?{" "}
        <Link to="/register/client" className="font-semibold text-primary hover:underline">
          Create a client account
        </Link>
      </p>
    </div>
  );
}
