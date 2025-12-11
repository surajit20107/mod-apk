interface AppCardSkeletonProps {
  variant?: "featured" | "compact";
}

export default function AppCardSkeleton({ variant = "featured" }: AppCardSkeletonProps) {
  if (variant === "compact") {
    return (
      <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-3 animate-pulse">
        <div className="flex gap-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-700"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-700"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
      <div className="space-y-2 mt-3">
        <div className="h-3 bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between mt-4 pt-3 border-t border-gray-700/50">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-8 bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  );
}
