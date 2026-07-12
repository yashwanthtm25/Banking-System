import { Bell, Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const [name, setName] = useState("");
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const holderName: string = res.data.accountHolderName || "";
        setName(holderName);
        // Build initials from first letters of each word
        const parts = holderName.trim().split(" ").filter(Boolean);
        setInitials(
          parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : holderName[0]?.toUpperCase() || "U"
        );
      } catch (err) {
        console.error("Navbar: failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div
      style={{
        background: "rgba(8, 12, 28, 0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        padding: "0 32px",
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: "8px 16px",
          width: 260,
        }}
      >
        <Search size={15} color="#3d4f6e" strokeWidth={2} />
        <input
          placeholder="Search transactions..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#7b8fa8",
            fontSize: 13,
            width: "100%",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Notification */}
        <button
          style={{
            position: "relative",
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bell size={16} color="#3d4f6e" strokeWidth={2} />
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#00f5d4",
              boxShadow: "0 0 6px #00f5d4",
            }}
          />
        </button>

        {/* Avatar + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "linear-gradient(135deg, #00f5d4, #7b61ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              color: "#04060f",
              fontFamily: "'Syne', sans-serif",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              {/* ✅ Shows actual name from token */}
              Hey, {name || "..."}
            </span>
            <span style={{ color: "#6b7fa8", fontSize: 11, fontWeight: 500 }}>Personal Account</span>
          </div>
          <ChevronDown size={14} color="#6b7fa8" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;