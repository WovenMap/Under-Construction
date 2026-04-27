// Hidden admin export panel for WovenMap teaser site.
// Toggle with Ctrl/Cmd + Shift + E.
// Gives the operator: submission count, preview, CSV/JSON download, clear.
// Lives client-side; reads from window.SignupStore.

const AP_P = {
  bg: "#0a1020",
  ink: "#f4ede0",
  inkSoft: "rgba(244,237,224,0.62)",
  inkFaint: "rgba(244,237,224,0.30)",
  accent: "#c9a16a",
  rule: "rgba(201,161,106,0.22)",
  field: "rgba(244,237,224,0.04)",
  fieldBorder: "rgba(244,237,224,0.18)",
  danger: "#e8a48f",
};

function AdminPanel() {
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [confirmClear, setConfirmClear] = React.useState(false);

  const refresh = React.useCallback(() => {
    const all = window.SignupStore?.all() || [];
    setRows(all);
    setCount(all.length);
  }, []);

  React.useEffect(() => {
    const onKey = (e) => {
      const isToggle =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "E" || e.key === "e");
      if (isToggle) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  if (!open) return null;

  const downloadCSV = () => window.SignupStore.download("csv");
  const downloadJSON = () => window.SignupStore.download("json");

  const onClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    window.SignupStore.clear();
    setConfirmClear(false);
    refresh();
  };

  return (
    <div
      role="dialog"
      aria-label="Admin export panel"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,12,24,0.78)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(820px, 100%)",
          maxHeight: "86vh",
          background: "linear-gradient(180deg, rgba(26,37,63,0.5) 0%, rgba(10,16,32,0.96) 100%)",
          border: `1px solid ${AP_P.rule}`,
          borderRadius: 4,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          fontFamily: "'Inter', sans-serif",
          color: AP_P.ink,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: AP_P.accent,
                marginBottom: 6,
                fontWeight: 400,
              }}
            >
              WovenMap · Admin
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 300,
                fontSize: 26,
                letterSpacing: "-0.015em",
                lineHeight: 1.15,
              }}
            >
              Signups stored on this device
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                fontWeight: 300,
                color: AP_P.inkSoft,
                lineHeight: 1.5,
                maxWidth: 560,
                textWrap: "pretty",
              }}
            >
              Submissions are kept in this browser's localStorage. Export them as CSV or JSON
              and merge into your mailing list. Clearing wipes the local copy only.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              background: "transparent",
              color: AP_P.inkSoft,
              border: `1px solid ${AP_P.fieldBorder}`,
              borderRadius: 2,
              padding: "6px 10px",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: 300,
            }}
          >
            Esc
          </button>
        </div>

        {/* Stat strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            border: `1px solid ${AP_P.rule}`,
            borderRadius: 3,
            padding: 16,
            background: "rgba(201,161,106,0.04)",
          }}
        >
          <Stat label="Submissions" value={count} accent />
          <Stat label="Early testers" value={rows.filter((r) => r.earlyTester).length} />
          <Stat
            label="Latest"
            value={
              rows.length
                ? new Date(rows[rows.length - 1].submittedAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"
            }
            small
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <ActionBtn onClick={downloadCSV} disabled={!count} primary>
            ↓ Download CSV
          </ActionBtn>
          <ActionBtn onClick={downloadJSON} disabled={!count}>
            ↓ Download JSON
          </ActionBtn>
          <ActionBtn onClick={refresh}>↻ Refresh</ActionBtn>
          <div style={{ flex: 1 }} />
          <ActionBtn onClick={onClear} disabled={!count} danger>
            {confirmClear ? "Click again to confirm" : "Clear all"}
          </ActionBtn>
        </div>

        {/* Table */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            border: `1px solid ${AP_P.fieldBorder}`,
            borderRadius: 3,
            background: "rgba(0,0,0,0.25)",
          }}
        >
          {!count && (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                color: AP_P.inkFaint,
                fontWeight: 300,
                fontSize: 14,
                fontStyle: "italic",
              }}
            >
              No submissions yet — when someone signs up they'll appear here.
            </div>
          )}
          {count > 0 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                fontWeight: 300,
                color: AP_P.ink,
              }}
            >
              <thead
                style={{
                  background: "rgba(201,161,106,0.08)",
                  position: "sticky",
                  top: 0,
                  textAlign: "left",
                }}
              >
                <tr>
                  <Th>When</Th>
                  <Th>Email</Th>
                  <Th>Name</Th>
                  <Th>Age</Th>
                  <Th>Stage</Th>
                  <Th>Country</Th>
                  <Th>Features</Th>
                  <Th>Tester?</Th>
                </tr>
              </thead>
              <tbody>
                {[...rows].reverse().map((r) => (
                  <tr key={r.id} style={{ borderTop: `1px solid ${AP_P.fieldBorder}` }}>
                    <Td>{r.submittedAt ? new Date(r.submittedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</Td>
                    <Td>{r.email || "—"}</Td>
                    <Td>{r.name || "—"}</Td>
                    <Td>{r.ageRange || "—"}</Td>
                    <Td>{r.lifeStage || "—"}</Td>
                    <Td>{r.country || "—"}</Td>
                    <Td>
                      {Array.isArray(r.featuresWanted) && r.featuresWanted.length
                        ? r.featuresWanted.join(", ")
                        : "—"}
                    </Td>
                    <Td>{r.earlyTester ? "✓" : ""}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          style={{
            fontSize: 11,
            color: AP_P.inkFaint,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textAlign: "center",
            fontWeight: 300,
          }}
        >
          Toggle this panel with Ctrl/Cmd + Shift + E
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, small }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: AP_P.inkSoft,
          fontWeight: 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 300,
          fontSize: small ? 18 : 32,
          letterSpacing: "-0.01em",
          color: accent ? AP_P.accent : AP_P.ink,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ActionBtn({ children, onClick, disabled, primary, danger }) {
  const bg = primary ? AP_P.accent : "transparent";
  const color = primary ? "#0a1020" : danger ? AP_P.danger : AP_P.ink;
  const border = primary ? AP_P.accent : danger ? "rgba(232,164,143,0.4)" : AP_P.fieldBorder;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        color,
        border: `1px solid ${border}`,
        borderRadius: 2,
        padding: "10px 16px",
        fontSize: 12,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontWeight: primary ? 400 : 300,
        transition: "all 180ms ease",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (primary) e.currentTarget.style.filter = "brightness(1.08)";
        else e.currentTarget.style.borderColor = danger ? AP_P.danger : AP_P.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "none";
        e.currentTarget.style.borderColor = border;
      }}
    >
      {children}
    </button>
  );
}

function Th({ children }) {
  return (
    <th
      style={{
        padding: "10px 12px",
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontWeight: 400,
        color: AP_P.inkSoft,
      }}
    >
      {children}
    </th>
  );
}
function Td({ children }) {
  return (
    <td
      style={{
        padding: "10px 12px",
        verticalAlign: "top",
        whiteSpace: "nowrap",
        maxWidth: 220,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </td>
  );
}

window.AdminPanel = AdminPanel;
