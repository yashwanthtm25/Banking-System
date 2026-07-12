import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API     from "../services/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FieldState {
  value:   string;
  show:    boolean;
  focused: boolean;
}

type Toast = { type: "success" | "error"; message: string } | null;

// ── PIN Input component ───────────────────────────────────────────────────────

function PinField({
  label, field, onChange, onToggleShow, onFocus, onBlur, placeholder,
}: {
  label: string; field: FieldState;
  onChange: (v: string) => void; onToggleShow: () => void;
  onFocus: () => void; onBlur: () => void; placeholder: string;
}) {
  return (
    <div>
      <label style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color: field.focused ? "#00f5d4" : "#3d4f6e", fontWeight:700, display:"block", marginBottom:10, transition:"color 0.2s" }}>
        {label}
      </label>

      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", inset:-1, borderRadius:16, background: field.focused ? "linear-gradient(135deg, #00f5d4, #7b61ff)" : "transparent", opacity: field.focused ? 1 : 0, transition:"opacity 0.25s", pointerEvents:"none" }} />

        <div onFocus={onFocus} onBlur={onBlur} style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:12, background: field.focused ? "rgba(0,245,212,0.04)" : "rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"0 18px", height:58, transition:"background 0.2s" }}>
          <KeyRound size={15} color={field.focused ? "#00f5d4" : "#2d3a52"} style={{ flexShrink:0, transition:"color 0.2s" }} />
          <input
            type={field.show ? "text" : "password"}
            inputMode="numeric"
            maxLength={4}
            placeholder={placeholder}
            value={field.value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g,"").slice(0,4))}
            style={{ background:"transparent", border:"none", outline:"none", color:"#fff", width:"100%", fontSize:22, letterSpacing:"0.5em", fontFamily:"'Syne', sans-serif", fontWeight:700 }}
          />
          <button type="button" onClick={onToggleShow} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#3d4f6e", display:"flex", alignItems:"center", padding:0, flexShrink:0 }}>
            {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display:"flex", gap:6, marginTop:10, paddingLeft:2 }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: i < field.value.length ? "#00f5d4" : "rgba(255,255,255,0.1)", boxShadow: i < field.value.length ? "0 0 6px #00f5d4" : "none", transition:"background 0.2s, box-shadow 0.2s" }} />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function ResetPINPage() {
  const navigate = useNavigate();

  // Detect mode from localStorage (set during login)
  const pinSet = localStorage.getItem("pinSet") === "true";
  const isFirstTime = !pinSet;

  const [current, setCurrent] = useState<FieldState>({ value:"", show:false, focused:false });
  const [newPin,  setNewPin ] = useState<FieldState>({ value:"", show:false, focused:false });
  const [confirm, setConfirm] = useState<FieldState>({ value:"", show:false, focused:false });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast,   setToast  ] = useState<Toast>(null);

  const update = (
    setter: React.Dispatch<React.SetStateAction<FieldState>>,
    patch:  Partial<FieldState>
  ) => setter((prev) => ({ ...prev, ...patch }));

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    if (isFirstTime) {
      // Generate PIN — only newPin + confirm needed
      if (!newPin.value || !confirm.value) { showToast("error", "Please fill in all fields"); return; }
      if (newPin.value.length !== 4)        { showToast("error", "PIN must be exactly 4 digits"); return; }
      if (newPin.value !== confirm.value)   { showToast("error", "PINs do not match"); return; }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await API.post("/pin/generate", { newPin: newPin.value, confirmPin: confirm.value }, { headers: { Authorization: `Bearer ${token}` } });
        localStorage.setItem("pinSet", "true");
        setSuccess(true);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to set PIN";
        showToast("error", msg);
      } finally {
        setLoading(false);
      }

    } else {
      // Reset PIN — current + new + confirm
      if (!current.value || !newPin.value || !confirm.value) { showToast("error", "Please fill in all fields"); return; }
      if (newPin.value.length !== 4 || confirm.value.length !== 4) { showToast("error", "PIN must be exactly 4 digits"); return; }
      if (newPin.value !== confirm.value)  { showToast("error", "New PIN and confirm PIN do not match"); return; }
      if (newPin.value === current.value)  { showToast("error", "New PIN must be different from current PIN"); return; }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await API.put("/pin/reset", { currentPin: current.value, newPin: newPin.value, confirmPin: confirm.value }, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess(true);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to reset PIN";
        showToast("error", msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#04060f", fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&family=Syne:wght@700;800&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px); background-size: 48px 48px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
        input::placeholder { color: #2d3a52; letter-spacing: normal; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Sidebar />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Navbar />

        <div className="grid-bg" style={{ flex:1, overflowY:"auto", padding:"32px 36px", position:"relative" }}>

          {/* Ambient glows */}
          <div style={{ position:"fixed", top:80, right:80, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(123,97,255,0.07) 0%, transparent 70%)", filter:"blur(40px)", pointerEvents:"none", zIndex:0 }} />
          <div style={{ position:"fixed", bottom:60, left:260, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)", filter:"blur(40px)", pointerEvents:"none", zIndex:0 }} />

          <div style={{ position:"relative", zIndex:1, maxWidth:520, margin:"0 auto" }}>

            {/* ── Header ── */}
            <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} style={{ marginBottom:32 }}>
              {!isFirstTime && (
                <button onClick={() => navigate(-1)} style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"none", color:"#3d4f6e", cursor:"pointer", fontSize:13, marginBottom:20, padding:0 }}>
                  <ArrowLeft size={15} /> Back
                </button>
              )}

              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:52, height:52, borderRadius:16, background: isFirstTime ? "linear-gradient(135deg, rgba(0,245,212,0.15), rgba(123,97,255,0.15))" : "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(123,97,255,0.15))", border: `1px solid ${isFirstTime ? "rgba(0,245,212,0.25)" : "rgba(245,158,11,0.25)"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {isFirstTime ? <Sparkles size={24} color="#00f5d4" /> : <KeyRound size={24} color="#f59e0b" />}
                </div>
                <div>
                  <h1 className="syne" style={{ fontSize:26, fontWeight:800, color:"#fff" }}>
                    {isFirstTime ? "Set Transaction PIN" : "Reset PIN"}
                  </h1>
                  <p style={{ fontSize:13, color:"#3d4f6e", marginTop:2 }}>
                    {isFirstTime
                      ? "Create your 4-digit PIN to authorise transactions"
                      : "Update your 4-digit transaction PIN"}
                  </p>
                </div>
              </div>

              {/* First-time notice */}
              {isFirstTime && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ display:"flex", alignItems:"flex-start", gap:10, background:"rgba(0,245,212,0.06)", border:"1px solid rgba(0,245,212,0.15)", borderRadius:14, padding:"14px 16px", marginTop:20 }}>
                  <ShieldCheck size={16} color="#00f5d4" style={{ flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:13, color:"#00f5d4", lineHeight:1.6 }}>
                    You can only set your PIN once. To change it later, use Reset PIN — which requires your current PIN. If you forget it, contact our helpline.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* ── Toast ── */}
            <AnimatePresence>
              {toast && (
                <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }} style={{ display:"flex", alignItems:"center", gap:10, background: toast.type === "success" ? "rgba(0,245,212,0.08)" : "rgba(255,107,107,0.08)", border:`1px solid ${toast.type === "success" ? "rgba(0,245,212,0.2)" : "rgba(255,107,107,0.2)"}`, borderRadius:14, padding:"14px 18px", marginBottom:20 }}>
                  {toast.type === "success" ? <CheckCircle2 size={16} color="#00f5d4" /> : <AlertCircle size={16} color="#ff6b6b" />}
                  <p style={{ fontSize:14, color: toast.type === "success" ? "#00f5d4" : "#ff6b6b", fontWeight:500 }}>{toast.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Success state ── */}
            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.4 }} style={{ background:"rgba(8,12,28,0.85)", border:"1px solid rgba(0,245,212,0.15)", borderRadius:24, padding:"48px 40px", textAlign:"center", backdropFilter:"blur(20px)" }}>
                  <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(0,245,212,0.1)", border:"1px solid rgba(0,245,212,0.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
                    <ShieldCheck size={32} color="#00f5d4" />
                  </div>
                  <h2 className="syne" style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:10 }}>
                    {isFirstTime ? "PIN Set Successfully!" : "PIN Updated!"}
                  </h2>
                  <p style={{ color:"#3d4f6e", fontSize:14, lineHeight:1.7, marginBottom:32 }}>
                    {isFirstTime
                      ? "Your transaction PIN is now active. You can use it to authorise all future transactions."
                      : "Your transaction PIN has been updated successfully. Use it for all future transactions."}
                  </p>
                  <button onClick={() => navigate("/dashboard")} style={{ background:"linear-gradient(135deg, #00f5d4, #7b61ff)", border:"none", borderRadius:14, padding:"14px 32px", color:"#04060f", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
                    Go to Dashboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form card ── */}
            {!success && (
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }} style={{ background:"rgba(8,12,28,0.85)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:28, overflow:"hidden", backdropFilter:"blur(30px)", boxShadow:"0 32px 80px rgba(0,0,0,0.5)" }}>

                {/* Top accent */}
                <div style={{ height:3, background: isFirstTime ? "linear-gradient(90deg, #00f5d4, #7b61ff)" : "linear-gradient(90deg, #f59e0b, #7b61ff, #00f5d4)" }} />

                <div style={{ padding:"36px 36px 32px" }}>

                  {/* Info banner */}
                  <div style={{ display:"flex", alignItems:"flex-start", gap:12, background: isFirstTime ? "rgba(0,245,212,0.06)" : "rgba(245,158,11,0.06)", border:`1px solid ${isFirstTime ? "rgba(0,245,212,0.15)" : "rgba(245,158,11,0.15)"}`, borderRadius:14, padding:"14px 16px", marginBottom:32 }}>
                    <ShieldCheck size={16} color={isFirstTime ? "#00f5d4" : "#f59e0b"} style={{ flexShrink:0, marginTop:1 }} />
                    <p style={{ fontSize:13, color: isFirstTime ? "#00f5d4" : "#f59e0b", lineHeight:1.6 }}>
                      {isFirstTime
                        ? "Choose a PIN you'll remember. This PIN protects all your transactions."
                        : "Your PIN is used to authorise all transactions. Keep it confidential and never share it."}
                    </p>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:28 }}>

                    {/* Current PIN — only for reset */}
                    {!isFirstTime && (
                      <>
                        <PinField
                          label="Current PIN" field={current}
                          onChange={(v) => update(setCurrent, { value:v })}
                          onToggleShow={() => update(setCurrent, { show:!current.show })}
                          onFocus={() => update(setCurrent, { focused:true  })}
                          onBlur={() =>  update(setCurrent, { focused:false })}
                          placeholder="••••"
                        />
                        <div style={{ height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
                      </>
                    )}

                    <PinField
                      label={isFirstTime ? "Create PIN" : "New PIN"} field={newPin}
                      onChange={(v) => update(setNewPin, { value:v })}
                      onToggleShow={() => update(setNewPin, { show:!newPin.show })}
                      onFocus={() => update(setNewPin, { focused:true  })}
                      onBlur={() =>  update(setNewPin, { focused:false })}
                      placeholder="••••"
                    />

                    <PinField
                      label="Confirm PIN" field={confirm}
                      onChange={(v) => update(setConfirm, { value:v })}
                      onToggleShow={() => update(setConfirm, { show:!confirm.show })}
                      onFocus={() => update(setConfirm, { focused:true  })}
                      onBlur={() =>  update(setConfirm, { focused:false })}
                      placeholder="••••"
                    />

                    {/* PIN match indicator */}
                    {confirm.value.length > 0 && newPin.value.length > 0 && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ display:"flex", alignItems:"center", gap:8, marginTop:-12 }}>
                        {newPin.value === confirm.value
                          ? <><CheckCircle2 size={14} color="#00f5d4" /><span style={{ fontSize:12, color:"#00f5d4" }}>PINs match</span></>
                          : <><AlertCircle  size={14} color="#ff6b6b" /><span style={{ fontSize:12, color:"#ff6b6b" }}>PINs do not match</span></>
                        }
                      </motion.div>
                    )}

                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale:1.015 }} whileTap={{ scale:0.985 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ position:"relative", overflow:"hidden", width:"100%", marginTop:32, height:58, borderRadius:16, border:"none", background: loading ? "rgba(255,255,255,0.06)" : isFirstTime ? "linear-gradient(135deg, #00f5d4 0%, #7b61ff 100%)" : "linear-gradient(135deg, #f59e0b 0%, #7b61ff 60%, #00f5d4 100%)", color: loading ? "#4a5568" : "#04060f", fontWeight:800, fontSize:15, cursor: loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow: loading ? "none" : isFirstTime ? "0 8px 32px rgba(0,245,212,0.25)" : "0 8px 32px rgba(245,158,11,0.25)", fontFamily:"'DM Sans', sans-serif", transition:"box-shadow 0.2s" }}
                  >
                    {loading ? (
                      <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:"spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        {isFirstTime ? "Setting PIN..." : "Updating PIN..."}
                      </span>
                    ) : (
                      <>
                        {isFirstTime ? <Sparkles size={16} strokeWidth={2.5} /> : <KeyRound size={16} strokeWidth={2.5} />}
                        {isFirstTime ? "Set Transaction PIN" : "Update Transaction PIN"}
                      </>
                    )}
                  </motion.button>

                  {/* Helpline note for reset */}
                  {!isFirstTime && (
                    <p style={{ textAlign:"center", marginTop:16, fontSize:12, color:"#2d3a52" }}>
                      Forgot your PIN? Call our helpline at{" "}
                      <span style={{ color:"#3d4f6e", fontWeight:600 }}>1800-XXX-XXXX</span>
                    </p>
                  )}

                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPINPage;