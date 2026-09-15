import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        <div className="admin-content-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;