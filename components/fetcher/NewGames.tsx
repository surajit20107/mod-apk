"use client";
import useSWR from "swr";
import { Flame } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppCardSkeleton from "@/components/ui/AppCardSkeleton";
import SectionHeader from "@/components/ui/SectionHeader";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function NewGames() {
  const url: string = "/api/v1/apk/new-games";
  
  const {
    data,
    error,
    isLoading,
  } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000
  });

  const apps = data?.newGames || [];

  return (
    <section className="mb-8 sm:mb-12">
      <SectionHeader 
        title="New Games" 
        icon={Flame} 
        iconColor="text-orange-400"
        viewAllHref="/games/new"
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
          Failed to load new games
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <AppCardSkeleton key={i} variant="compact" />
          ))}
        </div>
      )}

      {!isLoading && !error && apps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apps.slice(0, 4).map((app: any) => (
            <AppCard key={app._id} app={app} variant="compact" />
          ))}
        </div>
      )}

      {!isLoading && !error && apps.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No new games available
        </div>
      )}
    </section>
  );
}
