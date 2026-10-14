
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search as SearchIcon,
  MapPin,
  Building2,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { api } from "../services/api";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );
  const [propertyType, setPropertyType] = useState(
    searchParams.get("type") || "Any type"
  );
  const [minRent, setMinRent] = useState(
    searchParams.get("minRent") || ""
  );
  const [maxRent, setMaxRent] = useState(
    searchParams.get("maxRent") || ""
  );
  const [furnishing, setFurnishing] = useState("Any");
  const [sortBy, setSortBy] = useState("newest");

  async function loadProperties() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/properties");
      const data = response.data;

      setProperties(
        Array.isArray(data) ? data : data.properties || []
      );
    } catch (err) {
      console.error("Property search failed:", err);
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
    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    const query = location.trim().toLowerCase();
    const min = minRent === "" ? null : Number(minRent);
    const max = maxRent === "" ? null : Number(maxRent);

    const results = properties.filter((property) => {
      const rentValue =
        property.monthly_rent ?? property.rent ?? property.price;

      const rent =
        rentValue === undefined || rentValue === null
          ? null
          : Number(rentValue);

      const searchableText = [
        property.title,
        property.location,
        property.area,
        property.city,
        property.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesLocation =
        !query || searchableText.includes(query);

      const rawType = String(
        property.property_type || property.type || ""
      ).toLowerCase();

      const selectedType = propertyType.toLowerCase();

      const matchesType =
        propertyType === "Any type" ||
        rawType === selectedType ||
        rawType.includes(selectedType);

      const matchesMin =
        min === null || (rent !== null && rent >= min);

      const matchesMax =
        max === null || (rent !== null && rent <= max);

      const rawFurnishing = String(
        property.furnishing || ""
      ).toLowerCase();

      const matchesFurnishing =
        furnishing === "Any" ||
        rawFurnishing === furnishing.toLowerCase();

      return (
        matchesLocation &&
        matchesType &&
        matchesMin &&
        matchesMax &&
        matchesFurnishing
      );
    });

    return [...results].sort((a, b) => {
      const rentA = Number(
        a.monthly_rent ?? a.rent ?? a.price ?? 0
      );
      const rentB = Number(
        b.monthly_rent ?? b.rent ?? b.price ?? 0
      );

      if (sortBy === "rent-low") return rentA - rentB;
      if (sortBy === "rent-high") return rentB - rentA;

      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      return dateB - dateA;
    });
  }, [
    properties,
    location,
    propertyType,
    minRent,
    maxRent,
    furnishing,
    sortBy,
  ]);

  function handleSearch(event) {
    event.preventDefault();

    const params = {};

    if (location.trim()) params.location = location.trim();
    if (propertyType !== "Any type") params.type = propertyType;
    if (minRent !== "") params.minRent = minRent;
    if (maxRent !== "") params.maxRent = maxRent;

    setSearchParams(params);
  }

  function clearFilters() {
    setLocation("");
    setPropertyType("Any type");
    setMinRent("");
    setMaxRent("");
    setFurnishing("Any");
    setSortBy("newest");
    setSearchParams({});
  }

  function formatRent(property) {
    const value =
      property.monthly_rent ?? property.rent ?? property.price;

    if (value === undefined || value === null || value === "") {
      return "Rent not specified";
    }

    return `₹${Number(value).toLocaleString("en-IN")} / month`;
  }

  function getImage(property) {
    return (
      property.image_urls?.[0] ||
      property.images?.[0] ||
      property.image_url ||
      ""
    );
  }

  function getLocation(property) {
    return [
      property.area,
      property.location,
      property.city,
      property.address,
    ]
      .filter(Boolean)
      .join(", ") || "Rourkela";
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            RENTKHOJ · FIND YOUR PLACE
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Find a place to call home
          </h1>

          <p className="mt-3 text-gray-500">
            Explore rental properties around Rourkela.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal className="text-blue-600" size={20} />
            <h2 className="font-bold text-gray-900">
              Search and filters
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                <MapPin size={18} className="text-gray-400" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Area, sector or locality"
                  className="w-full py-3 outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Property type
              </span>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 outline-none focus:border-blue-500"
              >
                <option>Any type</option>
                <option>Room</option>
                <option>Flat</option>
                <option>House</option>
                <option>PG</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Furnishing
              </span>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 outline-none focus:border-blue-500"
              >
                <option>Any</option>
                <option>Furnished</option>
                <option>Semi-furnished</option>
                <option>Unfurnished</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Minimum monthly rent (₹)
              </span>
              <input
                type="number"
                min="0"
                value={minRent}
                onChange={(e) => setMinRent(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Maximum monthly rent (₹)
              </span>
              <input
                type="number"
                min="0"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Sort results
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 outline-none focus:border-blue-500"
              >
                <option value="newest">Newest first</option>
                <option value="rent-low">Rent: low to high</option>
                <option value="rent-high">Rent: high to low</option>
              </select>
            </label>
          </div>

          {minRent !== "" &&
            maxRent !== "" &&
            Number(minRent) > Number(maxRent) && (
              <p className="mt-3 text-sm text-red-600">
                Minimum rent cannot be higher than maximum rent.
              </p>
            )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={
                minRent !== "" &&
                maxRent !== "" &&
                Number(minRent) > Number(maxRent)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SearchIcon size={18} />
              Search properties
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear filters
            </button>

            <button
              type="button"
              onClick={loadProperties}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </form>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            Available properties
          </h2>
          <p className="text-sm text-gray-500">
            {loading
              ? "Loading..."
              : `${filteredProperties.length} properties found`}
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            Loading rental listings...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              onClick={loadProperties}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <Building2 className="mx-auto text-gray-400" size={42} />
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No matching properties
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try a different location or rent range.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => {
              const image = getImage(property);
              const id = property.id || property._id;

              return (
                <article
                  key={id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-52 items-center justify-center bg-gray-100">
                    {image ? (
                      <img
                        src={image}
                        alt={property.title || "Rental property"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Building2 className="mx-auto" size={42} />
                        <p className="mt-2 text-sm">No image available</p>
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

                    <h3 className="mt-2 text-lg font-bold text-gray-900">
                      {property.title || "Rental property"}
                    </h3>

                    <p className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                      <MapPin size={16} className="mt-0.5 shrink-0" />
                      <span>{getLocation(property)}</span>
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                      <span>
                        {property.property_type ||
                          property.type ||
                          "Rental"}
                      </span>
                      <span className="text-right">
                        {property.furnishing || "Not specified"}
                      </span>
                    </div>

                    <Link
                      to={`/properties/${id}`}
                      className="mt-5 block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                    >
                      View property
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Search;
