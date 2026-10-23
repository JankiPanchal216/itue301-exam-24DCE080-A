import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, RefreshCw, CheckCircle2, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const URL = "https://jsonplaceholder.typicode.com/todos?_limit=10";

export default function SpecialsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchSpecials = useCallback(() => {
    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    fetch(URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to fetch specials`);
        }
        return res.json();
      })
      .then((todos) => {
        setData(todos);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return; // Ignore intentional abort on unmount/cleanup
        }
        setError(err.message || "Failed to fetch");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchSpecials();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSpecials]);

  // Derived state: calculate available count (completed === false means available)
  const availableCount = data.filter((item) => !item.completed).length;

  // Sorting: List available specials first; otherwise keep the API order (stable sort)
  const sortedData = [...data].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[calc(100vh-80px)]">
      {/* Header with breadcrumb and badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
            <Link to="/" className="hover:text-primary-600 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
            </Link>
            <span>/</span>
            <span className="text-charcoal">Specials Board</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-charcoal">
              Today's Specials
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-primary-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Board</span>
            </span>
          </div>
        </div>

        {/* Retry / Refresh Action */}
        {!loading && (
          <button
            type="button"
            onClick={fetchSpecials}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary-600" />
            <span>Refresh Board</span>
          </button>
        )}
      </div>

      {/* Loading State: Exact text "Loading specials…" as per exam requirement */}
      {loading && (
        <div className="bg-white rounded-card p-12 border border-gray-100 shadow-card text-center my-8">
          <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-primary-500 animate-spin mx-auto mb-4" />
          <p id="loading-specials-text" className="text-base font-bold text-charcoal">
            Loading specials…
          </p>
          <p className="text-xs text-gray-500 mt-1">Connecting to the live campus board</p>
        </div>
      )}

      {/* Error State: Exact text "Could not load specials" with Retry button */}
      {!loading && error && (
        <div
          role="alert"
          id="specials-error-state"
          className="bg-white rounded-card p-8 border border-rose-200 shadow-card text-center my-8 max-w-lg mx-auto"
        >
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-rose-700 mb-1">
            Could not load specials
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Unable to fetch live specials from the server. Please check your network connection and try again.
          </p>
          <button
            type="button"
            id="retry-specials-btn"
            onClick={fetchSpecials}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loaded Content */}
      {!loading && !error && (
        <div>
          {/* Availability Count Banner: Exact pattern "<n> of <total> available" */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                {availableCount}
              </div>
              <div>
                <p id="specials-available-count" className="text-sm font-bold text-charcoal">
                  {availableCount} of {data.length} available
                </p>
                <p className="text-xs text-gray-500">Available specials listed first</p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100">
              API Limit: 10
            </span>
          </div>

          {/* Specials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedData.map((todo) => {
              const isAvailable = !todo.completed;
              return (
                <div
                  key={todo.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-4 ${
                    isAvailable
                      ? "bg-white border-gray-100 shadow-card hover:border-orange-200 hover:shadow-card-hover"
                      : "bg-gray-50/80 border-gray-200 opacity-70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-gray-400 font-bold shrink-0 mt-0.5">
                      #{todo.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-charcoal capitalize leading-snug">
                        {todo.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Chef's limited daily prep batch
                      </p>
                    </div>
                  </div>

                  {/* Status Badge: "Available" or "Sold out" */}
                  <div className="shrink-0">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sold out</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
