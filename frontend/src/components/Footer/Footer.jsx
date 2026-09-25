import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Phone,
  Mail,
  MapPin,
  Activity,
  Stethoscope,
  ChevronRight,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { footerStyles } from "../../assets/dummyStyles";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Doctors", href: "/doctors" },
  { name: "Services", href: "/services" },
  { name: "Appointments", href: "/appointments" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "General Consultation", href: "/services" },
  { name: "Full Body Checkup", href: "/services" },
  { name: "Blood Pressure Check", href: "/services" },
  { name: "Blood Sugar Test", href: "/services" },
  { name: "X-Ray & Radiology", href: "/services" },
];

const socialLinks = [
  {
    Icon: Facebook,
    color: footerStyles.facebookColor,
    name: "Facebook",
    href: "https://facebook.com",
  },
  {
    Icon: Twitter,
    color: footerStyles.twitterColor,
    name: "Twitter",
    href: "https://twitter.com",
  },
  {
    Icon: Instagram,
    color: footerStyles.instagramColor,
    name: "Instagram",
    href: "https://instagram.com",
  },
  {
    Icon: Linkedin,
    color: footerStyles.linkedinColor,
    name: "LinkedIn",
    href: "https://linkedin.com",
  },
  {
    Icon: Youtube,
    color: footerStyles.youtubeColor,
    name: "YouTube",
    href: "https://youtube.com",
  },
];

export default function Footer() {
  return (
    <footer className={footerStyles.footerContainer}>
      <style>{footerStyles.animationStyles}</style>

      {/* Floating background decorative icons */}
      <div className={footerStyles.floatingIcon1}>
        <Stethoscope className={footerStyles.stethoscopeIcon} />
      </div>
      <div className={footerStyles.floatingIcon2}>
        <Activity className={footerStyles.activityIcon} />
      </div>

      <div className={footerStyles.mainContent}>
        <div className={footerStyles.gridContainer}>
          {/* Company Info */}
          <div className={footerStyles.companySection}>
            <div className={footerStyles.logoContainer}>
              <div className={footerStyles.logoWrapper}>
                <div className={footerStyles.logoImageContainer}>
                  <img
                    src={logo}
                    alt="MediCare Logo"
                    className={footerStyles.logoImage}
                  />
                </div>
              </div>
              <div>
                <h3 className={footerStyles.companyName}>MediCare</h3>
                <p className={footerStyles.companyTagline}>
                  Compassionate & Quality Healthcare
                </p>
              </div>
            </div>
            <p className={footerStyles.companyDescription}>
              Providing world-class medical consultation, comprehensive diagnostic services, and dedicated patient care 24/7.
            </p>

            <div className={footerStyles.contactContainer}>
              <div className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconWrapper}>
                  <MapPin className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>
                  123 Health Ave, Medical District
                </span>
              </div>
              <div className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconWrapper}>
                  <Phone className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>+91 98765 43210</span>
              </div>
              <div className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconWrapper}>
                  <Mail className={footerStyles.contactIcon} />
                </div>
                <span className={footerStyles.contactText}>
                  support@medicare.com
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={footerStyles.linksSection}>
            <h4 className={footerStyles.sectionTitle}>Quick Links</h4>
            <ul className={footerStyles.linksList}>
              {quickLinks.map((link) => (
                <li key={link.name} className={footerStyles.linkItem}>
                  <Link to={link.href} className={footerStyles.quickLink}>
                    <div className={footerStyles.quickLinkIconWrapper}>
                      <ChevronRight className={footerStyles.quickLinkIcon} />
                    </div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={footerStyles.linksSection}>
            <h4 className={footerStyles.sectionTitle}>Medical Services</h4>
            <ul className={footerStyles.linksList}>
              {services.map((item) => (
                <li key={item.name} className={footerStyles.linkItem}>
                  <Link to={item.href} className={footerStyles.serviceLink}>
                    <span className={footerStyles.serviceIcon} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className={footerStyles.newsletterSection}>
            <h4 className={footerStyles.newsletterTitle}>Stay Connected</h4>
            <p className={footerStyles.newsletterDescription}>
              Subscribe for wellness updates, health advisories, and expert medical insights.
            </p>

            <div className={footerStyles.newsletterForm}>
              {/* Mobile newsletter */}
              <div className={footerStyles.mobileNewsletterContainer}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={footerStyles.emailInput}
                />
                <button
                  type="button"
                  className={footerStyles.mobileSubscribeButton}
                >
                  <Send className={footerStyles.mobileButtonIcon} />
                  Subscribe
                </button>
              </div>

              {/* Desktop newsletter */}
              <div className={footerStyles.desktopNewsletterContainer}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={footerStyles.desktopEmailInput}
                />
                <button
                  type="button"
                  className={footerStyles.desktopSubscribeButton}
                >
                  <Send className={footerStyles.desktopButtonIcon} />
                  <span className={footerStyles.desktopButtonText}>
                    Subscribe
                  </span>
                </button>
              </div>

              {/* Social icons */}
              <div className={footerStyles.socialContainer}>
                {socialLinks.map(({ Icon, color, name, href }, index) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerStyles.socialLink}
                    style={{ animationDelay: `${index * 120}ms` }}
                    aria-label={name}
                  >
                    <div className={footerStyles.socialIconBackground} />
                    <Icon className={`${footerStyles.socialIcon} ${color}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={footerStyles.bottomSection}>
          <p className={footerStyles.copyright}>
            &copy; {new Date().getFullYear()} MediCare Platform. All rights reserved.
          </p>
          <p className={footerStyles.designerText}>
            Built with care for accessible healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
}
