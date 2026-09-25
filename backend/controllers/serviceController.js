const Service = require("../models/Service");

let mockServices = [
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

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    let services = [];
    if (Service.db.readyState === 1) {
      services = await Service.find();
    }
    if (!services || services.length === 0) {
      services = mockServices;
    }
    return res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error("getAllServices error:", err);
    return res.status(500).json({ success: false, message: err.message });
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
      service = mockServices.find((s) => String(s._id) === String(id)) || mockServices[0];
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
    mockServices.unshift(created);
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
    mockServices = mockServices.filter((s) => String(s._id) !== String(serviceId));

    return res.status(200).json({ success: true, message: "Service removed successfully" });
  } catch (err) {
    console.error("deleteService error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};