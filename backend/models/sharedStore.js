// backend/models/sharedStore.js
// Shared in-memory store for Doctors, Services, and Appointments
// Syncs across all controllers (Admin Panel, Patient Portal, and Doctor Dashboard)

let doctors = [
  {
    _id: "660000000000000000000001",
    name: "Dr. Rahul Sharma",
    email: "rahul@medicare.com",
    speciality: "Cardiologist",
    specialization: "Cardiologist",
    degree: "MBBS, MD",
    qualifications: "MBBS, MD (Cardiology)",
    experience: "10+ years",
    about: "Experienced heart and vascular specialist with a focus on preventative care.",
    fees: 500,
    fee: 500,
    available: true,
    availability: "Available",
    location: "New Delhi",
    address: { line1: "Apollo Medical Center", line2: "New Delhi" },
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
    schedule: {
      "2026-09-26": ["10:00 AM", "11:00 AM", "02:00 PM"],
      "2026-09-27": ["10:30 AM", "01:30 PM", "03:30 PM"],
    },
    success: "98%",
    patients: "5000+",
    rating: 4.9,
  },
  {
    _id: "660000000000000000000002",
    name: "Dr. Priya Patel",
    email: "priya@medicare.com",
    speciality: "Dermatologist",
    specialization: "Dermatologist",
    degree: "MBBS, MD",
    qualifications: "MBBS, MD (Dermatology)",
    experience: "8+ years",
    about: "Expert in clinical dermatology, cosmetic treatments, and pediatric skin care.",
    fees: 600,
    fee: 600,
    available: true,
    availability: "Available",
    location: "Mumbai",
    address: { line1: "Skin Health Clinic", line2: "Mumbai" },
    image: "https://images.unsplash.com/photo-1594824813587-c10444369fef?auto=format&fit=crop&q=80&w=250",
    imageUrl: "https://images.unsplash.com/photo-1594824813587-c10444369fef?auto=format&fit=crop&q=80&w=250",
    schedule: {
      "2026-09-26": ["11:00 AM", "12:00 PM", "04:00 PM"],
      "2026-09-27": ["09:00 AM", "02:00 PM"],
    },
    success: "97%",
    patients: "4200+",
    rating: 4.8,
  },
  {
    _id: "660000000000000000000003",
    name: "Dr. Amit Verma",
    email: "amit@medicare.com",
    speciality: "Orthopedic Surgeon",
    specialization: "Orthopedic Surgeon",
    degree: "MBBS, MS",
    qualifications: "MBBS, MS (Orthopedics)",
    experience: "12+ years",
    about: "Joint replacement and spine reconstruction specialist.",
    fees: 700,
    fee: 700,
    available: true,
    availability: "Available",
    location: "Lucknow",
    address: { line1: "Max Hospital", line2: "Lucknow" },
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250",
    schedule: {
      "2026-09-26": ["09:30 AM", "11:30 AM", "05:00 PM"],
      "2026-09-27": ["10:00 AM", "03:00 PM"],
    },
    success: "99%",
    patients: "6000+",
    rating: 4.9,
  },
  {
    _id: "660000000000000000000004",
    name: "Dr. Sneha Roy",
    email: "sneha@medicare.com",
    speciality: "Pediatrician",
    specialization: "Pediatrician",
    degree: "MBBS, MD",
    qualifications: "MBBS, DCH, MD (Pediatrics)",
    experience: "7+ years",
    about: "Dedicated pediatrician focused on neonatal and early childhood health.",
    fees: 450,
    fee: 450,
    available: true,
    availability: "Available",
    location: "Bangalore",
    address: { line1: "Rainbow Children Hospital", line2: "Bangalore" },
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250",
    schedule: {
      "2026-09-26": ["10:00 AM", "12:30 PM", "03:00 PM"],
      "2026-09-27": ["11:00 AM", "04:00 PM"],
    },
    success: "96%",
    patients: "3500+",
    rating: 4.7,
  },
];

