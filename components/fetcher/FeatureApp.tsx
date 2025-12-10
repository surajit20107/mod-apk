"use client";
import useSWR from "swr";

export default function FeatureApp() {
  const url: string = "/api/v1/apk/featured";
  
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  
  const {
    data: apks,
    error,
    isLoading
  } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 60,
  });

  if (error) return <div>failed to load data</div>

  if (isLoading) return <div>Loading...</div>
  if (apks) console.log(apks)
  return (
    <div>featured app</div>
  )
}
