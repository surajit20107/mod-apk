"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [pathName, setPathName] = useState<string>("");
  const filteredName = pathName
    .replace("https://", "")
    .split(".")[0]
    .toUpperCase();
  
  useEffect(() => {
    setPathName(window.location.hostname);
  }, []);

  if (!pathName) return null;

  return (
    <div className="py-2 bg-[#111827]">
      <div className="container mx-auto py-4">
        <p className="text-center text-gray-400">
          &copy; {new Date().getFullYear()} <Link href="/">{filteredName}</Link>
          . All Rights Reserved.
        </p>
      </div>
      <div className="container mx-auto py-2">
        <p className="text-center text-gray-400">
          Made with ❤️ & lots of ☕ by{" "}
          <a
            href="https://github.com/surajit20107"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Surajit</strong>
          </a>
        </p>
      </div>
    </div>
  );
}
