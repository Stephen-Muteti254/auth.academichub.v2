import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleSignInButton, OrDivider } from "@/components/auth/GoogleButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GuestOnly, ExternalRedirect } from "@/components/guards";
import { WriterJourney } from "@/components/writer/WriterJourney";
import { HiringClosed } from "@/components/writer/HiringClosed";
import { platformSettingsQuery } from "@/lib/platform";
import { isGoogleSignInConfigured } from "@/lib/google";
import { registerAccount, type AuthUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { resolvePostAuthDestination, SITE_URL } from "@/lib/destination";

const OG_IMAGE = `${SITE_URL}/social/og-image.png`;

export const Route = createFileRoute("/register/writer")({
  head: () => ({
    meta: [
      { title: "Become a Writer — AcademicHub" },
      {
        name: "description",
        content:
          "Apply to join AcademicHub as an academic writer. Clear application steps, fair review, and reliable payouts for verified experts.",
      },
      { property: "og:title", content: "Become a Writer — AcademicHub" },
      {
        property: "og:description",
        content:
          "Apply to join AcademicHub as an academic writer. Clear application steps, fair review, and reliable payouts for verified experts.",
      },
      { property: "og:url", content: `${SITE_URL}/register/writer` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/register/writer` }],
  }),
  component: WriterRegisterPage,
});

function WriterRegisterPage() {
  const { data: settings, isLoading } = useQuery(platformSettingsQuery);

  return (
    <GuestOnly>
      <AuthShell
        panelTitle="Write. Earn. Grow."
        panelSubtitle="Join a vetted community of academic writers. A transparent application process — you'll always know exactly where you stand."
        panelPoints={[
          {
            title: "Transparent pipeline",
            description:
              "Six clear steps from application to your first order.",
          },
          {
            title: "Fair, human review",
            description:
              "Every application is read and assessed by our editorial team.",
          },
          {
            title: "Reliable payouts",
            description: "Get paid on time for work you're proud of.",
          },
        ]}
      >
        {isLoading ? (
          <div className="space-y-4" aria-busy="true">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : settings?.writer_hiring_open ? (
          <WriterRegisterForm />
        ) : (
          <HiringClosed notice={settings?.hiring_notice} />
        )}
      </AuthShell>
    </GuestOnly>
  );
}

function WriterRegisterForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const goToDestination = (user: AuthUser) => {
    const destination = resolvePostAuthDestination(user);
    if (destination.type === "external") {
      setRedirectTo(destination.url);
    } else {
      navigate({ to: destination.to });
    }
  };

  const mutation = useMutation({
    mutationFn: () =>
      registerAccount({
        // Writers are vetted professionals — a full name is required for
        // contracts and payouts (unlike anonymous client accounts).
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role: "writer",
      }),
    onSuccess: ({ user }) => {
      setUser(user);
      toast.success("Account created!", {
        description: "Now let's complete your writer application.",
      });
      goToDestination(user);
    },
    onError: (err) => {
      toast.error("Couldn't create your account", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    mutation.mutate();
  };

  if (redirectTo) return <ExternalRedirect url={redirectTo} />;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Become a writer
        </h2>
        <p className="text-muted-foreground">
          Create your account to start the application. It takes about 15
          minutes.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {isGoogleSignInConfigured && (
          <>
            <GoogleSignInButton onSuccess={goToDestination} />
            <OrDivider />
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="e.g. Jane Wanjiku"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Required for writer vetting, contracts and payouts.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <PasswordInput
              id="confirm"
              autoComplete="new-password"
              placeholder="Repeat it"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Continue to application"
          )}
        </Button>
      </form>

      <div className="rounded-2xl border bg-muted/50 p-5">
        <p className="text-sm font-semibold">How you become a writer</p>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">
          Here's the full journey — you're at step one.
        </p>
        <WriterJourney current="apply" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
