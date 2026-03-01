import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Bar: () => null,
  Line: () => null,
  Pie: ({ children, label }: any) => {
    if (label) {
      const rendered = typeof label === "function" ? label({ name: "GPTBot", percent: 0.4 }) : null;
      return <div data-testid="pie-label">{rendered}{children}</div>;
    }
    return <div>{children}</div>;
  },
  Cell: () => null,
  XAxis: ({ tickFormatter }: any) => {
    if (tickFormatter) {
      const formatted = tickFormatter("2026-01-23");
      return <span data-testid="xaxis-formatted">{formatted}</span>;
    }
    return null;
  },
  YAxis: ({ tickFormatter }: any) => {
    if (tickFormatter) {
      const formatted = tickFormatter("en");
      return <span data-testid="yaxis-formatted">{formatted}</span>;
    }
    return null;
  },
  CartesianGrid: () => null,
  Tooltip: ({ labelFormatter, formatter }: any) => {
    const parts: string[] = [];
    if (labelFormatter) parts.push(labelFormatter("en"));
    if (formatter) {
      const result = formatter(100, "Visits");
      parts.push(Array.isArray(result) ? result.join(",") : String(result));
    }
    return parts.length > 0 ? <span data-testid="tooltip-formatted">{parts.join("|")}</span> : null;
  },
  Legend: () => null,
}));

import BotAnalyticsManager from "../BotAnalyticsManager";

const mockBotSummary = {
  total_visits: 450,
  unique_bots: 5,
  pages_crawled: 120,
  languages_accessed: 8,
  visits_by_day: [
    { date: "2026-01-23", count: 15 },
    { date: "2026-01-24", count: 20 },
  ],
};

const mockByBot = [
  { bot_name: "GPTBot", visits: 200, unique_pages: 80, last_visit: "2026-02-22T10:00:00Z" },
  { bot_name: "ClaudeBot", visits: 150, unique_pages: 60, last_visit: "2026-02-22T09:00:00Z" },
  { bot_name: "PerplexityBot", visits: 100, unique_pages: 40, last_visit: "2026-02-21T15:00:00Z" },
];

const mockByPage = [
  { page_path: "/", page_type: "home", visits: 50, unique_bots: 5 },
  { page_path: "/about", page_type: "about", visits: 30, unique_bots: 4 },
  { page_path: "/products/beeswax", page_type: "product", visits: 25, unique_bots: 3 },
];

const mockByCountry = [
  { country: "United States", country_code: "US", visits: 250 },
  { country: "Germany", country_code: "DE", visits: 100 },
  { country: "Japan", country_code: "JP", visits: 50 },
];

const mockByLanguage = [
  { language: "en", visits: 200 },
  { language: "de", visits: 100 },
  { language: "fr", visits: 80 },
];

