import { Navigate, createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Mail, Wallet } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WriterJourney } from "@/components/writer/WriterJourney";
import { useAuth } from "@/lib/auth";
import { writerOnboardingPath } from "@/lib/destination";

export const Route = createFileRoute("/writer-onboarding/approved")({
  component: ApprovedPage,
});

function ApprovedPage() {
  const { user } = useAuth();

  if (user && user.application_status !== "awaiting_initial_deposit") {
    return <Navigate to={writerOnboardingPath(user?.application_status)} />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-success/30 bg-card p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
          <BadgeCheck className="h-7 w-7 text-success" />
        </span>
        <h1 className="font-display mt-6 text-3xl font-bold tracking-tight">
          Congratulations — you're approved!
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          Your application met our experience and skills requirements. One last
          step before your account is activated.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Activation deposit</h2>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              A one-time, refundable activation deposit confirms your commitment
              to the platform. Payment instructions are sent to{" "}
              <span className="font-medium text-foreground">{user?.email}</span>{" "}
              — follow them and our team will activate your account.
            </p>
          </div>
        </div>

        <Alert className="mt-6 border-primary/20 bg-primary/5">
          <Mail className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Waiting on your deposit</AlertTitle>
          <AlertDescription className="text-foreground/80">
            Once your deposit is confirmed, AcademicHub activates your account
            and you'll complete your writer profile to start receiving orders.
          </AlertDescription>
        </Alert>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <h2 className="text-lg font-semibold">Where you are in the journey</h2>
        <WriterJourney current="deposit" className="mt-6" />
      </div>
    </div>
  );
}