let services = [
  {
    _id: "660000000000000000000201",
    name: "Full Body Health Checkup",
    about: "Comprehensive health analysis covering blood profile, organ function, and vitamin levels.",
    shortDescription: "Complete diagnostic checkup including Blood, Urine, and X-Ray tests.",
    price: 999,
    available: true,
    imageUrl: "",
    dates: ["2026-09-26", "2026-09-27", "2026-09-28"],
    slots: {
      "2026-09-26": ["08:00 AM", "09:30 AM", "11:00 AM"],
      "2026-09-27": ["08:30 AM", "10:00 AM", "12:00 PM"],
    },
    instructions: ["Come empty stomach (10-12 hours fasting required).", "Bring previous reports if any."],
  },
  {
    _id: "660000000000000000000202",
    name: "Heart Care Screening",
    about: "Specialized cardiac screening package including ECG, Lipid Profile, and Cardiologist consultation.",
    shortDescription: "ECG, Lipid Profile, Blood Pressure and Heart Specialist consultation.",
    price: 1499,
    available: true,
    imageUrl: "",
    dates: ["2026-09-26", "2026-09-27"],
    slots: {
      "2026-09-26": ["09:00 AM", "11:00 AM", "04:00 PM"],
    },
    instructions: ["Wear comfortable clothing.", "Do not consume caffeine 4 hours prior."],
  },
  {
    _id: "660000000000000000000203",
    name: "Diabetes Care Package",
    about: "Complete diabetic assessment: HbA1c, Fasting Glucose, Postprandial Blood Sugar, and Kidney function.",
    shortDescription: "HbA1c + Fasting Blood Sugar + Lipid Profile test.",
    price: 599,
    available: true,
    imageUrl: "",
    dates: ["2026-09-26", "2026-09-27", "2026-09-28"],
    slots: {
      "2026-09-26": ["07:30 AM", "08:30 AM", "09:30 AM"],
    },
    instructions: ["Fasting of 8-10 hours is mandatory."],
  },
  {
    _id: "660000000000000000000204",
    name: "Digital X-Ray & Imaging",
    about: "High-precision digital radiography for chest, spine, or limbs with instant radiologist report.",
    shortDescription: "High-definition digital X-Ray imaging with radiologist consultation.",
    price: 799,
    available: true,
    imageUrl: "",
    dates: ["2026-09-26", "2026-09-27", "2026-09-28"],
    slots: {
      "2026-09-26": ["10:00 AM", "11:30 AM", "02:00 PM"],
    },
    instructions: ["Remove all metallic jewelry before scan."],
  },
];

let appointments = [
  {
    _id: "660000000000000000000101",
    userId: "user_1",
    userData: {
      name: "Pruthviraj Gaikwad",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      dob: "2000-01-01",
    },
    docId: "660000000000000000000001",
    docData: {
      name: "Dr. Rahul Sharma",
      speciality: "Cardiologist",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
    },
    slotDate: "2026-09-26",
    slotTime: "10:00 AM",
    amount: 500,
    payment: true,
    cancelled: false,
    isCompleted: false,
  },
];

module.exports = {
  getDoctors: () => doctors,
  addDoctor: (doc) => {
    // Normalization so patient portal gets all fields
    const newDoc = {
      ...doc,
      _id: doc._id || "66" + Math.random().toString(16).slice(2, 24),
      specialization: doc.specialization || doc.speciality || "General Physician",
      speciality: doc.speciality || doc.specialization || "General Physician",
      fee: doc.fee || doc.fees || 500,
      fees: doc.fees || doc.fee || 500,
      experience: doc.experience || "5+ years",
      qualifications: doc.qualifications || doc.degree || "MBBS",
      degree: doc.degree || doc.qualifications || "MBBS",
      available: doc.available ?? true,
      availability: doc.available === false ? "Unavailable" : "Available",
      image: doc.image || doc.imageUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
      imageUrl: doc.imageUrl || doc.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
      schedule: doc.schedule || {
        "2026-09-26": ["10:00 AM", "11:00 AM", "02:00 PM"],
        "2026-09-27": ["10:00 AM", "12:00 PM"],
      },
      success: doc.success || "95%",
      patients: doc.patients || "1000+",
      rating: doc.rating || 4.8,
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
      price: s.price || 500,
      available: true,
      dates: ["2026-09-26", "2026-09-27"],
      slots: { "2026-09-26": ["09:00 AM", "11:00 AM", "03:00 PM"] },
    };
    services.unshift(newService);
    return newService;
  },
  removeService: (id) => {
    services = services.filter((s) => String(s._id) !== String(id));
  },

  getAppointments: () => appointments,
  cancelAppointment: (id) => {
    const a = appointments.find((x) => String(x._id) === String(id));
    if (a) a.cancelled = true;
  },
};
