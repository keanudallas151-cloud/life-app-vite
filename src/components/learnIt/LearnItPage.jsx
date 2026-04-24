import { useState, useEffect } from "react";

const FONT = "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const SUBJECTS = [
  {
    id: "english",
    label: "English",
    emoji: "📖",
    tagline: "Words, grammar & vocabulary games",
    description: "Build your English skills through interactive games — fill the gap, guess words, build sentences and more.",
    color: "#3B82F6",
    lightColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.25)",
    games: 6,
  },
  {
    id: "finance",
    label: "Finance",
    emoji: "💰",
    tagline: "Money, markets & financial IQ",
    description: "Master money concepts from budgeting to investing through real-world scenarios and finance trivia.",
    color: "#50c878",
    lightColor: "rgba(80,200,120,0.12)",
    borderColor: "rgba(80,200,120,0.25)",
    games: 6,
  },
  {
    id: "demeanor",
    label: "Demeanor",
    emoji: "🎯",
    tagline: "Confidence, tone & presence",
    description: "Develop your communication style, eliminate filler words, and build unshakeable confidence.",
    color: "#A855F7",
    lightColor: "rgba(168,85,247,0.12)",
    borderColor: "rgba(168,85,247,0.25)",
    games: 6,
  },
];

function SubjectCard({ subject, onSelect, index }) {
  const [pressed, setPressed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <button
      type="button"
      onClick={() => onSelect(subject.id)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${pressed ? subject.color + "60" : subject.borderColor}`,
        borderRadius: 24,
        padding: "22px 20px",
        textAlign: "left",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        transform: mounted
          ? pressed ? "scale(0.97)" : "scale(1) translateY(0)"
          : "scale(0.95) translateY(12px)",
        opacity: mounted ? 1 : 0,
        transition: pressed
          ? "transform 0.1s ease, border-color 0.15s ease"
          : "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: pressed
          ? `0 2px 12px ${subject.color}30`
          : `0 4px 20px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow orb */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${subject.color}30 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Emoji badge */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 16,
        background: subject.lightColor,
        border: `1px solid ${subject.borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        marginBottom: 16,
        transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        transform: pressed ? "scale(0.9)" : "scale(1)",
      }}>
        {subject.emoji}
      </div>

      {/* Label + tagline */}
      <div style={{
        fontSize: 22,
        fontWeight: 700,
        color: "#ededed",
        letterSpacing: "-0.03em",
        lineHeight: 1.1,
        marginBottom: 5,
        fontFamily: FONT,
      }}>
        {subject.label}
      </div>
      <div style={{
        fontSize: 13,
        color: subject.color,
        fontWeight: 600,
        marginBottom: 10,
        fontFamily: FONT,
        letterSpacing: "-0.01em",
      }}>
        {subject.tagline}
      </div>
      <div style={{
        fontSize: 13,
        color: "rgba(161,161,161,0.75)",
        lineHeight: 1.55,
        fontFamily: FONT,
      }}>
        {subject.description}
      </div>

      {/* Bottom row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 18,
        paddingTop: 14,
        borderTop: `1px solid rgba(255,255,255,0.07)`,
      }}>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(161,161,161,0.6)",
          fontFamily: FONT,
          letterSpacing: "0.02em",
        }}>
          {subject.games} activities
        </span>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: subject.lightColor,
          border: `1px solid ${subject.borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={subject.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export function LearnItPage({ t, play, onSelectSubject }) {
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t2 = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t2);
  }, []);

  return (
    <div
      data-page-tag="#learn_it"
      style={{
        padding: "28px 18px 96px",
        maxWidth: 560,
        margin: "0 auto",
        fontFamily: FONT,
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <div style={{
        marginBottom: 28,
        transform: headerVisible ? "translateY(0)" : "translateY(-10px)",
        opacity: headerVisible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.25,1,0.5,1), opacity 0.35s ease",
      }}>
        <p style={{
          margin: "0 0 6px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: (t && t.green) || "#50c878",
          fontFamily: FONT,
        }}>
          Tools
        </p>
        <h2 style={{
          margin: "0 0 8px",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          color: (t && t.ink) || "#ededed",
          fontFamily: FONT,
        }}>
          Learn-It
        </h2>
        <p style={{
          margin: 0,
          fontSize: 15,
          color: (t && t.muted) || "#a1a1a1",
          lineHeight: 1.55,
          fontFamily: FONT,
        }}>
          Choose a subject and start learning through games and interactive tools.
        </p>
      </div>

      {/* Subject cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {SUBJECTS.map((subject, i) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            index={i}
            onSelect={(id) => {
              play?.("tap");
              onSelectSubject?.(id);
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <p style={{
        marginTop: 32,
        textAlign: "center",
        fontSize: 11,
        color: "rgba(161,161,161,0.3)",
        fontFamily: FONT,
        letterSpacing: "0.02em",
      }}>
        More subjects coming soon
      </p>
    </div>
  );
}
