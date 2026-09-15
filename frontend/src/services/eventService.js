import api from "./api";

// Get all events
export const getEvents = async () => {
  const response = await api.get("/events");
  return response.data.events || response.data;
};

// Get single event
export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

// Add event
export const createEvent = async (eventData) => {
  const response = await api.post("/events", eventData);
  return response.data;
};

// Update event
export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

// Delete event
export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};