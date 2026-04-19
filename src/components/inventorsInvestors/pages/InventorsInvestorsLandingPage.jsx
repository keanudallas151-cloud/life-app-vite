import {
  EmptyState,
  FeatureFrame,
  PrimaryButton,
  SecondaryButton,
  SurfaceCard,
  alpha,
} from "../InventorsInvestorsUI";
import { INVENTORS_INVESTORS_FEATURE_TAG } from "../../../utils/inventorsInvestors";

export function InventorsInvestorsLandingPage({ t, onGetStarted, onGoMessages, hasMessages }) {
  return (
    <FeatureFrame
      t={t}
      eyebrow="Networking"
      title="Inventors & Investors"
      subtitle="Connect inventors with investors in one place. Choose your role, build your profile, and discover opportunities."
      actions={
        hasMessages ? (
          <SecondaryButton t={t} onClick={onGoMessages}>
            Messages
          </SecondaryButton>
        ) : null
      }
    >
      <SurfaceCard
        t={t}
        style={{
          overflow: "hidden",
          background: `linear-gradient(180deg, ${alpha(t.green, 0.08)} 0%, ${t.white} 100%)`,
        }}
      >
        <div style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {[
              ["Investor", "Set your budget, stage, and industries."],
              ["Inventor", "Show your idea, traction, revenue, and images."],
              ["Discover", "Swipe, search, and message without exposing private details."],
            ].map(([title, body]) => (
              <div
                key={title}
                style={{
                  borderRadius: 18,
                  background: t.skin,
                  border: `1px solid ${t.border}`,
                  padding: "16px 14px",
                  minHeight: 118,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: t.ink }}>{title}</div>
                <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6, color: t.mid }}>{body}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderRadius: 22,
              border: `1px solid ${alpha(t.green, 0.18)}`,
              background: alpha(t.green, 0.07),
              padding: "16px 16px",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase", color: t.green }}>
              Feature tag
            </div>
            <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.65, color: t.ink }}>
              {INVENTORS_INVESTORS_FEATURE_TAG}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <PrimaryButton t={t} onClick={onGetStarted} style={{ flex: 1 }}>
              Get Started
            </PrimaryButton>
            <SecondaryButton t={t} onClick={onGoMessages} style={{ minWidth: 132 }}>
              Open Messages
            </SecondaryButton>
          </div>
        </div>
      </SurfaceCard>

      <div style={{ marginTop: 16 }}>
        <EmptyState
          t={t}
          title="Private by default"
          body="Phone numbers and email stay hidden unless a member explicitly makes them public. In-app messaging is the default first contact path."
        />
      </div>
    </FeatureFrame>
  );
}
