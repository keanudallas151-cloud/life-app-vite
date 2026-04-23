import { Ic } from "../icons/Ic";

export function ToolsPage({ t, play, setPage }) {
  const lockInCard = {
    title: "Lock In",
    desc: "Set your tasks, choose your time, add optional breaks, and commit until the hourglass finishes.",
    eyebrow: "Focus tool",
    meta: "Tasks + timer + breaks",
    action: "tools_lockin",
  };

  return (
    <div
      data-page-tag="#tools_page"
      style={{
        padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 28px)",
        maxWidth: 620,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: t.green,
        }}
      >
        Tools
      </p>
      <h2
        style={{
          margin: "0 0 14px",
          fontSize: 28,
          fontWeight: 700,
          color: t.ink,
          fontFamily: "Georgia,serif",
        }}
      >
        Tools
      </h2>
      <p
        style={{
          margin: "0 0 28px",
          color: t.mid,
          fontSize: 15,
          lineHeight: 1.85,
          fontFamily: "Georgia,serif",
        }}
      >
        Open Lock In to plan one focused session and stay with it until the timer ends.
      </p>

      <section
        className="life-card-hover"
        style={{
          position: "relative",
          overflow: "hidden",
          marginBottom: 18,
          padding: "18px 18px 16px",
          borderRadius: 22,
          border: `1px solid ${t.border}`,
          background: `linear-gradient(135deg, ${t.white} 0%, ${t.greenLt} 140%)`,
          boxShadow: `0 18px 40px ${t.green}12`,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -60,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${t.green}18 0%, transparent 72%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", display: "grid", gap: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                minHeight: 34,
                padding: "8px 12px",
                borderRadius: 999,
                border: `1px solid ${t.border}`,
                background: `${t.white}cc`,
                color: t.ink,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {Ic.box("none", t.green, 15)}
              Ready-to-use tools
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 34,
                padding: "8px 12px",
                borderRadius: 999,
                background: `${t.green}16`,
                color: t.green,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Local + cloud aware
            </span>
          </div>
          <div>
            <p style={{ margin: "0 0 6px", color: t.ink, fontSize: 17, fontWeight: 700 }}>
              One tool. One promise.
            </p>
            <p style={{ margin: 0, color: t.mid, fontSize: 13.5, lineHeight: 1.75 }}>
              Prepare your task list, lock the session in, and do not switch to anything else until the hourglass is finished.
            </p>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          play("tap");
          setPage(lockInCard.action);
        }}
        className="life-card-hover"
        style={{
          width: "100%",
          background: t.white,
          border: `1px solid ${t.border}`,
          borderRadius: 22,
          padding: 22,
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: 18,
          textAlign: "left",
          boxShadow: `0 14px 32px ${t.green}10`,
          transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 18px 36px ${t.green}18`;
          e.currentTarget.style.borderColor = `${t.green}55`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = `0 14px 32px ${t.green}10`;
          e.currentTarget.style.borderColor = t.border;
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: t.greenLt,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {Ic.candle("none", t.green, 26)}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              marginBottom: 6,
              color: t.green,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.8,
              textTransform: "uppercase",
            }}
          >
            {lockInCard.eyebrow}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: t.ink,
              marginBottom: 6,
            }}
          >
            {lockInCard.title}
          </div>
          <div
            style={{
              fontSize: 13.5,
              color: t.mid,
              lineHeight: 1.6,
            }}
          >
            {lockInCard.desc}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 30,
                padding: "6px 10px",
                borderRadius: 999,
                background: t.greenLt,
                color: t.green,
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              {lockInCard.meta}
            </span>
            <span
              style={{
                color: t.green,
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              Open Lock In →
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
