// WovenMap wordmark + lockup. Brand-faithful per §01 + §04 of brand guide.
// Wordmark: Inter, weight 200, letter-spacing −.04em, lowercase. "woven" in
// the foreground color, "map" in the accent (champagne on dark, amber on light).
// Mark is single-color (never bicolor).

const FONT_OPTIONS = {
  inter:        { family: "'Inter', system-ui, sans-serif",                            weight: 200, letterSpacing: "-0.04em", italic: false, label: "Inter 200 (brand)" },
  interTight:   { family: "'Inter Tight', Inter, system-ui, sans-serif",               weight: 300, letterSpacing: "-0.04em", italic: false, label: "Inter Tight 300" },
  fraunces:     { family: "'Fraunces', Georgia, serif",                                 weight: 300, letterSpacing: "-0.02em", italic: false, label: "Fraunces 300" },
  frauncesIt:   { family: "'Fraunces', Georgia, serif",                                 weight: 300, letterSpacing: "-0.015em", italic: true, label: "Fraunces 300 italic" },
  newsreader:   { family: "'Newsreader', Georgia, serif",                               weight: 400, letterSpacing: "-0.01em", italic: false, label: "Newsreader 400" },
  ibmMono:      { family: "'IBM Plex Mono', ui-monospace, monospace",                   weight: 400, letterSpacing: "-0.02em", italic: false, label: "IBM Plex Mono" },
};

const Wordmark = ({
  font = "inter",
  weight,
  size = 56,
  ink,
  accent,
  splitColor = true,
  caseMode = "title", // brand: capital W, capital M
  tracking,
}) => {
  const f = FONT_OPTIONS[font] || FONT_OPTIONS.inter;
  const text = (() => {
    if (caseMode === "title") return ["Woven", "Map"];
    if (caseMode === "upper") return ["WOVEN", "MAP"];
    return ["woven", "map"];
  })();
  return (
    <span
      style={{
        fontFamily: f.family,
        fontWeight: weight ?? f.weight,
        fontStyle: f.italic ? "italic" : "normal",
        letterSpacing: tracking ?? f.letterSpacing,
        fontSize: size,
        lineHeight: 0.95,
        color: ink,
        whiteSpace: "nowrap",
      }}
    >
      <span>{text[0]}</span>
      <span style={{ color: splitColor ? accent : ink }}>{text[1]}</span>
    </span>
  );
};

const Lockup = ({
  markKey = "canonical",
  font = "inter",
  fontWeight,
  fontSize = 56,
  ink = "#0e1729",
  accent = "#c9a16a",
  stroke = 2,
  markSize = 90,
  gap = 28,
  arrangement = "horizontal", // 'horizontal' | 'stacked' | 'wordmark-only' | 'mark-only'
  splitColor = true,
  caseMode = "lower",
  tracking,
  // Mark color: per brand, mark is single-color. Pass markColor explicitly,
  // otherwise defaults to accent (champagne on dark) or ink (on light).
  markColor,
}) => {
  const def = window.WovenMarks?.[markKey];
  if (!def) return null;
  const Mark = def.Comp;
  const mInk = markColor ?? accent;

  if (arrangement === "wordmark-only") {
    return (
      <Wordmark font={font} weight={fontWeight} size={fontSize} ink={ink} accent={accent} splitColor={splitColor} caseMode={caseMode} tracking={tracking} />
    );
  }
  if (arrangement === "mark-only") {
    return <Mark ink={mInk} stroke={stroke} size={markSize} />;
  }
  if (arrangement === "stacked") {
    return (
      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap }}>
        <Mark ink={mInk} stroke={stroke} size={markSize} />
        <Wordmark font={font} weight={fontWeight} size={fontSize} ink={ink} accent={accent} splitColor={splitColor} caseMode={caseMode} tracking={tracking} />
      </div>
    );
  }
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap }}>
      <Mark ink={mInk} stroke={stroke} size={markSize} />
      <Wordmark font={font} weight={fontWeight} size={fontSize} ink={ink} accent={accent} splitColor={splitColor} caseMode={caseMode} tracking={tracking} />
    </div>
  );
};

const FaviconTile = ({
  markKey = "simple",
  ink = "#0e1729",
  bg = "#f4ede0",
  stroke = 3,
  size = 64,
  rounded = 12,
}) => {
  const def = window.WovenMarks?.[markKey];
  if (!def) return null;
  const Mark = def.Comp;
  return (
    <div
      style={{
        width: size,
        height: size,
        background: bg,
        borderRadius: rounded,
        display: "grid",
        placeItems: "center",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06) inset",
      }}
    >
      <Mark ink={ink} stroke={stroke} size={Math.round(size * 0.78)} />
    </div>
  );
};

window.FONT_OPTIONS = FONT_OPTIONS;
window.Wordmark = Wordmark;
window.Lockup = Lockup;
window.FaviconTile = FaviconTile;
