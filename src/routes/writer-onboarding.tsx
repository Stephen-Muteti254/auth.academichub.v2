import { useState } from "react";
import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/guards";
import { useAuth } from "@/lib/auth";
import logoMark from "@/assets/logo/mark-ac-dark.svg";

export const Route = createFileRoute("/writer-onboarding")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: WriterOnboardingLayout,
});

function WriterOnboardingLayout() {
  return (
    <RequireAuth roles={["writer"]}>
      <div className="flex min-h-screen flex-col bg-surface">
        <OnboardingHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
          <Outlet />
        </main>
        <footer className="border-t py-6 text-center text-xs text-muted-foreground">
          AcademicHub · Writer onboarding
        </footer>
      </div>
    </RequireAuth>
  );
}

function OnboardingHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link to="/writer-onboarding/apply" aria-label="AcademicHub writer onboarding">
          <img src={logoMark} alt="AcademicHub" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-45 truncate text-sm text-muted-foreground sm:block">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
