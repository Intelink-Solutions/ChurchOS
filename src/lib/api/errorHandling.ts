import { ApiRequestError } from "@/lib/api/httpClient";

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (!(error instanceof ApiRequestError)) {
    return error instanceof Error ? error.message : fallback;
  }

  if (error.status === 401) {
    return error.payload?.message || "Your session is invalid or expired. Please sign in again.";
  }

  if (error.status === 403) {
    return (
      error.payload?.message ||
      "You do not have access to this action or record in your current scope."
    );
  }

  return error.payload?.message || error.message || fallback;
}

export function isApiStatus(error: unknown, status: number) {
  return error instanceof ApiRequestError && error.status === status;
}
