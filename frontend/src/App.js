import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DoctorList from "./components/DoctorList";
import SlotView from "./components/SlotView";
import AppointmentList from "./components/AppointmentList";

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <Link className="navbar-brand" to="/">
            Babysteps Booking
          </Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">
              Doctors
            </Link>
            <Link className="nav-link" to="/appointments">
              Appointments
            </Link>
          </div>
        </nav>
        <Routes>
          <Route exact path="/" element={<DoctorList />} />
          <Route path="/doctor/:id/slots" element={<SlotView />} />
          <Route path="/appointments" element={<AppointmentList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
