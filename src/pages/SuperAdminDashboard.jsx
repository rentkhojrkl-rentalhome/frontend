
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const permissionOptions = [
  ["properties.view", "View properties"],
  ["properties.review", "Approve/reject properties"],
  ["users.view", "View users"],
  ["users.manage", "Manage users"],
  ["reports.view", "View reports"],
  ["activity.view", "View activity"],
  ["revenue.view", "View revenue"],
  ["owners.verify", "Verify property owners"],
];

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export default function SuperAdminDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [tab, setTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    permissions: [
      "properties.view",
      "properties.review",
    ],
  });

  const loadOverview = useCallback(async () => {
    const response = await api.get("/super-admin/overview");
    setOverview(response.data);
  }, []);

  const loadAdmins = useCallback(async () => {
    const response = await api.get("/super-admin/admins");
    setAdmins(response.data.admins || []);
  }, []);

  const loadUsers = useCallback(async () => {
    const response = await api.get("/super-admin/users");
    setUsers(response.data.users || []);
  }, []);

  const loadActivities = useCallback(async () => {
    const response = await api.get("/super-admin/activity");
    setActivities(response.data.activities || []);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "overview") await loadOverview();
      if (tab === "admins") await loadAdmins();
      if (tab === "users") await loadUsers();
      if (tab === "activity") await loadActivities();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load Super Admin data."
      );
    } finally {
      setLoading(false);
    }
  }, [
    tab,
    loadOverview,
    loadAdmins,
    loadUsers,
    loadActivities,
  ]);

  useEffect(() => {
    if (!authLoading && user?.role === "super_admin") {
      loadData();
    }
  }, [authLoading, user?.role, loadData]);

  if (authLoading) {
    return <main className="p-10">Loading account...</main>;
  }

  if (!user || user.role !== "super_admin") {
    return <main className="p-10">Access denied.</main>;
  }

  function togglePermission(permission) {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((p) => p !== permission)
        : [...current.permissions, permission],
    }));
  }

  async function createAdmin(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      await api.post("/super-admin/admins", form);

      setNotice("Admin account created successfully.");
      setForm({
        name: "",
        email: "",
        password: "",
        permissions: [
          "properties.view",
          "properties.review",
        ],
      });

      await loadAdmins();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Could not create Admin."
      );
    }
  }

  async function savePermissions(admin) {
    const raw = window.prompt(
      "Enter comma-separated permission keys:\n" +
      permissionOptions.map(([key]) => key).join(", "),
      (admin.permissions || []).join(", ")
    );

    if (raw === null) return;

    const permissions = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await api.patch(
        `/super-admin/admins/${admin.id}/permissions`,
        { permissions }
      );
      setNotice("Admin permissions updated.");
      await loadAdmins();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to update permissions."
      );
    }
  }

  async function toggleAdmin(admin) {
    try {
      await api.patch(
        `/super-admin/admins/${admin.id}/active`,
        { is_active: !admin.is_active }
      );
      setNotice("Admin account status updated.");
      await loadAdmins();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to update Admin."
      );
    }
  }

  async function toggleUser(account) {
    try {
      await api.patch(
        `/super-admin/users/${account.id}/active`,
        { is_active: !account.is_active }
      );
      setNotice("User account status updated.");
      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to update user."
      );
    }
  }

  const tabs = [
    ["overview", "Overview"],
    ["admins", "Admin management"],
    ["users", "Users"],
    ["activity", "Activity logs"],
    ["revenue", "Revenue"],
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-400">
            RentKhojRKL · Platform control
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Super Admin
          </h1>
          <p className="mt-2 text-slate-400">
            Welcome, {user.name}. Manage platform access and operations.
          </p>
        </header>
        <Link
  to="/admin/owner-verifications"
  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white hover:bg-violet-700"
>
  <ShieldCheck size={17} />
  Review owner verification
</Link>

        <nav className="mb-8 flex flex-wrap gap-2">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
             className={`rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
      tab === key
        ? "border-violet-600 bg-violet-600 text-white shadow-sm"
        : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"
    }`}
  >
    {label}
  </button>
))}
        </nav>

        {error && (
          <div className="mb-5 rounded-xl bg-red-950 p-4 text-red-200">
            {String(error)}
          </div>
        )}

        {notice && (
          <div className="mb-5 rounded-xl bg-emerald-950 p-4 text-emerald-200">
            {notice}
          </div>
        )}

        {loading && (
          <p className="mb-4 text-slate-400">Loading...</p>
        )}

        {tab === "overview" && overview && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Total users"
              value={overview.users.total}
            />
            <Stat
              label="Owners"
              value={overview.users.owners}
            />
            <Stat
              label="Tenants"
              value={overview.users.tenants}
            />
            <Stat
              label="Admins"
              value={overview.users.admins}
            />
            <Stat
              label="Total properties"
              value={overview.properties.total}
            />
            <Stat
              label="Pending properties"
              value={overview.properties.pending}
            />
            <Stat
              label="Approved properties"
              value={overview.properties.approved}
            />
            <Stat
              label="Rejected properties"
              value={overview.properties.rejected}
            />
          </section>
        )}

        {tab === "admins" && (
          <section className="grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={createAdmin}
              className="rounded-2xl bg-slate-900 p-5"
            >
              <h2 className="mb-4 text-xl font-bold">
                Create Admin
              </h2>

              <input
                required
                className="mb-3 w-full rounded-xl bg-slate-800 p-3"
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                required
                type="email"
                className="mb-3 w-full rounded-xl bg-slate-800 p-3"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                required
                minLength={8}
                type="password"
                className="mb-4 w-full rounded-xl bg-slate-800 p-3"
                placeholder="Temporary password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <h3 className="mb-3 font-semibold">
                Assign permissions
              </h3>

              <div className="mb-5 space-y-3">
                {permissionOptions.map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(key)}
                      onChange={() => togglePermission(key)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-violet-600 p-3 font-bold hover:bg-violet-500 disabled:opacity-50"
              >
                Create Admin
              </button>
            </form>

            <div className="rounded-2xl bg-slate-900 ">
              <h2 className="mb-4 text-xl font-bold">
                Existing Admins
              </h2>

              <div className="space-y-3">
                {admins.map((admin) => (
                  <article
                    key={admin.id}
                    className="rounded-xl bg-slate-800 p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="font-bold">{admin.name}</p>
                        <p className="text-sm text-slate-400">
                          {admin.email}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {(admin.permissions || []).join(", ") || "No permissions"}
                        </p>
                        <p className="mt-1 text-xs">
                          {admin.is_active === false
                            ? "Disabled"
                            : "Active"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => savePermissions(admin)}
                          className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold"
                        >
                          Permissions
                        </button>
                        <button
                          onClick={() => toggleAdmin(admin)}
                          className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold"
                        >
                          {admin.is_active === false
                            ? "Activate"
                            : "Disable"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {admins.length === 0 && (
                  <p className="text-slate-400">
                    No Admin accounts found.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {tab === "users" && (
          <section className="rounded-2xl bg-slate-900 p-5">
            <h2 className="mb-4 text-xl font-bold">
              Tenant and Owner accounts
            </h2>

            <div className="space-y-3">
              {users.map((account) => (
                <article
                  key={account.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-800 p-4"
                >
                  <div>
                    <p className="font-bold">{account.name}</p>
                    <p className="text-sm text-slate-400">
                      {account.email} · {account.role}
                    </p>
                    <p className="text-xs text-slate-400">
                      {account.is_active === false
                        ? "Disabled"
                        : "Active"}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleUser(account)}
                    className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-bold"
                  >
                    {account.is_active === false
                      ? "Activate"
                      : "Disable"}
                  </button>
                </article>
              ))}

              {users.length === 0 && (
                <p className="text-slate-400">No users found.</p>
              )}
            </div>
          </section>
        )}

        {tab === "activity" && (
          <section className="rounded-2xl bg-slate-900 p-5">
            <h2 className="mb-4 text-xl font-bold">
              Admin activity log
            </h2>

            <div className="space-y-3">
              {activities.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl bg-slate-800 p-4"
                >
                  <p className="font-bold">{item.action}</p>
                  <p className="text-sm text-slate-400">
                    {item.actor_name} · {item.actor_role}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "Time unavailable"}
                  </p>
                </article>
              ))}

              {activities.length === 0 && (
                <p className="text-slate-400">
                  No activity recorded yet.
                </p>
              )}
            </div>
          </section>
        )}

        {tab === "revenue" && (
          <section className="rounded-2xl bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Revenue analytics</h2>
            <p className="mt-3 text-slate-400">
              Payment integration is not configured in the current
              RentKhoj codebase. Revenue figures will appear here
              after verified payment records are implemented.
            </p>
            <p className="mt-4 text-3xl font-black text-amber-400">
              Not configured
            </p>
          </section>
        )}
      </div>
    </main>
  );
}


function Stat({ label, value }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm transition hover:border-violet-500/50">
      <p className="text-sm font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-extrabold tracking-tight text-white">
        {formatNumber(value)}
      </p>
    </article>
  );
}

