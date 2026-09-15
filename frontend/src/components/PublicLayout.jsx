import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function PublicLayout() {
  return (
    <div className="dashboard-layout public-layout">

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

export default PublicLayout;