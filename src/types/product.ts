/**
 * Shared product type definition used across the application
 */
export interface Product {
  name: string;
  price: string;
  image: string;
  category: string;
  badge?: string;
  fabric?: string;
  fit?: string;
  colors?: string[];
  delivery?: string;
  sizes?: string[];
  shopUrl?: string;
}

/**
 * Product data for wishlist (minimal subset)
 */
export interface WishlistProduct {
  name: string;
  price: string;
  image: string;
  category: string;
}
