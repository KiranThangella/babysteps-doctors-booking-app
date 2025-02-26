import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format, addDays } from "date-fns";
import BookingForm from "./BookingForm";

function SlotView() {
  const { id } = useParams();
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd");
    axios
      .get(`http://localhost:5002/doctors/${id}/slots?date=${formattedDate}`)
      .then((response) => {
        setSlots(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching slots:", error);
        setLoading(false);
      });
  }, [id, date]);

  const handleDateChange = (offset) => {
    setDate(addDays(date, offset));
    setSelectedSlot(null);
  };

  if (loading)
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="mb-0">Available Slots</h2>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleDateChange(-1)}
          >
            Previous Day
          </button>
          <h4>{format(date, "MMMM d, yyyy")}</h4>
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleDateChange(1)}
          >
            Next Day
          </button>
        </div>
        {slots.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {slots.map((slot, index) => (
              <button
                key={index}
                className={`btn ${
                  selectedSlot === slot ? "btn-success" : "btn-outline-primary"
                }`}
                onClick={() => setSelectedSlot(slot)}
                disabled={selectedSlot === slot}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-muted">No slots available for this date.</p>
        )}
        {selectedSlot && (
          <div className="mt-4">
            <BookingForm doctorId={id} date={date} slot={selectedSlot} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SlotView;
