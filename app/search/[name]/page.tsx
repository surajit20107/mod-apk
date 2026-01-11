"use client";
import { useParams } from "next/navigation";
import useSWR from "swr";
import AppCard from "@/components/ui/AppCard";
import AppCardSkeleton from "@/components/ui/AppCardSkeleton";

export default function SearchPage() {
  const params = useParams();

  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const { data, error, isLoading } = useSWR(
    `/api/v1/apk?search=${params.name}`,
    fetcher,
  );

  const apps = data?.apks || [];

  return (
    <div className="mb-4 sm:mb-10">
      <div className="px-4 my-4 md:my-8 md:px-8"></div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
          Failed to load apps
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2 md:px-4">
          {[...Array(6)].map((_, i) => (
            <AppCardSkeleton key={i} variant="compact" />
          ))}
        </div>
      )}

      {!isLoading && !error && apps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {apps.slice(0, 10).map((app: any) => (
            <div className="px-2 md:px-4">
              <AppCard key={app._id} app={app} variant="compact" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && apps.length === 0 && (
        <div className="text-center text-gray-400 py-8">No apps available</div>
      )}
    </div>
  );
}
