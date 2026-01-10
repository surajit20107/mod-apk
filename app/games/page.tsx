"use client";
import { useState } from "react";
import useSWR from "swr";
import { Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [page, setPage] = useState<Number>(1);

  const category = ["games", "new-games"];
  const url = `/api/v1/apk/category?category=${category}&page=${page}`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });

  const apps: App[] = data?.apps || [];

  return (
    <div className="mb-4 sm:mb-10">
      <div className="px-4 my-4 md:my-8 md:px-8">
        <SectionHeader
          title="Games"
          icon={Gamepad2}
          iconColor="text-blue-400"
        />
      </div>

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
        <div className="text-center text-gray-400 py-8">No games available</div>
      )}

      {/* pagination */}
      <div>
        <div className="flex justify-center items-center gap-4 mt-6 font-bold md:mt-10">
          <button
            onClick={() => setPage(Number(page) - 1)}
            disabled={page === 1}
            className="disable:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>
          <span>{Number(page)}</span>
          <button
            onClick={() => setPage(Number(page) + 1)}
            disabled={!data?.pagination?.hasMore}
            className="disable:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
