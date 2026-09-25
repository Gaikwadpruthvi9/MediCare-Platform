const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const sharedStore = require("../models/sharedStore");

// 1. All Doctors
exports.allDoctors = async (req, res) => {
  try {
    let doctors = [];
    if (Doctor.db.readyState === 1) {
      doctors = await Doctor.find({}).select("-password");
    }
    if (!doctors.length) {
      doctors = sharedStore.getDoctors();
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
    sharedStore.toggleDoctorAvailability(docId);
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
    const added = sharedStore.addDoctor(newDoc);
    return res.status(200).json({ success: true, message: "Doctor Added Successfully", doctor: added });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Remove / Delete Doctor
exports.removeDoctor = async (req, res) => {
  try {
    const docId = req.params.id || req.body.docId || req.body.id;
    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    if (Doctor.db.readyState === 1 && docId.match(/^[0-9a-fA-F]{24}$/)) {
      await Doctor.findByIdAndDelete(docId);
    }
    sharedStore.removeDoctor(docId);

    return res.status(200).json({ success: true, message: "Doctor removed successfully" });
  } catch (err) {
    console.error("removeDoctor error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Admin Appointments List
exports.adminAppointments = async (req, res) => {
  try {
    return res.status(200).json({ success: true, appointments: sharedStore.getAppointments() });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Admin Cancel Appointment
exports.adminCancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    sharedStore.cancelAppointment(appointmentId);
    return res.status(200).json({ success: true, message: "Appointment Cancelled" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Admin Dashboard Data
exports.adminDashboard = async (req, res) => {
  try {
    const docs = sharedStore.getDoctors();
    const appts = sharedStore.getAppointments();
    return res.status(200).json({
      success: true,
      dashData: {
        doctors: docs.length,
        appointments: appts.length,
        patients: 1250,
        earnings: 74500,
        latestAppointments: appts.slice(0, 5),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 8. Doctor Specific Endpoints
exports.doctorAppointments = async (req, res) => {
  return res.status(200).json({ success: true, appointments: sharedStore.getAppointments() });
};

exports.doctorCompleteAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const item = sharedStore.getAppointments().find((a) => a._id === appointmentId);
  if (item) item.isCompleted = true;
  return res.status(200).json({ success: true, message: "Appointment Completed" });
};

exports.doctorCancelAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  sharedStore.cancelAppointment(appointmentId);
  return res.status(200).json({ success: true, message: "Appointment Cancelled" });
};

exports.doctorDashboard = async (req, res) => {
  return res.status(200).json({
    success: true,
    dashData: {
      earnings: 32000,
      appointments: sharedStore.getAppointments().length,
      patients: 64,
      latestAppointments: sharedStore.getAppointments().slice(0, 5),
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
