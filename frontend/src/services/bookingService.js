import api from "./api";

// Create booking
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

// Get user's bookings
export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

// Get all bookings - Admin
export const getAllBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};