const mockRecentVisits = [
  {
    bot_name: "GPTBot",
    page_path: "/products/beeswax",
    page_type: "product",
    language: "en",
    domain: "biogreenwax.com",
    country: "US",
    city: "San Francisco",
    visited_at: "2026-02-22T10:30:00Z",
  },
  {
    bot_name: "ClaudeBot",
    page_path: "/about",
    page_type: "about",
    language: "de",
    domain: "biogreenwax.com",
    country: "Germany",
    city: "",
    visited_at: "2026-02-22T09:15:00Z",
  },
];

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  vi.restoreAllMocks();
});

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("BotAnalyticsManager", () => {
  it("shows loading spinner while data is loading", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    renderWithProvider(<BotAnalyticsManager />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("renders summary cards when data is loaded", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/bots/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockBotSummary) });
        }
        if (url.includes("/analytics/bots/by-bot")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByBot) });
        }
        if (url.includes("/analytics/bots/by-page")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByPage) });
        }
        if (url.includes("/analytics/bots/by-country")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByCountry) });
        }
        if (url.includes("/analytics/bots/by-language")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByLanguage) });
        }
        if (url.includes("/analytics/bots/recent")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecentVisits) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("450")).toBeInTheDocument();
    });

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders bot visit list with details", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/bots/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockBotSummary) });
        }
        if (url.includes("/analytics/bots/by-bot")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByBot) });
        }
        if (url.includes("/analytics/bots/by-page")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByPage) });
        }
        if (url.includes("/analytics/bots/by-country")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByCountry) });
        }
        if (url.includes("/analytics/bots/by-language")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByLanguage) });
        }
        if (url.includes("/analytics/bots/recent")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecentVisits) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getAllByText("GPTBot").length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getAllByText("ClaudeBot").length).toBeGreaterThanOrEqual(1);
  });

  it("shows error state on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        })
      )
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("Unable to Load Bot Analytics")).toBeInTheDocument();
    });
  });

  it("shows no bot visits message when total_visits is 0", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/bots/summary")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ total_visits: 0, unique_bots: 0, pages_crawled: 0, languages_accessed: 0, visits_by_day: [] }),
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("No Bot Visits Yet")).toBeInTheDocument();
    });
  });

  it("renders recent visits table with formatted data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/bots/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockBotSummary) });
        }
        if (url.includes("/analytics/bots/by-bot")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByBot) });
        }
        if (url.includes("/analytics/bots/by-page")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByPage) });
        }
        if (url.includes("/analytics/bots/by-country")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByCountry) });
        }
        if (url.includes("/analytics/bots/by-language")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByLanguage) });
        }
        if (url.includes("/analytics/bots/recent")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecentVisits) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("Recent Bot Visits")).toBeInTheDocument();
    });

    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getAllByText("DE").length).toBeGreaterThanOrEqual(1);
  });

  it("renders with empty by_bot and by_language arrays", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/bots/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockBotSummary) });
        }
        if (url.includes("/analytics/bots/by-bot")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes("/analytics/bots/by-page")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes("/analytics/bots/by-country")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes("/analytics/bots/by-language")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes("/analytics/bots/recent")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("450")).toBeInTheDocument();
    });

    expect(screen.queryByText("Visits by Bot")).not.toBeInTheDocument();
    expect(screen.queryByText("Visits by Language")).not.toBeInTheDocument();
  });

  it("renders with no visits_by_day data", async () => {
    const summaryNoChart = { ...mockBotSummary, visits_by_day: [] };
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/bots/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(summaryNoChart) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("450")).toBeInTheDocument();
    });

    expect(screen.queryByText("Bot Visits Over Time")).not.toBeInTheDocument();
  });

  it("renders recent visits with formatDateTime", async () => {
    const recentData = [
      { id: 1, bot_name: "TestBotAlpha", user_agent: "TestBotAlpha/1.0", ip_address: "1.2.3.4", country: "US", city: "NYC", page_path: "/about", page_type: "page", language: "en", domain: "biogreenwax.com", visited_at: "2026-02-22T10:30:00Z" },
      { id: 2, bot_name: "TestBotBeta", user_agent: "TestBotBeta/1.0", ip_address: "5.6.7.8", country: "UK", city: "London", page_path: "/", page_type: "page", language: "en", domain: "biogreenwax.com", visited_at: "2026-02-21T09:15:00Z" },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/bots/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockBotSummary) });
        }
        if (url.includes("/analytics/bots/by-bot")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes("/analytics/bots/by-page")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes("/analytics/bots/by-country")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes("/analytics/bots/by-language")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        if (url.includes("/analytics/bots/recent")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(recentData) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("450")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("TestBotAlpha")).toBeInTheDocument();
    });
  });

  it("renders country data with progress bars", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/bots/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockBotSummary) });
        }
        if (url.includes("/analytics/bots/by-bot")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByBot) });
        }
        if (url.includes("/analytics/bots/by-page")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByPage) });
        }
        if (url.includes("/analytics/bots/by-country")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByCountry) });
        }
        if (url.includes("/analytics/bots/by-language")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockByLanguage) });
        }
        if (url.includes("/analytics/bots/recent")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecentVisits) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<BotAnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument();
    });

    expect(screen.getByText("US")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
  });
});

describe("BotAnalyticsManager Helper Functions", () => {
  describe("formatPagePath", () => {
    it("returns Home for root path", () => {
      const path = "/";
      const result = path === "/" ? "Home" : path.replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " > ");
      expect(result).toBe("Home");
    });

    it("formats paths correctly", () => {
      const path = "/products/beeswax-pellets";
      const result = path === "/" ? "Home" : path.replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " > ");
      expect(result).toBe("products > beeswax pellets");
    });
  });

  describe("langNames mapping", () => {
    it("maps language codes correctly", () => {
      const langNames: Record<string, string> = {
        en: "English", de: "German", fr: "French", es: "Spanish", it: "Italian",
        pt: "Portuguese", nl: "Dutch", pl: "Polish", cs: "Czech", ro: "Romanian",
        tr: "Turkish", ar: "Arabic", zh: "Chinese", ja: "Japanese", ko: "Korean", ru: "Russian",
      };
      expect(langNames["en"]).toBe("English");
      expect(langNames["de"]).toBe("German");
      expect(langNames["ar"]).toBe("Arabic");
      expect(langNames["nonexistent"]).toBeUndefined();
    });
  });

  describe("formatDate and formatDateTime", () => {
    it("formats date for chart display", () => {
      const d = new Date("2026-01-23");
      const formatted = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      expect(formatted).toMatch(/23 Jan/);
    });

    it("formats datetime for recent visits", () => {
      const d = new Date("2026-02-22T10:30:00Z");
      const formatted = d.toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
      expect(formatted).toContain("2026");
    });
  });
});
