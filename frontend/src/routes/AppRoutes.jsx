import { Routes, Route } from "react-router-dom";

/* =========================================================
   LAYOUTS
   ========================================================= */

import PublicLayout from "../components/PublicLayout";
import UserLayout from "../components/UserLayout";
import AdminLayout from "../components/AdminLayout";

/* =========================================================
   ROUTE PROTECTION
   ========================================================= */

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

/* =========================================================
   PUBLIC / COMMON PAGES
   ========================================================= */

import Home from "../pages/Home";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";

/* =========================================================
   PASSWORD / AUTHENTICATION PAGES
   ========================================================= */

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

/* =========================================================
   USER PAGES
   ========================================================= */

import Dashboard from "../pages/Dashboard";
import BookingPage from "../pages/BookingPage";
import BookingConfirmation from "../pages/BookingConfirmation";
import MyBookings from "../pages/MyBookings";
import Profile from "../pages/Profile";
import ProfileSetting from "../pages/ProfileSetting";
import UsersSettings from "../pages/UsersSettings";

/* =========================================================
   ADMIN PAGES
   ========================================================= */

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

      {/* =====================================================
          PUBLIC PAGES
          ===================================================== */}

      <Route element={<PublicLayout />}>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Events */}
        <Route
          path="/events"
          element={<Events />}
        />

        {/* Event Details */}
        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

      </Route>


      {/* =====================================================
          AUTHENTICATION PAGES
          NO SIDEBAR
          ===================================================== */}

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Reset Password */}
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />


      {/* =====================================================
          USER PAGES
          PROTECTED + USER SIDEBAR
          ===================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >

        {/* ---------------------------------------------------
            USER DASHBOARD
            --------------------------------------------------- */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ---------------------------------------------------
            BOOKING
            --------------------------------------------------- */}

        <Route
          path="/booking/:id"
          element={<BookingPage />}
        />


        {/* ---------------------------------------------------
            BOOKING CONFIRMATION
            --------------------------------------------------- */}

        <Route
          path="/booking-confirmation/:id"
          element={<BookingConfirmation />}
        />


        {/* ---------------------------------------------------
            MY BOOKINGS
            --------------------------------------------------- */}

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />


        {/* ---------------------------------------------------
            USER PROFILE
            --------------------------------------------------- */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* ---------------------------------------------------
            PROFILE SETTINGS
            Personal information + password
            --------------------------------------------------- */}

        <Route
          path="/profile-settings"
          element={<ProfileSetting />}
        />


        {/* ---------------------------------------------------
            GENERAL USER SETTINGS
            --------------------------------------------------- */}

        <Route
          path="/settings"
          element={<UsersSettings />}
        />

      </Route>


      {/* =====================================================
          ADMIN PAGES
          ADMIN ONLY + ADMIN SIDEBAR
          ===================================================== */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >

        {/* ---------------------------------------------------
            ADMIN DASHBOARD
            /admin
            --------------------------------------------------- */}

        <Route
          index
          element={<AdminDashboard />}
        />


        {/* ---------------------------------------------------
            EVENT MANAGEMENT
            --------------------------------------------------- */}

        <Route
          path="events"
          element={<ManageEvents />}
        />

        {/* Add Event */}
        <Route
          path="events/add"
          element={<AddEvent />}
        />

        {/* Edit Event */}
        <Route
          path="events/edit/:id"
          element={<EditEvent />}
        />


        {/* ---------------------------------------------------
            BOOKING MANAGEMENT
            --------------------------------------------------- */}

        <Route
          path="bookings"
          element={<ManageBookings />}
        />


        {/* ---------------------------------------------------
            USER MANAGEMENT
            --------------------------------------------------- */}

        <Route
          path="users"
          element={<Users />}
        />


        {/* ---------------------------------------------------
            VENUE MANAGEMENT
            --------------------------------------------------- */}

        <Route
          path="venues"
          element={<Venues />}
        />


        {/* ---------------------------------------------------
            REPORTS & ANALYTICS
            --------------------------------------------------- */}

        <Route
          path="reports"
          element={<Reports />}
        />


        {/* ---------------------------------------------------
            NOTIFICATIONS
            --------------------------------------------------- */}

        <Route
          path="notifications"
          element={<Notifications />}
        />


        {/* ---------------------------------------------------
            ADMIN SETTINGS
            --------------------------------------------------- */}

        <Route
          path="settings"
          element={<AdminSetting />}
        />

      </Route>

    </Routes>
  );
}

export default AppRoutes;