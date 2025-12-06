
"use client";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar drawer */}
      <div className="fixed top-0 left-0 h-full w-80 bg-zinc-800 z-50 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold">Menu</h2>
          <X onClick={onClose} className="cursor-pointer hover:text-gray-300" />
        </div>
        
        <div className="p-4">
          <nav className="space-y-4">
            <a href="/" className="block py-2 px-4 hover:bg-zinc-700 rounded">
              Home
            </a>
            <a href="/about" className="block py-2 px-4 hover:bg-zinc-700 rounded">
              About
            </a>
            <a href="/contact" className="block py-2 px-4 hover:bg-zinc-700 rounded">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
