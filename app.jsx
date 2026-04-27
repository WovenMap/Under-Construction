// WovenMap logo system — design canvas with the brand-faithful mark family.

const { DesignCanvas, DCSection, DCArtboard } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakSlider, TweakRadio, TweakSelect, TweakColor, TweakToggle } = window;
const { Lockup, FaviconTile, FONT_OPTIONS } = window;

// Locked WovenMap logo defaults:
//   mark = canonical · font = Inter 200 · case = Title · two-tone (woven|map)
//   palette = night (a Day-palette hero is presented alongside in §00)
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "night",
  "showcaseMark": "canonical",
  "font": "inter",
  "fontWeight": 200,
  "fontSize": 64,
  "markSize": 96,
  "stroke": 2,
  "gap": 28,
  "splitColor": true,
  "caseMode": "title",
  "tracking": "-0.04em"
}/*EDITMODE-END*/;

// Brand palettes per §03.
const PALETTES = {
  night: {
    bg: "#0e1729",
    bg2: "#172238",
    ink: "#f4ede0",     // cream — wordmark "woven"
    accent: "#c9a16a",  // champagne — wordmark "map" + mark
    label: "rgba(244,237,224,0.55)",
    rule: "rgba(201,161,106,0.25)",
    paperTile: "#0e1729",
  },
  day: {
    bg: "#faf6ee",
    bg2: "#f1ebdc",
    ink: "#1a1612",
    accent: "#c2761b",
    label: "rgba(26,22,18,0.5)",
    rule: "rgba(26,22,18,0.12)",
    paperTile: "#faf6ee",
  },
};

// ----- Card primitives ------------------------------------------------------

function ArtCard({ children, mode, padded = true, align = "center", justify = "center" }) {
  const p = PALETTES[mode];
  return (
    <div
      style={{
        background: p.bg,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        justifyContent: justify,
        padding: padded ? 28 : 0,
        position: "relative",
        border: `1px solid ${p.rule}`,
      }}
    >
      {children}
    </div>
  );
}

