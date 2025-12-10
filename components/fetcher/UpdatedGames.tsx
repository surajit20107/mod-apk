"use client";
import useSWR from "swr";

export default function UpdatedGames() {
  const url: string = "/api/v1/apk/updated-games";

  const fetcher= (url: string) => fetch(url).then(r => r.json());

  const {
    data: apks,
    error,
    isLoading,
  } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 60
  })

  if (error) return <div>failed to load data</div>

  if (isLoading) return <div>Loading...</div>
  console.log("updated games:", apks)
  return (
    <div>updated games</div>
  )
}
