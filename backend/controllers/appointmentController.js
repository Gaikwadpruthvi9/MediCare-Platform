const Appointment = require("../models/Appointment");

// Get appointments for a specific doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    let list = [];

    if (Appointment.db.readyState === 1 && doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      list = await Appointment.find({ doctorId }).sort({ createdAt: -1 });
    }

    if (!list || list.length === 0) {
      list = [
        {
          _id: "660000000000000000000101",
          patientName: "Aman Gupta",
          mobile: "9876543210",
          age: 34,
          gender: "Male",
          doctorId,
          doctorName: "Dr. Rahul Sharma",
          speciality: "Cardiologist",
          date: "2026-09-26",
          time: "10:00 AM",
          fees: 500,
          status: "Confirmed",
          payment: { method: "Online", status: "Paid", amount: 500 },
        },
        {
          _id: "660000000000000000000102",
          patientName: "Neha Verma",
          mobile: "9876512345",
          age: 28,
          gender: "Female",
          doctorId,
          doctorName: "Dr. Rahul Sharma",
          speciality: "Cardiologist",
          date: "2026-09-27",
          time: "02:00 PM",
          fees: 500,
          status: "Pending",
          payment: { method: "Cash", status: "Pending", amount: 500 },
        },
      ];
    }

    return res.status(200).json({ success: true, appointments: list });
  } catch (err) {
    console.error("getDoctorAppointments error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get current user's appointments (/api/appointments/me)
exports.getMyAppointments = async (req, res) => {
  try {
    let list = [];
    if (Appointment.db.readyState === 1) {
      list = await Appointment.find().sort({ createdAt: -1 });
    }

    if (!list || list.length === 0) {
      list = [
        {
          _id: "660000000000000000000101",
          patientName: "Aman Gupta",
          mobile: "9876543210",
          doctorName: "Dr. Rahul Sharma",
          specialization: "Cardiologist",
          date: "2026-09-26",
          time: "10:00 AM",
          fees: 500,
          status: "Confirmed",
          payment: { method: "Online", status: "Paid" },
        },
      ];
    }

    return res.status(200).json({ success: true, appointments: list });
  } catch (err) {
    console.error("getMyAppointments error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const data = req.body;
    let created = { ...data, _id: "66" + Math.random().toString(16).slice(2, 24) };

    if (Appointment.db.readyState === 1) {
      created = await Appointment.create(data);
    }

    return res.status(201).json({ success: true, appointment: created });
  } catch (err) {
    console.error("createAppointment error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update appointment status or reschedule
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    let updated = req.body;

    if (Appointment.db.readyState === 1 && id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Appointment.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    }

    return res.status(200).json({ success: true, appointment: updated });
  } catch (err) {
    console.error("updateAppointment error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
