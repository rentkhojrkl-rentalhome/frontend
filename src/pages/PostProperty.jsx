
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import {
  PlusCircle,
  Home,
  IndianRupee,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Phone,
  Save,
  ImagePlus,
  X,
} from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  property_type: "Room",
  rent: "",
  deposit: "",
  area: "",
  address: "",
  bedrooms: "1",
  bathrooms: "1",
  furnishing: "Unfurnished",
  tenant_preference: "Anyone",
  image_urls: [],
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {children}
    </label>
  );
}

function formatRent(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "unknown"}
    </span>
  );
}

export default function PostProperty() {
  const [form, setForm] = useState(initialForm);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/properties/mine");
      setProperties(response.data.properties || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load your listings. Please log in again if your session has expired."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // oxlint-disable-next-line react(set-state-in-effect) -- fetch begins after mount
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    let cancelled = false;
    api.get("/auth/me").then((response) => {
      if (!cancelled) setPhone(response.data.phone || "");
    }).catch(() => {
      if (!cancelled) setPhone("");
    });
    return () => { cancelled = true; };
  }, []);

  async function savePhone(event) {
    event.preventDefault();
    setPhoneMessage("");
    const digits = phone.replace(/\D/g, "");
    const normalized = digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits;
    if (!/^[6-9]\d{9}$/.test(normalized)) {
      setPhoneMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhoneSaving(true);
    try {
      const response = await api.patch("/auth/phone", { phone: normalized });
      setPhone(response.data.user.phone || normalized);
      setPhoneMessage("Contact number saved. Tenants can see it on your approved property details.");
    } catch (err) {
      setPhoneMessage(err.response?.data?.detail || "Could not save your number. Please try again.");
    } finally {
      setPhoneSaving(false);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (selectedFiles.length > 10) {
      setError("You can upload a maximum of 10 photos per property.");
      return;
    }

    setSubmitting(true);

    try {
      let image_urls = [];
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach(({ file }) => uploadData.append("files", file));
        const uploadResponse = await api.post("/properties/upload-images", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        image_urls = uploadResponse.data.image_urls || [];
      }

      const payload = {
        ...form,
        rent: Number(form.rent),
        deposit: Number(form.deposit),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        image_urls,
      };

      await api.post("/properties", payload);

      selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setSelectedFiles([]);
      setForm(initialForm);
      setSuccess(
        "Property submitted successfully! It is pending review before appearing in public search."
      );

      await loadProperties();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to submit your property. Please check the details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            RentKhoj Owner Centre
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Manage your properties
          </h1>
          <p className="mt-2 max-w-2xl text-gray-500">
            Add a property, share accurate details, and track its review status.
          </p>
        </div>

        <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Phone size={21} />
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900">Owner contact number</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Tenants can call or WhatsApp this number from your approved property details. Only use a number you are comfortable sharing publicly.
              </p>
              <form onSubmit={savePhone} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={16}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:max-w-sm"
                />
                <button type="submit" disabled={phoneSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                  <Save size={17} /> {phoneSaving ? "Saving..." : "Save number"}
                </button>
              </form>
              {phoneMessage && <p role="status" className="mt-3 text-sm text-gray-600">{phoneMessage}</p>}
            </div>
          </div>
        </section>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total listings</p>
              <Home className="text-emerald-600" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {properties.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Awaiting review</p>
              <Clock className="text-amber-500" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {properties.filter((p) => p.status === "pending").length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Approved listings</p>
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {properties.filter((p) => p.status === "approved").length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle className="mt-0.5 shrink-0" size={18} />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <p>{success}</p>
          </div>
        )}

        <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <PlusCircle size={23} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Add a property
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Fields marked with * are required.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Property title *">
                <input
                  className={inputClass}
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  placeholder="e.g. Spacious room near Civil Township"
                  minLength={5}
                  maxLength={120}
                  required
                />
              </Field>

              <Field label="Property type *">
                <select
                  className={inputClass}
                  name="property_type"
                  value={form.property_type}
                  onChange={updateField}
                >
                  <option>Room</option>
                  <option>Flat</option>
                  <option>House</option>
                  <option>PG</option>
                </select>
              </Field>

              <Field label="Monthly rent (₹) *">
                <input
                  className={inputClass}
                  type="number"
                  name="rent"
                  value={form.rent}
                  onChange={updateField}
                  min="1"
                  max="10000000"
                  placeholder="5000"
                  required
                />
              </Field>

              <Field label="Security deposit (₹) *">
                <input
                  className={inputClass}
                  type="number"
                  name="deposit"
                  value={form.deposit}
                  onChange={updateField}
                  min="0"
                  max="100000000"
                  placeholder="10000"
                  required
                />
              </Field>

              <Field label="Area / locality *">
                <input
                  className={inputClass}
                  name="area"
                  value={form.area}
                  onChange={updateField}
                  placeholder="Chhend Colony, Rourkela"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </Field>

              <Field label="Full address *">
                <input
                  className={inputClass}
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  placeholder="Street, sector, landmark"
                  minLength={5}
                  maxLength={300}
                  required
                />
              </Field>

              <Field label="Bedrooms">
                <input
                  className={inputClass}
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={updateField}
                  min="0"
                  max="50"
                  required
                />
              </Field>

              <Field label="Bathrooms">
                <input
                  className={inputClass}
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={updateField}
                  min="0"
                  max="50"
                  required
                />
              </Field>

              <Field label="Furnishing *">
                <select
                  className={inputClass}
                  name="furnishing"
                  value={form.furnishing}
                  onChange={updateField}
                >
                  <option>Unfurnished</option>
                  <option>Semi-furnished</option>
                  <option>Furnished</option>
                </select>
              </Field>

              <Field label="Preferred tenant *">
                <select
                  className={inputClass}
                  name="tenant_preference"
                  value={form.tenant_preference}
                  onChange={updateField}
                >
                  <option>Anyone</option>
                  <option>Students</option>
                  <option>Bachelors</option>
                  <option>Family</option>
                </select>
              </Field>
            </div>

            <Field label="Property description *">
              <textarea
                className={`${inputClass} min-h-32 resize-y`}
                name="description"
                value={form.description}
                onChange={updateField}
                placeholder="Describe the property, facilities, nearby landmarks, rules, and other useful details..."
                minLength={20}
                maxLength={3000}
                required
              />
              <span className="mt-1 block text-xs text-gray-400">
                {form.description.length}/3000 characters
              </span>
            </Field>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property photos (optional)
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Select up to 10 JPG, PNG or WEBP photos. Each photo must be 8 MB or smaller.
              </p>
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 px-5 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
                <ImagePlus size={30} className="text-emerald-700" />
                <span className="mt-2 font-semibold text-gray-800">Choose photos from your device</span>
                <span className="mt-1 text-xs text-gray-500">{selectedFiles.length}/10 selected</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const incoming = Array.from(event.target.files || []);
                    event.target.value = "";
                    setError("");
                    if (selectedFiles.length + incoming.length > 10) {
                      setError("You can select a maximum of 10 photos per property.");
                      return;
                    }
                    const invalidType = incoming.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type));
                    if (invalidType) {
                      setError("Use JPG, PNG or WEBP image files only.");
                      return;
                    }
                    const oversized = incoming.find((file) => file.size > 8 * 1024 * 1024);
                    if (oversized) {
                      setError(`${oversized.name} is larger than 8 MB. Choose a smaller photo.`);
                      return;
                    }
                    setSelectedFiles((current) => [
                      ...current,
                      ...incoming.map((file, index) => ({
                        file,
                        preview: URL.createObjectURL(file),
                        id: `${Date.now()}-${index}-${file.name}`,
                      })),
                    ]);
                  }}
                />
              </label>

              {selectedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {selectedFiles.map((item, index) => (
                    <div key={item.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                      <img src={item.preview} alt={`Selected property photo ${index + 1}`} className="h-28 w-full object-cover" />
                      <p className="truncate px-2 py-2 text-xs text-gray-600">{item.file.name}</p>
                      <button
                        type="button"
                        aria-label={`Remove photo ${index + 1}`}
                        onClick={() => {
                          URL.revokeObjectURL(item.preview);
                          setSelectedFiles((current) => current.filter((photo) => photo.id !== item.id));
                        }}
                        className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-gray-700 shadow hover:bg-red-50 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? "Submitting..." : "Submit property for review"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My listings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Check the status of every property you have submitted.
              </p>
            </div>
            <button
              onClick={loadProperties}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Loading your listings...
            </p>
          ) : properties.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center">
              <Home className="mx-auto text-gray-400" size={30} />
              <p className="mt-3 font-semibold text-gray-800">
                No properties yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Submit your first property using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <article
                  key={property.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {property.title}
                      </h3>
                      <StatusBadge status={property.status} />
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin size={15} />
                      {property.area}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                      <IndianRupee size={15} />
                      {formatRent(property.rent)} / month
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {property.property_type} · {property.furnishing}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
