// backend/models/sharedStore.js
// Clean In-Memory Store for real-time Doctors, Services, and Appointments

let doctors = [];
let services = [];
let appointments = [];

module.exports = {
  getDoctors: () => doctors,
  addDoctor: (doc) => {
    const newDoc = {
      ...doc,
      _id: doc._id || "66" + Math.random().toString(16).slice(2, 24),
      name: doc.name || "Doctor",
      specialization: doc.specialization || doc.speciality || "General Physician",
      speciality: doc.speciality || doc.specialization || "General Physician",
      fee: Number(doc.fee || doc.fees || 500),
      fees: Number(doc.fees || doc.fee || 500),
      experience: doc.experience || "5+ years",
      qualifications: doc.qualifications || doc.degree || "MBBS",
      degree: doc.degree || doc.qualifications || "MBBS",
      available: doc.available ?? true,
      availability: doc.available === false ? "Unavailable" : "Available",
      about: doc.about || "",
      location: doc.location || "Hospital Clinic",
      address: doc.address || { line1: "MediCare Clinic", line2: "" },
      image: doc.image || doc.imageUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
      imageUrl: doc.imageUrl || doc.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
      schedule: doc.schedule || {
        "2026-09-26": ["10:00 AM", "11:00 AM", "02:00 PM"],
        "2026-09-27": ["10:00 AM", "12:00 PM", "04:00 PM"],
      },
      success: doc.success || "98%",
      patients: doc.patients || "0+",
      rating: doc.rating || 5.0,
    };
    doctors.unshift(newDoc);
    return newDoc;
  },
  removeDoctor: (id) => {
    doctors = doctors.filter((d) => String(d._id) !== String(id));
  },
  toggleDoctorAvailability: (id) => {
    const doc = doctors.find((d) => String(d._id) === String(id));
    if (doc) {
      doc.available = !doc.available;
      doc.availability = doc.available ? "Available" : "Unavailable";
    }
  },

  getServices: () => services,
  addService: (s) => {
    const newService = {
      ...s,
      _id: s._id || "66" + Math.random().toString(16).slice(2, 24),
      name: s.name,
      price: Number(s.price || 500),
      description: s.description || s.about || "",
      about: s.about || s.description || "",
      available: true,
      imageUrl: s.imageUrl || s.image || "",
      dates: s.dates || ["2026-09-26", "2026-09-27"],
      slots: s.slots || { "2026-09-26": ["09:00 AM", "11:00 AM", "03:00 PM"] },
      instructions: s.instructions || ["Fasting required for blood tests if applicable."],
    };
    services.unshift(newService);
    return newService;
  },
  removeService: (id) => {
    services = services.filter((s) => String(s._id) !== String(id));
  },

  getAppointments: () => appointments,
  addAppointment: (appt) => {
    const created = {
      ...appt,
      _id: appt._id || "66" + Math.random().toString(16).slice(2, 24),
      createdAt: new Date().toISOString(),
      cancelled: false,
      isCompleted: false,
      amount: Number(appt.amount || appt.fees || 500),
    };
    appointments.unshift(created);
    return created;
  },
  cancelAppointment: (id) => {
    const a = appointments.find((x) => String(x._id) === String(id));
    if (a) a.cancelled = true;
  },
  completeAppointment: (id) => {
    const a = appointments.find((x) => String(x._id) === String(id));
    if (a) a.isCompleted = true;
  },

  // Live dynamic stats calculated strictly from real data
  getDashboardStats: () => {
    const totalEarnings = appointments
      .filter((a) => a.isCompleted)
      .reduce((sum, a) => sum + (Number(a.amount) || Number(a.fees) || 0), 0);

    const uniquePatients = new Set(
      appointments.map((a) => a.userId || a.patientName || a.userData?.name || a._id)
    ).size;

    return {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: uniquePatients,
      earnings: totalEarnings,
      latestAppointments: appointments.slice(0, 5),
    };
  },
};
