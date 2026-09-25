import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { servicePageStyles, serviceCardStyles } from "../../assets/dummyStyles";

const API_BASE = "http://localhost:4000";
const PlaceholderImg = "/placeholder-service.jpg";

export const ServiceCard = ({ service }) => {
  const src = service.imageUrl || service.image || service.imageSmall || "";
  const name = service.name || "Medical Service";
  const shortDescription = service.shortDescription || service.about || "Comprehensive healthcare service and specialized diagnostics.";

  return (
    <div className={serviceCardStyles.card}>
      <div className={serviceCardStyles.imageContainer}>
        <img
          src={src || PlaceholderImg}
          alt={name}
          loading="lazy"
          className={serviceCardStyles.responsiveImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PlaceholderImg;
          }}
        />
      </div>

      <div className="p-5 font-serif flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">{name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {shortDescription}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between pt-3 border-t border-emerald-100 mb-4">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Fee
            </span>
            <span className="text-xl font-bold text-emerald-800">
              ₹{service.price}
            </span>
          </div>

          <Link
            to={`/services/${service.id}`}
            className="w-full py-2.5 px-4 rounded-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-300"
          >
            <span>Book Service</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function ServicePage({ previewCount }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (json && json.message) || `Failed to load services (${res.status})`;
        setError(msg);
        setServices([]);
        return;
      }

      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((s) => {
        const id = s._id || s.id;
        const image = s.imageUrl || s.image || s.imageSmall || "";
        const available =
          typeof s.available === "boolean"
            ? s.available
            : typeof s.availability === "string"
              ? s.availability.toLowerCase() === "available"
              : s.availability === "Available" || s.available === true;

        return {
          id,
          name: s.name || "Medical Service",
          shortDescription: s.shortDescription || s.about || "",
          image,
          price: s.price ?? s.fee ?? 499,
          available,
          raw: s,
        };
      });

      setServices(normalized);
    } catch (err) {
      console.error("load services error:", err);
      setError("Network error while loading services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const shown = previewCount ? services.slice(0, previewCount) : services;

  return (
    <div className={servicePageStyles.pageContainer}>
      <div className={servicePageStyles.maxWidthContainer}>
        <div className={servicePageStyles.header}>
          <h1 className={servicePageStyles.title}>Our Healthcare Services</h1>
          <p className={servicePageStyles.subtitle}>
            Explore our state-of-the-art diagnostic packages, clinical tests, and preventative health checkups
          </p>
        </div>

        {error && (
          <div className={servicePageStyles.errorContainer}>
            <p className={servicePageStyles.errorText}>{error}</p>
            <button
              type="button"
              onClick={loadServices}
              className={servicePageStyles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className={servicePageStyles.skeletonGrid}>
            {Array.from({ length: previewCount || 4 }).map((_, i) => (
              <div key={i} className={servicePageStyles.skeletonCard}>
                <div className={servicePageStyles.skeletonImage} />
                <div className={servicePageStyles.skeletonText1} />
                <div className={servicePageStyles.skeletonText2} />
                <div className={servicePageStyles.skeletonButton} />
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className={servicePageStyles.emptyState}>
            No healthcare services available right now. Please check back later.
          </div>
        ) : (
          <div className={servicePageStyles.servicesGrid}>
            {shown.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {previewCount && services.length > previewCount && (
          <div className="flex justify-center mt-10">
            <Link
              to="/services"
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all duration-300"
            >
              View All Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}