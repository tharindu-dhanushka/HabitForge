import { useState } from "react";
import { CheckCircle2, Circle, Pencil, Trash2, Repeat2, Flame } from "lucide-react";
import "../styles/habitcard.css";

const freqIcon = { daily: <Repeat2 size={11} />, weekly: <Flame size={11} /> };

export default function HabitCard({ habit, checkedIn, completedAt, onCheckin, onEdit, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleCheckin = async () => {
    if (checkedIn || loading) return;
    setLoading(true);
    await onCheckin(habit._id);
    setLoading(false);
  };

  return (
    <div className={`habit-card animate-fade-up ${checkedIn ? "checked-in" : ""}`}>
      {/* Header */}
      <div className="habit-card-header">
        <div className="habit-info">
          <div className="habit-name" title={habit.name}>{habit.name}</div>
          {habit.description && (
            <div className="habit-desc" title={habit.description}>
              {habit.description}
            </div>
          )}
        </div>
        <div className="habit-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(habit)}
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            className="btn-icon"
            onClick={() => onDelete(habit._id)}
            title="Delete"
            style={{ color: "var(--danger)" }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="habit-meta">
        <span className="freq-badge">
          {freqIcon[habit.frequency] || freqIcon.daily}
          {habit.frequency || "daily"}
        </span>
      </div>

      {/* Check-in Button */}
      <button
        className={`checkin-btn ${checkedIn ? "done" : ""}`}
        onClick={handleCheckin}
        disabled={checkedIn || loading}
      >
        {checkedIn ? (
          <>
            <CheckCircle2 size={16} />
            <span className="checkin-label">
              <span className="checkin-name">{habit.name}</span>
              {completedAt && (
                <span className="checkin-time">Completed at {completedAt}</span>
              )}
            </span>
          </>
        ) : loading ? (
          <>
            <Circle size={16} />
            Checking in…
          </>
        ) : (
          <>
            <Circle size={16} />
            Mark Done
          </>
        )}
      </button>
    </div>
  );
}
