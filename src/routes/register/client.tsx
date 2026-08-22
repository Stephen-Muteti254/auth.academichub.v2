import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { EyeOff, KeyRound, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleSignInButton, OrDivider } from "@/components/auth/GoogleButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GuestOnly, ExternalRedirect } from "@/components/guards";
import { isGoogleSignInConfigured } from "@/lib/google";
import { registerAccount, type AuthUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { resolvePostAuthDestination, PORTALS, SITE_URL } from "@/lib/destination";

const OG_IMAGE = `${SITE_URL}/social/og-image.png`;

export const Route = createFileRoute("/register/client")({
  head: () => ({
    meta: [
      { title: "Client Sign Up — AcademicHub" },
      {
        name: "description",
        content:
          "Create an anonymous AcademicHub client account with just an email and a nickname. Hire verified academic writers with complete privacy.",
      },
      { property: "og:title", content: "Client Sign Up — AcademicHub" },
      {
        property: "og:description",
        content:
          "Create an anonymous AcademicHub client account with just an email and a nickname. Hire verified academic writers with complete privacy.",
      },
      { property: "og:url", content: `${SITE_URL}/register/client` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/register/client` }],
  }),
  component: ClientRegisterPage,
});

function ClientRegisterPage() {
  return (
    <GuestOnly>
      <AuthShell
        panelTitle="Your privacy is the product."
        panelSubtitle="AcademicHub never asks clients for a real name. A nickname is all it takes to start hiring verified writers."
        panelPoints={[
          {
            title: "No real name, ever",
            description:
              "You're known only by the nickname you choose — to us and to writers.",
          },
          {
            title: "Protected from victimisation",
            description:
              "Nothing in your account can be used to identify or expose you.",
          },
          {
            title: "Confidential by default",
            description:
              "Orders, messages and files stay private to your account.",
          },
        ]}
      >
        <ClientRegisterForm />
      </AuthShell>
    </GuestOnly>
  );
}

function ClientRegisterForm() {
  const { setUser } = useAuth();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const goToDestination = (user: AuthUser) => {
    const destination = resolvePostAuthDestination(user);
    if (destination.type === "external") setRedirectTo(destination.url);
  };

  const mutation = useMutation({
    mutationFn: () =>
      registerAccount({
        // Clients never share a real name — the chosen nickname is the
        // only identity the backend (and writers) ever see.
        full_name: nickname.trim(),
        email: email.trim(),
        password,
        role: "client",
      }),
    onSuccess: ({ user }) => {
      setUser(user);
      toast.success("Welcome to AcademicHub!", {
        description: "Your private client account is ready.",
      });
      goToDestination(user);
    },
    onError: (err) => {
      toast.error("Couldn't create your account", {
        description:
          err instanceof Error ? err.message : "Please try again.",
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
          Create your client account
        </h2>
        <p className="text-muted-foreground">
          Just an email and a nickname.{" "}
          <span className="font-medium text-foreground">
            We'll never ask for your real name.
          </span>
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
          <Label htmlFor="nickname">Nickname</Label>
          <div className="relative">
            <UserRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="nickname"
              className="pl-9"
              placeholder="e.g. ScholarFox"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={40}
              required
            />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <EyeOff className="h-3.5 w-3.5 text-success" />
            This is the only name writers will ever see.
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
          {mutation.isPending ? "Creating account…" : "Create account"}
        </Button>

        <p className="flex items-start gap-2 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          By creating an account you agree to the AcademicHub{" "}
          <a
            href={`${PORTALS.PUBLIC}/terms`}
            className="font-medium text-primary hover:underline"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href={`${PORTALS.PUBLIC}/privacy`}
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>

      <div className="space-y-2 text-center text-sm text-muted-foreground">
        <p>
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <p>
          Looking to write instead?{" "}
          <Link
            to="/register/writer"
            className="font-semibold text-primary hover:underline"
          >
            Apply as a writer
          </Link>
        </p>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        Your identity stays yours. Always.
      </p>
    </div>
  );
}
