import { OpenFoodFactsProduct } from 'src/responseModels/openFoodFacts';

export function isOpenFoodFactsProduct(
  product: any,
): product is OpenFoodFactsProduct {
  return product.hasOwnProperty('ecoscore_grade');
}
