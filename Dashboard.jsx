import { useMemo } from "react";

const CATEGORY_COLORS = {
  transport: "#3b82f6",
  diet: "#22c55e",
  energy: "#f59e0b",
  shopping: "#a855f7",
};

export default function Dashboard({ user, weeklyLog, insights }) {
  const { footprint, name } = user;

  const thisWeekSavings = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return weeklyLog
      .filter((a) => new Date(a.date) > weekAgo)
      .reduce((sum, a) => sum + (a.saving || 0), 0);
  }, [weeklyLog]);

  const streakDays = useMemo(() => {
    const days = new Set(weeklyLog.map((a) => new Date(a.date).toDateString()));
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(Date.now() - i * 86400000).toDateString();
      if (days.has(d)) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [weeklyLog]);

  const topInsight = insights[0];

  // Build breakdown for donut
  const breakdown = footprint.breakdown;
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  
  let cumulative = 0;
  const slices = Object.entries(breakdown).map(([key, val]) => {
    const pct = (val / total) * 100;
    const slice = { key, val, pct, offset: cumulative };
    cumulative += pct;
    return slice;
  });

  const circumference = 2 * Math.PI * 40;

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h1 className="dash-greeting">Hey, {name} 👋</h1>
          <p className="dash-date">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className={`grade-badge grade-${footprint.grade.letter}`}>
          {footprint.grade.letter}
        </div>
      </div>

      {/* Hero metric */}
      <div className="hero-card">
        <div className="hero-left">
          <div className="hero-number">{footprint.annual.toLocaleString()}</div>
          <div className="hero-unit">kg CO₂ per year</div>
          <div className={`hero-compare ${footprint.vsGlobalAvg > 0 ? "above" : "below"}`}>
            {footprint.vsGlobalAvg > 0 ? "↑" : "↓"} {Math.abs(footprint.vsGlobalAvg)}%{" "}
            {footprint.vsGlobalAvg > 0 ? "above" : "below"} global average
          </div>
          <div className="hero-daily">
            {footprint.daily} kg CO₂ today, based on your lifestyle
          </div>
        </div>

        <div className="hero-donut">
          <svg viewBox="0 0 100 100" width="110" height="110">
            {slices.map(({ key, pct, offset }) => (
              <circle
                key={key}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={CATEGORY_COLORS[key] || "#ccc"}
                strokeWidth="18"
                strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
                strokeDashoffset={-((offset / 100) * circumference)}
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              />
            ))}
            <text x="50" y="53" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
              {footprint.daily}
            </text>
            <text x="50" y="63" textAnchor="middle" fontSize="6" fill="var(--text-muted)">kg/day</text>
          </svg>
        </div>
      </div>

      {/* Breakdown legend */}
      <div className="breakdown-grid">
        {slices.map(({ key, val, pct }) => (
          <div key={key} className="breakdown-item">
            <div className="breakdown-dot" style={{ background: CATEGORY_COLORS[key] }} />
            <div className="breakdown-info">
              <div className="breakdown-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
              <div className="breakdown-val">{val} kg/day · {pct.toFixed(0)}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-num">{thisWeekSavings.toFixed(1)}</div>
          <div className="stat-label">kg saved this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{weeklyLog.length}</div>
          <div className="stat-label">actions logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{streakDays}</div>
          <div className="stat-label">day streak</div>
        </div>
      </div>

      {/* Top insight */}
      {topInsight && (
        <div className="insight-teaser">
          <div className="insight-icon">{topInsight.icon}</div>
          <div className="insight-content">
            <div className="insight-title">{topInsight.title}</div>
            <div className="insight-value">{topInsight.value}</div>
            <p className="insight-detail">{topInsight.detail}</p>
          </div>
        </div>
      )}

      {/* Comparison bar */}
      <div className="comparison-section">
        <h3 className="section-title">How you compare</h3>
        <div className="comparison-bars">
          {[
            { label: "You", value: footprint.annual, color: footprint.grade.color },
            { label: "Global avg", value: 4000, color: "#94a3b8" },
            { label: "UK avg", value: 5500, color: "#94a3b8" },
            { label: "India avg", value: 1900, color: "#22c55e" },
            { label: "1.5°C target", value: 2500, color: "#10b981" },
          ].map(({ label, value, color }) => (
            <div key={label} className="comp-bar-row">
              <div className="comp-label">{label}</div>
              <div className="comp-bar-bg">
                <div
                  className="comp-bar-fill"
                  style={{
                    width: `${Math.min((value / 8000) * 100, 100)}%`,
                    background: color,
                  }}
                />
              </div>
              <div className="comp-value">{(value / 1000).toFixed(1)}t</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
