import type { Plugin, Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

const BOT_USER_AGENTS = [
  'googlebot', 'google-extended', 'google-inspectiontool', 'storebot-google',
  'adsbot-google', 'mediapartners-google', 'feedfetcher-google',
  'bingbot', 'bingpreview', 'msnbot', 'adidxbot',
  'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'sogou',
  'facebookexternalhit', 'facebot', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'applebot', 'pinterestbot',
  'slackbot', 'slack-imgproxy', 'discordbot', 'skypeuripreview',
  'redditbot', 'snapchat', 'vkshare', 'tumblr',
  'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
  'rogerbot', 'screaming frog', 'seositecheckup', 'seobility',
  'serpstatbot', 'zoominfobot', 'dataforseobot',
  'gtmetrix', 'pingdom', 'uptimerobot', 'statuscake',
  'lighthouse', 'chrome-lighthouse', 'pagespeed',
  'w3c_validator', 'w3c-checklink', 'jigsaw',
  'petalbot', 'bytespider', 'yisou', 'qihoobot',
  'gptbot', 'chatgpt', 'chatgpt-user', 'oai-searchbot',
  'claudebot', 'anthropic-ai', 'anthropic',
  'ccbot', 'cohere-ai', 'coherebot',
  'perplexitybot', 'youbot', 'google-gemini',
  'meta-externalagent', 'meta-externalfetcher',
  'amazonbot', 'ai2bot', 'diffbot', 'friendly-spider',
  'seznambot', 'ia_archiver', 'archive.org_bot',
  'sitechecker', 'siteauditbot', 'headlesschrome',
  'wget', 'curl', 'python-requests', 'python-urllib', 'httpx',
  'go-http-client', 'java', 'axios', 'node-fetch', 'undici'
];

const SUPPORTED_LANGUAGES = ['zh', 'es', 'fr', 'ar', 'pt', 'ru', 'de', 'ja', 'sw', 'tr', 'vi', 'ko', 'th', 'it', 'pl'];
const SITE_URL = 'https://biogreenwax.com';
const API_BASE = process.env.BOT_PRERENDER_API_BASE || 'http://localhost:8080';

interface CacheEntry {
  html: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000;

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function isPageRequest(url: string): boolean {
  if (url.startsWith('/api') || url.startsWith('/@') || url.startsWith('/src') ||
      url.startsWith('/node_modules') || url.startsWith('/__') ||
      url.includes('.js') || url.includes('.css') || url.includes('.png') ||
      url.includes('.jpg') || url.includes('.jpeg') || url.includes('.svg') ||
      url.includes('.ico') || url.includes('.woff') || url.includes('.ttf') ||
      url.includes('.map') || url.includes('.json') ||
      url === '/robots.txt' || url === '/robot.txt' || url === '/sitemap.xml') {
    return false;
  }
  return true;
}

function parsePath(url: string): { lang: string; path: string } {
  const cleanUrl = url.split('?')[0].split('#')[0];
  const langMatch = cleanUrl.match(/^\/(zh|es|fr|ar|pt|ru|de|ja|sw|tr|vi|ko|th|it|pl)(\/|$)/);
  if (langMatch) {
    const lang = langMatch[1];
    const rest = cleanUrl.replace(`/${lang}`, '') || '/';
    return { lang, path: rest };
  }
  return { lang: 'en', path: cleanUrl || '/' };
}

async function apiFetch(endpoint: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function escapeHtml(str: any): string {
  if (!str) return '';
  if (typeof str !== 'string') str = String(str);
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function buildOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bio Green Wax Ltd",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.webp`,
    "description": "Leading UK supplier of premium edible oils, plant-based waxes, and industrial waxes.",
    "email": "sales@biogreenwax.com",
    "telephone": "+44 20 7101 3847",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "128 City Road",
      "addressLocality": "London",
      "postalCode": "EC1V 2NX",
      "addressCountry": "GB"
    },
    "sameAs": ["https://www.linkedin.com/company/bio-green-wax-ltd"]
  };
}

function buildLocalBusinessSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Bio Green Wax Ltd",
    "@id": SITE_URL,
    "url": SITE_URL,
    "telephone": "+44 20 7101 3847",
    "email": "sales@biogreenwax.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Unit 7 Westpoint Trading Estate",
      "addressLocality": "London",
      "postalCode": "W3 0RQ",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.5074,
      "longitude": -0.1278
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:30"
    },
    "priceRange": "££"
  };
}

function buildWebSiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Bio Green Wax Ltd",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

function buildBreadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

function buildProductSchema(product: any): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.short_description || '',
    "image": product.image_url ? `${SITE_URL}${product.image_url}` : undefined,
    "brand": { "@type": "Brand", "name": "Bio Green Wax Ltd" },
    "manufacturer": { "@type": "Organization", "name": "Bio Green Wax Ltd" },
    "category": product.category_name || 'Oils & Waxes'
  };
}

function buildArticleSchema(article: any): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.summary || article.excerpt || '',
    "image": article.image_url ? `${SITE_URL}${article.image_url}` : undefined,
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at || article.published_at || article.created_at,
    "author": { "@type": "Organization", "name": "Bio Green Wax Ltd" },
    "publisher": {
      "@type": "Organization",
      "name": "Bio Green Wax Ltd",
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.webp` }
    }
  };
}

function renderNav(lang: string): string {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  return `<nav aria-label="Main navigation">
    <ul>
      <li><a href="${prefix}/">Home</a></li>
      <li><a href="${prefix}/products">Products</a></li>
      <li><a href="${prefix}/about">About Us</a></li>
      <li><a href="${prefix}/news">News</a></li>
      <li><a href="${prefix}/certifications">Certifications</a></li>
      <li><a href="${prefix}/careers">Careers</a></li>
      <li><a href="${prefix}/contact">Contact</a></li>
    </ul>
  </nav>`;
}

function renderFooter(contactInfo: any[]): string {
  let contactHtml = '';
  if (contactInfo && contactInfo.length > 0) {
    contactHtml = contactInfo.map((c: any) => {
      if (c.type === 'email') return `<p>Email: <a href="mailto:${escapeHtml(c.value)}">${escapeHtml(c.value)}</a></p>`;
      if (c.type === 'phone') return `<p>Phone: <a href="tel:${escapeHtml(c.value)}">${escapeHtml(c.value)}</a></p>`;
      if (c.type === 'address') return `<p>Address: ${escapeHtml(c.value)}</p>`;
      return `<p>${escapeHtml(c.label || c.type)}: ${escapeHtml(c.value)}</p>`;
    }).join('\n');
  }
  return `<footer>
    <p>&copy; ${new Date().getFullYear()} Bio Green Wax Ltd. All rights reserved.</p>
    ${contactHtml}
  </footer>`;
}

function buildHtmlDocument(options: {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  lang: string;
  h1: string;
  bodyContent: string;
  schemas: object[];
  contactInfo?: any[];
}): string {
  const {
    title, description, keywords, canonicalUrl,
    ogTitle, ogDescription, ogImage,
    lang, h1, bodyContent, schemas, contactInfo
  } = options;

  const htmlDir = ['ar'].includes(lang) ? 'rtl' : 'ltr';
  const schemasJson = schemas
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');

  const hreflangTags = ['en', ...SUPPORTED_LANGUAGES].map(l => {
    const prefix = l === 'en' ? '' : `/${l}`;
    const path = canonicalUrl.replace(SITE_URL, '');
    return `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${prefix}${path === '/' && l !== 'en' ? '' : path}" />`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${htmlDir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}">` : ''}
  <meta name="author" content="Bio Green Wax Ltd">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  ${hreflangTags}
  <meta property="og:title" content="${escapeHtml(ogTitle || title)}">
  <meta property="og:description" content="${escapeHtml(ogDescription || description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(ogTitle || title)}">
  <meta name="twitter:description" content="${escapeHtml(ogDescription || description)}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  ${schemasJson}
</head>
<body>
  <header>
    <a href="${SITE_URL}" aria-label="Bio Green Wax Ltd">Bio Green Wax Ltd</a>
    ${renderNav(lang)}
  </header>
  <main>
    <h1>${escapeHtml(h1)}</h1>
    ${bodyContent}
  </main>
  ${renderFooter(contactInfo || [])}
</body>
</html>`;
}

