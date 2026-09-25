import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  Users,
  PlusCircle,
  ListPlus,
  LogOut,
  Stethoscope,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  DollarSign,
  Activity,
} from "lucide-react";
import BACKEND_URL from "./config";
import logo from "./assets/logo.png";

export default function App() {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "admin");
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem("profile") || "{}"));

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("aToken");
    localStorage.removeItem("dToken");
    localStorage.removeItem("role");
    localStorage.removeItem("profile");
    setAToken("");
    setDToken("");
    setProfile({});
    toast.info("Logged out successfully");
    navigate("/");
  };

  const isAuthenticated = aToken || dToken;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Header if authenticated */}
      {isAuthenticated && (
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MediCare" className="h-10 w-auto object-contain" />
            <span className="font-bold text-xl text-emerald-700 tracking-tight">MediCare</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
              {role === "admin" ? "Admin Portal" : "Doctor Portal"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">{profile.name || (role === "admin" ? "Administrator" : "Doctor")}</p>
              <p className="text-xs text-slate-400">{profile.email || "Active Session"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-sm font-medium transition cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {isAuthenticated ? (
          <>
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-slate-200 p-4 space-y-1 hidden md:block">
              {role === "admin" ? (
                <>
                  <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                  <NavItem to="/all-appointments" icon={<CalendarDays size={18} />} label="All Appointments" />
                  <NavItem to="/add-doctor" icon={<UserPlus size={18} />} label="Add Doctor" />
                  <NavItem to="/doctor-list" icon={<Users size={18} />} label="Doctor List" />
                  <NavItem to="/add-service" icon={<PlusCircle size={18} />} label="Add Service" />
                  <NavItem to="/list-service" icon={<ListPlus size={18} />} label="List Services" />
                </>
              ) : (
                <>
                  <NavItem to="/doctor-dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                  <NavItem to="/doctor-appointments" icon={<CalendarDays size={18} />} label="My Appointments" />
                </>
              )}
            </aside>

            {/* Page Views */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Navigate to={role === "admin" ? "/admin-dashboard" : "/doctor-dashboard"} replace />} />
                <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                <Route path="/all-appointments" element={<AllAppointmentsPage />} />
                <Route path="/add-doctor" element={<AddDoctorPage />} />
                <Route path="/doctor-list" element={<DoctorListPage />} />
                <Route path="/add-service" element={<AddServicePage />} />
                <Route path="/list-service" element={<ListServicePage />} />

                <Route path="/doctor-dashboard" element={<AdminDashboardPage isDoctor />} />
                <Route path="/doctor-appointments" element={<AllAppointmentsPage isDoctor />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <LoginCard
              setAToken={setAToken}
              setDToken={setDToken}
              setRole={setRole}
              setProfile={setProfile}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-emerald-50 text-emerald-700 font-semibold shadow-xs"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className={active ? "text-emerald-600" : "text-slate-400"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

// ---------------------------------------------------------
// 1. LOGIN CARD (Matches exact design from your screenshot!)
// ---------------------------------------------------------
function LoginCard({ setAToken, setDToken, setRole, setProfile }) {
  const [state, setState] = useState("Admin"); // 'Admin' or 'Doctor'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${BACKEND_URL}/api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          localStorage.setItem("role", "admin");
          localStorage.setItem("profile", JSON.stringify(data.admin || { email, name: "Admin" }));
          setAToken(data.token);
          setRole("admin");
          setProfile(data.admin || { email, name: "Admin" });
          toast.success("Welcome, Administrator!");
        } else {
          toast.error(data.message || "Admin login failed");
        }
      } else {
        const { data } = await axios.post(`${BACKEND_URL}/api/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          localStorage.setItem("role", "doctor");
          localStorage.setItem("profile", JSON.stringify(data.doctor || { email, name: "Doctor" }));
          setDToken(data.token);
          setRole("doctor");
          setProfile(data.doctor || { email, name: "Doctor" });
          toast.success("Welcome, Doctor!");
        } else {
          toast.error(data.message || "Doctor login failed");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="bg-white border border-slate-200 shadow-xl rounded-2xl p-8 max-w-sm w-full mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          <span className="text-indigo-600">{state}</span> Login
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Sign in to access your administrative control panel
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={state === "Admin" ? "admin@medicare.com" : "doctor@example.com"}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-98 transition shadow-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>

      <div className="mt-5 text-center text-xs text-slate-500">
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              onClick={() => {
                setState("Doctor");
                setEmail("");
                setPassword("");
              }}
              className="text-indigo-600 font-semibold cursor-pointer underline hover:text-indigo-800"
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => {
                setState("Admin");
                setEmail("");
                setPassword("");
              }}
              className="text-indigo-600 font-semibold cursor-pointer underline hover:text-indigo-800"
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

// ---------------------------------------------------------
// 2. DASHBOARD PAGE
// ---------------------------------------------------------
function AdminDashboardPage({ isDoctor = false }) {
  const [data, setData] = useState({
    doctors: 0,
    appointments: 0,
    patients: 0,
    earnings: 0,
    latestAppointments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = isDoctor ? `${BACKEND_URL}/api/doctor/dashboard` : `${BACKEND_URL}/api/admin/dashboard`;
    axios
      .get(url)
      .then((res) => {
        if (res.data?.dashData) setData(res.data.dashData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isDoctor]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{isDoctor ? "Doctor Dashboard" : "Hospital Dashboard"}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Earnings" value={`₹ ${data.earnings.toLocaleString()}`} icon={<DollarSign className="text-emerald-600" />} bg="bg-emerald-50" />
        <StatCard title="Appointments" value={data.appointments} icon={<CalendarDays className="text-blue-600" />} bg="bg-blue-50" />
        <StatCard title="Patients Treated" value={data.patients} icon={<Activity className="text-purple-600" />} bg="bg-purple-50" />
        <StatCard title={isDoctor ? "Doctor Status" : "Registered Doctors"} value={isDoctor ? "Active" : data.doctors} icon={isDoctor ? <CheckCircle className="text-emerald-600" /> : <Users className="text-amber-600" />} bg={isDoctor ? "bg-emerald-50" : "bg-amber-50"} />
      </div>

      {/* Latest Bookings */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{isDoctor ? "Your Patient Appointments" : "Latest Patient Bookings"}</h2>
        {(!data.latestAppointments || data.latestAppointments.length === 0) ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-600">No Patient Bookings Yet</p>
            <p className="text-xs text-slate-400 mt-1">Real-time appointments booked on the patient portal will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.latestAppointments.map((appt) => (
              <div key={appt._id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={appt.userData?.image || "https://i.pravatar.cc/100"} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{appt.userData?.name || "Patient"}</p>
                    <p className="text-xs text-slate-400">{appt.slotDate} at {appt.slotTime}</p>
                  </div>
                </div>
                <div>
                  {appt.isCompleted ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">Completed</span>
                  ) : appt.cancelled ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">Cancelled</span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">Confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
    </div>
  );
}

// ---------------------------------------------------------
// 3. ALL APPOINTMENTS PAGE
// ---------------------------------------------------------
function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/admin/appointments`)
      .then((res) => {
        if (res.data?.appointments) setAppointments(res.data.appointments);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await axios.post(`${BACKEND_URL}/api/admin/cancel-appointment`, { appointmentId: id });
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Hospital Appointments</h1>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Fee</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400">
                    <CalendarDays className="mx-auto mb-2 text-slate-300" size={36} />
                    <p className="font-medium text-slate-600">No appointments recorded yet</p>
                    <p className="text-xs text-slate-400 mt-1">Real-time appointments booked by patients will appear here.</p>
                  </td>
                </tr>
              ) : (
                appointments.map((a, idx) => (
                  <tr key={a._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 text-slate-400">{idx + 1}</td>
                    <td className="p-4 font-medium text-slate-800">{a.userData?.name || "Patient"}</td>
                    <td className="p-4 text-slate-600">{a.docData?.name || "Dr. Assigned"}</td>
                    <td className="p-4 text-slate-600">{a.slotDate} — {a.slotTime}</td>
                    <td className="p-4 font-semibold text-slate-700">₹{a.amount}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.payment ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {a.payment ? "Paid Online" : "Pay at Clinic"}
                      </span>
                    </td>
                    <td className="p-4">
                      {a.isCompleted ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">Completed</span>
                      ) : a.cancelled ? (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold">Cancelled</span>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">Active</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {!a.cancelled && !a.isCompleted && (
                        <button
                          onClick={() => handleCancel(a._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Cancel Appointment"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 4. ADD DOCTOR PAGE
// ---------------------------------------------------------
function AddDoctorPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "General Physician",
    degree: "MBBS",
    experience: "5+ Years",
    fees: 500,
    about: "",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/add-doctor`, {
        ...form,
        specialization: form.speciality,
        fee: form.fees,
      });
      if (res.data?.success) {
        toast.success("Doctor added successfully!");
        setForm({
          name: "",
          email: "",
          password: "",
          speciality: "General Physician",
          degree: "MBBS",
          experience: "5+ Years",
          fees: 500,
          about: "",
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
        });
      }
    } catch {
      toast.error("Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xs p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Add New Doctor</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Dr. Full Name"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="doctor@medicare.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Speciality</label>
            <select
              value={form.speciality}
              onChange={(e) => setForm({ ...form, speciality: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option>General Physician</option>
              <option>Cardiologist</option>
              <option>Dermatologist</option>
              <option>Pediatrician</option>
              <option>Neurologist</option>
              <option>Orthopedic Surgeon</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Degree</label>
            <input
              type="text"
              required
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              placeholder="MBBS, MD"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Consultation Fee (₹)</label>
            <input
              type="number"
              required
              value={form.fees}
              onChange={(e) => setForm({ ...form, fees: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">About Doctor</label>
          <textarea
            rows="3"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            placeholder="Clinical background, experience and focus areas..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition shadow-xs cursor-pointer disabled:opacity-50"
        >
          {loading ? "Registering..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------
// 5. DOCTOR LIST PAGE
// ---------------------------------------------------------
function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/admin/all-doctors`)
      .then((res) => {
        if (res.data?.doctors) setDoctors(res.data.doctors);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const toggleAvailability = async (docId) => {
    try {
      await axios.post(`${BACKEND_URL}/api/admin/change-availablity`, { docId });
      toast.success("Availability updated");
      fetchDocs();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleRemoveDoctor = async (docId, docName) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${docName}?`)) {
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/api/admin/remove-doctor`, { docId });
      toast.success(`Dr. ${docName} removed successfully`);
      fetchDocs();
    } catch {
      toast.error("Failed to remove doctor");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Registered Doctors</h1>
          <p className="text-xs text-slate-400 mt-1">Manage active doctors, toggle availability or remove doctor records</p>
        </div>
        <Link
          to="/add-doctor"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-xs"
        >
          <UserPlus size={16} />
          <span>Add New Doctor</span>
        </Link>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
          <Users className="mx-auto mb-3 text-slate-300" size={40} />
          <h3 className="font-semibold text-slate-700 text-base">No Doctors Added Yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">Start populating your hospital staff by adding your first doctor with their specialization and consultation fees.</p>
          <Link
            to="/add-doctor"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
          >
            <UserPlus size={16} />
            <span>Add First Doctor</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <img src={doc.image || "https://i.pravatar.cc/300"} alt="" className="w-full h-44 object-cover bg-slate-100" />
                <div className="p-4 space-y-1.5">
                  <p className="font-bold text-slate-800 text-base">{doc.name}</p>
                  <p className="text-xs text-emerald-700 font-semibold">{doc.speciality || doc.specialization}</p>
                  <p className="text-xs text-slate-500">{doc.degree || "MBBS"} • {doc.experience || "5+ Years"}</p>
                  <p className="text-sm font-bold text-slate-800 pt-1">Fee: ₹{doc.fees || doc.fee}</p>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doc.available ?? true}
                    onChange={() => toggleAvailability(doc._id)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <span>Available</span>
                </label>

                <button
                  onClick={() => handleRemoveDoctor(doc._id, doc.name)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                  title="Remove Doctor"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// 6. ADD SERVICE PAGE
// ---------------------------------------------------------
function AddServicePage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(800);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/services`, { name, price, description });
      toast.success("Service added successfully!");
      setName("");
      setDescription("");
    } catch {
      toast.error("Failed to add service");
    }
  };

  return (
    <div className="max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xs p-6 md:p-8 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Add Clinical / Diagnostic Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Service Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Full Body MRI Scan, CBC Blood Test"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Price (₹)</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about procedure, fasting requirements, preparation..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition shadow-xs cursor-pointer"
        >
          Add Service
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------
// 7. LIST SERVICE PAGE
// ---------------------------------------------------------
function ListServicePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/services`)
      .then((res) => {
        if (res.data?.data) setServices(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleRemoveService = async (serviceId, serviceName) => {
    if (!window.confirm(`Are you sure you want to remove ${serviceName}?`)) {
      return;
    }
    try {
      await axios.delete(`${BACKEND_URL}/api/services/${serviceId}`);
      toast.success(`${serviceName} removed successfully`);
      fetchServices();
    } catch {
      toast.error("Failed to remove service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hospital Medical Services</h1>
          <p className="text-xs text-slate-400 mt-1">Manage diagnostic tests, health packages, and hospital services</p>
        </div>
        <Link
          to="/add-service"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-xs"
        >
          <PlusCircle size={16} />
          <span>Add New Service</span>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
          <Activity className="mx-auto mb-3 text-slate-300" size={40} />
          <h3 className="font-semibold text-slate-700 text-base">No Medical Services Added Yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">Add clinical services, diagnostic packages, or consultation types for patients to book.</p>
          <Link
            to="/add-service"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
          >
            <PlusCircle size={16} />
            <span>Add First Service</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-slate-800 text-base">{s.name}</h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">{s.description || s.about || "Diagnostics & clinical care"}</p>
              </div>

              <div className="pt-4 mt-4 flex items-center justify-between border-t border-slate-100">
                <p className="text-base font-bold text-emerald-700">₹ {s.price}</p>
                <button
                  onClick={() => handleRemoveService(s._id, s.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                  title="Remove Service"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
