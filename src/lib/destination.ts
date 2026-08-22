import type { AuthUser } from "./api";

/** The AcademicHub portal network this auth site signs users into. */
export const PORTALS = {
  PUBLIC: "https://academichubpro.com",
  AUTH: "https://auth.academichubpro.com",
  WRITER: "https://writer.academichubpro.com",
  CLIENT: "https://client.academichubpro.com",
  ADMIN: "https://admin.academichubpro.com",
} as const;

export const SITE_URL = PORTALS.AUTH;

export type Destination =
  | { type: "external"; url: string }
  | { type: "internal"; to: string };

/**
 * Where a user goes after signing in, based on role and (for writers)
 * their onboarding status — mirrors the writer pipeline:
 * apply -> review -> approved -> deposit -> activated -> profile.
 */
export function resolvePostAuthDestination(user: AuthUser): Destination {
  switch (user.role) {
    case "writer":
      switch (user.application_status) {
        case "not_applied":
          return { type: "internal", to: "/writer-onboarding/apply" };
        case "applied":
          return { type: "internal", to: "/writer-onboarding/pending" };
        case "awaiting_initial_deposit":
          return { type: "internal", to: "/writer-onboarding/approved" };
        case "rejected":
          return { type: "internal", to: "/writer-onboarding/rejected" };
        default:
          return { type: "external", url: PORTALS.WRITER };
      }
    case "admin":
    case "super_admin":
      return { type: "external", url: PORTALS.ADMIN };
    case "client":
      return { type: "external", url: PORTALS.CLIENT };
    default:
      return { type: "external", url: PORTALS.PUBLIC };
  }
}

/** The internal onboarding page a writer's status maps to. */
export function writerOnboardingPath(status: string | undefined): string {
  switch (status) {
    case "applied":
      return "/writer-onboarding/pending";
    case "awaiting_initial_deposit":
      return "/writer-onboarding/approved";
    case "rejected":
      return "/writer-onboarding/rejected";
    default:
      return "/writer-onboarding/apply";
  }
}
