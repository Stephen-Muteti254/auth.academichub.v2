import { createFileRoute, redirect } from "@tanstack/react-router";

// Backwards compatibility: legacy links point at /login; sign-in lives at /.
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
