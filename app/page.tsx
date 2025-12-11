import FeatureApp from "@/components/fetcher/FeatureApp";
import NewApps from "@/components/fetcher/NewApps";
import NewGames from "@/components/fetcher/NewGames";
import UpdatedApps from "@/components/fetcher/UpdatedApps";
import UpdatedGames from "@/components/fetcher/UpdatedGames";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <FeatureApp />
        <UpdatedGames />
        <UpdatedApps />
        <NewGames />
        <NewApps />
      </main>
    </div>
  );
}
