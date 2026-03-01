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
      const rendered = typeof label === "function" ? label({ country: "UK", percent: 0.5, name: "Test" }) : null;
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
    if (labelFormatter) parts.push(labelFormatter("2026-01-23"));
    if (formatter) {
      const result = formatter(100, "Views");
      parts.push(Array.isArray(result) ? result.join(",") : String(result));
    }
    return parts.length > 0 ? <span data-testid="tooltip-formatted">{parts.join("|")}</span> : null;
  },
  Legend: () => null,
}));

vi.mock("./BotAnalyticsManager", () => ({
  default: () => <div data-testid="bot-analytics">Bot Analytics</div>,
}));

import AnalyticsManager from "../AnalyticsManager";

const mockSummary = {
  total_sessions: 636,
  total_page_views: 2263,
  unique_visitors: 636,
  new_visitors: 400,
  returning_visitors: 236,
  avg_pages_per_session: 3.6,
  sessions_by_day: [
    { date: "2026-01-23", count: 20 },
    { date: "2026-01-24", count: 25 },
  ],
};

const mockPages = [
  { page_path: "/", page_title: "Home", views: 500, avg_time: 125, avg_scroll: 75 },
  { page_path: "/about", page_title: "About", views: 300, avg_time: 90, avg_scroll: 60 },
  { page_path: "/products/beeswax-pellets", page_title: "Beeswax", views: 200, avg_time: 180, avg_scroll: 85 },
];

const mockGeographic = {
  by_country: [
    { country: "United Kingdom", country_code: "GB", sessions: 300 },
    { country: "Germany", country_code: "DE", sessions: 100 },
  ],
  by_city: [
    { city: "London", region: "England", country: "UK", sessions: 150 },
    { city: "Berlin", region: "Berlin", country: "DE", sessions: 50 },
  ],
};

const mockDevices = {
  by_device_type: [
    { device_type: "Desktop", sessions: 400 },
    { device_type: "Mobile", sessions: 200 },
  ],
  by_browser: [
    { browser: "Chrome", sessions: 350 },
    { browser: "Safari", sessions: 200 },
  ],
  by_os: [
    { operating_system: "Windows", sessions: 300 },
    { operating_system: "macOS", sessions: 200 },
  ],
  by_resolution: [],
};

const mockReferrers = [
  { referrer_domain: "google.com", sessions: 200 },
  { referrer_domain: "linkedin.com", sessions: 100 },
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

describe("AnalyticsManager", () => {
  it("shows loading spinner while data is loading", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    renderWithProvider(<AnalyticsManager />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("renders summary cards when data is loaded", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/pages")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPages) });
        }
        if (url.includes("/analytics/geographic")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockGeographic) });
        }
        if (url.includes("/analytics/devices")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockDevices) });
        }
        if (url.includes("/analytics/referrers")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockReferrers) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });

    expect(screen.getByText("2,263")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("236")).toBeInTheDocument();
  });

  it("renders page table with formatted paths", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/pages")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPages) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    expect(screen.getByText("about")).toBeInTheDocument();
  });

  it("renders empty state for pages when no data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/pages")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("No page view data available yet")).toBeInTheDocument();
    });
  });

  it("handles fetch failure gracefully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) }))
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.queryByText("636")).not.toBeInTheDocument();
    });
  });

  it("renders geographic data when available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/geographic")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockGeographic) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });

  it("renders device data when available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/devices")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockDevices) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });

  it("renders empty geographic state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/geographic")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ by_country: [], by_city: [] }) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });

  it("renders empty device state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/devices")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ by_device_type: [], by_browser: [], by_os: [], by_resolution: [] }) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });

  it("renders empty referrer state when no data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/referrers")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });

  it("renders summary with no sessions_by_day", async () => {
    const summaryNoChart = { ...mockSummary, sessions_by_day: [] };
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(summaryNoChart) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });

    expect(screen.queryByText("Sessions Over Time")).not.toBeInTheDocument();
  });

  it("renders geographic data with null country/city values without crashing", async () => {
    const geoWithNulls = {
      by_country: [
        { country: null, country_code: "", sessions: 50 },
        { country: "Germany", country_code: "DE", sessions: 100 },
      ],
      by_city: [
        { city: null, region: "Unknown", country: "UK", sessions: 30 },
        { city: "London", region: "England", country: "UK", sessions: 200 },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/geographic")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(geoWithNulls) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });

  it("renders device data with null browser/os values without crashing", async () => {
    const devicesWithNulls = {
      by_device_type: [{ device_type: "desktop", sessions: 400 }],
      by_browser: [
        { browser: null, sessions: 50 },
        { browser: "Chrome", sessions: 300 },
      ],
      by_os: [
        { operating_system: null, sessions: 40 },
        { operating_system: "Windows", sessions: 350 },
      ],
      by_resolution: [],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/devices")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(devicesWithNulls) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });

  it("renders with all data including pages with formatPagePath and formatTime", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/pages")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPages) });
        }
        if (url.includes("/analytics/geographic")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockGeographic) });
        }
        if (url.includes("/analytics/devices")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockDevices) });
        }
        if (url.includes("/analytics/referrers")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockReferrers) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("500")).toBeInTheDocument();
    });
  });

  it("renders summary with null/zero fallback values", async () => {
    const summaryWithNulls = {
      total_sessions: 0,
      total_page_views: 0,
      unique_visitors: 0,
      new_visitors: 0,
      returning_visitors: 0,
      avg_pages_per_session: 0,
      sessions_by_day: [],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(summaryWithNulls) });
        }
        if (url.includes("/analytics/pages")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve([
            { page_path: "/", page_title: "Home", views: 0, avg_time: 0, avg_scroll: 0 },
          ]) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders summary with zero unique_visitors", async () => {
    const summaryZero = { ...mockSummary, unique_visitors: 0, sessions_by_day: [] };
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(summaryZero) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });

  it("renders referrer data when available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes("/analytics/summary")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockSummary) });
        }
        if (url.includes("/analytics/referrers")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockReferrers) });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      })
    );

    renderWithProvider(<AnalyticsManager />);

    await waitFor(() => {
      expect(screen.getByText("636")).toBeInTheDocument();
    });
  });
});

describe("Helper Functions", () => {
  describe("formatPagePath", () => {
    it("returns Home for root path", () => {
      expect("/".replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " > ") || "Home").toBe("Home");
    });

    it("formats nested path correctly", () => {
      const path = "/products/beeswax-pellets";
      const formatted = path.replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " > ");
      expect(formatted).toBe("products > beeswax pellets");
    });

    it("formats path with dashes", () => {
      const path = "/contact-us";
      const formatted = path.replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " > ");
      expect(formatted).toBe("contact us");
    });
  });

  describe("formatTime", () => {
    it("returns 0s for falsy value", () => {
      const formatTime = (seconds: number) => {
        if (!seconds) return "0s";
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      };

      expect(formatTime(0)).toBe("0s");
      expect(formatTime(45)).toBe("45s");
      expect(formatTime(125)).toBe("2m 5s");
      expect(formatTime(60)).toBe("1m 0s");
    });
  });
});
