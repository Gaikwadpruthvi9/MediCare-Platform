import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, CalendarCheck, Ban } from "lucide-react";
import { homeDoctorsStyles } from "../../assets/dummyStyles";

const API_BASE = "http://localhost:4000";

export default function HomeDoctors({ previewCount = 8 }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setDoctors([]);
        return;
      }
      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((d) => {
        const id = d._id || d.id;
        const image = d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";
        const available =
          (typeof d.availability === "string"
            ? d.availability.toLowerCase() === "available"
            : typeof d.available === "boolean"
              ? d.available
              : d.availability === true) || d.availability === "Available";
        return {
          id,
          name: d.name || "Doctor",
          specialization: d.specialization || "Specialist",
          image,
          experience:
            d.experience || d.experience === 0 ? String(d.experience) : "5+ years",
          fee: d.fee ?? d.price ?? 500,
          available,
          raw: d,
        };
      });

      setDoctors(normalized);
    } catch (err) {
      console.error("load doctors error:", err);
      setError("Network error while loading doctors.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const preview = doctors.slice(0, previewCount);

  return (
    <section className={homeDoctorsStyles.section}>
      <style>{homeDoctorsStyles.customCSS}</style>

      <div className={homeDoctorsStyles.container}>
        <div className={homeDoctorsStyles.header}>
          <h2 className={homeDoctorsStyles.title}>
            Top <span className={homeDoctorsStyles.titleSpan}>Specialists</span> To Consult
          </h2>
          <p className={homeDoctorsStyles.subtitle}>
            Connect with certified, experienced doctors across various specialties for in-person or online consultations.
          </p>
        </div>

        {/* Error / Retry */}
        {error && (
          <div className={homeDoctorsStyles.errorContainer}>
            <div className={homeDoctorsStyles.errorText}>{error}</div>
            <button
              type="button"
              onClick={loadDoctors}
              className={homeDoctorsStyles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className={homeDoctorsStyles.skeletonGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={homeDoctorsStyles.skeletonCard}>
                <div className={homeDoctorsStyles.skeletonImage} />
                <div className={homeDoctorsStyles.skeletonText1} />
                <div className={homeDoctorsStyles.skeletonText2} />
                <div className={homeDoctorsStyles.skeletonButton} />
              </div>
            ))}
          </div>
        ) : (
          <div className={homeDoctorsStyles.doctorsGrid}>
            {preview.map((doctor) => (
              <article key={doctor.id} className={homeDoctorsStyles.article}>
                <div
                  className={
                    doctor.available
                      ? homeDoctorsStyles.imageContainerAvailable
                      : homeDoctorsStyles.imageContainerUnavailable
                  }
                >
                  <img
                    src={doctor.image || "/placeholder-doctor.jpg"}
                    alt={doctor.name}
                    loading="lazy"
                    className={homeDoctorsStyles.image}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder-doctor.jpg";
                    }}
                  />
                  {!doctor.available && (
                    <span className={homeDoctorsStyles.unavailableBadge}>
                      Unavailable
                    </span>
                  )}
                </div>

                <div className={homeDoctorsStyles.cardBody}>
                  <h3 className={homeDoctorsStyles.doctorName}>
                    {doctor.name}
                  </h3>
                  <p className={homeDoctorsStyles.specialization}>
                    {doctor.specialization}
                  </p>

                  <div className={homeDoctorsStyles.experienceContainer}>
                    <div className={homeDoctorsStyles.experienceBadge}>
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{doctor.experience}</span>
                    </div>
                    <span className="font-semibold text-emerald-700">
                      ₹{doctor.fee}
                    </span>
                  </div>

                  <div className={homeDoctorsStyles.buttonContainer}>
                    {doctor.available ? (
                      <Link
                        to={`/doctors/${doctor.id}`}
                        state={{ doctor: doctor.raw || doctor }}
                        className={homeDoctorsStyles.buttonAvailable}
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>Book Appointment</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className={homeDoctorsStyles.buttonUnavailable}
                      >
                        <Ban className="w-4 h-4" />
                        <span>Not Available</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link
            to="/doctors"
            className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all duration-300"
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
}
