// Extend the Customer type to include wishlist property
declare module "@medusajs/medusa" {
  interface Customer {
    wishlist?: {
      id: string;
      items?: any[];
      [key: string]: any;
    };
  }
}
