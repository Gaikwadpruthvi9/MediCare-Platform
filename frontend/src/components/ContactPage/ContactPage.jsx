import React, { useState } from "react";
import { Phone, MapPin, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { contactPageStyles } from "../../assets/dummyStyles";

export default function ContactPage() {
  const initial = {
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const departments = [
    "General Physician",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Gynecology",
  ];

  const servicesMapping = {
    "General Physician": [
      "General Consultation",
      "Adult Checkup",
      "Vaccination",
      "Health Screening",
    ],
    Cardiology: [
      "ECG",
      "Echocardiography",
      "Stress Test",
      "Heart Consultation",
    ],
    Orthopedics: ["Fracture Care", "Joint Pain Consultation", "Physiotherapy"],
    Dermatology: ["Skin Consultation", "Allergy Test", "Acne Treatment"],
    Pediatrics: ["Child Checkup", "Vaccination (Child)", "Growth Monitoring"],
    Gynecology: ["Antenatal Care", "Pap Smear", "Ultrasound"],
  };

  const genericServices = [
    "General Consultation",
    "ECG",
    "Blood Test",
    "X-Ray",
    "Ultrasound",
    "Physiotherapy",
    "Vaccination",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Invalid email address";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (form.phone.length < 10) {
      errs.phone = "Phone must be at least 10 digits";
    }
    if (!form.message.trim()) errs.message = "Message is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const text = `*Contact Request*\nName: ${form.name}\nEmail: ${
      form.email
    }\nPhone: ${form.phone}\nDepartment: ${
      form.department || "N/A"
    }\nService: ${form.service || "N/A"}\nMessage: ${form.message}`;

    const url = `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    setForm(initial);
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const availableServices = form.department
    ? servicesMapping[form.department] || []
    : genericServices;

  return (
    <div className={contactPageStyles.pageContainer}>
      <style>{contactPageStyles.animationKeyframes}</style>
      <div className={contactPageStyles.bgAccent1} />
      <div className={contactPageStyles.bgAccent2} />

      <div className={contactPageStyles.gridContainer}>
        {/* Form Container */}
        <div className={contactPageStyles.formContainer}>
          <h2 className={contactPageStyles.formTitle}>Get in Touch</h2>
          <p className={contactPageStyles.formSubtitle}>
            Have inquiries or need help booking an appointment? We're here for you.
          </p>

          <form onSubmit={handleSubmit} className={contactPageStyles.formSpace}>
            <div className={contactPageStyles.formGrid}>
              <div>
                <label className={contactPageStyles.label}>Your Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={contactPageStyles.input}
                />
                {errors.name && (
                  <p className={contactPageStyles.error}>{errors.name}</p>
                )}
              </div>

              <div>
                <label className={contactPageStyles.label}>
                  <Mail size={16} /> Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={contactPageStyles.input}
                />
                {errors.email && (
                  <p className={contactPageStyles.error}>{errors.email}</p>
                )}
              </div>
            </div>

            <div className={contactPageStyles.formGrid}>
              <div>
                <label className={contactPageStyles.label}>
                  <Phone size={16} /> Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={contactPageStyles.input}
                  maxLength="10"
                />
                {errors.phone && (
                  <p className={contactPageStyles.error}>{errors.phone}</p>
                )}
              </div>

              <div>
                <label className={contactPageStyles.label}>
                  <MapPin size={16} /> Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={contactPageStyles.input}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={contactPageStyles.label}>Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className={contactPageStyles.input}
              >
                <option value="">Select Service (Optional)</option>
                {availableServices.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={contactPageStyles.label}>Message</label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we assist you?"
                className={contactPageStyles.textarea}
              />
              {errors.message && (
                <p className={contactPageStyles.error}>{errors.message}</p>
              )}
            </div>

            <div className={contactPageStyles.buttonContainer}>
              <button type="submit" className={contactPageStyles.button}>
                <Send size={18} />
                <span>Send Message</span>
              </button>

              {sent && (
                <span className={contactPageStyles.sentMessage}>
                  <CheckCircle size={16} className="inline mr-1" />
                  Your message was sent successfully!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Hospital Contact Info & Map */}
        <div className={contactPageStyles.infoContainer}>
          <div className={contactPageStyles.infoCard}>
            <h3 className={contactPageStyles.infoTitle}>Hospital Information</h3>
            <p className="text-gray-600 mb-4">
              Visit our central campus or contact our round-the-clock emergency team.
            </p>

            <div className={contactPageStyles.infoItem}>
              <MapPin className="text-emerald-600 flex-shrink-0" size={20} />
              <span>123 Health Ave, Medical City, Lucknow, UP</span>
            </div>

            <div className={contactPageStyles.infoItem}>
              <Phone className="text-emerald-600 flex-shrink-0" size={20} />
              <span>Emergency Hotline: +91 98765 43210</span>
            </div>

            <div className={contactPageStyles.infoItem}>
              <Mail className="text-emerald-600 flex-shrink-0" size={20} />
              <span>care@medicare-platform.com</span>
            </div>
          </div>

          <div className={contactPageStyles.hoursContainer}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-emerald-700" size={20} />
              <h4 className={contactPageStyles.hoursTitle}>Working Hours</h4>
            </div>
            <p className={contactPageStyles.hoursText}>
              • Emergency Services: 24/7, 365 days
            </p>
            <p className={contactPageStyles.hoursText}>
              • OPD Consultations: Monday – Saturday (8:00 AM – 8:00 PM)
            </p>
            <p className={contactPageStyles.hoursText}>
              • Diagnostics & Lab: Monday – Sunday (7:00 AM – 9:00 PM)
            </p>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.460792853461!2d80.98709187529213!3d26.870382662861033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2ae3cea2421%3A0x6c0de12e8a77818f!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1731769000000!5m2!1sen!2sin"
            className={contactPageStyles.map}
            title="Hospital Location Map"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}