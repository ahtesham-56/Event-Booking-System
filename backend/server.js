const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ================= DATABASE =================

connectDB();

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ================= HOME ROUTE =================

app.get("/", (req, res) => {
  res.json({
    message: "Event Booking API is running",
  });
});

// ================= SERVER =================

// Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;