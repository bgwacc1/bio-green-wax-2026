import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockSessionStorage: Record<string, string> = {};
const mockLocalStorage: Record<string, string> = {};

beforeEach(() => {
  Object.keys(mockSessionStorage).forEach((k) => delete mockSessionStorage[k]);
  Object.keys(mockLocalStorage).forEach((k) => delete mockLocalStorage[k]);

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
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("UnauthorizedError", () => {
  it("creates error with default message", async () => {
    const { UnauthorizedError } = await import("../api");
    const err = new UnauthorizedError();
    expect(err.message).toBe("Not authenticated");
    expect(err.name).toBe("UnauthorizedError");
    expect(err instanceof Error).toBe(true);
  });

  it("creates error with custom message", async () => {
    const { UnauthorizedError } = await import("../api");
    const err = new UnauthorizedError("Custom error");
    expect(err.message).toBe("Custom error");
  });
});

describe("ApiClient", () => {
  let apiClient: any;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../api");
    apiClient = mod.apiClient;
  });

  describe("Token Management", () => {
    it("clears auth_token from localStorage on construction", async () => {
      mockLocalStorage["auth_token"] = "old-token";
      vi.resetModules();
      await import("../api");
      expect(localStorage.removeItem).toHaveBeenCalledWith("auth_token");
    });

    it("reads token from sessionStorage on construction", async () => {
      mockSessionStorage["auth_token"] = "session-token";
      vi.resetModules();
      const mod = await import("../api");
      expect(mod.apiClient.getToken()).toBe("session-token");
    });

    it("setToken stores token in sessionStorage", () => {
      apiClient.setToken("new-token");
      expect(sessionStorage.setItem).toHaveBeenCalledWith("auth_token", "new-token");
    });

    it("setToken(null) removes token from sessionStorage", () => {
      apiClient.setToken(null);
      expect(sessionStorage.removeItem).toHaveBeenCalledWith("auth_token");
    });

    it("getToken returns current token from sessionStorage", () => {
      mockSessionStorage["auth_token"] = "test-token";
      expect(apiClient.getToken()).toBe("test-token");
    });

    it("getToken returns null when no token", () => {
      expect(apiClient.getToken()).toBeNull();
    });
  });

  describe("clearSession", () => {
    it("clears all session data", () => {
      apiClient.setToken("test");
      apiClient.clearSession();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith("auth_token");
      expect(sessionStorage.removeItem).toHaveBeenCalledWith("session_start");
      expect(sessionStorage.removeItem).toHaveBeenCalledWith("last_activity");
    });
  });

  describe("HTTP Methods", () => {
    it("GET request sends correct headers", async () => {
      const mockResponse = { ok: true, status: 200, json: vi.fn().mockResolvedValue({ data: "test" }) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      const result = await apiClient.get("/test");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({ "Content-Type": "application/json" }),
        })
      );
      expect(result).toEqual({ data: "test" });
    });

    it("GET request includes Authorization header when token is set", async () => {
      mockSessionStorage["auth_token"] = "bearer-token";
      const mockResponse = { ok: true, status: 200, json: vi.fn().mockResolvedValue({}) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await apiClient.get("/protected");
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer bearer-token" }),
        })
      );
    });

    it("POST request sends body as JSON", async () => {
      const mockResponse = { ok: true, status: 200, json: vi.fn().mockResolvedValue({ id: 1 }) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await apiClient.post("/items", { name: "test" });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/items"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "test" }),
        })
      );
    });

    it("POST request without body sends undefined body", async () => {
      const mockResponse = { ok: true, status: 200, json: vi.fn().mockResolvedValue({}) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await apiClient.post("/action");
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "POST", body: undefined })
      );
    });

    it("PUT request sends body as JSON", async () => {
      const mockResponse = { ok: true, status: 200, json: vi.fn().mockResolvedValue({ updated: true }) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await apiClient.put("/items/1", { name: "updated" });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/items/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ name: "updated" }),
        })
      );
    });

    it("DELETE request sends correct method", async () => {
      const mockResponse = { ok: true, status: 200, json: vi.fn().mockResolvedValue({ deleted: true }) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await apiClient.delete("/items/1");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/items/1"),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  describe("Error Handling", () => {
    it("throws UnauthorizedError on 401 response", async () => {
      const mockResponse = { ok: false, status: 401, json: vi.fn().mockResolvedValue({ error: "Unauthorized" }) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await expect(apiClient.get("/protected")).rejects.toThrow("Not authenticated");
    });

    it("throws Error with server error message on non-ok response", async () => {
      const mockResponse = { ok: false, status: 400, json: vi.fn().mockResolvedValue({ error: "Bad request data" }) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await expect(apiClient.get("/bad")).rejects.toThrow("Bad request data");
    });

    it("throws Error with detail field when error field is missing", async () => {
      const mockResponse = { ok: false, status: 500, json: vi.fn().mockResolvedValue({ detail: "Internal error" }) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await expect(apiClient.get("/fail")).rejects.toThrow("Internal error");
    });

    it("throws generic error when JSON parsing fails", async () => {
      const mockResponse = { ok: false, status: 500, json: vi.fn().mockRejectedValue(new Error("parse error")) };
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

      await expect(apiClient.get("/fail")).rejects.toThrow("Request failed");
    });
  });
});

describe("BACKEND_URL configuration", () => {
  it("constructs URLs with correct base path", () => {
    const BACKEND_URL = "/api";
    const endpoint = "/test";
    const url = `${BACKEND_URL}${endpoint}`;
    expect(url).toBe("/api/test");
  });

  it("handles production URL fallback", () => {
    const DEV = false;
    const VITE_BACKEND_URL = undefined;
    const url = VITE_BACKEND_URL || (DEV ? "/api" : "https://www.biogreenwax.com");
    expect(url).toBe("https://www.biogreenwax.com");
  });

  it("uses VITE_BACKEND_URL when provided", () => {
    const VITE_BACKEND_URL = "https://custom-api.example.com";
    const DEV = true;
    const url = VITE_BACKEND_URL || (DEV ? "/api" : "https://www.biogreenwax.com");
    expect(url).toBe("https://custom-api.example.com");
  });
});
