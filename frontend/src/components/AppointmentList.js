import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAppointment, setEditAppointment] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5002/appointments")
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/appointments/${id}`);
      setAppointments(appointments.filter((appt) => appt._id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleEditClick = (appointment) => {
    setEditAppointment({ ...appointment });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedAppointment = {
        ...editAppointment,
        date: new Date(editAppointment.date).toISOString(),
      };
      await axios.put(
        `http://localhost:5002/appointments/${editAppointment._id}`,
        updatedAppointment
      );
      setAppointments(
        appointments.map((appt) =>
          appt._id === editAppointment._id
            ? { ...appt, ...updatedAppointment }
            : appt
        )
      );
      setEditAppointment(null); // Close the form after saving
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert(
        "Failed to update appointment: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );

  return (
    <div>
      <h2 className="mb-4">Appointments</h2>
      {appointments.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>
                    <img
                      src={appt.doctorId?.image}
                      alt={appt.doctorId?.name || "Doctor"}
                      className="rounded-circle me-2"
                      style={{ width: "50px", height: "50px" }}
                    />
                    {appt.doctorId?.name || "Unknown"}
                  </td>
                  <td>{appt.patientName}</td>
                  <td>{appt.appointmentType}</td>
                  <td>{format(new Date(appt.date), "MMMM d, yyyy HH:mm")}</td>
                  <td>{appt.duration} min</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditClick(appt)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(appt._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted">No appointments booked yet.</p>
      )}

      {editAppointment && (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">Edit Appointment</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label htmlFor="editDate" className="form-label">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="editDate"
                  value={format(
                    new Date(editAppointment.date),
                    "yyyy-MM-dd'T'HH:mm"
                  )}
                  onChange={(e) =>
                    setEditAppointment({
                      ...editAppointment,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editDuration" className="form-label">
                  Duration (min)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="editDuration"
                  value={editAppointment.duration}
                  onChange={(e) =>
                    setEditAppointment({
                      ...editAppointment,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editType" className="form-label">
                  Type
                </label>
                <select
                  className="form-select"
                  id="editType"
                  value={editAppointment.appointmentType}
                  onChange={(e) =>
                    setEditAppointment({
                      ...editAppointment,
                      appointmentType: e.target.value,
                    })
                  }
                >
                  <option value="Routine Check-Up">Routine Check-Up</option>
                  <option value="Ultrasound">Ultrasound</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="editNotes" className="form-label">
                  Notes
                </label>
                <textarea
                  className="form-control"
                  id="editNotes"
                  value={editAppointment.notes || ""}
                  onChange={(e) =>
                    setEditAppointment({
                      ...editAppointment,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setEditAppointment(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
