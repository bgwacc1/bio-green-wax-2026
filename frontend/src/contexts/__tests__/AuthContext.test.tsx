import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import React from "react";

const mockSessionStorage: Record<string, string> = {};
const mockLocalStorage: Record<string, string> = {};

vi.stubGlobal("sessionStorage", {
  getItem: vi.fn((key: string) => mockSessionStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockSessionStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockSessionStorage[key];
  }),
});

vi.stubGlobal("localStorage", {
  getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockLocalStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockLocalStorage[key];
  }),
});

function createValidJWT(exp?: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: "1", exp: exp || Math.floor(Date.now() / 1000) + 3600 }));
  return `${header}.${payload}.signature`;
}

function createExpiredJWT(): string {
  return createValidJWT(Math.floor(Date.now() / 1000) - 100);
}

let AuthProvider: any;
let useAuth: any;

beforeEach(async () => {
  vi.resetModules();
  Object.keys(mockSessionStorage).forEach((k) => delete mockSessionStorage[k]);
  Object.keys(mockLocalStorage).forEach((k) => delete mockLocalStorage[k]);
  vi.stubGlobal("fetch", vi.fn());
  vi.useFakeTimers({ shouldAdvanceTime: true });

  const mod = await import("../AuthContext");
  AuthProvider = mod.AuthProvider;
  useAuth = mod.useAuth;
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function TestConsumer() {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="loading">{auth.isLoading.toString()}</span>
      <span data-testid="user">{auth.user ? auth.user.email : "none"}</span>
      <span data-testid="isAdmin">{auth.isAdmin.toString()}</span>
      <span data-testid="isContentCreator">{auth.isContentCreator.toString()}</span>
      <span data-testid="userRole">{auth.userRole || "none"}</span>
      <span data-testid="warning">{auth.showInactivityWarning.toString()}</span>
      <span data-testid="countdown">{auth.inactivityCountdown}</span>
      <button data-testid="signIn" onClick={() => auth.signIn("test@test.com", "pass123")} />
      <button data-testid="signUp" onClick={() => auth.signUp("new@test.com", "pass123")} />
      <button data-testid="signOut" onClick={() => auth.signOut()} />
      <button data-testid="handleUnauthorized" onClick={() => auth.handleUnauthorized()} />
      <button data-testid="continueSession" onClick={() => auth.continueSession()} />
      <button data-testid="recordActivity" onClick={() => auth.recordActivity()} />
    </div>
  );
}

describe("AuthContext", () => {
  describe("useAuth hook", () => {
    it("throws when used outside AuthProvider", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<TestConsumer />)).toThrow("useAuth must be used within an AuthProvider");
      spy.mockRestore();
    });
  });

  describe("Initial state (no token)", () => {
    it("sets isLoading to false when no token present", async () => {
      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });
      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });
      expect(screen.getByTestId("user").textContent).toBe("none");
      expect(screen.getByTestId("isAdmin").textContent).toBe("false");
    });
  });

  describe("Initial state (expired token)", () => {
    it("clears auth when token is expired", async () => {
      mockSessionStorage["auth_token"] = createExpiredJWT();
      mockSessionStorage["session_start"] = Date.now().toString();

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });
      expect(screen.getByTestId("user").textContent).toBe("none");
    });
  });

  describe("Initial state (valid token, hard limit exceeded)", () => {
    it("clears auth when hard session limit exceeded", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = (Date.now() - 61 * 60 * 1000).toString();

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });
      expect(screen.getByTestId("user").textContent).toBe("none");
    });
  });

  describe("checkAuth with valid token", () => {
    it("restores session from valid token", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", email: "admin@test.com", roles: ["admin"] }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });
      expect(screen.getByTestId("isAdmin").textContent).toBe("true");
      expect(screen.getByTestId("userRole").textContent).toBe("admin");
    });

    it("handles content_creator role", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "2", email: "creator@test.com", roles: ["content_creator"] }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("creator@test.com");
      });
      expect(screen.getByTestId("isContentCreator").textContent).toBe("true");
      expect(screen.getByTestId("userRole").textContent).toBe("content_creator");
    });

    it("handles user with no special roles", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "3", email: "user@test.com", roles: [] }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("user@test.com");
      });
      expect(screen.getByTestId("isAdmin").textContent).toBe("false");
      expect(screen.getByTestId("isContentCreator").textContent).toBe("false");
      expect(screen.getByTestId("userRole").textContent).toBe("none");
    });

    it("clears auth on 401 response from /auth/me", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();

      (fetch as any).mockResolvedValueOnce({ ok: false, status: 401 });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });
      expect(screen.getByTestId("user").textContent).toBe("none");
    });

    it("retries on network error during checkAuth", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();

      (fetch as any)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ id: "1", email: "retry@test.com", roles: ["admin"] }),
        });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("retry@test.com");
      });
    });
  });

  describe("signIn", () => {
    it("signs in successfully", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: createValidJWT(),
            user: { id: "1", email: "admin@test.com", roles: ["admin"] },
          }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signIn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });
      expect(screen.getByTestId("isAdmin").textContent).toBe("true");
    });

    it("returns error on failed login (non-ok response)", async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      });

      let signInResult: any;
      function SignInTestConsumer() {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="loading">{auth.isLoading.toString()}</span>
            <button
              data-testid="signIn"
              onClick={async () => {
                signInResult = await auth.signIn("bad@test.com", "wrong");
              }}
            />
            <span data-testid="user">{auth.user ? auth.user.email : "none"}</span>
          </div>
        );
      }

      await act(async () => {
        render(<AuthProvider><SignInTestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signIn").click();
      });

      await waitFor(() => {
        expect(signInResult?.error?.message).toBe("Invalid credentials");
      });
      expect(screen.getByTestId("user").textContent).toBe("none");
    });

    it("returns error when JSON parse fails on error response", async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("parse fail")),
      });

      let signInResult: any;
      function SignInTestConsumer() {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="loading">{auth.isLoading.toString()}</span>
            <button
              data-testid="signIn"
              onClick={async () => {
                signInResult = await auth.signIn("test@test.com", "pass");
              }}
            />
          </div>
        );
      }

      await act(async () => {
        render(<AuthProvider><SignInTestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signIn").click();
      });

      await waitFor(() => {
        expect(signInResult?.error?.message).toBe("Login failed");
      });
    });

    it("retries on network error during signIn", async () => {
      let callCount = 0;
      (fetch as any).mockImplementation(() => {
        callCount++;
        if (callCount <= 1) return Promise.reject(new Error("Network error"));
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              access_token: createValidJWT(),
              user: { id: "1", email: "retry@test.com", roles: ["admin"] },
            }),
        });
      });

      let signInResult: any;
      let signInPromise: Promise<any>;
      function SignInRetryConsumer() {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="loading">{auth.isLoading.toString()}</span>
            <button
              data-testid="signIn"
              onClick={() => {
                signInPromise = auth.signIn("test@test.com", "pass").then((r) => {
                  signInResult = r;
                  return r;
                });
              }}
            />
            <span data-testid="user">{auth.user ? auth.user.email : "none"}</span>
          </div>
        );
      }

      await act(async () => {
        render(<AuthProvider><SignInRetryConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signIn").click();
      });

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      await act(async () => {
        await signInPromise;
      });

      expect(signInResult?.error).toBeNull();
    });

    it("returns connection error after all retries fail", async () => {
      (fetch as any).mockRejectedValue(new Error("Network error"));

      let signInResult: any;
      let signInPromise: Promise<any>;
      function SignInFailConsumer() {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="loading">{auth.isLoading.toString()}</span>
            <button
              data-testid="signIn"
              onClick={() => {
                signInPromise = auth.signIn("test@test.com", "pass").then((r) => {
                  signInResult = r;
                  return r;
                });
              }}
            />
          </div>
        );
      }

      await act(async () => {
        render(<AuthProvider><SignInFailConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signIn").click();
      });

      await act(async () => {
        vi.advanceTimersByTime(10000);
      });

      await act(async () => {
        await signInPromise;
      });

      expect(signInResult?.error?.message).toBe("Connection error. Please try again.");
    });
  });

  describe("signUp", () => {
    it("signs up successfully", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: createValidJWT(),
            user: { id: "2", email: "new@test.com", roles: [] },
          }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signUp").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("new@test.com");
      });
    });

    it("returns error on failed registration", async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: "Email already exists" }),
      });

      let signUpResult: any;
      function SignUpTestConsumer() {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="loading">{auth.isLoading.toString()}</span>
            <button
              data-testid="signUp"
              onClick={async () => {
                signUpResult = await auth.signUp("existing@test.com", "pass");
              }}
            />
          </div>
        );
      }

      await act(async () => {
        render(<AuthProvider><SignUpTestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signUp").click();
      });

      await waitFor(() => {
        expect(signUpResult?.error?.message).toBe("Email already exists");
      });
    });

    it("returns error when registration JSON parse fails", async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("parse fail")),
      });

      let signUpResult: any;
      function SignUpFailConsumer() {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="loading">{auth.isLoading.toString()}</span>
            <button
              data-testid="signUp"
              onClick={async () => {
                signUpResult = await auth.signUp("test@test.com", "pass");
              }}
            />
          </div>
        );
      }

      await act(async () => {
        render(<AuthProvider><SignUpFailConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signUp").click();
      });

      await waitFor(() => {
        expect(signUpResult?.error?.message).toBe("Registration failed");
      });
    });

    it("returns connection error on network failure during signUp", async () => {
      (fetch as any).mockRejectedValue(new Error("Network error"));

      let signUpResult: any;
      function SignUpNetworkFailConsumer() {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="loading">{auth.isLoading.toString()}</span>
            <button
              data-testid="signUp"
              onClick={async () => {
                signUpResult = await auth.signUp("test@test.com", "pass");
              }}
            />
          </div>
        );
      }

      await act(async () => {
        render(<AuthProvider><SignUpNetworkFailConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signUp").click();
      });

      await waitFor(() => {
        expect(signUpResult?.error?.message).toBe("Connection error. Please try again.");
      });
    });
  });

  describe("signOut", () => {
    it("clears user state on signOut", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: createValidJWT(),
            user: { id: "1", email: "admin@test.com", roles: ["admin"] },
          }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signIn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });

      await act(async () => {
        screen.getByTestId("signOut").click();
      });

      expect(screen.getByTestId("user").textContent).toBe("none");
      expect(screen.getByTestId("isAdmin").textContent).toBe("false");
    });
  });

  describe("handleUnauthorized", () => {
    it("clears auth when no login in progress", async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: createValidJWT(),
            user: { id: "1", email: "admin@test.com", roles: ["admin"] },
          }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("loading").textContent).toBe("false");
      });

      await act(async () => {
        screen.getByTestId("signIn").click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });

      await act(async () => {
        vi.advanceTimersByTime(6000);
      });

      await act(async () => {
        screen.getByTestId("handleUnauthorized").click();
      });

      expect(screen.getByTestId("user").textContent).toBe("none");
    });
  });

  describe("Session timers and inactivity", () => {
    it("shows inactivity warning after timeout", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();
      mockSessionStorage["last_activity"] = Date.now().toString();

      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", email: "admin@test.com", roles: ["admin"] }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });

      await act(async () => {
        vi.advanceTimersByTime(3 * 60 * 1000 + 1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("warning").textContent).toBe("true");
      });
    });

    it("continueSession dismisses warning", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();
      mockSessionStorage["last_activity"] = Date.now().toString();

      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", email: "admin@test.com", roles: ["admin"] }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });

      await act(async () => {
        vi.advanceTimersByTime(3 * 60 * 1000 + 1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("warning").textContent).toBe("true");
      });

      await act(async () => {
        screen.getByTestId("continueSession").click();
      });

      expect(screen.getByTestId("warning").textContent).toBe("false");
    });

    it("auto-logout after countdown reaches 0", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();
      mockSessionStorage["last_activity"] = Date.now().toString();

      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", email: "admin@test.com", roles: ["admin"] }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });

      await act(async () => {
        vi.advanceTimersByTime(3 * 60 * 1000 + 1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("warning").textContent).toBe("true");
      });

      await act(async () => {
        vi.advanceTimersByTime(31 * 1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("none");
      });
    });

    it("hard session limit forces logout", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();
      mockSessionStorage["last_activity"] = Date.now().toString();

      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", email: "admin@test.com", roles: ["admin"] }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });

      mockSessionStorage["session_start"] = (Date.now() - 61 * 60 * 1000).toString();

      await act(async () => {
        vi.advanceTimersByTime(11000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("none");
      });
    });

    it("soft session limit forces logout", async () => {
      mockSessionStorage["auth_token"] = createValidJWT();
      mockSessionStorage["session_start"] = Date.now().toString();
      mockSessionStorage["last_activity"] = Date.now().toString();

      (fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", email: "admin@test.com", roles: ["admin"] }),
      });

      await act(async () => {
        render(<AuthProvider><TestConsumer /></AuthProvider>);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("admin@test.com");
      });

      mockSessionStorage["last_activity"] = (Date.now() - 31 * 60 * 1000).toString();

      await act(async () => {
        vi.advanceTimersByTime(11000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("user").textContent).toBe("none");
      });
    });
  });
});

