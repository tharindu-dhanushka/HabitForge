import { useState, useEffect, useMemo } from "react";
import { BarChart2, TrendingUp, Calendar } from "lucide-react";
import ProgressChart from "../components/ProgressChart";
import StreakCalendar from "../components/StreakCalendar";
import { getAllHabits } from "../api/habitApi";
import "../styles/analytics.css";

/* Build last-7-days bar chart data from habits array */
function buildWeeklyData(habits) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      name:  d.toLocaleDateString("en-US", { weekday: "short" }),
      date:  d.toISOString().split("T")[0],
      count: 0,
    });
  }
  // Count habits that have been checked in per day
  // (we approximate: each habit counts as 1 check-in per matching day)
  habits.forEach((habit) => {
    if (habit.checkins) {
      habit.checkins.forEach((ci) => {
        const ciDate = ci.date?.split("T")[0];
        const day = days.find((d) => d.date === ciDate);
        if (day) day.count += 1;
      });
    }
  });
  return days;
}

export default function Analytics() {
  const [habits,  setHabits]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllHabits()
      .then((r) => setHabits(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const weeklyData = useMemo(() => buildWeeklyData(habits), [habits]);

  // Flatten all check-ins from all habits for the calendar
  const allCheckins = useMemo(() => {
    const arr = [];
    habits.forEach((h) => {
      if (h.checkins) arr.push(...h.checkins);
    });
    return arr;
  }, [habits]);

  // Per-habit performance (check-in count)
  const habitPerf = useMemo(() => {
    const sorted = habits
      .map((h) => ({
        name:  h.name,
        count: h.checkins?.length ?? 0,
      }))
      .sort((a, b) => b.count - a.count);
    const max = sorted[0]?.count || 1;
    return sorted.map((h) => ({ ...h, pct: Math.round((h.count / max) * 100) }));
  }, [habits]);

  const totalCheckins = allCheckins.length;
  const bestHabit     = habitPerf[0];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Analytics <span style={{ background: "linear-gradient(135deg, var(--accent-light), #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>& Insights</span>
        </h1>
        <p className="page-subtitle">Track your progress and identify patterns over time.</p>
      </div>

      {/* Summary cards */}
      <div className="stats-row" style={{ marginBottom: 28 }}>
        <div className="stat-card" style={{ animationDelay: "0ms" }}>
          <div className="stat-icon accent"><BarChart2 size={18} /></div>
          <div className="stat-value">{habits.length}</div>
          <div className="stat-label">Total Habits</div>
        </div>
        <div className="stat-card" style={{ animationDelay: "60ms" }}>
          <div className="stat-icon success"><TrendingUp size={18} /></div>
          <div className="stat-value">{totalCheckins}</div>
          <div className="stat-label">All-time Check-ins</div>
        </div>
        <div className="stat-card" style={{ animationDelay: "120ms" }}>
          <div className="stat-icon warning"><Calendar size={18} /></div>
          <div className="stat-value">{bestHabit?.count ?? 0}</div>
          <div className="stat-label">Best Habit Check-ins</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
          Loading analytics…
        </div>
      ) : (
        <>
          <div className="analytics-grid">
            {/* Weekly Bar Chart */}
            <div className="chart-card animate-fade-up" style={{ animationDelay: "0ms" }}>
              <div className="chart-card-header">
                <div className="chart-title">Weekly Check-ins</div>
                <div className="chart-subtitle">Last 7 days activity</div>
              </div>
              <ProgressChart data={weeklyData} />
            </div>

            {/* Habit Performance */}
            <div className="chart-card animate-fade-up" style={{ animationDelay: "80ms" }}>
              <div className="chart-card-header">
                <div className="chart-title">Habit Performance</div>
                <div className="chart-subtitle">Relative check-in counts</div>
              </div>
              {habitPerf.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: 13, padding: "40px 0", textAlign: "center" }}>
                  No habits found.
                </div>
              ) : (
                <div className="habit-performance-list">
                  {habitPerf.map((h, i) => (
                    <div key={i} className="habit-perf-item">
                      <div className="habit-perf-name" title={h.name}>{h.name}</div>
                      <div className="habit-perf-bar-wrap">
                        <div className="habit-perf-bar" style={{ width: `${h.pct}%` }} />
                      </div>
                      <div className="habit-perf-pct">{h.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Yearly Heatmap - full width */}
            <div className="chart-card full-width animate-fade-up" style={{ animationDelay: "160ms" }}>
              <div className="chart-card-header">
                <div className="chart-title">Check-in History</div>
                <div className="chart-subtitle">Activity over the last year</div>
              </div>
              <StreakCalendar checkins={allCheckins} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
