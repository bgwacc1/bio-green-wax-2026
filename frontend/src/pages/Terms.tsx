import { Layout } from "@/components/layout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/i18n/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <SEO
        title={t("terms.title", "Terms of Service")}
        description="Bio Green Wax Ltd's terms of service. Read the terms and conditions for using our website and services."
        url="/terms"
        noindex={true}
      />
      {/* Hero - Compact */}
      <section className="gradient-primary text-primary-foreground pt-24 pb-8">
        <div className="container-wide">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-1">
            {t("terms.title", "Terms of Service")}
          </h1>
          <p className="text-sm opacity-90">
            {t("terms.lastUpdated", "Last updated: January 2024")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2>{t("terms.agreement.title", "1. Agreement to Terms")}</h2>
            <p>{t("terms.agreement.text", "By accessing and using the Bio Green Wax Ltd website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.")}</p>

            <h2>{t("terms.products.title", "2. Products and Services")}</h2>
            <p>{t("terms.products.text", "Bio Green Wax Ltd supplies natural oils, plant-based waxes, and industrial wax products. All products are subject to availability and we reserve the right to modify or discontinue products without prior notice.")}</p>

            <h2>{t("terms.ordering.title", "3. Ordering and Payment")}</h2>
            <p>{t("terms.ordering.text", "Orders are subject to acceptance and availability. Prices are quoted in GBP unless otherwise stated. Payment terms will be specified in your quotation or invoice.")}</p>

            <h2>{t("terms.delivery.title", "4. Delivery")}</h2>
            <p>{t("terms.delivery.text", "Delivery times are estimates only and we are not liable for any delays. Risk passes to the buyer upon delivery. We recommend inspecting goods upon receipt.")}</p>

            <h2>{t("terms.quality.title", "5. Quality and Specifications")}</h2>
            <p>{t("terms.quality.text", "We strive to ensure all products meet stated specifications. Any claims regarding product quality must be made within 7 days of receipt.")}</p>

            <h2>{t("terms.liability.title", "6. Limitation of Liability")}</h2>
            <p>{t("terms.liability.text", "Our liability is limited to the value of goods supplied. We are not liable for indirect, consequential damages, or loss of profits.")}</p>

            <h2>{t("terms.ip.title", "7. Intellectual Property")}</h2>
            <p>{t("terms.ip.text", "All content on this website, including text, images, and logos, is the property of Bio Green Wax Ltd and protected under copyright laws.")}</p>

            <h2>{t("terms.governing.title", "8. Governing Law")}</h2>
            <p>{t("terms.governing.text", "These terms are governed by and construed in accordance with the laws of England and Wales.")}</p>

            <h2>{t("terms.contact.title", "9. Contact Us")}</h2>
            <p>{t("terms.contact.text", "For enquiries regarding these terms, please contact us at:")}</p>
            <p>
              Bio Green Wax Ltd<br />
              Email: legal@biogreenwax.com<br />
              Phone: +44 20 7101 3847
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
