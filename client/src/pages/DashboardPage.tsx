import { motion } from "framer-motion";
import {
  ArrowLeftRight, CreditCard, ScrollText, KeyRound, Activity,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BalanceCard from "../components/BalanceCard";
import ActionCard from "../components/ActionCard";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

const actions = [
  { title: "Transfer Money", description: "Send money securely to another account instantly", icon: <ArrowLeftRight size={19} strokeWidth={2} />, accent: "#00f5d4", path: "/transfer" },
  { title: "Card Payment", description: "Pay using your linked debit card", icon: <CreditCard size={19} strokeWidth={2} />, accent: "#7b61ff", path: "/card-payment" },
  { title: "Transactions", description: "View your full transaction history", icon: <ScrollText size={19} strokeWidth={2} />, accent: "#ff6b6b", path: "/transactions" },
  { title: "Generate PIN", description: "Set or update your secure card PIN", icon: <KeyRound size={19} strokeWidth={2} />, accent: "#f59e0b", path: "/generate-pin" },
];

interface Transaction {
  _id: string;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  createdAt: string;
}

function DashboardPage() {
  const navigate = useNavigate();

  const [balance, setBalance]         = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [income, setIncome]           = useState(0);
  const [spent, setSpent]             = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]         = useState(true);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Step 1: get identity from token once
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me", { headers: getAuthHeaders() });
        setAccountNumber(res.data.accountNumber?.toString() || "");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Step 2: fetch balance + transactions whenever accountNumber is ready
  const refreshDashboard = useCallback(async () => {
    if (!accountNumber) return;
    try {
      // Balance from token-protected /account/me
      const accountRes = await API.get("/account/me", { headers: getAuthHeaders() });
      setBalance(Number(accountRes.data.balance) || 0);

      // Transactions for this user
      const txRes = await API.get(`/transactions/all/${accountNumber}`, {
        headers: getAuthHeaders(),
      });
      const data = txRes.data;
      const list: Transaction[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.transactions)
        ? data.transactions
        : [];

      setTransactions(list.slice(0, 5));

      // Compute income (received) and spent (sent) from full list
      const totalIncome = list
        .filter((t) => String(t.receiverAccountNumber) === String(accountNumber))
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalSpent = list
        .filter((t) => String(t.senderAccountNumber) === String(accountNumber))
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setIncome(totalIncome);
      setSpent(totalSpent);
    } catch (err) {
      console.error("Dashboard refresh failed:", err);
    } finally {
      setLoading(false);
    }
  }, [accountNumber]);

  useEffect(() => {
    void (async () => { await refreshDashboard(); })();
  }, [refreshDashboard]);

  // Live refresh every 5s
  useEffect(() => {
    if (!accountNumber) return;
    const interval = setInterval(() => {
      void (async () => { await refreshDashboard(); })();
    }, 5000);
    return () => clearInterval(interval);
  }, [accountNumber, refreshDashboard]);

  return (
    <div style={{ display: "flex", background: "#04060f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&family=Syne:wght@700;800&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div className="grid-bg" style={{ flex: 1, overflowY: "auto", padding: "32px", position: "relative" }}>
          <div style={{ position: "fixed", top: 80, right: 80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,97,255,0.07) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: 60, left: 260, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto" }}>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7fa8", marginBottom: 4, fontWeight: 700 }}>Overview</p>
              <h1 className="syne" style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Welcome 👋</h1>
              <p style={{ color: "#00f5d4", marginTop: 10, fontSize: 14 }}>
                Account Number: <strong>{accountNumber || "Loading..."}</strong>
              </p>
            </motion.div>

            {/* ✅ BalanceCard now receives all live props */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
              <BalanceCard
                balance={balance}
                accountNumber={accountNumber}
                income={income}
                spent={spent}
              />
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} style={{ marginTop: 36 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                {actions.map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}>
                    <ActionCard title={a.title} description={a.description} icon={a.icon} accent={a.accent} onClick={() => navigate(a.path)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ marginTop: 36 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7fa8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12}}>
                Recent Transactions
              </p>
              <div style={{ background: "rgba(8, 12, 28, 0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)" }}>
                {loading ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#2d3a52", fontSize: 14 }}>Loading...</div>
                ) : transactions.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#2d3a52", fontSize: 14 }}>No transactions yet</div>
                ) : (
                  transactions.map((tx, i) => {
                    const isDebit = String(tx.senderAccountNumber) === String(accountNumber);
                    return (
                      <div key={tx._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: i < transactions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 11, background: isDebit ? "#ff6b6b12" : "#00f5d412", border: `1px solid ${isDebit ? "#ff6b6b20" : "#00f5d420"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Activity size={16} color={isDebit ? "#ff6b6b" : "#00f5d4"} strokeWidth={2} />
                          </div>
                          <div>
                            <p style={{ fontSize: 14, color: "#c4d0e0", fontWeight: 600 }}>{isDebit ? "Money Sent" : "Money Received"}</p>
                            <p style={{ fontSize: 12, color: "#2d3a52" }}>
                              {new Date(tx.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: isDebit ? "#ff6b6b" : "#00f5d4" }}>
                            {isDebit ? "-" : "+"}₹{Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p style={{ fontSize: 11, color: "#2d3a52", marginTop: 2 }}>
                            {isDebit ? `To #${tx.receiverAccountNumber}` : `From #${tx.senderAccountNumber}`}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;