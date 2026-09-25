const mongoose = require("mongoose");

const serviceAppointmentSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },
    serviceName: { type: String, default: "" },
    serviceImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    patientName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    age: { type: Number, default: null },
    gender: { type: String, default: "" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    fees: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Canceled", "Rescheduled"],
      default: "Pending",
    },
    rescheduledTo: {
      date: { type: String },
      time: { type: String },
    },
    payment: {
      method: { type: String, enum: ["Cash", "Online"], default: "Cash" },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending",
      },
      amount: { type: Number, default: 0 },
      providerId: { type: String, default: "" },
      sessionId: { type: String, default: "" },
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ServiceAppointment",
  serviceAppointmentSchema
);
