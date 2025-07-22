"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarFilter from "../components/SidebarFilter";
import ProductGrid from "../components/ProductGrid";
import {
  getProducts,
  getProductAgeGroup,
  getProductCategory,
} from "../lib/products";
import { Product } from "../lib/sdk";

export default function ProductContent() {
  const searchParams = useSearchParams();
  const age = searchParams.get("age");
  const category = searchParams.get("category");
  const searchTerm = searchParams.get("search");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // For now we're doing client-side filtering, but ideally
        // you would pass these parameters to the API for server-side filtering
        const response = await getProducts({
          limit: 100, // Get enough products to filter client-side
          q: searchTerm || undefined,
        });

        setProducts(response.products);
        setTotalCount(response.count);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  // Filter products client-side based on URL parameters
  const filteredProducts = products.filter((product) => {
    const productAgeGroup = getProductAgeGroup(product);
    const productCategory = getProductCategory(product);

    const ageMatch = age ? productAgeGroup === age : true;
    const catMatch = category ? productCategory === category : true;
    const searchMatch = searchTerm
      ? product.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return ageMatch && catMatch && searchMatch;
  });

  return (
    <>
      {(age || category) && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {age && (
              <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center">
                Age: {age}
              </div>
            )}
            {category && (
              <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm flex items-center">
                Category: {category}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <SidebarFilter />
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                >
                  <div className="h-52 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Error Loading Products
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}

          {!isLoading && !error && totalCount > filteredProducts.length && (
            <div className="mt-6 text-center text-gray-500">
              Showing {filteredProducts.length} of {totalCount} products
            </div>
          )}
        </main>
      </div>
    </>
  );
}
