"use client";
import { useState } from "react";
import useSWR from "swr";
import { AppWindow } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppCardSkeleton from "@/components/ui/AppCardSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AppsCategory() {
  const [page, setPage] = useState(1);
  const category = ["apps", "new-apps"];
  const url = `/api/v1/apk/category?category=${category}&page=${page}`;

  const {
    data,
    error,
    isLoading
  } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000
  });

  const apps = data?.apps || [];
  
  return (
    <section className="mb-8 sm:mb-12">
      <SectionHeader 
        title="Apps" 
        icon={AppWindow} 
        iconColor="text-blue-400"
      />

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
        <div className="text-center text-gray-400 py-8">
          No apps available
        </div>
      )}
    </section>
  )
}
