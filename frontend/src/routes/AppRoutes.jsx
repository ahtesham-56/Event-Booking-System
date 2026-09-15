import { Routes, Route } from "react-router-dom";

/* ================= LAYOUTS ================= */

import PublicLayout from "../components/PublicLayout";
import UserLayout from "../components/UserLayout";
import AdminLayout from "../components/AdminLayout";

/* ================= PROTECTION ================= */

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

/* ================= PUBLIC / COMMON PAGES ================= */

import Home from "../pages/Home";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";

/* ================= USER PAGES ================= */

import Dashboard from "../pages/Dashboard";
import BookingPage from "../pages/BookingPage";
import BookingConfirmation from "../pages/BookingConfirmation";
import MyBookings from "../pages/MyBookings";
import UsersSettings from "../pages/UsersSettings";

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

      {/* ==================================================
          PUBLIC PAGES WITH SIDEBAR
      ================================================== */}

      <Route element={<PublicLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

      </Route>


      {/* ==================================================
          AUTHENTICATION PAGES
          NO SIDEBAR
      ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==================================================
          USER PAGES WITH SIDEBAR
      ================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/booking/:id"
          element={<BookingPage />}
        />

        <Route
          path="/booking-confirmation/:id"
          element={<BookingConfirmation />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        <Route
          path="/settings"
          element={<UsersSettings />}
        />

      </Route>


      {/* ==================================================
          ADMIN PAGES WITH ADMIN SIDEBAR
      ================================================== */}

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

        {/* Settings */}

        <Route
          path="settings"
          element={<AdminSetting />}
        />

      </Route>

    </Routes>
  );
}

export default AppRoutes;