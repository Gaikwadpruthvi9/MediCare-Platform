const Appointment = require("../models/Appointment");
const sharedStore = require("../models/sharedStore");

// Get appointments for a specific doctor (real-time only)
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    let list = [];

    if (Appointment.db.readyState === 1 && doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      list = await Appointment.find({ doctorId }).sort({ createdAt: -1 });
    }

    if (!list || list.length === 0) {
      list = sharedStore.getAppointments().filter(
        (a) => String(a.doctorId) === String(doctorId) || String(a.docId) === String(doctorId)
      );
    }

    return res.status(200).json({ success: true, appointments: list });
  } catch (err) {
    console.error("getDoctorAppointments error:", err);
    return res.status(500).json({ success: false, message: err.message, appointments: [] });
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
      list = sharedStore.getAppointments();
    }

    return res.status(200).json({ success: true, appointments: list });
  } catch (err) {
    console.error("getMyAppointments error:", err);
    return res.status(500).json({ success: false, message: err.message, appointments: [] });
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
    created = sharedStore.addAppointment(created);

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

    if (req.body.cancelled) {
      sharedStore.cancelAppointment(id);
    }
    if (req.body.isCompleted) {
      sharedStore.completeAppointment(id);
    }

    return res.status(200).json({ success: true, appointment: updated });
  } catch (err) {
    console.error("updateAppointment error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
