import { useState } from "react";

export function AccountCustomizePage({ t, user, play, setPage, initials }) {
  const [copied, setCopied] = useState(false);

  const rows = [
    { label: "Display Name", value: user?.name || "Not set" },
    { label: "Email", value: user?.email || "Not set" },
    { label: "Member Since", value: "2026" },
  ];

  const handleCopyEmail = () => {
    if (!user?.email) return;
    try {
      navigator.clipboard.writeText(user.email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // fallback: silent
    }
  };

  return (
    <div
      data-page-tag="#account_customize"
      style={{
        padding: "24px 18px 36px",
        maxWidth: 480,
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: "Georgia,serif",
      }}
    >
      {/* Back */}
      <button
        onClick={() => { play("back"); setPage("profile"); }}
        style={{
          background: "none", border: "none", color: t.muted, fontSize: 13,
          cursor: "pointer", fontFamily: "Georgia,serif", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 6, padding: 0,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Profile
      </button>

      <h2 style={{ fontSize: 24, fontWeight: 800, color: t.ink, margin: "0 0 20px", letterSpacing: -0.3 }}>
        Account
      </h2>

      {/* Avatar section */}
      <div
        style={{
          background: t.white,
          border: `1px solid ${t.border}`,
          borderRadius: 18,
          padding: "20px 18px",
          marginBottom: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <p style={{ margin: "0 0 14px", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: t.muted }}>
          Profile Picture
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `linear-gradient(135deg, ${t.green}, ${t.greenAlt})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: `0 0 0 3px ${t.white}, 0 0 0 5px ${t.green}30`,
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{initials}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: t.ink }}>
              {user?.name || "User"}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: t.muted, lineHeight: 1.5 }}>
              Custom photo upload coming soon. Your initials are displayed as your avatar.
            </p>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div
        style={{
          background: t.white,
          border: `1px solid ${t.border}`,
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <p style={{ margin: 0, padding: "14px 18px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: t.muted, borderBottom: `1px solid ${t.border}` }}>
          Profile Information
        </p>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : "none",
            }}
          >
            <span style={{ fontSize: 14, color: t.mid }}>{row.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: t.ink, wordBreak: "break-all", textAlign: "right", maxWidth: 200 }}>
                {row.value}
              </span>
              {row.label === "Email" && user?.email && (
                <button
                  onClick={handleCopyEmail}
                  title="Copy email"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: copied ? t.green : t.muted, padding: 2,
                    display: "flex", alignItems: "center",
                    WebkitTapHighlightColor: "transparent",
                    transition: "color 0.2s",
                  }}
                >
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* What's coming */}
      <div
        style={{
          background: `${t.green}0a`,
          border: `1px solid ${t.green}25`,
          borderRadius: 14,
          padding: "16px 18px",
        }}
      >
        <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: t.green }}>
          Coming Soon
        </p>
        {[
          "Custom profile photo upload",
          "Display name editing",
          "Username / @handle",
          "Bio & social links",
        ].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
            <span style={{ color: t.green, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>○</span>
            <span style={{ fontSize: 13, color: t.mid, lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