function ArtMeta({ name, blurb, mode }) {
  const p = PALETTES[mode];
  return (
    <div style={{ position: "absolute", left: 16, top: 12, right: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
      <span style={metaStyle(p)}>{name}</span>
      {blurb && <span style={{ ...metaStyle(p), opacity: 0.55 }}>{blurb}</span>}
    </div>
  );
}

function FootMeta({ children, mode }) {
  const p = PALETTES[mode];
  return (
    <div style={{ position: "absolute", left: 16, bottom: 12, right: 16, display: "flex", justifyContent: "space-between" }}>
      <span style={{ ...metaStyle(p), opacity: 0.55 }}>{children}</span>
    </div>
  );
}

function metaStyle(p) {
  return {
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
    fontSize: 10.5,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: p.label,
  };
}

// ----- Artboards ------------------------------------------------------------

function MarkShowcase({ markKey, mode, name, blurb, t, big = false }) {
  const p = PALETTES[mode];
  return (
    <ArtCard mode={mode}>
      <ArtMeta name={name} blurb={blurb} mode={mode} />
      <Lockup
        markKey={markKey}
        ink={p.ink}
        accent={p.accent}
        markColor={p.accent}
        stroke={t.stroke}
        markSize={big ? 160 : 120}
        arrangement="mark-only"
      />
      <FootMeta mode={mode}>mark · {big ? 160 : 120}px</FootMeta>
    </ArtCard>
  );
}

function HorizontalLockup({ markKey, mode, t, label }) {
  const p = PALETTES[mode];
  return (
    <ArtCard mode={mode}>
      <ArtMeta name={label || "Horizontal lockup"} mode={mode} />
      <Lockup
        markKey={markKey}
        font={t.font}
        fontWeight={t.fontWeight}
        fontSize={t.fontSize}
        ink={p.ink}
        accent={p.accent}
        markColor={p.accent}
        stroke={t.stroke}
        markSize={t.markSize}
        gap={t.gap}
        arrangement="horizontal"
        splitColor={t.splitColor}
        caseMode={t.caseMode}
        tracking={t.tracking}
      />
      <FootMeta mode={mode}>horizontal · {markKey}</FootMeta>
    </ArtCard>
  );
}

function StackedLockup({ markKey, mode, t }) {
  const p = PALETTES[mode];
  return (
    <ArtCard mode={mode}>
      <ArtMeta name="Stacked lockup" mode={mode} />
      <Lockup
        markKey={markKey}
        font={t.font}
        fontWeight={t.fontWeight}
        fontSize={t.fontSize}
        ink={p.ink}
        accent={p.accent}
        markColor={p.accent}
        stroke={t.stroke}
        markSize={t.markSize + 16}
        gap={20}
        arrangement="stacked"
        splitColor={t.splitColor}
        caseMode={t.caseMode}
        tracking={t.tracking}
      />
      <FootMeta mode={mode}>stacked</FootMeta>
    </ArtCard>
  );
}

function FaviconRow({ markKey, mode, t }) {
  const p = PALETTES[mode];
  // Favicon mark is single-color ink-on-tile per brand. Use the simplified
  // mark when very small.
  return (
    <ArtCard mode={mode}>
      <ArtMeta name="Favicon · multi-size" mode={mode} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
        {[16, 24, 32, 48, 64, 96].map((s) => {
          const useSimple = s <= 32;
          return (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <FaviconTile
                markKey={useSimple ? "simple" : markKey}
                ink={p.accent}
                bg={mode === "night" ? "#172238" : p.bg2}
                stroke={s <= 24 ? 4 : t.stroke + 0.6}
                size={s}
                rounded={Math.max(2, s * 0.18)}
              />
              <span style={{ ...metaStyle(p), opacity: 0.6 }}>{s}</span>
            </div>
          );
        })}
      </div>
      <FootMeta mode={mode}>favicon · simplified ≤ 32px</FootMeta>
    </ArtCard>
  );
}

function AppIconArtboard({ markKey, mode }) {
  const p = PALETTES[mode];
  const sizes = [180, 120, 80];
  return (
    <ArtCard mode={mode}>
      <ArtMeta name="App icon · iOS" mode={mode} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
        {sizes.map((s) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <FaviconTile
              markKey={markKey}
              ink={p.accent}
              bg={mode === "night" ? "#0e1729" : p.bg2}
              stroke={3}
              size={s}
              rounded={s * 0.225}
            />
            <span style={{ ...metaStyle(p), opacity: 0.6 }}>{s}px</span>
          </div>
        ))}
      </div>
      <FootMeta mode={mode}>rounded · iOS</FootMeta>
    </ArtCard>
  );
}

function HeroArtboard({ markKey, t, mode = "night" }) {
  // Echoes the brand brochure hero — large mark, large wordmark, tagline.
  // Renders in either palette so the locked logo lives as a pair.
  const p = PALETTES[mode];
  const isNight = mode === "night";
  return (
    <div
      style={{
        height: "100%",
        background: isNight
          ? `radial-gradient(ellipse at top, #1a253f 0%, ${p.bg} 60%)`
          : `radial-gradient(ellipse at top, #fbf3df 0%, ${p.bg} 65%)`,
        color: p.ink,
        position: "relative",
        padding: "60px 64px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <ArtMeta name="Hero · brochure surface" blurb={`${mode} palette`} mode={mode} />
      <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 20 }}>
        <Lockup
          markKey={markKey}
          ink={p.ink}
          accent={p.accent}
          markColor={p.accent}
          stroke={t.stroke}
          markSize={140}
          fontSize={96}
          font="inter"
          fontWeight={200}
          tracking="-0.04em"
          gap={32}
          splitColor
          caseMode="title"
          arrangement="horizontal"
        />
      </div>
      <div style={{ maxWidth: 720 }}>
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontVariationSettings: '"opsz" 144',
            fontSize: 38,
            lineHeight: 1.12,
            letterSpacing: "-0.018em",
            color: p.ink,
          }}
        >
          Everyone's running on a hidden web of people, projects and promises.{" "}
          <span style={{ fontStyle: "italic", color: p.accent }}>WovenMap shows you yours.</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ height: 1, width: 80, background: isNight ? "rgba(201,161,106,0.4)" : "rgba(194,118,27,0.4)" }} />
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: p.accent,
          }}
        >
          See what's really going on
        </span>
      </div>
    </div>
  );
}

