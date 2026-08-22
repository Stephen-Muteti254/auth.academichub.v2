import { queryOptions } from "@tanstack/react-query";

import { apiFetch } from "./api";

/**
 * Platform-wide settings shared across the AcademicHub sites.
 *
 * The writer hiring switch is controlled from the admin portal
 * (admin.academichubpro.com); this site only READS it.
 *
 * Backend contract:
 *   GET /platform/settings
 *   -> { writer_hiring_open: boolean, hiring_notice?: string }
 *
 * Until that endpoint ships, any failure falls back to
 * DEFAULT_HIRING_OPEN below so the current behaviour is preserved.
 */
export const DEFAULT_HIRING_OPEN = true;

export interface PlatformSettings {
  writer_hiring_open: boolean;
  hiring_notice: string | undefined;
  /** true when the value came from the fallback, not the API */
  isFallback: boolean;
}

async function fetchPlatformSettings(): Promise<PlatformSettings> {
  try {
    const data = (await apiFetch("/platform/settings")) as Record<string, unknown>;
    const inner = data?.["data"];
    const wrapped =
      inner && typeof inner === "object"
        ? (inner as Record<string, unknown>)
        : data;
    const open = wrapped?.["writer_hiring_open"];
    const notice = wrapped?.["hiring_notice"];
    return {
      writer_hiring_open:
        typeof open === "boolean" ? open : DEFAULT_HIRING_OPEN,
      hiring_notice: typeof notice === "string" ? notice : undefined,
      isFallback: false,
    };
  } catch {
    return {
      writer_hiring_open: DEFAULT_HIRING_OPEN,
      hiring_notice: undefined,
      isFallback: true,
    };
  }
}

export const platformSettingsQuery = queryOptions({
  queryKey: ["platform", "settings"],
  queryFn: fetchPlatformSettings,
  staleTime: 60_000,
  retry: 1,
});
