function StatCard({
  title,
  value,
  icon,
  description,
}) {
  return (
    <div className="card border-0 shadow-sm h-100">

      <div className="card-body">

        <div className="d-flex justify-content-between align-items-start">

          <div>
            <p className="text-muted mb-1">
              {title}
            </p>

            <h3 className="fw-bold mb-1">
              {value}
            </h3>

            {description && (
              <small className="text-muted">
                {description}
              </small>
            )}
          </div>

          {icon && (
            <div
              className="bg-primary bg-opacity-10 rounded p-3"
              style={{
                fontSize: "24px",
              }}
            >
              {icon}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default StatCard;