async function renderHomepage(lang: string): Promise<string> {
  const [homepage, seo] = await Promise.all([
    apiFetch(`/homepage-data?lang=${lang}`),
    apiFetch(`/seo-page-meta/by-path?path=%2F`)
  ]);

  const title = seo?.title || 'Bio Green Wax Ltd for Edible Oils, fats & Industrial Waxes';
  const description = seo?.description || 'Suppliers of RSPO MB/SG and EUDR-certified palm oil, olein, stearin, and custom soy, rapeseed, coconut, paraffin, micro & slack wax blends for industries.';

  let bodyContent = '';

  if (homepage?.hero_slides?.length > 0) {
    const firstSlide = homepage.hero_slides[0];
    bodyContent += `<section aria-label="Hero">
      <p>${escapeHtml(firstSlide.subtitle || '')}</p>
    </section>\n`;
  }

  if (homepage?.featured_products?.length > 0) {
    bodyContent += `<section aria-label="Featured Products">
      <h2>Our Products</h2>
      <ul>${homepage.featured_products.map((p: any) =>
        `<li><a href="${SITE_URL}/products/${escapeHtml(p.slug || p.id)}">${escapeHtml(p.name)}</a>${p.short_description ? ` - ${escapeHtml(p.short_description)}` : ''}</li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  if (homepage?.sectors?.length > 0) {
    bodyContent += `<section aria-label="Industry Sectors">
      <h2>Industries We Serve</h2>
      <ul>${homepage.sectors.map((s: any) =>
        `<li><a href="${SITE_URL}/sectors/${escapeHtml(s.slug || s.id)}">${escapeHtml(s.name)}</a>${s.description ? ` - ${escapeHtml(s.description.substring(0, 150))}` : ''}</li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  if (homepage?.product_categories?.length > 0) {
    bodyContent += `<section aria-label="Product Categories">
      <h2>Product Categories</h2>
      <ul>${homepage.product_categories.map((c: any) =>
        `<li><a href="${SITE_URL}/products?category=${escapeHtml(c.slug || c.id)}">${escapeHtml(c.name)}</a></li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  if (homepage?.news_articles?.length > 0) {
    bodyContent += `<section aria-label="Latest News">
      <h2>Latest News</h2>
      <ul>${homepage.news_articles.map((n: any) =>
        `<li><a href="${SITE_URL}/news/${escapeHtml(n.slug || n.id)}">${escapeHtml(n.title)}</a>${n.summary ? ` - ${escapeHtml(n.summary.substring(0, 150))}` : ''}</li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  const h1 = homepage?.hero_slides?.[0]?.title || 'Bio Green Wax Ltd - Premium Edible Oils & Industrial Waxes';

  const schemas = [
    buildOrganizationSchema(),
    buildLocalBusinessSchema(),
    buildWebSiteSchema(),
    buildBreadcrumbSchema([{ name: 'Home', url: SITE_URL }])
  ];

  if (homepage?.featured_products?.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Featured Products",
      "numberOfItems": homepage.featured_products.length,
      "itemListElement": homepage.featured_products.slice(0, 10).map((p: any, i: number) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": p.name,
        "url": `${SITE_URL}/products/${p.slug || p.id}`
      }))
    });
  }

  return buildHtmlDocument({
    title, description,
    keywords: seo?.keywords,
    canonicalUrl: SITE_URL,
    ogTitle: seo?.og_title,
    ogDescription: seo?.og_description,
    ogImage: seo?.og_image || `${SITE_URL}/og-image.webp`,
    lang, h1, bodyContent, schemas,
    contactInfo: homepage?.contact_info
  });
}

