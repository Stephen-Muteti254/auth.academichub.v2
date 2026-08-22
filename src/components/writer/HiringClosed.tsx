import { Link } from "@tanstack/react-router";
import { CalendarClock, MailOpen } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PORTALS } from "@/lib/destination";

interface HiringClosedProps {
  notice?: string | undefined;
}

/**
 * Shown on the writer registration/application pages whenever the platform
 * is not hiring writers (controlled from the admin portal).
 */
export function HiringClosed({ notice }: HiringClosedProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-card p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warning/15">
          <CalendarClock className="h-7 w-7 text-warning-foreground" />
        </span>

        <h2 className="font-display mt-6 text-2xl font-bold">
          Writer applications are currently closed
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          {notice ??
            "We're not accepting new writer applications at the moment. Our hiring window reopens periodically as demand grows — please check back soon."}
        </p>

        <Alert className="mx-auto mt-6 max-w-md border-primary/20 bg-primary/5 text-left">
          <MailOpen className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Stay in the loop</AlertTitle>
          <AlertDescription className="text-foreground/80">
            Keep an eye on{" "}
            <a
              href={PORTALS.PUBLIC}
              className="font-medium text-primary underline underline-offset-2"
            >
              academichubpro.com
            </a>{" "}
            — hiring rounds are announced there first.
          </AlertDescription>
        </Alert>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/register/client">Hire a writer instead</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
