import { createFileRoute } from "@tanstack/react-router";

// Layout-less parent: each register child renders its own AuthShell so the
// brand-panel copy can match the page (client privacy vs. writer hiring).
export const Route = createFileRoute("/register")({});