async function renderProductsPage(lang: string): Promise<string> {
  const [products, categories, seo] = await Promise.all([
    apiFetch(`/products?active_only=true&lang=${lang}`),
    apiFetch(`/product-categories?active_only=true&lang=${lang}`),
    apiFetch(`/seo-page-meta/by-path?path=%2Fproducts`)
  ]);

  const title = seo?.title || 'Products | Bio Green Wax Ltd';
  const description = seo?.description || 'Browse our range of premium edible oils, plant-based waxes, and industrial waxes.';

  let bodyContent = '';

  if (categories?.length > 0) {
    bodyContent += `<section aria-label="Product Categories">
      <h2>Categories</h2>
      <ul>${categories.map((c: any) =>
        `<li>${escapeHtml(c.name)}</li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  if (products?.length > 0) {
    bodyContent += `<section aria-label="Product Listing">
      <h2>All Products</h2>
      <ul>${products.map((p: any) =>
        `<li>
          <a href="${SITE_URL}/products/${escapeHtml(p.slug || p.id)}">${escapeHtml(p.name)}</a>
          ${p.short_description ? `<p>${escapeHtml(p.short_description)}</p>` : ''}
          ${p.category_name ? `<p>Category: ${escapeHtml(p.category_name)}</p>` : ''}
        </li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Products', url: `${SITE_URL}/products` }
    ])
  ];

  if (products?.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Products",
      "numberOfItems": products.length,
      "itemListElement": products.map((p: any, i: number) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": p.name,
        "url": `${SITE_URL}/products/${p.slug || p.id}`
      }))
    });
  }

  return buildHtmlDocument({
    title, description,
    keywords: seo?.keywords,
    canonicalUrl: `${SITE_URL}/products`,
    ogTitle: seo?.og_title,
    ogDescription: seo?.og_description,
    lang,
    h1: 'Our Products - Edible Oils, Waxes & Oleochemicals',
    bodyContent, schemas
  });
}

async function renderProductDetail(slug: string, lang: string): Promise<string | null> {
  const product = await apiFetch(`/products/${encodeURIComponent(slug)}?lang=${lang}`);
  if (!product) return null;

  let bodyContent = `<section aria-label="Product Details">
    ${product.image_url ? `<img src="${SITE_URL}${product.image_url}" alt="${escapeHtml(product.name)}" loading="lazy">` : ''}
    ${product.short_description ? `<p>${escapeHtml(product.short_description)}</p>` : ''}
    ${product.description ? `<div>${escapeHtml(product.description)}</div>` : ''}
    ${product.category_name ? `<p>Category: ${escapeHtml(product.category_name)}</p>` : ''}
  </section>`;

  if (product.specifications && (Array.isArray(product.specifications) ? product.specifications.length > 0 : true)) {
    const specs = Array.isArray(product.specifications)
      ? product.specifications.map((s: any) => `<li>${escapeHtml(s.name || s.label || '')}: ${escapeHtml(s.value || '')}</li>`).join('\n')
      : `<li>${escapeHtml(String(product.specifications))}</li>`;
    bodyContent += `<section aria-label="Specifications">
      <h2>Specifications</h2>
      <ul>${specs}</ul>
    </section>`;
  }

  if (product.applications && (Array.isArray(product.applications) ? product.applications.length > 0 : true)) {
    const apps = Array.isArray(product.applications)
      ? product.applications.map((a: any) => `<li>${escapeHtml(typeof a === 'string' ? a : a.name || a.label || '')}</li>`).join('\n')
      : `<li>${escapeHtml(String(product.applications))}</li>`;
    bodyContent += `<section aria-label="Applications">
      <h2>Applications</h2>
      <ul>${apps}</ul>
    </section>`;
  }

  const schemas = [
    buildOrganizationSchema(),
    buildProductSchema(product),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Products', url: `${SITE_URL}/products` },
      { name: product.name, url: `${SITE_URL}/products/${slug}` }
    ])
  ];

  return buildHtmlDocument({
    title: `${product.name} | Bio Green Wax Ltd`,
    description: product.short_description || product.description?.substring(0, 155) || `${product.name} from Bio Green Wax Ltd`,
    canonicalUrl: `${SITE_URL}/products/${slug}`,
    ogImage: product.image_url ? `${SITE_URL}${product.image_url}` : undefined,
    lang,
    h1: product.name,
    bodyContent, schemas
  });
}

