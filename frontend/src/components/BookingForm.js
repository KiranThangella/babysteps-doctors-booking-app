import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";

function BookingForm({ doctorId, date, slot }) {
  const [patientName, setPatientName] = useState("");
  const [appointmentType, setAppointmentType] = useState("Routine Check-Up");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointmentDate = new Date(
      `${format(date, "yyyy-MM-dd")}T${slot}:00`
    );
    const appointment = {
      doctorId,
      date: appointmentDate,
      duration: 30,
      appointmentType,
      patientName,
      notes,
    };

    try {
      await axios.post("http://localhost:5002/appointments", appointment);
      setMessage("Appointment booked successfully!");
      setPatientName("");
      setNotes("");
    } catch (error) {
      setMessage(
        "Error booking appointment: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="mb-0">Book Slot: {slot}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="patientName" className="form-label">
              Patient Name
            </label>
            <input
              type="text"
              className="form-control"
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="appointmentType" className="form-label">
              Appointment Type
            </label>
            <select
              className="form-select"
              id="appointmentType"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
            >
              <option value="Routine Check-Up">Routine Check-Up</option>
              <option value="Ultrasound">Ultrasound</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              className="form-control"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Book Appointment
          </button>
        </form>
        {message && (
          <div
            className={`alert ${
              message.includes("Error") ? "alert-danger" : "alert-success"
            } mt-3`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingForm;
