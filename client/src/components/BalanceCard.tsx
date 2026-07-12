import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  balance: number;
  accountNumber?: string;
  income?: number;
  spent?: number;
}

function fmt(n: number) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Show last 4 digits of account number masked
function maskAccount(accNum: string) {
  if (!accNum) return "•••• •••• ••••";
  return `•••• •••• ${accNum.slice(-4)}`;
}

function BalanceCard({ balance, accountNumber = "", income = 0, spent = 0 }: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ position: "relative", borderRadius: 24, overflow: "hidden" }}
    >
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0a1234 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(0,245,212,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(123,97,255,0.10) 0%, transparent 55%)",
      }} />
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, #00f5d4, #7b61ff, #ff6b6b)",
      }} />
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div style={{ position: "relative", padding: "32px 36px" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{
              fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#3d5a6e", fontWeight: 600, marginBottom: 10,
            }}>
              Available Balance
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 14, color: "#4a7a8a", fontWeight: 500 }}>₹</span>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 42, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.02em", lineHeight: 1,
                filter: visible ? "none" : "blur(10px)",
                transition: "filter 0.3s",
                userSelect: visible ? "auto" : "none",
              }}>
                {/* ✅ Live balance from props */}
                {fmt(balance)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setVisible((v) => !v)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            {visible
              ? <Eye size={16} color="#4a5568" strokeWidth={2} />
              : <EyeOff size={16} color="#4a5568" strokeWidth={2} />}
          </button>
        </div>



        {/* Divider */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          margin: "24px 0",
        }} />

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* ✅ Dynamic masked account number */}
          <div>
            <p style={{ fontSize: 11, color: "#6b7fa8", letterSpacing: "0.1em", marginBottom: 4 }}>
              ACCOUNT NUMBER
            </p>
            <p style={{ fontSize: 14, color: "#c4d0e0", fontWeight: 700, letterSpacing: "0.18em" }}>
              {maskAccount(accountNumber)}
            </p>
          </div>

          {/* ✅ Dynamic income / spent from props */}
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "rgba(0,245,212,0.08)",
                border: "1px solid rgba(0,245,212,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ArrowUpRight size={14} color="#00f5d4" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#6b7fa8", marginBottom: 2, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Income</p>
                <p style={{ fontSize: 14, color: "#00f5d4", fontWeight: 700 }}>₹{fmt(income)}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "rgba(255,107,107,0.08)",
                border: "1px solid rgba(255,107,107,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ArrowDownLeft size={14} color="#ff6b6b" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#6b7fa8", marginBottom: 2, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Spent</p>
                <p style={{ fontSize: 14, color: "#ff6b6b", fontWeight: 700 }}>₹{fmt(spent)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BalanceCard;