import api from "./api";

// =========================================================
// CREATE BOOKING
// =========================================================

export const createBooking = async (bookingData) => {
  const response = await api.post(
    "/bookings",
    bookingData
  );

  return response.data;
};

// =========================================================
// GET MY BOOKINGS
// =========================================================

export const getMyBookings = async () => {
  const response = await api.get(
    "/bookings/my"
  );

  return response.data;
};

// =========================================================
// GET SINGLE BOOKING
// =========================================================

export const getBookingById = async (bookingId) => {
  const response = await api.get(
    `/bookings/${bookingId}`
  );

  return response.data;
};

// =========================================================
// CANCEL BOOKING
// =========================================================

export const cancelBooking = async (bookingId) => {
  const response = await api.put(
    `/bookings/${bookingId}/cancel`
  );

  return response.data;
};

// =========================================================
// GET BOOKINGS FOR ONE EVENT
// Used to find confirmed booked seats
// =========================================================

export const getEventBookings = async (eventId) => {
  const response = await api.get(
    `/bookings/event/${eventId}`
  );

  return response.data;
};

// =========================================================
// GET ALL BOOKINGS - ADMIN ONLY
// =========================================================

export const getAllBookings = async () => {
  const response = await api.get(
    "/bookings/all"
  );

  return response.data;
};
