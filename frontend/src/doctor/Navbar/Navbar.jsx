import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Home, Calendar, Edit, LogOut, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import { navbarStylesDr } from "../../assets/dummyStyles";

const STORAGE_KEY = "doctorToken_v1";

export default function DoctorNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const doctorId = useMemo(() => {
    if (params?.id) return params.id;
    const m = location.pathname.match(/\/doctor-admin\/([^/]+)/);
    if (m) return m[1];
    return null;
  }, [params, location.pathname]);

  const basePath = doctorId
    ? `/doctor-admin/${doctorId}`
    : "/doctor-admin/login";

  const navItems = [
    { name: "Dashboard", to: `${basePath}`, Icon: Home },
    { name: "Appointments", to: `${basePath}/appointments`, Icon: Calendar },
    { name: "Edit Profile", to: `${basePath}/profile/edit`, Icon: Edit },
  ];

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate("/doctor-admin/login");
  };

  return (
    <>
      <nav className={navbarStylesDr.navContainer}>
        {/* Left Brand Section */}
        <Link to="/" className={navbarStylesDr.leftBrand}>
          <div className={navbarStylesDr.logoContainer}>
            <img
              src={logo}
              alt="MediCare"
              className={navbarStylesDr.logoImage}
            />
          </div>
          <div className={navbarStylesDr.brandTextContainer}>
            <span className={navbarStylesDr.brandTitle}>MediCare</span>
            <span className={navbarStylesDr.brandSubtitle}>Doctor Portal</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className={navbarStylesDr.desktopMenu}>
          <div className={navbarStylesDr.desktopMenuItems}>
            {navItems.map(({ name, to, Icon }) => {
              const isActive =
                name === "Dashboard"
                  ? location.pathname === to
                  : location.pathname.startsWith(to);

              return (
                <Link
                  key={name}
                  to={to}
                  className={`${navbarStylesDr.baseLink} ${
                    isActive
                      ? navbarStylesDr.activeLink
                      : navbarStylesDr.inactiveLink
                  }`}
                >
                  <div className={navbarStylesDr.linkContent}>
                    <Icon className={navbarStylesDr.linkIcon} size={16} />
                    <span className={navbarStylesDr.linkText}>{name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Actions */}
        <div className={navbarStylesDr.rightActions}>
          <button
            type="button"
            onClick={handleLogout}
            className={navbarStylesDr.logoutButtonDesktop}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={navbarStylesDr.hamburgerButtonMd}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet Menu */}
      <div className={navbarStylesDr.mobileMenuContainer(isOpen)}>
        <div className={navbarStylesDr.mobileMenuContent}>
          {navItems.map(({ name, to, Icon }) => {
            const isActive =
              name === "Dashboard"
                ? location.pathname === to
                : location.pathname.startsWith(to);

            return (
              <Link
                key={name}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`${navbarStylesDr.mobileBaseLink} ${
                  isActive
                    ? navbarStylesDr.mobileActiveLink
                    : navbarStylesDr.mobileInactiveLink
                }`}
              >
                <Icon size={18} />
                <span>{name}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className={navbarStylesDr.mobileLogoutButton}
          >
            <div className={navbarStylesDr.mobileLogoutContent}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      <div className={navbarStylesDr.spacer} />
    </>
  );
}