import { useState, useEffect, useCallback } from "react";

const MOODS = [
  { label: "Joyful", emoji: "✨", color: "#f59e0b" },
  { label: "Happy", emoji: "😊", color: "#10b981" },
  { label: "Neutral", emoji: "😐", color: "#6b7280" },
  { label: "Sad", emoji: "😔", color: "#3b82f6" },
  { label: "Anxious", emoji: "😰", color: "#8b5cf6" },
  { label: "Angry", emoji: "😤", color: "#ef4444" },
];

const DEFAULT_URL = "";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: type === "error" ? "#fef2f2" : "#f0fdf4",
      border: `1.5px solid ${type === "error" ? "#fca5a5" : "#86efac"}`,
      color: type === "error" ? "#dc2626" : "#16a34a",
      padding: "12px 20px", borderRadius: 12, fontSize: 14,
      fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
      display: "flex", alignItems: "center", gap: 10, maxWidth: 340,
      animation: "slideIn 0.25s ease",
    }}>
      <span style={{ fontSize: 18 }}>{type === "error" ? "⚠️" : "✅"}</span>
      <span>{msg}</span>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", opacity: 0.5, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
    </div>
  );
}

function EntryModal({ entry, onClose, onSave, loading }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    title: entry?.title || "",
    date: entry?.date || today,
    mood: entry?.mood || "Happy",
    content: entry?.content || "",
    tags: entry?.tags || "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.title.trim() && form.content.trim() && form.date;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,15,25,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16, backdropFilter: "blur(4px)",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "var(--bg-card, #fff)", borderRadius: 20,
        width: "100%", maxWidth: 540, maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 32px 64px rgba(0,0,0,0.18)",
        border: "1px solid rgba(255,255,255,0.7)",
        animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text-primary, #1a1a2e)", fontFamily: "'Playfair Display', serif" }}>
            {entry ? "Edit Entry" : "New Entry"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "var(--text-muted, #9ca3af)", lineHeight: 1, padding: 4 }}>×</button>
        </div>

        <div style={{ padding: "20px 28px 28px" }}>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="What's on your mind today?"
              style={inputStyle} />
          </div>

          {/* Date */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Date *</label>
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
              style={inputStyle} />
          </div>

          {/* Mood */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Mood</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {MOODS.map(m => (
                <button key={m.label} onClick={() => set("mood", m.label)}
                  style={{
                    padding: "6px 14px", borderRadius: 50, border: `2px solid ${form.mood === m.label ? m.color : "transparent"}`,
                    background: form.mood === m.label ? m.color + "20" : "var(--bg-pill, #f3f4f6)",
                    color: form.mood === m.label ? m.color : "var(--text-muted, #6b7280)",
                    cursor: "pointer", fontSize: 13, fontWeight: 500,
                    transition: "all 0.15s",
                  }}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Your thoughts *</label>
            <textarea value={form.content} onChange={e => set("content", e.target.value)}
              placeholder="Write freely..."
              rows={6}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Tags <span style={{ opacity: 0.5, fontWeight: 400 }}>(comma separated)</span></label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)}
              placeholder="e.g. gratitude, work, family"
              style={inputStyle} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid var(--border, #e5e7eb)",
              background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
              color: "var(--text-muted, #6b7280)", transition: "background 0.15s",
            }}>Cancel</button>
            <button onClick={() => valid && onSave(form)} disabled={!valid || loading}
              style={{
                flex: 2, padding: "12px 0", borderRadius: 12, border: "none",
                background: valid && !loading ? "linear-gradient(135deg, #667eea, #764ba2)" : "#d1d5db",
                color: "#fff", cursor: valid && !loading ? "pointer" : "not-allowed",
                fontSize: 14, fontWeight: 700, transition: "opacity 0.15s",
                boxShadow: valid && !loading ? "0 4px 15px rgba(102,126,234,0.4)" : "none",
              }}>
              {loading ? "Saving…" : entry ? "Update Entry" : "Save Entry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ entry, onClose, onConfirm, loading }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,15,25,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "var(--bg-card, #fff)", borderRadius: 20, width: "100%", maxWidth: 400,
        padding: 32, textAlign: "center",
        boxShadow: "0 32px 64px rgba(0,0,0,0.18)",
        animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "var(--text-primary, #1a1a2e)" }}>Delete Entry?</h3>
        <p style={{ color: "var(--text-muted, #6b7280)", margin: "0 0 24px", fontSize: 14 }}>
          "<strong>{entry?.title}</strong>" will be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid var(--border, #e5e7eb)",
            background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--text-muted, #6b7280)",
          }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
            background: "#ef4444", color: "#fff", cursor: "pointer",
            fontSize: 14, fontWeight: 700,
            boxShadow: "0 4px 15px rgba(239,68,68,0.35)",
          }}>
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EntryCard({ entry, onEdit, onDelete, onView }) {
  const mood = MOODS.find(m => m.label === entry.mood) || MOODS[1];
  const tags = entry.tags ? entry.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div style={{
      background: "var(--bg-card, #fff)",
      border: "1px solid var(--border, #e5e7eb)",
      borderRadius: 16, padding: "20px", cursor: "pointer",
      transition: "transform 0.15s, box-shadow 0.15s",
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.10)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: mood.color, borderRadius: "16px 0 0 16px",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }} onClick={() => onView(entry)}>
        <div style={{ flex: 1, paddingLeft: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>{mood.emoji}</span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary, #1a1a2e)", fontFamily: "'Playfair Display', serif" }}>
              {entry.title}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted, #9ca3af)" }}>{formatDate(entry.date)}</p>
        </div>
        <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
          <button onClick={e => { e.stopPropagation(); onEdit(entry); }}
            style={{ ...iconBtn, color: "#667eea" }} title="Edit">✏️</button>
          <button onClick={e => { e.stopPropagation(); onDelete(entry); }}
            style={{ ...iconBtn, color: "#ef4444" }} title="Delete">🗑️</button>
        </div>
      </div>

      <p onClick={() => onView(entry)} style={{
        margin: "8px 0 12px 8px", fontSize: 14, color: "var(--text-secondary, #4b5563)",
        lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {entry.content}
      </p>

      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 8 }}>
          {tags.slice(0, 4).map(t => (
            <span key={t} style={{
              background: "var(--bg-tag, #f3f4f6)", color: "var(--text-muted, #6b7280)",
              fontSize: 11, padding: "2px 10px", borderRadius: 50, fontWeight: 500,
            }}>#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewModal({ entry, onClose, onEdit }) {
  const mood = MOODS.find(m => m.label === entry.mood) || MOODS[1];
  const tags = entry.tags ? entry.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,15,25,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16, backdropFilter: "blur(4px)",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "var(--bg-card, #fff)", borderRadius: 20,
        width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 64px rgba(0,0,0,0.18)",
        animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ height: 6, background: mood.color, borderRadius: "20px 20px 0 0" }} />
        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 24 }}>{mood.emoji}</span>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary, #1a1a2e)", fontFamily: "'Playfair Display', serif" }}>{entry.title}</h2>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted, #9ca3af)" }}>{formatDate(entry.date)} · {mood.label}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "var(--text-muted, #9ca3af)" }}>×</button>
          </div>
          <div style={{ borderTop: "1px solid var(--border, #e5e7eb)", paddingTop: 16, marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 15, color: "var(--text-secondary, #374151)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{entry.content}</p>
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {tags.map(t => (
                <span key={t} style={{ background: "var(--bg-tag, #f3f4f6)", color: "var(--text-muted, #6b7280)", fontSize: 12, padding: "3px 12px", borderRadius: 50, fontWeight: 500 }}>#{t}</span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid var(--border, #e5e7eb)", background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--text-muted, #6b7280)" }}>Close</button>
            <button onClick={() => { onClose(); onEdit(entry); }} style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 15px rgba(102,126,234,0.4)" }}>Edit Entry</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted, #6b7280)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border, #e5e7eb)", fontSize: 14, color: "var(--text-primary, #1a1a2e)", background: "var(--bg-input, #fafafa)", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s" };
const iconBtn = { background: "none", border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "background 0.15s" };

export default function DiaryApp() {
  const [sheetUrl, setSheetUrl] = useState(() => localStorage.getItem("diary_sheet_url") || DEFAULT_URL);
  const [urlInput, setUrlInput] = useState(() => localStorage.getItem("diary_sheet_url") || DEFAULT_URL);
  const [urlSaved, setUrlSaved] = useState(!!localStorage.getItem("diary_sheet_url"));

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMood, setFilterMood] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const [showEntry, setShowEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [viewEntry, setViewEntry] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchEntries = useCallback(async () => {
    if (!sheetUrl) return;
    setLoading(true);
    try {
      const res = await fetch(sheetUrl);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      showToast("Could not load entries. Check your SheetDB URL.", "error");
    } finally {
      setLoading(false);
    }
  }, [sheetUrl]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const saveUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return showToast("Please enter a valid SheetDB URL", "error");
    setSheetUrl(trimmed);
    localStorage.setItem("diary_sheet_url", trimmed);
    setUrlSaved(true);
    showToast("SheetDB URL saved!");
  };

  const createEntry = async (form) => {
    if (!sheetUrl) return showToast("Set your SheetDB URL first", "error");
    setActionLoading(true);
    try {
      const row = { id: Date.now().toString(), ...form };
      const res = await fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [row] }),
      });
      if (!res.ok) throw new Error();
      await fetchEntries();
      setShowNew(false);
      showToast("Entry saved to your diary! 📓");
    } catch {
      showToast("Failed to save entry.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const updateEntry = async (form) => {
    if (!sheetUrl || !editEntry) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${sheetUrl}/id/${editEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: form }),
      });
      if (!res.ok) throw new Error();
      await fetchEntries();
      setEditEntry(null);
      showToast("Entry updated! ✏️");
    } catch {
      showToast("Failed to update entry.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!sheetUrl || !deleteEntry) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${sheetUrl}/id/${deleteEntry.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchEntries();
      setDeleteEntry(null);
      showToast("Entry deleted.");
    } catch {
      showToast("Failed to delete entry.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = entries
    .filter(e => filterMood === "All" || e.mood === filterMood)
    .filter(e => !search || (e.title + e.content + e.tags).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date) - new Date(a.date);
      return new Date(a.date) - new Date(b.date);
    });

  const moodCounts = entries.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {});

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-app, linear-gradient(135deg, #f8f7ff 0%, #e8f4f8 100%))",
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "var(--text-primary, #1a1a2e)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        @keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
        @keyframes popIn { from { opacity:0; transform: scale(0.92); } to { opacity:1; transform: scale(1); } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: #667eea !important; box-shadow: 0 0 0 3px rgba(102,126,234,0.12) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg-app: linear-gradient(135deg, #0f0f1a 0%, #141428 100%);
            --bg-card: #1e1e2e; --bg-input: #16162a; --bg-tag: #2a2a3e; --bg-pill: #2a2a3e;
            --text-primary: #e8e8f0; --text-secondary: #c0c0d0; --text-muted: #8080a0;
            --border: rgba(255,255,255,0.1);
          }
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border, #e5e7eb)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          {/* URL Bar */}
          <div style={{
            borderBottom: "1px solid var(--border, #e5e7eb)", padding: "12px 0",
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#667eea", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
              🔗 SheetDB URL
            </span>
            <input
              value={urlInput}
              onChange={e => { setUrlInput(e.target.value); setUrlSaved(false); }}
              placeholder="https://sheetdb.io/api/v1/your-api-id"
              style={{ ...inputStyle, flex: 1, minWidth: 200, fontSize: 13, padding: "8px 12px" }}
            />
            <button onClick={saveUrl} style={{
              padding: "8px 18px", borderRadius: 10, border: "none",
              background: urlSaved ? "#10b981" : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700,
              whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(102,126,234,0.35)",
              transition: "background 0.2s",
            }}>
              {urlSaved ? "✓ Connected" : "Connect"}
            </button>
            {sheetUrl && (
              <button onClick={fetchEntries} disabled={loading} style={{
                padding: "8px 14px", borderRadius: 10, border: "1.5px solid var(--border, #e5e7eb)",
                background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                color: "var(--text-muted, #6b7280)", whiteSpace: "nowrap",
              }}>
                {loading ? "↺ Loading…" : "↺ Refresh"}
              </button>
            )}
          </div>

          {/* App Title Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif", background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                📓 My Diary
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted, #9ca3af)" }}>
                {entries.length} {entries.length === 1 ? "entry" : "entries"} recorded
              </p>
            </div>
            <button onClick={() => setShowNew(true)} style={{
              padding: "12px 22px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 20px rgba(102,126,234,0.45)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Entry
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        {/* Stats row */}
        {entries.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", animation: "fadeUp 0.35s ease" }}>
            {MOODS.slice(0, 4).map(m => (
              <div key={m.label} style={{
                background: "var(--bg-card, #fff)", border: "1px solid var(--border, #e5e7eb)",
                borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8,
                flex: "1 1 140px",
              }}>
                <span style={{ fontSize: 20 }}>{m.emoji}</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{moodCounts[m.label] || 0}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted, #9ca3af)", fontWeight: 500 }}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{
          display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap",
          background: "var(--bg-card, #fff)", padding: 16, borderRadius: 16,
          border: "1px solid var(--border, #e5e7eb)",
        }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search entries..."
            style={{ ...inputStyle, flex: "1 1 200px", padding: "9px 14px" }} />

          <select value={filterMood} onChange={e => setFilterMood(e.target.value)}
            style={{ ...inputStyle, flex: "0 0 auto", width: "auto", padding: "9px 14px", cursor: "pointer" }}>
            <option value="All">All Moods</option>
            {MOODS.map(m => <option key={m.label} value={m.label}>{m.emoji} {m.label}</option>)}
          </select>

          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
            style={{ ...inputStyle, flex: "0 0 auto", width: "auto", padding: "9px 14px", cursor: "pointer" }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Empty State */}
        {!loading && !sheetUrl && (
          <div style={{ textAlign: "center", padding: "60px 20px", animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔗</div>
            <h2 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display', serif" }}>Connect Your SheetDB</h2>
            <p style={{ color: "var(--text-muted, #9ca3af)", maxWidth: 360, margin: "0 auto" }}>
              Paste your SheetDB API URL at the top and click Connect to start saving diary entries to Google Sheets.
            </p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted, #9ca3af)" }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: "spin 1s linear infinite" }}>⏳</div>
            <p>Loading your entries…</p>
          </div>
        )}

        {!loading && sheetUrl && filtered.length === 0 && entries.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📔</div>
            <h2 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display', serif" }}>Start Your Diary</h2>
            <p style={{ color: "var(--text-muted, #9ca3af)", maxWidth: 320, margin: "0 auto 24px" }}>
              Your diary is empty. Write your first entry and begin capturing your story.
            </p>
            <button onClick={() => setShowNew(true)} style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
              boxShadow: "0 4px 20px rgba(102,126,234,0.45)",
            }}>
              ✍️ Write First Entry
            </button>
          </div>
        )}

        {!loading && filtered.length === 0 && entries.length > 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted, #9ca3af)" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
            <p>No entries match your search or filter.</p>
          </div>
        )}

        {/* Entries Grid */}
        {!loading && filtered.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {filtered.map((entry, i) => (
              <div key={entry.id || i} style={{ animation: `fadeUp ${0.1 + i * 0.04}s ease both` }}>
                <EntryCard
                  entry={entry}
                  onEdit={setEditEntry}
                  onDelete={setDeleteEntry}
                  onView={setViewEntry}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showNew && (
        <EntryModal onClose={() => setShowNew(false)} onSave={createEntry} loading={actionLoading} />
      )}
      {editEntry && (
        <EntryModal entry={editEntry} onClose={() => setEditEntry(null)} onSave={updateEntry} loading={actionLoading} />
      )}
      {deleteEntry && (
        <DeleteModal entry={deleteEntry} onClose={() => setDeleteEntry(null)} onConfirm={confirmDelete} loading={actionLoading} />
      )}
      {viewEntry && (
        <ViewModal entry={viewEntry} onClose={() => setViewEntry(null)} onEdit={e => { setViewEntry(null); setEditEntry(e); }} />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
