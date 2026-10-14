
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MapPin,
  IndianRupee,
  Home,
  AlertCircle,
} from "lucide-react";

const filters = ["pending", "approved", "rejected"];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState([]);
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const responses = await Promise.all(
        filters.map((status) =>
          api.get("/admin/properties", {
            params: { review_status: status },
          })
        )
      );

      const nextCounts = {
        pending: responses[0].data.count,
        approved: responses[1].data.count,
        rejected: responses[2].data.count,
      };

      setCounts(nextCounts);
      setProperties(responses[filters.indexOf(filter)].data.properties || []);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Please log in again. Your authentication token is missing or expired."
          : err.response?.status === 403
            ? "Admin access required. Your account must have the admin role."
            : err.response?.data?.detail ||
              "Unable to load listings. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (authLoading || user?.role !== "admin") {
      return;
    }

    // oxlint-disable-next-line react(set-state-in-effect) -- fetch begins when view or filter changes
    loadProperties();
  }, [authLoading, user?.role, loadProperties]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20 text-center text-slate-500">
        Checking your account access...
      </main>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <section className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto text-amber-600" size={42} />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Admin access required
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {user
              ? `You are currently signed in as a ${user.role}. Please sign in with the administrator account to review pending listings.`
              : "Please sign in with an administrator account to review pending listings."}
          </p>
          <Link
            to={user ? "/" : "/login"}
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {user ? "Go to homepage" : "Go to login"}
          </Link>
        </section>
      </main>
    );
  }

  async function reviewProperty(propertyId, status) {
    const action = status === "approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this property?`)) {
      return;
    }

    setActionId(propertyId);
    setError("");
    setNotice("");

    try {
      const response = await api.patch(
        `/admin/properties/${propertyId}/status`,
        { status }
      );

      setNotice(response.data.message || `Property ${status} successfully.`);
      await loadProperties();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          `Unable to ${action} this property. Please try again.`
      );
    } finally {
      setActionId("");
    }
  }

  const numberFormat = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck size={23} />
              <span className="text-sm font-semibold uppercase tracking-widest">
                RentKhoj Administration
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Review property listings and manage their approval status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadProperties}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh listings
          </button>
        </header>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 shrink-0" size={19} />
            <p>{error}</p>
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
            <p>{notice}</p>
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Pending review"
            count={counts.pending}
            icon={<Clock size={22} />}
            color="text-amber-600"
            background="bg-amber-50"
          />
          <StatCard
            label="Approved"
            count={counts.approved}
            icon={<CheckCircle2 size={22} />}
            color="text-emerald-600"
            background="bg-emerald-50"
          />
          <StatCard
            label="Rejected"
            count={counts.rejected}
            icon={<XCircle size={22} />}
            color="text-red-600"
            background="bg-red-50"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Property management
            </h2>

            <div className="mt-5 flex flex-wrap gap-2">
              {filters.map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                    filter === status
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status} ({counts[status]})
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="py-14 text-center text-sm text-slate-500">
                Loading properties...
              </div>
            ) : properties.length === 0 ? (
              <div className="py-14 text-center">
                <Home className="mx-auto text-slate-400" size={36} />
                <h3 className="mt-3 font-semibold text-slate-800">
                  No {filter} properties
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Listings in this category will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {properties.map((property) => (
                  <article
                    key={property.id}
                    className="rounded-xl border border-slate-200 p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {property.title}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                            {property.status}
                          </span>
                        </div>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin size={16} className="shrink-0" />
                          {property.area}
                          {property.address &&
                            property.address !== property.area &&
                            ` · ${property.address}`}
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 font-semibold text-slate-800">
                          <IndianRupee size={16} />
                          {numberFormat(property.rent)} / month
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          Type: {property.property_type} · Bedrooms:{" "}
                          {property.bedrooms} · Bathrooms: {property.bathrooms}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          Furnishing: {property.furnishing} · Tenant preference:{" "}
                          {property.tenant_preference}
                        </p>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {property.description}
                        </p>

                        {property.image_urls?.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-3">
                            {property.image_urls.map((url, index) => (
                              <a
                                key={`${url}-${index}`}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium text-emerald-700 underline"
                              >
                                View image {index + 1}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {filter === "pending" && (
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                          <button
                            type="button"
                            disabled={actionId === property.id}
                            onClick={() =>
                              reviewProperty(property.id, "approved")
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle2 size={17} />
                            {actionId === property.id
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            disabled={actionId === property.id}
                            onClick={() =>
                              reviewProperty(property.id, "rejected")
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            <XCircle size={17} />
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
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, count, icon, color, background }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`rounded-xl p-3 ${background} ${color}`}>{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{count}</p>
    </div>
  );
}
