import { Container, Heading, Button, toast } from "@medusajs/ui";
import { useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { sdk } from "../../../lib/sdk";

type RevalidateTag =
  | "blogs"
  | "testimonials"
  | "hero"
  | "offers"
  | "products"
  | "all";

const RevalidatePage = () => {
  const [loading, setLoading] = useState<Record<RevalidateTag, boolean>>({
    blogs: false,
    testimonials: false,
    hero: false,
    offers: false,
    products: false,
    all: false,
  });

  const storefrontUrl =
    import.meta.env.VITE_STOREFRONT_URL ||
    import.meta.env.VITE_NEXT_PUBLIC_MEDUSA_STOREFRONT_URL ||
    "http://localhost:8000";

  const handleRevalidate = async (tag: RevalidateTag) => {
    setLoading((prev) => ({ ...prev, [tag]: true }));

    try {
      const response = await sdk.client.fetch<{ message: string }>("/admin/revalidate", {
        method: "POST",
        body: { tag },
      });

      toast.success(response.message || `Revalidated ${tag} successfully`);
    } catch (error: any) {
      console.error(`Failed to revalidate ${tag}:`, error);
      toast.error(`Failed to revalidate ${tag}: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, [tag]: false }));
    }
  };

  const sections = [
    {
      tag: "blogs" as RevalidateTag,
      title: "Blogs",
      description:
        "Revalidates blogs listing and individual blog detail pages.",
    },
    {
      tag: "testimonials" as RevalidateTag,
      title: "Testimonials",
      description:
        "Revalidates the home page testimonials section and the testimonials API cache.",
    },
    {
      tag: "hero" as RevalidateTag,
      title: "Hero Slider (Home)",
      description: "Revalidates the home page that renders the hero slider.",
    },
    {
      tag: "offers" as RevalidateTag,
      title: "Offers Marquee (Top Bar)",
      description:
        "Revalidates the cached offers shown in the top marquee and the offers API cache.",
    },
    {
      tag: "products" as RevalidateTag,
      title: "Products",
      description:
        "Revalidates the store listing and all product detail pages.",
    },
    {
      tag: "all" as RevalidateTag,
      title: "All Relevant",
      description:
        "Revalidates home, blogs listing/detail, testimonials, hero, offers, and product pages.",
    },
  ];

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Revalidate Storefront Cache</Heading>
          <p className="text-sm text-gray-600 mt-1">
            Trigger revalidation of ISR pages on the storefront instantly after
            making content changes.
          </p>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.tag} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {section.description}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleRevalidate(section.tag)}
                  isLoading={loading[section.tag]}
                >
                  Revalidate
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 When to use revalidation
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>After creating, updating, or deleting blogs</li>
            <li>After modifying hero slides</li>
            <li>After changing testimonials</li>
            <li>After updating marquee offers</li>
            <li>
              After product changes (handled automatically by subscribers)
            </li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            🔧 Technical Details
          </h4>
          <p className="text-xs text-gray-700 mb-2">
            Storefront URL:{" "}
            <code className="bg-white px-1 py-0.5 rounded">
              {storefrontUrl}
            </code>
          </p>
          <p className="text-xs text-gray-600">
            These buttons call the storefront's <code>/api/revalidate</code>{" "}
            endpoint to clear Next.js ISR cache. If you have REVALIDATE_SECRET
            configured, make sure it's accessible from the admin.
          </p>
        </div>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Revalidate Cache",
});

export default RevalidatePage;
