import React, { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from "react";
import apiClient from "@/lib/api";

type UserRole = "admin" | "content_creator" | null;

interface User {
  id: string;
  email: string;
  created_at?: string;
  last_sign_in_at?: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  isAdmin: boolean;
  isContentCreator: boolean;
  userRole: UserRole;
  isLoading: boolean;
  showInactivityWarning: boolean;
  inactivityCountdown: number;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  handleUnauthorized: () => void;
  continueSession: () => void;
  recordActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000;
const INACTIVITY_WARNING_COUNTDOWN_S = 30;
const SOFT_SESSION_LIMIT_MS = 30 * 60 * 1000;
const HARD_SESSION_LIMIT_MS = 60 * 60 * 1000;

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) return true;
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(INACTIVITY_WARNING_COUNTDOWN_S);
  const loginInProgress = useRef(false);
  const loginGraceUntil = useRef<number>(0);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionCheckTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setUserRole_ = (roles: string[]) => {
    if (roles.includes("admin")) {
      setUserRole("admin");
    } else if (roles.includes("content_creator")) {
      setUserRole("content_creator");
    } else {
      setUserRole(null);
    }
  };

  const clearAllTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (sessionCheckTimerRef.current) {
      clearInterval(sessionCheckTimerRef.current);
      sessionCheckTimerRef.current = null;
    }
  }, []);

  const clearAuth = useCallback(() => {
    clearAllTimers();
    apiClient.clearSession();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setShowInactivityWarning(false);
    setInactivityCountdown(INACTIVITY_WARNING_COUNTDOWN_S);
  }, [clearAllTimers]);

  const forceLogout = useCallback((reason: string) => {
    console.log(`Session ended: ${reason}`);
    clearAuth();
  }, [clearAuth]);

  const startInactivityCountdown = useCallback(() => {
    setShowInactivityWarning(true);
    setInactivityCountdown(INACTIVITY_WARNING_COUNTDOWN_S);

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    let remaining = INACTIVITY_WARNING_COUNTDOWN_S;
    countdownTimerRef.current = setInterval(() => {
      remaining -= 1;
      setInactivityCountdown(remaining);
      if (remaining <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        forceLogout("No response to inactivity warning");
      }
    }, 1000);
  }, [forceLogout]);

  const resetInactivityTimer = useCallback(() => {
    if (!sessionStorage.getItem("auth_token")) return;

    if (showInactivityWarning) return;

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    sessionStorage.setItem("last_activity", Date.now().toString());

    inactivityTimerRef.current = setTimeout(() => {
      startInactivityCountdown();
    }, INACTIVITY_TIMEOUT_MS);
  }, [showInactivityWarning, startInactivityCountdown]);

  const checkSessionLimits = useCallback(() => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) return;

    const sessionStart = parseInt(sessionStorage.getItem("session_start") || "0", 10);
    const lastActivity = parseInt(sessionStorage.getItem("last_activity") || "0", 10);
    const now = Date.now();

    if (now - sessionStart >= HARD_SESSION_LIMIT_MS) {
      forceLogout("Session exceeded 60-minute maximum. Please log in again.");
      return;
    }

    if (now - lastActivity >= SOFT_SESSION_LIMIT_MS) {
      forceLogout("Session expired due to 30 minutes of inactivity.");
      return;
    }
  }, [forceLogout]);

  const startSessionTimers = useCallback(() => {
    resetInactivityTimer();

    if (sessionCheckTimerRef.current) {
      clearInterval(sessionCheckTimerRef.current);
    }
    sessionCheckTimerRef.current = setInterval(() => {
      checkSessionLimits();
    }, 10000);
  }, [resetInactivityTimer, checkSessionLimits]);

  const recordActivity = useCallback(() => {
    if (!sessionStorage.getItem("auth_token")) return;
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  const continueSession = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setShowInactivityWarning(false);
    setInactivityCountdown(INACTIVITY_WARNING_COUNTDOWN_S);
    sessionStorage.setItem("last_activity", Date.now().toString());
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (user && session) {
      const handleActivity = () => {
        if (!showInactivityWarning) {
          recordActivity();
        }
      };

      const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
      events.forEach((event) => {
        window.addEventListener(event, handleActivity, { passive: true });
      });

      startSessionTimers();

      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [user, session, showInactivityWarning, recordActivity, startSessionTimers]);

  const checkAuth = async (retryCount = 0) => {
    if (loginInProgress.current) {
      setIsLoading(false);
      return;
    }

    const token = apiClient.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    const sessionStart = parseInt(sessionStorage.getItem("session_start") || "0", 10);
    if (sessionStart && Date.now() - sessionStart >= HARD_SESSION_LIMIT_MS) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (loginInProgress.current) {
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setSession({ access_token: token });
        setUserRole_(userData.roles);
      } else if (response.status === 401) {
        clearAuth();
      }
    } catch (err) {
      if (!loginInProgress.current && retryCount < 2) {
        setTimeout(() => checkAuth(retryCount + 1), 1500);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    return () => {
      clearAllTimers();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    loginInProgress.current = true;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ error: "Login failed" }));
          loginInProgress.current = false;
          loginGraceUntil.current = Date.now() + 5000;
          return { error: new Error(errData.error || "Invalid email or password") };
        }

        const data = await response.json();
        const now = Date.now();
        apiClient.setToken(data.access_token);
        sessionStorage.setItem("session_start", now.toString());
        sessionStorage.setItem("last_activity", now.toString());

        setUser(data.user);
        setSession({ access_token: data.access_token });
        setUserRole_(data.user.roles);

        loginInProgress.current = false;
        loginGraceUntil.current = Date.now() + 5000;
        return { error: null };
      } catch (error) {
        if (attempt < maxRetries - 1) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        loginInProgress.current = false;
        loginGraceUntil.current = Date.now() + 5000;
        return { error: new Error("Connection error. Please try again.") };
      }
    }
    loginInProgress.current = false;
    return { error: new Error("Connection error. Please try again.") };
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Registration failed" }));
        return { error: new Error(errData.error || "Registration failed") };
      }

      const data = await response.json();
      const now = Date.now();
      apiClient.setToken(data.access_token);
      sessionStorage.setItem("session_start", now.toString());
      sessionStorage.setItem("last_activity", now.toString());

      setUser(data.user);
      setSession({ access_token: data.access_token });
      setUserRole(null);

      return { error: null };
    } catch (error) {
      return { error: new Error("Connection error. Please try again.") };
    }
  };

  const signOut = async () => {
    clearAuth();
  };

  const handleUnauthorized = () => {
    if (loginInProgress.current) return;
    if (Date.now() < loginGraceUntil.current) return;
    clearAuth();
  };

  const isAdmin = userRole === "admin";
  const isContentCreator = userRole === "content_creator";

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAdmin, 
      isContentCreator,
      userRole,
      isLoading, 
      showInactivityWarning,
      inactivityCountdown,
      signIn, 
      signUp, 
      signOut,
      handleUnauthorized,
      continueSession,
      recordActivity,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
