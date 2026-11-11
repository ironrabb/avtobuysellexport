import { tokenKey } from "../constants";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem(tokenKey);
  const headers = new Headers(options.headers);
  headers.set("Accept-Language", localStorage.getItem("avto-language") ?? "uz");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      result?.error?.message ?? "Request failed.",
      result?.error?.code ?? "UNKNOWN",
      response.status,
      result?.error?.details,
    );
  return result.data as T;
}
