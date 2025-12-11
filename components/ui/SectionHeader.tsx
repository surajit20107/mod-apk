import { LucideIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  viewAllHref?: string;
}

export default function SectionHeader({ 
  title, 
  icon: Icon, 
  iconColor = "text-blue-400",
  viewAllHref 
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-gray-800/60 ${iconColor}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      </div>
      {viewAllHref && (
        <Link 
          href={viewAllHref}
          className="flex items-center gap-1 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-colors text-sm font-medium"
        >
          <span className="hidden sm:inline">View All</span>
          <span className="sm:hidden">All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
