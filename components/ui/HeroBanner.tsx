"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface App {
  _id: string;
  name: string;
  image: string;
}

interface HeroBannerProps {
  apps: App[];
}

export default function HeroBanner({ apps }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const displayApps = apps.slice(0, 4);

  useEffect(() => {
    if (displayApps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayApps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayApps.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayApps.length) % displayApps.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayApps.length);
  };

  if (displayApps.length === 0) return null;

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayApps.map((app) => (
            <Link
              key={app._id}
              href={`/app/${app._id}`}
              className="min-w-full"
            >
              <div className="relative h-40 sm:h-52 md:h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-10">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {app.name}
                    </h3>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base">
                      GET
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
                    <img
                      src={app.image || "/placeholder-app.png"}
                      alt={app.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {displayApps.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors hidden sm:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors hidden sm:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-2 mt-4">
            {displayApps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
