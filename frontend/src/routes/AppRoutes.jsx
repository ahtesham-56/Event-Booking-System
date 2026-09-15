import { Routes, Route } from "react-router-dom";

/* ================= USER PAGES ================= */

import Home from "../pages/Home";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import BookingPage from "../pages/BookingPage";
import BookingConfirmation from "../pages/BookingConfirmation";
import MyBookings from "../pages/MyBookings";
import UsersSettings from "../pages/UsersSettings";

/* ================= PROTECTION ================= */

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import AdminLayout from "../components/AdminLayout";

/* ================= ADMIN PAGES ================= */

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageEvents from "../pages/admin/ManageEvents";
import AddEvent from "../pages/admin/AddEvent";
import EditEvent from "../pages/admin/EditEvent";
import ManageBookings from "../pages/admin/ManageBookings";
import Users from "../pages/admin/Users";
import Venues from "../pages/admin/Venues";
import Reports from "../pages/admin/Reports";
import Notifications from "../pages/admin/Notifications";
import AdminSetting from "../pages/admin/AdminSetting";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Home />} />

      <Route
        path="/events"
        element={<Events />}
      />

      <Route
        path="/events/:id"
        element={<EventDetails />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================= USER ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/:id"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking-confirmation/:id"
        element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* USER SETTINGS */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <UsersSettings />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >

        {/* Dashboard */}

        <Route
          index
          element={<AdminDashboard />}
        />

        {/* Events */}

        <Route
          path="events"
          element={<ManageEvents />}
        />

        <Route
          path="events/add"
          element={<AddEvent />}
        />

        <Route
          path="events/edit/:id"
          element={<EditEvent />}
        />

        {/* Bookings */}

        <Route
          path="bookings"
          element={<ManageBookings />}
        />

        {/* Users */}

        <Route
          path="users"
          element={<Users />}
        />

        {/* Venues */}

        <Route
          path="venues"
          element={<Venues />}
        />

        {/* Reports */}

        <Route
          path="reports"
          element={<Reports />}
        />

        {/* Notifications */}

        <Route
          path="notifications"
          element={<Notifications />}
        />

        {/* Admin Settings */}

        <Route
          path="settings"
          element={<AdminSetting />}
        />

      </Route>

    </Routes>
  );
}

export default AppRoutes;