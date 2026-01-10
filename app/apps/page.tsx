"use client";
import { useState } from "react";
import useSWR from "swr";
import { AppWindow, ChevronLeft, ChevronRight } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppCardSkeleton from "@/components/ui/AppCardSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";

interface App {
  _id: string;
  name: string;
  image: string;
  packageName: string;
  category: string;
  version: string;
  rating: number;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AppsCategory() {
  const [page, setPage] = useState(1);
  const category = ["apps", "new-apps"];
  const url = `/api/v1/apk/category?category=${category}&page=${page}`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });

  const apps:App[] = data?.apps || [];

  return (
    <div className="mb-8 sm:mb-12">
      <SectionHeader title="Apps" icon={AppWindow} iconColor="text-blue-400" />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
          Failed to load apps
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <AppCardSkeleton key={i} variant="compact" />
          ))}
        </div>
      )}

      {!isLoading && !error && apps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {apps.slice(0, 24).map((app: any) => (
            <AppCard key={app._id} app={app} variant="compact" />
          ))}
        </div>
      )}

      {!isLoading && !error && apps.length === 0 && (
        <div className="text-center text-gray-400 py-8">No apps available</div>
      )}
      
      {/* pagination */}
      <div>
        <div className="flex items-center justify-center gap-2 mt-6">
          <button>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-400">{page}</span>
          <button>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
    </div>
  );
}
