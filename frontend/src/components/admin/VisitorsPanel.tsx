import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/api";

const TIME_RANGES = [
  { label: "24 Hours", value: 1 },
  { label: "3 Days", value: 3 },
  { label: "7 Days", value: 7 },
  { label: "15 Days", value: 15 },
  { label: "30 Days", value: 30 },
  { label: "45 Days", value: 45 },
  { label: "90 Days", value: 90 },
] as const;

interface HeadlineData {
  total_sessions: number;
  unique_visitors: number;
  fresh_visitors: number;
  repeat_visitors: number;
  total_page_views: number;
}

interface DailyPoint {
  day: string;
  visits: number;
  uniques: number;
}

interface PageHit {
  page_path: string;
  page_title: string;
  hits: number;
  avg_seconds: number;
}

interface LocationEntry {
  country?: string;
  country_code?: string;
  city?: string;
  visits: number;
}

interface DeviceEntry {
  device_type: string;
  count: number;
}

interface BrowserEntry {
  browser: string;
  count: number;
}

interface OSEntry {
  operating_system: string;
  count: number;
}

interface SourceEntry {
  referrer_domain: string;
  count: number;
}

interface BotEntry {
  bot_name: string;
  crawls: number;
}

interface VisitorsData {
  headline: HeadlineData;
  daily_trend: DailyPoint[];
  top_pages: PageHit[];
  countries: LocationEntry[];
  cities: LocationEntry[];
  devices: DeviceEntry[];
  browsers: BrowserEntry[];
  operating_systems: OSEntry[];
  sources: SourceEntry[];
  bots: {
    total_crawls: number;
    by_name: BotEntry[];
  };
}

const DEVICE_ICONS: Record<string, string> = {
  desktop: "🖥️",
  mobile: "📱",
  tablet: "📋",
  laptop: "💻",
};