async function renderAboutPage(lang: string): Promise<string> {
  const [aboutContent, directors, seo] = await Promise.all([
    apiFetch(`/about-us-content?lang=${lang}`),
    apiFetch(`/directors?lang=${lang}`),
    apiFetch(`/seo-page-meta/by-path?path=%2Fabout`)
  ]);

  const title = seo?.title || 'About Bio Green Wax Ltd';
  const description = seo?.description || 'Learn about Bio Green Wax Ltd, a leading UK supplier of premium oils and waxes.';

  let bodyContent = '';

  if (aboutContent && Array.isArray(aboutContent)) {
    aboutContent.forEach((section: any) => {
      bodyContent += `<section>
        ${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ''}
        ${section.content ? `<div>${escapeHtml(section.content)}</div>` : ''}
      </section>\n`;
    });
  }

  if (directors?.length > 0) {
    bodyContent += `<section aria-label="Our Team">
      <h2>Our Team</h2>
      <ul>${directors.map((d: any) =>
        `<li>${escapeHtml(d.name)}${d.position ? ` - ${escapeHtml(d.position)}` : ''}${d.bio ? `<p>${escapeHtml(d.bio.substring(0, 200))}</p>` : ''}</li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'About Us', url: `${SITE_URL}/about` }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Bio Green Wax Ltd",
      "url": `${SITE_URL}/about`,
      "mainEntity": buildOrganizationSchema()
    }
  ];

  return buildHtmlDocument({
    title, description,
    keywords: seo?.keywords,
    canonicalUrl: `${SITE_URL}/about`,
    ogTitle: seo?.og_title,
    ogDescription: seo?.og_description,
    lang,
    h1: 'About Bio Green Wax Ltd',
    bodyContent, schemas
  });
}

async function renderNewsPage(lang: string): Promise<string> {
  const [articles, seo] = await Promise.all([
    apiFetch(`/news-articles?published_only=true&lang=${lang}`),
    apiFetch(`/seo-page-meta/by-path?path=%2Fnews`)
  ]);

  const title = seo?.title || 'News & Industry Updates | Bio Green Wax Ltd';
  const description = seo?.description || 'Latest news and industry updates from Bio Green Wax Ltd.';

  let bodyContent = '';

  if (articles?.length > 0) {
    bodyContent += `<section aria-label="News Articles">
      <ul>${articles.map((a: any) =>
        `<li>
          <article>
            <h2><a href="${SITE_URL}/news/${escapeHtml(a.slug || a.id)}">${escapeHtml(a.title)}</a></h2>
            ${a.published_at ? `<time datetime="${a.published_at}">${new Date(a.published_at).toLocaleDateString('en-GB')}</time>` : ''}
            ${a.summary ? `<p>${escapeHtml(a.summary)}</p>` : ''}
          </article>
        </li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'News', url: `${SITE_URL}/news` }
    ])
  ];

  if (articles?.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Bio Green Wax Ltd News",
      "url": `${SITE_URL}/news`,
      "blogPost": articles.slice(0, 10).map((a: any) => ({
        "@type": "BlogPosting",
        "headline": a.title,
        "url": `${SITE_URL}/news/${a.slug || a.id}`,
        "datePublished": a.published_at || a.created_at
      }))
    });
  }

  return buildHtmlDocument({
    title, description,
    keywords: seo?.keywords,
    canonicalUrl: `${SITE_URL}/news`,
    lang,
    h1: 'News & Industry Updates',
    bodyContent, schemas
  });
}

