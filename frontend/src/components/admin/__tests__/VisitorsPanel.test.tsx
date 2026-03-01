import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

vi.mock("@/lib/api", () => {
  const mockGet = vi.fn();
  return {
    default: { get: mockGet },
    apiClient: { get: mockGet },
  };
});

import apiClient from "@/lib/api";
import VisitorsPanel from "../VisitorsPanel";

const mockGet = apiClient.get as ReturnType<typeof vi.fn>;

const mockOverview = {
  headline: {
    total_sessions: 631,
    unique_visitors: 500,
    fresh_visitors: 340,
    repeat_visitors: 160,
    total_page_views: 2322,
  },
  daily_trend: [
    { day: "2026-02-19", visits: 33, uniques: 30 },
    { day: "2026-02-20", visits: 39, uniques: 35 },
    { day: "2026-02-21", visits: 23, uniques: 20 },
  ],
  top_pages: [
    { page_path: "/news", page_title: "News - Bio Green Wax", hits: 125, avg_seconds: 96 },
    { page_path: "/about", page_title: "About - Bio Green Wax", hits: 111, avg_seconds: 97 },
    { page_path: "/products/base-oils", page_title: "Base Oils", hits: 115, avg_seconds: 93 },
  ],
  countries: [
    { country: "Japan", country_code: "JP", visits: 48 },
    { country: "United Kingdom", country_code: "GB", visits: 41 },
  ],
  cities: [
    { city: "London", country: "United Kingdom", visits: 17 },
    { city: "Tokyo", country: "Japan", visits: 15 },
  ],
  devices: [
    { device_type: "desktop", count: 387 },
    { device_type: "mobile", count: 165 },
    { device_type: "tablet", count: 79 },
  ],
  browsers: [
    { browser: "Chrome", count: 307 },
    { browser: "Safari", count: 171 },
  ],
  operating_systems: [
    { operating_system: "Windows 10", count: 240 },
    { operating_system: "macOS", count: 154 },
  ],
  sources: [
    { referrer_domain: "google.com", count: 93 },
    { referrer_domain: "facebook.com", count: 57 },
  ],
  bots: {
    total_crawls: 437,
    by_name: [
      { bot_name: "GPTBot", crawls: 54 },
      { bot_name: "ClaudeBot", crawls: 54 },
      { bot_name: "GoogleBot", crawls: 49 },
    ],
  },
};

const emptyOverview = {
  headline: { total_sessions: 0, unique_visitors: 0, fresh_visitors: 0, repeat_visitors: 0, total_page_views: 0 },
  daily_trend: [],
  top_pages: [],
  countries: [],
  cities: [],
  devices: [],
  browsers: [],
  operating_systems: [],
  sources: [],
  bots: { total_crawls: 0, by_name: [] },
};

