import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  Building2,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

function TransferPage() {

  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [toFocused, setToFocused] = useState(false);
  const [amtFocused, setAmtFocused] = useState(false);
  const [pinFocused, setPinFocused] = useState(false);

  const transfer = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      return;
    }

    if (!toAccount || !amount || !pin) {
      alert("Fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await API.post(
        "/payment/make-payment",
        {
          toAccountNumber: toAccount,
          amount: Number(amount),
          pin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setSuccess(true);

      setTimeout(() => {

        setSuccess(false);

        setToAccount("");
        setAmount("");
        setPin("");

      }, 2800);

    } catch (error) {

      const axiosError = error as Error & {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      alert(
        axiosError.response?.data?.message ||
        "Transfer failed"
      );

    } finally {

      setLoading(false);
    }
  };

  const fmtPreview = (v: string) =>
    v
      ? `₹${Number(v).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}`
      : "₹0.00";

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#04060f",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&family=Syne:wght@700;800&display=swap');

        .syne {
          font-family: 'Syne', sans-serif;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);

          background-size: 48px 48px;
        }

        input::placeholder {
          color: #2d3a52 !important;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
        }

        .shimmer-btn::after {
          content:'';
          position:absolute;
          top:0;
          left:-100%;
          width:60%;
          height:100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.12),
            transparent
          );
          animation: shimmer 2.8s infinite;
        }

        @keyframes shimmer {
          0% {
            left:-100%;
          }

          60%,100% {
            left:160%;
          }
        }

        .qa-btn:hover {
          border-color: rgba(0,245,212,0.4) !important;
          color: #00f5d4 !important;
          background: rgba(0,245,212,0.08) !important;
        }
      `}</style>

      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >

        <Navbar />

        <div
          className="grid-bg"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 40px",
            position: "relative",
          }}
        >

          {/* ORBS */}

          <div
            style={{
              position: "fixed",
              top: 80,
              right: 80,
              width: 440,
              height: 440,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(0,245,212,0.07) 0%,transparent 70%)",
              filter: "blur(50px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: "fixed",
              bottom: 60,
              left: 280,
              width: 360,
              height: 360,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(123,97,255,0.08) 0%,transparent 70%)",
              filter: "blur(50px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 860,
              margin: "0 auto",
            }}
          >

            {/* HEADER */}

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: 32 }}
            >

              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#6b7fa8",
                  marginBottom: 6,
                }}
              >
                Banking
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >

                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg,rgba(0,245,212,0.15),rgba(123,97,255,0.15))",
                    border: "1px solid rgba(0,245,212,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(0,245,212,0.1)",
                  }}
                >
                  <ArrowLeftRight
                    size={22}
                    color="#00f5d4"
                    strokeWidth={1.8}
                  />
                </div>

                <div>

                  <h1
                    className="syne"
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    Transfer Money
                  </h1>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#2d3a52",
                      marginTop: 4,
                    }}
                  >
                    Send funds instantly to any account
                  </p>

                </div>
              </div>
            </motion.div>

            {/* CONTENT */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                alignItems: "start",
              }}
            >

              {/* LEFT */}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >

                <div
                  style={{
                    background: "rgba(8,12,28,0.8)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 22,
                    overflow: "hidden",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                  }}
                >

                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(90deg,#00f5d4,#7b61ff,#ff6b6b)",
                    }}
                  />

                  <div style={{ padding: 28 }}>

                    <p
                      className="syne"
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#e2e8f0",
                        marginBottom: 22,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Transfer Details
                    </p>

                    {/* ACCOUNT */}

                    <div style={{ marginBottom: 16 }}>

                      <label
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#2d3a52",
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Recipient Account Number
                      </label>

                      <div
                        onFocus={() => setToFocused(true)}
                        onBlur={() => setToFocused(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: toFocused
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${
                            toFocused
                              ? "rgba(0,245,212,0.45)"
                              : "rgba(255,255,255,0.08)"
                          }`,
                          borderRadius: 14,
                          padding: "0 18px",
                          height: 56,
                          transition: "all 0.25s",
                        }}
                      >

                        <Building2
                          size={16}
                          color={toFocused ? "#00f5d4" : "#2d3a52"}
                        />

                        <input
                          placeholder="e.g. 10002"
                          value={toAccount}
                          onChange={(e) =>
                            setToAccount(e.target.value)
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#e2e8f0",
                            fontSize: 15,
                            fontWeight: 500,
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>

                    {/* AMOUNT */}

                    <div style={{ marginBottom: 16 }}>

                      <label
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#2d3a52",
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Amount (₹)
                      </label>

                      <div
                        onFocus={() => setAmtFocused(true)}
                        onBlur={() => setAmtFocused(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: amtFocused
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${
                            amtFocused
                              ? "rgba(0,245,212,0.45)"
                              : "rgba(255,255,255,0.08)"
                          }`,
                          borderRadius: 14,
                          padding: "0 18px",
                          height: 56,
                          transition: "all 0.25s",
                        }}
                      >

                        <IndianRupee
                          size={16}
                          color={amtFocused ? "#00f5d4" : "#2d3a52"}
                        />

                        <input
                          type="number"
                          placeholder="e.g. 5000"
                          value={amount}
                          onChange={(e) =>
                            setAmount(e.target.value)
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#e2e8f0",
                            fontSize: 15,
                            fontWeight: 500,
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>

                    {/* PIN */}

                    <div style={{ marginBottom: 20 }}>

                      <label
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#2d3a52",
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Transaction PIN
                      </label>

                      <div
                        onFocus={() => setPinFocused(true)}
                        onBlur={() => setPinFocused(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: pinFocused
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${
                            pinFocused
                              ? "rgba(0,245,212,0.45)"
                              : "rgba(255,255,255,0.08)"
                          }`,
                          borderRadius: 14,
                          padding: "0 18px",
                          height: 56,
                          transition: "all 0.25s",
                        }}
                      >

                        <Lock
                          size={16}
                          color={pinFocused ? "#00f5d4" : "#2d3a52"}
                        />

                        <input
                          type="password"
                          placeholder="Enter PIN"
                          value={pin}
                          onChange={(e) =>
                            setPin(e.target.value)
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#e2e8f0",
                            fontSize: 15,
                            fontWeight: 500,
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>

                    {/* QUICK AMOUNTS */}

                    <div style={{ marginBottom: 22 }}>

                      <p
                        style={{
                          fontSize: 11,
                          color: "#1e2a3a",
                          letterSpacing: "0.08em",
                          marginBottom: 10,
                        }}
                      >
                        QUICK SELECT
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >

                        {QUICK_AMOUNTS.map((q) => (

                          <button
                            key={q}
                            className="qa-btn"
                            onClick={() => setAmount(String(q))}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              background:
                                amount === String(q)
                                  ? "rgba(0,245,212,0.1)"
                                  : "rgba(255,255,255,0.03)",
                              border: `1px solid ${
                                amount === String(q)
                                  ? "rgba(0,245,212,0.4)"
                                  : "rgba(255,255,255,0.07)"
                              }`,
                              color:
                                amount === String(q)
                                  ? "#00f5d4"
                                  : "#3d4f6e",
                              cursor: "pointer",
                            }}
                          >
                            ₹{q.toLocaleString("en-IN")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* BUTTON */}

                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.975 }}
                      onClick={transfer}
                      disabled={loading || success}
                      className="shimmer-btn"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        width: "100%",
                        height: 56,
                        borderRadius: 14,
                        border: "none",
                        background: success
                          ? "rgba(0,245,212,0.12)"
                          : loading
                          ? "rgba(255,255,255,0.05)"
                          : "linear-gradient(135deg,#00f5d4 0%,#7b61ff 60%,#ff6b6b 100%)",
                        color: success
                          ? "#00f5d4"
                          : loading
                          ? "#3a4255"
                          : "#04060f",
                        fontWeight: 800,
                        fontSize: 15,
                        cursor:
                          loading || success
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >

                      <AnimatePresence mode="wait">

                        {success ? (

                          <motion.span
                            key="ok"
                            initial={{
                              scale: 0.7,
                              opacity: 0,
                            }}
                            animate={{
                              scale: 1,
                              opacity: 1,
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                            }}
                          >
                            <CheckCircle2 size={18} />
                            Transfer Successful
                          </motion.span>

                        ) : loading ? (

                          <motion.span
                            key="load"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Processing...
                          </motion.span>

                        ) : (

                          <motion.span
                            key="send"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                            }}
                          >
                            Send Money
                            <ArrowRight size={17} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        marginTop: 16,
                      }}
                    >

                      <ShieldCheck
                        size={12}
                        color="#1e2a3a"
                      />

                      <span
                        style={{
                          fontSize: 11,
                          color: "#1e2a3a",
                        }}
                      >
                        256-bit encrypted · Instant settlement
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT SIDE */}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                }}
              >

                <div
                  style={{
                    background: "rgba(8,12,28,0.8)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 22,
                    overflow: "hidden",
                    backdropFilter: "blur(16px)",
                  }}
                >

                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(90deg,#00f5d4,#7b61ff)",
                    }}
                  />

                  <div style={{ padding: 24 }}>

                    <p
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#2d3a52",
                        fontWeight: 600,
                        marginBottom: 18,
                      }}
                    >
                      Transfer Preview
                    </p>

                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >

                      <p
                        style={{
                          fontSize: 11,
                          color: "#2d3a52",
                          marginBottom: 8,
                        }}
                      >
                        AMOUNT
                      </p>

                      <p
                        className="syne"
                        style={{
                          fontSize: 36,
                          fontWeight: 800,
                          color: "#00f5d4",
                        }}
                      >
                        {fmtPreview(amount)}
                      </p>

                      <p
                        style={{
                          marginTop: 18,
                          fontSize: 13,
                          color: "#7b8fa8",
                        }}
                      >
                        Transfer To Account
                      </p>

                      <p
                        style={{
                          marginTop: 6,
                          fontSize: 18,
                          color: "#fff",
                          fontFamily: "monospace",
                        }}
                      >
                        {toAccount || "------"}
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

export default TransferPage;