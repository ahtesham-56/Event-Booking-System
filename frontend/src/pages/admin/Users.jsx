import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      const data =
        response.data?.users ||
        response.data ||
        [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("USERS ERROR:", error);

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name =
        user.name ||
        user.fullName ||
        "";

      const email =
        user.email ||
        "";

      const role =
        user.role ||
        "user";

      const matchesSearch =
        name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" ||
        role.toLowerCase() ===
          roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) =>
      (user.role || "user").toLowerCase() ===
      "admin"
  ).length;

  const normalUsers = totalUsers - adminUsers;

  const getInitials = (user) => {
    const name =
      user.name ||
      user.fullName ||
      user.email ||
      "User";

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return "—";
    }

    return formatted.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="container-fluid py-4 px-3 px-lg-4">

      {/* HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Users
          </h2>

          <p className="text-muted mb-0">
            Manage EventBook users and account access.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadUsers}
        >
          ↻ Refresh
        </button>

      </div>

      {/* STATS */}

      <div className="row g-3 mb-4">

        <div className="col-12 col-md-4">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between">

                <div>
                  <small className="text-muted">
                    Total Users
                  </small>

                  <h3 className="fw-bold mb-0 mt-1">
                    {totalUsers}
                  </h3>
                </div>

                <div
                  className="rounded-3 bg-primary-subtle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  👥
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-12 col-md-4">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between">

                <div>
                  <small className="text-muted">
                    Regular Users
                  </small>

                  <h3 className="fw-bold mb-0 mt-1">
                    {normalUsers}
                  </h3>
                </div>

                <div
                  className="rounded-3 bg-success-subtle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  👤
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-12 col-md-4">

          <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between">

                <div>
                  <small className="text-muted">
                    Administrators
                  </small>

                  <h3 className="fw-bold mb-0 mt-1">
                    {adminUsers}
                  </h3>
                </div>

                <div
                  className="rounded-3 bg-warning-subtle d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  🛡️
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* USERS CARD */}

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body p-3 p-md-4">

          {/* FILTER */}

          <div className="row g-2 mb-4">

            <div className="col-12 col-md-8">

              <input
                type="search"
                className="form-control"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="col-12 col-md-4">

              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
              >
                <option value="All">
                  All Roles
                </option>

                <option value="user">
                  Users
                </option>

                <option value="admin">
                  Administrators
                </option>
              </select>

            </div>

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              />

              <p className="text-muted mt-3 mb-0">
                Loading users...
              </p>

            </div>
          ) : filteredUsers.length === 0 ? (

            <div className="text-center py-5">

              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "70px",
                  height: "70px",
                  fontSize: "28px",
                }}
              >
                👥
              </div>

              <h5 className="fw-bold">
                No users found
              </h5>

              <p className="text-muted mb-0">
                Try changing your search or filter.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table align-middle mb-0">

                <thead>

                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map(
                    (user, index) => {

                      const role =
                        user.role ||
                        "user";

                      return (
                        <tr
                          key={
                            user._id ||
                            user.id ||
                            index
                          }
                        >

                          <td>

                            <div className="d-flex align-items-center gap-3">

                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{
                                  width: "42px",
                                  height: "42px",
                                }}
                              >
                                {getInitials(user)}
                              </div>

                              <div>

                                <div className="fw-semibold">
                                  {user.name ||
                                    user.fullName ||
                                    "Unnamed User"}
                                </div>

                                <small className="text-muted">
                                  ID:{" "}
                                  {user._id
                                    ? String(
                                        user._id
                                      ).slice(-8)
                                    : "—"}
                                </small>

                              </div>

                            </div>

                          </td>

                          <td className="text-break">
                            {user.email || "—"}
                          </td>

                          <td>

                            <span
                              className={`badge rounded-pill ${
                                role.toLowerCase() ===
                                "admin"
                                  ? "bg-primary"
                                  : "bg-light text-dark"
                              }`}
                            >
                              {role}
                            </span>

                          </td>

                          <td>
                            {formatDate(
                              user.createdAt
                            )}
                          </td>

                          <td>

                            <span className="badge bg-success-subtle text-success rounded-pill">
                              Active
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Users;