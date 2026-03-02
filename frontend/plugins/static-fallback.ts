import type { Plugin } from 'vite';

const API_BASE = process.env.BOT_PRERENDER_API_BASE || 'http://localhost:8080';
const REFRESH_INTERVAL = 5 * 60 * 1000;
const PLACEHOLDER = '<!--STATIC_FALLBACK-->';

const SUPPORTED_LANGUAGES = ['en', 'zh', 'es', 'fr', 'ar', 'pt', 'ru', 'de', 'ja', 'sw', 'tr', 'vi', 'ko', 'th', 'it', 'pl'];

const NAV_LABELS: Record<string, { products: string; sectors: string; about: string; news: string; certifications: string; careers: string; contact: string }> = {
  en: { products: 'Products', sectors: 'Sectors', about: 'About Us', news: 'News', certifications: 'Certifications', careers: 'Careers', contact: 'Contact' },
  zh: { products: '产品', sectors: '行业', about: '关于我们', news: '新闻', certifications: '认证', careers: '职业', contact: '联系我们' },
  es: { products: 'Productos', sectors: 'Sectores', about: 'Sobre Nosotros', news: 'Noticias', certifications: 'Certificaciones', careers: 'Carreras', contact: 'Contacto' },
  fr: { products: 'Produits', sectors: 'Secteurs', about: 'À Propos', news: 'Actualités', certifications: 'Certifications', careers: 'Carrières', contact: 'Contact' },
  ar: { products: 'المنتجات', sectors: 'القطاعات', about: 'من نحن', news: 'الأخبار', certifications: 'الشهادات', careers: 'الوظائف', contact: 'اتصل بنا' },
  pt: { products: 'Produtos', sectors: 'Setores', about: 'Sobre Nós', news: 'Notícias', certifications: 'Certificações', careers: 'Carreiras', contact: 'Contato' },
  ru: { products: 'Продукция', sectors: 'Отрасли', about: 'О Нас', news: 'Новости', certifications: 'Сертификаты', careers: 'Карьера', contact: 'Контакты' },
  de: { products: 'Produkte', sectors: 'Branchen', about: 'Über Uns', news: 'Nachrichten', certifications: 'Zertifizierungen', careers: 'Karriere', contact: 'Kontakt' },
  ja: { products: '製品', sectors: '業界', about: '会社概要', news: 'ニュース', certifications: '認証', careers: '採用情報', contact: 'お問い合わせ' },
  sw: { products: 'Bidhaa', sectors: 'Sekta', about: 'Kuhusu Sisi', news: 'Habari', certifications: 'Vyeti', careers: 'Kazi', contact: 'Wasiliana' },
  tr: { products: 'Ürünler', sectors: 'Sektörler', about: 'Hakkımızda', news: 'Haberler', certifications: 'Sertifikalar', careers: 'Kariyer', contact: 'İletişim' },
  vi: { products: 'Sản phẩm', sectors: 'Ngành', about: 'Về chúng tôi', news: 'Tin tức', certifications: 'Chứng nhận', careers: 'Tuyển dụng', contact: 'Liên hệ' },
  ko: { products: '제품', sectors: '산업', about: '회사 소개', news: '뉴스', certifications: '인증', careers: '채용', contact: '문의' },
  th: { products: 'ผลิตภัณฑ์', sectors: 'อุตสาหกรรม', about: 'เกี่ยวกับเรา', news: 'ข่าวสาร', certifications: 'ใบรับรอง', careers: 'สมัครงาน', contact: 'ติดต่อเรา' },
  it: { products: 'Prodotti', sectors: 'Settori', about: 'Chi Siamo', news: 'Notizie', certifications: 'Certificazioni', careers: 'Carriere', contact: 'Contatti' },
  pl: { products: 'Produkty', sectors: 'Sektory', about: 'O Nas', news: 'Aktualności', certifications: 'Certyfikaty', careers: 'Kariera', contact: 'Kontakt' },
};

