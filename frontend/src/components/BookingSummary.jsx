function BookingSummary({
  event,
  selectedSeats = [],
  onConfirm,
  loading = false,
}) {
  const ticketPrice = Number(event?.ticketPrice || 0);

  const totalAmount =
    selectedSeats.length * ticketPrice;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">

        <h4 className="mb-4">
          Booking Summary
        </h4>

        <div className="mb-3">
          <small className="text-muted">
            Event
          </small>

          <h5 className="mb-0">
            {event?.title || "Event"}
          </h5>
        </div>

        <div className="mb-3">
          <small className="text-muted">
            Venue
          </small>

          <p className="mb-0">
            📍 {event?.venue || "Venue"}
          </p>
        </div>

        <div className="mb-3">
          <small className="text-muted">
            Selected Seats
          </small>

          <p className="mb-0">
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "No seats selected"}
          </p>
        </div>

        <div className="mb-3">
          <small className="text-muted">
            Tickets
          </small>

          <p className="mb-0">
            {selectedSeats.length}
          </p>
        </div>

        <hr />

        <div className="d-flex justify-content-between mb-3">
          <strong>Total Amount</strong>

          <strong className="text-success">
            ₹{totalAmount}
          </strong>
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={onConfirm}
          disabled={
            loading ||
            selectedSeats.length === 0
          }
        >
          {loading
            ? "Processing..."
            : "Confirm Booking"}
        </button>

      </div>
    </div>
  );
}

export default BookingSummary;