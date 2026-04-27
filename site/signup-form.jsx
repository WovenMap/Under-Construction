// Multi-step signup form for the WovenMap teaser.
// Step 1: email + name (optional)
// Step 2: demographics — age range, country, life stage, occupation
// Step 3: feature interest — multi-select + open-ended struggle / notes
// Step 4: thank-you popup ("we look forward to sharing more soon")
//
// All submissions persist to localStorage via SignupStore.
// If a Formspree/etc. endpoint is provided in Tweaks, it is mirrored there too —
// failure to reach the endpoint does NOT lose the local copy.

const SF_P = {
  bg: "#0a1020",
  ink: "#f4ede0",
  inkSoft: "rgba(244,237,224,0.62)",
  inkFaint: "rgba(244,237,224,0.30)",
  accent: "#c9a16a",
  rule: "rgba(201,161,106,0.22)",
  field: "rgba(244,237,224,0.04)",
  fieldBorder: "rgba(244,237,224,0.18)",
  fieldFocus: "#c9a16a",
  danger: "#e8a48f",
};

// ─── Option vocabularies ────────────────────────────────────────────────────
const AGE_RANGES = ["under 25", "25–34", "35–44", "45–54", "55–64", "65+"];

const LIFE_STAGES = [
  "studying",
  "early career",
  "mid-career",
  "senior / leading",
  "founder / self-employed",
  "raising young kids",
  "kids out of the house",
  "caring for parents",
  "between things",
];

const FEATURES = [
  { id: "work",         label: "Work & career",         blurb: "the things I'm building professionally" },
  { id: "relationships",label: "Relationships",         blurb: "family, partner, close friends" },
  { id: "community",    label: "Community & wider circle",blurb: "the people just past the inner ring" },
  { id: "health",       label: "Health & body",          blurb: "how I look after myself" },
  { id: "learning",     label: "Learning & curiosity",   blurb: "things I'm trying to understand" },
  { id: "creative",     label: "Creative practice",      blurb: "side things, making, writing" },
  { id: "home",         label: "Home & finances",        blurb: "the running of a life" },
  { id: "meaning",      label: "Meaning & direction",    blurb: "the bigger 'why' question" },
  { id: "rest",         label: "Rest & rhythm",          blurb: "how I recover" },
];

// ─── Tiny shared controls ───────────────────────────────────────────────────
function FieldLabel({ children, hint }) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: 11,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: SF_P.inkSoft,
      }}
    >
      <span>{children}</span>
      {hint && (
        <span
          style={{
            fontWeight: 300,
            letterSpacing: 0,
            textTransform: "none",
            fontSize: 12,
            color: SF_P.inkFaint,
            fontStyle: "italic",
          }}
        >
          {hint}
        </span>
      )}
    </label>
  );
}

function TextInput({ value, onChange, type = "text", placeholder, autoFocus, required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      required={required}
      style={{
        background: SF_P.field,
        border: `1px solid ${SF_P.fieldBorder}`,
        borderRadius: 2,
        outline: "none",
        color: SF_P.ink,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        fontSize: 15,
        letterSpacing: "-0.005em",
        padding: "12px 16px",
        width: "100%",
        transition: "border-color 220ms ease, background 220ms ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = SF_P.fieldFocus;
        e.currentTarget.style.background = "rgba(244,237,224,0.06)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = SF_P.fieldBorder;
        e.currentTarget.style.background = SF_P.field;
      }}
    />
  );
}

