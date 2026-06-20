import { useState } from "react";

const INSIGHT_COLORS = {
  impact_leader: { border: "#ef4444", bg: "#fff5f5", icon_bg: "#fee2e2" },
  weekly_win: { border: "#22c55e", bg: "#f0fdf4", icon_bg: "#dcfce7" },
  diet_tip: { border: "#84cc16", bg: "#f7fee7", icon_bg: "#ecfccb" },
  transport_tip: { border: "#3b82f6", bg: "#eff6ff", icon_bg: "#dbeafe" },
  energy_tip: { border: "#f59e0b", bg: "#fffbeb", icon_bg: "#fef3c7" },
  streak: { border: "#f97316", bg: "#fff7ed", icon_bg: "#ffedd5" },
  comparison: { border: "#8b5cf6", bg: "#faf5ff", icon_bg: "#ede9fe" },
};

const REDUCTION_SCENARIOS = [
  {
    title: "Go flexitarian",
    description: "Reduce meat to 3x per week",
    saving: 280,
    difficulty: "Moderate",
    icon: "🥗",
  },
  {
    title: "Ditch the car twice a week",
    description: "Use public transport or cycle",
    saving: 220,
    difficulty: "Moderate",
    icon: "🚌",
  },
  {
    title: "Switch to green energy",
    description: "Change to a renewable tariff",
    saving: 400,
    difficulty: "Easy",
    icon: "⚡",
  },
  {
    title: "Buy nothing new for a month",
    description: "Secondhand or repair only",
    saving: 90,
    difficulty: "Hard",
    icon: "♻️",
  },
];

export default function Insights({ user, weeklyLog, insights }) {
  const [expandedInsight, setExpandedInsight] = useState(null);

  const totalLogged = weeklyLog.reduce((sum, a) => sum + (a.saving || 0), 0);
  const targetAnnual = 2500; // 1.5°C aligned target
  const currentAnnual = user.footprint.annual;
  const gapToTarget = Math.max(currentAnnual - targetAnnual, 0);

  // Project savings if user keeps up current pace
  const daysActive = weeklyLog.length > 0
    ? Math.max(1, Math.ceil((Date.now() - new Date(weeklyLog[weeklyLog.length - 1].date)) / 86400000))
    : 1;
  const projectedAnnualSavings = (totalLogged / Math.max(daysActive, 1)) * 365;

  return (
    <div className="insights-page">
      <div className="insights-header">
        <h2 className="hub-title">Your Insights</h2>
        <p className="insights-sub">Personalised to your lifestyle and habits</p>
      </div>

      {/* Progress toward target */}
      <div className="target-card">
        <div className="target-top">
          <div>
            <div className="target-label">Gap to 1.5°C target</div>
            <div className="target-value">{(gapToTarget / 1000).toFixed(1)} tonnes to cut</div>
          </div>
          <div className="target-year">per year</div>
        </div>
        <div className="target-bar-bg">
          <div
            className="target-bar-fill"
            style={{ width: `${Math.min((projectedAnnualSavings / Math.max(gapToTarget, 1)) * 100, 100)}%` }}
          />
        </div>
        <div className="target-footer">
          At your current pace: <strong>{(projectedAnnualSavings / 1000).toFixed(2)} tonnes/year</strong> saved
          {projectedAnnualSavings >= gapToTarget && " — you're on track! 🎉"}
        </div>
      </div>

      {/* Insights list */}
      <div className="insights-list">
        {insights.length === 0 && (
          <div className="empty-insights">
            <p>Log a few actions and we'll start building your personalised insights.</p>
          </div>
        )}
        {insights.map((insight) => {
          const style = INSIGHT_COLORS[insight.type] || INSIGHT_COLORS.comparison;
          const isExpanded = expandedInsight === insight.type;
          return (
            <div
              key={insight.type}
              className="insight-card"
              style={{ borderLeftColor: style.border, background: style.bg }}
              onClick={() => setExpandedInsight(isExpanded ? null : insight.type)}
            >
              <div className="insight-card-icon" style={{ background: style.icon_bg }}>
                {insight.icon}
              </div>
              <div className="insight-card-body">
                <div className="insight-card-title">{insight.title}</div>
                <div className="insight-card-value" style={{ color: style.border }}>
                  {insight.value}
                </div>
                {isExpanded && (
                  <p className="insight-card-detail">{insight.detail}</p>
                )}
              </div>
              <div className="insight-expand">{isExpanded ? "▲" : "▼"}</div>
            </div>
          );
        })}
      </div>

      {/* What-if scenarios */}
      <div className="scenarios-section">
        <h3 className="section-title">What if you...</h3>
        <p className="scenarios-sub">Annual CO₂ savings from common lifestyle changes</p>
        <div className="scenarios-grid">
          {REDUCTION_SCENARIOS.map((s) => (
            <div key={s.title} className="scenario-card">
              <div className="scenario-emoji">{s.icon}</div>
              <div className="scenario-info">
                <div className="scenario-title">{s.title}</div>
                <div className="scenario-desc">{s.description}</div>
              </div>
              <div className="scenario-right">
                <div className="scenario-saving">-{s.saving} kg</div>
                <div className={`scenario-diff diff-${s.difficulty.toLowerCase()}`}>{s.difficulty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fun equivalents */}
      {totalLogged > 0 && (
        <div className="equivalents-card">
          <h3 className="section-title">Your {totalLogged.toFixed(1)} kg saved is like...</h3>
          <div className="equiv-list">
            <div className="equiv-item">
              🌳 Planting <strong>{Math.round(totalLogged / 21 * 365)}</strong> trees for a year
            </div>
            <div className="equiv-item">
              🚗 Avoiding <strong>{Math.round(totalLogged / 0.21)}</strong> km of petrol driving
            </div>
            <div className="equiv-item">
              💡 Powering a home for <strong>{Math.round(totalLogged / 0.233 / 24)}</strong> days
            </div>
            <div className="equiv-item">
              ✈️ <strong>{Math.round((totalLogged / 255) * 100)}%</strong> of a London–New York flight
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
