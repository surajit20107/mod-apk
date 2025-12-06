import { Menu, Search, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="h-16 w-full flex p-4 items-center justify-between bg-zinc-600">
      <Menu />
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
      <div className="flex items-center justify-center h-full w-auto gap-4">
        <Search />
        <a href="https://github.com/surajit20107" target="_blank">
          <Github />
        </a>
      </div>
    </nav>
  )
}
