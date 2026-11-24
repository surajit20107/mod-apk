"use client";
import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  Package,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  History,
  ShieldCheck,
  Clock,
  UserRound,
  Pencil,
  Trash2,
  Plus,
  ExternalLink,
  Users,
  X,
  ClipboardList,
} from "lucide-react";

interface AppRecord {
  _id: string;
  name: string;
  image?: string;
  packageName?: string;
  publisher?: string;
  category?: string;
  size?: string;
  rating?: number;
  version?: string;
  platform?: string;
  price?: string;
  description?: string;
  downloadUrl?: string;
  requirements?: string;
  modInfo?: string;
  createdby?: string;
  updatedby?: string;
  tags?: string[];
  screenshots?: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuditChange {
  field: string;
  from: unknown;
  to: unknown;
}

interface AuditEntry {
  _id: string;
  action: "create" | "update" | "delete";
  entityId?: string;
  entityName?: string;
  actorId?: string;
  actorUsername?: string;
  actorEmail?: string;
  changes?: AuditChange[];
  snapshot?: Partial<AppRecord>;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AppsResponse {
  apps: AppRecord[];
  pagination: Pagination;
}

interface LogsResponse {
  logs: AuditEntry[];
  pagination: Pagination;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });

  if (res.status === 401) {
    window.location.href = "/admin/signin";
    throw new Error("Unauthorized");
  }

  if (res.status === 403) {
    window.location.href = "/admin/dashboard";
    throw new Error("Superadmin access required");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch data");
  }

  return res.json();
};