async function renderNewsArticle(slug: string, lang: string): Promise<string | null> {
  const article = await apiFetch(`/news-articles/${encodeURIComponent(slug)}?lang=${lang}`);
  if (!article) return null;

  let bodyContent = `<article>
    ${article.published_at ? `<time datetime="${article.published_at}">${new Date(article.published_at).toLocaleDateString('en-GB')}</time>` : ''}
    ${article.image_url ? `<img src="${SITE_URL}${article.image_url}" alt="${escapeHtml(article.title)}" loading="lazy">` : ''}
    ${article.summary ? `<p><strong>${escapeHtml(article.summary)}</strong></p>` : ''}
    ${article.content ? `<div>${article.content}</div>` : ''}
  </article>`;

  const schemas = [
    buildOrganizationSchema(),
    buildArticleSchema(article),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'News', url: `${SITE_URL}/news` },
      { name: article.title, url: `${SITE_URL}/news/${slug}` }
    ])
  ];

  return buildHtmlDocument({
    title: `${article.title} | Bio Green Wax Ltd`,
    description: article.summary || article.title,
    canonicalUrl: `${SITE_URL}/news/${slug}`,
    ogImage: article.image_url ? `${SITE_URL}${article.image_url}` : undefined,
    lang,
    h1: article.title,
    bodyContent, schemas
  });
}

async function renderContactPage(lang: string): Promise<string> {
  const [contactInfo, seo] = await Promise.all([
    apiFetch('/contact-info'),
    apiFetch(`/seo-page-meta/by-path?path=%2Fcontact`)
  ]);

  const title = seo?.title || 'Contact Bio Green Wax Ltd';
  const description = seo?.description || 'Get in touch with Bio Green Wax Ltd for wholesale enquiries and quotes.';

  let bodyContent = '';

  if (contactInfo?.length > 0) {
    bodyContent += `<section aria-label="Contact Information">
      <h2>Contact Information</h2>
      <ul>${contactInfo.map((c: any) =>
        `<li><strong>${escapeHtml(c.label || c.type)}</strong>: ${escapeHtml(c.value)}</li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  bodyContent += `<section aria-label="Contact Form">
    <h2>Send Us an Enquiry</h2>
    <p>Please fill in the form on our website or email us at <a href="mailto:sales@biogreenwax.com">sales@biogreenwax.com</a></p>
  </section>`;

  const schemas = [
    buildOrganizationSchema(),
    buildLocalBusinessSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Contact', url: `${SITE_URL}/contact` }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Bio Green Wax Ltd",
      "url": `${SITE_URL}/contact`
    }
  ];

  return buildHtmlDocument({
    title, description,
    keywords: seo?.keywords,
    canonicalUrl: `${SITE_URL}/contact`,
    lang,
    h1: 'Contact Us',
    bodyContent, schemas,
    contactInfo
  });
}

