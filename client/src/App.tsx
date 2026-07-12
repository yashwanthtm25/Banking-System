import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TransferPage from "./pages/TransferPage";
import CardPaymentPage from "./pages/CardPaymentPage";
import TransactionsPage from "./pages/TransactionsPage";
import ResetPINPage from "./pages/ResetPINPage";
import Register from "./pages/Register"; // ✅ add this

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} /> {/* ✅ add this */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/card-payment" element={<CardPaymentPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/reset-pin" element={<ResetPINPage />} />
        </Routes>
    );
}

export default App;