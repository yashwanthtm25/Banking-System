import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Easing } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Zap,
  Globe,
} from "lucide-react";
import axios from "axios";

const FLOAT_EASE: Easing = "easeInOut";
const API_BASE = "http://localhost:5000/api";

const stats = [
  { value: "256-bit", label: "Encryption" },
  { value: "99.9%",   label: "Uptime"     },
  { value: "2M+",     label: "Users"      },
];

const features = [
  { icon: <ShieldCheck size={18} />, title: "Safe & Secure",    desc: "Bank-grade account protection",   accent: "#00f5d4" },
  { icon: <Zap size={18} />,         title: "Instant Setup",    desc: "Get started in under a minute",   accent: "#7b61ff" },
  { icon: <Globe size={18} />,       title: "Global Banking",   desc: "Access anywhere, anytime",        accent: "#ff6b6b" },
];

function Register() {
  const [step, setStep] = useState<"mobile" | "password">("mobile");

  const [mobileNumber,      setMobileNumber     ] = useState("");
  const [checkingMobile,    setCheckingMobile   ] = useState(false);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [mobileError,       setMobileError      ] = useState("");
  const [mobileFocused,     setMobileFocused    ] = useState(false);

  const [password,        setPassword       ] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword   ] = useState(false);
  const [showConfirm,     setShowConfirm    ] = useState(false);
  const [passFocused,     setPassFocused    ] = useState(false);
  const [confirmFocused,  setConfirmFocused ] = useState(false);
  const [loading,         setLoading        ] = useState(false);

  const mobileRef = useRef<HTMLInputElement>(null);

  const focusRing = (active: boolean) => ({
    position:      "absolute" as const,
    inset:         -1,
    borderRadius:  18,
    background:    active ? "linear-gradient(135deg, #00f5d4, #7b61ff)" : "transparent",
    opacity:       active ? 1 : 0,
    transition:    "opacity 0.25s",
    pointerEvents: "none" as const,
  });

  const handleCheckMobile = async () => {
    setMobileError("");
    if (!mobileNumber) { setMobileError("Enter your mobile number"); return; }
    if (!/^\d{10}$/.test(mobileNumber)) { setMobileError("Enter a valid 10-digit mobile number"); return; }
    try {
      setCheckingMobile(true);
      const res = await axios.post(`${API_BASE}/auth/check-mobile`, { mobileNumber });
      setAccountHolderName(res.data.accountHolderName);
      setTimeout(() => setStep("password"), 600);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMobileError(err.response?.data?.message || "Verification failed");
      } else {
        setMobileError("Verification failed");
      }
    } finally {
      setCheckingMobile(false);
    }
  };

  const handleSubmit = async () => {
    if (!password || !confirmPassword) { alert("Fill all fields"); return; }
    if (password.length < 6) { alert("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { alert("Passwords do not match"); return; }
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/register`, { mobileNumber, password, confirmPassword });
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Registration failed");
      } else {
        alert("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch   = confirmPassword.length > 0 && password.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password.length > 0 && password !== confirmPassword;

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
        @keyframes float1   { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(40px,-30px);  } }
        @keyframes float2   { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-40px,35px);  } }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%, 100% { box-shadow: 0 0 6px #7b61ff; } 50% { box-shadow: 0 0 14px #7b61ff; } }
        .input-field::placeholder { color: #2d3a52; }
        ::-webkit-scrollbar { display: none; }
        .text-link {
          color: #00f5d4; background: none; border: none; cursor: pointer;
          font-weight: 700; font-size: 13px; font-family: 'DM Sans', sans-serif;
          padding: 0; transition: opacity 0.2s;
        }
        .text-link:hover { opacity: 0.75; }
      `}</style>

      <div className="grid-bg absolute inset-0 opacity-60" />

      {/* Ambient blobs — swapped colours vs login for subtle distinction */}
      <div style={{ position:"absolute", top:"-180px", left:"-80px", width:"560px", height:"560px", borderRadius:"50%", background:"radial-gradient(circle, rgba(123,97,255,0.12) 0%, transparent 70%)", filter:"blur(40px)", animation:"float1 14s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"-200px", right:"-100px", width:"640px", height:"640px", borderRadius:"50%", background:"radial-gradient(circle, rgba(0,245,212,0.10) 0%, transparent 70%)", filter:"blur(50px)", animation:"float2 17s ease-in-out infinite" }} />

      {/* ── Page layout ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-20">

        {/* ── LEFT PANEL (desktop only) ── */}
        <motion.div
          initial={{ opacity:0, x:-50 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:0.9, ease:[0.25,0.46,0.45,0.94] }}
          className="hidden lg:flex flex-col flex-1"
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 w-fit mb-12" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(8px)" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#7b61ff", boxShadow:"0 0 8px #7b61ff", animation:"pulse-dot 2s ease-in-out infinite", display:"inline-block" }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color:"#7b61ff" }}>Join Nova Bank</span>
          </div>

          {/* Logo */}
          <div className="flex items-center mb-12" style={{ gap:20 }}>
            <div style={{ width:60, height:60, borderRadius:20, background:"linear-gradient(135deg, #7b61ff 0%, #00f5d4 100%)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 30px rgba(123,97,255,0.3)", flexShrink:0 }}>
              <ShieldCheck size={30} color="#04060f" strokeWidth={2.5} />
            </div>
            <div style={{ paddingLeft:4 }}>
              <p className="syne" style={{ fontSize:32, fontWeight:800, background:"linear-gradient(90deg, #7b61ff, #00f5d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.1 }}>
                NOVA BANK
              </p>
              <p style={{ color:"#4a5568", fontSize:13, marginTop:6 }}>Next Generation Fintech</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="syne" style={{ fontSize:"clamp(48px, 6vw, 72px)", lineHeight:1, fontWeight:800, color:"#fff", letterSpacing:"-0.04em" }}>
            Your account,<br />
            <span style={{ background:"linear-gradient(90deg, #7b61ff, #00f5d4, #ff6b6b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              starts here.
            </span>
          </h1>

          <p style={{ color:"#5a6478", fontSize:18, marginTop:24, maxWidth:480, lineHeight:1.8 }}>
            Open your Nova Bank account in minutes. Secure, modern banking designed to grow with you.
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

        {/* ── REGISTER CARD ── */}
        <motion.div
          initial={{ opacity:0, y:50 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.9, delay:0.1 }}
          className="w-full"
          style={{ maxWidth:460 }}
        >
          <div style={{ background:"rgba(8,12,28,0.92)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:32, backdropFilter:"blur(40px)", boxShadow:"0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset", overflow:"hidden", position:"relative" }}>

            {/* Top gradient bar — purple→teal to differ from login */}
            <div style={{ height:3, background:"linear-gradient(90deg, #7b61ff, #00f5d4, #ff6b6b)" }} />

            {/* Inner glow */}
            <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"80%", height:120, background:"radial-gradient(ellipse, rgba(123,97,255,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />

            <div style={{ padding:"48px 44px 44px" }}>

              {/* Mobile logo */}
              <div className="lg:hidden flex items-center mb-12" style={{ gap:20 }}>
                <div style={{ width:52, height:52, borderRadius:16, background:"linear-gradient(135deg, #7b61ff, #00f5d4)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(123,97,255,0.3)", flexShrink:0 }}>
                  <ShieldCheck size={26} color="#04060f" strokeWidth={2.5} />
                </div>
                <div style={{ paddingLeft:4 }}>
                  <p className="syne font-bold" style={{ fontSize:22, background:"linear-gradient(90deg, #7b61ff, #00f5d4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.1 }}>
                    NOVA BANK
                  </p>
                  <p style={{ color:"#3d4f6e", fontSize:12, marginTop:5 }}>Premium Digital Banking</p>
                </div>
              </div>

              {/* Step indicator */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:32 }}>
                {["mobile","password"].map((s, i) => (
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", background: step === s ? "linear-gradient(135deg, #7b61ff, #00f5d4)" : (i === 0 && step === "password") ? "rgba(0,245,212,0.2)" : "rgba(255,255,255,0.06)", border: (i === 0 && step === "password") ? "1px solid rgba(0,245,212,0.4)" : "1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
                      {i === 0 && step === "password"
                        ? <CheckCircle2 size={14} color="#00f5d4" />
                        : <span style={{ fontSize:11, fontWeight:700, color: step === s ? "#04060f" : "#3d4f6e" }}>{i+1}</span>
                      }
                    </div>
                    <span style={{ fontSize:12, color: step === s ? "#fff" : "#3d4f6e", fontWeight: step === s ? 600 : 400 }}>
                      {i === 0 ? "Verify Mobile" : "Set Password"}
                    </span>
                    {i === 0 && <div style={{ width:28, height:1, background:"rgba(255,255,255,0.08)" }} />}
                  </div>
                ))}
              </div>

              {/* Heading */}
              <div style={{ marginBottom:32 }}>
                <h2 className="syne" style={{ fontSize:34, color:"#fff", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
                  {step === "mobile" ? "Create account" : "Set your password"}
                </h2>
                <p style={{ color:"#3d4f6e", fontSize:14, lineHeight:1.7 }}>
                  {step === "mobile"
                    ? "Enter your registered mobile number to get started"
                    : "Create a strong password for your account"}
                </p>
              </div>

              <AnimatePresence mode="wait">

                {/* ── STEP 1: Mobile ── */}
                {step === "mobile" && (
                  <motion.div key="mobile" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>

                    <div style={{ marginBottom:20 }}>
                      <label style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color: mobileFocused ? "#00f5d4" : "#3d4f6e", fontWeight:700, display:"block", marginBottom:10, transition:"color 0.2s" }}>
                        Mobile Number
                      </label>
                      <div onFocus={() => setMobileFocused(true)} onBlur={() => setMobileFocused(false)} style={{ position:"relative" }}>
                        <div style={focusRing(mobileFocused)} />
                        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:12, background: mobileFocused ? "rgba(0,245,212,0.04)" : "rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"0 18px", height:60, transition:"background 0.2s" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, paddingRight:12, borderRight:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }}>
                            <span style={{ fontSize:16 }}>🇮🇳</span>
                            <span style={{ color:"#4a5568", fontSize:13, fontWeight:600 }}>+91</span>
                          </div>
                          <Smartphone size={15} color={mobileFocused ? "#00f5d4" : "#2d3a52"} style={{ flexShrink:0, transition:"color 0.2s" }} />
                          <input
                            ref={mobileRef}
                            className="input-field"
                            type="tel"
                            placeholder="98765 43210"
                            value={mobileNumber}
                            maxLength={10}
                            onChange={(e) => { setMobileNumber(e.target.value.replace(/\D/g,"")); setMobileError(""); }}
                            onKeyDown={(e) => e.key === "Enter" && handleCheckMobile()}
                            style={{ background:"transparent", border:"none", outline:"none", color:"#fff", width:"100%", fontSize:15, fontFamily:"'DM Sans', sans-serif" }}
                          />
                        </div>
                      </div>

                      <AnimatePresence>
                        {mobileError && (
                          <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ display:"flex", alignItems:"center", gap:6, marginTop:10 }}>
                            <AlertCircle size={13} color="#ff6b6b" />
                            <span style={{ fontSize:12, color:"#ff6b6b" }}>{mobileError}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {accountHolderName && (
                          <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ display:"flex", alignItems:"center", gap:8, marginTop:12, background:"rgba(0,245,212,0.06)", border:"1px solid rgba(0,245,212,0.2)", borderRadius:12, padding:"12px 14px" }}>
                            <UserCheck size={15} color="#00f5d4" />
                            <span style={{ fontSize:13, color:"#00f5d4", fontWeight:600 }}>Welcome, {accountHolderName} — account found ✓</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      whileHover={{ scale:1.015 }} whileTap={{ scale:0.985 }}
                      onClick={handleCheckMobile}
                      disabled={checkingMobile}
                      className="shimmer-btn"
                      style={{ position:"relative", overflow:"hidden", width:"100%", height:60, borderRadius:16, border:"none", background: checkingMobile ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #7b61ff 0%, #00f5d4 100%)", color: checkingMobile ? "#4a5568" : "#04060f", fontWeight:800, fontSize:15, cursor: checkingMobile ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow: checkingMobile ? "none" : "0 8px 32px rgba(123,97,255,0.3), 0 2px 8px rgba(0,0,0,0.4)", fontFamily:"'DM Sans', sans-serif" }}
                    >
                      {checkingMobile ? (
                        <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:"spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                          Verifying...
                        </span>
                      ) : (<>Continue <ArrowRight size={17} strokeWidth={2.5} /></>)}
                    </motion.button>

                  </motion.div>
                )}

                {/* ── STEP 2: Password ── */}
                {step === "password" && (
                  <motion.div key="password" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} transition={{ duration:0.3 }}>

                    {/* Account banner */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(0,245,212,0.06)", border:"1px solid rgba(0,245,212,0.15)", borderRadius:12, padding:"12px 14px", marginBottom:24 }}>
                      <UserCheck size={15} color="#00f5d4" />
                      <span style={{ fontSize:13, color:"#00f5d4", fontWeight:600 }}>{accountHolderName}</span>
                      <span style={{ fontSize:13, color:"#3d4f6e" }}>· +91 {mobileNumber}</span>
                    </div>

                    <div style={{ display:"flex", flexDirection:"column", gap:20, marginBottom:32 }}>

                      {/* Password */}
                      <div>
                        <label style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color: passFocused ? "#00f5d4" : "#3d4f6e", fontWeight:700, display:"block", marginBottom:10, transition:"color 0.2s" }}>Password</label>
                        <div onFocus={() => setPassFocused(true)} onBlur={() => setPassFocused(false)} style={{ position:"relative" }}>
                          <div style={focusRing(passFocused)} />
                          <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:12, background: passFocused ? "rgba(0,245,212,0.04)" : "rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"0 18px", height:60, transition:"background 0.2s" }}>
                            <Lock size={15} color={passFocused ? "#00f5d4" : "#2d3a52"} style={{ flexShrink:0, transition:"color 0.2s" }} />
                            <input className="input-field" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={{ background:"transparent", border:"none", outline:"none", color:"#fff", width:"100%", fontSize:15, fontFamily:"'DM Sans', sans-serif" }} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#3d4f6e", display:"flex", alignItems:"center", padding:0, flexShrink:0 }}>
                              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color: confirmFocused ? "#00f5d4" : "#3d4f6e", fontWeight:700, display:"block", marginBottom:10, transition:"color 0.2s" }}>Confirm Password</label>
                        <div onFocus={() => setConfirmFocused(true)} onBlur={() => setConfirmFocused(false)} style={{ position:"relative" }}>
                          <div style={focusRing(confirmFocused)} />
                          <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:12, background: confirmFocused ? "rgba(0,245,212,0.04)" : "rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"0 18px", height:60, transition:"background 0.2s" }}>
                            <Lock size={15} color={confirmFocused ? "#00f5d4" : "#2d3a52"} style={{ flexShrink:0, transition:"color 0.2s" }} />
                            <input className="input-field" type={showConfirm ? "text" : "password"} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} style={{ background:"transparent", border:"none", outline:"none", color:"#fff", width:"100%", fontSize:15, fontFamily:"'DM Sans', sans-serif" }} />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#3d4f6e", display:"flex", alignItems:"center", padding:0, flexShrink:0 }}>
                              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {(passwordsMatch || passwordsMismatch) && (
                            <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ display:"flex", alignItems:"center", gap:6, marginTop:10 }}>
                              {passwordsMatch
                                ? <><CheckCircle2 size={13} color="#00f5d4" /><span style={{ fontSize:12, color:"#00f5d4" }}>Passwords match</span></>
                                : <><AlertCircle  size={13} color="#ff6b6b" /><span style={{ fontSize:12, color:"#ff6b6b" }}>Passwords do not match</span></>
                              }
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Back + Submit */}
                    <div style={{ display:"flex", gap:12 }}>
                      <button onClick={() => { setStep("mobile"); setAccountHolderName(""); }} style={{ height:60, borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.04)", color:"#3d4f6e", fontWeight:700, fontSize:14, cursor:"pointer", padding:"0 22px", fontFamily:"'DM Sans', sans-serif" }}>
                        Back
                      </button>
                      <motion.button
                        whileHover={{ scale:1.015 }} whileTap={{ scale:0.985 }}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="shimmer-btn"
                        style={{ position:"relative", overflow:"hidden", flex:1, height:60, borderRadius:16, border:"none", background: loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #7b61ff 0%, #00f5d4 55%, #ff6b6b 100%)", color: loading ? "#4a5568" : "#04060f", fontWeight:800, fontSize:15, cursor: loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow: loading ? "none" : "0 8px 32px rgba(123,97,255,0.3), 0 2px 8px rgba(0,0,0,0.4)", fontFamily:"'DM Sans', sans-serif" }}
                      >
                        {loading ? (
                          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:"spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            Creating...
                          </span>
                        ) : (<>Create Account <ArrowRight size={17} strokeWidth={2.5} /></>)}
                      </motion.button>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

              {/* Divider */}
              <div style={{ height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", margin:"28px 0" }} />

              {/* Sign in link */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <p style={{ fontSize:13, color:"#2d3a52" }}>Already have an account?</p>
                <button className="text-link" onClick={() => window.location.href = "/login"}>Sign in</button>
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

          <p style={{ textAlign:"center", marginTop:24, color:"#1e2a3a", fontSize:12 }}>
            © 2025 Nova Bank · All rights reserved
          </p>
        </motion.div>

      </div>
    </div>
  );
}

export default Register;