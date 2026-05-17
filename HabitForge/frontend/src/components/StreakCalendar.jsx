import { useMemo } from "react";
import "../styles/analytics.css";

const DAYS   = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildCalendar(checkins) {
  // Build a set of check-in dates for fast lookup
  const dateSet = new Set(checkins.map((c) => c.date?.split("T")[0]));

  const today = new Date();
  const end   = new Date(today);
  // Go back 52 weeks
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  // Align start to Sunday
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let current = new Date(start);

  while (current <= end) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split("T")[0];
      week.push({
        date:   dateStr,
        month:  current.getMonth(),
        active: dateSet.has(dateStr),
        future: current > today,
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  // Build month labels
  const monthLabels = [];
  weeks.forEach((week, i) => {
    const month = week[0].month;
    if (i === 0 || month !== weeks[i - 1][0].month) {
      monthLabels.push({ index: i, label: MONTHS[month] });
    }
  });

  return { weeks, monthLabels };
}

export default function StreakCalendar({ checkins = [] }) {
  const { weeks, monthLabels } = useMemo(() => buildCalendar(checkins), [checkins]);

  const totalActive = useMemo(
    () => weeks.flat().filter((c) => c.active).length,
    [weeks]
  );

  return (
    <div>
      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: 16 }}>
        <span style={{ color: "var(--accent-light)", fontWeight: 600 }}>{totalActive}</span> check-ins in the last year
      </div>

      <div className="calendar-wrap">
        {/* Month Labels */}
        <div style={{ display: "flex", gap: 4, marginBottom: 6, paddingLeft: 22 }}>
          {monthLabels.map(({ index, label }) => (
            <div
              key={`${label}-${index}`}
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                minWidth: 12,
                marginLeft: index === 0 ? 0 : `${(index - (monthLabels[monthLabels.indexOf(monthLabels.find(m => m.index === index)) - 1]?.index ?? 0) - 1) * 16}px`,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {/* Day labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginRight: 4 }}>
            {DAYS.map((d, i) => (
              <div key={i} style={{ fontSize: 10, color: "var(--text-muted)", height: 12, lineHeight: "12px", width: 18 }}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "flex", gap: 4 }}>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    className={`calendar-cell ${cell.future ? "" : cell.active ? "level-4" : ""}`}
                    title={`${cell.date}${cell.active ? " ✓" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>
          <span>Less</span>
          {["", "level-1", "level-2", "level-3", "level-4"].map((cls, i) => (
            <div key={i} className={`calendar-cell ${cls}`} style={{ flexShrink: 0 }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