function ChipGroup({ options, value, onChange, multi = false }) {
  const isSelected = (v) => (multi ? value.includes(v) : value === v);
  const toggle = (v) => {
    if (multi) {
      if (value.includes(v)) onChange(value.filter((x) => x !== v));
      else onChange([...value, v]);
    } else {
      onChange(v);
    }
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const v = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const sel = isSelected(v);
        return (
          <button
            key={v}
            type="button"
            onClick={() => toggle(v)}
            style={{
              background: sel ? SF_P.accent : "transparent",
              color: sel ? "#0a1020" : SF_P.ink,
              border: `1px solid ${sel ? SF_P.accent : SF_P.fieldBorder}`,
              borderRadius: 999,
              padding: "8px 14px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: sel ? 400 : 300,
              fontSize: 13,
              letterSpacing: "-0.005em",
              cursor: "pointer",
              transition: "all 180ms ease",
            }}
            onMouseEnter={(e) => {
              if (!sel) e.currentTarget.style.borderColor = SF_P.accent;
            }}
            onMouseLeave={(e) => {
              if (!sel) e.currentTarget.style.borderColor = SF_P.fieldBorder;
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function FeatureCheck({ feature, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        width: "100%",
        textAlign: "left",
        padding: "14px 16px",
        background: checked ? "rgba(201,161,106,0.08)" : "transparent",
        border: `1px solid ${checked ? SF_P.accent : SF_P.fieldBorder}`,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 180ms ease",
        color: SF_P.ink,
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!checked) e.currentTarget.style.borderColor = SF_P.accent;
      }}
      onMouseLeave={(e) => {
        if (!checked) e.currentTarget.style.borderColor = SF_P.fieldBorder;
      }}
    >
      <span
        aria-hidden
        style={{
          marginTop: 2,
          width: 16,
          height: 16,
          borderRadius: 2,
          border: `1px solid ${checked ? SF_P.accent : SF_P.fieldBorder}`,
          background: checked ? SF_P.accent : "transparent",
          color: "#0a1020",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          flexShrink: 0,
          transition: "all 180ms ease",
        }}
      >
        {checked ? "✓" : ""}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.005em" }}>
          {feature.label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 300, color: SF_P.inkSoft, fontStyle: "italic" }}>
          {feature.blurb}
        </span>
      </span>
    </button>
  );
}

// ─── Step container with progress dots ──────────────────────────────────────
function StepShell({ step, totalSteps, title, subtitle, children, footer }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        animation: "wm-step-in 480ms ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i === step ? 28 : 6,
              height: 6,
              borderRadius: 999,
              background: i <= step ? SF_P.accent : SF_P.fieldBorder,
              transition: "all 320ms ease",
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 300,
            fontVariationSettings: '"opsz" 144',
            fontSize: "clamp(22px, 2.6vw, 28px)",
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
            margin: 0,
            color: SF_P.ink,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.6,
              color: SF_P.inkSoft,
              margin: 0,
              maxWidth: 460,
              alignSelf: "center",
              textWrap: "pretty",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>

      {footer && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ─── Buttons ────────────────────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, type = "button", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: SF_P.accent,
        color: "#0a1020",
        border: "none",
        padding: "12px 24px",
        borderRadius: 2,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: 13,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "filter 180ms ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.filter = "brightness(1.08)";
      }}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        color: SF_P.inkSoft,
        border: "none",
        padding: "12px 4px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        fontSize: 12,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "color 180ms ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = SF_P.ink)}
      onMouseLeave={(e) => (e.currentTarget.style.color = SF_P.inkSoft)}
    >
      {children}
    </button>
  );
}

