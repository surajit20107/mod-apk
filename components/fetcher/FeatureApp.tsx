import useSwr from "swr";

export default function FeatureApp() {
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  
  const {
    data: apks,
    error,
    isLoading
  } = useSwr("/api/v1/apk/featured", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 60,
  });

  if (error) return <div>failed to load data</div>

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>featured app</div>
  )
}
