import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Users,
  Eye,
  Globe,
  Monitor,
  Clock,
  TrendingUp,
  MapPin,
  Smartphone,
  ArrowUpRight,
  Compass,
  Laptop,
  Bot,
} from "lucide-react";
import BotAnalyticsManager from "./BotAnalyticsManager";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

interface AnalyticsSummary {
  total_sessions: number;
  total_page_views: number;
  unique_visitors: number;
  new_visitors: number;
  returning_visitors: number;
  avg_pages_per_session: number;
  sessions_by_day: { date: string; count: number }[];
}

interface PageStats {
  page_path: string;
  page_title: string;
  views: number;
  avg_time: number;
  avg_scroll: number;
}

interface GeographicData {
  by_country: { country: string; country_code: string; sessions: number }[];
  by_city: {
    city: string;
    region: string;
    country: string;
    sessions: number;
  }[];
}

interface DeviceData {
  by_device_type: { device_type: string; sessions: number }[];
  by_browser: { browser: string; sessions: number }[];
  by_os: { operating_system: string; sessions: number }[];
  by_resolution: {
    screen_width: number;
    screen_height: number;
    sessions: number;
  }[];
}

interface ReferrerData {
  referrer_domain: string;
  sessions: number;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV ? "/api" : "https://www.biogreenwax.com");

