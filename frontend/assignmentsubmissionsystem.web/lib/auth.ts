import { LoginResponse } from "@/types/auth";

const AUTH_KEY = "assignment_auth";

export function saveAuth(data: LoginResponse) {
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function getAuth(): LoginResponse | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(AUTH_KEY);

  if (!data) return null;

  try {
    return JSON.parse(data) as LoginResponse;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  const auth = getAuth();

  return auth?.token ?? null;
}

export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_KEY);
}
