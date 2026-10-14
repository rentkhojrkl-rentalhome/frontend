
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Home as HomeIcon,
  Building2,
  BedDouble,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Any type");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const [search, setSearch] = useState({
    location: "",
    propertyType: "Any type",
    minRent: "",
    maxRent: "",
  });

  async function fetchProperties() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/properties");
      const data = response.data;

      const items = Array.isArray(data)
        ? data
        : data.properties || [];

      setProperties(items);
    } catch (err) {
      console.error("Unable to load properties:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load properties. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // oxlint-disable-next-line react(set-state-in-effect) -- fetch begins after mount
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const query = search.location.trim().toLowerCase();

    const searchableText = [
      property.title,
      property.location,
      property.city,
      property.area,
      property.address,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesLocation =
      !query || searchableText.includes(query);

    const type = String(
      property.property_type || property.type || ""
    ).toLowerCase();

    const selectedType = search.propertyType.toLowerCase();

    const matchesType =
      selectedType === "any type" ||
      type === selectedType ||
      type.includes(selectedType);

    const rentValue =
      property.monthly_rent ??
      property.rent ??
      property.price;

    const rent =
      rentValue === undefined ||
      rentValue === null ||
      rentValue === ""
        ? null
        : Number(rentValue);

    const matchesMin =
      search.minRent === "" ||
      (rent !== null && rent >= Number(search.minRent));

    const matchesMax =
      search.maxRent === "" ||
      (rent !== null && rent <= Number(search.maxRent));

    return (
      matchesLocation &&
      matchesType &&
      matchesMin &&
      matchesMax
    );
  });

  function handleSearch(event) {
    event.preventDefault();

    if (
      minRent !== "" &&
      maxRent !== "" &&
      Number(minRent) > Number(maxRent)
    ) {
      alert("Minimum rent cannot be higher than maximum rent.");
      return;
    }

    setSearch({
      location,
      propertyType,
      minRent,
      maxRent,
    });

    document
      .getElementById("available-properties")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function clearFilters() {
    setLocation("");
    setPropertyType("Any type");
    setMinRent("");
    setMaxRent("");

    setSearch({
      location: "",
      propertyType: "Any type",
      minRent: "",
      maxRent: "",
    });
  }

  function formatRent(property) {
    const rent =
      property.monthly_rent ??
      property.rent ??
      property.price;

    if (rent === undefined || rent === null || rent === "") {
      return "Contact owner";
    }

    return `₹${Number(rent).toLocaleString("en-IN")} / month`;
  }

  function getPropertyImage(property) {
    return (
      property.image_urls?.[0] ||
      property.images?.[0] ||
      property.image_url ||
      null
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm">
              <MapPin size={16} />
              Made for Rourkela
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Find your place
              <span className="block text-blue-600">
                in Rourkela.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Find rooms, flats, houses and PGs without the usual rental
              hassle.
            </p>
          </div>

          {/* Homepage Search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-5xl rounded-2xl bg-white p-3 shadow-xl shadow-blue-100/50 ring-1 ring-gray-100"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 lg:col-span-2">
                <MapPin className="shrink-0 text-blue-600" size={21} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-gray-400">
                    LOCATION
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Area or sector..."
                    className="mt-1 w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
                <HomeIcon className="shrink-0 text-blue-600" size={21} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-gray-400">
                    PROPERTY
                  </span>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
                  >
                    <option>Any type</option>
                    <option>Room</option>
                    <option>Flat</option>
                    <option>House</option>
                    <option>PG</option>
                  </select>
                </span>
              </label>

              <label className="rounded-xl bg-gray-50 px-3 py-3">
                <span className="block text-xs font-semibold text-gray-400">
                  MIN RENT (₹)
                </span>
                <input
                  type="number"
                  min="0"
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                  placeholder="2000"
                  className="mt-1 w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
                />
              </label>

              <label className="rounded-xl bg-gray-50 px-3 py-3">
                <span className="block text-xs font-semibold text-gray-400">
                  MAX RENT (₹)
                </span>
                <input
                  type="number"
                  min="0"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  placeholder="10000"
                  className="mt-1 w-full bg-transparent text-sm font-medium text-gray-800 outline-none"
                />
              </label>
            </div>

            {minRent !== "" &&
              maxRent !== "" &&
              Number(minRent) > Number(maxRent) && (
                <p className="mt-3 text-sm text-red-600">
                  Minimum rent cannot exceed maximum rent.
                </p>
              )}

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={
                  minRent !== "" &&
                  maxRent !== "" &&
                  Number(minRent) > Number(maxRent)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Search size={19} />
                Search properties
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          </form>

          {/* Quick actions */}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/search"
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:ring-blue-300"
            >
              <Search size={17} />
              Find a place
            </Link>

            <Link
              to="/post-property"
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Building2 size={17} />
              List your property
            </Link>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0%</p>
            <p className="mt-1 text-sm text-gray-500">Brokerage goal</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="mt-1 text-sm text-gray-500">Rourkela focused</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">24/7</p>
            <p className="mt-1 text-sm text-gray-500">Search anytime</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">1 place</p>
            <p className="mt-1 text-sm text-gray-500">For rental needs</p>
          </div>
        </div>
      </section>

      {/* Live property listings */}
      <section
        id="available-properties"
        className="bg-gray-50 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Explore rentals
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                Available properties
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Find your next home in Rourkela.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProperties}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
              Loading properties...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
              <p className="font-semibold text-red-600">{error}</p>
              <button
                type="button"
                onClick={fetchProperties}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <Building2 className="mx-auto text-gray-400" size={38} />

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No properties found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {properties.length === 0
                  ? "No listings are available yet. Be the first to list a property!"
                  : "Try changing your location, property type or rent range."}
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-gray-500">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1
                  ? "property"
                  : "properties"}{" "}
                found
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => {
                  const image = getPropertyImage(property);
                  const propertyId = property.id || property._id;

                  return (
                    <article
                      key={propertyId}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-52 bg-gray-100">
                        {image ? (
                          <img
                            src={image}
                            alt={property.title || "Rental property"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center text-gray-400">
                            <Building2 size={42} />
                            <span className="mt-2 text-sm">
                              No image available
                            </span>
                          </div>
                        )}

                        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">
                          Available
                        </span>
                      </div>

                      <div className="p-5">
                        <p className="text-xl font-bold text-blue-600">
                          {formatRent(property)}
                        </p>

                        <h3 className="mt-2 truncate text-lg font-bold text-gray-900">
                          {property.title || "Rental property"}
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={16} className="shrink-0" />
                          <span className="truncate">
                            {[
                              property.area,
                              property.location,
                              property.city,
                              property.address,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Rourkela"}
                          </span>
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <BedDouble size={16} />
                            {property.property_type ||
                              property.type ||
                              "Rental"}
                          </span>

                          <span>
                            {property.furnishing || "Details available"}
                          </span>
                        </div>

                        <Link
                          to={`/properties/${propertyId}`}
                          className="mt-5 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          View property
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
