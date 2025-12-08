import { X, Search, Home, Gamepad2, Smartphone, FileText, HelpCircle, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({isOpen, onClose}: SidebarProps) {
  if (!isOpen) return
  const pathName = window.location.hostname;
  return (
    <div className="fixed top-0 left-0 h-full w-full bg-[#111827]">

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <Image
            src="/favicon-gma.svg"
            alt="logo"
            height={40}
            width={40}
            className="object-contain"
            />
        </div>
        <div>
          <h1 className="font-bild text-xl">{pathName.split(".")[0]}</h1>
        </div>
        <div>
          <X onClick={onClose} />
        </div>
      </div>

      {/* Search bar */}
      <div className="searchBar px-4 my-3 relative sm:px-28">
        <input type="text" placeholder="Search for apps, games, blogs..." className="w-full bg-[#1F2937] text-white rounded-xl px-4 py-3 pr-12 outline-none" />
        <Search className="absolute right-8 top-1/2 transform -translate-y-1/2 text-blue-500 sm:right-36" />
      </div>

      {/* Category */}
      <div className="category mt-6 grid grid-cols-2 sm:grid-cols-3 gap-10 mx-auto w-fit">
        <Link href="/">
          <div className="h-30 w-30 rounded-lg bg-gradient-to-l from-[#3B82F6] to-[#93C5FD] flex flex-col items-center justify-center gap-1 font-medium">
            <Home /> Home
          </div>
        </Link>
        <Link href="/games">
          <div className="h-30 w-30 rounded-lg bg-gradient-to-l from-[#EF4444] to-[#FCA5A5] flex flex-col items-center justify-center gap-1 font-medium">
            <Gamepad2 /> Games
          </div>
        </Link>
        <Link href="/apps">
          <div className="h-30 w-30 rounded-lg bg-gradient-to-l from-[#9333EA] to-[#C084FC] flex flex-col items-center justify-center gap-1 font-medium">
            <Smartphone /> Apps
          </div>
        </Link>
        <Link href="/blog">
          <div className="h-30 w-30 rounded-lg bg-gradient-to-l from-[#FACB15] to-[#FEF08A] flex flex-col items-center justify-center gap-1 font-medium">
            <FileText /> Blog
          </div>
        </Link>
        <Link href="/faq">
          <div className="h-30 w-30 rounded-lg bg-gradient-to-l from-[#36D26F] to-[#36D26F] flex flex-col items-center justify-center gap-1 font-medium">
            <HelpCircle /> FAQ
          </div>
        </Link>
        <div className="h-30 w-30 rounded-lg bg-gradient-to-t from-[#F97316] to-[#FBCC15] flex flex-col items-center justify-center gap-1 font-medium">
          <Sun /> Mode
        </div>
      </div>
    </div>
  )
}
