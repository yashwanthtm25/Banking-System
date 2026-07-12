import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  RefreshCw,
  Search,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

interface Transaction {
  paymentMethod: string;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  transactionType: string;
  status: string;
  createdAt: string;
}

function fmtTime(iso: string) {
  const d = new Date(iso);

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtAmount(n: number) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function TransactionsPage() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [tick, setTick] = useState(3);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const currentAccountNumber =
    user?.accountNumber?.toString() || "";

  const fetchTransactions = useCallback(
    async (silent = false) => {

      if (!currentAccountNumber) return;

      try {

        if (!silent) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const token = localStorage.getItem("token");

        const res = await API.get(
          `/transactions/all/${currentAccountNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("TRANSACTIONS:", res.data);

        if (Array.isArray(res.data)) {
          setTransactions(res.data);
        } else if (Array.isArray(res.data.transactions)) {
          setTransactions(res.data.transactions);
        } else {
          setTransactions([]);
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentAccountNumber]
  );

 useEffect(() => {

  const loadTransactions = async () => {
    await fetchTransactions();
  };

  loadTransactions();

  const interval = setInterval(() => {

    const refreshTransactions = async () => {
      await fetchTransactions(true);
    };

    refreshTransactions();

  }, 3000);

  return () => clearInterval(interval);

}, [fetchTransactions]);

  useEffect(() => {

    const timer = setInterval(() => {
      setTick((prev) => (prev <= 1 ? 3 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // SEARCH FILTER
  const filteredTransactions = transactions.filter((t) => {

    const query = search.toLowerCase();

    if (!query) return true;

    return (
      t.senderAccountNumber?.toLowerCase().includes(query) ||
      t.receiverAccountNumber?.toLowerCase().includes(query) ||
      t.paymentMethod?.toLowerCase().includes(query) ||
      t.status?.toLowerCase().includes(query)
    );
  });

  // TOTAL RECEIVED
  const totalReceived = transactions
    .filter(
      (t) =>
        String(t.receiverAccountNumber) ===
        String(currentAccountNumber)
    )
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // TOTAL SPENT
  const totalSpent = transactions
    .filter(
      (t) =>
        String(t.senderAccountNumber) ===
        String(currentAccountNumber)
    )
    .reduce((sum, t) => sum + Number(t.amount), 0);

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

        .tx-row {
          transition: background 0.18s;
          cursor: default;
        }

        .tx-row:hover {
          background: rgba(255,255,255,0.025) !important;
        }

        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
        }

        input::placeholder {
          color: #2d3a52;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .spin {
          animation: spin 1s linear infinite;
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
            padding: "32px 36px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >

            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: 28 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
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
                        "linear-gradient(135deg, rgba(0,245,212,0.15), rgba(123,97,255,0.15))",
                      border: "1px solid rgba(0,245,212,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Wallet size={22} color="#00f5d4" />
                  </div>

                  <div>
                    <h1
                      className="syne"
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      Transactions
                    </h1>

                    <p
                      style={{
                        fontSize: 13,
                        color: "#2d3a52",
                      }}
                    >
                      Account #{currentAccountNumber}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(0,245,212,0.06)",
                    border: "1px solid rgba(0,245,212,0.18)",
                    borderRadius: 20,
                    padding: "6px 14px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#00f5d4",
                      fontWeight: 600,
                    }}
                  >
                    Live · refreshes in {tick}s
                  </span>

                  {refreshing && (
                    <RefreshCw
                      size={12}
                      color="#00f5d4"
                      className="spin"
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* STATS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
                marginBottom: 24,
              }}
            >
              {[
                {
                  label: "Total Transactions",
                  value: transactions.length,
                  color: "#fff",
                },
                {
                  label: "Total Received",
                  value: `₹${fmtAmount(totalReceived)}`,
                  color: "#00f5d4",
                },
                {
                  label: "Total Spent",
                  value: `₹${fmtAmount(totalSpent)}`,
                  color: "#ff6b6b",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(8,12,28,0.75)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 18,
                    padding: "20px 22px",
                  }}
                >
                  <p
                    className="syne"
                    style={{
                      fontSize: 20,
                      color,
                    }}
                  >
                    {value}
                  </p>

                  <p
                    style={{
                      fontSize: 12,
                      color: "#2d3a52",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* SEARCH */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "8px 14px",
                  width: 220,
                }}
              >
                <Search size={13} color="#2d3a52" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#7b8fa8",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* TRANSACTIONS */}
            <div
              style={{
                background: "rgba(8,12,28,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 22,
                overflow: "hidden",
              }}
            >
              {loading ? (

                <div
                  style={{
                    padding: 50,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Loading...
                </div>

              ) : filteredTransactions.length === 0 ? (

                <div
                  style={{
                    padding: 50,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  No Transactions
                </div>

              ) : (

                filteredTransactions.map((t, i) => {

                  const isDebit =
                    String(t.senderAccountNumber) ===
                    String(currentAccountNumber);

                  return (
                    <div
                      key={i}
                      className="tx-row"
                      style={{
                        padding: "18px 24px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.04)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        >
                          {isDebit
                            ? "Money Sent"
                            : "Money Received"}
                        </p>

                        <p
                          style={{
                            color: "#2d3a52",
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          {fmtTime(t.createdAt)}
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <p
                          className="syne"
                          style={{
                            color: isDebit
                              ? "#ff6b6b"
                              : "#00f5d4",
                            fontSize: 18,
                            fontWeight: 800,
                          }}
                        >
                          {isDebit ? "-" : "+"}₹
                          {fmtAmount(t.amount)}
                        </p>

                        <p
                          style={{
                            fontSize: 12,
                            color: "#2d3a52",
                          }}
                        >
                          {isDebit
                            ? `To #${t.receiverAccountNumber}`
                            : `From #${t.senderAccountNumber}`}
                        </p>
                      </div>
                    </div>
                  );
                })

              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;