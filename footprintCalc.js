// Carbon footprint calculation based on lifestyle inputs
// Emission factors sourced from DEFRA 2023 and EPA datasets

const EMISSION_FACTORS = {
  transport: {
    car_petrol: 0.21,      // kg CO2 per km
    car_diesel: 0.17,
    car_electric: 0.05,
    motorbike: 0.11,
    bus: 0.09,
    train: 0.04,
    subway: 0.03,
    walking: 0,
    cycling: 0,
  },
  diet: {
    vegan: 1.5,            // kg CO2 per day
    vegetarian: 2.0,
    flexitarian: 2.8,
    omnivore: 3.8,
    heavy_meat: 5.2,
  },
  home: {
    electricity_per_kwh: 0.233,  // UK grid average
    gas_per_kwh: 0.203,
    oil_per_litre: 2.54,
  },
  shopping: {
    low: 0.5,              // kg CO2 per day
    medium: 1.5,
    high: 3.0,
  },
};

export function calculateFootprint(profile) {
  let daily = 0;
  let breakdown = {};

  // Transport
  const transportFactor = EMISSION_FACTORS.transport[profile.mainTransport] || 0.1;
  const transportDaily = profile.commuteKm ? (profile.commuteKm * 2 * transportFactor) / 5 : transportFactor * 10;
  breakdown.transport = parseFloat(transportDaily.toFixed(2));
  daily += transportDaily;

  // Diet
  const dietFactor = EMISSION_FACTORS.diet[profile.diet] || 3.0;
  breakdown.diet = dietFactor;
  daily += dietFactor;

  // Home energy
  const monthlyKwh = profile.monthlyElectricity || 300;
  const energyDaily = (monthlyKwh * EMISSION_FACTORS.home.electricity_per_kwh) / 30;
  breakdown.energy = parseFloat(energyDaily.toFixed(2));
  daily += energyDaily;

  // Shopping habits
  const shoppingFactor = EMISSION_FACTORS.shopping[profile.shoppingHabits] || 1.5;
  breakdown.shopping = shoppingFactor;
  daily += shoppingFactor;

  const annual = daily * 365;

  return {
    daily: parseFloat(daily.toFixed(2)),
    annual: parseFloat(annual.toFixed(0)),
    breakdown,
    // Global avg is ~4 tonnes/year; UK avg ~5.5; India avg ~1.9
    vsGlobalAvg: parseFloat(((annual / 4000 - 1) * 100).toFixed(1)),
    grade: getGrade(annual),
  };
}

function getGrade(annualKg) {
  if (annualKg < 2000) return { letter: "A", label: "Low impact", color: "#22c55e" };
  if (annualKg < 3500) return { letter: "B", label: "Below average", color: "#84cc16" };
  if (annualKg < 5000) return { letter: "C", label: "Average", color: "#eab308" };
  if (annualKg < 8000) return { letter: "D", label: "Above average", color: "#f97316" };
  return { letter: "E", label: "High impact", color: "#ef4444" };
}

export function calculateSavingFromAction(actionId, userProfile) {
  const savings = {
    skip_meat: 1.5,
    public_transport: userProfile?.footprint?.breakdown?.transport * 0.6 || 1.2,
    cold_wash: 0.6,
    short_shower: 0.35,
    veg_meal: 0.8,
    reusable_bag: 0.05,
    unplug_devices: 0.15,
    local_produce: 0.4,
    cycle_commute: userProfile?.footprint?.breakdown?.transport * 0.9 || 1.8,
    no_flight: 0.8,       // per day offset
    thermostat_down: 0.45,
    line_dry: 0.5,
  };
  return savings[actionId] || 0.2;
}