function prettifyPath(p: string): string {
  if (!p || p === "/") return "Homepage";
  return p
    .replace(/^\//, "")
    .split("/")
    .map((seg) => seg.replace(/-/g, " "))
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(" / ");
}

function durationLabel(sec: number): string {
  if (!sec || sec <= 0) return "–";
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m ${s}s`;
}

function ProgressRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, 3) : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-sm w-32 truncate shrink-0" title={label}>
        {label}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold w-12 text-right tabular-nums">
        {value}
      </span>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function VisitorsPanel() {
  const [range, setRange] = useState<number>(30);
  const [data, setData] = useState<VisitorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCount = useRef(0);

  const loadData = useCallback(async (days: number) => {
    setLoading(true);
    setError(null);
    const maxRetries = 2;
    let lastError: string = "";

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
        const json = await apiClient.get<VisitorsData>(
          `/api/visitors/overview?days=${days}`,
        );
        setData(json);
        retryCount.current = 0;
        setLoading(false);
        return;
      } catch (err: any) {
        lastError = err.message || "Failed to load visitors data";
      }
    }

    setError(lastError);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(range);
  }, [range, loadData]);

  const handleRangeChange = (days: number) => {
    setRange(days);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 font-medium">Unable to load visitor data</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
        <button
          onClick={() => loadData(range)}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const {
    headline,
    daily_trend,
    top_pages,
    countries,
    cities,
    devices,
    browsers,
    operating_systems,
    sources,
    bots,
  } = data;

  const peakDay =
    daily_trend.length > 0
      ? daily_trend.reduce((a, b) => (b.visits > a.visits ? b : a))
      : null;

  const maxCountryVisits = countries.length > 0 ? countries[0].visits : 1;
  const maxCityVisits = cities.length > 0 ? cities[0].visits : 1;
  const maxDeviceCount =
    devices.length > 0 ? Math.max(...devices.map((d) => d.count)) : 1;
  const maxBrowserCount = browsers.length > 0 ? browsers[0].count : 1;
  const maxOSCount =
    operating_systems.length > 0 ? operating_systems[0].count : 1;
  const maxSourceCount = sources.length > 0 ? sources[0].count : 1;
  const maxBotCrawls = bots.by_name.length > 0 ? bots.by_name[0].crawls : 1;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-1">
          Period:
        </span>
        {TIME_RANGES.map((tr) => (
          <button
            key={tr.value}
            onClick={() => handleRangeChange(tr.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              range === tr.value
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            data-testid={`range-${tr.value}`}
          >
            {tr.label}
          </button>
        ))}
        {loading && (
          <span className="text-xs text-muted-foreground animate-pulse ml-2">
            Updating…
          </span>
        )}
      </div>

      {/* Headline Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Sessions" value={headline.total_sessions} />
        <StatCard title="Unique Visitors" value={headline.unique_visitors} />
        <StatCard
          title="Page Views"
          value={headline.total_page_views}
          subtitle="Frontend only (excl. admin)"
        />
        <StatCard
          title="New Visitors"
          value={headline.fresh_visitors}
          subtitle={
            headline.unique_visitors > 0
              ? `${Math.round((headline.fresh_visitors / headline.unique_visitors) * 100)}% of total`
              : "–"
          }
        />
        <StatCard
          title="Returning Visitors"
          value={headline.repeat_visitors}
          subtitle={
            headline.unique_visitors > 0
              ? `${Math.round((headline.repeat_visitors / headline.unique_visitors) * 100)}% of total`
              : "–"
          }
        />
      </div>

      {/* Daily Trend */}
      {daily_trend.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Daily Visitors Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div
                className="flex items-end gap-1 min-w-[400px] h-40"
                data-testid="daily-chart"
              >
                {daily_trend.map((pt) => {
                  const maxVisits = Math.max(
                    ...daily_trend.map((d) => d.visits),
                    1,
                  );
                  const barH = Math.max((pt.visits / maxVisits) * 100, 2);
                  const dateLabel = new Date(
                    pt.day + "T00:00:00",
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  });
                  return (
                    <div
                      key={pt.day}
                      className="flex-1 flex flex-col items-center justify-end h-full"
                      title={`${dateLabel}: ${pt.visits} visits, ${pt.uniques} unique`}
                    >
                      <span className="text-[10px] text-muted-foreground mb-1">
                        {pt.visits}
                      </span>
                      <div
                        className="w-full bg-emerald-400 rounded-t"
                        style={{ height: `${barH}%`, minHeight: 4 }}
                      />
                      <span className="text-[9px] text-muted-foreground mt-1 rotate-[-45deg] origin-top-left whitespace-nowrap">
                        {dateLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {peakDay && (
              <p className="text-xs text-muted-foreground mt-3">
                Peak day:{" "}
                {new Date(peakDay.day + "T00:00:00").toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" },
                )}{" "}
                with {peakDay.visits} visits
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Most Visited Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {top_pages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="pages-table">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2 font-medium">Page</th>
                      <th className="text-right py-2 font-medium">Views</th>
                      <th className="text-right py-2 font-medium hidden sm:table-cell">
                        Avg Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {top_pages.map((pg, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td
                          className="py-2 truncate max-w-[220px]"
                          title={pg.page_path}
                        >
                          {prettifyPath(pg.page_path)}
                        </td>
                        <td className="text-right py-2 tabular-nums">
                          {pg.hits}
                        </td>
                        <td className="text-right py-2 hidden sm:table-cell tabular-nums">
                          {durationLabel(pg.avg_seconds)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No page view data recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {sources.length > 0 ? (
              <div className="space-y-1" data-testid="sources-list">
                {sources.map((s, i) => (
                  <ProgressRow
                    key={i}
                    label={s.referrer_domain}
                    value={s.count}
                    max={maxSourceCount}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No referral sources detected — visitors are coming directly
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Location Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Visitors by Country</CardTitle>
          </CardHeader>
          <CardContent>
            {countries.length > 0 ? (
              <div className="space-y-1" data-testid="countries-list">
                {countries.map((c, i) => (
                  <ProgressRow
                    key={i}
                    label={`${c.country_code || "?"} ${c.country || "Unknown"}`}
                    value={c.visits}
                    max={maxCountryVisits}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No location data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Visitors by City</CardTitle>
          </CardHeader>
          <CardContent>
            {cities.length > 0 ? (
              <div className="space-y-1" data-testid="cities-list">
                {cities.map((c, i) => (
                  <ProgressRow
                    key={i}
                    label={`${c.city || "Unknown"}, ${c.country || ""}`}
                    value={c.visits}
                    max={maxCityVisits}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No city data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Devices & Tech Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {devices.length > 0 ? (
              <div className="space-y-1" data-testid="devices-list">
                {devices.map((d, i) => (
                  <ProgressRow
                    key={i}
                    label={`${DEVICE_ICONS[d.device_type?.toLowerCase()] || "🔹"} ${d.device_type || "Other"}`}
                    value={d.count}
                    max={maxDeviceCount}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No device data
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            {browsers.length > 0 ? (
              <div className="space-y-1" data-testid="browsers-list">
                {browsers.map((b, i) => (
                  <ProgressRow
                    key={i}
                    label={b.browser || "Unknown"}
                    value={b.count}
                    max={maxBrowserCount}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No browser data
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Operating Systems</CardTitle>
          </CardHeader>
          <CardContent>
            {operating_systems.length > 0 ? (
              <div className="space-y-1" data-testid="os-list">
                {operating_systems.map((o, i) => (
                  <ProgressRow
                    key={i}
                    label={o.operating_system || "Unknown"}
                    value={o.count}
                    max={maxOSCount}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No OS data
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Bots Section */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-base">AI Bot Crawlers</CardTitle>
        </CardHeader>
        <CardContent>
          {bots.by_name.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                Total bot crawls in this period:{" "}
                <span className="font-semibold text-foreground">
                  {bots.total_crawls.toLocaleString()}
                </span>
              </p>
              <div className="space-y-1" data-testid="bots-list">
                {bots.by_name.map((b, i) => (
                  <ProgressRow
                    key={i}
                    label={b.bot_name}
                    value={b.crawls}
                    max={maxBotCrawls}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No AI bot visits detected in this period
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
