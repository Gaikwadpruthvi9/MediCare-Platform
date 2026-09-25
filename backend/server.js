const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const doctorController = require("./controllers/doctorController");
const appointmentController = require("./controllers/appointmentController");
const serviceController = require("./controllers/serviceController");
const serviceAppointmentController = require("./controllers/serviceAppointmentController");
const adminPanelController = require("./controllers/adminPanelController");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware - permissive CORS for both local development and live deployments
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "token",
      "atoken",
      "dtoken",
      "aToken",
      "dToken",
      "X-Requested-With",
    ],
  })
);
app.options("*", cors());
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

// Prescripto Admin Panel Routes
app.all("/api/admin/all-doctors", adminPanelController.allDoctors);
app.post("/api/admin/add-doctor", adminPanelController.addDoctor);
app.post("/api/admin/remove-doctor", adminPanelController.removeDoctor);
app.delete("/api/admin/doctor/:id", adminPanelController.removeDoctor);
app.delete("/api/doctors/:id", doctorController.deleteDoctor);
app.post("/api/admin/change-availablity", adminPanelController.changeAvailability);
app.all("/api/admin/appointments", adminPanelController.adminAppointments);
app.post("/api/admin/cancel-appointment", adminPanelController.adminCancelAppointment);
app.all("/api/admin/dashboard", adminPanelController.adminDashboard);

// Service Delete Routes
app.delete("/api/services/:id", serviceController.deleteService);
app.post("/api/admin/remove-service", serviceController.deleteService);

// Prescripto Doctor Panel Routes
app.all("/api/doctor/appointments", adminPanelController.doctorAppointments);
app.post("/api/doctor/complete-appointment", adminPanelController.doctorCompleteAppointment);
app.post("/api/doctor/cancel-appointment", adminPanelController.doctorCancelAppointment);
app.all("/api/doctor/dashboard", adminPanelController.doctorDashboard);
app.all("/api/doctor/profile", adminPanelController.doctorProfile);
app.post("/api/doctor/update-profile", adminPanelController.doctorUpdateProfile);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`MediCare backend server running on port ${PORT}`);
});

if (Number(PORT) !== 5000 && !process.env.RENDER) {
  try {
    const s5000 = app.listen(5000, "0.0.0.0", () => {
      console.log(`MediCare backend also listening on port 5000`);
    });
    s5000.on("error", () => {});
  } catch (err) {}
}