function DocHeaderArtboard({ markKey, t }) {
  const p = PALETTES.day;
  return (
    <div style={{ height: "100%", background: p.bg, padding: "60px 56px 40px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", border: `1px solid ${p.rule}`, position: "relative" }}>
      <ArtMeta name="Document header · day palette" mode="day" />
      <Lockup
        markKey={markKey}
        font="inter"
        fontWeight={200}
        fontSize={32}
        ink={p.ink}
        accent={p.accent}
        markColor={p.ink}
        stroke={t.stroke}
        markSize={48}
        gap={16}
        arrangement="horizontal"
        splitColor
        caseMode="title"
        tracking="-0.04em"
      />
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 540 }}>
          <div style={{ ...metaStyle(p), marginBottom: 14, color: p.accent }}>The Hidden Map · Essay</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontVariationSettings: '"opsz" 144', fontSize: 36, lineHeight: 1.18, color: p.ink, letterSpacing: "-0.012em" }}>
            If you say the story right, people sell the product to each other.{" "}
            <span style={{ fontStyle: "italic", color: p.accent }}>If you say it wrong, you sell it one user at a time, forever.</span>
          </div>
          <div style={{ width: 60, height: 2, marginTop: 22, background: p.accent }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={metaStyle(p)}>wovenmap · 2026</span>
        <span style={metaStyle(p)}>page 01 / 14</span>
      </div>
    </div>
  );
}

function MonoArtboard({ markKey, mode, t }) {
  const p = PALETTES[mode];
  return (
    <ArtCard mode={mode}>
      <ArtMeta name="Single-ink · mono" mode={mode} />
      <Lockup
        markKey={markKey}
        font={t.font}
        fontWeight={t.fontWeight}
        fontSize={t.fontSize}
        ink={p.ink}
        accent={p.ink}
        markColor={p.ink}
        stroke={t.stroke}
        markSize={t.markSize}
        gap={t.gap}
        arrangement="horizontal"
        splitColor={false}
        caseMode={t.caseMode}
        tracking={t.tracking}
      />
      <FootMeta mode={mode}>1-color reproduction</FootMeta>
    </ArtCard>
  );
}

function TypeArtboard({ font, mode, t }) {
  const p = PALETTES[mode];
  return (
    <ArtCard mode={mode}>
      <ArtMeta name={FONT_OPTIONS[font].label} mode={mode} />
      <Lockup
        markKey="canonical"
        font={font}
        fontSize={56}
        ink={p.ink}
        accent={p.accent}
        arrangement="wordmark-only"
        splitColor
        caseMode="title"
      />
      <FootMeta mode={mode}>wordmark · two-tone</FootMeta>
    </ArtCard>
  );
}

