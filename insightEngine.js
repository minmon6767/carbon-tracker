// Generates personalised insights based on user profile and action history

export function generateInsights(user, weeklyLog) {
  const insights = [];
  const { footprint, diet, mainTransport, monthlyElectricity } = user;
  
  if (!footprint) return [];

  const recentActions = weeklyLog.slice(0, 20);
  const actionCounts = recentActions.reduce((acc, a) => {
    acc[a.id] = (acc[a.id] || 0) + 1;
    return acc;
  }, {});

  const totalSavedThisWeek = recentActions
    .filter(a => {
      const date = new Date(a.date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return date > weekAgo;
    })
    .reduce((sum, a) => sum + (a.saving || 0), 0);

  // Biggest impact area
  const breakdown = footprint.breakdown;
  const biggestArea = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0];

  insights.push({
    type: "impact_leader",
    title: `Your biggest source is ${biggestArea[0]}`,
    value: `${biggestArea[1]} kg CO₂/day`,
    detail: getAreaAdvice(biggestArea[0], user),
    priority: 1,
    icon: getAreaIcon(biggestArea[0]),
  });

  // Weekly progress
  if (totalSavedThisWeek > 0) {
    insights.push({
      type: "weekly_win",
      title: "Nice work this week",
      value: `${totalSavedThisWeek.toFixed(1)} kg saved`,
      detail: `That's equivalent to planting ${Math.round(totalSavedThisWeek / 21 * 365)} trees for a year.`,
      priority: 2,
      icon: "🌱",
    });
  }

  // Diet insight
  if (diet === "heavy_meat" || diet === "omnivore") {
    insights.push({
      type: "diet_tip",
      title: "One meat-free day saves more than you think",
      value: "~1.5 kg CO₂",
      detail: "Swapping just one beef meal per week for lentils saves around 78 kg CO₂ annually — more than a return train trip from London to Edinburgh.",
      priority: 3,
      icon: "🥗",
    });
  }

  // Transport insight
  if (mainTransport === "car_petrol" || mainTransport === "car_diesel") {
    insights.push({
      type: "transport_tip",
      title: "Your commute is carbon-heavy",
      value: `${breakdown.transport} kg CO₂/day`,
      detail: "Even going car-free twice a week would cut your annual footprint by over 100 kg. Public transport for the same route emits ~75% less.",
      priority: 4,
      icon: "🚌",
    });
  }

  // Energy insight
  const highElectricity = monthlyElectricity > 400;
  if (highElectricity) {
    insights.push({
      type: "energy_tip",
      title: "Your home energy use is above average",
      value: `${monthlyElectricity} kWh/month`,
      detail: "Switching to a green energy tariff could zero out this category instantly. Setting your thermostat 1°C lower saves ~300 kg CO₂ per year.",
      priority: 5,
      icon: "⚡",
    });
  }

  // Streak insight
  if (recentActions.length >= 5) {
    insights.push({
      type: "streak",
      title: "You're building a habit",
      value: `${recentActions.length} actions logged`,
      detail: "Consistency matters more than perfection. You're in the top 20% of active users this week.",
      priority: 6,
      icon: "🔥",
    });
  }

  // Comparative insight
  const annualKg = footprint.annual;
  if (annualKg > 4000) {
    const overshoot = annualKg - 4000;
    insights.push({
      type: "comparison",
      title: "vs. the global average",
      value: `+${(overshoot / 1000).toFixed(1)} tonnes above`,
      detail: `The global average is ~4 tonnes/year. Closing this gap by 1 tonne is achievable with consistent small changes — no lifestyle overhaul needed.`,
      priority: 7,
      icon: "🌍",
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}

function getAreaAdvice(area, user) {
  const advice = {
    transport: "Switching to public transport or cycling even 2 days a week makes a significant dent. Remote working one day a week helps too.",
    diet: "Diet is one of the highest-leverage changes anyone can make. You don't need to go vegan — cutting red meat frequency matters most.",
    energy: "Consider a smart meter and green energy tariff. LED lighting and draught-proofing are quick wins with lasting impact.",
    shopping: "Buying second-hand, repairing items, and choosing brands with verified carbon commitments all add up.",
  };
  return advice[area] || "Small, consistent changes in this area can significantly reduce your footprint over time.";
}

function getAreaIcon(area) {
  const icons = { transport: "🚗", diet: "🍽️", energy: "💡", shopping: "🛍️" };
  return icons[area] || "📊";
}
