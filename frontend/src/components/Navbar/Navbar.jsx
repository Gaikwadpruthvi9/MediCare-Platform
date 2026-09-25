import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, UserPlus, LogIn, LogOut } from "lucide-react";
import logo from "../../assets/logo.png";
import { navbarStyles } from "../../assets/dummyStyles";

const STORAGE_KEY = "doctorToken_v1";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });

  const location = useLocation();
  const navRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setIsDoctorLoggedIn(Boolean(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsDoctorLoggedIn(false);
    navigate("/");
  };

  return (
    <header
      ref={navRef}
      className={`${navbarStyles.navbarContainer} ${
        showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
      }`}
    >
      <style>{navbarStyles.animationStyles}</style>
      <div className={navbarStyles.navbarBorder} />

      <div className={navbarStyles.contentWrapper}>
        <div className={navbarStyles.flexContainer}>
          {/* Logo Section */}
          <Link to="/" className={navbarStyles.logoLink}>
            <div className={navbarStyles.logoContainer}>
              <div className={navbarStyles.logoImageWrapper}>
                <img
                  src={logo}
                  alt="MediCare"
                  className={navbarStyles.logoImage}
                />
              </div>
            </div>
            <div className={navbarStyles.logoTextContainer}>
              <span className={navbarStyles.logoTitle}>MediCare</span>
              <span className={navbarStyles.logoSubtitle}>Smart Healthcare</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={navbarStyles.desktopNav}>
            <div className={navbarStyles.navItemsContainer}>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`${navbarStyles.navItem} ${
                      isActive
                        ? navbarStyles.navItemActive
                        : navbarStyles.navItemInactive
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className={navbarStyles.rightContainer}>
            {isDoctorLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className={navbarStyles.doctorAdminButton}
                title="Doctor Logout"
              >
                <LogOut className={navbarStyles.doctorAdminIcon} />
                <span className={navbarStyles.doctorAdminText}>Doctor Logout</span>
              </button>
            ) : (
              <Link
                to="/doctor-admin/login"
                className={navbarStyles.doctorAdminButton}
              >
                <UserPlus className={navbarStyles.doctorAdminIcon} />
                <span className={navbarStyles.doctorAdminText}>
                  Doctor Portal
                </span>
              </Link>
            )}

            <Link to="/appointments" className={navbarStyles.loginButton}>
              <LogIn className={navbarStyles.loginIcon} />
              <span>Book Now</span>
            </Link>

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={navbarStyles.mobileToggle}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className={navbarStyles.toggleIcon} />
              ) : (
                <Menu className={navbarStyles.toggleIcon} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className={navbarStyles.mobileMenu}>
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`${navbarStyles.mobileMenuItem} ${
                    isActive
                      ? navbarStyles.mobileMenuItemActive
                      : navbarStyles.mobileMenuItemInactive
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-emerald-100 flex flex-col gap-2">
              <Link
                to="/doctor-admin/login"
                onClick={() => setIsOpen(false)}
                className={navbarStyles.mobileDoctorAdminButton}
              >
                <UserPlus size={16} />
                <span>Doctor Portal</span>
              </Link>
              <Link
                to="/appointments"
                onClick={() => setIsOpen(false)}
                className={navbarStyles.mobileLoginButton}
              >
                <LogIn size={16} />
                <span>Book Appointment</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}