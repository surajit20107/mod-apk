"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  PlusSquare,
  Users,
  LogOut,
  ExternalLink,
  Loader2,
  History,
} from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "Apps", icon: LayoutDashboard },
  { href: "/admin/create-app", label: "Create App", icon: PlusSquare },
  { href: "/admin/app-details", label: "App Details", icon: History },
  { href: "/admin/manage-users", label: "Users", icon: Users },
];

const superAdminOnlyLinks = ["/admin/app-details", "/admin/manage-users"];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) setRole(data?.role ?? null);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [pathname]);

  const visibleLinks = links.filter(
    (link) =>
      !superAdminOnlyLinks.includes(link.href) || role === "superadmin",
  );

  const isAuthPage =
    pathname === "/admin/signin" || pathname === "/admin/signup";

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/admin/signin");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111827] border-b border-gray-700/60">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <Link
          href={isAuthPage ? "/admin/signin" : "/admin/dashboard"}
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="p-1.5 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-600">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white">
            Admin<span className="hidden sm:inline"> Panel</span>
          </span>
        </Link>

        {!isAuthPage && (
          <nav className="flex items-center gap-1 overflow-x-auto">
            {visibleLinks.map((link) => {
              const active = pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/"
            title="View site"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden lg:inline">View site</span>
          </Link>
          {!isAuthPage && (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="hidden lg:inline">Sign out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
