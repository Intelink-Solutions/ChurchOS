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

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers, includeAuth = true } = options;
  const storedToken = typeof window !== "undefined"
    ? localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? undefined
    : undefined;
  const resolvedToken = includeAuth ? token ?? storedToken : token;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

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
