const CONFETTI_COLORS = [
  "#10b981",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
  "#0ea5e9",
  "#f43f5e",
];

export const launchConfetti = ({ count = 120, duration = 1500 } = {}) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.overflow = "hidden";
  container.style.zIndex = "9999";

  const viewportWidth = window.innerWidth || 1280;
  const viewportHeight = window.innerHeight || 720;

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 8;
    const startX = Math.random() * viewportWidth;
    const drift = (Math.random() - 0.5) * 260;
    const fallDistance = viewportHeight + 100 + Math.random() * 80;
    const rotate = (Math.random() - 0.5) * 960;
    const delay = Math.random() * 200;
    const pieceDuration = 900 + Math.random() * duration;
    const opacity = 0.7 + Math.random() * 0.3;

    piece.style.position = "absolute";
    piece.style.left = "0";
    piece.style.top = "0";
    piece.style.width = `${size}px`;
    piece.style.height = `${size * (0.6 + Math.random() * 0.6)}px`;
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.borderRadius = Math.random() > 0.6 ? "999px" : "2px";
    piece.style.opacity = String(opacity);

    piece.animate(
      [
        { transform: `translate3d(${startX}px, -24px, 0) rotate(0deg)` },
        { transform: `translate3d(${startX + drift}px, ${fallDistance}px, 0) rotate(${rotate}deg)` },
      ],
      {
        duration: pieceDuration,
        delay,
        easing: "cubic-bezier(0.15, 0.75, 0.35, 1)",
        fill: "forwards",
      }
    );

    container.appendChild(piece);
  }

  document.body.appendChild(container);

  window.setTimeout(() => {
    container.remove();
  }, duration + 1800);
};

