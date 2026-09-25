import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, X, Award, CalendarCheck, Ban, ChevronRight } from "lucide-react";
import { doctorsPageStyles } from "../../assets/dummyStyles";
import { API_BASE } from "../../config/api";

export default function DoctorsPage() {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const loadDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/doctors`);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (json && json.message) || `Failed to load doctors (${res.status})`;
        setError(msg);
        setAllDoctors([]);
        return;
      }

      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((d) => {
        const id = d._id || d.id;
        const image = d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";
        let available = true;
        if (typeof d.availability === "string") {
          available = d.availability.toLowerCase() === "available";
        } else if (typeof d.available === "boolean") {
          available = d.available;
        } else if (typeof d.availability === "boolean") {
          available = d.availability;
        } else {
          available = d.availability === "Available" || d.available === true;
        }
        return {
          id,
          name: d.name || "Specialist Doctor",
          specialization: d.specialization || "General Medicine",
          image,
          experience:
            d.experience ?? d.experience === 0 ? String(d.experience) : "5+ years",
          fee: d.fee ?? d.price ?? 500,
          available,
          raw: d,
        };
      });

      setAllDoctors(normalized);
    } catch (err) {
      console.error("load doctors error:", err);
      setError("Network error while loading doctors.");
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allDoctors;
    return allDoctors.filter(
      (doctor) =>
        (doctor.name || "").toLowerCase().includes(q) ||
        (doctor.specialization || "").toLowerCase().includes(q),
    );
  }, [allDoctors, searchTerm]);

  const displayedDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, 8);

  return (
    <div className={doctorsPageStyles.mainContainer}>
      <div className={doctorsPageStyles.backgroundShape1} />
      <div className={doctorsPageStyles.backgroundShape2} />

      <div className={doctorsPageStyles.wrapper}>
        <div className={doctorsPageStyles.headerContainer}>
          <h1 className={doctorsPageStyles.headerTitle}>Find Our Specialists</h1>
          <p className={doctorsPageStyles.headerSubtitle}>
            Browse our directory of top medical professionals and schedule your appointment today
          </p>
        </div>

        {/* Search Bar */}
        <div className={doctorsPageStyles.searchContainer}>
          <div className={doctorsPageStyles.searchWrapper}>
            <Search className={doctorsPageStyles.searchIcon} />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={doctorsPageStyles.searchInput}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className={doctorsPageStyles.clearButton}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Error Container */}
        {error && (
          <div className={doctorsPageStyles.errorContainer}>
            <p className={doctorsPageStyles.errorText}>{error}</p>
            <button
              type="button"
              onClick={loadDoctors}
              className={doctorsPageStyles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeleton Loading State */}
        {loading ? (
          <div className={doctorsPageStyles.skeletonGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={doctorsPageStyles.skeletonCard}>
                <div className={doctorsPageStyles.skeletonImage} />
                <div className={doctorsPageStyles.skeletonName} />
                <div className={doctorsPageStyles.skeletonSpecialization} />
                <div className={doctorsPageStyles.skeletonButton} />
              </div>
            ))}
          </div>
        ) : displayedDoctors.length === 0 ? (
          <div className={doctorsPageStyles.noResults}>
            {searchTerm
              ? `No doctors found matching "${searchTerm}".`
              : "No specialists registered yet. Once doctors are added in the Admin Panel, they will appear here."}
          </div>
        ) : (
          <div className={doctorsPageStyles.doctorsGrid}>
            {displayedDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`${doctorsPageStyles.doctorCard} ${
                  !doctor.available ? doctorsPageStyles.doctorCardUnavailable : ""
                }`}
              >
                {doctor.available ? (
                  <Link
                    to={`/doctors/${doctor.id}`}
                    state={{ doctor: doctor.raw || doctor }}
                    className={doctorsPageStyles.focusRing}
                  >
                    <div className={doctorsPageStyles.imageContainer}>
                      <img
                        src={doctor.image || "/placeholder-doctor.jpg"}
                        alt={doctor.name}
                        loading="lazy"
                        className={doctorsPageStyles.doctorImage}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-doctor.jpg";
                        }}
                      />
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`${doctorsPageStyles.imageContainer} ${doctorsPageStyles.imageContainerUnavailable}`}
                  >
                    <img
                      src={doctor.image || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      loading="lazy"
                      className={doctorsPageStyles.doctorImageUnavailable}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-doctor.jpg";
                      }}
                    />
                  </div>
                )}

                <h3 className={doctorsPageStyles.doctorName}>{doctor.name}</h3>
                <p className={doctorsPageStyles.doctorSpecialization}>
                  {doctor.specialization}
                </p>

                <div className={doctorsPageStyles.experienceBadge}>
                  <Award className={doctorsPageStyles.experienceIcon} />
                  <span>{doctor.experience} experience</span>
                </div>

                <div className="mt-2 mb-4 font-semibold text-emerald-700">
                  Consultation Fee: ₹{doctor.fee}
                </div>

                <div>
                  {doctor.available ? (
                    <Link
                      to={`/doctors/${doctor.id}`}
                      state={{ doctor: doctor.raw || doctor }}
                      className={doctorsPageStyles.bookButton}
                    >
                      <CalendarCheck className={doctorsPageStyles.bookButtonIcon} />
                      <span>Book Appointment</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className={doctorsPageStyles.notAvailableButton}
                    >
                      <Ban className={doctorsPageStyles.notAvailableIcon} />
                      <span>Not Available</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More Button */}
        {!loading && filteredDoctors.length > 8 && (
          <div className={doctorsPageStyles.showMoreContainer}>
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className={doctorsPageStyles.showMoreButton}
            >
              <span>{showAll ? "Show Less" : "Show All Doctors"}</span>
              <ChevronRight className={doctorsPageStyles.showMoreIcon} />
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.9s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.9s ease-out both; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }

        @media (max-width: 420px) {
          .max-w-7xl { padding-left: 10px; padding-right: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
