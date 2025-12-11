"use client";
import { Star, Download, HardDrive, RefreshCw } from "lucide-react";
import Link from "next/link";

interface AppCardProps {
  app: {
    _id: string;
    name: string;
    image: string;
    category: string;
    size: string;
    rating: number;
    version: string;
    description: string;
    modInfo?: string;
    tags?: string[];
  };
  variant?: "featured" | "compact";
}

export default function AppCard({ app, variant = "featured" }: AppCardProps) {
  const isUpdated = app.tags?.includes("updated");
  
  if (variant === "compact") {
    return (
      <Link href={`/app/${app._id}`}>
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 hover:border-gray-600 transition-all duration-200 group">
          <div className="flex gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={app.image || "/placeholder-app.png"}
                alt={app.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
              />
              {app.modInfo && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  MOD
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white text-sm sm:text-base truncate group-hover:text-blue-400 transition-colors">
                  {app.name}
                </h3>
                {isUpdated && (
                  <span className="flex-shrink-0 bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    UPDATED
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span>{app.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  {app.size}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    v{app.version}
                  </span>
                </div>
                {app.modInfo && (
                  <span className="text-[10px] text-green-400 truncate max-w-[100px]">
                    {app.modInfo}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/app/${app._id}`}>
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 hover:border-gray-600 transition-all duration-200 group h-full flex flex-col">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={app.image || "/placeholder-app.png"}
              alt={app.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-base sm:text-lg truncate group-hover:text-blue-400 transition-colors">
              {app.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-300">{app.rating?.toFixed(1) || "N/A"}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mt-3 line-clamp-2 flex-1">
          {app.description || "No description available"}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              v{app.version}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {app.size}
            </span>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </Link>
  );
}