async function renderCertificationsPage(lang: string): Promise<string> {
  const [certs, seo] = await Promise.all([
    apiFetch(`/certifications?active_only=true&lang=${lang}`),
    apiFetch(`/seo-page-meta/by-path?path=%2Fcertifications`)
  ]);

  const title = seo?.title || 'Certifications | Bio Green Wax Ltd';
  const description = seo?.description || 'Our quality certifications including RSPO, ISCC, and more.';

  let bodyContent = '';

  if (certs?.length > 0) {
    bodyContent += `<section aria-label="Certifications">
      <ul>${certs.map((c: any) =>
        `<li>
          <h2>${escapeHtml(c.name)}</h2>
          ${c.description ? `<p>${escapeHtml(c.description)}</p>` : ''}
          ${c.issuing_body ? `<p>Issued by: ${escapeHtml(c.issuing_body)}</p>` : ''}
        </li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Certifications', url: `${SITE_URL}/certifications` }
    ])
  ];

  return buildHtmlDocument({
    title, description,
    keywords: seo?.keywords,
    canonicalUrl: `${SITE_URL}/certifications`,
    lang,
    h1: 'Our Certifications',
    bodyContent, schemas
  });
}

async function renderCareersPage(lang: string): Promise<string> {
  const [jobs, seo] = await Promise.all([
    apiFetch(`/job-openings?active_only=true&lang=${lang}`),
    apiFetch(`/seo-page-meta/by-path?path=%2Fcareers`)
  ]);

  const title = seo?.title || 'Careers | Bio Green Wax Ltd';
  const description = seo?.description || 'Join Bio Green Wax Ltd. View current job openings and opportunities.';

  let bodyContent = '';

  if (jobs?.length > 0) {
    bodyContent += `<section aria-label="Job Openings">
      <ul>${jobs.map((j: any) =>
        `<li>
          <h2>${escapeHtml(j.title)}</h2>
          ${j.location ? `<p>Location: ${escapeHtml(j.location)}</p>` : ''}
          ${j.type ? `<p>Type: ${escapeHtml(j.type)}</p>` : ''}
          ${j.description ? `<p>${escapeHtml(j.description.substring(0, 200))}</p>` : ''}
        </li>`
      ).join('\n')}</ul>
    </section>\n`;
  } else {
    bodyContent += `<p>No current job openings. Please check back later or send your CV to <a href="mailto:sales@biogreenwax.com">sales@biogreenwax.com</a>.</p>`;
  }

  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Careers', url: `${SITE_URL}/careers` }
    ])
  ];

  if (jobs?.length > 0) {
    jobs.forEach((j: any) => {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": j.title,
        "description": j.description || j.title,
        "datePosted": j.created_at,
        "employmentType": j.type || "FULL_TIME",
        "jobLocation": {
          "@type": "Place",
          "address": { "@type": "PostalAddress", "addressLocality": j.location || "London", "addressCountry": "GB" }
        },
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Bio Green Wax Ltd",
          "sameAs": SITE_URL
        }
      });
    });
  }

  return buildHtmlDocument({
    title, description,
    keywords: seo?.keywords,
    canonicalUrl: `${SITE_URL}/careers`,
    lang,
    h1: 'Careers at Bio Green Wax Ltd',
    bodyContent, schemas
  });
}

async function renderSectorPage(slug: string, lang: string): Promise<string | null> {
  const sectors = await apiFetch(`/sectors?active_only=true&lang=${lang}`);
  if (!sectors) return null;

  const sector = sectors.find((s: any) => s.slug === slug || s.id === slug);
  if (!sector) return null;

  let bodyContent = `<section>
    ${sector.image_url ? `<img src="${SITE_URL}${sector.image_url}" alt="${escapeHtml(sector.name)}" loading="lazy">` : ''}
    ${sector.description ? `<div>${escapeHtml(sector.description)}</div>` : ''}
  </section>`;

  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Sectors', url: `${SITE_URL}/sectors` },
      { name: sector.name, url: `${SITE_URL}/sectors/${slug}` }
    ])
  ];

  return buildHtmlDocument({
    title: `${sector.name} | Bio Green Wax Ltd`,
    description: sector.description?.substring(0, 155) || `${sector.name} sector solutions from Bio Green Wax Ltd`,
    canonicalUrl: `${SITE_URL}/sectors/${slug}`,
    ogImage: sector.image_url ? `${SITE_URL}${sector.image_url}` : undefined,
    lang,
    h1: sector.name,
    bodyContent, schemas
  });
}

