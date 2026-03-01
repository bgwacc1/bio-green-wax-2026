import { useLanguage } from "@/i18n/LanguageContext";
import { Product } from "@/data/products";

const productIdToKeyMap: Record<string, string> = {
  "sunflower-oil": "sunflowerOil",
  "coconut-oil": "coconutOil",
  "palm-oil": "palmOil",
  "soybean-oil": "soybeanOil",
  "rapeseed-oil": "rapeseedOil",
  "olive-oil": "oliveOil",
  "soy-wax": "soyWax",
  "sunflower-wax": "sunflowerWax",
  "palm-stearin": "palmStearin",
  "coconut-wax": "coconutWax",
  "rapeseed-wax": "rapeseedWax",
  "beeswax": "beeswax",
  "castor-wax": "castorWax",
  "paraffin-wax-58": "paraffinWax58",
  "paraffin-wax-62": "paraffinWax62",
  "microcrystalline-wax": "microcrystallineWax",
  "slack-wax": "slackWax",
  "pe-wax": "peWax",
  "ft-wax": "ftWax",
  "food-grade-microcrystalline-wax": "foodGradeMicroWax",
  "specialty-waxes": "specialtyWaxes",
  "mineral-oil": "mineralOil",
};

const categoryToKeyMap: Record<string, string> = {
  "edible-oils": "edibleOils",
  "plant-waxes": "plantWaxes",
  "industrial-waxes": "industrialWaxes",
  "all": "all",
  "Edible Oils": "edibleOils",
  "Plant-Based Waxes": "plantWaxes",
  "Industrial Waxes": "industrialWaxes",
  "All Products": "all",
};

export interface TranslatedProduct extends Omit<Product, 'name' | 'description' | 'categoryLabel'> {
  name: string;
  description: string;
  categoryLabel: string;
}

export function useProductTranslation() {
  const { t } = useLanguage();

  const translateProduct = (product: Product): TranslatedProduct => {
    const key = productIdToKeyMap[product.id];
    if (key) {
      return {
        ...product,
        name: t(`products.${key}.name`) || product.name,
        description: t(`products.${key}.desc`) || product.description,
        categoryLabel: translateCategory(product.categoryLabel),
      };
    }
    return {
      ...product,
      categoryLabel: translateCategory(product.categoryLabel),
    };
  };

  const translateCategory = (category: string): string => {
    const key = categoryToKeyMap[category];
    if (key) {
      return t(`products.categories.${key}`) || category;
    }
    return category;
  };

  const translateCategoryId = (categoryId: string): string => {
    const key = categoryToKeyMap[categoryId];
    if (key) {
      return t(`products.categories.${key}`) || categoryId;
    }
    return categoryId;
  };

  return {
    translateProduct,
    translateCategory,
    translateCategoryId,
  };
}
