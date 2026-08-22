/**
 * Google Identity Services integration.
 *
 * Set VITE_GOOGLE_CLIENT_ID at build time to enable "Continue with Google".
 * The GIS button produces a credential (ID token) which is exchanged with
 * the AcademicHub API via loginWithGoogle() (POST /auth/google).
 *
 * When no client ID is configured the button is simply not rendered.
 */

export const GOOGLE_CLIENT_ID =
  (import.meta.env["VITE_GOOGLE_CLIENT_ID"] as string | undefined) ?? "";

export const isGoogleSignInConfigured = GOOGLE_CLIENT_ID.length > 0;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Google sign-in."));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}
