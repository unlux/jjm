"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function HeroSlider() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();


    return (
        <div className="relative w-full h-[65vh] md:h-[75vh] lg:h-[88.18vh] overflow-hidden">
            <div className="relative h-full w-full">
                <video
                    ref={videoRef}
                    src="/outputx.mp4"
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.9]"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ cursor: "pointer" }}
                />
                <div className="absolute inset-0 animate-fadeIn z-30" />
            </div>
        </div>
    );
}
