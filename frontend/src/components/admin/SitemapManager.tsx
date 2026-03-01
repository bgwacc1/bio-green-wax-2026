import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, FileText, Shield, Globe, AlertTriangle, CheckCircle, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  hreflangCount: number;
}

function parseSitemapXml(xmlText: string): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");

  if (doc.querySelector("parsererror")) {
    console.error("Failed to parse sitemap XML");
    return urls;
  }

  const urlElements = doc.querySelectorAll("url");

  urlElements.forEach((urlEl) => {
    const loc = urlEl.querySelector("loc")?.textContent || "";
    const lastmod = urlEl.querySelector("lastmod")?.textContent || undefined;
    const changefreq = urlEl.querySelector("changefreq")?.textContent || undefined;
    const priority = urlEl.querySelector("priority")?.textContent || undefined;
    const hreflangLinks = urlEl.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "link");
    urls.push({ loc, lastmod, changefreq, priority, hreflangCount: hreflangLinks.length });
  });

  return urls;
}

function parseRobotsTxt(text: string): { rules: { directive: string; value: string }[]; sitemapUrl?: string } {
  const lines = text.split("\n").filter((l) => l.trim());
  const rules: { directive: string; value: string }[] = [];
  let sitemapUrl: string | undefined;

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const directive = line.substring(0, colonIdx).trim();
    const value = line.substring(colonIdx + 1).trim();
    if (directive.toLowerCase() === "sitemap") {
      sitemapUrl = value;
    } else {
      rules.push({ directive, value });
    }
  }

  return { rules, sitemapUrl };
}

function UrlTable({ urls, title }: { urls: SitemapUrl[]; title: string }) {
  const productUrls = urls.filter((u) => u.loc.includes("/products/"));
  const sectorUrls = urls.filter((u) => u.loc.includes("/sectors/"));
  const newsUrls = urls.filter((u) => u.loc.includes("/news/"));
  const staticUrls = urls.filter(
    (u) => !u.loc.includes("/products/") && !u.loc.includes("/sectors/") && !u.loc.includes("/news/")
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Badge variant="outline">{urls.length} URLs</Badge>
      </div>
      <div className="space-y-4">
        <UrlGroup label="Static Pages" urls={staticUrls} />
        {productUrls.length > 0 && <UrlGroup label="Products" urls={productUrls} />}
        {sectorUrls.length > 0 && <UrlGroup label="Sectors" urls={sectorUrls} />}
        {newsUrls.length > 0 && <UrlGroup label="News Articles" urls={newsUrls} />}
      </div>
    </div>
  );
}

