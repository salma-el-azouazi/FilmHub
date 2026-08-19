import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { api, API_URL, User } from "../lib/api";
import { createDemoRegisteredUser, findDemoUserByCredentials } from "../lib/localDemoStore";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("filmhub_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("filmhub_token"));

  async function persist(nextToken: string, nextUser: User) {
    localStorage.setItem("filmhub_token", nextToken);
    localStorage.setItem("filmhub_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }

  function csrfToken() {
    return document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("filmhub_csrf="))
      ?.split("=")[1] || "";
  }

  async function login(email: string, password: string, remember = false) {
    try {
      const data = await api<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, remember })
      });
      await persist(data.token, data.user);
    } catch (error) {
      const savedDemoUser = await findDemoUserByCredentials(email, password);
      if (savedDemoUser) {
        await persist("demo-registered-token", savedDemoUser);
        return;
      }
      if (password !== "FilmHub123!") throw error;
      const role = email.toLowerCase().startsWith("admin") ? "admin" : "user";
      await persist(`demo-${role}-token`, {
        id: role === "admin" ? 1 : 2,
        name: role === "admin" ? "Admin Director" : "Demo Film Writer",
        email,
        role,
        status: "active",
        avatar: "",
        bio: "Demo account available while MySQL is not connected."
      });
    }
  }

  async function register(name: string, email: string, password: string, remember = true) {
    try {
      const data = await api<{ token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, remember })
      });
      await persist(data.token, data.user);
    } catch {
      const demoUser = await createDemoRegisteredUser(name, email, password);
      await persist("demo-user-token", demoUser);
    }
  }

  function logout() {
    fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: csrfToken() ? { "X-CSRF-Token": decodeURIComponent(csrfToken()) } : undefined
    }).catch(() => undefined);
    localStorage.removeItem("filmhub_token");
    localStorage.removeItem("filmhub_user");
    setToken(null);
    setUser(null);
  }

  async function refresh() {
    const currentToken = localStorage.getItem("filmhub_token");
    if (!currentToken) {
      const csrf = csrfToken();
      if (!csrf) return;
      const response = await fetch(`${API_URL}/auth/remember`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-Token": decodeURIComponent(csrf) }
      });
      if (!response.ok) return;
      const data = await response.json() as { token: string; user: User };
      await persist(data.token, data.user);
      return;
    }
    if (currentToken.startsWith("demo-")) return;
    const data = await api<{ user: User }>("/auth/me");
    localStorage.setItem("filmhub_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  useEffect(() => {
    refresh().catch(logout);
  }, []);

  const value = useMemo(() => ({ user, token, login, register, logout, refresh }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
