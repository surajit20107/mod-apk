"use client";
import { useState } from "react";
import { Menu, Search, Github, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!keyword.trim) return;
    } else {
      window.location.href = `/search/${keyword}`
    }
  });

  return (
    <nav className="h-16 w-full flex p-4 items-center bg-zinc-600">
      <Menu onClick={onMenuClick} />
      <div className="flex flex-1 items-center justify-center px-4">
        {!isSearchOpen && (
          <div className="relative h-8 w-36">
            <Link href="/">
              <Image
                src="/gma-dark.svg"
                alt="Logo"
                fill
                priority
                className="object-contain"
              />
            </Link>
          </div>
        )}

        {isSearchOpen && (
          <input
            type="text"
            placeholder="Search by app names..."
            className="w-full bg-[#1F2937] text-white rounded-xl py-2 px-3 outline-none ease-in-out duration-300"
            value={keyword.toString()}
            onChange={(e) => setKeyword(e.target.value)}
          />
        )}
      </div>

      <div className="flex items-center justify-center h-full w-auto gap-4">
        {isSearchOpen ? (
          <X onClick={() => setIsSearchOpen(false)} />
        ) : (
          <Search onClick={() => setIsSearchOpen(true)} />
        )}

        <a href="https://github.com/surajit20107" target="_blank">
          <Github />
        </a>
      </div>
    </nav>
  );
}
