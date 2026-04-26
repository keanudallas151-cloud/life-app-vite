import { useState, useEffect } from "react";
import { FONT } from "./constants.js";

/**
 * FlipCard — Learn-It activity card with front/back flip.
 *
 * iOS Safari notes:
 *   On iOS, `backface-visibility: hidden` is silently disabled when the
 *   3D-transformed parent has a `filter:` rule, or when the children have
 *   `backdrop-filter:`. That causes both faces to render at once and the
 *   front face wins z-order, so the BACK (with the Play button) is
 *   unreachable. We therefore:
 *     - keep `transformStyle: preserve-3d` only on the rotating wrapper
 *     - put NO `filter` on the rotating wrapper
 *     - put NO `backdrop-filter` on the faces
 *     - set `WebkitBackfaceVisibility: hidden` explicitly on each face
 *     - gate `pointer-events` so the hidden face never eats taps
 */
export function FlipCard({
  game,
  color,
  lightColor,
  borderColor,
  index,
  onPlay,
  showHint = true,
  onFlip,
  reducedMotion = false,
  play,
}) {
  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [playReady, setPlayReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), index * 65);
    return () => clearTimeout(t);
  }, [index]);

  // Spring-pop the Play button shortly after the back face lands
  useEffect(() => {
    if (!flipped) {
      setPlayReady(false);
      return;
    }
    // Trigger sooner than rotation duration so users perceive Play immediately
    const delay = reducedMotion ? 0 : 250;
    const t = setTimeout(() => setPlayReady(true), delay);
    return () => clearTimeout(t);
  }, [flipped, reducedMotion]);

  const handleFlipToggle = () => {
    setFlipped((prev) => {
      const next = !prev;
      if (next) {
        play?.("flip");
        onFlip?.(game.id);
      } else {
        play?.("tap_soft");
      }
      return next;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlipToggle();
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    play?.("tap");
    onPlay(game.id);
  };

  // Difficulty hint text for the back-face meta row
  const difficultyHint = game.difficulty || (game.type === "tool" ? "Practice" : "Easy → Hard");

  // Long description fallback to short desc if not provided
  const longDesc = game.longDesc || game.desc;

  // Rotation transition — disabled under reduced motion
  const rotationTransition = reducedMotion
    ? "none"
    : "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)";

  return (
    <div
      style={{
        perspective: "1000px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(20px) scale(0.94)",
        transition: reducedMotion
          ? "none"
          : `opacity 0.4s ease ${index * 65}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${index * 65}ms`,
      }}
    >
      <style>{`
        @keyframes flipCardShimmer {
          0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
          18%  { opacity: 0.55; }
          60%  { opacity: 0.55; }
          100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
        }
        @keyframes flipCardPlayPop {
          0%   { transform: translateX(-50%) scale(0.6); opacity: 0; }
          60%  { transform: translateX(-50%) scale(1.12); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${game.title} — ${flipped ? "showing details, press the Play button or tap to flip back" : "tap to see details"}`}
        onClick={handleFlipToggle}
        onKeyDown={handleKeyDown}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1.05",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          WebkitTransform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: rotationTransition,
          WebkitTransition: rotationTransition,
          cursor: "pointer",
          isolation: "isolate",
          willChange: "transform",
          WebkitTapHighlightColor: "transparent",
          outline: "none",
        }}
      >
        {/* FRONT */}
        <div
          aria-hidden={flipped}
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "rgba(255,255,255,0.045)",
            border: `1px solid ${borderColor}`,
            borderRadius: 22,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px 14px 34px",
            gap: 10,
            boxShadow: `0 6px 22px rgba(0,0,0,0.22)`,
            overflow: "hidden",
            pointerEvents: flipped ? "none" : "auto",
          }}
        >
          {/* Shimmer sweep on mount */}
          {mounted && !reducedMotion && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
                borderRadius: 22,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "55%",
                  left: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                  animation: `flipCardShimmer 1.4s ease ${index * 65 + 280}ms 1 both`,
                }}
              />
            </div>
          )}

          {/* Type badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              padding: "3px 8px",
              borderRadius: 999,
              background: lightColor,
              border: `1px solid ${borderColor}`,
              fontSize: 9,
              fontWeight: 700,
              color: color,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontFamily: FONT,
            }}
          >
            {game.type}
          </div>

          <div style={{ fontSize: 32, lineHeight: 1 }}>{game.icon}</div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#ededed",
              textAlign: "center",
              fontFamily: FONT,
              letterSpacing: "-0.02em",
            }}
          >
            {game.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(161,161,161,0.7)",
              textAlign: "center",
              lineHeight: 1.5,
              fontFamily: FONT,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              padding: "0 4px",
            }}
          >
            {game.desc}
          </div>

          {/* Tap hint — pulsing dot, hidden once any card has been flipped */}
          {showHint && (
            <div
              aria-hidden="true"
              className="life-flipcard-hint"
              style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 5,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 0 0 ${color}`,
                  animation: reducedMotion
                    ? "none"
                    : "life-flipcard-hint-pulse 1.8s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: 9.5,
                  color: color,
                  fontFamily: FONT,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.55,
                }}
              >
                flip
              </span>
            </div>
          )}
        </div>

        {/* BACK */}
        <div
          aria-hidden={!flipped}
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            WebkitTransform: "rotateY(180deg)",
            background: `linear-gradient(160deg, ${lightColor.replace("0.12", "0.18")} 0%, rgba(255,255,255,0.04) 100%)`,
            border: `1.5px solid ${color}60`,
            borderRadius: 22,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "14px 12px 44px",
            gap: 6,
            boxShadow: `0 4px 28px ${color}25`,
            pointerEvents: flipped ? "auto" : "none",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>{game.icon}</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ededed",
              textAlign: "center",
              fontFamily: FONT,
              letterSpacing: "-0.01em",
            }}
          >
            {game.title}
          </div>

          {/* Long description */}
          <div
            style={{
              fontSize: 10.5,
              color: "rgba(220,220,220,0.78)",
              textAlign: "center",
              lineHeight: 1.42,
              fontFamily: FONT,
              padding: "0 2px",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {longDesc}
          </div>

          {/* Meta chips: type + difficulty hint */}
          <div
            style={{
              display: "flex",
              gap: 5,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            <span
              style={{
                padding: "2px 7px",
                borderRadius: 999,
                background: lightColor,
                border: `1px solid ${borderColor}`,
                fontSize: 8.5,
                fontWeight: 700,
                color: color,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: FONT,
              }}
            >
              {game.type}
            </span>
            <span
              style={{
                padding: "2px 7px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 8.5,
                fontWeight: 600,
                color: "rgba(220,220,220,0.85)",
                letterSpacing: "0.04em",
                fontFamily: FONT,
              }}
            >
              {difficultyHint}
            </span>
          </div>

          {/* Compact Play pill, anchored bottom-center */}
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label={`Play ${game.title}`}
            tabIndex={flipped ? 0 : -1}
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "5px 14px",
              minHeight: 28,
              background: color,
              color: "#000",
              border: "none",
              borderRadius: 999,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: FONT,
              letterSpacing: "-0.01em",
              boxShadow: `0 4px 14px ${color}40`,
              transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
              WebkitTapHighlightColor: "transparent",
              opacity: playReady ? 1 : 0,
              animation:
                playReady && !reducedMotion
                  ? "flipCardPlayPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both"
                  : "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              lineHeight: 1,
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateX(-50%) scale(0.94)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateX(-50%) scale(1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(-50%) scale(1)";
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "translateX(-50%) scale(0.94)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "translateX(-50%) scale(1)";
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 9 }}>▶</span>
            Play
          </button>
        </div>
      </div>
    </div>
  );
}