const formatDate = (value?: string) => {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "—";
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const truncate = (text: string, max = 80) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

const actionStyles: Record<
  AuditEntry["action"],
  { label: string; className: string; icon: typeof Plus }
> = {
  create: {
    label: "Created",
    className: "bg-emerald-500/10 text-emerald-400",
    icon: Plus,
  },
  update: {
    label: "Edited",
    className: "bg-amber-500/10 text-amber-400",
    icon: Pencil,
  },
  delete: {
    label: "Deleted",
    className: "bg-red-500/10 text-red-400",
    icon: Trash2,
  },
};

function ActionBadge({ action }: { action: AuditEntry["action"] }) {
  const style = actionStyles[action] ?? actionStyles.update;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${style.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {style.label}
    </span>
  );
}

function ActorCell({ entry }: { entry: AuditEntry }) {
  const searchTerm = entry.actorUsername || entry.actorEmail;

  return (
    <div className="min-w-0">
      <p className="text-white text-sm font-medium truncate flex items-center gap-1.5">
        <UserRound className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        {entry.actorUsername || "Unknown"}
      </p>
      {entry.actorEmail && (
        <p className="text-gray-400 text-xs truncate">{entry.actorEmail}</p>
      )}
      {searchTerm && (
        <Link
          href={`/admin/manage-users?search=${encodeURIComponent(searchTerm)}`}
          className="text-violet-400 hover:text-violet-300 text-xs font-medium inline-flex items-center gap-1 mt-1"
        >
          <Users className="w-3 h-3" />
          Manage access
        </Link>
      )}
    </div>
  );
}

function ChangeList({ changes }: { changes?: AuditChange[] }) {
  if (!changes || changes.length === 0) {
    return <span className="text-gray-500 text-sm">—</span>;
  }

  return (
    <ul className="space-y-1">
      {changes.map((change) => (
        <li key={change.field} className="text-xs text-gray-400">
          <span className="text-gray-300 font-medium">{change.field}</span>
          {": "}
          <span className="text-red-400/80 line-through">
            {truncate(formatValue(change.from), 40)}
          </span>
          {" → "}
          <span className="text-emerald-400">
            {truncate(formatValue(change.to), 40)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PaginationBar({
  pagination,
  page,
  onPageChange,
  unit,
}: {
  pagination: Pagination;
  page: number;
  onPageChange: (page: number) => void;
  unit: string;
}) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700/50">
      <p className="text-gray-400 text-sm">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} {unit}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-gray-300 px-3">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pagination.totalPages}
          className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-gray-200 text-sm break-words">{value || "—"}</p>
    </div>
  );
}

function AppDetailModal({
  app,
  onClose,
}: {
  app: AppRecord;
  onClose: () => void;
}) {
  const { data, isLoading } = useSWR<LogsResponse>(
    `/api/v1/admin/app-details/logs?appId=${app._id}&limit=50`,
    fetcher,
  );

  const logs = data?.logs ?? [];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl max-w-4xl w-full border border-gray-700 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-700">
          <div className="flex items-center gap-4 min-w-0">
            <img
              src={app.image || "/placeholder.png"}
              alt={app.name}
              className="w-14 h-14 rounded-xl object-cover bg-gray-700 shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                {app.name}
              </h2>
              <p className="text-gray-400 text-sm truncate">
                {app.packageName || "No package name"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Complete details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <DetailRow label="Package name" value={app.packageName} />
              <DetailRow label="Category" value={app.category} />
              <DetailRow label="Platform" value={app.platform} />
              <DetailRow label="Version" value={app.version} />
              <DetailRow label="Size" value={app.size} />
              <DetailRow label="Price" value={app.price} />
              <DetailRow
                label="Rating"
                value={
                  app.rating !== undefined && app.rating !== null
                    ? `${app.rating}/5`
                    : undefined
                }
              />
              <DetailRow
                label="Requirements"
                value={app.requirements}
              />
              <DetailRow
                label="Tags"
                value={app.tags?.length ? app.tags.join(", ") : undefined}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Publisher
                </p>
                {app.publisher ? (
                  <a
                    href={app.publisher}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all inline-flex items-center gap-1"
                  >
                    {app.publisher}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ) : (
                  <p className="text-gray-200 text-sm">—</p>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Download URL
                </p>
                {app.downloadUrl ? (
                  <a
                    href={app.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all inline-flex items-center gap-1"
                  >
                    {app.downloadUrl}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ) : (
                  <p className="text-gray-200 text-sm">—</p>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Description
                </p>
                <p className="text-gray-200 text-sm whitespace-pre-wrap break-words">
                  {app.description || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Mod info
                </p>
                <p className="text-gray-200 text-sm whitespace-pre-wrap break-words">
                  {app.modInfo || "—"}
                </p>
              </div>
            </div>

            {app.screenshots && app.screenshots.length > 0 && (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Screenshots
                </p>
                <div className="flex flex-wrap gap-2">
                  {app.screenshots.map((url, i) => (
                    <a
                      key={`${url}-${i}`}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={url}
                        alt={`Screenshot ${i + 1}`}
                        className="w-20 h-28 rounded-lg object-cover bg-gray-700 hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl border border-gray-700/60 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Created by
              </p>
              <p className="text-white text-sm font-medium">
                {app.createdby || "Unknown"}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {formatDate(app.createdAt)}
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-700/60 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Last edited by
              </p>
              <p className="text-white text-sm font-medium">
                {app.updatedby || "Not edited yet"}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {formatDate(app.updatedAt)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">
                Activity for this app
              </h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No activity recorded for this app yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {logs.map((entry) => (
                  <li
                    key={entry._id}
                    className="bg-gray-900/50 rounded-xl border border-gray-700/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ActionBadge action={entry.action} />
                        <span className="text-gray-300 text-sm">
                          {entry.actorUsername || "Unknown"}
                        </span>
                        {entry.actorEmail && (
                          <span className="text-gray-500 text-xs">
                            {entry.actorEmail}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    {entry.changes && entry.changes.length > 0 && (
                      <div className="mt-2">
                        <ChangeList changes={entry.changes} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppDetails() {
  const [tab, setTab] = useState<"apps" | "logs">("apps");

  // Apps tab state
  const [appsPage, setAppsPage] = useState(1);
  const [appsSearchInput, setAppsSearchInput] = useState("");
  const [appsSearch, setAppsSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<AppRecord | null>(null);

  // Activity tab state
  const [logsPage, setLogsPage] = useState(1);
  const [logsSearchInput, setLogsSearchInput] = useState("");
  const [logsSearch, setLogsSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const appsParams = new URLSearchParams({
    page: appsPage.toString(),
    limit: "10",
  });
  if (appsSearch) appsParams.set("search", appsSearch);

  const logsParams = new URLSearchParams({
    page: logsPage.toString(),
    limit: "20",
  });
  if (logsSearch) logsParams.set("search", logsSearch);
  if (actionFilter) logsParams.set("action", actionFilter);

  const {
    data: appsData,
    error: appsError,
    isLoading: appsLoading,
  } = useSWR<AppsResponse>(`/api/v1/admin/app-details?${appsParams}`, fetcher, {
    keepPreviousData: true,
  });

  const {
    data: logsData,
    error: logsError,
    isLoading: logsLoading,
  } = useSWR<LogsResponse>(
    tab === "logs" ? `/api/v1/admin/app-details/logs?${logsParams}` : null,
    fetcher,
    { keepPreviousData: true },
  );

  const apps = appsData?.apps ?? [];
  const appsPagination = appsData?.pagination ?? {
    page: appsPage,
    limit: 10,
    total: 0,
    totalPages: 0,
  };
  const logs = logsData?.logs ?? [];
  const logsPagination = logsData?.pagination ?? {
    page: logsPage,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  const handleAppsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppsPage(1);
    setAppsSearch(appsSearchInput.trim());
  };

  const handleLogsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLogsPage(1);
    setLogsSearch(logsSearchInput.trim());
  };

  const error = appsError || logsError;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-600">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                App Details &amp; Activity
              </h1>
              <p className="text-gray-400">
                Superadmin only · full app records and change history
              </p>
            </div>
          </div>
          <Link
            href="/admin/manage-users"
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2.5 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
          >
            <Users className="w-5 h-5" />
            Manage admins
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("apps")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === "apps"
                ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                : "bg-gray-800/40 text-gray-400 border border-gray-700/50 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            Apps
          </button>
          <button
            onClick={() => setTab("logs")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === "logs"
                ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                : "bg-gray-800/40 text-gray-400 border border-gray-700/50 hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            Activity log
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            {(error as Error).message}
          </div>
        )}

        {tab === "apps" ? (
          <>
            <form onSubmit={handleAppsSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by app, package, category, creator or editor..."
                  value={appsSearchInput}
                  onChange={(e) => setAppsSearchInput(e.target.value)}
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

            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
              {appsLoading && !appsData ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
              ) : apps.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No apps found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            App
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Category
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Created by
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Last edited by
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Last updated
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {apps.map((app) => (
                          <tr
                            key={app._id}
                            className="hover:bg-gray-700/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={app.image || "/placeholder.png"}
                                  alt={app.name}
                                  className="w-10 h-10 rounded-lg object-cover bg-gray-700"
                                />
                                <div className="min-w-0">
                                  <p className="text-white font-medium truncate">
                                    {app.name}
                                  </p>
                                  <p className="text-gray-400 text-xs truncate">
                                    {app.packageName || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
                                {app.category || "—"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300 text-sm">
                              {app.createdby || "Unknown"}
                            </td>
                            <td className="px-6 py-4 text-gray-300 text-sm">
                              {app.updatedby || "Not edited"}
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">
                              {formatDate(app.updatedAt)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end">
                                <button
                                  onClick={() => setSelectedApp(app)}
                                  className="flex items-center gap-2 px-3 py-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors text-sm font-medium"
                                  title="View complete details"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <PaginationBar
                    pagination={appsPagination}
                    page={appsPage}
                    onPageChange={setAppsPage}
                    unit="apps"
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-3 mb-6">
              <form onSubmit={handleLogsSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by app, admin name or email..."
                    value={logsSearchInput}
                    onChange={(e) => setLogsSearchInput(e.target.value)}
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
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setLogsPage(1);
                }}
                className="px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:border-violet-500 outline-none transition-colors"
              >
                <option value="">All actions</option>
                <option value="create">Created</option>
                <option value="update">Edited</option>
                <option value="delete">Deleted</option>
              </select>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
              {logsLoading && !logsData ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-20">
                  <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No activity recorded</p>
                  <p className="text-gray-500 text-sm mt-1">
                    New app creations, edits and deletions will appear here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            When
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Action
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            App
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Done by
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                            Changes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {logs.map((entry) => (
                          <tr
                            key={entry._id}
                            className="hover:bg-gray-700/30 transition-colors align-top"
                          >
                            <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                              {formatDate(entry.createdAt)}
                            </td>
                            <td className="px-6 py-4">
                              <ActionBadge action={entry.action} />
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-white font-medium text-sm">
                                {entry.entityName || "Unknown app"}
                              </p>
                              {entry.action === "delete" && (
                                <p className="text-red-400/80 text-xs mt-1">
                                  App no longer exists
                                </p>
                              )}
                              {entry.action === "delete" &&
                                entry.snapshot?._id && (
                                  <button
                                    onClick={() =>
                                      setSelectedApp(
                                        entry.snapshot as AppRecord,
                                      )
                                    }
                                    className="text-blue-400 hover:text-blue-300 text-xs font-medium inline-flex items-center gap-1 mt-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    View snapshot
                                  </button>
                                )}
                            </td>
                            <td className="px-6 py-4">
                              <ActorCell entry={entry} />
                            </td>
                            <td className="px-6 py-4 max-w-md">
                              <ChangeList changes={entry.changes} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <PaginationBar
                    pagination={logsPagination}
                    page={logsPage}
                    onPageChange={setLogsPage}
                    unit="actions"
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>

      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
