const Service = require("../models/Service");
const sharedStore = require("../models/sharedStore");

// Get all services (starts completely empty until added)
exports.getAllServices = async (req, res) => {
  try {
    let services = [];
    if (Service.db.readyState === 1) {
      services = await Service.find();
    }
    if (!services || services.length === 0) {
      services = sharedStore.getServices();
    }
    return res.status(200).json({ success: true, data: services, services });
  } catch (err) {
    console.error("getAllServices error:", err);
    return res.status(500).json({ success: false, message: err.message, data: [], services: [] });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service = null;

    if (Service.db.readyState === 1 && id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    }
    if (!service) {
      service = sharedStore.getServices().find((s) => String(s._id) === String(id)) || null;
    }

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    return res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error("getServiceById error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Create new service
exports.createService = async (req, res) => {
  try {
    let created = { ...req.body, _id: "66" + Math.random().toString(16).slice(2, 24) };
    if (Service.db.readyState === 1) {
      created = await Service.create(req.body);
    }
    created = sharedStore.addService(created);

    return res.status(201).json({ success: true, data: created, message: "Service added successfully" });
  } catch (err) {
    console.error("createService error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id || req.body.serviceId || req.body.id;
    if (!serviceId) {
      return res.status(400).json({ success: false, message: "Service ID is required" });
    }
    if (Service.db.readyState === 1 && serviceId.match(/^[0-9a-fA-F]{24}$/)) {
      await Service.findByIdAndDelete(serviceId);
    }
    sharedStore.removeService(serviceId);

    return res.status(200).json({ success: true, message: "Service removed successfully" });
  } catch (err) {
    console.error("deleteService error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};