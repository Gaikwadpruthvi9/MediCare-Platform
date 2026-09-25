import React from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Star,
  ShieldCheck,
  Clock,
  Award,
  HeartPulse,
  CalendarCheck,
  PhoneCall,
} from "lucide-react";
import bannerImg from "../../assets/BannerImg.png";
import { bannerStyles } from "../../assets/dummyStyles";

export default function Banner() {
  const features = [
    { text: "Verified Specialist Doctors", icon: Award },
    { text: "24/7 Emergency Support", icon: Clock },
    { text: "Seamless Online Booking", icon: CalendarCheck },
    { text: "100% Quality Healthcare", icon: ShieldCheck },
  ];

  return (
    <div className={bannerStyles.bannerContainer}>
      <div className={bannerStyles.mainContainer}>
        {/* Animated Gradient Border */}
        <div className={bannerStyles.borderOutline}>
          <div className={bannerStyles.outerAnimatedBand} />
          <div className={bannerStyles.innerWhiteBorder} />
        </div>

        <div className={bannerStyles.contentContainer}>
          <div className={bannerStyles.flexContainer}>
            {/* Left Content */}
            <div className={bannerStyles.leftContent}>
              <div className={bannerStyles.headerBadgeContainer}>
                <div className={bannerStyles.stethoscopeContainer}>
                  <div className={bannerStyles.stethoscopeInner}>
                    <Stethoscope className={bannerStyles.stethoscopeIcon} />
                  </div>
                </div>

                <div>
                  <h1 className={bannerStyles.title}>
                    Your Health,{" "}
                    <span className={bannerStyles.titleGradient}>
                      Our Priority
                    </span>
                  </h1>
                  <div className={bannerStyles.starsContainer}>
                    <div className={bannerStyles.starsInner}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={bannerStyles.starIcon} />
                      ))}
                    </div>
                    <span className="ml-2 text-xs font-semibold text-gray-600">
                      4.9 (10,000+ Happy Patients)
                    </span>
                  </div>
                </div>
              </div>

              <p className={bannerStyles.tagline}>
                Experience world-class healthcare with top-tier medical experts.{" "}
                <span className={bannerStyles.taglineHighlight}>
                  Book verified doctor appointments and laboratory diagnostics effortlessly.
                </span>
              </p>

              {/* Features Grid */}
              <div className={bannerStyles.featuresGrid}>
                {features.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className={bannerStyles.featureItem}>
                      <Icon className={bannerStyles.featureIcon} />
                      <span className={bannerStyles.featureText}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className={bannerStyles.ctaButtonsContainer}>
                <Link to="/appointments" className={bannerStyles.bookButton}>
                  <div className={bannerStyles.bookButtonOverlay} />
                  <div className={bannerStyles.bookButtonContent}>
                    <CalendarCheck className={bannerStyles.bookButtonIcon} />
                    <span>Book Appointment</span>
                  </div>
                </Link>

                <a
                  href="tel:+919876543210"
                  className={bannerStyles.emergencyButton}
                >
                  <div className={bannerStyles.emergencyButtonContent}>
                    <PhoneCall className={bannerStyles.emergencyButtonIcon} />
                    <span>Emergency: +91 98765 43210</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className={bannerStyles.rightImageSection}>
              <div className={bannerStyles.imageContainer}>
                <div className={bannerStyles.imageFrame}>
                  <img
                    src={bannerImg}
                    alt="Healthcare Specialists"
                    className={bannerStyles.image}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
