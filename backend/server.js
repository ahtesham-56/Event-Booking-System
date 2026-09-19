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


// =========================================================
// CORS
// =========================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://event-booking-system-flame-iota.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// =========================================================
// JSON
// =========================================================

app.use(express.json());


// =========================================================
// DATABASE
// =========================================================

connectDB();


// =========================================================
// API ROUTES
// =========================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/users",
  userRoutes
);


// =========================================================
// HOME ROUTE
// =========================================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Event Booking API is running",
  });
});


// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// =========================================================
// ERROR HANDLER
// =========================================================

app.use((err, req, res, next) => {
  console.error(
    "SERVER ERROR:",
    err
  );

  if (
    err.message ===
    "Not allowed by CORS"
  ) {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
});


// =========================================================
// LOCAL DEVELOPMENT
// =========================================================

if (
  process.env.NODE_ENV !==
  "production"
) {
  const PORT =
    process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
}


// =========================================================
// VERCEL
// =========================================================

module.exports = app;

