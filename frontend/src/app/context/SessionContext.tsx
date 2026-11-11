import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError } from "../../lib/api";
import { memberKey, tokenKey } from "../../constants";
import type { AuthMember } from "../../types";

type Credentials = { email: string; password: string };
type Registration = Credentials & {
  name: string;
  phone: string;
  type: "BUYER" | "SELLER";
};
type AccountRestriction = { status: "PAUSED" | "BLOCKED" };
type SessionContextValue = {
  member: AuthMember | null;
  restriction: AccountRestriction | null;
  updateMember: (member: Partial<AuthMember>) => void;
  signIn: (credentials: Credentials) => Promise<void>;
  signUp: (registration: Registration) => Promise<void>;
  signOut: () => Promise<void>;
};
const SessionContext = createContext<SessionContextValue | null>(null);

function readMember(): AuthMember | null {
  try {
    return JSON.parse(
      localStorage.getItem(memberKey) ?? "null",
    ) as AuthMember | null;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<AuthMember | null>(readMember);
  const [restriction, setRestriction] = useState<AccountRestriction | null>(
    null,
  );

  useEffect(() => {
    if (!member) return;
    let active = true;
    api<Record<string, unknown>>("/api/members/me")
      .then((profile) => {
        if (!active) return;
        const current = {
          ...member,
          avatarUrl: String(profile.avatarUrl ?? ""),
          status: String(profile.status ?? "ACTIVE"),
        };
        localStorage.setItem(memberKey, JSON.stringify(current));
        setMember(current);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiError && error.code === "ACCOUNT_SUSPENDED") {
          const details = error.details as { status?: string } | undefined;
          setRestriction({
            status: details?.status === "PAUSED" ? "PAUSED" : "BLOCKED",
          });
        } else if (
          error instanceof ApiError &&
          (error.status === 401 || error.status === 404)
        ) {
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(memberKey);
          setMember(null);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      member,
      restriction,
      updateMember(partial) {
        setMember((current) => {
          if (!current) return current;
          const next = { ...current, ...partial };
          localStorage.setItem(memberKey, JSON.stringify(next));
          return next;
        });
      },
      async signIn(credentials) {
        setRestriction(null);
        try {
          const result = await api<{ member: AuthMember; token: string }>(
            "/api/members/login",
            { method: "POST", body: JSON.stringify(credentials) },
          );
          localStorage.setItem(tokenKey, result.token);
          localStorage.setItem(memberKey, JSON.stringify(result.member));
          setMember(result.member);
        } catch (error) {
          if (error instanceof ApiError && error.code === "ACCOUNT_SUSPENDED") {
            const details = error.details as { status?: string } | undefined;
            setRestriction({
              status: details?.status === "PAUSED" ? "PAUSED" : "BLOCKED",
            });
          }
          throw error;
        }
      },
      async signUp(registration) {
        await api("/api/members/signup", {
          method: "POST",
          body: JSON.stringify(registration),
        });
      },
      async signOut() {
        try {
          await api("/api/members/logout", { method: "POST" });
        } catch {
          /* Server sessiyasi bekor qilingan bo‘lsa ham, lokal hisobdan chiqiladi. */
        }
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(memberKey);
        setMember(null);
        setRestriction(null);
      },
    }),
    [member, restriction],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession SessionProvider ichida ishlatilishi kerak");
  return context;
}
