const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Assuming you have a db.js
const cors = require("cors");
require("dotenv").config();

const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

// Routes
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
