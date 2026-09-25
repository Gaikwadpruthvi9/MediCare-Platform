const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    experience: { type: String, default: "5+ years" },
    qualifications: { type: String, default: "MBBS, MD" },
    location: { type: String, default: "" },
    about: { type: String, default: "" },
    fee: { type: Number, default: 500 },
    availability: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
    available: { type: Boolean, default: true },
    schedule: { type: Map, of: [String], default: {} },
    success: { type: String, default: "98%" },
    patients: { type: String, default: "500+" },
    rating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);