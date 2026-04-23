// #ProfileDetailSheet — full-profile side-sheet for the Inventors & Investors feature
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  Avatar,
  PrimaryButton,
  SecondaryButton,
  alpha,
} from "../InventorsInvestorsUI";
import {
  formatCurrency,
  formatPercent,
} from "../../../utils/inventorsInvestors";

function Pill({ children, color, bg }) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "7px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: bg,
        color,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
}

function FactRow({ label, value, t, last = false }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        padding: "14px 0",
        borderBottom: last ? "none" : `1px solid ${t.border}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: t.muted,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: t.ink,
          textAlign: "right",
          maxWidth: "62%",
          minWidth: 0,
          lineHeight: 1.5,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function ProfileDetailSheet({
  t,
  profile,
  onClose,
  onInterested,
  onPass,
  onStartChat,
  onBlock,
  onReport,
  previewMode = false,
  onCompleteProfile,
}) {
  const closedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const historyPushedRef = useRef(false);
  const historyConsumedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  // Slide-in animation
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Lock the app's main scroll surface behind the sheet while open.
  useEffect(() => {
    if (typeof document === "undefined" || !profile) return undefined;
    const mainScroll = document.querySelector(".life-main-scroll");
    if (!(mainScroll instanceof HTMLElement)) return undefined;

    const previousLock = mainScroll.getAttribute("data-overlay-lock");
    mainScroll.setAttribute("data-overlay-lock", "profile-detail");

    return () => {
      if (previousLock) {
        mainScroll.setAttribute("data-overlay-lock", previousLock);
      } else {
        mainScroll.removeAttribute("data-overlay-lock");
      }
    };
  }, [profile]);

  // Back-button closes the sheet
  useEffect(() => {
    if (!profile) return;
    closedRef.current = false;
    historyPushedRef.current = true;
    historyConsumedRef.current = false;
    window.history.pushState({ profileDetail: true }, "");

    const handlePop = () => {
      if (!closedRef.current) {
        historyConsumedRef.current = true;
        historyPushedRef.current = false;
        closedRef.current = true;
        onCloseRef.current?.();
      }
    };

    window.addEventListener("popstate", handlePop);
    return () => {
      window.removeEventListener("popstate", handlePop);
      if (historyPushedRef.current && !historyConsumedRef.current) {
        historyConsumedRef.current = true;
        historyPushedRef.current = false;
        window.history.back();
      }
    };
  }, [profile]);

  const handleClose = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    onCloseRef.current?.();
  };

  const handleAction = (fn) => () => {
    fn?.();
    handleClose();
  };

  if (!profile || !portalReady || typeof document === "undefined") return null;

  const isInvestor = profile.role === "investor";
  const isStarterProfile = String(profile.user_id || "").startsWith("starter-");
  const isPreview = previewMode || isStarterProfile;
  const heroSrc = profile.hero_image_url || profile.avatar_url;
  const moneyLabel = isInvestor ? "Investment budget" : "Funding sought";
  const moneyValue = isInvestor
    ? formatCurrency(profile.investment_budget)
    : formatCurrency(profile.funding_sought);

  const facts = isInvestor
    ? [
        { label: "Budget", value: formatCurrency(profile.investment_budget) },
        {
          label: "Range",
          value: [
            formatCurrency(profile.investment_range_min),
            formatCurrency(profile.investment_range_max),
          ]
            .filter(Boolean)
            .join(" – "),
        },
        { label: "Stage", value: profile.stage_preference },
        { label: "Focus", value: profile.looking_to_invest_in },
        {
          label: "Industries",
          value: Array.isArray(profile.preferred_industries)
            ? profile.preferred_industries.join(", ")
            : profile.preferred_industries,
        },
        { label: "Location", value: profile.location },
      ]
    : [
        { label: "Ask", value: formatCurrency(profile.funding_sought) },
        { label: "Revenue", value: formatCurrency(profile.revenue) },
        {
          label: "Equity",
          value: formatPercent(profile.equity_available),
        },
        { label: "Category", value: profile.category },
        { label: "Type", value: profile.invention_type },
        { label: "Location", value: profile.location },
      ];

  const validFacts = facts.filter((f) => f.value);

  const content = (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: alpha(t.skin, 0.62),
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 400,
          opacity: mounted ? 1 : 0,
          transition: "opacity 280ms ease",
        }}
      />

      {/* Panel — slides in from right */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${profile.full_name} profile`}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          maxWidth: 500,
          background: t.white,
          zIndex: 401,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehavior: "contain",
          boxShadow: `-24px 0 60px ${alpha(t.skin, 0.34)}`,
          transform: mounted ? "translateX(0)" : "translateX(100%)",
          transition: "transform 320ms cubic-bezier(0.22,1,0.36,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Hero */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/10",
            flexShrink: 0,
            background: alpha(t.skin, 0.98),
            overflow: "hidden",
          }}
        >
          {heroSrc ? (
            <Image
              src={heroSrc}
              alt={profile.full_name}
              fill
              unoptimized
              sizes="(max-width: 500px) 100vw, 500px"
              style={{
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                background:
                  `linear-gradient(135deg, ${alpha(t.skin, 0.98)} 0%, ${alpha(t.white, 0.9)} 50%, ${alpha(t.skin, 0.98)} 100%)`,
              }}
            >
              <div>
                <Avatar src="" name={profile.full_name} size={80} t={t} />
              </div>
            </div>
          )}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                `linear-gradient(180deg, ${alpha(t.skin, 0.08)} 0%, ${alpha(t.skin, 0.24)} 40%, ${alpha(t.skin, 0.82)} 100%)`,
            }}
          />

          {/* Back / close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close profile"
            style={{
              position: "absolute",
              top: "max(14px, calc(env(safe-area-inset-top, 0px) + 6px))",
              left: "max(14px, calc(env(safe-area-inset-left, 0px) + 6px))",
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "none",
              background: alpha(t.skin, 0.62),
              color: t.ink,
              fontSize: 20,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 2,
            }}
          >
            ‹
          </button>

          {/* Status badges top-right */}
          <div
            style={{
              position: "absolute",
              top: "max(14px, calc(env(safe-area-inset-top, 0px) + 6px))",
              right: "max(14px, calc(env(safe-area-inset-right, 0px) + 6px))",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
              zIndex: 2,
            }}
          >
            {profile.isTrending ? (
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: alpha(t.gold || t.orange || t.green, 0.24),
                  color: t.gold || t.orange || t.green,
                  fontSize: 11,
                  fontWeight: 800,
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                🔥 Trending
              </div>
            ) : null}
            {profile.isNewToday ? (
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: alpha(t.skin, 0.3),
                  color: t.ink,
                  fontSize: 11,
                  fontWeight: 800,
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                New today
              </div>
            ) : null}
          </div>

          {/* Name on hero */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: "max(18px, calc(env(safe-area-inset-left, 0px) + 12px))",
              right: "max(18px, calc(env(safe-area-inset-right, 0px) + 12px))",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(24px, 6.4vw, 30px)",
                fontWeight: 800,
                color: t.ink,
                lineHeight: 1.05,
                letterSpacing: -0.5,
                overflowWrap: "anywhere",
              }}
            >
              {profile.full_name}
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: alpha(t.ink, 0.76),
              }}
            >
              {isInvestor ? "Investor" : "Inventor"}
              {profile.location ? ` · ${profile.location}` : ""}
            </p>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overscrollBehavior: "contain",
            padding:
              "20px max(20px, calc(env(safe-area-inset-right, 0px) + 14px)) calc(40px + env(safe-area-inset-bottom, 0px)) max(20px, calc(env(safe-area-inset-left, 0px) + 14px))",
          }}
        >
          {/* Tags row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {moneyValue ? (
              <Pill color={t.green} bg={alpha(t.green, 0.1)}>
                {moneyLabel}: {moneyValue}
              </Pill>
            ) : null}
            {isInvestor && profile.stage_preference ? (
              <Pill color={t.ink} bg={t.skin}>
                {profile.stage_preference}
              </Pill>
            ) : null}
            {!isInvestor && profile.category ? (
              <Pill color={t.ink} bg={t.skin}>
                {profile.category}
              </Pill>
            ) : null}
            {!isInvestor && profile.invention_type ? (
              <Pill color={t.ink} bg={alpha(t.ink, 0.06)}>
                {profile.invention_type}
              </Pill>
            ) : null}
          </div>

          {/* Pitch / bio */}
          {(profile.short_pitch || profile.bio || profile.description) ? (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: t.green,
                  marginBottom: 10,
                }}
              >
                {isInvestor ? "About" : "The pitch"}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.82,
                  color: t.ink,
                }}
              >
                {profile.short_pitch || profile.bio}
              </p>
              {profile.description &&
              profile.description !== profile.short_pitch &&
              profile.description !== profile.bio ? (
                <p
                  style={{
                    margin: "12px 0 0",
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: t.mid,
                  }}
                >
                  {profile.description}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Key facts */}
          {validFacts.length > 0 ? (
            <div
              style={{
                marginBottom: 24,
                borderRadius: 18,
                border: `1px solid ${t.border}`,
                padding: "4px 16px",
                background: t.white,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: t.green,
                  padding: "14px 0 4px",
                }}
              >
                Key details
              </div>
              {validFacts.map((f, i) => (
                <FactRow
                  key={f.label}
                  label={f.label}
                  value={f.value}
                  t={t}
                  last={i === validFacts.length - 1}
                />
              ))}
            </div>
          ) : null}

          {/* Public contact */}
          {profile.email_public && profile.public_email ? (
            <div
              style={{
                marginBottom: 12,
                padding: "14px 16px",
                borderRadius: 18,
                background: alpha(t.green, 0.06),
                border: `1px solid ${alpha(t.green, 0.16)}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: t.green,
                  textTransform: "uppercase",
                  letterSpacing: 1.8,
                  marginBottom: 6,
                }}
              >
                Public email
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>
                {profile.public_email}
              </div>
            </div>
          ) : null}

          {profile.phone_public && profile.public_phone ? (
            <div
              style={{
                marginBottom: 12,
                padding: "14px 16px",
                borderRadius: 18,
                background: alpha(t.green, 0.06),
                border: `1px solid ${alpha(t.green, 0.16)}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: t.green,
                  textTransform: "uppercase",
                  letterSpacing: 1.8,
                  marginBottom: 6,
                }}
              >
                Public phone
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>
                {profile.public_phone}
              </div>
            </div>
          ) : null}

          {!isInvestor && profile.website_url ? (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: t.green,
                  marginBottom: 8,
                }}
              >
                Website
              </div>
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  color: t.green,
                  fontWeight: 700,
                  wordBreak: "break-all",
                  textDecoration: "none",
                }}
              >
                {profile.website_url}
              </a>
            </div>
          ) : null}

          {isPreview ? (
            <div
              style={{
                marginBottom: 20,
                padding: "14px 16px",
                borderRadius: 18,
                background: alpha(t.green, 0.06),
                border: `1px solid ${alpha(t.green, 0.16)}`,
                fontSize: 13,
                lineHeight: 1.7,
                color: t.mid,
              }}
            >
              Starter deck preview — complete your profile to unlock messaging,
              saved actions, and real investor / inventor conversations.
            </div>
          ) : null}

          {/* Primary actions */}
          <div style={{ display: "grid", gap: 10, marginTop: 28 }}>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
            >
              <SecondaryButton t={t} onClick={handleAction(onPass)}>
                ✗ Pass
              </SecondaryButton>
              <PrimaryButton t={t} onClick={handleAction(onInterested)}>
                ♥ Interested
              </PrimaryButton>
            </div>
            <PrimaryButton
              t={t}
              onClick={handleAction(isPreview ? onCompleteProfile : onStartChat)}
              style={
                isPreview
                  ? { boxShadow: "none" }
                  : { background: t.ink, color: t.skin, boxShadow: "none" }
              }
            >
              {isPreview
                ? "Complete setup to unlock messaging"
                : `💬 Message ${profile.full_name?.split(" ")[0] || "them"}`}
            </PrimaryButton>
            {!isPreview ? (
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
              >
                <SecondaryButton t={t} onClick={handleAction(onBlock)}>
                  Hide
                </SecondaryButton>
                <SecondaryButton t={t} onClick={handleAction(onReport)}>
                  Report
                </SecondaryButton>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
