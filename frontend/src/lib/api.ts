import { tokenKey } from '../constants';

export async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(tokenKey);
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');

  const response = await fetch(url, { ...options, headers, credentials: 'include' });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error?.message ?? 'So‘rov bajarilmadi. Qayta urinib ko‘ring.');
  return result.data as T;
}
