import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Bot, Eye, Globe, Languages, FileText } from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#14b8a6"];

interface BotSummary {
  total_visits: number;
  unique_bots: number;
  pages_crawled: number;
  languages_accessed: number;
  visits_by_day: { date: string; count: number }[];
}

interface BotVisitsByBot {
  bot_name: string;
  visits: number;
  unique_pages: number;
  last_visit: string;
}

interface BotVisitsByPage {
  page_path: string;
  page_type: string;
  visits: number;
  unique_bots: number;
}

interface BotVisitsByCountry {
  country: string;
  country_code: string;
  visits: number;
}

interface BotVisitsByLanguage {
  language: string;
  visits: number;
}

interface RecentBotVisit {
  bot_name: string;
  page_path: string;
  page_type: string;
  language: string;
  domain: string;
  country: string;
  city: string;
  visited_at: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "/api" : "https://www.biogreenwax.com");

const fetchBotAnalytics = async <T,>(endpoint: string): Promise<T> => {
  const response = await fetch(`${BACKEND_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Bot analytics request failed: ${response.status}`);
  }
  return response.json();
};

const BotAnalyticsManager = () => {
  const [days, setDays] = useState("30");

  const { data: summary, isLoading, error: summaryError } = useQuery<BotSummary>({
    queryKey: ["bot-analytics-summary", days],
    queryFn: () => fetchBotAnalytics<BotSummary>(`/analytics/bots/summary?days=${days}`),
    retry: false,
    staleTime: 30000,
  });

  const { data: byBot } = useQuery<BotVisitsByBot[]>({
    queryKey: ["bot-analytics-by-bot", days],
    queryFn: () => fetchBotAnalytics<BotVisitsByBot[]>(`/analytics/bots/by-bot?days=${days}`),
    retry: false,
    staleTime: 30000,
    enabled: !!summary,
  });

  const { data: byPage } = useQuery<BotVisitsByPage[]>({
    queryKey: ["bot-analytics-by-page", days],
    queryFn: () => fetchBotAnalytics<BotVisitsByPage[]>(`/analytics/bots/by-page?days=${days}`),
    retry: false,
    staleTime: 30000,
    enabled: !!summary,
  });

  const { data: byCountry } = useQuery<BotVisitsByCountry[]>({
    queryKey: ["bot-analytics-by-country", days],
    queryFn: () => fetchBotAnalytics<BotVisitsByCountry[]>(`/analytics/bots/by-country?days=${days}`),
    retry: false,
    staleTime: 30000,
    enabled: !!summary,
  });

  const { data: byLanguage } = useQuery<BotVisitsByLanguage[]>({
    queryKey: ["bot-analytics-by-language", days],
    queryFn: () => fetchBotAnalytics<BotVisitsByLanguage[]>(`/analytics/bots/by-language?days=${days}`),
    retry: false,
    staleTime: 30000,
    enabled: !!summary,
  });

  const { data: recentVisits } = useQuery<RecentBotVisit[]>({
    queryKey: ["bot-analytics-recent"],
    queryFn: () => fetchBotAnalytics<RecentBotVisit[]>(`/analytics/bots/recent?limit=25`),
    retry: false,
    staleTime: 30000,
    enabled: !!summary,
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const formatPagePath = (path: string) => {
    if (path === "/") return "Home";
    return path.replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " > ");
  };

  const langNames: Record<string, string> = {
    en: "English", de: "German", fr: "French", es: "Spanish", it: "Italian",
    pt: "Portuguese", nl: "Dutch", pl: "Polish", cs: "Czech", ro: "Romanian",
    tr: "Turkish", ar: "Arabic", zh: "Chinese", ja: "Japanese", ko: "Korean", ru: "Russian",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Bot className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to Load Bot Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {summaryError.message || "There was an error fetching bot analytics data. Please try logging in again."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Bot Analytics</h2>
          <p className="text-muted-foreground">Track AI crawler visits and content indexing</p>
        </div>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bot Visits</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_visits?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Bots</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.unique_bots || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages Crawled</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.pages_crawled || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages Accessed</CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.languages_accessed || 0}</div>
          </CardContent>
        </Card>
      </div>

      {summary?.visits_by_day && summary.visits_by_day.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Bot Visits Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.visits_by_day}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip labelFormatter={formatDate} />
                  <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} name="Visits" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {byBot && byBot.length > 0 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Visits by Bot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byBot} dataKey="visits" nameKey="bot_name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {byBot.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {byBot.map((bot, i) => (
                  <div key={bot.bot_name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium">{bot.bot_name}</span>
                    </div>
                    <div className="flex gap-4 text-muted-foreground">
                      <span>{bot.visits} visits</span>
                      <span>{bot.unique_pages} pages</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {byLanguage && byLanguage.length > 0 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Visits by Language</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byLanguage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={12} />
                    <YAxis dataKey="language" type="category" fontSize={12} width={80} tickFormatter={(val: string) => langNames[val] || val} />
                    <Tooltip formatter={(value: number) => [value, "Visits"]} labelFormatter={(val: string) => langNames[val] || val} />
                    <Bar dataKey="visits" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {byPage && byPage.length > 0 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Most Crawled Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Page</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-right py-2 font-medium">Visits</th>
                      <th className="text-right py-2 font-medium">Bots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byPage.slice(0, 15).map((page) => (
                      <tr key={page.page_path} className="border-b last:border-0">
                        <td className="py-2 max-w-[200px] truncate" title={page.page_path}>{formatPagePath(page.page_path)}</td>
                        <td className="py-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">{page.page_type}</span>
                        </td>
                        <td className="text-right py-2 font-medium">{page.visits}</td>
                        <td className="text-right py-2 text-muted-foreground">{page.unique_bots}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {byCountry && byCountry.length > 0 && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Bot Visits by Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {byCountry.slice(0, 10).map((item) => {
                  const maxVisits = byCountry[0]?.visits || 1;
                  const width = Math.max((item.visits / maxVisits) * 100, 5);
                  return (
                    <div key={item.country_code} className="flex items-center gap-3">
                      <span className="w-6 text-center text-sm">{item.country_code}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.country}</span>
                          <span className="text-sm text-muted-foreground">{item.visits}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {recentVisits && recentVisits.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent Bot Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Bot</th>
                    <th className="text-left py-2 font-medium">Page</th>
                    <th className="text-left py-2 font-medium">Lang</th>
                    <th className="text-left py-2 font-medium">Location</th>
                    <th className="text-left py-2 font-medium">Domain</th>
                    <th className="text-right py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisits.map((visit, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{visit.bot_name}</span>
                      </td>
                      <td className="py-2 max-w-[200px] truncate" title={visit.page_path}>{formatPagePath(visit.page_path)}</td>
                      <td className="py-2">{visit.language?.toUpperCase()}</td>
                      <td className="py-2 text-muted-foreground">{[visit.city, visit.country].filter(Boolean).join(", ") || "-"}</td>
                      <td className="py-2 text-muted-foreground text-xs">{visit.domain}</td>
                      <td className="text-right py-2 text-muted-foreground text-xs whitespace-nowrap">{formatDateTime(visit.visited_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {(!summary?.total_visits || summary.total_visits === 0) && (
        <Card className="bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Bot Visits Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Bot visits will be tracked automatically when AI crawlers (GPTBot, ClaudeBot, etc.) visit your website.
              Make sure your robots.txt allows these bots and the bot-renderer is properly configured.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BotAnalyticsManager;
