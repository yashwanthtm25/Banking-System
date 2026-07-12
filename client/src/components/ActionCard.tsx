import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  icon?: ReactNode;
  accent?: string;
  onClick?: () => void;
}

function ActionCard({ title, description, icon, accent = "#00f5d4", onClick }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      style={{
        background: "rgba(8, 12, 28, 0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "24px 24px 20px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}35`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${accent}12`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      {icon && (
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: `${accent}15`,
            border: `1px solid ${accent}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            color: accent,
          }}
        >
          {icon}
        </div>
      )}

      {/* Text */}
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 17,
          fontWeight: 700,
          color: "#e2e8f0",
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 13, color: "#3d4f6e", lineHeight: 1.6 }}>{description}</p>

      {/* Arrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 18,
          color: accent,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <span>Go</span>
        <ArrowRight size={13} strokeWidth={2.5} />
      </div>
    </motion.div>
  );
}

export default ActionCard;