const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// In-memory appointments fallback
let mockAppointments = [
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
  {
    _id: "660000000000000000000102",
    userId: "user_2",
    userData: {
      name: "Ananya Deshmukh",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      dob: "1998-05-15",
    },
    docId: "660000000000000000000002",
    docData: {
      name: "Dr. Priya Patel",
      speciality: "Dermatologist",
      image: "https://images.unsplash.com/photo-1594824813587-c10444369fef?auto=format&fit=crop&q=80&w=250",
    },
    slotDate: "2026-09-26",
    slotTime: "11:00 AM",
    amount: 600,
    payment: false,
    cancelled: false,
    isCompleted: true,
  },
];

// 1. All Doctors
exports.allDoctors = async (req, res) => {
  try {
    let doctors = [];
    if (Doctor.db.readyState === 1) {
      doctors = await Doctor.find({}).select("-password");
    }
    if (!doctors.length) {
      doctors = [
        {
          _id: "660000000000000000000001",
          name: "Dr. Rahul Sharma",
          email: "rahul@medicare.com",
          speciality: "Cardiologist",
          specialization: "Cardiologist",
          degree: "MBBS, MD",
          experience: "10+ Years",
          about: "Experienced cardiologist specializing in cardiovascular interventions.",
          fees: 500,
          fee: 500,
          available: true,
          address: { line1: "Apollo Medical Center", line2: "New Delhi" },
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
        },
        {
          _id: "660000000000000000000002",
          name: "Dr. Priya Patel",
          email: "priya@medicare.com",
          speciality: "Dermatologist",
          specialization: "Dermatologist",
          degree: "MBBS, MD",
          experience: "8+ Years",
          about: "Expert in cosmetic skincare and pediatric dermatology.",
          fees: 600,
          fee: 600,
          available: true,
          address: { line1: "Skin Health Clinic", line2: "Mumbai" },
          image: "https://images.unsplash.com/photo-1594824813587-c10444369fef?auto=format&fit=crop&q=80&w=250",
        },
      ];
    }
    return res.status(200).json({ success: true, doctors });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Change Availability
exports.changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    if (Doctor.db.readyState === 1 && docId) {
      const doc = await Doctor.findById(docId);
      if (doc) {
        doc.available = !doc.available;
        await doc.save();
      }
    }
    return res.status(200).json({ success: true, message: "Availability Changed" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Add Doctor
exports.addDoctor = async (req, res) => {
  try {
    const body = req.body;
    let newDoc = {
      ...body,
      _id: "66" + Math.random().toString(16).slice(2, 24),
      available: true,
      image: body.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
    };
    if (Doctor.db.readyState === 1) {
      newDoc = await Doctor.create(newDoc);
    }
    return res.status(200).json({ success: true, message: "Doctor Added Successfully", doctor: newDoc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Admin Appointments List
exports.adminAppointments = async (req, res) => {
  try {
    return res.status(200).json({ success: true, appointments: mockAppointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Admin Cancel Appointment
exports.adminCancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const item = mockAppointments.find((a) => a._id === appointmentId);
    if (item) {
      item.cancelled = true;
    }
    return res.status(200).json({ success: true, message: "Appointment Cancelled" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Admin Dashboard Data
exports.adminDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      dashData: {
        doctors: 4,
        appointments: mockAppointments.length,
        patients: 1250,
        earnings: 74500,
        latestAppointments: mockAppointments.slice(0, 5),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Doctor Specific Endpoints
exports.doctorAppointments = async (req, res) => {
  return res.status(200).json({ success: true, appointments: mockAppointments });
};

exports.doctorCompleteAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const item = mockAppointments.find((a) => a._id === appointmentId);
  if (item) item.isCompleted = true;
  return res.status(200).json({ success: true, message: "Appointment Completed" });
};

exports.doctorCancelAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const item = mockAppointments.find((a) => a._id === appointmentId);
  if (item) item.cancelled = true;
  return res.status(200).json({ success: true, message: "Appointment Cancelled" });
};

exports.doctorDashboard = async (req, res) => {
  return res.status(200).json({
    success: true,
    dashData: {
      earnings: 32000,
      appointments: mockAppointments.length,
      patients: 64,
      latestAppointments: mockAppointments.slice(0, 5),
    },
  });
};

exports.doctorProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    profileData: {
      name: "Dr. Rahul Sharma",
      degree: "MBBS, MD",
      speciality: "Cardiologist",
      experience: "10+ Years",
      about: "Senior Cardiologist dedicated to patient recovery and heart wellness.",
      fees: 500,
      available: true,
      address: { line1: "Apollo Medical Clinic", line2: "New Delhi" },
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
    },
  });
};

exports.doctorUpdateProfile = async (req, res) => {
  return res.status(200).json({ success: true, message: "Profile Updated" });
};