const SECTION_LABELS: Record<string, { productCategories: string; productRange: string; industries: string; aboutUs: string; leadership: string; latestNews: string; certifications: string; careers: string; contactUs: string; viewAll: string; readMore: string; explore: string; viewOpenings: string; getInTouch: string; h1: string; intro: string }> = {
  en: { productCategories: 'Product Categories', productRange: 'Our Complete Product Range', industries: 'Industries We Serve', aboutUs: 'About Bio Green Wax Ltd', leadership: 'Our Leadership', latestNews: 'Latest News & Updates', certifications: 'Certifications & Sustainability', careers: 'Career Opportunities', contactUs: 'Contact Us', viewAll: 'View All Products', readMore: 'Read More About Us', explore: 'Explore All Sectors', viewOpenings: 'View All Openings', getInTouch: 'Get in Touch', h1: 'Bio Green Wax Ltd — Premium Edible Oils, Fats & Industrial Waxes', intro: 'Bio Green Wax Ltd is a leading UK-based B2B supplier of premium edible oils, plant-based waxes, and industrial petrochemical waxes. We offer RSPO SG (Segregated) and MB (Mass Balance) certified palm derivatives, EUDR-compliant products, and custom wax blends for a wide range of industries.' },
  zh: { productCategories: '产品类别', productRange: '完整产品系列', industries: '服务行业', aboutUs: '关于 Bio Green Wax 有限公司', leadership: '领导团队', latestNews: '最新新闻', certifications: '认证与可持续发展', careers: '职业机会', contactUs: '联系我们', viewAll: '查看所有产品', readMore: '了解更多', explore: '探索所有行业', viewOpenings: '查看所有职位', getInTouch: '联系我们', h1: 'Bio Green Wax 有限公司 — 优质食用油、脂肪和工业蜡', intro: 'Bio Green Wax 有限公司是英国领先的优质食用油、植物蜡和工业石化蜡B2B供应商。我们提供RSPO SG（隔离）和MB（质量平衡）认证的棕榈衍生物、符合EUDR标准的产品以及适用于各行各业的定制蜡混合物。' },
  es: { productCategories: 'Categorías de Productos', productRange: 'Gama Completa de Productos', industries: 'Industrias que Servimos', aboutUs: 'Sobre Bio Green Wax Ltd', leadership: 'Nuestro Liderazgo', latestNews: 'Últimas Noticias', certifications: 'Certificaciones y Sostenibilidad', careers: 'Oportunidades de Empleo', contactUs: 'Contáctenos', viewAll: 'Ver Todos los Productos', readMore: 'Leer Más', explore: 'Explorar Todos los Sectores', viewOpenings: 'Ver Todas las Vacantes', getInTouch: 'Contactar', h1: 'Bio Green Wax Ltd — Aceites Comestibles, Grasas y Ceras Industriales', intro: 'Bio Green Wax Ltd es un proveedor B2B líder con sede en el Reino Unido de aceites comestibles premium, ceras vegetales y ceras petroquímicas industriales.' },
  fr: { productCategories: 'Catégories de Produits', productRange: 'Gamme Complète de Produits', industries: 'Industries que Nous Servons', aboutUs: 'À Propos de Bio Green Wax Ltd', leadership: 'Notre Direction', latestNews: 'Dernières Nouvelles', certifications: 'Certifications et Durabilité', careers: 'Opportunités de Carrière', contactUs: 'Contactez-Nous', viewAll: 'Voir Tous les Produits', readMore: 'En Savoir Plus', explore: 'Explorer Tous les Secteurs', viewOpenings: 'Voir Toutes les Offres', getInTouch: 'Nous Contacter', h1: 'Bio Green Wax Ltd — Huiles Alimentaires, Graisses et Cires Industrielles', intro: 'Bio Green Wax Ltd est un fournisseur B2B de premier plan basé au Royaume-Uni, spécialisé dans les huiles alimentaires, les cires végétales et les cires pétrochimiques industrielles.' },
  ar: { productCategories: 'فئات المنتجات', productRange: 'مجموعة المنتجات الكاملة', industries: 'الصناعات التي نخدمها', aboutUs: 'عن Bio Green Wax المحدودة', leadership: 'فريق القيادة', latestNews: 'آخر الأخبار', certifications: 'الشهادات والاستدامة', careers: 'فرص العمل', contactUs: 'اتصل بنا', viewAll: 'عرض جميع المنتجات', readMore: 'اقرأ المزيد', explore: 'استكشاف جميع القطاعات', viewOpenings: 'عرض جميع الوظائف', getInTouch: 'تواصل معنا', h1: 'Bio Green Wax المحدودة — زيوت الطعام والدهون والشموع الصناعية', intro: 'Bio Green Wax المحدودة هي مورد رائد في المملكة المتحدة للزيوت الغذائية الممتازة والشموع النباتية والشموع البتروكيماوية الصناعية.' },
  pt: { productCategories: 'Categorias de Produtos', productRange: 'Linha Completa de Produtos', industries: 'Indústrias que Atendemos', aboutUs: 'Sobre a Bio Green Wax Ltd', leadership: 'Nossa Liderança', latestNews: 'Últimas Notícias', certifications: 'Certificações e Sustentabilidade', careers: 'Oportunidades de Carreira', contactUs: 'Fale Conosco', viewAll: 'Ver Todos os Produtos', readMore: 'Leia Mais', explore: 'Explorar Todos os Setores', viewOpenings: 'Ver Todas as Vagas', getInTouch: 'Entre em Contato', h1: 'Bio Green Wax Ltd — Óleos Comestíveis, Gorduras e Ceras Industriais', intro: 'Bio Green Wax Ltd é um fornecedor B2B líder no Reino Unido de óleos comestíveis premium, ceras vegetais e ceras petroquímicas industriais.' },
  ru: { productCategories: 'Категории Продукции', productRange: 'Полный Ассортимент Продукции', industries: 'Обслуживаемые Отрасли', aboutUs: 'О Компании Bio Green Wax Ltd', leadership: 'Руководство', latestNews: 'Последние Новости', certifications: 'Сертификаты и Устойчивое Развитие', careers: 'Вакансии', contactUs: 'Свяжитесь с Нами', viewAll: 'Все Продукты', readMore: 'Подробнее', explore: 'Все Отрасли', viewOpenings: 'Все Вакансии', getInTouch: 'Связаться', h1: 'Bio Green Wax Ltd — Пищевые Масла, Жиры и Промышленные Воски', intro: 'Bio Green Wax Ltd — ведущий британский B2B-поставщик пищевых масел, растительных восков и промышленных нефтехимических восков.' },
  de: { productCategories: 'Produktkategorien', productRange: 'Unser Komplettes Produktsortiment', industries: 'Branchen die Wir Bedienen', aboutUs: 'Über Bio Green Wax Ltd', leadership: 'Unsere Führung', latestNews: 'Neueste Nachrichten', certifications: 'Zertifizierungen und Nachhaltigkeit', careers: 'Karrieremöglichkeiten', contactUs: 'Kontaktieren Sie Uns', viewAll: 'Alle Produkte Ansehen', readMore: 'Mehr Erfahren', explore: 'Alle Branchen Erkunden', viewOpenings: 'Alle Stellen Ansehen', getInTouch: 'Kontakt Aufnehmen', h1: 'Bio Green Wax Ltd — Speiseöle, Fette und Industriewachse', intro: 'Bio Green Wax Ltd ist ein führender britischer B2B-Lieferant von hochwertigen Speiseölen, pflanzlichen Wachsen und industriellen petrochemischen Wachsen.' },
  ja: { productCategories: '製品カテゴリ', productRange: '製品ラインナップ', industries: '対応業界', aboutUs: 'Bio Green Wax Ltdについて', leadership: 'リーダーシップ', latestNews: '最新ニュース', certifications: '認証と持続可能性', careers: '採用情報', contactUs: 'お問い合わせ', viewAll: '全製品を見る', readMore: '詳しく読む', explore: '全業界を見る', viewOpenings: '全求人を見る', getInTouch: 'お問い合わせ', h1: 'Bio Green Wax Ltd — 食用油・油脂・産業用ワックス', intro: 'Bio Green Wax Ltdは、高品質な食用油、植物ワックス、産業用石油化学ワックスを提供する英国の大手B2Bサプライヤーです。' },
  sw: { productCategories: 'Aina za Bidhaa', productRange: 'Bidhaa Zetu Zote', industries: 'Sekta Tunazohudumia', aboutUs: 'Kuhusu Bio Green Wax Ltd', leadership: 'Uongozi Wetu', latestNews: 'Habari za Hivi Karibuni', certifications: 'Vyeti na Uendelevu', careers: 'Fursa za Kazi', contactUs: 'Wasiliana Nasi', viewAll: 'Tazama Bidhaa Zote', readMore: 'Soma Zaidi', explore: 'Tazama Sekta Zote', viewOpenings: 'Tazama Nafasi Zote', getInTouch: 'Wasiliana', h1: 'Bio Green Wax Ltd — Mafuta ya Kula, Mafuta na Nta za Viwandani', intro: 'Bio Green Wax Ltd ni msambazaji mkuu wa B2B nchini Uingereza wa mafuta ya kula ya hali ya juu, nta za mimea, na nta za petrochemical za viwandani.' },
  tr: { productCategories: 'Ürün Kategorileri', productRange: 'Tam Ürün Yelpazemiz', industries: 'Hizmet Verdiğimiz Sektörler', aboutUs: 'Bio Green Wax Ltd Hakkında', leadership: 'Liderliğimiz', latestNews: 'Son Haberler', certifications: 'Sertifikalar ve Sürdürülebilirlik', careers: 'Kariyer Fırsatları', contactUs: 'Bize Ulaşın', viewAll: 'Tüm Ürünleri Görüntüle', readMore: 'Devamını Oku', explore: 'Tüm Sektörleri Keşfet', viewOpenings: 'Tüm Pozisyonları Görüntüle', getInTouch: 'İletişime Geçin', h1: 'Bio Green Wax Ltd — Yemeklik Yağlar, Katı Yağlar ve Endüstriyel Mumlar', intro: 'Bio Green Wax Ltd, birinci sınıf yemeklik yağlar, bitkisel mumlar ve endüstriyel petrokimya mumları konusunda İngiltere merkezli lider bir B2B tedarikçidir.' },
  vi: { productCategories: 'Danh Mục Sản Phẩm', productRange: 'Toàn Bộ Sản Phẩm', industries: 'Ngành Chúng Tôi Phục Vụ', aboutUs: 'Về Bio Green Wax Ltd', leadership: 'Ban Lãnh Đạo', latestNews: 'Tin Tức Mới Nhất', certifications: 'Chứng Nhận và Bền Vững', careers: 'Cơ Hội Nghề Nghiệp', contactUs: 'Liên Hệ', viewAll: 'Xem Tất Cả Sản Phẩm', readMore: 'Đọc Thêm', explore: 'Khám Phá Tất Cả Ngành', viewOpenings: 'Xem Tất Cả Vị Trí', getInTouch: 'Liên Hệ Ngay', h1: 'Bio Green Wax Ltd — Dầu Ăn, Chất Béo và Sáp Công Nghiệp', intro: 'Bio Green Wax Ltd là nhà cung cấp B2B hàng đầu tại Anh về dầu ăn cao cấp, sáp thực vật và sáp hóa dầu công nghiệp.' },
  ko: { productCategories: '제품 카테고리', productRange: '전체 제품 라인업', industries: '서비스 산업', aboutUs: 'Bio Green Wax Ltd 소개', leadership: '경영진', latestNews: '최신 뉴스', certifications: '인증 및 지속 가능성', careers: '채용 정보', contactUs: '문의하기', viewAll: '모든 제품 보기', readMore: '자세히 보기', explore: '모든 산업 살펴보기', viewOpenings: '모든 채용 보기', getInTouch: '연락하기', h1: 'Bio Green Wax Ltd — 식용유, 유지 및 산업용 왁스', intro: 'Bio Green Wax Ltd는 프리미엄 식용유, 식물성 왁스 및 산업용 석유화학 왁스를 공급하는 영국 최고의 B2B 공급업체입니다.' },
  th: { productCategories: 'หมวดหมู่สินค้า', productRange: 'สินค้าทั้งหมดของเรา', industries: 'อุตสาหกรรมที่เราให้บริการ', aboutUs: 'เกี่ยวกับ Bio Green Wax Ltd', leadership: 'ทีมผู้บริหาร', latestNews: 'ข่าวล่าสุด', certifications: 'ใบรับรองและความยั่งยืน', careers: 'โอกาสในการทำงาน', contactUs: 'ติดต่อเรา', viewAll: 'ดูสินค้าทั้งหมด', readMore: 'อ่านเพิ่มเติม', explore: 'สำรวจทุกอุตสาหกรรม', viewOpenings: 'ดูตำแหน่งทั้งหมด', getInTouch: 'ติดต่อ', h1: 'Bio Green Wax Ltd — น้ำมันบริโภค ไขมัน และแว็กซ์อุตสาหกรรม', intro: 'Bio Green Wax Ltd เป็นผู้จำหน่าย B2B ชั้นนำในสหราชอาณาจักรด้านน้ำมันบริโภคคุณภาพสูง แว็กซ์จากพืช และแว็กซ์ปิโตรเคมีอุตสาหกรรม' },
  it: { productCategories: 'Categorie di Prodotti', productRange: 'Gamma Completa dei Prodotti', industries: 'Settori che Serviamo', aboutUs: 'Chi è Bio Green Wax Ltd', leadership: 'La Nostra Leadership', latestNews: 'Ultime Notizie', certifications: 'Certificazioni e Sostenibilità', careers: 'Opportunità di Carriera', contactUs: 'Contattaci', viewAll: 'Vedi Tutti i Prodotti', readMore: 'Scopri di Più', explore: 'Esplora Tutti i Settori', viewOpenings: 'Vedi Tutte le Posizioni', getInTouch: 'Contattaci', h1: 'Bio Green Wax Ltd — Oli Alimentari, Grassi e Cere Industriali', intro: 'Bio Green Wax Ltd è un fornitore B2B leader nel Regno Unito di oli alimentari premium, cere vegetali e cere petrolchimiche industriali.' },
  pl: { productCategories: 'Kategorie Produktów', productRange: 'Pełna Gama Produktów', industries: 'Obsługiwane Branże', aboutUs: 'O Bio Green Wax Ltd', leadership: 'Nasze Kierownictwo', latestNews: 'Najnowsze Wiadomości', certifications: 'Certyfikaty i Zrównoważony Rozwój', careers: 'Oferty Pracy', contactUs: 'Skontaktuj się z Nami', viewAll: 'Zobacz Wszystkie Produkty', readMore: 'Czytaj Więcej', explore: 'Odkryj Wszystkie Sektory', viewOpenings: 'Zobacz Wszystkie Oferty', getInTouch: 'Skontaktuj się', h1: 'Bio Green Wax Ltd — Oleje Jadalne, Tłuszcze i Woski Przemysłowe', intro: 'Bio Green Wax Ltd jest wiodącym brytyjskim dostawcą B2B olejów jadalnych, wosków roślinnych i przemysłowych wosków petrochemicznych.' },
};

