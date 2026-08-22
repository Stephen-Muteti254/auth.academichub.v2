import { useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  GOOGLE_CLIENT_ID,
  isGoogleSignInConfigured,
  loadGoogleScript,
} from "@/lib/google";
import { ApiError, loginWithGoogle, type AuthUser } from "@/lib/api";

interface GoogleSignInButtonProps {
  onSuccess: (user: AuthUser) => void;
}

/**
 * Renders the official Google sign-in button (Google Identity Services).
 * Hidden unless VITE_GOOGLE_CLIENT_ID is configured at build time.
 */
export function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isGoogleSignInConfigured || !containerRef.current) return;
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google || !containerRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async ({ credential }) => {
            try {
              const { user } = await loginWithGoogle(credential);
              onSuccess(user);
            } catch (err) {
              toast.error(
                err instanceof ApiError && err.status === 404
                  ? "Google sign-in isn't enabled on the server yet."
                  : err instanceof Error
                    ? err.message
                    : "Google sign-in failed. Please try again.",
              );
            }
          },
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          width: 384,
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      })
      .catch(() => {
        toast.error("Couldn't load Google sign-in. Please use email instead.");
      });

    return () => {
      cancelled = true;
    };
  }, [onSuccess]);

  if (!isGoogleSignInConfigured) return null;

  return (
    <div className="flex justify-center overflow-hidden rounded-md">
      <div ref={containerRef} />
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        or continue with email
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
