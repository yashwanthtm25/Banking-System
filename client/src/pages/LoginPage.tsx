import { useState } from "react";
import { motion } from "framer-motion";
import type { Easing } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import API from "../services/api";

const FLOAT_EASE: Easing = "easeInOut";

const stats = [
  { value: "256-bit", label: "Encryption" },
  { value: "99.9%",   label: "Uptime"     },
  { value: "2M+",     label: "Users"      },
];

const features = [
  { icon: <Lock size={18} />,  title: "Secure Login",   desc: "Enterprise-grade authentication", accent: "#00f5d4" },
  { icon: <Zap size={18} />,   title: "Instant Access", desc: "Real-time banking experience",    accent: "#7b61ff" },
  { icon: <Globe size={18} />, title: "Global Banking",  desc: "Access anywhere, anytime",        accent: "#ff6b6b" },
];

function LoginPage() {
  const [mobileNumber,  setMobileNumber ] = useState("");
  const [password,      setPassword     ] = useState("");
  const [loading,       setLoading      ] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);
  const [passFocused,   setPassFocused  ] = useState(false);
  const [showPassword,  setShowPassword ] = useState(false);

  const login = async () => {
    if (!mobileNumber || !password) { alert("Fill all fields"); return; }
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { mobileNumber, password });
      localStorage.setItem("token",  res.data.token);
      localStorage.setItem("user",   JSON.stringify(res.data.user));
      localStorage.setItem("pinSet", String(res.data.user.pinSet));
      alert(res.data.message);
      if (!res.data.user.pinSet) {
        window.location.href = "/reset-pin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const focusRing = (active: boolean) => ({
    position:      "absolute" as const,
    inset:         -1,
    borderRadius:  18,
    background:    active ? "linear-gradient(135deg, #00f5d4, #7b61ff)" : "transparent",
    opacity:       active ? 1 : 0,
    transition:    "opacity 0.25s",
    pointerEvents: "none" as const,
  });

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#04060f", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;900&family=Syne:wght@700;800&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer 2.8s infinite;
        }
        @keyframes shimmer  { 0% { left: -100%; } 60%, 100% { left: 160%; } }
        @keyframes float1   { 0%, 100% { transform: translate(0,0); }       50% { transform: translate(40px,-30px);  } }
        @keyframes float2   { 0%, 100% { transform: translate(0,0); }       50% { transform: translate(-40px,35px);  } }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%, 100% { box-shadow: 0 0 6px #00f5d4; } 50% { box-shadow: 0 0 14px #00f5d4; } }
        .input-field::placeholder { color: #2d3a52; }
        ::-webkit-scrollbar { display: none; }
        .register-link {
          color: #00f5d4; background: none; border: none; cursor: pointer;
          font-weight: 700; font-size: 13px; font-family: 'DM Sans', sans-serif;
          padding: 0; transition: opacity 0.2s;
        }
        .register-link:hover { opacity: 0.75; }
      `}</style>

      <div className="grid-bg absolute inset-0 opacity-60" />

      {/* Ambient blobs */}
      <div style={{ position:"absolute", top:"-180px", left:"-80px", width:"560px", height:"560px", borderRadius:"50%", background:"radial-gradient(circle, rgba(0,245,212,0.12) 0%, transparent 70%)", filter:"blur(40px)", animation:"float1 14s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"-200px", right:"-100px", width:"640px", height:"640px", borderRadius:"50%", background:"radial-gradient(circle, rgba(123,97,255,0.14) 0%, transparent 70%)", filter:"blur(50px)", animation:"float2 17s ease-in-out infinite" }} />

      {/* Page layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-20">

        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ opacity:0, x:-50 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:0.9, ease:[0.25,0.46,0.45,0.94] }}
          className="hidden lg:flex flex-col flex-1"
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 w-fit mb-12" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(8px)" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#00f5d4", boxShadow:"0 0 8px #00f5d4", animation:"pulse-dot 2s ease-in-out infinite", display:"inline-block" }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color:"#00f5d4" }}>Premium Digital Banking</span>
          </div>

          {/* Logo */}
          <div className="flex items-center mb-12" style={{ gap: 20 }}>
            <div style={{ width:60, height:60, borderRadius:20, background:"linear-gradient(135deg, #00f5d4 0%, #7b61ff 100%)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 30px rgba(0,245,212,0.3)", flexShrink:0 }}>
              <ShieldCheck size={30} color="#04060f" strokeWidth={2.5} />
            </div>
            <div style={{ paddingLeft: 4 }}>
              <p className="syne" style={{ fontSize:32, fontWeight:800, background:"linear-gradient(90deg, #00f5d4, #7b61ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.1 }}>
                NOVA BANK
              </p>
              <p style={{ color:"#4a5568", fontSize:13, marginTop:6 }}>Next Generation Fintech</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="syne" style={{ fontSize:"clamp(48px, 6vw, 72px)", lineHeight:1, fontWeight:800, color:"#fff", letterSpacing:"-0.04em" }}>
            Banking<br />
            <span style={{ background:"linear-gradient(90deg, #00f5d4, #7b61ff, #ff6b6b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Reimagined.
            </span>
          </h1>

          <p style={{ color:"#5a6478", fontSize:18, marginTop:24, maxWidth:480, lineHeight:1.8 }}>
            Experience enterprise-grade security, seamless transactions, and modern digital banking built for the future.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-10 mt-12">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="syne" style={{ color:"#fff", fontSize:24, fontWeight:700 }}>{s.value}</p>
                <p style={{ color:"#3a4255", fontSize:12, marginTop:4, letterSpacing:"0.08em", textTransform:"uppercase" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-4 mt-12">
            {features.map((f, i) => (
              <motion.div
                key={i}
                animate={{ y:[0,-10,0] }}
                transition={{ duration:4+i, repeat:Infinity, ease:FLOAT_EASE, delay:i*0.4 }}
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, backdropFilter:"blur(16px)" }}
              >
                <div style={{ width:40, height:40, borderRadius:12, background:f.accent+"18", border:`1px solid ${f.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", color:f.accent }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{f.title}</p>
                  <p style={{ color:"#4a5568", fontSize:12, marginTop:3 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── LOGIN CARD ── */}
        <motion.div
          initial={{ opacity:0, y:50 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.9, delay:0.1 }}
          className="w-full"
          style={{ maxWidth:460 }}
        >
          <div style={{ background:"rgba(8,12,28,0.92)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:32, backdropFilter:"blur(40px)", boxShadow:"0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset", overflow:"hidden", position:"relative" }}>

            {/* Top gradient bar */}
            <div style={{ height:3, background:"linear-gradient(90deg, #00f5d4, #7b61ff, #ff6b6b)" }} />

            {/* Inner glow */}
            <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"80%", height:120, background:"radial-gradient(ellipse, rgba(0,245,212,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />

            {/* ── CARD CONTENT ── */}
            <div style={{ padding:"48px 44px 44px" }}>

              {/* Mobile logo */}
              <div className="lg:hidden flex items-center mb-12" style={{ gap:20 }}>
                <div style={{ width:52, height:52, borderRadius:16, background:"linear-gradient(135deg, #00f5d4, #7b61ff)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(0,245,212,0.3)", flexShrink:0 }}>
                  <ShieldCheck size={26} color="#04060f" strokeWidth={2.5} />
                </div>
                <div style={{ paddingLeft:4 }}>
                  <p className="syne font-bold" style={{ fontSize:22, background:"linear-gradient(90deg, #00f5d4, #7b61ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.1 }}>
                    NOVA BANK
                  </p>
                  <p style={{ color:"#3d4f6e", fontSize:12, marginTop:5 }}>Premium Digital Banking</p>
                </div>
              </div>

              {/* Heading */}
              <div style={{ marginBottom:36 }}>
                <h2 className="syne" style={{ fontSize:34, color:"#fff", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
                  Welcome back
                </h2>
                <p style={{ color:"#3d4f6e", fontSize:14, lineHeight:1.7 }}>
                  Sign in to your account to continue
                </p>
              </div>

              {/* Mobile number */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:mobileFocused ? "#00f5d4" : "#3d4f6e", fontWeight:700, display:"block", marginBottom:10, transition:"color 0.2s" }}>
                  Mobile Number
                </label>
                <div onFocus={() => setMobileFocused(true)} onBlur={() => setMobileFocused(false)} style={{ position:"relative" }}>
                  <div style={focusRing(mobileFocused)} />
                  <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:12, background:mobileFocused ? "rgba(0,245,212,0.04)" : "rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"0 18px", height:60, transition:"background 0.2s" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, paddingRight:12, borderRight:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }}>
                      <span style={{ fontSize:16 }}>🇮🇳</span>
                      <span style={{ color:"#4a5568", fontSize:13, fontWeight:600 }}>+91</span>
                    </div>
                    <Smartphone size={15} color={mobileFocused ? "#00f5d4" : "#2d3a52"} style={{ flexShrink:0, transition:"color 0.2s" }} />
                    <input
                      className="input-field"
                      type="tel"
                      placeholder="98765 43210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && login()}
                      style={{ background:"transparent", border:"none", outline:"none", color:"#fff", width:"100%", fontSize:15, fontFamily:"'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:36 }}>
                <label style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:passFocused ? "#00f5d4" : "#3d4f6e", fontWeight:700, display:"block", marginBottom:10, transition:"color 0.2s" }}>
                  Password
                </label>
                <div onFocus={() => setPassFocused(true)} onBlur={() => setPassFocused(false)} style={{ position:"relative" }}>
                  <div style={focusRing(passFocused)} />
                  <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:12, background:passFocused ? "rgba(0,245,212,0.04)" : "rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"0 18px", height:60, transition:"background 0.2s" }}>
                    <Lock size={15} color={passFocused ? "#00f5d4" : "#2d3a52"} style={{ flexShrink:0, transition:"color 0.2s" }} />
                    <input
                      className="input-field"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && login()}
                      style={{ background:"transparent", border:"none", outline:"none", color:"#fff", width:"100%", fontSize:15, fontFamily:"'DM Sans', sans-serif" }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#3d4f6e", display:"flex", alignItems:"center", padding:0, flexShrink:0 }}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale:1.015 }}
                whileTap={{ scale:0.985 }}
                onClick={login}
                disabled={loading}
                className="shimmer-btn"
                style={{ position:"relative", overflow:"hidden", width:"100%", height:60, borderRadius:16, border:"none", background:loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #00f5d4 0%, #7b61ff 55%, #ff6b6b 100%)", color:loading ? "#4a5568" : "#04060f", fontWeight:800, fontSize:15, letterSpacing:"0.02em", cursor:loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:loading ? "none" : "0 8px 32px rgba(0,245,212,0.3), 0 2px 8px rgba(0,0,0,0.4)", transition:"box-shadow 0.2s", fontFamily:"'DM Sans', sans-serif" }}
              >
                {loading ? (
                  <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:"spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  <>Login Securely <ArrowRight size={17} strokeWidth={2.5} /></>
                )}
              </motion.button>

              {/* Divider */}
              <div style={{ height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", margin:"28px 0" }} />

              {/* Register link */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <p style={{ fontSize:13, color:"#2d3a52" }}>Don't have an account?</p>
                <button className="register-link" onClick={() => window.location.href = "/register"}>Create one</button>
              </div>

              {/* Security note */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:16 }}>
                <div style={{ width:20, height:20, borderRadius:6, background:"rgba(0,245,212,0.08)", border:"1px solid rgba(0,245,212,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Lock size={10} color="#00f5d4" />
                </div>
                <p style={{ fontSize:12, color:"#2d3a52" }}>256-bit encrypted · Secure session</p>
              </div>

            </div>
          </div>

          {/* Copyright */}
          <p style={{ textAlign:"center", marginTop:24, color:"#1e2a3a", fontSize:12 }}>
            © 2025 Nova Bank · All rights reserved
          </p>
        </motion.div>

      </div>
    </div>
  );
}

export default LoginPage;