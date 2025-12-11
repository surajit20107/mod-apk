"use client";
import useSWR from "swr";
import { Sparkles } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppCardSkeleton from "@/components/ui/AppCardSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import HeroBanner from "@/components/ui/HeroBanner";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function FeatureApp() {
  const url: string = "/api/v1/apk/featured";
  
  const {
    data,
    error,
    isLoading
  } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });

  const apps = data?.featuredApps || [];

  return (
    <section className="mb-8 sm:mb-12">
      {isLoading ? (
        <div className="h-40 sm:h-52 md:h-64 bg-gray-800/40 rounded-2xl animate-pulse mb-8"></div>
      ) : apps.length > 0 ? (
        <HeroBanner apps={apps} />
      ) : null}

      <SectionHeader 
        title="Featured" 
        icon={Sparkles} 
        iconColor="text-yellow-400"
        viewAllHref="/featured"
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
          Failed to load featured apps
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <AppCardSkeleton key={i} variant="featured" />
          ))}
        </div>
      )}

      {!isLoading && !error && apps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apps.map((app: any) => (
            <AppCard key={app._id} app={app} variant="featured" />
          ))}
        </div>
      )}

      {!isLoading && !error && apps.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No featured apps available
        </div>
      )}
    </section>
  );
}