function UrlGroup({ label, urls }: { label: string; urls: SitemapUrl[] }) {
  const [expanded, setExpanded] = useState(label === "Static Pages");

  return (
    <div className="border rounded-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        <span>{label}</span>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{urls.length}</Badge>
          <span className="text-xs text-muted-foreground">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>
      {expanded && (
        <div className="border-t divide-y max-h-[400px] overflow-y-auto">
          {urls.map((url, i) => (
            <div key={i} className="px-3 py-2 text-xs hover:bg-muted/30">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-blue-700 truncate flex-1">
                  {(() => { try { return new URL(url.loc).pathname; } catch { return url.loc; } })()}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {url.priority && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {url.priority}
                    </Badge>
                  )}
                  {url.changefreq && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {url.changefreq}
                    </Badge>
                  )}
                  {url.hreflangCount > 0 && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      <Globe className="h-2.5 w-2.5 mr-0.5" />
                      {url.hreflangCount}
                    </Badge>
                  )}
                </div>
              </div>
              {url.lastmod && (
                <span className="text-muted-foreground mt-0.5 block">Modified: {url.lastmod}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SitemapManager() {
  const {
    data: dynamicSitemap,
    isLoading: sitemapLoading,
    refetch: refetchSitemap,
  } = useQuery({
    queryKey: ["admin-sitemap-dynamic"],
    queryFn: async () => {
      const res = await fetch("/api/sitemap.xml");
      if (!res.ok) throw new Error("Failed to fetch dynamic sitemap");
      return res.text();
    },
    staleTime: 30_000,
  });

  const { data: fallbackSitemap, isLoading: fallbackLoading } = useQuery({
    queryKey: ["admin-sitemap-fallback"],
    queryFn: async () => {
      const res = await fetch("/sitemap-fallback.xml");
      if (!res.ok) throw new Error("Failed to fetch fallback sitemap");
      return res.text();
    },
    staleTime: 60_000,
  });

  const {
    data: robotsTxt,
    isLoading: robotsLoading,
    refetch: refetchRobots,
  } = useQuery({
    queryKey: ["admin-robots-dynamic"],
    queryFn: async () => {
      const res = await fetch("/api/robots.txt");
      if (!res.ok) throw new Error("Failed to fetch robots.txt");
      return res.text();
    },
    staleTime: 30_000,
  });

  const dynamicUrls = dynamicSitemap ? parseSitemapXml(dynamicSitemap) : [];
  const fallbackUrls = fallbackSitemap ? parseSitemapXml(fallbackSitemap) : [];
  const robotsData = robotsTxt ? parseRobotsTxt(robotsTxt) : null;

  const dynamicProductCount = dynamicUrls.filter((u) => u.loc.includes("/products/")).length;
  const dynamicSectorCount = dynamicUrls.filter((u) => u.loc.includes("/sectors/")).length;
  const dynamicNewsCount = dynamicUrls.filter((u) => u.loc.includes("/news/")).length;
  const dynamicStaticCount = dynamicUrls.length - dynamicProductCount - dynamicSectorCount - dynamicNewsCount;

  const handleCopy = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    toast.success(`${label} copied to clipboard`);
  };

  const handleRefresh = () => {
    refetchSitemap();
    refetchRobots();
    toast.success("Refreshed sitemap and robots.txt");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sitemap & Robots.txt</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and compare the dynamic sitemap generated from your database with the static fallback
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total URLs</span>
            </div>
            <p className="text-2xl font-bold">{dynamicUrls.length}</p>
            <p className="text-xs text-muted-foreground">in dynamic sitemap</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">Products</span>
            </div>
            <p className="text-2xl font-bold">{dynamicProductCount}</p>
            <p className="text-xs text-muted-foreground">product pages indexed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium">Fallback URLs</span>
            </div>
            <p className="text-2xl font-bold">{fallbackUrls.length}</p>
            <p className="text-xs text-muted-foreground">in static fallback</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              {dynamicUrls.length > fallbackUrls.length ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              )}
              <span className="text-sm font-medium">Status</span>
            </div>
            <p className="text-sm font-semibold">
              {sitemapLoading
                ? "Loading..."
                : dynamicUrls.length > fallbackUrls.length
                  ? "Dynamic Active"
                  : dynamicUrls.length === fallbackUrls.length
                    ? "Matching"
                    : "Check Required"}
            </p>
            <p className="text-xs text-muted-foreground">
              {dynamicUrls.length > 0
                ? `+${dynamicUrls.length - fallbackUrls.length} extra URLs`
                : "awaiting data"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList>
          <TabsTrigger value="comparison">Sitemap Comparison</TabsTrigger>
          <TabsTrigger value="robots">Robots.txt</TabsTrigger>
          <TabsTrigger value="raw">Raw XML</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Dynamic Sitemap
                  </CardTitle>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">{dynamicStaticCount} static</Badge>
                    <Badge variant="secondary" className="text-xs">{dynamicProductCount} products</Badge>
                    <Badge variant="secondary" className="text-xs">{dynamicSectorCount} sectors</Badge>
                    <Badge variant="secondary" className="text-xs">{dynamicNewsCount} news</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Generated from your database — includes all active products, sectors, and news articles with hreflang alternates
                </p>
              </CardHeader>
              <CardContent>
                {sitemapLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <UrlTable urls={dynamicUrls} title="URLs in Dynamic Sitemap" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    Fallback Sitemap
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">{fallbackUrls.length} static pages only</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Static fallback — served if the database is unavailable. Contains only core pages without dynamic content
                </p>
              </CardHeader>
              <CardContent>
                {fallbackLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <UrlTable urls={fallbackUrls} title="URLs in Fallback Sitemap" />
                )}
              </CardContent>
            </Card>
          </div>

          {dynamicUrls.length > 0 && fallbackUrls.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Coverage Difference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dynamicUrls
                    .filter((du) => !fallbackUrls.some((fu) => fu.loc === du.loc))
                    .slice(0, 20)
                    .map((url, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-[10px] px-1.5">
                          + Dynamic only
                        </Badge>
                        <span className="font-mono text-blue-700">
                          {(() => { try { return new URL(url.loc).pathname; } catch { return url.loc; } })()}
                        </span>
                      </div>
                    ))}
                  {dynamicUrls.filter((du) => !fallbackUrls.some((fu) => fu.loc === du.loc)).length > 20 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ... and {dynamicUrls.filter((du) => !fallbackUrls.some((fu) => fu.loc === du.loc)).length - 20} more
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="robots">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Dynamic robots.txt
                  </CardTitle>
                  {robotsTxt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleCopy(robotsTxt, "robots.txt")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Generated from your database — includes disallow rules for pages marked as no-index in SEO settings
                </p>
              </CardHeader>
              <CardContent>
                {robotsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : robotsData ? (
                  <div className="space-y-3">
                    <div className="border rounded-md divide-y">
                      {robotsData.rules.map((rule, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 text-sm">
                          <Badge
                            variant={rule.directive.toLowerCase() === "allow" ? "default" : "destructive"}
                            className={`text-xs px-2 ${rule.directive.toLowerCase() === "allow" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}
                          >
                            {rule.directive}
                          </Badge>
                          <span className="font-mono text-sm">{rule.value}</span>
                        </div>
                      ))}
                    </div>
                    {robotsData.sitemapUrl && (
                      <div className="flex items-center gap-2 text-sm p-3 bg-blue-50 rounded-md">
                        <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-blue-800 font-mono text-xs break-all">{robotsData.sitemapUrl}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-600">Failed to load robots.txt</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  Static Fallback robots.txt
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Served if the API is unavailable — basic bot-friendly rules
                </p>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted/50 rounded-md p-3 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
{`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://biogreenwax.com/sitemap.xml`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="raw">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Dynamic sitemap.xml</CardTitle>
                  {dynamicSitemap && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleCopy(dynamicSitemap, "Dynamic sitemap.xml")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted/50 rounded-md p-3 text-[11px] font-mono whitespace-pre overflow-auto max-h-[500px] leading-relaxed">
                  {sitemapLoading ? "Loading..." : dynamicSitemap || "Failed to load"}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Fallback sitemap.xml</CardTitle>
                  {fallbackSitemap && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleCopy(fallbackSitemap, "Fallback sitemap.xml")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted/50 rounded-md p-3 text-[11px] font-mono whitespace-pre overflow-auto max-h-[500px] leading-relaxed">
                  {fallbackLoading ? "Loading..." : fallbackSitemap || "Failed to load"}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
