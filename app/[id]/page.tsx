"use client"
import { useParams } from "next/navigation";
import useSWR from "swr";
import AppCardSkeleton from "@/components/ui/AppCardSkeleton";
import { Home } from "lucide-react";

export default function AppPage() {
  const params = useParams();
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data, error, isLoading } = useSWR(`/api/v1/apk/${params.id}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });
  
  return (
    <div>
      app details
    </div>
  )
}