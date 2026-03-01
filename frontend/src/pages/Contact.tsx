import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send, Beaker, Building2, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEO, BreadcrumbSchema } from "@/components/SEO";
import { useSEOPageMeta } from "@/hooks/useCMS";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { products } from "@/data/products";
import { useContactInfo } from "@/hooks/useCMS";
import { useSubmitContactEnquiry } from "@/hooks/useContactEnquiries";

// Enquiry types
const enquiryTypes = [
  { id: "general", label: "General Inquiry" },
  { id: "quote", label: "Request Quote" },
  { id: "sample", label: "Request Sample" },
  { id: "consultation", label: "Technical Consultation" },
];

// Form Schema
const contactFormSchema = z.object({
  enquiryType: z.string().min(1, "Please select an enquiry type"),
  productId: z.string().optional(),
  customProductName: z.string().max(100).optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address").max(255),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  // Quote specific
  quantity: z.string().optional(),
  unit: z.string().optional(),
  deliveryLocation: z.string().max(200).optional(),
  // Sample specific
  companyType: z.string().optional(),
  purpose: z.string().max(500).optional(),
  // Consultation specific
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  timezone: z.string().optional(),
  // Common
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { data: seoMeta } = useSEOPageMeta("/contact");
  const [searchParams] = useSearchParams();
  const [selectedEnquiryType, setSelectedEnquiryType] = useState("general");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [customProductName, setCustomProductName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  
  const submitEnquiryMutation = useSubmitContactEnquiry();
  
  // Fetch contact info from database
  const { data: contactInfo } = useContactInfo();
  
  // Helper to get contact value by key
  const getContact = (key: string, fallback: string = "") => {
    return contactInfo?.find((c) => c.key === key)?.value || fallback;
  };
  
  const phone = getContact("phone", "+44 20 7101 3847");
  const whatsapp = getContact("whatsapp", "+44 20 7101 3847");
  const email = getContact("email", "info@biogreenwax.com");
  const address = getContact("address", "Bio Green Wax Ltd, 128 City Road, London, United Kingdom, EC1V 2NX");
  const companyRegistration = getContact("company_registration", "15814481");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      enquiryType: "general",
      productId: "",
      customProductName: "",
      name: "",
      email: "",
      company: "",
      phone: "",
      quantity: "",
      unit: "MT",
      deliveryLocation: "",
      companyType: "",
      purpose: "",
      preferredDate: "",
      preferredTime: "",
      timezone: "GMT",
      message: "",
    },
  });

  useEffect(() => {
    const type = searchParams.get("type");
    const productParam = searchParams.get("product");
    
    // Map URL params to enquiry types - default to "general" if no type specified
    if (type) {
      const mappedType = type === "callback" ? "consultation" : type;
      if (["general", "quote", "sample", "consultation"].includes(mappedType)) {
        setSelectedEnquiryType(mappedType);
        form.setValue("enquiryType", mappedType);
      }
    } else {
      // Default to general enquiry when no type param
      setSelectedEnquiryType("general");
      form.setValue("enquiryType", "general");
    }
    
    if (productParam) {
      setSelectedProduct(productParam);
      form.setValue("productId", productParam);
    }
  }, [searchParams, form]);

  const onSubmit = async (data: ContactFormData) => {
    const enquiryLabel = enquiryTypes.find(t => t.id === data.enquiryType)?.label || "Inquiry";
    const productName = data.productId === "other" 
      ? data.customProductName 
      : products.find(p => p.id === data.productId)?.name;
    const subject = productName ? `${enquiryLabel} - ${productName}` : enquiryLabel;
    
    setIsSubmitting(true);
    
    try {
      // Submit to database and get the enquiry ID
      const result = await submitEnquiryMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        subject: subject,
        message: data.message,
      });
      
      // Only trigger email notification if we have a valid enquiry ID
      if (result?.id) {
        // Email notification could be implemented via backend API
        console.log("Contact enquiry submitted:", result.id);
      }
      
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for your message. We'll get back to you within 24 hours.",
      });
      
      form.reset();
      setSelectedEnquiryType("general");
      setSelectedProduct("");
      setCustomProductName("");
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast({
        title: "Error",
        description: "Failed to submit your enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate next 14 business days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split("T")[0],
          label: date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
        });
      }
    }
    return dates;
  };

  const timeSlots = [
    { value: "09:00", label: "9:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "15:00", label: "3:00 PM" },
    { value: "16:00", label: "4:00 PM" },
    { value: "17:00", label: "5:00 PM" },
  ];

  const timezones = [
    { value: "GMT", label: "GMT (London)" },
    { value: "CET", label: "CET (Paris, Berlin)" },
    { value: "EST", label: "EST (New York)" },
    { value: "PST", label: "PST (Los Angeles)" },
    { value: "GST", label: "GST (Dubai)" },
    { value: "IST", label: "IST (Mumbai)" },
    { value: "CST", label: "CST (Beijing)" },
  ];

  const companyTypes = [
    "Manufacturer",
    "Distributor",
    "Wholesaler",
    "Retailer",
    "Research & Development",
    "Cosmetics Company",
    "Food Producer",
    "Candle Maker",
    "Other",
  ];

  const handleEnquiryTypeChange = (value: string) => {
    setSelectedEnquiryType(value);
    form.setValue("enquiryType", value);
  };

  const handleProductChange = (value: string) => {
    setSelectedProduct(value);
    form.setValue("productId", value);
  };

  // Determine if subject should be partially editable
  const isSubjectEditable = !selectedProduct || selectedProduct === "other";
  
  // Generate subject display
  const getSubjectPrefix = () => {
    return enquiryTypes.find(t => t.id === selectedEnquiryType)?.label || "Inquiry";
  };

  const getFullSubject = () => {
    const prefix = getSubjectPrefix();
    if (selectedProduct && selectedProduct !== "other") {
      const productName = products.find(p => p.id === selectedProduct)?.name || "";
      return `${prefix} - ${productName}`;
    }
    if (customProductName) {
      return `${prefix} - ${customProductName}`;
    }
    return prefix;
  };

  const handleCustomProductChange = (value: string) => {
    setCustomProductName(value);
    form.setValue("customProductName", value);
  };

  return (
    <Layout>
      <SEO
        title={seoMeta?.title || "Contact Us"}
        description={seoMeta?.description || "Contact Bio Green Wax Ltd for enquiries about edible oils, industrial waxes, product samples, or quotes. Get in touch with our team today."}
        keywords={seoMeta?.keywords || "contact bio green wax, oil supplier contact, wax supplier UK, request quote, product enquiry"}
        url="/contact"
        noindex={seoMeta?.no_index}
      />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }]} />
      {/* Hero Section - Ultra Compact */}
      <section className="bg-gradient-to-br from-primary to-green-dark text-primary-foreground py-4 md:py-6 lg:py-8">
        <div className="container-wide">
          <p className="text-primary-foreground/80 text-xs md:text-sm uppercase tracking-wider mb-1">{t("contact.letsGetToWork", "Let's Get to Work")}</p>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold">
            {t("contact.title", "Contact Us")}
          </h1>
        </div>
      </section>

      {/* Main Content - Side by Side Layout */}
      <section className="py-4 md:py-8 lg:py-12 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-4 md:gap-8 lg:gap-12">
            {/* Left Column - Contact Information */}
            <div className="lg:pt-8">
              {/* Phone and Message */}
              <div className="mb-4 md:mb-8">
                <h3 className="text-sm md:text-lg font-semibold text-foreground mb-2 md:mb-4">
                  {t("contact.phoneAndMessage", "Phone and Message Us")}
                </h3>
                <a 
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 md:gap-3 text-muted-foreground hover:text-primary transition-colors mb-1.5 md:mb-2 text-xs md:text-base"
                >
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                  <span>{phone}</span>
                </a>
                <a 
                  href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 md:gap-3 text-muted-foreground hover:text-primary transition-colors mb-1.5 md:mb-2 text-xs md:text-base"
                >
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>{whatsapp} (WhatsApp)</span>
                </a>
                <a 
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 md:gap-3 text-muted-foreground hover:text-primary transition-colors text-xs md:text-base"
                >
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                  <span>{email}</span>
                </a>
              </div>

              {/* Company Address */}
              <div>
                <h3 className="text-sm md:text-lg font-semibold text-foreground mb-2 md:mb-4">
                  {t("contact.companyAddress", "Company Address")}
                </h3>
                <p className="flex items-start gap-2 md:gap-3 text-muted-foreground mb-1.5 md:mb-2 text-xs md:text-base">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0 mt-0.5" />
                  <span>{address}</span>
                </p>
                <p className="flex items-center gap-2 md:gap-3 text-muted-foreground text-[10px] md:text-sm">
                  <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                  <span>{t("contact.companyRegistration", "Company registration")}: {companyRegistration}</span>
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-[#F5F0E8] rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-sm border border-border">
              <h2 className="text-base md:text-xl font-semibold mb-4 md:mb-6">{t("contact.sendMessage", "Send Message")}</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-5">
                  {/* Enquiry Type & Product Selection - Side by Side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <FormField
                      control={form.control}
                      name="enquiryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-sm font-medium">{t("contact.form.enquiryType", "Type of Enquiry")} *</FormLabel>
                          <Select onValueChange={handleEnquiryTypeChange} value={selectedEnquiryType}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("contact.form.selectEnquiryType", "Select enquiry type")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background">
                              {enquiryTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-sm">{t("contact.form.product", "Product")} ({t("contact.form.optional", "Optional")})</FormLabel>
                          <Select onValueChange={handleProductChange} value={selectedProduct}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("contact.form.selectProduct", "Select a product")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background">
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="other">{t("contact.form.otherProduct", "Other product")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Technical Consultation Description */}
                  {selectedEnquiryType === "consultation" && (
                    <div className="bg-muted/50 rounded-lg p-2 md:p-3 border border-border">
                      <div className="flex items-start gap-2">
                        <Beaker className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground text-xs md:text-sm">{t("contact.form.technicalConsultation", "Need Technical Consultation?")}</h4>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                            {t("contact.form.technicalConsultationDesc", "Looking for the right wax blend, custom formulation, or facing production challenges? Our experts can help.")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subject Line - Dynamic */}
                  <div>
                    <label className="text-xs md:text-sm font-medium text-foreground">{t("contact.form.subject", "Subject")}</label>
                    {isSubjectEditable ? (
                      <div className="flex mt-1 md:mt-1.5">
                        <div className="flex items-center px-2 md:px-3 bg-muted border border-r-0 border-input rounded-l-md text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                          {getSubjectPrefix()} -
                        </div>
                        <Input
                          placeholder={t("contact.form.enterProductName", "Enter product name")}
                          value={customProductName}
                          onChange={(e) => handleCustomProductChange(e.target.value)}
                          className="rounded-l-none text-xs md:text-sm"
                        />
                      </div>
                    ) : (
                      <Input
                        value={getFullSubject()}
                        readOnly
                        className="mt-1 md:mt-1.5 bg-muted cursor-not-allowed text-xs md:text-sm"
                      />
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-sm">{t("contact.form.yourName", "Your Name")} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t("contact.form.namePlaceholder", "John Smith")} className="text-xs md:text-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-sm">{t("contact.form.yourPhone", "Your Phone")}</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder={t("contact.form.phonePlaceholder", "+44 123 456 7890")} className="text-xs md:text-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-sm">{t("contact.form.yourEmail", "Your Email")} *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t("contact.form.emailPlaceholder", "john@company.com")} className="text-xs md:text-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-sm">{t("contact.form.companyName", "Company Name")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("contact.form.companyPlaceholder", "Your Company Ltd")} className="text-xs md:text-sm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Quote-specific fields */}
                  {selectedEnquiryType === "quote" && (
                    <>
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs md:text-sm">{t("contact.form.quantity", "Quantity")} *</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="100" className="text-xs md:text-sm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs md:text-sm">{t("contact.form.unit", "Unit")} *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="text-xs md:text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-background">
                                  <SelectItem value="MT">Metric Tonnes (MT)</SelectItem>
                                  <SelectItem value="KG">Kilograms (KG)</SelectItem>
                                  <SelectItem value="LB">Pounds (LB)</SelectItem>
                                  <SelectItem value="L">Litres (L)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="deliveryLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm">{t("contact.form.deliveryLocation", "Delivery Location")} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t("contact.form.deliveryPlaceholder", "City, Country")} className="text-xs md:text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Sample-specific fields */}
                  {selectedEnquiryType === "sample" && (
                    <>
                      <FormField
                        control={form.control}
                        name="companyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm">{t("contact.form.companyType", "Company Type")} *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-xs md:text-sm">
                                  <SelectValue placeholder={t("contact.form.selectCompanyType", "Select your company type")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                {companyTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm">{t("contact.form.purposeOfSample", "Purpose of Sample")} *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("contact.form.purposePlaceholder", "Please describe how you plan to use this sample...")}
                                className="min-h-[60px] md:min-h-[80px] resize-none text-xs md:text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Consultation-specific fields */}
                  {selectedEnquiryType === "consultation" && (
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm">{t("contact.form.date", "Date")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-xs md:text-sm">
                                  <SelectValue placeholder={t("contact.form.date", "Date")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                {getAvailableDates().map((date) => (
                                  <SelectItem key={date.value} value={date.value}>
                                    {date.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm">{t("contact.form.time", "Time")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-xs md:text-sm">
                                  <SelectValue placeholder={t("contact.form.time", "Time")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot.value} value={slot.value}>
                                    {slot.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs md:text-sm">{t("contact.form.timezone", "Zone")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-xs md:text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background">
                                {timezones.map((tz) => (
                                  <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs md:text-sm">{t("contact.form.yourMessage", "Your Message")} *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              selectedEnquiryType === "consultation"
                                ? t("contact.form.messagePlaceholderConsultation", "Please describe the technical challenge or solution you're looking for...")
                                : selectedEnquiryType === "quote"
                                ? t("contact.form.messagePlaceholderQuote", "Please provide any additional details about your requirements...")
                                : selectedEnquiryType === "sample"
                                ? t("contact.form.messagePlaceholderSample", "Tell us more about your project and testing needs...")
                                : t("contact.form.messagePlaceholderGeneral", "How can we help you today?")
                            }
                            className="min-h-[80px] md:min-h-[100px] resize-none text-xs md:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-xs md:text-sm md:h-10"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                        {t("contact.form.sending", "Sending...")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                        {t("contact.form.sendMessage", "Send Message")}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
