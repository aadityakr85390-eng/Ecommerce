const svgToDataUri = (svg) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export const productPlaceholder = (title = "Product") =>
  svgToDataUri(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b0f"/>
      <stop offset="1" stop-color="#2a2a44"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" rx="48" fill="url(#g)"/>
  <circle cx="980" cy="180" r="220" fill="rgba(255,255,255,0.08)"/>
  <circle cx="220" cy="760" r="260" fill="rgba(255,255,255,0.06)"/>
  <text x="80" y="420" fill="rgba(255,255,255,0.92)" font-family="Poppins, Arial, sans-serif" font-size="54" font-weight="700">
    ${String(title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
  </text>
  <text x="80" y="490" fill="rgba(255,255,255,0.70)" font-family="Poppins, Arial, sans-serif" font-size="28">
    Image unavailable — showing placeholder
  </text>
</svg>`);

export const safeImgProps = (altText) => ({
  alt: altText,
  onError: (e) => {
    const el = e.currentTarget;
    if (el?.dataset?.fallbackApplied) return;
    if (el?.dataset) el.dataset.fallbackApplied = "1";
    el.src = productPlaceholder(altText);
  },
});

