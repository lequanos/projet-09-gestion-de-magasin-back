export type OpenFoodFactsProductResponse = {
  code: string;
  product: OpenFoodFactsProduct;
  status: 0 | 1;
  status_verbose: 'product found' | 'product not found';
};

export type OpenFoodFactsProduct = {
  brands_imported: string;
  code: string;
  ecoscore_grade: string;
  image_url: string;
  ingredients_text_fr: string;
  nutriscore_grade: string;
  product_name: string;
  quantity: string;
};