const fetchAnalytics = async <T,>(endpoint: string): Promise<T> => {
  const response = await fetch(`${BACKEND_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }
  return response.json();
};

const AnalyticsManager = () => {
  const [days, setDays] = useState("30");
  const [selectedCountry, setSelectedCountry] = useState("all");

  const countryParam =
    selectedCountry !== "all"
      ? `&country=${encodeURIComponent(selectedCountry)}`
      : "";

  const { data: summary, isLoading: summaryLoading } =
    useQuery<AnalyticsSummary>({
      queryKey: ["analytics-summary", days, selectedCountry],
      queryFn: () =>
        fetchAnalytics<AnalyticsSummary>(
          `/api/analytics/summary?days=${days}${countryParam}`,
        ),
      retry: false,
      staleTime: 30000,
    });

  const { data: pages } = useQuery<PageStats[]>({
    queryKey: ["analytics-pages", days, selectedCountry],
    queryFn: () =>
      fetchAnalytics<PageStats[]>(
        `/api/analytics/pages?days=${days}${countryParam}`,
      ),
    retry: false,
    staleTime: 30000,
  });

  const { data: geographic } = useQuery<GeographicData>({
    queryKey: ["analytics-geographic", days, selectedCountry],
    queryFn: () =>
      fetchAnalytics<GeographicData>(
        `/api/analytics/geographic?days=${days}${countryParam}`,
      ),
    retry: false,
    staleTime: 30000,
  });

  const { data: devices } = useQuery<DeviceData>({
    queryKey: ["analytics-devices", days, selectedCountry],
    queryFn: () =>
      fetchAnalytics<DeviceData>(
        `/api/analytics/devices?days=${days}${countryParam}`,
      ),
    retry: false,
    staleTime: 30000,
  });

  const { data: referrers } = useQuery<ReferrerData[]>({
    queryKey: ["analytics-referrers", days, selectedCountry],
    queryFn: () =>
      fetchAnalytics<ReferrerData[]>(
        `/api/analytics/referrers?days=${days}${countryParam}`,
      ),
    retry: false,
    staleTime: 30000,
  });

  const formatPagePath = (path: string) => {
    if (path === "/") return "Home";
    return path.replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " > ");
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-background p-4 sm:p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Website Analytics
          </h2>
          <p className="text-muted-foreground">
            Track visitor behavior and website performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[200px] bg-white">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {geographic?.by_country?.map((c) => (
                <SelectItem key={c.country_code || c.country} value={c.country}>
                  {c.country} ({c.sessions})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_sessions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.unique_visitors || 0} unique visitors
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.total_page_views?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.avg_pages_per_session || 0} per session
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Visitors</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.new_visitors?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.unique_visitors
                ? Math.round(
                    (summary.new_visitors / summary.unique_visitors) * 100,
                  )
                : 0}
              % of visitors
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Returning Visitors
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.returning_visitors?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.unique_visitors
                ? Math.round(
                    (summary.returning_visitors / summary.unique_visitors) *
                      100,
                  )
                : 0}
              % of visitors
            </p>
          </CardContent>
        </Card>
      </div>

      {summary?.sessions_by_day && summary.sessions_by_day.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Sessions Over Time</CardTitle>
            <CardDescription>Daily session counts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={summary.sessions_by_day}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) =>
                    new Date(val).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(val) =>
                    new Date(val).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Sessions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-muted">
          <TabsTrigger value="pages" className="gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Top Pages</span>
          </TabsTrigger>
          <TabsTrigger value="geographic" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Geography</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Devices</span>
          </TabsTrigger>
          <TabsTrigger value="referrers" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            <span className="hidden sm:inline">Sources</span>
          </TabsTrigger>
          <TabsTrigger value="bots" className="gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Bots</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Most Viewed Pages</CardTitle>
              <CardDescription>Pages ranked by total views</CardDescription>
            </CardHeader>
            <CardContent>
              {pages && pages.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pages.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="page_path"
                        type="category"
                        width={150}
                        tickFormatter={formatPagePath}
                      />
                      <Tooltip
                        formatter={(value) => [value, "Views"]}
                        labelFormatter={formatPagePath}
                      />
                      <Bar dataKey="views" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Page</th>
                          <th className="text-right py-2 font-medium">Views</th>
                          <th className="text-right py-2 font-medium hidden sm:table-cell">
                            Avg. Time
                          </th>
                          <th className="text-right py-2 font-medium hidden sm:table-cell">
                            Scroll Depth
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pages.map((page, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td
                              className="py-2 truncate max-w-[200px]"
                              title={page.page_path}
                            >
                              {formatPagePath(page.page_path)}
                            </td>
                            <td className="text-right py-2">{page.views}</td>
                            <td className="text-right py-2 hidden sm:table-cell">
                              {formatTime(page.avg_time)}
                            </td>
                            <td className="text-right py-2 hidden sm:table-cell">
                              {Math.round(page.avg_scroll || 0)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No page view data available yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Visitors by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                {geographic?.by_country && geographic.by_country.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={geographic.by_country.slice(0, 8)}
                          dataKey="sessions"
                          nameKey="country"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ country, percent }) =>
                            `${country} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {geographic.by_country.slice(0, 8).map((_, idx) => (
                            <Cell
                              key={idx}
                              fill={COLORS[idx % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {geographic.by_country.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: COLORS[idx % COLORS.length],
                              }}
                            ></span>
                            {item.country || "Unknown"}
                          </span>
                          <span className="font-medium">{item.sessions}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No geographic data available yet
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Visitors by City
                </CardTitle>
              </CardHeader>
              <CardContent>
                {geographic?.by_city && geographic.by_city.length > 0 ? (
                  <div className="space-y-2">
                    {geographic.by_city.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                      >
                        <div>
                          <span className="font-medium">
                            {item.city || "Unknown"}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {item.region}, {item.country}
                          </span>
                        </div>
                        <span className="font-medium">{item.sessions}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No city data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                {devices?.by_device_type &&
                devices.by_device_type.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={devices.by_device_type}
                          dataKey="sessions"
                          nameKey="device_type"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          label
                        >
                          {devices.by_device_type.map((_, idx) => (
                            <Cell
                              key={idx}
                              fill={COLORS[idx % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No device data available
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Browsers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {devices?.by_browser && devices.by_browser.length > 0 ? (
                  <div className="space-y-2">
                    {devices.by_browser.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                      >
                        <span>{item.browser || "Unknown"}</span>
                        <span className="font-medium">{item.sessions}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No browser data available
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5" />
                  Operating Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                {devices?.by_os && devices.by_os.length > 0 ? (
                  <div className="space-y-2">
                    {devices.by_os.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                      >
                        <span>{item.operating_system || "Unknown"}</span>
                        <span className="font-medium">{item.sessions}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No OS data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrers" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referrers && referrers.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={referrers.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="referrer_domain" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#3b82f6" name="Sessions" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {referrers.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                      >
                        <span>{item.referrer_domain}</span>
                        <span className="font-medium">{item.sessions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No referrer data available yet. Visitors may be coming
                  directly to your site.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <BotAnalyticsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsManager;
