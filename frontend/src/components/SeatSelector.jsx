import { useEffect, useState } from "react";

function SeatSelector({
  totalSeats = 0,
  bookedSeats = [],
  ticketPrice = 0,
  onSelect,
}) {
  const [selectedSeats, setSelectedSeats] =
    useState([]);

  /* =========================================================
     NORMALIZE BOOKED SEATS
     ========================================================= */

  const normalizedBookedSeats =
    Array.isArray(bookedSeats)
      ? bookedSeats.map(Number)
      : [];

  /* =========================================================
     REMOVE SELECTED SEATS IF THEY BECOME BOOKED
     ========================================================= */

  useEffect(() => {
    const availableSelectedSeats =
      selectedSeats.filter(
        (seat) =>
          !normalizedBookedSeats.includes(
            Number(seat)
          )
      );

    if (
      availableSelectedSeats.length !==
      selectedSeats.length
    ) {
      setSelectedSeats(
        availableSelectedSeats
      );

      if (onSelect) {
        onSelect(
          availableSelectedSeats
        );
      }
    }
  }, [bookedSeats]);

  /* =========================================================
     SEAT CLICK
     ========================================================= */

  const handleSeatClick = (
    seatNumber
  ) => {
    if (
      normalizedBookedSeats.includes(
        Number(seatNumber)
      )
    ) {
      return;
    }

    let updatedSeats;

    if (
      selectedSeats.includes(
        seatNumber
      )
    ) {
      updatedSeats =
        selectedSeats.filter(
          (seat) =>
            seat !== seatNumber
        );
    } else {
      updatedSeats = [
        ...selectedSeats,
        seatNumber,
      ];
    }

    setSelectedSeats(
      updatedSeats
    );

    if (onSelect) {
      onSelect(updatedSeats);
    }
  };

  /* =========================================================
     TOTAL PRICE
     ========================================================= */

  const totalAmount =
    selectedSeats.length *
    Number(ticketPrice || 0);

  return (
    <div className="mt-4">

      {/* =====================================================
          TICKET PRICE
          ===================================================== */}

      <div className="alert alert-info">
        <strong>
          Ticket Price:
        </strong>{" "}
        ₹{ticketPrice}
      </div>

      {/* =====================================================
          SEAT SELECTION
          ===================================================== */}

      <h5 className="mb-3">
        Select Your Seats
      </h5>

      <div className="d-flex flex-wrap gap-2">

        {Array.from(
          {
            length: Number(
              totalSeats
            ),
          },
          (_, index) =>
            index + 1
        ).map((seatNumber) => {

          const isBooked =
            normalizedBookedSeats.includes(
              seatNumber
            );

          const isSelected =
            selectedSeats.includes(
              seatNumber
            );

          let buttonClass =
            "btn btn-success";

          if (isBooked) {
            buttonClass =
              "btn btn-secondary";
          } else if (
            isSelected
          ) {
            buttonClass =
              "btn btn-primary";
          }

          return (
            <button
              key={seatNumber}
              type="button"
              className={
                buttonClass
              }
              style={{
                width: "55px",
                height: "45px",
              }}
              disabled={isBooked}
              onClick={() =>
                handleSeatClick(
                  seatNumber
                )
              }
            >
              {seatNumber}
            </button>
          );
        })}

      </div>

      {/* =====================================================
          SELECTED SEATS
          ===================================================== */}

      <div className="mt-4">
        <strong>
          Selected Seats:
        </strong>{" "}

        {selectedSeats.length >
        0
          ? selectedSeats.join(
              ", "
            )
          : "None"}
      </div>

      {/* =====================================================
          TOTAL PRICE
          ===================================================== */}

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