// ----- App ------------------------------------------------------------------

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const mode = t.mode;
  const p = PALETTES[mode];

  React.useEffect(() => {
    document.body.style.background = mode === "night" ? "#0a1020" : "#ece5d6";
  }, [mode]);

  const markKeys = Object.keys(window.WovenMarks);
  const showcase = t.showcaseMark;
  const showcaseDef = window.WovenMarks[showcase];

  return (
    <>
      <DesignCanvas
        title="WovenMap · logo system"
        subtitle="Brand-faithful per §05 of the brand guide. 9 mark variations · type · lockups · application."
      >
        <DCSection id="hero" title="00 · Hero · night & day" subtitle="Locked logo: canonical mark · Inter 200 · Title case · two-tone wordmark, on both palettes.">
          <DCArtboard id="hero-night" label="Night hero" width={1100} height={520}>
            <HeroArtboard markKey={showcase} t={t} mode="night" />
          </DCArtboard>
          <DCArtboard id="hero-day" label="Day hero" width={1100} height={520}>
            <HeroArtboard markKey={showcase} t={t} mode="day" />
          </DCArtboard>
        </DCSection>

        <DCSection id="marks" title="01 · The mark · 9 variations" subtitle="Anchor: canonical 4-thread, 8-bearing weave from §05. Variations stay inside the system.">
          {markKeys.map((k) => {
            const def = window.WovenMarks[k];
            return (
              <DCArtboard key={k} id={`mark-${k}`} label={def.name} width={300} height={300}>
                <MarkShowcase markKey={k} mode={mode} name={def.name} blurb={def.blurb} t={t} />
              </DCArtboard>
            );
          })}
        </DCSection>

        <DCSection id="featured" title="02 · Featured mark in lockup" subtitle={`Currently "${showcaseDef.name}" — change via Tweaks · ${mode} palette.`}>
          <DCArtboard id="lockup-h" label="Horizontal" width={620} height={260}>
            <HorizontalLockup markKey={showcase} mode={mode} t={t} />
          </DCArtboard>
          <DCArtboard id="lockup-stacked" label="Stacked" width={420} height={400}>
            <StackedLockup markKey={showcase} mode={mode} t={t} />
          </DCArtboard>
          <DCArtboard id="lockup-mono" label="Mono" width={620} height={260}>
            <MonoArtboard markKey={showcase} mode={mode} t={t} />
          </DCArtboard>
        </DCSection>

        <DCSection id="all-lockups" title="03 · Every variation in lockup" subtitle="Compare the wordmark + mark pairing across every variation.">
          {markKeys.map((k) => {
            const def = window.WovenMarks[k];
            return (
              <DCArtboard key={k} id={`lockup-${k}`} label={def.name} width={520} height={200}>
                <HorizontalLockup markKey={k} mode={mode} t={t} label={def.name} />
              </DCArtboard>
            );
          })}
        </DCSection>

        <DCSection id="type" title="04 · Wordmark type options" subtitle="Brand spec is Inter 200, lowercase. Adjacent options for editorial / utility surfaces.">
          {Object.keys(FONT_OPTIONS).map((f) => (
            <DCArtboard key={f} id={`type-${f}`} label={FONT_OPTIONS[f].label} width={500} height={180}>
              <TypeArtboard font={f} mode={mode} t={t} />
            </DCArtboard>
          ))}
        </DCSection>

        <DCSection id="apps" title="05 · In application" subtitle="Favicon, app icon, document header.">
          <DCArtboard id="app-favicon" label="Favicon" width={680} height={240}>
            <FaviconRow markKey={showcase} mode={mode} t={t} />
          </DCArtboard>
          <DCArtboard id="app-icon" label="App icon" width={680} height={300}>
            <AppIconArtboard markKey={showcase} mode={mode} />
          </DCArtboard>
          <DCArtboard id="app-doc" label="Document header" width={820} height={520}>
            <DocHeaderArtboard markKey={showcase} t={t} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Register">
          <TweakRadio
            label="Palette"
            value={mode}
            onChange={(v) => setTweak("mode", v)}
            options={[
              { value: "night", label: "Night" },
              { value: "day", label: "Day" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Featured mark">
          <TweakSelect
            label="Showcase"
            value={t.showcaseMark}
            onChange={(v) => setTweak("showcaseMark", v)}
            options={markKeys.map((k) => ({ value: k, label: window.WovenMarks[k].name }))}
          />
          <TweakSlider label="Mark size" value={t.markSize} min={48} max={140} step={1} onChange={(v) => setTweak("markSize", v)} />
          <TweakSlider label="Stroke" value={t.stroke} min={1} max={4} step={0.1} onChange={(v) => setTweak("stroke", v)} />
        </TweakSection>

        <TweakSection label="Wordmark">
          <TweakSelect
            label="Font"
            value={t.font}
            onChange={(v) => setTweak("font", v)}
            options={Object.keys(FONT_OPTIONS).map((k) => ({ value: k, label: FONT_OPTIONS[k].label }))}
          />
          <TweakSlider label="Weight" value={t.fontWeight} min={200} max={500} step={50} onChange={(v) => setTweak("fontWeight", v)} />
          <TweakSlider label="Size" value={t.fontSize} min={28} max={96} step={1} onChange={(v) => setTweak("fontSize", v)} />
          <TweakRadio
            label="Case"
            value={t.caseMode}
            onChange={(v) => setTweak("caseMode", v)}
            options={[
              { value: "lower", label: "lower" },
              { value: "title", label: "Title" },
              { value: "upper", label: "UPPER" },
            ]}
          />
          <TweakSelect
            label="Tracking"
            value={t.tracking}
            onChange={(v) => setTweak("tracking", v)}
            options={[
              { value: "-0.06em", label: "Very tight" },
              { value: "-0.04em", label: "Tight (brand)" },
              { value: "-0.02em", label: "Snug" },
              { value: "0em", label: "Normal" },
              { value: "0.04em", label: "Loose" },
            ]}
          />
          <TweakToggle label="Color split (woven|map)" value={t.splitColor} onChange={(v) => setTweak("splitColor", v)} />
          <TweakSlider label="Lockup gap" value={t.gap} min={8} max={48} step={1} onChange={(v) => setTweak("gap", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
