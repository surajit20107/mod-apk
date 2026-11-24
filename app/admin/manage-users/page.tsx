"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldOff,
  Ban,
  Lock,
  Unlock,
  UserX,
  LayoutDashboard,
  Mail,
  CalendarDays,
} from "lucide-react";

interface UserRecord {
  _id: string;
  username: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  isBanned: boolean;
  banReason?: string;
  loginDisabled: boolean;
  createdAt: string;
}

interface Stats {
  total: number;
  admins: number;
  banned: number;
  blocked: number;
}

interface UsersResponse {
  users: UserRecord[];
  stats: Stats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });

  if (res.status === 401) {
    window.location.href = "/admin/signin";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch users");
  }

  return res.json();
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function ManageUsers() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [banTarget, setBanTarget] = useState<UserRecord | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banning, setBanning] = useState(false);

  const params = new URLSearchParams({ page: page.toString(), limit: "10" });
  if (search) params.set("search", search);
  if (roleFilter) params.set("role", roleFilter);
  if (statusFilter) params.set("status", statusFilter);

  const { data, error, isLoading, mutate } = useSWR<UsersResponse>(
    `/api/v1/admin/users?${params}`,
    fetcher,
    { keepPreviousData: true },
  );

  const users = data?.users ?? [];
  const stats = data?.stats ?? { total: 0, admins: 0, banned: 0, blocked: 0 };
  const pagination = data?.pagination ?? {
    page,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const patchUser = async (
    id: string,
    body: Record<string, unknown>,
  ): Promise<boolean> => {
    setPendingId(id);

    try {
      const res = await fetch(`/api/v1/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/signin");
          return false;
        }
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to update user");
      }

      return true;
    } catch (err) {
      toast.error((err as Error).message);
      return false;
    } finally {
      setPendingId(null);
    }
  };

  const handleRoleChange = async (user: UserRecord, role: string) => {
    if (role === user.role) return;

    const ok = await patchUser(user._id, { role });

    if (ok) {
      toast.success(`Role updated to ${role}`);
      mutate();
    }
  };

  const handleToggleLogin = async (user: UserRecord) => {
    const next = !user.loginDisabled;
    const ok = await patchUser(user._id, { loginDisabled: next });

    if (ok) {
      toast.success(
        next
          ? `Login access blocked for ${user.username}`
          : `Login access restored for ${user.username}`,
      );
      mutate();
    }
  };

  const handleUnban = async (user: UserRecord) => {
    const ok = await patchUser(user._id, { isBanned: false });

    if (ok) {
      toast.success(`${user.username} has been unbanned`);
      mutate();
    }
  };

  const handleBan = async () => {
    if (!banTarget) return;
    setBanning(true);

    const ok = await patchUser(banTarget._id, {
      isBanned: true,
      banReason: banReason.trim(),
    });

    setBanning(false);

    if (ok) {
      toast.success(`${banTarget.username} has been banned`);
      setBanTarget(null);
      setBanReason("");
      mutate();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/v1/admin/users/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/signin");
          return;
        }
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to delete user");
      }

      toast.success(`${deleteTarget.username} has been deleted`);
      setDeleteTarget(null);

      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        mutate();
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/admin/signin");
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.total,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Admins",
      value: stats.admins,
      icon: ShieldCheck,
      color: "from-emerald-500 to-green-600",
    },
    {
      label: "Banned",
      value: stats.banned,
      icon: Ban,
      color: "from-red-500 to-rose-600",
    },
    {
      label: "Login Blocked",
      value: stats.blocked,
      icon: Lock,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-600">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                User Management
              </h1>
              <p className="text-gray-400">
                Manage roles, access and accounts
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2.5 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              Apps
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2.5 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-5 flex items-center gap-4"
            >
              <div
                className={`p-3 rounded-xl bg-linear-to-br ${card.color} shrink-0`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-gray-400 text-sm">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by username or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-500 text-white px-4 py-1.5 rounded-lg hover:bg-violet-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:border-violet-500 outline-none transition-colors"
          >
            <option value="">All roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:border-violet-500 outline-none transition-colors"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="blocked">Login blocked</option>
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            {(error as Error).message}
          </div>
        )}

        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          {isLoading && !data ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <UserX className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {users.map((user) => {
                      const busy = pendingId === user._id;

                      return (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.username}
                                  className="w-10 h-10 rounded-full object-cover bg-gray-700"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center font-semibold text-white uppercase shrink-0">
                                  {user.username?.charAt(0) || "?"}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-white font-medium truncate">
                                  {user.username}
                                </p>
                                <p className="text-gray-400 text-sm truncate flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 shrink-0" />
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={user.role}
                              disabled={busy}
                              onChange={(e) =>
                                handleRoleChange(user, e.target.value)
                              }
                              className="bg-gray-700/60 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-600 outline-none focus:border-violet-500 disabled:opacity-50"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {user.isBanned && (
                                <span
                                  title={
                                    user.banReason
                                      ? `Reason: ${user.banReason}`
                                      : "Banned"
                                  }
                                  className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium flex items-center gap-1"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  Banned
                                </span>
                              )}
                              {user.loginDisabled && (
                                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-medium flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5" />
                                  Login blocked
                                </span>
                              )}
                              {!user.isBanned && !user.loginDisabled && (
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">
                                  Active
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="w-4 h-4" />
                              {formatDate(user.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {busy && (
                                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                              )}
                              {user.isBanned ? (
                                <button
                                  onClick={() => handleUnban(user)}
                                  disabled={busy}
                                  className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                                  title="Unban user"
                                >
                                  <ShieldCheck className="w-5 h-5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setBanTarget(user);
                                    setBanReason("");
                                  }}
                                  disabled={busy}
                                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                  title="Ban user"
                                >
                                  <ShieldOff className="w-5 h-5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleToggleLogin(user)}
                                disabled={busy}
                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                  user.loginDisabled
                                    ? "text-emerald-400 hover:bg-emerald-500/10"
                                    : "text-amber-400 hover:bg-amber-500/10"
                                }`}
                                title={
                                  user.loginDisabled
                                    ? "Restore login access"
                                    : "Block login access"
                                }
                              >
                                {user.loginDisabled ? (
                                  <Unlock className="w-5 h-5" />
                                ) : (
                                  <Lock className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => setDeleteTarget(user)}
                                disabled={busy}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete user"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700/50">
                  <p className="text-gray-400 text-sm">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total} users
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-gray-300 px-3">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.totalPages}
                      className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {banTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">
              Ban {banTarget.username}
            </h3>
            <p className="text-gray-400 mb-4">
              This user will lose access immediately and future sign-ins will be
              rejected. You can unban them at any time.
            </p>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason (optional)
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              placeholder="Violating community guidelines..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all mb-6 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setBanTarget(null);
                  setBanReason("");
                }}
                disabled={banning}
                className="flex-1 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                disabled={banning}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {banning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Banning...
                  </>
                ) : (
                  "Ban user"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Delete User</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="text-white font-medium">
                {deleteTarget.username}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
