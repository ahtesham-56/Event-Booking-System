import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
    return (
        <>
        <Navbar />

        <main>
        <AppRoutes />
        </main>

        <Footer />
    </>
    );
}

export default App;