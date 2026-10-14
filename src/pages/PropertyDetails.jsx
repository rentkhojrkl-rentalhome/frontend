import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  ShieldCheck,
  Wallet,
  Building2,
  Phone,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { api } from "../services/api";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProperty() {
      setLoading(true);
      setError("");
      setProperty(null);

      try {
        const response = await api.get(`/properties/${id}`);
        const found = response.data;

        if (!cancelled) {
          if (found) {
            setProperty(found);
            setSelectedImage(
              found.image_urls?.[0] || found.images?.[0] || found.image_url || ""
            );
          } else {
            setError(
              "This property was not found in the public listings."
            );
          }
        }
      } catch (err) {
        console.error("Property details error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              "Unable to load property details. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProperty();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="px-4 py-20 text-center text-gray-500">
        Loading property details...
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Building2 className="mx-auto text-gray-400" size={44} />
        <h1 className="mt-4 text-2xl font-bold">
          Property unavailable
        </h1>
        <p className="mt-2 text-gray-500">
          {error || "This property could not be found."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Back to homepage
        </Link>
      </main>
    );
  }

  const title = property.title || "Rental property";
  const rent =
    property.monthly_rent ?? property.rent ?? property.price;
  const location =
    [
      property.area,
      property.location,
      property.city,
      property.address,
    ]
      .filter(Boolean)
      .join(", ") || "Rourkela, Odisha";

  const images = [
    ...(Array.isArray(property.image_urls) ? property.image_urls : []),
    ...(Array.isArray(property.images) ? property.images : []),
    ...(property.image_url ? [property.image_url] : []),
  ].filter((url, index, all) => typeof url === "string" && url && all.indexOf(url) === index);
  const image = selectedImage || images[0] || "";

  const type = property.property_type || property.type || "Rental";
  const furnishing = property.furnishing || "Not specified";
  const bedrooms = property.bedrooms ?? property.bhk;
  const bathrooms = property.bathrooms;
  const description =
    property.description || "Contact the property owner for more details.";

  const money = (amount) =>
    amount !== undefined && amount !== null && amount !== ""
      ? `₹${Number(amount).toLocaleString("en-IN")}`
      : "Not specified";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to properties
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="bg-gray-100">
            <div className="flex h-64 items-center justify-center sm:h-[460px]">
              {image ? (
                <img src={image} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <Building2 size={52} className="mx-auto" />
                  <p className="mt-3">No image available</p>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto px-4 py-4 sm:px-6">
                {images.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(url)}
                    aria-label={`Show property photo ${index + 1}`}
                    aria-pressed={image === url}
                    className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 bg-white ${image === url ? "border-emerald-500" : "border-transparent"}`}
                  >
                    <img src={url} alt={`${title} photo ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_320px]">
            <section>
              <p className="text-sm font-semibold text-blue-600">
                RENTKHOJ · RENTAL LISTING
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
                {title}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-gray-500">
                <MapPin size={18} />
                {location}
              </p>

              <div className="mt-6 flex flex-wrap gap-5 border-y border-gray-100 py-5 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Building2 size={19} />
                  {type}
                </span>

                {bedrooms !== undefined && (
                  <span className="flex items-center gap-2">
                    <BedDouble size={19} />
                    {bedrooms} bedroom(s)
                  </span>
                )}

                {bathrooms !== undefined && (
                  <span className="flex items-center gap-2">
                    <Bath size={19} />
                    {bathrooms} bathroom(s)
                  </span>
                )}

                <span>{furnishing}</span>
              </div>

              <h2 className="mt-7 text-lg font-bold">
                About this property
              </h2>
              <p className="mt-3 leading-7 text-gray-600">
                {description}
              </p>

              <h2 className="mt-7 text-lg font-bold">
                Rental information
              </h2>

              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <Wallet className="text-blue-600" size={21} />
                <p className="mt-3 text-sm text-gray-500">
                  Security deposit
                </p>
                <p className="mt-1 font-bold">
                  {money(property.deposit ?? property.security_deposit)}
                </p>
              </div>

              <p className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck size={18} />
                Check property details before making any payment.
              </p>
            </section>

            <aside>
              <div className="rounded-2xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">Monthly rent</p>
                <p className="mt-1 text-3xl font-extrabold text-gray-900">
                  {money(rent)}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Deposit: {money(property.deposit ?? property.security_deposit)}
                </p>

                <div className="mt-6 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <UserRound size={21} />
                    </span>
                    <div>
                      <p className="text-xs text-gray-500">Property owner</p>
                      <p className="font-semibold text-gray-900">
                        {property.owner_name || "Owner"}
                      </p>
                    </div>
                  </div>

                  {property.owner_phone ? (
                    <>
                      <p className="mt-3 text-sm text-gray-600">
                        {property.owner_phone}
                      </p>
                      <a
                        href={`tel:${property.owner_phone}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
                      >
                        <Phone size={18} /> Call owner
                      </a>
                      <a
                        href={`https://wa.me/91${property.owner_phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I found your property on RentKhoj: ${title} (${location}). Is it still available?`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 px-4 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        <MessageCircle size={18} /> WhatsApp owner
                      </a>
                    </>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-amber-700">
                      The owner has not added a contact number yet. Please check back later.
                    </p>
                  )}
                </div>

                <a
                  href={`mailto:?subject=${encodeURIComponent(`Rental enquiry: ${title}`)}&body=${encodeURIComponent(`Hello, I am interested in this property: ${title}\nLocation: ${location}\nMonthly rent: ${money(rent)}`)}`}
                  className="mt-3 block w-full rounded-xl border border-gray-200 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Enquire by email
                </a>
                <p className="mt-3 text-xs leading-5 text-gray-500">
                  Contact the owner to confirm availability and inspect the property before making any payment.
                </p>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}

export default PropertyDetails;
