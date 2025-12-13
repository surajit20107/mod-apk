"use client"
import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { 
  Home, 
  ChevronRight, 
  Download, 
  Star, 
  Calendar, 
  Smartphone, 
  HardDrive, 
  Globe, 
  DollarSign, 
  RefreshCw,
  User,
  Tag,
  Package,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

interface App {
  _id: string;
  name: string;
  image: string;
  packageName: string;
  publisher: string;
  category: string;
  size: string;
  rating: number;
  version: string;
  platform: string;
  price: string;
  description: string;
  downloadUrl: string;
  requirements: string;
  modInfo: string;
  screenshots: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

function AppDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gradient-to-b from-gray-800/80 to-transparent py-8">
        <div className="container mx-auto px-4">
          <div className="h-4 w-48 bg-gray-700 rounded mb-6"></div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-700 rounded-3xl"></div>
            <div className="flex-1 text-center md:text-left">
              <div className="h-8 w-64 bg-gray-700 rounded mb-4 mx-auto md:mx-0"></div>
              <div className="h-4 w-32 bg-gray-700 rounded mb-3 mx-auto md:mx-0"></div>
              <div className="h-4 w-40 bg-gray-700 rounded mx-auto md:mx-0"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, valueColor = "text-white" }: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 hover:border-gray-600 transition-all duration-200">
      <div className="flex items-center justify-center w-10 h-10 bg-pink-500/20 rounded-lg mb-3">
        <Icon className="w-5 h-5 text-pink-400" />
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`font-semibold text-sm truncate ${valueColor}`}>{value}</p>
    </div>
  );
}

function ScreenshotGallery({ screenshots }: { screenshots: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
        Screenshots
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {screenshots.map((screenshot, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              selectedIndex === index ? "border-pink-500 scale-105" : "border-transparent hover:border-gray-600"
            }`}
          >
            <img
              src={screenshot}
              alt={`Screenshot ${index + 1}`}
              className="w-32 h-56 md:w-40 md:h-72 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ModInfoSection({ modInfo }: { modInfo: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!modInfo) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between hover:bg-yellow-500/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">MOD Info</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-yellow-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-yellow-400" />
        )}
      </button>
      {isExpanded && (
        <div className="mt-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-300 text-sm leading-relaxed">{modInfo}</p>
        </div>
      )}
    </div>
  );
}

function RelatedApps({ currentAppId }: { currentAppId: string }) {
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data } = useSWR('/api/v1/apk/new-apps', fetcher, {
    revalidateOnFocus: false,
  });

  const apps = data?.newApps?.filter((app: App) => app._id !== currentAppId) || [];

  if (apps.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
        Related Apps
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {apps.slice(0, 6).map((app: App) => (
          <Link key={app._id} href={`/${app._id}`}>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 hover:border-gray-600 transition-all duration-200 group">
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={app.image || "/placeholder-app.png"}
                    alt={app.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  {app.modInfo && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      MOD
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate group-hover:text-pink-400 transition-colors">
                    {app.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{app.category}</span>
                    <span>•</span>
                    <span>{app.size}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">v{app.version}</span>
                    {app.tags?.includes("updated") && (
                      <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded">
                        UPDATED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AppPage() {
  const params = useParams();
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data, error, isLoading } = useSWR(`/api/v1/apk/${params.id}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 60 * 1000,
  });

  if (isLoading) return <AppDetailSkeleton />;
  
  if (error || !data || data.error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">App Not Found</h2>
          <p className="text-gray-400 mb-6">The app you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const app: App = data;
  const formattedDate = new Date(app.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-gray-800/80 to-transparent py-6 md:py-8">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            <Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors">Apps</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors">{app.category}</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 truncate max-w-[150px]">{app.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={app.image || "/placeholder-app.png"}
                alt={app.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover shadow-2xl shadow-pink-500/20"
              />
              {app.modInfo && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg">
                  MOD
                </span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {app.name} v{app.version}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className="bg-pink-500/20 text-pink-400 text-sm font-semibold px-3 py-1 rounded-lg">
                  v{app.version}
                </span>
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="flex">{renderStars(app.rating)}</div>
                <span className="text-white font-semibold">{app.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">(Reviews)</span>
              </div>

              <a
                href={app.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30"
              >
                <Download className="w-5 h-5" />
                Download
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {app.description && (
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 mb-8">
            <p className="text-gray-300 text-sm leading-relaxed">{app.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
          <InfoCard icon={Package} label="App Name" value={app.name} />
          <InfoCard icon={RefreshCw} label="Version" value={`v${app.version}`} valueColor="text-pink-400" />
          <InfoCard icon={Calendar} label="Last Updated" value={formattedDate} valueColor="text-pink-400" />
          <InfoCard icon={User} label="Publisher" value={app.publisher} valueColor="text-pink-400" />
          <InfoCard icon={Smartphone} label="Requirements" value={app.requirements} valueColor="text-pink-400" />
          <InfoCard icon={Tag} label="Category" value={app.category} valueColor="text-pink-400" />
          <InfoCard icon={HardDrive} label="Size" value={app.size} />
          <InfoCard icon={Globe} label="Platform" value={app.platform} valueColor="text-pink-400" />
          <InfoCard icon={DollarSign} label="Price" value={app.price} valueColor="text-green-400" />
        </div>

        <ScreenshotGallery screenshots={app.screenshots} />

        <ModInfoSection modInfo={app.modInfo} />

        {/* {app.tags && app.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {app.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-800/50 border border-gray-700/50 text-gray-300 text-sm px-4 py-2 rounded-lg hover:border-pink-500/50 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )} */}

        <div className="mb-8">
          <a
            href={app.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl text-center transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/30"
          >
            <div className="flex items-center justify-center gap-3">
              <Download className="w-6 h-6" />
              <span className="text-lg">Download {app.name}</span>
              <ExternalLink className="w-5 h-5" />
            </div>
          </a>
        </div>

        <RelatedApps currentAppId={app._id} />
      </div>
    </div>
  );
}
