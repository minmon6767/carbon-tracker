import { useState, useMemo } from "react";
import { ACTIONS, CATEGORIES } from "../data/actions";
import { calculateSavingFromAction } from "../utils/footprintCalc";

export default function ActionHub({ user, onLog, weeklyLog }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [loggedToday, setLoggedToday] = useState(new Set());
  const [expandedTip, setExpandedTip] = useState(null);
  const [celebrateId, setCelebrateId] = useState(null);

  const todayStr = new Date().toDateString();

  const todayActions = useMemo(() => {
    return new Set(
      weeklyLog
        .filter((a) => new Date(a.date).toDateString() === todayStr)
        .map((a) => a.id)
    );
  }, [weeklyLog, todayStr]);

  const allDone = new Set([...todayActions, ...loggedToday]);

  const filtered = activeCategory === "all"
    ? ACTIONS
    : ACTIONS.filter((a) => a.category === activeCategory);

  const todaySavings = useMemo(() => {
    return weeklyLog
      .filter((a) => new Date(a.date).toDateString() === todayStr)
      .reduce((sum, a) => sum + (a.saving || 0), 0);
  }, [weeklyLog, todayStr]);

  const handleLog = (action) => {
    if (allDone.has(action.id)) return;
    const saving = calculateSavingFromAction(action.id, user);
    onLog({ id: action.id, title: action.title, saving, category: action.category });
    setLoggedToday((prev) => new Set([...prev, action.id]));
    setCelebrateId(action.id);
    setTimeout(() => setCelebrateId(null), 1500);
  };

  const weeklyTotal = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return weeklyLog
      .filter((a) => new Date(a.date) > weekAgo)
      .reduce((sum, a) => sum + (a.saving || 0), 0);
  }, [weeklyLog]);

  return (
    <div className="action-hub">
      <div className="hub-header">
        <h2 className="hub-title">Today's Actions</h2>
        <div className="hub-today-savings">
          <span className="today-saved-num">{todaySavings.toFixed(2)}</span>
          <span className="today-saved-label"> kg saved today</span>
        </div>
      </div>

      {todaySavings > 0 && (
        <div className="progress-banner">
          🌱 You've offset the equivalent of <strong>{(todaySavings * 4).toFixed(0)} mins</strong> of driving today.
          Weekly total: <strong>{weeklyTotal.toFixed(1)} kg CO₂</strong>
        </div>
      )}

      {/* Category filter */}
      <div className="category-tabs">
        <button
          className={`cat-tab ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            className={`cat-tab ${activeCategory === key ? "active" : ""}`}
            style={activeCategory === key ? { background: cat.color, color: "#fff", borderColor: cat.color } : {}}
            onClick={() => setActiveCategory(key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Action cards */}
      <div className="actions-list">
        {filtered.map((action) => {
          const done = allDone.has(action.id);
          const celebrating = celebrateId === action.id;
          const saving = calculateSavingFromAction(action.id, user);
          const catConfig = CATEGORIES[action.category];

          return (
            <div
              key={action.id}
              className={`action-card ${done ? "done" : ""} ${celebrating ? "celebrate" : ""}`}
            >
              <div className="action-left">
                <div className="action-emoji">{action.emoji}</div>
                <div className="action-info">
                  <div className="action-title">{action.title}</div>
                  <div className="action-meta">
                    <span className="action-category" style={{ color: catConfig.color }}>
                      {catConfig.label}
                    </span>
                    <span className="action-saving">· saves {saving.toFixed(2)} kg CO₂</span>
                    <span className={`effort-badge effort-${action.effort}`}>{action.effort}</span>
                  </div>
                  {expandedTip === action.id && (
                    <p className="action-tip">{action.tip}</p>
                  )}
                </div>
              </div>
              <div className="action-right">
                <button
                  className="tip-btn"
                  onClick={() => setExpandedTip(expandedTip === action.id ? null : action.id)}
                  title="Why does this matter?"
                >
                  ?
                </button>
                <button
                  className={`log-btn ${done ? "logged" : ""}`}
                  onClick={() => handleLog(action)}
                  disabled={done}
                >
                  {celebrating ? "🎉" : done ? "✓ Done" : "Log it"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent log */}
      {weeklyLog.length > 0 && (
        <div className="recent-log">
          <h3 className="section-title">Recent activity</h3>
          {weeklyLog.slice(0, 8).map((entry) => (
            <div key={entry.id} className="log-entry">
              <span className="log-title">{entry.title}</span>
              <span className="log-saving">-{entry.saving?.toFixed(2)} kg</span>
              <span className="log-date">{new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