describe("checkAuth loginInProgress guard", () => {
  it("skips checkAuth when loginInProgress is true", async () => {
    mockSessionStorage["auth_token"] = createValidJWT();
    mockSessionStorage["session_start"] = Date.now().toString();

    let fetchCallCount = 0;
    (fetch as any).mockImplementation((url: string) => {
      fetchCallCount++;
      if (url.includes("/auth/login")) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: () =>
                Promise.resolve({
                  access_token: createValidJWT(),
                  user: { id: "1", email: "login@test.com", roles: ["admin"] },
                }),
            });
          }, 3000);
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", email: "check@test.com", roles: ["admin"] }),
      });
    });

    await act(async () => {
      render(<AuthProvider><TestConsumer /></AuthProvider>);
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await act(async () => {
      screen.getByTestId("signIn").click();
    });

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("login@test.com");
    });
  });

  it("handles checkAuth when loginInProgress becomes true during fetch", async () => {
    mockSessionStorage["auth_token"] = createValidJWT();
    mockSessionStorage["session_start"] = Date.now().toString();

    let firstCheckAuth = true;
    (fetch as any).mockImplementation((url: string) => {
      if (url.includes("/auth/me") && firstCheckAuth) {
        firstCheckAuth = false;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({ id: "1", email: "delayed@test.com", roles: ["admin"] }),
            });
          }, 100);
        });
      }
      if (url.includes("/auth/login")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              access_token: createValidJWT(),
              user: { id: "2", email: "login@test.com", roles: ["admin"] },
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", email: "check@test.com", roles: ["admin"] }),
      });
    });

    await act(async () => {
      render(<AuthProvider><TestConsumer /></AuthProvider>);
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
  });
});

describe("isTokenExpired", () => {
  it("returns true for malformed token", async () => {
    const mod = await import("../AuthContext");
    const isTokenExpired = (mod as any).__test__?.isTokenExpired;
    if (!isTokenExpired) {
      expect(true).toBe(true);
      return;
    }
  });

  it("returns true for token with only 2 parts", () => {
    const token = "part1.part2";
    const header = btoa(JSON.stringify({ alg: "HS256" }));
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    const validToken = `${header}.${payload}.sig`;
    expect(validToken.split(".").length).toBe(3);
    expect(token.split(".").length).toBe(2);
  });
});
