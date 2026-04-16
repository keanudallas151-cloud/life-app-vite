import { Ic } from "../icons/Ic";

const GROWTH_ITEMS = [
  {
    title: "Morning Reflection",
    desc: "Spend 5 minutes journaling about your goals before the day begins.",
    icon: "star",
  },
  {
    title: "Learn One Thing",
    desc: "Read at least one topic in Life. today. Knowledge compounds.",
    icon: "lightbulb",
  },
  {
    title: "Network",
    desc: "Send one message to someone you admire or want to connect with.",
    icon: "users",
  },
  {
    title: "Practice Speaking",
    desc: "Record yourself for 2 minutes on any topic. No fillers.",
    icon: "brain",
  },
  {
    title: "Review Finances",
    desc: "Check your accounts. Know your numbers. Awareness creates control.",
    icon: "wallet",
  },
  {
    title: "Evening Audit",
    desc: "Before bed, write down 3 things you accomplished and 1 thing to improve.",
    icon: "leaf",
  },
];

export function DailyGrowthPage({ t }) {
  return (
    <div
      data-page-tag="#daily_growth"
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
        Daily Growth
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
        Small daily actions that compound into life-changing results.
      </p>
      {GROWTH_ITEMS.map((item) => (
        <div
          key={item.title}
          style={{
            background: t.white,
            border: `1px solid ${t.border}`,
            borderRadius: 14,
            padding: "18px 20px",
            marginBottom: 12,
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: t.greenLt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {Ic[item.icon]?.("none", t.green, 18)}
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 15,
                fontWeight: 700,
                color: t.ink,
              }}
            >
              {item.title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: t.muted,
                lineHeight: 1.6,
              }}
            >
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