beforeEach(() => {
  mockGet.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockApiSuccess(data: any = mockOverview) {
  mockGet.mockResolvedValue(data);
}

function mockApiError(message = "Request failed") {
  mockGet.mockRejectedValue(new Error(message));
}

describe("VisitorsPanel", () => {
  it("shows loading spinner initially", () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    render(<VisitorsPanel />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("renders headline stats after loading", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("631")).toBeInTheDocument();
    });

    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("2,322")).toBeInTheDocument();
    expect(screen.getByText("340")).toBeInTheDocument();
    expect(screen.getByText("160")).toBeInTheDocument();
  });

  it("renders stat card labels", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("Total Sessions")).toBeInTheDocument();
    });

    expect(screen.getByText("Unique Visitors")).toBeInTheDocument();
    expect(screen.getByText("Page Views")).toBeInTheDocument();
    expect(screen.getByText("New Visitors")).toBeInTheDocument();
    expect(screen.getByText("Returning Visitors")).toBeInTheDocument();
  });

  it("renders new/returning visitor percentages", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("68% of total")).toBeInTheDocument();
    });
    expect(screen.getByText("32% of total")).toBeInTheDocument();
  });

  it("shows error state on fetch failure after retries", async () => {
    mockApiError("Server returned 500");
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("Unable to load visitor data")).toBeInTheDocument();
    }, { timeout: 10000 });
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("retries loading on retry button click", async () => {
    mockApiError("Server down");
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("Retry")).toBeInTheDocument();
    }, { timeout: 10000 });

    mockApiSuccess();
    fireEvent.click(screen.getByText("Retry"));

    await waitFor(() => {
      expect(screen.getByText("631")).toBeInTheDocument();
    });
  });

  it("renders all time range buttons", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("631")).toBeInTheDocument();
    });

    const labels = ["24 Hours", "3 Days", "7 Days", "15 Days", "30 Days", "45 Days", "90 Days"];
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("defaults to 30 Days range", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("631")).toBeInTheDocument();
    });

    expect(mockGet).toHaveBeenCalledWith("/visitors/overview?days=30");
  });

  it("changes time range on button click", async () => {
    mockApiSuccess();
    const user = userEvent.setup();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("631")).toBeInTheDocument();
    });

    mockGet.mockClear();
    mockApiSuccess();

    await user.click(screen.getByTestId("range-7"));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith("/visitors/overview?days=7");
    });
  });

  it("renders the daily trend chart", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("daily-chart")).toBeInTheDocument();
    });

    expect(screen.getByText("Daily Visitors Trend")).toBeInTheDocument();
  });

  it("shows peak day information", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText(/Peak day:/)).toBeInTheDocument();
    });
    expect(screen.getByText(/39 visits/)).toBeInTheDocument();
  });

  it("renders top pages table", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("pages-table")).toBeInTheDocument();
    });

    expect(screen.getByText("Most Visited Pages")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders country data", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("countries-list")).toBeInTheDocument();
    });

    expect(screen.getByText("Visitors by Country")).toBeInTheDocument();
    const countriesList = screen.getByTestId("countries-list");
    expect(countriesList).toHaveTextContent("Japan");
    expect(countriesList).toHaveTextContent("United Kingdom");
  });

  it("renders city data", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("cities-list")).toBeInTheDocument();
    });

    expect(screen.getByText("Visitors by City")).toBeInTheDocument();
    const citiesList = screen.getByTestId("cities-list");
    expect(citiesList).toHaveTextContent("London");
    expect(citiesList).toHaveTextContent("Tokyo");
  });

  it("renders device breakdown", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("devices-list")).toBeInTheDocument();
    });

    expect(screen.getByText("Devices")).toBeInTheDocument();
    expect(screen.getByText(/desktop/i)).toBeInTheDocument();
    expect(screen.getByText(/mobile/i)).toBeInTheDocument();
  });

  it("renders browser breakdown", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("browsers-list")).toBeInTheDocument();
    });

    expect(screen.getByText("Browsers")).toBeInTheDocument();
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("Safari")).toBeInTheDocument();
  });

  it("renders OS breakdown", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("os-list")).toBeInTheDocument();
    });

    expect(screen.getByText("Operating Systems")).toBeInTheDocument();
    expect(screen.getByText("Windows 10")).toBeInTheDocument();
    expect(screen.getByText("macOS")).toBeInTheDocument();
  });

  it("renders traffic sources", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("sources-list")).toBeInTheDocument();
    });

    expect(screen.getByText("Traffic Sources")).toBeInTheDocument();
    expect(screen.getByText("google.com")).toBeInTheDocument();
    expect(screen.getByText("facebook.com")).toBeInTheDocument();
  });

  it("renders AI bot crawl data", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("bots-list")).toBeInTheDocument();
    });

    expect(screen.getByText("AI Bot Crawlers")).toBeInTheDocument();
    expect(screen.getByText("GPTBot")).toBeInTheDocument();
    expect(screen.getByText("ClaudeBot")).toBeInTheDocument();
    expect(screen.getByText("GoogleBot")).toBeInTheDocument();
    expect(screen.getByText("437")).toBeInTheDocument();
  });

  it("shows empty states when data is empty", async () => {
    mockApiSuccess(emptyOverview);
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("No page view data recorded yet")).toBeInTheDocument();
    });

    expect(screen.getByText("No referral sources detected — visitors are coming directly")).toBeInTheDocument();
    expect(screen.getByText("No location data available")).toBeInTheDocument();
    expect(screen.getByText("No city data available")).toBeInTheDocument();
    expect(screen.getByText("No device data")).toBeInTheDocument();
    expect(screen.getByText("No browser data")).toBeInTheDocument();
    expect(screen.getByText("No OS data")).toBeInTheDocument();
    expect(screen.getByText("No AI bot visits detected in this period")).toBeInTheDocument();
  });

  it("calls apiClient.get with the correct endpoint", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalled();
    });

    expect(mockGet).toHaveBeenCalledWith("/visitors/overview?days=30");
  });

  it("handles network error gracefully after retries", async () => {
    mockApiError("Network error");
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("Unable to load visitor data")).toBeInTheDocument();
    }, { timeout: 10000 });
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("retries automatically on first failure then succeeds", async () => {
    mockGet.mockRejectedValueOnce(new Error("Temporary failure")).mockResolvedValueOnce(mockOverview);
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("631")).toBeInTheDocument();
    }, { timeout: 10000 });

    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it("prettifies page paths correctly", async () => {
    const dataWithHomepage = {
      ...mockOverview,
      top_pages: [
        { page_path: "/", page_title: "Home", hits: 100, avg_seconds: 50 },
        { page_path: "/products/base-oils", page_title: "Base Oils", hits: 80, avg_seconds: 60 },
      ],
    };
    mockApiSuccess(dataWithHomepage);
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("Homepage")).toBeInTheDocument();
    });
    expect(screen.getByText("Products / Base oils")).toBeInTheDocument();
  });

  it("formats time durations correctly", async () => {
    const dataWithLongTime = {
      ...mockOverview,
      top_pages: [
        { page_path: "/long-page", page_title: "Long", hits: 50, avg_seconds: 125 },
        { page_path: "/short-page", page_title: "Short", hits: 40, avg_seconds: 45 },
      ],
    };
    mockApiSuccess(dataWithLongTime);
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText("2m 5s")).toBeInTheDocument();
    });
    expect(screen.getByText("45s")).toBeInTheDocument();
  });

  it("shows 'Frontend only' subtitle on page views card", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByText(/excl\. admin/i)).toBeInTheDocument();
    });
  });

  it("renders bar heights for daily chart bars", async () => {
    mockApiSuccess();
    render(<VisitorsPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("daily-chart")).toBeInTheDocument();
    });

    const chart = screen.getByTestId("daily-chart");
    const bars = chart.querySelectorAll("[style]");
    expect(bars.length).toBeGreaterThan(0);
  });

  it("handles zero unique visitors for percentages", async () => {
    const zeroVisitors = {
      ...mockOverview,
      headline: {
        total_sessions: 0,
        unique_visitors: 0,
        fresh_visitors: 0,
        repeat_visitors: 0,
        total_page_views: 0,
      },
    };
    mockApiSuccess(zeroVisitors);
    render(<VisitorsPanel />);

    await waitFor(() => {
      const dashes = screen.getAllByText("–");
      expect(dashes.length).toBeGreaterThanOrEqual(2);
    });
  });
});
