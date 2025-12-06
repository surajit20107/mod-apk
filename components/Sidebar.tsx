import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({isOpen, onClose}: SidebarProps) {
  if (!isOpen) return
  return (
    <div className="fixed top-0 left-0 h-full w-full bg-[#111827]">
      <X onClick={onClose} />
      this is sidebar
    </div>
  )
}