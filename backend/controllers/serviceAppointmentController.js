const ServiceAppointment = require("../models/serviceAppointment");

let mockServiceAppointments = [];

// Get all service appointments
exports.getServiceAppointments = async (req, res) => {
  try {
    let list = [];
    if (ServiceAppointment.db.readyState === 1) {
      list = await ServiceAppointment.find().sort({ createdAt: -1 });
    }

    if (!list || list.length === 0) {
      list = mockServiceAppointments;
    }

    return res.status(200).json({ success: true, appointments: list });
  } catch (err) {
    console.error("getServiceAppointments error:", err);
    return res.status(500).json({ success: false, message: err.message, appointments: [] });
  }
};

// Create new service appointment
exports.createServiceAppointment = async (req, res) => {
  try {
    let created = { ...req.body, _id: "66" + Math.random().toString(16).slice(2, 24) };
    if (ServiceAppointment.db.readyState === 1) {
      created = await ServiceAppointment.create(req.body);
    }
    mockServiceAppointments.unshift(created);
    return res.status(201).json({ success: true, appointment: created });
  } catch (err) {
    console.error("createServiceAppointment error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update service appointment
exports.updateServiceAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    let updated = req.body;
    if (ServiceAppointment.db.readyState === 1 && id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await ServiceAppointment.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    }
    return res.status(200).json({ success: true, appointment: updated });
  } catch (err) {
    console.error("updateServiceAppointment error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