const langCache = new Map<string, { html: string; timestamp: number }>();
let fetchInProgress = new Map<string, Promise<string>>();

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

function parseLangFromUrl(url: string): string {
  const clean = url.split('?')[0].split('#')[0];
  const match = clean.match(/^\/(zh|es|fr|ar|pt|ru|de|ja|sw|tr|vi|ko|th|it|pl)(\/|$)/);
  return match ? match[1] : 'en';
}

async function generateFallback(lang: string): Promise<string> {
  const langParam = lang === 'en' ? '' : `&lang=${lang}`;
  const langParamOnly = lang === 'en' ? '' : `?lang=${lang}`;

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
    apiFetch(`/products?active_only=true${langParam}`),
    apiFetch(`/sectors?active_only=true${langParam}`),
    apiFetch(`/news-articles${langParamOnly}`),
    apiFetch(`/about-us-content${langParamOnly}`),
    apiFetch(`/certifications${langParamOnly}`),
    apiFetch('/contact-info'),
    apiFetch(`/product-categories?active_only=true${langParam}`),
    apiFetch(`/job-openings?active_only=true${langParam}`),
    apiFetch(`/directors${langParamOnly}`),
  ]);

  const labels = SECTION_LABELS[lang] || SECTION_LABELS.en;
  const nav = NAV_LABELS[lang] || NAV_LABELS.en;
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const dir = lang === 'ar' ? ' dir="rtl"' : '';

  let html = '';

  html += `<style>
.sf-root,.sf-root *{margin:0;padding:0;box-sizing:border-box}
.sf-root{font-family:'Open Sans',system-ui,-apple-system,sans-serif;color:#1a1a1a;line-height:1.6}
.sf-hdr{background:#fff;border-bottom:1px solid #e5e7eb;padding:0 24px;position:sticky;top:0;z-index:50}
.sf-hdr-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;gap:16px}
.sf-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:#1a1a1a;font-family:'Montserrat',sans-serif;font-weight:700;font-size:16px}
.sf-logo img{height:40px;width:auto}
.sf-nav{display:flex;gap:4px;list-style:none;flex-wrap:wrap}
.sf-nav li a{text-decoration:none;color:#4b5563;font-size:14px;font-weight:500;padding:8px 12px;border-radius:6px;transition:background .2s,color .2s}
.sf-nav li a:hover{background:#f0fdf4;color:#166534}
.sf-hero{background:linear-gradient(135deg,#166534 0%,#15803d 40%,#22c55e 100%);color:#fff;padding:80px 24px;text-align:center}
.sf-hero-inner{max-width:900px;margin:0 auto}
.sf-hero h1{font-family:'Montserrat',sans-serif;font-size:clamp(24px,4vw,42px);font-weight:800;margin-bottom:16px;line-height:1.2}
.sf-hero p{font-size:clamp(14px,2vw,18px);opacity:.92;max-width:700px;margin:0 auto;line-height:1.7}
.sf-main{max-width:1200px;margin:0 auto;padding:0 24px}
.sf-section{padding:48px 0;border-bottom:1px solid #f3f4f6}
.sf-section:last-child{border-bottom:none}
.sf-section h2{font-family:'Montserrat',sans-serif;font-size:clamp(20px,3vw,28px);font-weight:700;color:#166534;margin-bottom:24px}
.sf-section h3{font-size:16px;font-weight:600;margin-bottom:4px}
.sf-section h3 a{color:#166534;text-decoration:none}
.sf-section h3 a:hover{text-decoration:underline}
.sf-section p{color:#4b5563;font-size:14px;margin-bottom:8px}
.sf-section ul{list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.sf-section li{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px}
.sf-btn{display:inline-block;margin-top:16px;padding:10px 24px;background:#166534;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px}
.sf-btn:hover{background:#15803d}
.sf-contact ul{display:block}
.sf-contact li{background:none;border:none;padding:4px 0}
.sf-footer{background:#111827;color:#9ca3af;text-align:center;padding:32px 24px;font-size:13px}
.sf-root[dir="rtl"] .sf-hdr-inner{flex-direction:row-reverse}
.sf-root[dir="rtl"] .sf-nav{flex-direction:row-reverse}
.sf-root[dir="rtl"] .sf-hero,.sf-root[dir="rtl"] .sf-main{direction:rtl;text-align:right}
@media(max-width:768px){.sf-hdr-inner{flex-wrap:wrap;height:auto;padding:12px 0}.sf-nav{gap:2px}.sf-nav li a{padding:6px 8px;font-size:13px}.sf-hero{padding:48px 24px}.sf-section ul{grid-template-columns:1fr}}
</style>
<div class="sf-root"${dir}>
<header class="sf-hdr">
  <div class="sf-hdr-inner">
    <a href="${prefix}/" class="sf-logo">
      <img src="/logo.webp" alt="Bio Green Wax Ltd" width="40" height="40">
      Bio Green Wax Ltd
    </a>
    <nav aria-label="Main Navigation">
      <ul class="sf-nav">
        <li><a href="${prefix}/products">${nav.products}</a></li>
        <li><a href="${prefix}/sectors">${nav.sectors}</a></li>
        <li><a href="${prefix}/about">${nav.about}</a></li>
        <li><a href="${prefix}/news">${nav.news}</a></li>
        <li><a href="${prefix}/certifications">${nav.certifications}</a></li>
        <li><a href="${prefix}/careers">${nav.careers}</a></li>
        <li><a href="${prefix}/contact">${nav.contact}</a></li>
      </ul>
    </nav>
  </div>
</header>
<section class="sf-hero">
  <div class="sf-hero-inner">
    <h1>${escapeHtml(labels.h1)}</h1>
    <p>${escapeHtml(labels.intro)}</p>
  </div>
</section>
<main class="sf-main">\n`;

  if (categories?.length > 0) {
    html += `  <section class="sf-section">
    <h2>${escapeHtml(labels.productCategories)}</h2>
    <ul>\n`;
    for (const cat of categories) {
      html += `      <li>
        <h3><a href="${prefix}/products?category=${escapeHtml(cat.slug || cat.id)}">${escapeHtml(cat.name)}</a></h3>
        ${cat.description ? `<p>${escapeHtml(String(cat.description).substring(0, 150))}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
  </section>\n`;
  }

  if (products?.length > 0) {
    html += `  <section class="sf-section">
    <h2>${escapeHtml(labels.productRange)}</h2>
    <ul>\n`;
    for (const p of products) {
      const desc = p.short_description || p.description || '';
      const descText = String(desc).substring(0, 200);
      html += `      <li>
        <h3><a href="${prefix}/products/${escapeHtml(p.slug || p.id)}">${escapeHtml(p.name)}</a></h3>
        ${descText ? `<p>${escapeHtml(descText)}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <a href="${prefix}/products" class="sf-btn">${escapeHtml(labels.viewAll)}</a>
  </section>\n`;
  }

  if (sectors?.length > 0) {
    html += `  <section class="sf-section">
    <h2>${escapeHtml(labels.industries)}</h2>
    <ul>\n`;
    for (const s of sectors) {
      const desc = s.description || '';
      const descText = String(desc).substring(0, 200);
      html += `      <li>
        <h3><a href="${prefix}/sectors/${escapeHtml(s.slug || s.id)}">${escapeHtml(s.name)}</a></h3>
        ${descText ? `<p>${escapeHtml(descText)}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <a href="${prefix}/sectors" class="sf-btn">${escapeHtml(labels.explore)}</a>
  </section>\n`;
  }

  if (aboutContent?.length > 0) {
    html += `  <section class="sf-section">
    <h2>${escapeHtml(labels.aboutUs)}</h2>\n`;
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
      html += `    <h3>${escapeHtml(labels.leadership)}</h3>
    <ul>\n`;
      for (const d of directors) {
        html += `      <li><strong>${escapeHtml(d.name)}</strong>${d.title ? ` — ${escapeHtml(d.title)}` : ''}${d.bio ? `: ${escapeHtml(String(d.bio).substring(0, 300))}` : ''}</li>\n`;
      }
      html += `    </ul>\n`;
    }
    html += `    <a href="${prefix}/about" class="sf-btn">${escapeHtml(labels.readMore)}</a>
  </section>\n`;
  }

  if (news?.length > 0) {
    html += `  <section class="sf-section">
    <h2>${escapeHtml(labels.latestNews)}</h2>
    <ul>\n`;
    for (const article of news) {
      const summary = article.excerpt || article.content || '';
      const summaryText = String(summary).substring(0, 250);
      html += `      <li>
        <h3><a href="${prefix}/news/${escapeHtml(article.slug || article.id)}">${escapeHtml(article.title)}</a></h3>
        ${article.published_at ? `<time datetime="${escapeHtml(article.published_at)}">${escapeHtml(article.published_at)}</time>` : ''}
        ${summaryText ? `<p>${escapeHtml(summaryText)}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <a href="${prefix}/news" class="sf-btn">${escapeHtml(labels.latestNews)}</a>
  </section>\n`;
  }

  if (certifications?.length > 0) {
    html += `  <section class="sf-section">
    <h2>${escapeHtml(labels.certifications)}</h2>
    <ul>\n`;
    for (const cert of certifications) {
      html += `      <li>
        <h3>${escapeHtml(cert.name)}</h3>
        ${cert.description ? `<p>${escapeHtml(String(cert.description).substring(0, 300))}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <a href="${prefix}/certifications" class="sf-btn">${escapeHtml(labels.certifications)}</a>
  </section>\n`;
  }

  if (jobs?.length > 0) {
    html += `  <section class="sf-section">
    <h2>${escapeHtml(labels.careers)}</h2>
    <ul>\n`;
    for (const job of jobs) {
      html += `      <li>
        <h3><a href="${prefix}/careers">${escapeHtml(job.title)}</a></h3>
        ${job.location ? `<p>${escapeHtml(job.location)}</p>` : ''}
        ${job.type || job.employment_type ? `<p>${escapeHtml(job.type || job.employment_type)}</p>` : ''}
        ${job.description ? `<p>${escapeHtml(String(job.description).substring(0, 200))}</p>` : ''}
      </li>\n`;
    }
    html += `    </ul>
    <a href="${prefix}/careers" class="sf-btn">${escapeHtml(labels.viewOpenings)}</a>
  </section>\n`;
  }

  if (contactInfo?.length > 0) {
    html += `  <section class="sf-section sf-contact">
    <h2>${escapeHtml(labels.contactUs)}</h2>
    <ul>\n`;
    for (const c of contactInfo) {
      html += `      <li><strong>${escapeHtml(c.label || c.type)}</strong>: ${escapeHtml(c.value)}</li>\n`;
    }
    html += `    </ul>
    <p>Email: <a href="mailto:sales@biogreenwax.com">sales@biogreenwax.com</a> | Phone: +44 20 7101 3847</p>
    <a href="${prefix}/contact" class="sf-btn">${escapeHtml(labels.getInTouch)}</a>
  </section>\n`;
  }

  const baseUrl = 'https://biogreenwax.com';
  const pageUrl = lang === 'en' ? baseUrl : `${baseUrl}/${lang}`;

  const orgSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bio Green Wax Ltd',
    url: baseUrl,
    logo: `${baseUrl}/logo.webp`,
    description: labels.intro,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44-20-7101-3847',
      email: 'sales@biogreenwax.com',
      contactType: 'sales'
    },
    sameAs: []
  };

  const websiteSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bio Green Wax Ltd',
    url: baseUrl,
    inLanguage: lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const breadcrumbSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: pageUrl
      }
    ]
  };

  const productSchemas: any[] = [];
  if (products?.length > 0) {
    for (const p of products.slice(0, 10)) {
      productSchemas.push({
        '@type': 'Product',
        name: p.name,
        description: (p.short_description || p.description || '').substring(0, 300),
        url: `${pageUrl}/products/${p.slug || p.id}`,
        brand: { '@type': 'Brand', name: 'Bio Green Wax Ltd' },
        manufacturer: { '@type': 'Organization', name: 'Bio Green Wax Ltd' }
      });
    }
  }

  const articleSchemas: any[] = [];
  if (news?.length > 0) {
    for (const article of news.slice(0, 5)) {
      articleSchemas.push({
        '@type': 'Article',
        headline: article.title,
        url: `${pageUrl}/news/${article.slug || article.id}`,
        ...(article.published_at ? { datePublished: article.published_at } : {}),
        description: (article.excerpt || '').substring(0, 200),
        publisher: { '@type': 'Organization', name: 'Bio Green Wax Ltd' }
      });
    }
  }

  const graphWrapper = {
    '@context': 'https://schema.org',
    '@graph': [orgSchema, websiteSchema, breadcrumbSchema, ...productSchemas, ...articleSchemas].map(({ '@context': _, ...rest }) => rest)
  };

  html += `\n<script type="application/ld+json">${JSON.stringify(graphWrapper)}</script>\n`;

  html += `</main>
<footer class="sf-footer">
  <p>&copy; ${new Date().getFullYear()} Bio Green Wax Ltd. All rights reserved.</p>
</footer>
</div>`;

  return html;
}

async function getFallback(lang: string): Promise<string> {
  const now = Date.now();
  const cached = langCache.get(lang);
  if (cached && now - cached.timestamp < REFRESH_INTERVAL) {
    return cached.html;
  }

  if (fetchInProgress.has(lang)) {
    return fetchInProgress.get(lang)!;
  }

  const promise = generateFallback(lang)
    .then(html => {
      langCache.set(lang, { html, timestamp: Date.now() });
      fetchInProgress.delete(lang);
      return html;
    })
    .catch(err => {
      fetchInProgress.delete(lang);
      console.error(`[static-fallback] Error generating fallback for ${lang}:`, err);
      const existing = langCache.get(lang);
      return existing?.html || '<main><h1>Bio Green Wax Ltd</h1><p>Loading...</p></main>';
    });

  fetchInProgress.set(lang, promise);
  return promise;
}

async function preloadAllLanguages(): Promise<void> {
  console.log(`[static-fallback] Pre-loading fallback content for ${SUPPORTED_LANGUAGES.length} languages...`);
  for (const lang of SUPPORTED_LANGUAGES) {
    await getFallback(lang);
  }
  console.log(`[static-fallback] All ${SUPPORTED_LANGUAGES.length} languages loaded`);
}

export function staticFallback(): Plugin {
  let refreshTimer: ReturnType<typeof setInterval> | null = null;

  return {
    name: 'static-fallback',
    configureServer() {
      preloadAllLanguages();

      refreshTimer = setInterval(() => {
        langCache.clear();
        preloadAllLanguages();
      }, REFRESH_INTERVAL);
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        if (!html.includes(PLACEHOLDER)) {
          return html;
        }
        const url = ctx.originalUrl || ctx.path || '/';
        const lang = parseLangFromUrl(url);
        const fallback = await getFallback(lang);

        let result = html.replace(PLACEHOLDER, fallback);

        if (lang !== 'en') {
          result = result.replace('<html lang="en">', `<html lang="${lang}"${lang === 'ar' ? ' dir="rtl"' : ''}>`);
        }

        return result;
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
  langCache.clear();
  fetchInProgress.clear();
}
