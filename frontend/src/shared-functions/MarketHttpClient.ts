/**
 * Base URL for all API calls.
 * In development, Vite proxies /api → http://localhost:8000.
 * In production, the backend should be on the same origin.
 */
export const API_BASE = "/api/v1";

export function apiUrl(path: string): string {
    return `${API_BASE}${path}`;
}