async function renderSectorsListPage(lang: string): Promise<string> {
  const [sectors, seo] = await Promise.all([
    apiFetch(`/sectors?active_only=true&lang=${lang}`),
    apiFetch(`/seo-page-meta/by-path?path=%2Fsectors`)
  ]);

  const title = seo?.title || 'Industry Sectors | Bio Green Wax Ltd';
  const description = seo?.description || 'Explore the industries we serve with premium oils, waxes, and oleochemicals.';

  let bodyContent = '';

  if (sectors?.length > 0) {
    bodyContent += `<section aria-label="Industry Sectors">
      <ul>${sectors.map((s: any) =>
        `<li>
          <h2><a href="${SITE_URL}/sectors/${escapeHtml(s.slug || s.id)}">${escapeHtml(s.name)}</a></h2>
          ${s.description ? `<p>${escapeHtml(s.description.substring(0, 200))}</p>` : ''}
        </li>`
      ).join('\n')}</ul>
    </section>\n`;
  }

  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema([
      { name: 'Home', url: SITE_URL },
      { name: 'Sectors', url: `${SITE_URL}/sectors` }
    ])
  ];

  if (sectors?.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Industry Sectors",
      "numberOfItems": sectors.length,
      "itemListElement": sectors.map((s: any, i: number) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": s.name,
        "url": `${SITE_URL}/sectors/${s.slug || s.id}`
      }))
    });
  }

  return buildHtmlDocument({
    title, description,
    keywords: seo?.keywords,
    canonicalUrl: `${SITE_URL}/sectors`,
    lang,
    h1: 'Industry Sectors We Serve',
    bodyContent, schemas
  });
}

async function renderPage(url: string): Promise<string | null> {
  const { lang, path } = parsePath(url);

  if (path === '/' || path === '') {
    return renderHomepage(lang);
  }

  if (path === '/products') {
    return renderProductsPage(lang);
  }

  const productMatch = path.match(/^\/products\/(.+)$/);
  if (productMatch) {
    return renderProductDetail(productMatch[1], lang);
  }

  if (path === '/about') {
    return renderAboutPage(lang);
  }

  if (path === '/news') {
    return renderNewsPage(lang);
  }

  const newsMatch = path.match(/^\/news\/(.+)$/);
  if (newsMatch) {
    return renderNewsArticle(newsMatch[1], lang);
  }

  if (path === '/contact') {
    return renderContactPage(lang);
  }

  if (path === '/certifications') {
    return renderCertificationsPage(lang);
  }

  if (path === '/careers') {
    return renderCareersPage(lang);
  }

  if (path === '/sectors') {
    return renderSectorsListPage(lang);
  }

  const sectorMatch = path.match(/^\/sectors\/(.+)$/);
  if (sectorMatch) {
    return renderSectorPage(sectorMatch[1], lang);
  }

  return null;
}

export function invalidateBotCache(): void {
  cache.clear();
}

export function botPrerender(): Plugin {
  return {
    name: 'bot-prerender',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url === '/__invalidate-cache' && req.method === 'POST') {
          const { invalidateFallbackCache } = await import('./static-fallback');
          cache.clear();
          invalidateFallbackCache();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Bot and fallback caches cleared' }));
          return;
        }

        const userAgent = req.headers['user-agent'] || '';
        const url = req.url || '/';

        if (!isBot(userAgent) || !isPageRequest(url)) {
          return next();
        }

        const cacheKey = url;
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('X-Prerendered', 'bot');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(cached.html);
          return;
        }

        try {
          const html = await renderPage(url);
          if (html) {
            cache.set(cacheKey, { html, timestamp: Date.now() });
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('X-Prerendered', 'bot');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.end(html);
            return;
          }
        } catch (err) {
          console.error('[bot-prerender] Error rendering:', url, err);
        }

        next();
      });
    }
  };
}
