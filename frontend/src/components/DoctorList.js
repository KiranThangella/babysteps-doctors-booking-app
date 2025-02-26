import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editAppointment, setEditAppointment] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5002/doctors")
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      });
  }, []);

  const fetchDoctorAppointments = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5002/doctors/${id}/appointments`
      );
      setSelectedDoctor(response.data);
      setSelectedPatient(null);
      setEditAppointment(null);
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
    }
  };

  const handlePatientClick = (patientName) => {
    const patientAppointments = selectedDoctor.appointments.filter(
      (appt) => appt.patientName === patientName
    );
    setSelectedPatient({
      name: patientName,
      appointments: patientAppointments,
    });
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
      const updatedAppointments = selectedDoctor.appointments.map((appt) =>
        appt._id === editAppointment._id
          ? { ...appt, ...updatedAppointment }
          : appt
      );
      setSelectedDoctor({
        ...selectedDoctor,
        appointments: updatedAppointments,
      });
      setSelectedPatient({
        ...selectedPatient,
        appointments: selectedPatient.appointments.map((appt) =>
          appt._id === editAppointment._id
            ? { ...appt, ...updatedAppointment }
            : appt
        ),
      });
      setEditAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
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
      <h2 className="mb-4">Select a Doctor</h2>
      <div className="row">
        {doctors.map((doctor) => (
          <div className="col-md-4 mb-3" key={doctor._id}>
            <div className="card" style={{ height: "250px" }}>
              {" "}
              {/* Fixed height */}
              <div className="card-body d-flex">
                <img
                  src={doctor.image || "https://via.placeholder.com/200"}
                  alt={doctor.name}
                  className="img-fluid me-3"
                  style={{ height: "100%", width: "100px", objectFit: "cover" }}
                />
                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold fs-5 mb-1">
                      {doctor.name}
                    </h5>
                    <p className="card-text fw-bold fs-6 text-muted">
                      {doctor.specialization || "General"}
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/doctor/${doctor._id}/slots`}
                      className="btn btn-primary"
                      style={{ flex: "1" }}
                    >
                      View Slots
                    </Link>
                    <button
                      className="btn btn-info fs-0.1"
                      data-bs-toggle="modal"
                      data-bs-target="#appointmentsModal"
                      onClick={() => fetchDoctorAppointments(doctor._id)}
                      style={{ flex: "1" }}
                    >
                      View Appointments
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Appointments (unchanged) */}
      <div
        className="modal fade"
        id="appointmentsModal"
        tabIndex="-1"
        aria-labelledby="appointmentsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="appointmentsModalLabel">
                {selectedDoctor
                  ? `${selectedDoctor.doctor.name}'s Appointments`
                  : "Loading..."}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedDoctor && (
                <>
                  <h6>Patient List</h6>
                  <ul className="list-group mb-3">
                    {[
                      ...new Set(
                        selectedDoctor.appointments.map(
                          (appt) => appt.patientName
                        )
                      ),
                    ].map((patientName) => (
                      <li
                        key={patientName}
                        className="list-group-item list-group-item-action"
                        onClick={() => handlePatientClick(patientName)}
                        style={{ cursor: "pointer" }}
                      >
                        {patientName}
                      </li>
                    ))}
                  </ul>

                  {selectedPatient && (
                    <div>
                      <h6>{selectedPatient.name}'s Appointments</h6>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Date & Time</th>
                              <th>Duration</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPatient.appointments.map((appt) => (
                              <tr key={appt._id}>
                                <td>{appt.appointmentType}</td>
                                <td>
                                  {format(
                                    new Date(appt.date),
                                    "MMMM d, yyyy HH:mm"
                                  )}
                                </td>
                                <td>{appt.duration} min</td>
                                <td>
                                  <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => handleEditClick(appt)}
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {editAppointment && (
                    <div className="mt-3">
                      <h6>Edit Appointment</h6>
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
                            <option value="Routine Check-Up">
                              Routine Check-Up
                            </option>
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
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorList;
