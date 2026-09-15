import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function UserLayout() {
  return (
    <div className="dashboard-layout user-layout">

      <Sidebar role="user" />

      <div className="dashboard-main">

        <Navbar />

        <main className="dashboard-content">
          <Outlet />
        </main>

        <Footer />

      </div>

    </div>
  );
}

export default UserLayout;