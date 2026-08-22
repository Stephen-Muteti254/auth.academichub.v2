import { useEffect, type ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";

import { useAuth } from "@/lib/auth";
import { resolvePostAuthDestination } from "@/lib/destination";
import logo from "@/assets/logo/mark-ac-dark.svg";

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <img src={logo} alt="" className="h-12 w-12 animate-pulse" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** Hard redirect to an external portal (another academichubpro.com site). */
export function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);
  return <PageLoader label="Taking you to your portal…" />;
}

interface RequireAuthProps {
  children: ReactNode;
  /** Restrict to these roles; others are bounced to sign-in. */
  roles?: string[];
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to="/" />;
  if (roles && user.role && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

/**
 * For sign-in/sign-up pages: users with a live session are sent to their
 * destination instead of seeing the form again.
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (user) {
    const destination = resolvePostAuthDestination(user);
    if (destination.type === "external") {
      return <ExternalRedirect url={destination.url} />;
    }
    return <Navigate to={destination.to} />;
  }
  return <>{children}</>;
}
