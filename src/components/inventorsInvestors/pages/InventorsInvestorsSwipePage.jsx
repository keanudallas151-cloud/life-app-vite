import { useMemo, useRef, useState } from "react";
import {
  Avatar,
  EmptyState,
  FeatureFrame,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SurfaceCard,
  alpha,
} from "../InventorsInvestorsUI";
import {
  formatCurrency,
  formatPercent,
  formatRelativeJoined,
} from "../../../utils/inventorsInvestors";

const DECK_SWIPE_TRIGGER = 88;

function MetricChip({ t, label, value, compact = false }) {
  if (!value) return null;
  return (
    <div
      style={{
        minHeight: compact ? 46 : 52,
        borderRadius: 16,
        border: `1px solid ${alpha(t.border, 0.9)}`,
        background: compact ? alpha(t.skin, 0.92) : t.skin,
        padding: compact ? "10px 11px" : "12px 12px",
        backdropFilter: compact ? "blur(8px)" : "none",
        WebkitBackdropFilter: compact ? "blur(8px)" : "none",
      }}
    >
      <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: t.muted }}>
        {label}
      </div>
      <div style={{ marginTop: 5, fontSize: compact ? 12.5 : 13, fontWeight: 700, color: t.ink, lineHeight: 1.35 }}>
        {value}
      </div>
    </div>
  );
}

function DeckSwipeCard({ t, onSwipeLeft, onSwipeRight, children }) {
  const [offsetX, setOffsetX] = useState(0);
  const [animatingOut, setAnimatingOut] = useState(false);
  const startRef = useRef({ x: 0, y: 0, dragging: false });

  const swipeState = useMemo(() => {
    if (offsetX <= -28) return "left";
    if (offsetX >= 28) return "right";
    return "";
  }, [offsetX]);

  const leftBadgeOpacity = Math.max(0, Math.min(1, Math.abs(Math.min(offsetX, 0)) / 110));
  const rightBadgeOpacity = Math.max(0, Math.min(1, Math.max(offsetX, 0) / 110));

  const beginDrag = (x, y) => {
    if (animatingOut) return;
    startRef.current = { x, y, dragging: true };
  };

  const moveDrag = (x, y) => {
    if (!startRef.current.dragging || animatingOut) return;
    const deltaX = x - startRef.current.x;
    const deltaY = y - startRef.current.y;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    setOffsetX(Math.max(-180, Math.min(180, deltaX)));
  };

  const finishDrag = () => {
    if (!startRef.current.dragging || animatingOut) return;
    startRef.current.dragging = false;

    if (Math.abs(offsetX) < DECK_SWIPE_TRIGGER) {
      setOffsetX(0);
      return;
    }

    const direction = offsetX < 0 ? -1 : 1;
    setAnimatingOut(true);
    setOffsetX(direction * 320);

    window.setTimeout(() => {
      if (direction < 0) onSwipeLeft?.();
      if (direction > 0) onSwipeRight?.();
      setAnimatingOut(false);
      setOffsetX(0);
    }, 200);
  };

  return (
    <div
      style={{
        position: "relative",
        maxWidth: 520,
        margin: "0 auto",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "12px 12px auto",
          height: "100%",
          borderRadius: 30,
          border: `1px solid ${alpha(t.green, 0.12)}`,
          background: `linear-gradient(180deg, ${alpha(t.green, 0.05)} 0%, ${t.white} 100%)`,
          opacity: 0.62,
          transform: "scale(0.985)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "24px 24px auto",
          height: "100%",
          borderRadius: 30,
          border: `1px solid ${alpha(t.green, 0.08)}`,
          background: `linear-gradient(180deg, ${alpha(t.green, 0.04)} 0%, ${t.white} 100%)`,
          opacity: 0.38,
          transform: "scale(0.97)",
        }}
      />
      <div
        onTouchStart={(event) => {
          const touch = event.touches[0];
          beginDrag(touch.clientX, touch.clientY);
        }}
        onTouchMove={(event) => {
          const touch = event.touches[0];
          moveDrag(touch.clientX, touch.clientY);
        }}
        onTouchEnd={finishDrag}
        onMouseDown={(event) => beginDrag(event.clientX, event.clientY)}
        onMouseMove={(event) => moveDrag(event.clientX, event.clientY)}
        onMouseUp={finishDrag}
        onMouseLeave={finishDrag}
        className="ii-swipe-card"
        style={{
          position: "relative",
          overflow: "hidden",
          maxWidth: 520,
          margin: "0 auto",
          touchAction: "pan-y",
          borderRadius: 30,
          border: `1px solid ${t.border}`,
          background: t.white,
          boxShadow: `0 24px 60px ${alpha(t.ink, 0.1)}`,
          transform: `translateX(${offsetX}px) rotate(${offsetX / 28}deg)`,
          opacity: animatingOut ? 0 : 1 - Math.min(Math.abs(offsetX) / 280, 0.16),
          transition: startRef.current.dragging
            ? "none"
            : "transform 200ms ease, opacity 200ms ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "9px 14px",
            borderRadius: 999,
            background: alpha(t.green, 0.18),
            border: `1px solid ${alpha(t.green, 0.38)}`,
            color: t.green,
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            zIndex: 3,
            opacity: swipeState === "left" ? leftBadgeOpacity : 0.28,
            transform: swipeState === "left" ? "scale(1.02)" : "scale(0.96)",
            transition: "opacity 140ms ease, transform 140ms ease",
          }}
        >
          Yes
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "9px 14px",
            borderRadius: 999,
            background: alpha(t.red, 0.14),
            border: `1px solid ${alpha(t.red, 0.32)}`,
            color: t.red,
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            zIndex: 3,
            opacity: swipeState === "right" ? rightBadgeOpacity : 0.28,
            transform: swipeState === "right" ? "scale(1.02)" : "scale(0.96)",
            transition: "opacity 140ms ease, transform 140ms ease",
          }}
        >
          No
        </div>
        {children}
      </div>
    </div>
  );
}

