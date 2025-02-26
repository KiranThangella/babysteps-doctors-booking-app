// routes/doctors.js
const express = require("express");
const router = express.Router();
const { format, parse, addMinutes, isWithinInterval } = require("date-fns");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

router.get("/", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

router.get("/:id/slots", async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const appointments = await Appointment.find({
      doctorId: id,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999),
      },
    });

    const slots = [];
    let currentTime = parse(doctor.workingHours.start, "HH:mm", new Date(date));
    const endTime = parse(doctor.workingHours.end, "HH:mm", new Date(date));

    while (currentTime < endTime) {
      const slotEnd = addMinutes(currentTime, 30);
      const isAvailable = !appointments.some((apt) => {
        const aptStart = new Date(apt.date);
        const aptEnd = addMinutes(aptStart, apt.duration);
        return (
          isWithinInterval(currentTime, { start: aptStart, end: aptEnd }) ||
          isWithinInterval(slotEnd, { start: aptStart, end: aptEnd })
        );
      });

      if (isAvailable) {
        slots.push(format(currentTime, "HH:mm"));
      }
      currentTime = slotEnd;
    }

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// New endpoint: Get appointments and patient details for a specific doctor
router.get("/:id/appointments", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await Appointment.find({ doctorId: req.params.id });
    const patientCount = new Set(appointments.map((appt) => appt.patientName))
      .size; // Unique patients

    res.json({
      doctor: { name: doctor.name, image: doctor.image },
      appointments,
      patientCount,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
