import type { Plugin } from 'vite';

const API_BASE = process.env.BOT_PRERENDER_API_BASE || 'http://localhost:8080';
const REFRESH_INTERVAL = 5 * 60 * 1000;
const PLACEHOLDER = '<!--STATIC_FALLBACK-->';

let cachedFallback: string | null = null;
let lastFetch = 0;
let fetchInProgress: Promise<string> | null = null;

function escapeHtml(str: unknown): string {
  const s = String(str ?? '');
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function apiFetch(endpoint: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function generateFallback(): Promise<string> {
  const [
    products,
    sectors,
    news,
    aboutContent,
    certifications,
    contactInfo,
    categories,
    jobs,
    directors
  ] = await Promise.all([
    apiFetch('/products?lang=en'),
    apiFetch('/sectors?active_only=true&lang=en'),
    apiFetch('/news-articles?lang=en'),
    apiFetch('/about-us-content?lang=en'),
    apiFetch('/certifications?lang=en'),
    apiFetch('/contact-info'),
    apiFetch('/product-categories?active_only=true&lang=en'),
    apiFetch('/job-openings?active_only=true&lang=en'),
    apiFetch('/directors?lang=en'),
  ]);

  let html = '';

  html += `<header>
  <nav aria-label="Main Navigation">
    <a href="/">Bio Green Wax Ltd</a>
    <ul>
      <li><a href="/products">Products</a></li>
      <li><a href="/sectors">Sectors</a></li>
      <li><a href="/about">About Us</a></li>
      <li><a href="/news">News</a></li>
      <li><a href="/certifications">Certifications</a></li>
      <li><a href="/careers">Careers</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Bio Green Wax Ltd — Premium Edible Oils, Fats &amp; Industrial Waxes</h1>
  <p>Bio Green Wax Ltd is a leading UK-based B2B supplier of premium edible oils, plant-based waxes, and industrial petrochemical waxes. We offer RSPO SG (Segregated) and MB (Mass Balance) certified palm derivatives, EUDR-compliant products, and custom wax blends for a wide range of industries.</p>\n`;

  if (categories?.length > 0) {
    html += `  <section>
    <h2>Product Categories</h2>
    <ul>\n`;
    for (const cat of categories) {
      html += `      <li><a href="/products?category=${escapeHtml(cat.slug || cat.id)}">${escapeHtml(cat.name)}</a>${cat.description ? ` — ${escapeHtml(String(cat.description).substring(0, 150))}` : ''}</li>\n`;
    }
    html += `    </ul>
  </section>\n`;
  }

  if (products?.length > 0) {
    html += `  <section>
    <h2>Our Complete Product Range</h2>
    <ul>\n`;
    for (const p of products) {
      const desc = p.short_description || p.description || '';
      const descText = String(desc).substring(0, 200);
      html += `      <li>
        <h3><a href="/products/${escapeHtml(p.slug || p.id)}">${escapeHtml(p.name)}</a></h3>
        ${descText ? `<p>${escapeHtml(descText)}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <p><a href="/products">View All Products</a></p>
  </section>\n`;
  }

  if (sectors?.length > 0) {
    html += `  <section>
    <h2>Industries We Serve</h2>
    <ul>\n`;
    for (const s of sectors) {
      const desc = s.description || '';
      const descText = String(desc).substring(0, 200);
      html += `      <li>
        <h3><a href="/sectors/${escapeHtml(s.slug || s.id)}">${escapeHtml(s.name)}</a></h3>
        ${descText ? `<p>${escapeHtml(descText)}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <p><a href="/sectors">Explore All Sectors</a></p>
  </section>\n`;
  }

  if (aboutContent?.length > 0) {
    html += `  <section>
    <h2>About Bio Green Wax Ltd</h2>\n`;
    const sections = new Map<string, any[]>();
    for (const block of aboutContent) {
      const section = block.section || 'general';
      if (!sections.has(section)) sections.set(section, []);
      sections.get(section)!.push(block);
    }
    for (const [section, blocks] of sections) {
      const sectionTitle = section.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      html += `    <h3>${escapeHtml(sectionTitle)}</h3>\n`;
      for (const block of blocks) {
        const key = block.content_key || '';
        const value = block.content_value || '';
        if (value) {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
          html += `    <p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value).substring(0, 500))}</p>\n`;
        }
      }
    }
    if (directors?.length > 0) {
      html += `    <h3>Our Leadership</h3>
    <ul>\n`;
      for (const d of directors) {
        html += `      <li><strong>${escapeHtml(d.name)}</strong>${d.title ? ` — ${escapeHtml(d.title)}` : ''}${d.bio ? `: ${escapeHtml(String(d.bio).substring(0, 300))}` : ''}</li>\n`;
      }
      html += `    </ul>\n`;
    }
    html += `    <p><a href="/about">Read More About Us</a></p>
  </section>\n`;
  }

  if (news?.length > 0) {
    html += `  <section>
    <h2>Latest News &amp; Updates</h2>
    <ul>\n`;
    for (const article of news) {
      const summary = article.excerpt || article.content || '';
      const summaryText = String(summary).substring(0, 250);
      html += `      <li>
        <h3><a href="/news/${escapeHtml(article.slug || article.id)}">${escapeHtml(article.title)}</a></h3>
        ${article.published_at ? `<time datetime="${escapeHtml(article.published_at)}">${escapeHtml(article.published_at)}</time>` : ''}
        ${summaryText ? `<p>${escapeHtml(summaryText)}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <p><a href="/news">View All News</a></p>
  </section>\n`;
  }

  if (certifications?.length > 0) {
    html += `  <section>
    <h2>Certifications &amp; Sustainability</h2>
    <ul>\n`;
    for (const cert of certifications) {
      html += `      <li>
        <h3>${escapeHtml(cert.name)}</h3>
        ${cert.description ? `<p>${escapeHtml(String(cert.description).substring(0, 300))}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <p><a href="/certifications">View All Certifications</a></p>
  </section>\n`;
  }

  if (jobs?.length > 0) {
    html += `  <section>
    <h2>Career Opportunities</h2>
    <ul>\n`;
    for (const job of jobs) {
      html += `      <li>
        <h3><a href="/careers">${escapeHtml(job.title)}</a></h3>
        ${job.location ? `<p>Location: ${escapeHtml(job.location)}</p>` : ''}
        ${job.type || job.employment_type ? `<p>Type: ${escapeHtml(job.type || job.employment_type)}</p>` : ''}
        ${job.description ? `<p>${escapeHtml(String(job.description).substring(0, 200))}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <p><a href="/careers">View All Openings</a></p>
  </section>\n`;
  }

  if (contactInfo?.length > 0) {
    html += `  <section>
    <h2>Contact Us</h2>
    <ul>\n`;
    for (const c of contactInfo) {
      html += `      <li><strong>${escapeHtml(c.label || c.type)}</strong>: ${escapeHtml(c.value)}</li>\n`;
    }
    html += `    </ul>
    <p>Email: <a href="mailto:sales@biogreenwax.com">sales@biogreenwax.com</a> | Phone: +44 20 7101 3847</p>
    <p><a href="/contact">Get in Touch</a></p>
  </section>\n`;
  }

  html += `</main>
<footer>
  <p>&copy; ${new Date().getFullYear()} Bio Green Wax Ltd. All rights reserved.</p>
</footer>`;

  return html;
}

async function getFallback(): Promise<string> {
  const now = Date.now();
  if (cachedFallback && now - lastFetch < REFRESH_INTERVAL) {
    return cachedFallback;
  }

  if (fetchInProgress) {
    return fetchInProgress;
  }

  fetchInProgress = generateFallback()
    .then(html => {
      cachedFallback = html;
      lastFetch = Date.now();
      fetchInProgress = null;
      console.log('[static-fallback] Content refreshed from API');
      return html;
    })
    .catch(err => {
      fetchInProgress = null;
      console.error('[static-fallback] Error generating fallback:', err);
      return cachedFallback || '<main><h1>Bio Green Wax Ltd</h1><p>Loading...</p></main>';
    });

  return fetchInProgress;
}

export function staticFallback(): Plugin {
  let refreshTimer: ReturnType<typeof setInterval> | null = null;

  return {
    name: 'static-fallback',
    configureServer() {
      getFallback();

      refreshTimer = setInterval(() => {
        cachedFallback = null;
        getFallback();
      }, REFRESH_INTERVAL);
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        if (!html.includes(PLACEHOLDER)) {
          return html;
        }
        const fallback = await getFallback();
        return html.replace(PLACEHOLDER, fallback);
      }
    },
    buildEnd() {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
    }
  };
}

export function invalidateFallbackCache(): void {
  cachedFallback = null;
  lastFetch = 0;
}
