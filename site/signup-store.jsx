// Signup store — persists submissions to localStorage and offers CSV/JSON export.
// All state lives client-side; there is no backend on this teaser site.
// Export & clear are exposed via the admin panel (Ctrl/Cmd + Shift + E).

const WM_STORE_KEY = "wovenmap.signups.v1";

const SignupStore = {
  all() {
    try {
      const raw = localStorage.getItem(WM_STORE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_e) {
      return [];
    }
  },

  add(entry) {
    const list = SignupStore.all();
    const record = {
      id: `wm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent || "",
      referrer: document.referrer || "",
      ...entry,
    };
    list.push(record);
    localStorage.setItem(WM_STORE_KEY, JSON.stringify(list));
    return record;
  },

  clear() {
    localStorage.removeItem(WM_STORE_KEY);
  },

  toJSON() {
    return JSON.stringify(SignupStore.all(), null, 2);
  },

  toCSV() {
    const rows = SignupStore.all();
    if (!rows.length) return "";
    // Stable column order — known fields first, then any extras alphabetically.
    const known = [
      "id",
      "submittedAt",
      "email",
      "name",
      "ageRange",
      "country",
      "occupation",
      "lifeStage",
      "currentTools",
      "biggestStruggle",
      "featuresWanted",
      "earlyTester",
      "notes",
      "referrer",
      "userAgent",
    ];
    const seen = new Set(known);
    const extras = new Set();
    for (const r of rows) {
      for (const k of Object.keys(r)) if (!seen.has(k)) extras.add(k);
    }
    const cols = [...known, ...[...extras].sort()];
    const esc = (v) => {
      if (v === null || v === undefined) return "";
      let s = Array.isArray(v) ? v.join("; ") : String(v);
      if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const header = cols.join(",");
    const body = rows.map((r) => cols.map((c) => esc(r[c])).join(",")).join("\n");
    return `${header}\n${body}\n`;
  },

  download(kind) {
    const isCsv = kind === "csv";
    const data = isCsv ? SignupStore.toCSV() : SignupStore.toJSON();
    const blob = new Blob([data], {
      type: isCsv ? "text/csv;charset=utf-8" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = url;
    a.download = `wovenmap-signups-${stamp}.${isCsv ? "csv" : "json"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};

window.SignupStore = SignupStore;
