import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleSignInButton, OrDivider } from "@/components/auth/GoogleButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GuestOnly, ExternalRedirect } from "@/components/guards";
import { isGoogleSignInConfigured } from "@/lib/google";
import {
  loginWithPassword,
  verifyLoginOtp,
  type AuthUser,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { resolvePostAuthDestination, SITE_URL } from "@/lib/destination";

const OG_IMAGE = `${SITE_URL}/social/og-image.png`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In — AcademicHub" },
      {
        name: "description",
        content:
          "Secure sign in for AcademicHub clients and writers. Access orders, messages, and your academic writing workspace.",
      },
      { property: "og:title", content: "Sign In — AcademicHub" },
      {
        property: "og:description",
        content:
          "Secure sign in for AcademicHub clients and writers. Access orders, messages, and your academic writing workspace.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <GuestOnly>
      <AuthShell
        panelTitle="Your academic workspace awaits."
        panelSubtitle="One secure sign-in connects you to expert writers, active orders, and private communication."
        panelPoints={[
          {
            title: "Privacy by design",
            description:
              "Clients are identified by a chosen nickname — never a real name.",
          },
          {
            title: "Verified expertise",
            description:
              "Every writer passes a vetted application before joining.",
          },
          {
            title: "Protected sessions",
            description:
              "One-time passcode verification keeps your account safe.",
          },
        ]}
      >
        <LoginForm />
      </AuthShell>
    </GuestOnly>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const goToDestination = (user: AuthUser) => {
    const destination = resolvePostAuthDestination(user);
    if (destination.type === "external") {
      setRedirectTo(destination.url);
    } else {
      navigate({ to: destination.to });
    }
  };

  const credentialsMutation = useMutation({
    mutationFn: () => loginWithPassword(email.trim(), password),
    onSuccess: (result) => {
      if (result.otpRequired && result.otpSessionId) {
        setOtpSessionId(result.otpSessionId);
        setStep("otp");
        toast.success("One-time passcode sent", {
          description: "Check your email for the 6-digit code.",
        });
      } else if (result.auth) {
        setUser(result.auth.user);
        toast.success("Welcome back!");
        goToDestination(result.auth.user);
      }
    },
    onError: (err) => {
      toast.error("Sign in failed", {
        description:
          err instanceof Error
            ? err.message
            : "Invalid credentials. Please try again.",
      });
    },
  });

  const otpMutation = useMutation({
    mutationFn: () => verifyLoginOtp(otp, otpSessionId),
    onSuccess: ({ user }) => {
      setUser(user);
      toast.success("Welcome back!");
      goToDestination(user);
    },
    onError: (err) => {
      toast.error("Invalid passcode", {
        description:
          err instanceof Error
            ? err.message
            : "The code is incorrect or has expired.",
      });
    },
  });

  if (redirectTo) return <ExternalRedirect url={redirectTo} />;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          {step === "credentials" ? "Welcome back" : "Check your email"}
        </h2>
        <p className="text-muted-foreground">
          {step === "credentials"
            ? "Sign in to continue to your AcademicHub portal."
            : `We sent a 6-digit passcode to ${email}.`}
        </p>
      </div>

      {step === "credentials" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            credentialsMutation.mutate();
          }}
          className="space-y-5"
        >
          {isGoogleSignInConfigured && (
            <>
              <GoogleSignInButton
                onSuccess={(user) => {
                  setUser(user);
                  goToDestination(user);
                }}
              />
              <OrDivider />
            </>
          )}

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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={credentialsMutation.isPending}
          >
            {credentialsMutation.isPending ? "Signing in…" : "Continue"}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            otpMutation.mutate();
          }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <Label htmlFor="otp">One-time passcode</Label>
            <InputOTP
              id="otp"
              maxLength={6}
              value={otp}
              onChange={setOtp}
              containerClassName="justify-start"
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              This extra step keeps your account secure.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={otpMutation.isPending || otp.length < 6}
          >
            {otpMutation.isPending ? "Verifying…" : "Verify & sign in"}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("credentials");
              setOtp("");
            }}
            className="w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        New to AcademicHub?{" "}
        <Link
          to="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
