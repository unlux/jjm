"use client";

import Image from "next/image";
import CircularText from "./CircularText";

export default function AboutSection() {
    return (
        <section className="bg-white w-full px-6 md:px-12 py-16 flex flex-col justify-center">
            <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-12">
                {/* Images Section - Stacked on mobile, left side in desktop */}
                <div className="relative w-full flex flex-col items-center md:items-start">
                    {/* Main Image - Hand holding cards */}
                    <div className="relative w-full h-[350px] md:h-[450px]">
                        <Image
                            src="/feature.jpg"
                            alt="Character Flashcards"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        
                        {/* Circular Text positioned at bottom end of first image - Hidden on mobile */}
                        <div className="hidden md:block absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 z-10">
                            <CircularText 
                                                    text="C        R        A        F        T        E        D        •        W        I        T        H        •        L        O        V        E        •        "
                                spinDuration={15}
                                onHover="speedUp"
                                className="w-[150px] h-[150px] text-orange-500 bg-yellow-100 shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Circular Text for mobile - Centered below first image */}
                    <div className="md:hidden mt-6 flex justify-center">
                        <CircularText 
                            text="C R A F T E D   W I T H   L O V E   •   D E S I G N E D   F O R   K I D S   •   "
                            spinDuration={15}
                            onHover="speedUp"
                            className="w-[100px] h-[100px] text-orange-500 bg-yellow-100 shadow-lg"
                        />
                    </div>
                </div>

                {/* Right column with text and image 2 on desktop */}
                <div className="w-full flex flex-col">
                    {/* Text Section */}
                    <div className="mt-8 md:mt-0">
                        <p className="uppercase text-sm tracking-widest text-black font-semibold mb-2 font-fredoka">
                            OUR APPROACH
                        </p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 md:mb-8 leading-tight font-baloo">
                            We help you take care
                            <br className="hidden md:block" />
                            of the kids
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-md mb-10 md:mb-12 max-w-lg">
                            Our products are crafted with love and expertise by
                            dedicated teachers who spend every day immersed in the
                            wonderful world of children. They&apos;re the
                            superheroes of understanding and know just what sparks
                            joy and learning in young minds. Dive into our playful
                            learning experiences and watch the magic unfold!
                        </p>
                    </div>

                    {/* Second image below text */}
                    <div className="mt-8">
                        <Image
                            src="/feature2.jpg"
                            alt="Colorful Flashcards"
                            width={600}
                            height={250}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}