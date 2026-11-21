
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerVerificationAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/owner-verifications", {
        params: { review_status: filter },
      });
      setRequests(response.data.requests || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load owner verification requests."
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!authLoading && user) loadRequests();
  }, [authLoading, user?.id, loadRequests]);

  async function reviewRequest(item, status) {
    const action = status === "verified" ? "verify" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${item.owner_name}'s request? Confirm that the original evidence has been checked.`
    );

    if (!confirmed) return;

    const decisionNote = window.prompt(
      status === "verified"
        ? "Optional verification note:"
        : "Reason for rejection:"
    );

    if (decisionNote === null) return;

    setActionId(item.id);
    setError("");
    setNotice("");

    try {
      const response = await api.patch(
        `/admin/owner-verifications/${item.id}`,
        {
          status,
          decision_note: decisionNote,
        }
      );

      setNotice(response.data.message);
      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to review this request."
      );
    } finally {
      setActionId("");
    }
  }

  if (authLoading) {
    return <main className="p-10 text-center">Checking access...</main>;
  }

  if (!user || !["admin", "super_admin"].includes(user.role)) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <Link to="/" className="mt-4 inline-block text-emerald-700">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck size={22} />
              <span className="text-sm font-bold uppercase tracking-wider">
                RentKhoj Trust & Safety
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Owner verification
            </h1>
            <p className="mt-2 text-slate-500">
              Review owner identity and authority evidence before granting a badge.
            </p>
          </div>

          <button
            onClick={loadRequests}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        <div className="mb-5 flex flex-wrap gap-2">
          {["pending", "verified", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                filter === status
                  ? "bg-emerald-700 text-white"
                  : "bg-white text-slate-600 border"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {notice && (
          <div role="status" className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-slate-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
            No {filter} verification requests.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((item) => (
              <article key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.legal_name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Account: {item.owner_name} · {item.owner_email}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Phone: {item.owner_phone || "Not provided"}
                    </p>
                    <p className="mt-3 text-sm">
                      <strong>Evidence type:</strong>{" "}
                      <span className="capitalize">
                        {item.proof_method.replaceAll("_", " ")}
                      </span>
                    </p>
                    {item.note && (
                      <p className="mt-2 text-sm text-slate-600">
                        <strong>Owner note:</strong> {item.note}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      Submitted: {new Date(item.created_at).toLocaleString()}
                    </p>
                    {item.decision_note && (
                      <p className="mt-2 text-sm text-slate-600">
                        <strong>Decision note:</strong> {item.decision_note}
                      </p>
                    )}
                  </div>

                  {item.status === "pending" && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={actionId === item.id}
                        onClick={() => reviewRequest(item, "verified")}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                      >
                        <CheckCircle2 size={16} />
                        Verify owner
                      </button>
                      <button
                        disabled={actionId === item.id}
                        onClick={() => reviewRequest(item, "rejected")}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
