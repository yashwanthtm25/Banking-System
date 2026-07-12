import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  ScrollText,
  KeyRound,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   icon: <LayoutDashboard size={18} />, path: "/dashboard"   },
  { label: "Transfer",    icon: <ArrowLeftRight  size={18} />, path: "/transfer"    },
  { label: "Card Payment",icon: <CreditCard      size={18} />, path: "/card-payment"},
  { label: "Transactions",icon: <ScrollText      size={18} />, path: "/transactions"},
  { label: "Generate PIN/Reset PIN",   icon: <KeyRound        size={18} />, path: "/reset-pin"   },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div style={{
      width:          240,
      minHeight:      "100vh",
      background:     "rgba(6, 9, 22, 0.95)",
      borderRight:    "1px solid rgba(255,255,255,0.06)",
      display:        "flex",
      flexDirection:  "column",
      padding:        "28px 16px",
      position:       "sticky",
      top:            0,
      height:         "100vh",
      backdropFilter: "blur(20px)",
      flexShrink:     0,
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 36 }}>
        <div style={{
          width:          36,
          height:         36,
          borderRadius:   11,
          background:     "linear-gradient(135deg, #00f5d4, #7b61ff)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          boxShadow:      "0 0 18px rgba(0,245,212,0.3)",
          flexShrink:     0,
        }}>
          <ShieldCheck size={19} color="#04060f" strokeWidth={2.5} />
        </div>

        <div>
          <p style={{
            fontFamily:    "'Syne', sans-serif",
            fontWeight:    800,
            fontSize:      15,
            color:         "#fff",
            letterSpacing: "-0.01em",
            lineHeight:    1,
          }}>
            NOVA BANK
          </p>
          {/* ✅ PREMIUM BANKING — was #2d3a52, now clearly visible */}
          <p style={{ fontSize: 10, color: "#6b7fa8", marginTop: 2, letterSpacing: "0.08em", fontWeight: 600 }}>
            PREMIUM BANKING
          </p>
        </div>
      </div>

      {/* Section label */}
      {/* ✅ MENU — was #1e2a3a, now clearly visible */}
      <p style={{
        fontSize:      10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color:         "#6b7fa8",
        fontWeight:    700,
        padding:       "0 10px",
        marginBottom:  8,
      }}>
        Menu
      </p>

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            12,
                padding:        "11px 12px",
                borderRadius:   12,
                textDecoration: "none",
                background:     active
                  ? "linear-gradient(135deg, rgba(0,245,212,0.12), rgba(123,97,255,0.10))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(0,245,212,0.18)"
                  : "1px solid transparent",
                transition: "all 0.2s",
                position:   "relative",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background   = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor  = "rgba(255,255,255,0.07)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background  = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              {active && (
                <div style={{
                  position:        "absolute",
                  left:            0,
                  top:             "50%",
                  transform:       "translateY(-50%)",
                  width:           3,
                  height:          20,
                  borderRadius:    "0 4px 4px 0",
                  background:      "linear-gradient(180deg, #00f5d4, #7b61ff)",
                }} />
              )}

              <span style={{ color: active ? "#00f5d4" : "#5a6e8a" }}>{item.icon}</span>
              <span style={{
                fontSize:   14,
                fontWeight: active ? 600 : 400,
                color:      active ? "#e2e8f0" : "#7b8fa8",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Logout */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
        <button
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        12,
            padding:    "11px 12px",
            borderRadius: 12,
            background: "none",
            border:     "1px solid transparent",
            cursor:     "pointer",
            width:      "100%",
            transition: "all 0.2s",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background  = "rgba(255,107,107,0.06)";
            e.currentTarget.style.borderColor = "rgba(255,107,107,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = "none";
            e.currentTarget.style.borderColor = "transparent";
          }}
          onClick={() => { localStorage.clear(); window.location.href = "/"; }}
        >
          <LogOut size={17} color="#ff6b6b" strokeWidth={2} />
          <span style={{ fontSize: 14, color: "#ff6b6b", fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;