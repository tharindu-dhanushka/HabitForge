import { useState, useEffect, useCallback } from "react";
import { Plus, Target, CheckCircle2, Flame, RefreshCw } from "lucide-react";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import { getAllHabits, createHabit, updateHabit, deleteHabit, checkinHabit } from "../api/habitApi";
import "../styles/dashboard.css";

const today = new Date().toISOString().split("T")[0];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const [habits,         setHabits]         = useState([]);
  const [checkedIn,      setCheckedIn]      = useState(new Set());
  const [completedTimes, setCompletedTimes] = useState(new Map()); // ✅ id → "8:32 PM"
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [showForm,       setShowForm]       = useState(false);
  const [editHabit,      setEditHabit]      = useState(null);
  const [habitToDelete,  setHabitToDelete]  = useState(null);

  /* ── Fetch ── */
  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllHabits();
      setHabits(res.data);

      // ✅ Pre-fill checkedIn + completedTimes from backend (survives refresh)
      const alreadyDone  = new Set();
      const timesMap     = new Map();
      res.data.forEach((h) => {
        if (h.todayChecked) {
          alreadyDone.add(h._id);
          if (h.todayCompletedAt) {
            timesMap.set(h._id, new Date(h.todayCompletedAt).toLocaleTimeString(
              "en-US", { hour: "2-digit", minute: "2-digit" }
            ));
          }
        }
      });
      setCheckedIn(alreadyDone);
      setCompletedTimes(timesMap);
    } catch {
      setError("Could not connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  /* ── Check-in ── */
  const handleCheckin = async (id) => {
    try {
      const res = await checkinHabit(id);
      setCheckedIn((prev) => new Set([...prev, id]));
      // ✅ Store the exact time returned by the API
      if (res.data?.completedAt) {
        const timeStr = new Date(res.data.completedAt).toLocaleTimeString(
          "en-US", { hour: "2-digit", minute: "2-digit" }
        );
        setCompletedTimes((prev) => new Map([...prev, [id, timeStr]]));
      }
    } catch (err) {
      console.error("Checkin Error:", err);
      setError(err?.response?.data?.message || "Failed to mark habit as done.");
    }
  };

  /* ── Create / Edit ── */
  const handleSave = async (form, id) => {
    if (id) {
      await updateHabit(id, form);
    } else {
      await createHabit(form);
    }
    await fetchHabits();
  };

  /* ── Delete ── */
  const confirmDelete = (id) => {
    setHabitToDelete(id);
  };

  const handleDelete = async () => {
    if (!habitToDelete) return;
    try {
      await deleteHabit(habitToDelete);
      setHabits((prev) => prev.filter((h) => h._id !== habitToDelete));
      setCheckedIn((prev)      => { const s = new Set(prev); s.delete(habitToDelete); return s; });
      setCompletedTimes((prev) => { const m = new Map(prev); m.delete(habitToDelete); return m; });
      setHabitToDelete(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete habit.");
      setHabitToDelete(null);
    }
  };

  /* ── Derived stats ── */
  const totalHabits = habits.length;
  const doneToday   = checkedIn.size;
  const pct         = totalHabits ? Math.round((doneToday / totalHabits) * 100) : 0;

  /* ── Open edit form ── */
  const openEdit = (habit) => { setEditHabit(habit); setShowForm(true); };
  const openNew  = ()      => { setEditHabit(null);   setShowForm(true); };
  const closeForm = ()     => { setShowForm(false); setEditHabit(null); };

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">
            {getGreeting()}, <span>Forge</span> your habits 🔥
          </h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-ghost btn-sm" onClick={fetchHabits} title="Refresh">
            <RefreshCw size={14} />
          </button>
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={16} /> New Habit
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card" style={{ animationDelay: "0ms" }}>
          <div className="stat-icon accent"><Target size={18} /></div>
          <div className="stat-value">{totalHabits}</div>
          <div className="stat-label">Total Habits</div>
        </div>
        <div className="stat-card" style={{ animationDelay: "60ms" }}>
          <div className="stat-icon success"><CheckCircle2 size={18} /></div>
          <div className="stat-value">{doneToday}</div>
          <div className="stat-label">Done Today</div>
        </div>
        <div className="stat-card" style={{ animationDelay: "120ms" }}>
          <div className="stat-icon warning"><Flame size={18} /></div>
          <div className="stat-value">{pct}%</div>
          <div className="stat-label">Completion</div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {totalHabits > 0 && (
        <div className="progress-bar-wrap">
          <div className="progress-bar-header">
            <span style={{ fontSize: 13, fontWeight: 600 }}>Today's Progress</span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {doneToday} / {totalHabits} habits
            </span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {/* ── Habits Grid ── */}
      <div className="section-header">
        <h2>My Habits</h2>
        {habits.length > 0 && (
          <span className="badge badge-accent">{habits.length} active</span>
        )}
      </div>

      {error && (
        <div style={{
          background: "var(--danger-dim)", border: "1px solid rgba(244,63,94,0.2)",
          borderRadius: "var(--radius-md)", padding: "14px 18px",
          color: "var(--danger)", fontSize: "13px", marginBottom: 24
        }}>
          ⚠ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
          <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
          <p>Loading habits…</p>
        </div>
      ) : (
        <div className="habits-grid">
          {habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Target size={28} /></div>
              <h3>No habits yet</h3>
              <p>Start building your routine by creating your first habit.</p>
              <button className="btn btn-primary" onClick={openNew}>
                <Plus size={16} /> Create First Habit
              </button>
            </div>
          ) : (
            habits.map((habit, i) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                checkedIn={checkedIn.has(habit._id)}
                completedAt={completedTimes.get(habit._id) ?? null}
                onCheckin={handleCheckin}
                onEdit={openEdit}
                onDelete={confirmDelete}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {showForm && (
        <HabitForm
          habit={editHabit}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {/* ── Delete Confirmation Modal ── */}
      {habitToDelete && (
        <div className="modal-overlay" onClick={() => setHabitToDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Habit</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                Are you sure you want to delete this habit? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setHabitToDelete(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: "var(--danger)", borderColor: "var(--danger)" }} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
