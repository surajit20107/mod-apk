import BlogCard from "@/components/ui/BlogCard";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Blogs() {
  return (
    <div>
      <div className="bg-[#273D52] m-4 p-4 border border-gray-500 rounded-xl inline-flex items-center gap-2">
        <Link href="/">
          <Home size={25} />
        </Link>
        
        <ChevronRight size={30} />
        
        <span className="text-lg">Blogs</span>
      </div>

      <BlogCard />
    </div>
  );
}
