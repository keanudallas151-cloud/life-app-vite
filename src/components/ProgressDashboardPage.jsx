import { MomentumCard } from "./MomentumCard";

export function ProgressDashboardPage({
  t,
  momentumSnapshot,
  openMomentumHub,
  readKeys,
  bookmarks,
  completedNotes,
  savedHighlightsCount,
  readingStreak,
  profile,
  totalTopics,
  progressPercent,
  play,
  setPage,
  setScreen,
}) {
  return (
    <div
      data-page-tag="#progress_dashboard"
      style={{ padding: "48px 28px", maxWidth: 560, margin: "0 auto" }}
    >
      <h2
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: t.ink,
          margin: "0 0 10px",
        }}
      >
        Progress Dashboard
      </h2>
      <p
        style={{
          color: t.muted,
          fontSize: 15,
          lineHeight: 1.8,
          margin: "0 0 28px",
          fontStyle: "italic",
        }}
      >
        Track your journey and see how far you&apos;ve come.
      </p>

      <div style={{ marginBottom: 20 }}>
        <MomentumCard
          snapshot={momentumSnapshot}
          onOpenHub={openMomentumHub}
          title="Momentum summary"
        />
      </div>

      {/* Overall progress bar */}
      <div
        style={{
          background: t.white,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: t.muted,
            }}
          >
            Overall Progress
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: t.green }}>
            {progressPercent}%
          </span>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 10,
            background: t.light,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              borderRadius: 10,
              background: `linear-gradient(90deg, ${t.green}, #6FBE77)`,
              transition: "width 0.6s",
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: 13, color: t.muted }}>
          {readKeys.length} of {totalTopics} topics completed
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Topics Read", value: readKeys.length, color: t.green },
          { label: "Bookmarks", value: bookmarks.length, color: t.gold },
          { label: "Notes", value: completedNotes, color: t.green },
          { label: "Quotes", value: savedHighlightsCount, color: t.green },
          {
            label: "Streak",
            value: readingStreak.count > 0 ? `${readingStreak.count}d` : "0d",
            color: t.red,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: t.white,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: "18px 14px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: s.color,
                display: "block",
              }}
            >
              {s.value}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: t.muted,
                marginTop: 4,
                display: "block",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Challenges */}
      <div
        style={{
          background: t.white,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          padding: 24,
        }}
      >
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: t.muted,
          }}
        >
          Challenges
        </p>
        {[
          {
            text: "Record yourself talking on a random topic — no ums or ahs",
            done: false,
            action: "communication",
          },
          {
            text: "Read 5 topics in a single day",
            done: readKeys.length >= 5,
            action: "home",
          },
          {
            text: "Save 3 bookmarks",
            done: bookmarks.length >= 3,
            action: "home",
          },
          {
            text: "Write your first note on any topic",
            done: completedNotes > 0,
            action: "home",
          },
          {
            text: "Complete the tailoring questionnaire",
            done: !!profile,
            action: "tailor",
          },
          {
            text: "Maintain a 3-day reading streak",
            done: readingStreak.count >= 3,
            action: "daily_growth",
          },
          {
            text: "Improve Communication",
            done: false,
            action: "communication",
          },
          {
            text: "Set a personal goal and track it",
            done: false,
            action: "goal",
          },
        ].map((ch) => {
          const handleClick = () => {
            if (ch.done) return;
            play?.("tap");
            if (ch.action === "communication" && setPage) {
              setPage("quiz");
            } else if (ch.action === "tailor" && setScreen) {
              setScreen("tailor_intro");
            } else if (ch.action === "goal" && setPage) {
              setPage("goal_setting");
            } else if (ch.action && setPage) {
              setPage(ch.action);
            }
          };
          return (
            <button
              key={ch.text}
              type="button"
              onClick={handleClick}
              disabled={ch.done}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "14px 0",
                borderBottom: `1px solid ${t.light}`,
                background: "transparent",
                border: "none",
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: t.light,
                cursor: ch.done ? "default" : "pointer",
                textAlign: "left",
                fontFamily: "Georgia,serif",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!ch.done) e.currentTarget.style.background = t.greenLt + "44";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: ch.done ? t.green : t.light,
                  border: `2px solid ${ch.done ? t.green : t.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {ch.done && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: ch.done ? t.green : t.mid,
                  textDecoration: ch.done ? "line-through" : "none",
                }}
              >
                {ch.text}
              </span>
              {!ch.done && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={t.muted}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
