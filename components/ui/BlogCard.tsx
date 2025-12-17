export default function BlogCard() {
  return (
    <section className="max-w-md m-4 bg-[#27364d] rounded-xl overflow-hidden shadow-lg shadow shadow-slate-900">
      {/* Top section */}
      <div className="bg-green-500 rounded-t-xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Label */}
        <span className="bg-green-700 text-white text-xs font-semibold uppercase px-3 py-1 rounded-full self-start sm:self-auto">
          How To
        </span>

        {/* Content */}
        <div className="flex items-center gap-4 flex-1">
          {/* Android icon with XAPK */}
          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M4.2 3.24l-.72-.72L3 3.96l.72.72zM5.5 2.14L4.4 4.73l1.86 1.02A6.59 6.59 0 0111 3c.83 0 1.62.16 2.35.45l-1.98 1.08-1.29-1.77a.5.5 0 00-.8 0l-1.44 1.97-1.34-2zM7 22v-3H5v3a6 6 0 002 1.5V23h2v-.5a6 6 0 002-1.5v-3h-2v3H7zm6-10v3h-2v-3h2zM18 11v1h-6v-1a7 7 0 1112 0v13h1v-13a8 8 0 00-8-8M5 13v5H3v-5h2z" />
            </svg>
            <div className="bg-white text-green-600 font-semibold text-sm rounded-full px-3 mt-1">
              XAPK
            </div>
          </div>
          {/* Text */}
          <h2 className="text-white font-semibold text-lg sm:text-xl flex-1">
            How to Install XAPK?
          </h2>
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-4 rounded-b-xl">
        <span className="inline-block bg-white bg-opacity-20 text-green-500 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          APR 10, 2025
        </span>
        <h3 className="text-white font-bold text-md mb-1 truncate">
          What is XAPK and How to Install X...
        </h3>
        <p className="text-gray-300 text-sm">
          Introduction XAPK files are a cool way for Android users to install
          apps and game...
        </p>
      </div>
    </section>
  );
}
