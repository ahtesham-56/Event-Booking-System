import { useState } from "react";

function SeatSelector({
  totalSeats = 0,
  bookedSeats = [],
  ticketPrice = 0,
  onSelect,
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    let updatedSeats;

    if (selectedSeats.includes(seatNumber)) {
      updatedSeats = selectedSeats.filter(
        (seat) => seat !== seatNumber
      );
    } else {
      updatedSeats = [...selectedSeats, seatNumber];
    }

    setSelectedSeats(updatedSeats);

    if (onSelect) {
      onSelect(updatedSeats);
    }
  };

  const totalAmount =
    selectedSeats.length * Number(ticketPrice || 0);

  return (
    <div className="mt-4">
      {/* Ticket Price */}
      <div className="alert alert-info">
        <strong>Ticket Price:</strong> ₹{ticketPrice}
      </div>

      {/* Seat Selection */}
      <h5 className="mb-3">Select Your Seats</h5>

      <div className="d-flex flex-wrap gap-2">
        {Array.from(
          { length: totalSeats },
          (_, index) => index + 1
        ).map((seatNumber) => {
          const isBooked = bookedSeats.includes(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);

          let buttonClass = "btn btn-success";

          if (isBooked) {
            buttonClass = "btn btn-secondary";
          } else if (isSelected) {
            buttonClass = "btn btn-primary";
          }

          return (
            <button
              key={seatNumber}
              type="button"
              className={buttonClass}
              style={{
                width: "55px",
                height: "45px",
              }}
              disabled={isBooked}
              onClick={() => handleSeatClick(seatNumber)}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>

      {/* Selected Seats */}
      <div className="mt-4">
        <strong>Selected Seats:</strong>{" "}
        {selectedSeats.length > 0
          ? selectedSeats.join(", ")
          : "None"}
      </div>

      {/* Total Price */}
      <div className="mt-3">
        <h5>
          Total Amount:{" "}
          <span className="text-success">
            ₹{totalAmount}
          </span>
        </h5>
      </div>
    </div>
  );
}

export default SeatSelector;