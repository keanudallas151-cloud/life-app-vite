import {
  Avatar,
  EmptyState,
  FeatureFrame,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SurfaceCard,
  SwipeGestureCard,
  alpha,
} from "../InventorsInvestorsUI";
import {
  formatCurrency,
  formatPercent,
  formatRelativeJoined,
} from "../../../utils/inventorsInvestors";

function MetricChip({ t, label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        minHeight: 52,
        borderRadius: 16,
        border: `1px solid ${t.border}`,
        background: t.skin,
        padding: "12px 12px",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: t.muted }}>
        {label}
      </div>
      <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: t.ink, lineHeight: 1.4 }}>
        {value}
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

  return (
    <SwipeGestureCard t={t} onSwipeLeft={onInterested} onSwipeRight={onPass}>
      <div style={{ position: "relative", minHeight: 560 }}>
        {profile.hero_image_url || profile.avatar_url ? (
          <div style={{ width: "100%", aspectRatio: "1.1 / 1", overflow: "hidden", background: t.skin }}>
            <img
              src={profile.hero_image_url || profile.avatar_url}
              alt={profile.full_name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "1.1 / 1",
              background: `linear-gradient(180deg, ${alpha(t.green, 0.12)} 0%, ${t.skin} 100%)`,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Avatar src="" name={profile.full_name} size={96} t={t} />
          </div>
        )}

        <div style={{ padding: "18px 18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 23, fontWeight: 800, color: t.ink, lineHeight: 1.08 }}>{profile.full_name}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: t.mid }}>
                {profile.role === "investor" ? "Investor" : "Inventor"} · {profile.location || "Location not set"}
              </div>
            </div>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 999,
                background: alpha(t.green, 0.08),
                color: t.green,
                fontSize: 11,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {formatRelativeJoined(profile.created_at)}
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.75, color: t.mid }}>
            {profile.short_pitch || profile.bio || profile.description || "No summary added yet."}
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            <MetricChip
              t={t}
              label={profile.role === "investor" ? "Interests" : "Category"}
              value={profile.role === "investor" ? profile.looking_to_invest_in : profile.category}
            />
            <MetricChip
              t={t}
              label={profile.role === "investor" ? "Stage" : "Type"}
              value={profile.role === "investor" ? profile.stage_preference : profile.invention_type}
            />
            <MetricChip
              t={t}
              label={profile.role === "investor" ? "Budget" : "Revenue"}
              value={
                profile.role === "investor"
                  ? formatCurrency(profile.investment_budget)
                  : formatCurrency(profile.revenue)
              }
            />
            <MetricChip
              t={t}
              label={profile.role === "investor" ? "Range" : "Equity"}
              value={
                profile.role === "investor"
                  ? [formatCurrency(profile.investment_range_min), formatCurrency(profile.investment_range_max)]
                      .filter(Boolean)
                      .join(" - ")
                  : formatPercent(profile.equity_available)
              }
            />
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
              Swipe left = Interested
            </PrimaryButton>
            <SecondaryButton t={t} onClick={onPass}>
              Swipe right = Pass
            </SecondaryButton>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
            <SecondaryButton t={t} onClick={onStartChat}>Message</SecondaryButton>
            <SecondaryButton t={t} onClick={onBlock}>Block</SecondaryButton>
            <SecondaryButton t={t} onClick={onReport}>Report</SecondaryButton>
          </div>
        </div>
      </div>
    </SwipeGestureCard>
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
      subtitle="One clear card. Swipe left to show interest. Swipe right to pass. You can also search and message without exposing private contact details."
    >
      <SearchBar
        t={t}
        value={searchTerm}
        onChange={onSearch}
        placeholder="Search by name, location, category, type, or investment interest"
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
