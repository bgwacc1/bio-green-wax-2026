import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSignIn = vi.fn();
const mockAuthContext = {
  user: null as any,
  session: null,
  isAdmin: false,
  isContentCreator: false,
  userRole: null,
  isLoading: false,
  showInactivityWarning: false,
  inactivityCountdown: 30,
  signIn: mockSignIn,
  signUp: vi.fn(),
  signOut: vi.fn(),
  handleUnauthorized: vi.fn(),
  continueSession: vi.fn(),
  recordActivity: vi.fn(),
};

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockAuthContext,
}));

vi.mock("@/components/layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import AdminLogin from "../AdminLogin";

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthContext.user = null;
  mockAuthContext.isAdmin = false;
  mockAuthContext.isContentCreator = false;
  mockAuthContext.isLoading = false;
});

describe("AdminLogin", () => {
  const renderLogin = () =>
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );

  it("renders login form with email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders admin login title", () => {
    renderLogin();
    expect(screen.getByText(/admin login/i)).toBeInTheDocument();
  });

  it("shows loading spinner when authLoading is true", () => {
    mockAuthContext.isLoading = true;
    renderLogin();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
  });

  it("redirects admin user to /admin", () => {
    mockAuthContext.user = { id: "1", email: "admin@test.com", roles: ["admin"] };
    mockAuthContext.isAdmin = true;
    renderLogin();
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  it("redirects content creator to /creator", () => {
    mockAuthContext.user = { id: "2", email: "creator@test.com", roles: ["content_creator"] };
    mockAuthContext.isContentCreator = true;
    renderLogin();
    expect(mockNavigate).toHaveBeenCalledWith("/creator");
  });

  it("submits form with email and password", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ error: null });
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "admin@biogreenwax.com");
    await user.type(screen.getByLabelText(/password/i), "Admin123!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignIn).toHaveBeenCalledWith("admin@biogreenwax.com", "Admin123!");
  });

  it("navigates to /admin on successful login", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ error: null });
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "admin@test.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin", { replace: true });
    });
  });

  it("displays error message on failed login", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ error: { message: "Invalid credentials" } });
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "wrong@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("shows loading state on submit button", async () => {
    const user = userEvent.setup();
    let resolveSignIn: any;
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => { resolveSignIn = resolve; })
    );
    renderLogin();

    await user.type(screen.getByLabelText(/email/i), "admin@test.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByRole("button")).toBeDisabled();

    resolveSignIn({ error: null });
  });
});
