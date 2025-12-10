import FeatureApp from "@/components/fetcher/FeatureApp";
import NewApps from "@/components/fetcher/NewApps";
import NewGames from "@/components/fetcher/NewGames";
import UpdatedApps from "@/components/fetcher/UpdatedApps";
import UpdatedGames from "@/components/fetcher/UpdatedGames";

export default function Home() {
  return (
    <div>
      <FeatureApp />
      <UpdatedGames />
      <UpdatedApps />
      <NewGames />
      <NewApps />
    </div>
  );
}
