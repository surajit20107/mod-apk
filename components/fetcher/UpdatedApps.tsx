"use client";
import useSWR from "swr";

export default function UpdatedApps() {
  const url: string = "/api/v1/apk/updated-apps";

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
  console.log("updated apps:", apks)
  return (
    <div>updated apps</div>
  )
}
