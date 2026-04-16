const FAQ = [
  [
    "How do I navigate the app?",
    "Tap the menu icon top left to open the sidebar. Browse Library folders or jump into Guided for a curated path.",
  ],
  [
    "How do I save topics?",
    "Tap the ☆ star on any reading page. All saved topics appear in the Saved section in the sidebar.",
  ],
  [
    "How do I take notes?",
    "Open any topic and tap the Notes tab. Write your thoughts and tap Save.",
  ],
  [
    "What is Post-It?",
    "The Life. community feed. Share insights, ask questions, and discuss topics with other readers.",
  ],
  [
    "What is the Quiz?",
    "Test your knowledge on Finance, Psychology, and Money. Pick easy, medium, or hard. Three formats: Multiple Choice, True/False, and Blitz.",
  ],
  [
    "What is Guided?",
    "A curated sequence designed to take you from zero understanding of money to a solid foundation.",
  ],
  [
    "Keyboard shortcuts",
    "Press / to focus search (when not typing in a field). Press ? to open this Help page. Reading progress per topic is saved automatically when you turn pages.",
  ],
  [
    "Share a topic",
    "While reading, use Copy link to get a URL with #read=topicKey. Anyone with the link can jump straight into that article after signing in.",
  ],
  [
    "Legal pages",
    "Open Privacy Policy, Terms, and Cookie Notice from Profile → Setting → Tools & Legal.",
  ],
];

export function HelpPage({ t }) {
  return (
    <div
      data-page-tag="#help"
      style={{ padding: "48px 28px", maxWidth: 560, margin: "0 auto" }}
    >
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: t.ink,
          margin: "0 0 12px",
        }}
      >
        Help
      </h2>
      <p
        style={{
          color: t.muted,
          fontSize: 15,
          lineHeight: 1.8,
          margin: "0 0 32px",
          fontStyle: "italic",
        }}
      >
        Everything you need to know about using Life.
      </p>
      {FAQ.map(([q, a]) => (
        <div
          key={q}
          style={{
            background: t.white,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: "20px 22px",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 15,
              fontWeight: 700,
              color: t.ink,
            }}
          >
            {q}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: t.mid,
              lineHeight: 1.7,
              fontFamily: "Georgia,serif",
            }}
          >
            {a}
          </p>
        </div>
      ))}
    </div>
  );
}
