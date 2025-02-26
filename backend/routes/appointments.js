const express = require("express");
const router = express.Router();
const {
  addMinutes,
  isWithinInterval,
  startOfDay,
  endOfDay,
} = require("date-fns");
const Appointment = require("../models/Appointment");

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a specific appointment by ID
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "doctorId"
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a new appointment
router.post("/", async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } =
      req.body;

    // Validate required fields
    if (!doctorId || !date || !duration || !appointmentType || !patientName) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const startTime = new Date(date);
    const endTime = addMinutes(startTime, duration);

    // Check for overlapping appointments
    const conflicts = await Appointment.find({
      doctorId,
      date: {
        $gte: startTime,
        $lt: endTime,
      },
    }).lean();

    const hasConflict = conflicts.some((apt) => {
      const aptStart = new Date(apt.date);
      const aptEnd = addMinutes(aptStart, apt.duration);
      return (
        startTime < aptEnd && endTime > aptStart 
      );
    });

    if (hasConflict) {
      return res.status(400).json({ message: "Time slot unavailable" });
    }

    const appointment = new Appointment({
      doctorId,
      date: startTime,
      duration,
      appointmentType,
      patientName,
      notes,
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
});

// Update an existing appointment
router.put("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { doctorId, date, duration, appointmentType, patientName, notes } =
      req.body;

    if (date || duration) {
      const newStartTime = new Date(date || appointment.date);
      const newDuration = duration || appointment.duration;
      const newEndTime = addMinutes(newStartTime, newDuration);

      // Check for overlapping appointments, excluding this one
      const conflicts = await Appointment.find({
        doctorId: doctorId || appointment.doctorId,
        _id: { $ne: req.params.id },
        date: {
          $gte: newStartTime,
          $lt: newEndTime,
        },
      }).lean();

      const hasConflict = conflicts.some((apt) => {
        const aptStart = new Date(apt.date);
        const aptEnd = addMinutes(aptStart, apt.duration);
        return newStartTime < aptEnd && newEndTime > aptStart;
      });

      if (hasConflict) {
        return res.status(400).json({ message: "Time slot unavailable" });
      }
    }

    Object.assign(appointment, req.body);
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
});


// Delete an appointment
router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
