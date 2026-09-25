const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const doctorController = require("./controllers/doctorController");
const appointmentController = require("./controllers/appointmentController");
const serviceController = require("./controllers/serviceController");
const serviceAppointmentController = require("./controllers/serviceAppointmentController");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/medicare";

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.warn(
      "MongoDB connection failed or MONGO_URI not provided. Serving mock API data for immediate preview:",
      err.message
    );
  });

// Health check endpoints (used by Render)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "MediCare Platform API",
    version: "1.0.0",
    time: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Doctors & Admin API routes
app.get("/api/doctors", doctorController.getAllDoctors);
app.get("/api/doctors/:id", doctorController.getDoctorById);
app.post("/api/doctors", doctorController.createDoctor);
app.post("/api/doctor/login", doctorController.doctorLogin);
app.post("/api/doctors/login", doctorController.doctorLogin);
app.post("/api/admin/login", doctorController.adminLogin);
app.put("/api/doctors/:id", doctorController.updateDoctor);

// Appointments API routes
app.get("/api/appointments/me", appointmentController.getMyAppointments);
app.get("/api/appointments/doctor/:doctorId", appointmentController.getDoctorAppointments);
app.post("/api/appointments", appointmentController.createAppointment);
app.put("/api/appointments/:id", appointmentController.updateAppointment);

// Services API routes
app.get("/api/services", serviceController.getAllServices);
app.get("/api/services/:id", serviceController.getServiceById);
app.post("/api/services", serviceController.createService);

// Service Appointments API routes
app.get("/api/service-appointments", serviceAppointmentController.getServiceAppointments);
app.post("/api/service-appointments", serviceAppointmentController.createServiceAppointment);
app.put("/api/service-appointments/:id", serviceAppointmentController.updateServiceAppointment);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`MediCare backend server running on port ${PORT}`);
});
