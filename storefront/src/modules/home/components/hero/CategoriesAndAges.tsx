"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const categories = [
    {
        title: "Card-Tastic Fun",
        image: "/category1.jpg",
        slug: "Card-Tastic Fun",
    },
    {
        title: "Flashcard Fun",
        image: "/category2.jpg",
        slug: "Flashcard Fun",
    },
    {
        title: "Kid's Development Games",
        image: "/category3.jpg",
        slug: "Kid's Development Games",
    },
    {
        title: "Wooden Wonders",
        image: "/category4.png",
        slug: "Wooden Wonders",
    },
];

const shopByAge = [
    {
        age: "2-4",
        image: "/age-2-4.jpg",
        slug: "2-4",
    },
    {
        age: "4-6",
        image: "/age-4-6.jpg",
        slug: "4-6",
    },
    {
        age: "6-8",
        image: "/age-6-8.jpg",
        slug: "6-8",
    },
    {
        age: "8+",
        image: "/age-8-plus.jpg",
        slug: "8+",
    },
];

export default function CategoriesAndAges() {
    const router = useRouter();

    const handleCategoryClick = (category: string) => {
        router.push(`/products?category=${encodeURIComponent(category)}`);
    };

    const handleAgeClick = (age: string) => {
        router.push(`/products?age=${encodeURIComponent(age)}`);
    };

    return (
        <div className="bg-[#f6f7fa] min-h-screen w-full py-12 px-4">
            {/* CATEGORIES */}
            <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-2">
                    Categories
                </h2>
                <p className="text-sm font-medium text-gray-600 max-w-lg mx-auto">
                    We design toys not just for kids but with kids
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl  mx-auto">
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                        onClick={() => handleCategoryClick(cat.slug)}
                    >
                        <div className="overflow-hidden">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                width={400}
                                height={300}
                                className="w-full h-60 object-cover group-hover:brightness-75 transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30">
                            <div className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        {/* Label */}
                        {/* <div className="absolute inset-x-0 bottom-0 bg-white/80 py-2 text-center font-medium text-gray-800">
                            {cat.title}
                        </div> */}
                    </div>
                ))}
            </div>

            {/* SHOP BY AGE */}
            <div className="text-center mt-36 mb-6">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-2">
                    Shop By Age
                </h2>
                <p className="text-sm font-medium text-gray-600 max-w-lg mx-auto">
                    JJ Toys & Games for every stage of childhood development
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {shopByAge.map((item, i) => (
                    <div
                        key={i}
                        className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition relative group cursor-pointer"
                        onClick={() => handleAgeClick(item.slug)}
                    >
                        <div className="overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.age}
                                width={300}
                                height={200}
                                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
                            />
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30">
                            <div className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        {/* Age Label */}
                        {/* <div className="absolute inset-x-0 bottom-0 bg-white/80 py-2 text-center font-medium text-gray-800">
                            Ages {item.age}
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
