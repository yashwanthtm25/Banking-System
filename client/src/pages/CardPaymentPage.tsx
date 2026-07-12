import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, ShieldCheck, Lock, Wallet,
  ArrowRight, Building2, IndianRupee, Nfc, Eye, EyeOff,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

/* ── tiny field wrapper ── */
interface FieldProps {
  label: string;
  icon: React.ReactNode;
  accent?: string;
  children: React.ReactNode;
}
function Field({ label, icon, accent = "#00f5d4", children }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
        color: "#2d3a52", fontWeight: 600, display: "block", marginBottom: 8,
      }}>
        {label}
      </label>
      <div
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: "relative", display: "flex", alignItems: "center", gap: 12,
          background: focused ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? accent + "55" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 14, padding: "0 18px", height: 56,
          transition: "all 0.25s",
          boxShadow: focused ? `0 0 0 3px ${accent}12` : "none",
        }}
      >
        <span style={{ color: focused ? accent : "#2d3a52", flexShrink: 0, transition: "color 0.25s" }}>
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "transparent", border: "none", outline: "none",
  color: "#e2e8f0", fontSize: 14, fontWeight: 500, width: "100%",
  fontFamily: "'DM Sans', sans-serif",
};

function CardPaymentPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [pin, setPin] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [flipped, setFlipped] = useState(false);

  /* format card number display */
  const fmtCard = (v: string) =>
    v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);

  const pay = async () => {
    const token = localStorage.getItem("token");
    if (!cardNumber || !expiryDate || !cvv || !pin || !receiverAccountNumber || !amount) {
      alert("Fill all fields"); return;
    }
    try {
      setLoading(true);
      const res = await API.post(
        "/payment/card-payment",
        { cardNumber, expiryDate, cvv, pin, receiverAccountNumber, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setCardNumber(""); setExpiryDate(""); setCvv("");
      setPin(""); setReceiverAccountNumber(""); setAmount("");
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
        || "Payment failed";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const displayCard = fmtCard(cardNumber) || "•••• •••• •••• ••••";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#04060f", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&family=Syne:wght@700;800&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .card-scene { perspective: 1000px; }
        .card-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .card-inner.flipped { transform: rotateY(180deg); }
        .card-face {
          position: absolute; inset: 0;
          backface-visibility: hidden; -webkit-backface-visibility: hidden;
          border-radius: 20px; overflow: hidden;
        }
        .card-back { transform: rotateY(180deg); }

        .shimmer-btn::after {
          content:''; position:absolute; top:0; left:-100%;
          width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
          animation:shimmer 2.8s infinite;
        }
        @keyframes shimmer { 0%{left:-100%} 60%,100%{left:160%} }
        input::placeholder { color: #2d3a52 !important; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:4px; }
      `}</style>

      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div className="grid-bg" style={{ flex: 1, overflowY: "auto", padding: "32px 40px", position: "relative" }}>

          {/* Ambient orbs */}
          <div style={{ position: "fixed", top: 80, right: 80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,245,212,0.07) 0%,transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: 60, left: 280, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(123,97,255,0.08) 0%,transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>

            {/* Page header */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7fa8", marginBottom: 6 }}>Payments</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(0,245,212,0.15), rgba(123,97,255,0.15))",
                  border: "1px solid rgba(0,245,212,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 20px rgba(0,245,212,0.1)",
                }}>
                  <CreditCard size={22} color="#00f5d4" strokeWidth={1.8} />
                </div>
                <div>
                  <h1 className="syne" style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>Card Payment</h1>
                  <p style={{ fontSize: 13, color: "#2d3a52", marginTop: 4 }}>Secure fintech-grade payment gateway</p>
                </div>
              </div>
            </motion.div>

            {/* Two-col layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

              {/* LEFT — card preview + receiver + amount */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

                {/* ── 3-D card ── */}
                <div
                  className="card-scene"
                  style={{ width: "100%", height: 200, marginBottom: 20, cursor: "pointer" }}
                  onClick={() => setFlipped(f => !f)}
                  title="Click to flip"
                >
                  <div className={`card-inner${flipped ? " flipped" : ""}`}>

                    {/* Front */}
                    <div className="card-face" style={{
                      background: "linear-gradient(135deg, #0d1b35 0%, #1a2550 50%, #2a1060 100%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: 24,
                    }}>
                      <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)" }} />
                      <div style={{ position: "absolute", bottom: -30, left: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,97,255,0.15) 0%, transparent 70%)" }} />
                      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Wallet size={18} color="#fff" strokeWidth={1.8} />
                            </div>
                            <div>
                              <p style={{ fontSize: 10, color: "#4a5568", letterSpacing: "0.08em" }}>NOVA PREMIUM</p>
                              <p style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>Debit Card</p>
                            </div>
                          </div>
                          <Nfc size={20} color="rgba(0,245,212,0.6)" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="syne" style={{ fontSize: 17, letterSpacing: "0.18em", color: "#c4d0e0", fontWeight: 700, marginBottom: 12 }}>
                            {displayCard}
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div>
                              <p style={{ fontSize: 9, color: "#2d3a52", letterSpacing: "0.1em", marginBottom: 2 }}>VALID THRU</p>
                              <p style={{ fontSize: 13, color: "#7b8fa8", fontWeight: 600 }}>{expiryDate || "MM / YY"}</p>
                            </div>
                            <div style={{ display: "flex" }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(220,38,38,0.7)" }} />
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(234,179,8,0.7)", marginLeft: -12 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="card-face card-back" style={{
                      background: "linear-gradient(135deg, #0d1b35 0%, #1a2550 100%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}>
                      <div style={{ width: "100%", height: 44, background: "rgba(0,0,0,0.5)", marginTop: 28 }} />
                      <div style={{ padding: "16px 24px" }}>
                        <p style={{ fontSize: 10, color: "#2d3a52", letterSpacing: "0.1em", marginBottom: 6 }}>CVV</p>
                        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 16px", display: "flex", justifyContent: "flex-end" }}>
                          <p style={{ fontSize: 16, color: "#e2e8f0", letterSpacing: "0.2em", fontWeight: 700 }}>
                            {cvv ? "•".repeat(cvv.length) : "•••"}
                          </p>
                        </div>
                        <p style={{ fontSize: 10, color: "#1e2a3a", marginTop: 12, textAlign: "center" }}>Click card to flip back</p>
                      </div>
                    </div>

                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#1e2a3a", textAlign: "center", marginBottom: 24, letterSpacing: "0.04em" }}>
                  Click card to see back · Updates live as you type
                </p>

                {/* Receiver + Amount */}
                <div style={{
                  background: "rgba(8,12,28,0.75)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: 24, backdropFilter: "blur(12px)",
                }}>
                  <div style={{ height: 2, background: "linear-gradient(90deg,#00f5d4,#7b61ff,#ff6b6b)", borderRadius: 2, marginBottom: 24 }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Field label="Receiver Account Number" icon={<Building2 size={16} strokeWidth={2} />} accent="#7b61ff">
                      <input style={inputStyle} placeholder="e.g. 10002" value={receiverAccountNumber} onChange={e => setReceiverAccountNumber(e.target.value)} />
                    </Field>

                    <Field label="Amount (₹)" icon={<IndianRupee size={16} strokeWidth={2} />} accent="#00f5d4">
                      <input style={inputStyle} type="number" placeholder="e.g. 5000" value={amount} onChange={e => setAmount(e.target.value)} />
                    </Field>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT — card details form */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div style={{
                  background: "rgba(8,12,28,0.75)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: 28, backdropFilter: "blur(12px)",
                }}>
                  {/* accent bar */}
                  <div style={{ height: 2, background: "linear-gradient(90deg,#00f5d4,#7b61ff,#ff6b6b)", borderRadius: 2, marginBottom: 24 }} />

                  <p className="syne" style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 20, letterSpacing: "-0.01em" }}>Card Details</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Card Number */}
                    <Field label="Card Number" icon={<CreditCard size={16} strokeWidth={2} />} accent="#00f5d4">
                      <input
                        style={inputStyle} placeholder="4111 1111 1111 1111"
                        value={fmtCard(cardNumber)}
                        onChange={e => setCardNumber(e.target.value.replace(/\s/g, ""))}
                        maxLength={19}
                      />
                    </Field>

                    {/* Expiry + CVV side by side */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <Field label="Expiry" icon={<Lock size={15} strokeWidth={2} />} accent="#7b61ff">
                        <input style={inputStyle} placeholder="MM/YY" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} maxLength={5} />
                      </Field>

                      <div>
                        <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2d3a52", fontWeight: 600, display: "block", marginBottom: 8 }}>CVV</label>
                        <div
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 14, padding: "0 14px", height: 56,
                          }}
                          onClick={() => setFlipped(true)}
                        >
                          <ShieldCheck size={15} color="#2d3a52" strokeWidth={2} />
                          <input
                            style={{ ...inputStyle, flex: 1 }}
                            type={showCvv ? "text" : "password"}
                            placeholder="•••"
                            value={cvv}
                            onChange={e => setCvv(e.target.value)}
                            maxLength={4}
                          />
                          <button onClick={e => { e.stopPropagation(); setShowCvv(v => !v); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#2d3a52", display: "flex", padding: 0 }}>
                            {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PIN */}
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2d3a52", fontWeight: 600, display: "block", marginBottom: 8 }}>Transaction PIN</label>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 12,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14, padding: "0 18px", height: 56,
                      }}>
                        <Lock size={16} color="#7b61ff" strokeWidth={2} />
                        <input
                          style={{ ...inputStyle, flex: 1 }}
                          type={showPin ? "text" : "password"}
                          placeholder="Enter your PIN"
                          value={pin}
                          onChange={e => setPin(e.target.value)}
                          maxLength={6}
                        />
                        <button onClick={() => setShowPin(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2d3a52", display: "flex", padding: 0 }}>
                          {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />

                    {/* Summary row */}
                    {amount && receiverAccountNumber && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        style={{
                          background: "rgba(0,245,212,0.05)", border: "1px solid rgba(0,245,212,0.15)",
                          borderRadius: 12, padding: "12px 16px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <p style={{ fontSize: 11, color: "#2d3a52", marginBottom: 2 }}>Sending to account</p>
                            <p style={{ fontSize: 13, color: "#7b8fa8", fontWeight: 600 }}>#{receiverAccountNumber}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 11, color: "#2d3a52", marginBottom: 2 }}>Amount</p>
                            <p className="syne" style={{ fontSize: 18, color: "#00f5d4", fontWeight: 800 }}>₹{Number(amount).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Pay button */}
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.975 }}
                      onClick={pay}
                      disabled={loading}
                      className="shimmer-btn"
                      style={{
                        position: "relative", overflow: "hidden",
                        width: "100%", height: 56, borderRadius: 14, border: "none",
                        background: loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #00f5d4 0%, #7b61ff 60%, #ff6b6b 100%)",
                        color: loading ? "#3a4255" : "#04060f",
                        fontWeight: 800, fontSize: 15, letterSpacing: "0.04em",
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        boxShadow: loading ? "none" : "0 8px 28px rgba(0,245,212,0.2)",
                        transition: "box-shadow 0.3s, background 0.3s",
                        fontFamily: "'DM Sans', sans-serif",
                        marginTop: 4,
                      }}
                    >
                      {loading ? (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="#7b61ff" strokeWidth="3" strokeLinecap="round">
                              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                            </path>
                          </svg>
                          Processing…
                        </>
                      ) : (
                        <>Pay Securely <ArrowRight size={17} strokeWidth={2.5} /></>
                      )}
                    </motion.button>

                    {/* Security note */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <ShieldCheck size={12} color="#1e2a3a" strokeWidth={2} />
                      <p style={{ fontSize: 11, color: "#1e2a3a", letterSpacing: "0.03em" }}>
                        256-bit encrypted · End-to-end secure
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPaymentPage;