// WovenMap teaser landing page.
// Locked logo (canonical mark + Inter 200 wordmark) on night palette.
// Living mark (slow rotation + breathing haze).
// Headline → hint paragraph → email capture → whisper line.

const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakText, TweakToggle, SignupForm, AdminPanel } = window;

// ─── Locked-logo defaults + copy variants ───────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headlineVariant": "default",
  "paragraphVariant": "v1",
  "rotationSpeed": 90,
  "haze": true,
  "grain": true,
  "whisper": true,
  "endpointUrl": "",
  "ctaLabel": "Get the first invite",
  "ctaPlaceholder": "your email",
  "showLaunchHint": false,
  "launchHint": "Soon"
}/*EDITMODE-END*/;

const PARAGRAPHS = {
  v1: "Every life runs on an invisible web — the people you owe a call, the projects you're quietly carrying, the promises you've half-forgotten you made. WovenMap is what happens when you can finally see it.",
  v2: "There's a hidden map under every life: who matters, what's owed, what's slipping. Most of us run on it without ever looking. Soon, you can.",
  v3: "The relationships you keep, the things you said you'd do, the threads you're holding without realising — they all sit on a map you've never been shown. We're drawing it.",
};

const HEADLINES = {
  default: { lead: "You're running on a map", italic: "you can't see." },
  inverted: { lead: "Everything you carry", italic: "lives on one map." },
  short:    { lead: "There's a map", italic: "you've never been shown." },
};

// ─── Palette ────────────────────────────────────────────────────────────────
const P = {
  bg: "#0a1020",
  bgGradTop: "#1a253f",
  bgGradBottom: "#070c18",
  ink: "#f4ede0",
  inkSoft: "rgba(244,237,224,0.62)",
  inkFaint: "rgba(244,237,224,0.30)",
  accent: "#c9a16a",
  rule: "rgba(201,161,106,0.22)",
  field: "rgba(244,237,224,0.04)",
  fieldBorder: "rgba(244,237,224,0.18)",
};

// ─── The living mark ────────────────────────────────────────────────────────
// Same canonical geometry as the locked mark, wrapped in a rotation transform
// driven by a CSS keyframe — rotationSpeed = seconds per full revolution.
function LivingMark({ size = 220, rotationSpeed = 90, haze = true, ink = P.accent }) {
  const cx = 100, cy = 100;
  const Rcard = 84, Rdiag = 60;
  const innerStop = 14;
  const endR = 4.0, beadR = 1.9;
  const beadFracFromEnd = 0.30, bowFraction = 0.18;
  const stroke = 2;
  const bearings = [
    { deg: -90, len: Rcard }, { deg: -45, len: Rdiag },
    { deg:   0, len: Rcard }, { deg:  45, len: Rdiag },
    { deg:  90, len: Rcard }, { deg: 135, len: Rdiag },
    { deg: 180, len: Rcard }, { deg:-135, len: Rdiag },
  ];
  const rad = (d) => (d * Math.PI) / 180;
  const f = (n) => Number(n.toFixed(2));

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* Breathing outer haze — independent of the rotation so it pulses in place */}
      {haze && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -size * 0.4,
            background: `radial-gradient(circle at center, ${ink}38 0%, ${ink}14 25%, transparent 60%)`,
            filter: "blur(20px)",
            animation: "wm-breathe 7s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{
          position: "relative",
          display: "block",
          animation: `wm-rotate ${rotationSpeed}s linear infinite`,
          transformOrigin: "center",
        }}
      >
        <g stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none">
          {bearings.map((b, i) => {
            const a = rad(b.deg);
            const ex = cx + Math.cos(a) * b.len, ey = cy + Math.sin(a) * b.len;
            const ix = cx + Math.cos(a) * innerStop, iy = cy + Math.sin(a) * innerStop;
            const px = -Math.sin(a), py = Math.cos(a);
            const armLen = b.len - innerStop, bow = armLen * bowFraction;
            const c1x = ex + (ix - ex) * 0.33 + px * bow;
            const c1y = ey + (iy - ey) * 0.33 + py * bow;
            const c2x = ex + (ix - ex) * 0.67 + px * bow;
            const c2y = ey + (iy - ey) * 0.67 + py * bow;
            return (
              <path
                key={i}
                d={`M ${f(ex)} ${f(ey)} C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(ix)} ${f(iy)}`}
              />
            );
          })}
        </g>
        <g fill={ink}>
          {bearings.map((b, i) => {
            const a = rad(b.deg);
            return (
              <circle
                key={i}
                cx={f(cx + Math.cos(a) * b.len)}
                cy={f(cy + Math.sin(a) * b.len)}
                r={endR}
              />
            );
          })}
        </g>
        <g fill={ink}>
          {bearings.map((b, i) => {
            const a = rad(b.deg);
            const t = beadFracFromEnd;
            const armLen = b.len - innerStop;
            const r = b.len - armLen * t;
            const px = -Math.sin(a), py = Math.cos(a);
            const bow = armLen * bowFraction;
            const bowAtT = bow * 4 * t * (1 - t);
            return (
              <circle
                key={i}
                cx={f(cx + Math.cos(a) * r + px * bowAtT)}
                cy={f(cy + Math.sin(a) * r + py * bowAtT)}
                r={beadR}
              />
            );
          })}
        </g>
        <circle cx={cx} cy={cy} r="11" stroke={ink} strokeWidth={stroke * 0.7} fill="none" opacity="0.85" />
        <g stroke={ink} strokeWidth={stroke * 0.9} strokeLinecap="round">
          <line x1={cx} y1={cy - 24} x2={cx} y2={cy - 3} />
          <line x1={cx} y1={cy + 3}  x2={cx} y2={cy + 24} />
          <line x1={cx - 24} y1={cy} x2={cx - 3} y2={cy} />
          <line x1={cx + 3}  y1={cy} x2={cx + 24} y2={cy} />
        </g>
        <g stroke={ink} strokeWidth={stroke * 0.7} strokeLinecap="round" opacity="0.55">
          <line x1={cx} y1={4}   x2={cx} y2={13}  />
          <line x1={cx} y1={187} x2={cx} y2={196} />
          <line x1={4}   y1={cy} x2={13}  y2={cy} />
          <line x1={187} y1={cy} x2={196} y2={cy} />
        </g>
        <circle cx={cx} cy={cy} r="1.8" fill={ink} />
      </svg>
    </div>
  );
}

// ─── Wordmark — Inter 200 Title-case two-tone ───────────────────────────────
function Wordmark({ size = 56 }) {
  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontWeight: 200,
        fontSize: size,
        letterSpacing: "-0.04em",
        color: P.ink,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      Woven<span style={{ color: P.accent }}>Map</span>
    </div>
  );
}

// ─── Whisper line — slowly scrolling marquee ────────────────────────────────
function Whisper() {
  const phrase =
    "Everyone is woven into something  ·  partners  ·  parents  ·  friends  ·  projects  ·  promises  ·  the quiet things that hold a life together  ·  WovenMap shows you yours  ·  ";
  // Repeat enough to fill — the keyframe scrolls -50% so the loop is seamless.
  const text = phrase.repeat(6);
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
        height: 48,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        background: `linear-gradient(to top, ${P.bg} 30%, transparent 100%)`,
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "wm-whisper 240s linear infinite",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 12,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(244,237,224,0.32)",
        }}
      >
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const headline = HEADLINES[t.headlineVariant] || HEADLINES.default;
  const paragraph = PARAGRAPHS[t.paragraphVariant] || PARAGRAPHS.v1;

  return (
    <>
      <style>{`
        @keyframes wm-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes wm-breathe {
          0%, 100% { opacity: 0.45; transform: scale(0.97); }
          50%      { opacity: 0.75; transform: scale(1.06); }
        }
        @keyframes wm-whisper {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes wm-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wm-fade-1 { animation: wm-fade-in 1100ms ease-out 100ms both; }
        .wm-fade-2 { animation: wm-fade-in 1100ms ease-out 350ms both; }
        .wm-fade-3 { animation: wm-fade-in 1100ms ease-out 600ms both; }
        .wm-fade-4 { animation: wm-fade-in 1100ms ease-out 900ms both; }
        .wm-fade-5 { animation: wm-fade-in 1400ms ease-out 1300ms both; }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: `radial-gradient(ellipse at 50% 35%, ${P.bgGradTop} 0%, ${P.bg} 55%, ${P.bgGradBottom} 100%)`,
          color: P.ink,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Paper grain — subtle SVG noise */}
        {t.grain && (
          <div
            aria-hidden
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.05,
              mixBlendMode: "overlay",
              backgroundImage:
                "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMDAnIGhlaWdodD0nMjAwJz48ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuODUnIG51bU9jdGF2ZXM9JzInIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9JzAgMCAwIDAgMSAgMCAwIDAgMCAxICAwIDAgMCAwIDEgIDAgMCAwIDAuNiAwJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoI25vaXNlKScvPjwvc3ZnPg==\")",
            }}
          />
        )}

        {/* Top bar — wordmark only, small */}
        <header
          style={{
            padding: "20px 40px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 2,
          }}
          className="wm-fade-1"
        >
          <Wordmark size={22} />
          {t.showLaunchHint && (
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: P.inkSoft,
              }}
            >
              {t.launchHint}
            </div>
          )}
        </header>

        {/* Center column */}
        <section
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "center",
            padding: "8px 28px 140px",
            gap: 28,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="wm-fade-2">
            <LivingMark size={170} rotationSpeed={t.rotationSpeed} haze={t.haze} ink={P.accent} />
          </div>

          <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <h1
              className="wm-fade-3"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 300,
                fontVariationSettings: '"opsz" 144',
                fontSize: "clamp(30px, 4.5vw, 52px)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                margin: 0,
                color: P.ink,
              }}
            >
              {headline.lead}{" "}
              <span style={{ fontStyle: "italic", color: P.accent }}>{headline.italic}</span>
            </h1>

            <p
              className="wm-fade-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(15px, 1.5vw, 17px)",
                lineHeight: 1.7,
                letterSpacing: "-0.005em",
                color: P.inkSoft,
                margin: 0,
                maxWidth: 560,
                textWrap: "pretty",
              }}
            >
              {paragraph}
            </p>
          </div>

          <div className="wm-fade-5" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <SignupForm endpointUrl={t.endpointUrl} ctaLabel={t.ctaLabel} ctaPlaceholder={t.ctaPlaceholder} />
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: P.inkFaint,
              }}
            >
              No marketing. One message, when it's time.
            </div>
          </div>
        </section>

        {/* Whisper marquee */}
        {t.whisper && <Whisper />}

        {/* Trademark + copyright footer (above the whisper marquee in stacking) */}
        <div
          aria-label="Legal"
          style={{
            position: "fixed",
            bottom: t.whisper ? 52 : 14,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: P.inkFaint,
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          WovenMap™ · © 2026 WovenMap · all rights reserved
        </div>
      </main>

      {/* Hidden admin panel — Ctrl/Cmd + Shift + E */}
      <AdminPanel />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Copy">
          <TweakSelect
            label="Headline"
            value={t.headlineVariant}
            onChange={(v) => setTweak("headlineVariant", v)}
            options={[
              { value: "default", label: "Map you can't see (locked)" },
              { value: "inverted", label: "Everything you carry…" },
              { value: "short", label: "There's a map…" },
            ]}
          />
          <TweakSelect
            label="Paragraph"
            value={t.paragraphVariant}
            onChange={(v) => setTweak("paragraphVariant", v)}
            options={[
              { value: "v1", label: "v1 — invisible web" },
              { value: "v2", label: "v2 — hidden map" },
              { value: "v3", label: "v3 — threads you're holding" },
            ]}
          />
          <TweakText label="CTA label" value={t.ctaLabel} onChange={(v) => setTweak("ctaLabel", v)} />
          <TweakText label="CTA placeholder" value={t.ctaPlaceholder} onChange={(v) => setTweak("ctaPlaceholder", v)} />
        </TweakSection>
        <TweakSection label="Motion & atmosphere">
          <TweakSlider label="Rotation (sec / turn)" value={t.rotationSpeed} min={20} max={240} step={5} onChange={(v) => setTweak("rotationSpeed", v)} />
          <TweakToggle label="Breathing haze" value={t.haze} onChange={(v) => setTweak("haze", v)} />
          <TweakToggle label="Paper grain" value={t.grain} onChange={(v) => setTweak("grain", v)} />
          <TweakToggle label="Whisper line" value={t.whisper} onChange={(v) => setTweak("whisper", v)} />
        </TweakSection>
        <TweakSection label="Launch hint">
          <TweakToggle label="Show hint" value={t.showLaunchHint} onChange={(v) => setTweak("showLaunchHint", v)} />
          <TweakText label="Hint text" value={t.launchHint} onChange={(v) => setTweak("launchHint", v)} />
        </TweakSection>
        <TweakSection label="Form">
          <TweakText
            label="Fallback endpoint URL"
            value={t.endpointUrl}
            onChange={(v) => setTweak("endpointUrl", v)}
          />
          <div style={{ fontSize: 11, opacity: 0.6, lineHeight: 1.5, padding: "0 4px" }}>
            Web3Forms key lives in <code>index.html</code> (<code>window.WM_CONFIG</code>).
            This field is only used as a generic JSON fallback when no Web3Forms key is set.
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
