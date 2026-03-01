import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHeroSlides } from "@/hooks/useCMS";
import { useLanguage } from "@/i18n/LanguageContext";
import OptimizedImage from "@/components/OptimizedImage";

import heroFarm from "@/assets/hero-farm.jpeg";
import heroOils from "@/assets/hero-oils.jpeg";
import heroIndustrial from "@/assets/hero-industrial.jpeg";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, getLocalizedPath, currentLanguage } = useLanguage();
  // Pass language to hook - translations are automatically merged by API
  const { data: dynamicSlides } = useHeroSlides(false, currentLanguage);

  const fallbackImages = [heroFarm, heroOils, heroFarm, heroIndustrial];

  const slides = (dynamicSlides && dynamicSlides.length > 0)
    ? dynamicSlides.map((slide, index) => ({
        ...slide,
        image_url: slide.image_url || fallbackImages[index % fallbackImages.length] || heroFarm
      }))
    : [
        { id: "1", image_url: heroFarm, title: "Premium Oils from Nature's Finest", subtitle: "Sustainably sourced edible oils from trusted UK suppliers", cta_text: "Explore Our Oils", cta_link: "/products?category=edible-oils" },
        { id: "2", image_url: heroOils, title: "Quality Edible Oils", subtitle: "Sunflower, Palm, Coconut, and Rapeseed oils for food industry", cta_text: "View Products", cta_link: "/products?category=edible-oils" },
      ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-primary lg:bg-transparent">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={cn(
              "relative w-full transition-all duration-1000",
              isActive 
                ? "opacity-100 visible z-20 block" 
                : "opacity-0 invisible z-0 pointer-events-none absolute inset-0"
            )}
          >
          <div className="relative w-full lg:h-[75vh] xl:h-[80vh]">
            <OptimizedImage 
              src={slide.image_url} 
              alt={slide.title}
              className="w-full h-auto object-contain lg:h-full lg:object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

            <div className="absolute inset-0 flex items-center">
              <div className="container-wide px-4 sm:px-6 lg:px-8">
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl",
                    isActive ? "animate-slide-up" : ""
                  )}
                >
                  <h1 
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-heading font-bold mb-2 sm:mb-3 md:mb-4 leading-tight text-white"
                    style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
                  >
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p 
                      className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 mb-3 sm:mb-4 md:mb-6 line-clamp-2 sm:line-clamp-none"
                      style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    {slide.cta_text && slide.cta_link && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-xs sm:text-sm md:text-base h-8 px-3 sm:h-9 sm:px-4 md:h-10 md:px-6 shadow-lg"
                      >
                        <Link to={getLocalizedPath(slide.cta_link)}>
                          {slide.cta_text}
                        </Link>
                      </Button>
                    )}
                    <Button
                      asChild
                      size="sm"
                      className="bg-white/90 text-primary border-2 border-white hover:bg-white font-semibold text-xs sm:text-sm md:text-base h-8 px-3 sm:h-9 sm:px-4 md:h-10 md:px-6 shadow-lg backdrop-blur-sm"
                    >
                      <Link to={getLocalizedPath("/contact?type=general")}>
                        {t("home.hero.postInquiry")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })}

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-accent w-8"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
