import { Layout } from "@/components/layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <SEO
        title={t("privacy.title", "Privacy Policy")}
        description="Bio Green Wax Ltd's privacy policy. Learn how we collect, use, and protect your personal information."
        url="/privacy"
        noindex={true}
      />
      {/* Hero - Compact */}
      <section className="gradient-primary text-primary-foreground pt-24 pb-8">
        <div className="container-wide">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-1">
            {t("privacy.title", "Privacy Policy")}
          </h1>
          <p className="text-sm opacity-90">
            {t("privacy.lastUpdated", "Last updated: January 2024")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>{t("privacy.intro.title", "1. Introduction")}</h2>
            <p>{t("privacy.intro.text", "Bio Green Wax Ltd (\"we\", \"our\", or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.")}</p>

            <h2>{t("privacy.collect.title", "2. Information We Collect")}</h2>
            <p>{t("privacy.collect.text", "We may collect information about you in a variety of ways:")}</p>
            <h3>{t("privacy.collect.personal", "Personal Data")}</h3>
            <p>{t("privacy.collect.personalText", "When you contact us or make enquiries, we may collect personally identifiable information such as your name, email address, phone number, company name, and any other information you choose to provide.")}</p>
            <h3>{t("privacy.collect.usage", "Usage Data")}</h3>
            <p>{t("privacy.collect.usageText", "We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, access times, and the pages you have viewed on our site.")}</p>

            <h2>{t("privacy.use.title", "3. How We Use Your Information")}</h2>
            <p>{t("privacy.use.text", "We use the information we collect for various purposes, including:")}</p>
            <ul>
              <li>{t("privacy.use.item1", "To respond to your enquiries and provide customer support")}</li>
              <li>{t("privacy.use.item2", "To send you marketing communications (with your consent)")}</li>
              <li>{t("privacy.use.item3", "To improve our website and services")}</li>
              <li>{t("privacy.use.item4", "To comply with legal obligations")}</li>
              <li>{t("privacy.use.item5", "To process orders and transactions")}</li>
            </ul>

            <h2>{t("privacy.sharing.title", "4. Information Sharing")}</h2>
            <p>{t("privacy.sharing.text", "We do not sell, rent, or trade your personal information. We may share your information with:")}</p>
            <ul>
              <li>{t("privacy.sharing.item1", "Service providers who assist us in operating our business")}</li>
              <li>{t("privacy.sharing.item2", "Business partners with your consent")}</li>
              <li>{t("privacy.sharing.item3", "Legal authorities when required by law")}</li>
            </ul>

            <h2>{t("privacy.cookies.title", "5. Cookies")}</h2>
            <p>{t("privacy.cookies.text", "Our website uses cookies to enhance your experience. Cookies are small files stored on your device that help us analyze site traffic and improve our services.")}</p>

            <h2>{t("privacy.security.title", "6. Data Security")}</h2>
            <p>{t("privacy.security.text", "We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.")}</p>

            <h2>{t("privacy.rights.title", "7. Your Rights")}</h2>
            <p>{t("privacy.rights.text", "You have the right to access, correct, and delete your personal data. Contact us to exercise these rights.")}</p>

            <h2>{t("privacy.contact.title", "8. Contact Us")}</h2>
            <p>{t("privacy.contact.text", "If you have questions about this Privacy Policy, please contact us at:")}</p>
            <p>
              Bio Green Wax Ltd<br />
              Email: privacy@biogreenwax.com<br />
              Phone: +44 20 7101 3847
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
