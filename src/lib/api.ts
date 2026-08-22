/**
 * API client for the AcademicHub backend (api.academichubpro.com).
 *
 * The API authenticates via HttpOnly cookies on the shared parent domain,
 * guarded by a double-submit CSRF cookie (`csrf_access_token`) that must be
 * echoed back in the `X-CSRF-TOKEN` header on every mutating request.
 */

export const API_BASE_URL: string =
  (import.meta.env["VITE_API_URL"] as string | undefined) ??
  "https://api.academichubpro.com/api/v1";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const err = d["error"] as Record<string, unknown> | undefined;
    if (typeof err?.["message"] === "string") return err["message"];
    if (typeof d["message"] === "string") return d["message"];
  }
  return fallback;
}

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown; // plain object -> JSON, FormData -> multipart
  signal?: AbortSignal;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, signal } = options;

  const headers: Record<string, string> = {};
  let payload: BodyInit | null = null;

  if (body instanceof FormData) {
    payload = body; // browser sets multipart boundary
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (method !== "GET") {
    const csrf = readCookie("csrf_access_token");
    if (csrf) headers["X-CSRF-TOKEN"] = csrf;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: payload,
      credentials: "include",
      signal: signal ?? null,
    });
  } catch {
    throw new ApiError(
      0,
      "Unable to reach the AcademicHub server. Check your connection and try again.",
    );
  }

  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractMessage(data, `Request failed (${response.status}). Please try again.`),
      data,
    );
  }

  return data as T;
}

/** The API wraps payloads inconsistently (Flask success_response); unwrap. */
function unwrap(data: unknown): Record<string, unknown> {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const inner = d["data"];
    if (inner && typeof inner === "object") {
      return { ...d, ...(inner as Record<string, unknown>) };
    }
    return d;
  }
  return {};
}

export interface AuthUser {
  id: number | string;
  full_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  role?: string;
  subscription_level?: string;
  application_status?:
    | "not_applied"
    | "applied"
    | "awaiting_initial_deposit"
    | "rejected"
    | "approved_active"
    | string;
}

export interface AuthPayload {
  user: AuthUser;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export function extractAuthPayload(data: unknown): AuthPayload {
  const d = unwrap(data);
  const user = d["user"] as AuthUser | undefined;
  if (!user) throw new ApiError(200, "Unexpected response from the server.", data);
  return {
    user,
    accessToken: (d["access_token"] as string) || undefined,
    refreshToken: (d["refresh_token"] as string) || undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Auth endpoints                                                      */
/* ------------------------------------------------------------------ */

export interface LoginResult {
  otpRequired: boolean;
  otpSessionId?: string;
  auth?: AuthPayload;
}

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<LoginResult> {
  const data = unwrap(
    await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  );

  if (data["otp_required"]) {
    return {
      otpRequired: true,
      otpSessionId: data["otp_session_id"] as string,
    };
  }
  return { otpRequired: false, auth: extractAuthPayload(data) };
}

export async function verifyLoginOtp(
  otp: string,
  otpSessionId: string,
): Promise<AuthPayload> {
  const data = await apiFetch("/auth/login/verify-otp", {
    method: "POST",
    body: { otp, otp_session_id: otpSessionId },
  });
  return extractAuthPayload(data);
}

export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
  role: "client" | "writer";
  country?: string;
  phone?: string;
}

export async function registerAccount(input: RegisterInput): Promise<AuthPayload> {
  const data = await apiFetch("/auth/register", { method: "POST", body: input });
  return extractAuthPayload(data);
}

/**
 * Google sign-in: exchange a Google Identity Services credential (ID token)
 * for an AcademicHub session.
 *
 * Backend contract (to be confirmed by the API team):
 *   POST /auth/google  { credential: string }  ->  standard auth payload
 */
export async function loginWithGoogle(credential: string): Promise<AuthPayload> {
  const data = await apiFetch("/auth/google", {
    method: "POST",
    body: { credential },
  });
  return extractAuthPayload(data);
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const data = unwrap(await apiFetch("/auth/me"));
    const user = (data["user"] ?? data) as AuthUser;
    return user && user.id ? user : null;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      return null;
    }
    throw err;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // Best effort — the session cookie will expire regardless.
  }
}

export async function submitWriterApplication(
  formData: FormData,
): Promise<unknown> {
  return apiFetch("/applications/apply-writer", {
    method: "POST",
    body: formData,
  });
}
