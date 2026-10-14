
import { Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Heart,
  ShieldCheck,
} from "lucide-react";

function PropertyCard({ property }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <Link to={`/properties/${property.id}`}>
          <img
            src={property.image}
            alt={property.title}
            className="h-56 w-full object-cover"
          />
        </Link>

        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
          {property.type}
        </span>

        <button
          type="button"
          aria-label="Save property"
          onClick={() => alert("Favorites will be added in a later step.")}
          className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-700 hover:text-red-500"
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="p-5">
        <p className="text-xl font-bold text-gray-900">
          ₹{property.rent.toLocaleString("en-IN")}
          <span className="text-sm font-normal text-gray-500"> / month</span>
        </p>

        <Link to={`/properties/${property.id}`}>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 hover:text-blue-600">
            {property.title}
          </h3>
        </Link>

        <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={16} className="shrink-0 text-blue-600" />
          {property.area}, Rourkela
        </p>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={17} />
              {property.bedrooms} BHK
            </span>
          )}

          <span className="flex items-center gap-1">
            <Bath size={17} />
            {property.bathrooms} bath
          </span>

          <span>{property.furnishing}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs text-green-700">
            <ShieldCheck size={15} />
            {property.verified ? "Owner verified" : "Not verified"}
          </span>

          <Link
            to={`/properties/${property.id}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
