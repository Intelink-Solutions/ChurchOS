type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
const ACCESS_TOKEN_STORAGE_KEY = "churchos-access-token";

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers } = options;
  const storedToken = typeof window !== "undefined"
    ? localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? undefined
    : undefined;
  const resolvedToken = token ?? storedToken;

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
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export { API_BASE_URL };
