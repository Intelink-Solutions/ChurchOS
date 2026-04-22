type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
  includeAuth?: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
const ACCESS_TOKEN_STORAGE_KEY = "churchos-access-token";
const REFRESH_TOKEN_STORAGE_KEY = "churchos-refresh-token";

// Singleton promise to prevent concurrent refresh calls
let refreshPromise: Promise<string | null> | null = null;

async function attemptTokenRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const stored = typeof window !== "undefined"
        ? localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
        : null;
      if (!stored) return null;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: stored }),
      });

      if (!response.ok) return null;

      const data = await response.json() as { accessToken: string; refreshToken?: string };
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refreshToken);
      }
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export type ApiErrorPayload = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  validationErrors?: Record<string, string | string[]>;
};

export class ApiRequestError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.payload = payload;
  }
}

async function executeRequest(path: string, resolvedToken: string | undefined, options: RequestOptions): Promise<Response> {
  const { method = "GET", body, headers } = options;
  return fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, includeAuth = true } = options;
  const storedToken = typeof window !== "undefined"
    ? localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? undefined
    : undefined;
  let resolvedToken = includeAuth ? token ?? storedToken : token;

  let response = await executeRequest(path, resolvedToken, options);

  // If 401 and auth is enabled, attempt token refresh once then retry
  if (response.status === 401 && includeAuth) {
    const newToken = await attemptTokenRefresh();
    if (newToken) {
      resolvedToken = newToken;
      response = await executeRequest(path, resolvedToken, options);
    } else {
      // Refresh failed — clear session and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
        localStorage.removeItem("churchos-user");
        window.location.href = "/login";
      }
    }
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    let payload: ApiErrorPayload | undefined;
    let fallbackMessage = `Request failed with status ${response.status}`;

    if (contentType.includes("application/json")) {
      payload = (await response.json()) as ApiErrorPayload;
      if (payload?.message) {
        fallbackMessage = payload.message;
      }
    } else {
      const message = await response.text();
      if (message) {
        fallbackMessage = message;
      }
    }

    throw new ApiRequestError(response.status, fallbackMessage, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export { API_BASE_URL };