// ─── Thank-you popup ────────────────────────────────────────────────────────
function ThanksOverlay({ onClose }) {
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,12,24,0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
        animation: "wm-overlay-in 480ms ease-out",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 520,
          width: "100%",
          background: "linear-gradient(180deg, rgba(26,37,63,0.6) 0%, rgba(10,16,32,0.92) 100%)",
          border: `1px solid ${SF_P.rule}`,
          borderRadius: 4,
          padding: "44px 40px 36px",
          textAlign: "center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          animation: "wm-thanks-in 600ms cubic-bezier(0.2,0.8,0.2,1)",
        }}
      >
        {/* small inline thread mark */}
        <div
          aria-hidden
          style={{
            width: 56,
            height: 56,
            margin: "0 auto 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: SF_P.accent,
          }}
        >
          <svg viewBox="0 0 56 56" width="56" height="56">
            <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <circle cx="28" cy="28" r="22" opacity="0.25" />
              <circle cx="28" cy="28" r="14" opacity="0.45" />
              <circle cx="28" cy="28" r="6" />
              <circle cx="28" cy="28" r="1.6" fill="currentColor" stroke="none" />
            </g>
          </svg>
        </div>

        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: SF_P.accent,
            marginBottom: 14,
          }}
        >
          You're on the list
        </div>

        <h3
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 300,
            fontVariationSettings: '"opsz" 144',
            fontSize: "clamp(26px, 3vw, 34px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: 0,
            marginBottom: 14,
            color: SF_P.ink,
          }}
        >
          Thank you.
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.65,
            color: SF_P.inkSoft,
            margin: 0,
            marginBottom: 28,
            textWrap: "pretty",
          }}
        >
          We look forward to sharing more soon. When there's something to show,
          you'll be among the first to see it.
        </p>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: "transparent",
            color: SF_P.ink,
            border: `1px solid ${SF_P.rule}`,
            borderRadius: 2,
            padding: "10px 22px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 180ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = SF_P.accent;
            e.currentTarget.style.color = SF_P.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = SF_P.rule;
            e.currentTarget.style.color = SF_P.ink;
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── The form itself ────────────────────────────────────────────────────────
function SignupForm({ endpointUrl, ctaLabel, ctaPlaceholder }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    email: "",
    name: "",
    ageRange: "",
    country: "",
    occupation: "",
    lifeStage: "",
    currentTools: "",
    featuresWanted: [],
    biggestStruggle: "",
    earlyTester: false,
    notes: "",
    botcheck: "",
  });
  const [error, setError] = React.useState("");
  const [thanksOpen, setThanksOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const validateStep = () => {
    if (step === 0) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(data.email || "")) {
        setError("Please enter a valid email.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setError("");
    setStep((s) => Math.min(s + 1, 2));
  };
  const back = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!validateStep()) return;
    setSubmitting(true);

    // 1) Always persist locally — this is the source of truth for the mailing list.
    const record = window.SignupStore.add({ ...data, source: "wovenmap.com/teaser" });

    // 2) Mirror to Web3Forms (emails to your inbox). Failure is non-fatal — local copy is safe.
    const w3fKey = (window.WM_CONFIG && window.WM_CONFIG.web3formsKey) || "";
    let remoteStatus = null;
    if (w3fKey) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: w3fKey,
            subject: `WovenMap signup — ${record.email}`,
            from_name: "WovenMap teaser",
            botcheck: data.botcheck || "",
            email: record.email,
            name: record.name || "",
            ageRange: record.ageRange || "",
            lifeStage: record.lifeStage || "",
            country: record.country || "",
            occupation: record.occupation || "",
            featuresWanted: (record.featuresWanted || []).join(", "),
            biggestStruggle: record.biggestStruggle || "",
            earlyTester: record.earlyTester ? "yes" : "no",
            submittedAt: record.submittedAt,
            referrer: record.referrer || "",
          }),
        });
        const json = await res.json().catch(() => ({}));
        remoteStatus = { ok: res.ok && json.success !== false, status: res.status, body: json };
        console.log("[WovenMap] Web3Forms response:", remoteStatus);
        if (!remoteStatus.ok) {
          console.warn("[WovenMap] Web3Forms rejected the submission:", json);
        }
      } catch (err) {
        remoteStatus = { ok: false, error: String(err) };
        console.error("[WovenMap] Web3Forms network error:", err);
      }
      // Persist the remote outcome on the record so the admin panel can show it.
      try {
        const all = window.SignupStore.all();
        const idx = all.findIndex((r) => r.id === record.id);
        if (idx >= 0) {
          all[idx].remoteStatus = remoteStatus;
          localStorage.setItem("wovenmap.signups.v1", JSON.stringify(all));
        }
      } catch (_e) { /* ignore */ }
    } else if (endpointUrl && /^https?:\/\//.test(endpointUrl)) {
      // Fallback: generic JSON endpoint (Formspree, etc.)
      try {
        await fetch(endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(record),
        });
      } catch (_e) {
        // swallow
      }
    }

    setSubmitting(false);
    setThanksOpen(true);
  };

  const closeThanks = () => {
    setThanksOpen(false);
    // Reset for any subsequent visitor on this device
    setData({
      email: "",
      name: "",
      ageRange: "",
      country: "",
      occupation: "",
      lifeStage: "",
      currentTools: "",
      featuresWanted: [],
      biggestStruggle: "",
      earlyTester: false,
      notes: "",
      botcheck: "",
    });
    setStep(0);
  };

  return (
    <>
      <style>{`
        @keyframes wm-step-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wm-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wm-thanks-in {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 560,
          margin: "0 auto",
          padding: "32px 32px 28px",
          background: "rgba(7,12,24,0.55)",
          border: `1px solid ${SF_P.rule}`,
          borderRadius: 3,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          textAlign: "left",
        }}
      >
        {/* Honeypot — hidden from humans, often filled by bots. Submission is dropped if non-empty. */}
        <input
          type="text"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          value={data.botcheck}
          onChange={(e) => set("botcheck", e.target.value)}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        {step === 0 && (
          <StepShell
            step={0}
            totalSteps={3}
            title="Join the early list."
            subtitle="Drop your email. We'll ask two short questions next — it helps us understand who's curious."
            footer={
              <>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: SF_P.inkFaint, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Step 1 of 3
                </span>
                <PrimaryBtn onClick={next}>Continue</PrimaryBtn>
              </>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldLabel>Email</FieldLabel>
              <TextInput
                type="email"
                value={data.email}
                onChange={(v) => set("email", v)}
                placeholder={ctaPlaceholder || "your email"}
                required
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldLabel hint="Optional. We'll use it if we write back personally.">First name</FieldLabel>
              <TextInput
                value={data.name}
                onChange={(v) => set("name", v)}
                placeholder="Alex"
              />
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell
            step={1}
            totalSteps={3}
            title="A little about you."
            subtitle="Just enough to know who's on the list. Skip anything you'd rather not share."
            footer={
              <>
                <GhostBtn onClick={back}>← Back</GhostBtn>
                <PrimaryBtn onClick={next}>Continue</PrimaryBtn>
              </>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FieldLabel>Age range</FieldLabel>
              <ChipGroup
                options={AGE_RANGES}
                value={data.ageRange}
                onChange={(v) => set("ageRange", v)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FieldLabel>Where in life are you?</FieldLabel>
              <ChipGroup
                options={LIFE_STAGES}
                value={data.lifeStage}
                onChange={(v) => set("lifeStage", v)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <FieldLabel>Country</FieldLabel>
                <TextInput
                  value={data.country}
                  onChange={(v) => set("country", v)}
                  placeholder="New Zealand"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <FieldLabel>What you do</FieldLabel>
                <TextInput
                  value={data.occupation}
                  onChange={(v) => set("occupation", v)}
                  placeholder="designer, parent, teacher…"
                />
              </div>
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            step={2}
            totalSteps={3}
            title="What's on your plate?"
            subtitle="Broad strokes only. Where are you putting your attention these days?"
            footer={
              <>
                <GhostBtn onClick={back}>← Back</GhostBtn>
                <PrimaryBtn type="submit" onClick={submit} disabled={submitting}>
                  {submitting ? "Sending…" : (ctaLabel || "Send")}
                </PrimaryBtn>
              </>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldLabel hint="Tick any that ring true — or none.">Areas of life</FieldLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {FEATURES.map((f) => (
                  <FeatureCheck
                    key={f.id}
                    feature={f}
                    checked={data.featuresWanted.includes(f.id)}
                    onToggle={() => {
                      const has = data.featuresWanted.includes(f.id);
                      set(
                        "featuresWanted",
                        has
                          ? data.featuresWanted.filter((x) => x !== f.id)
                          : [...data.featuresWanted, f.id]
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldLabel hint="One sentence is plenty. Anything you'd want to tell us.">
                What made you curious enough to sign up?
              </FieldLabel>
              <textarea
                value={data.biggestStruggle}
                onChange={(e) => set("biggestStruggle", e.target.value)}
                rows={3}
                placeholder="A line, a hunch, a question…"
                style={{
                  background: SF_P.field,
                  border: `1px solid ${SF_P.fieldBorder}`,
                  borderRadius: 2,
                  outline: "none",
                  color: SF_P.ink,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: 14,
                  letterSpacing: "-0.005em",
                  padding: "12px 14px",
                  resize: "vertical",
                  minHeight: 78,
                  transition: "border-color 220ms ease, background 220ms ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = SF_P.fieldFocus;
                  e.currentTarget.style.background = "rgba(244,237,224,0.06)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = SF_P.fieldBorder;
                  e.currentTarget.style.background = SF_P.field;
                }}
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 13,
                color: SF_P.inkSoft,
              }}
            >
              <input
                type="checkbox"
                checked={data.earlyTester}
                onChange={(e) => set("earlyTester", e.target.checked)}
                style={{ accentColor: SF_P.accent, width: 16, height: 16 }}
              />
              <span>I'd be open to a quiet conversation later on.</span>
            </label>
          </StepShell>
        )}

        {error && (
          <div
            role="alert"
            style={{
              marginTop: 14,
              color: SF_P.danger,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
      </form>

      {thanksOpen && <ThanksOverlay onClose={closeThanks} />}
    </>
  );
}

window.SignupForm = SignupForm;