function DiscoverCard({
  t,
  profile,
  onInterested,
  onPass,
  onStartChat,
  onBlock,
  onReport,
}) {
  if (!profile) return null;

  const moneyLine =
    profile.role === "investor"
      ? formatCurrency(profile.investment_budget)
      : formatCurrency(profile.funding_sought);

  const keyFacts = profile.role === "investor"
    ? [
        { label: "Budget", value: formatCurrency(profile.investment_budget) },
        {
          label: "Range",
          value: [formatCurrency(profile.investment_range_min), formatCurrency(profile.investment_range_max)]
            .filter(Boolean)
            .join(" - "),
        },
        { label: "Stage", value: profile.stage_preference },
        { label: "Focus", value: profile.looking_to_invest_in },
      ]
    : [
        { label: "Ask", value: formatCurrency(profile.funding_sought) },
        { label: "Revenue", value: formatCurrency(profile.revenue) },
        { label: "Equity", value: formatPercent(profile.equity_available) },
        { label: "Category", value: profile.category },
      ];

  return (
    <DeckSwipeCard t={t} onSwipeLeft={onInterested} onSwipeRight={onPass}>
      <div style={{ position: "relative", minHeight: 670 }}>
        {profile.hero_image_url || profile.avatar_url ? (
          <div style={{ position: "relative", width: "100%", aspectRatio: "0.82 / 1", overflow: "hidden", background: t.skin }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.hero_image_url || profile.avatar_url}
              alt={profile.full_name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 32%, rgba(0,0,0,0.72) 100%)",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "0.82 / 1",
              background: `linear-gradient(180deg, ${alpha(t.green, 0.16)} 0%, ${alpha(t.ink, 0.92)} 100%)`,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Avatar src="" name={profile.full_name} size={110} t={t} />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            bottom: 18,
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              padding: "18px 18px 16px",
              borderRadius: 24,
              background: "rgba(7,7,7,0.72)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#ffffff", lineHeight: 0.96, letterSpacing: -0.6 }}>
                  {profile.full_name}
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>
                  {profile.role === "investor" ? "Investor" : "Inventor"} · {profile.location || "Location not set"}
                </div>
              </div>
              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                {formatRelativeJoined(profile.created_at)}
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.84)" }}>
              {profile.short_pitch || profile.bio || profile.description || "No summary added yet."}
            </div>

            <div
              style={{
                marginTop: 14,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              <MetricChip t={{ ...t, ink: "#ffffff", mid: "rgba(255,255,255,0.68)", muted: "rgba(255,255,255,0.52)", skin: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.08)" }} label={profile.role === "investor" ? "Budget" : "Ask"} value={moneyLine} compact />
              <MetricChip t={{ ...t, ink: "#ffffff", mid: "rgba(255,255,255,0.68)", muted: "rgba(255,255,255,0.52)", skin: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.08)" }} label={profile.role === "investor" ? "Stage" : "Type"} value={profile.role === "investor" ? profile.stage_preference : profile.invention_type} compact />
            </div>
          </div>
        </div>

        <div style={{ padding: "18px 18px 20px" }}>
          <div
            className="ii-metrics-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {keyFacts.map((item) => (
              <MetricChip key={item.label} t={t} label={item.label} value={item.value} />
            ))}
          </div>

          {(profile.public_email || profile.public_phone) && (
            <div
              style={{
                marginTop: 16,
                borderRadius: 18,
                border: `1px solid ${t.border}`,
                background: t.skin,
                padding: "14px 14px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: t.muted }}>
                Public contact details
              </div>
              <div style={{ marginTop: 8, display: "grid", gap: 6, fontSize: 13, color: t.ink }}>
                {profile.public_email ? <div>{profile.public_email}</div> : null}
                {profile.public_phone ? <div>{profile.public_phone}</div> : null}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
            <PrimaryButton t={t} onClick={onInterested}>
              Yes
            </PrimaryButton>
            <SecondaryButton t={t} onClick={onPass}>
              No
            </SecondaryButton>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
            <SecondaryButton t={t} onClick={onStartChat}>Message</SecondaryButton>
            <SecondaryButton t={t} onClick={onBlock}>Hide</SecondaryButton>
            <SecondaryButton t={t} onClick={onReport}>Report</SecondaryButton>
          </div>
        </div>
      </div>
    </DeckSwipeCard>
  );
}

export function InventorsInvestorsSwipePage({
  t,
  viewerRole,
  searchTerm,
  onSearch,
  onOpenMessages,
  pendingMessageCount,
  activeProfile,
  hasProfiles,
  isLoading,
  onInterested,
  onPass,
  onStartChat,
  onBlock,
  onReport,
  onResetSearch,
}) {
  return (
    <FeatureFrame
      t={t}
      eyebrow="Discover"
      title={viewerRole === "investor" ? "Discover inventors" : "Discover investors"}
      subtitle="A cleaner, photo-first deck. Swipe left for yes. Swipe right for no. Open the profile details that matter faster."
    >
      <SearchBar
        t={t}
        value={searchTerm}
        onChange={onSearch}
        placeholder="Search by name, location, category, type, or focus"
        rightSlot={
          <button
            type="button"
            onClick={onOpenMessages}
            style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              border: `1px solid ${t.border}`,
              background: t.white,
              cursor: "pointer",
              position: "relative",
            }}
            aria-label="Open messages"
          >
            <span style={{ fontSize: 20, color: t.ink }}>✉</span>
            {pendingMessageCount ? (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 999,
                  background: t.green,
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {pendingMessageCount}
              </span>
            ) : null}
          </button>
        }
      />

      {isLoading ? (
        <SurfaceCard t={t} style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 14, color: t.mid }}>Loading discovery profiles...</div>
        </SurfaceCard>
      ) : !hasProfiles ? (
        <EmptyState
          t={t}
          title={searchTerm ? "No search results" : "No profiles found"}
          body={
            searchTerm
              ? "No matching profiles showed up for that search. Try a broader term or clear the search."
              : "You have reached the end of the current discovery list. More profiles will appear when new members join or after you reset your visible search."
          }
          action={
            searchTerm ? (
              <SecondaryButton t={t} onClick={onResetSearch}>
                Clear search
              </SecondaryButton>
            ) : null
          }
        />
      ) : (
        <DiscoverCard
          t={t}
          profile={activeProfile}
          onInterested={onInterested}
          onPass={onPass}
          onStartChat={onStartChat}
          onBlock={onBlock}
          onReport={onReport}
        />
      )}
    </FeatureFrame>
  );
}
