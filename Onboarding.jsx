import { useState } from "react";

const STEPS = [
  {
    id: "transport",
    title: "How do you usually get around?",
    subtitle: "Pick your primary commute method",
    field: "mainTransport",
    options: [
      { value: "car_petrol", label: "Petrol car", emoji: "🚗" },
      { value: "car_diesel", label: "Diesel car", emoji: "🚙" },
      { value: "car_electric", label: "Electric car", emoji: "⚡" },
      { value: "motorbike", label: "Motorbike", emoji: "🏍️" },
      { value: "bus", label: "Bus", emoji: "🚌" },
      { value: "train", label: "Train", emoji: "🚂" },
      { value: "cycling", label: "Cycling", emoji: "🚴" },
      { value: "walking", label: "Walking", emoji: "🚶" },
    ],
  },
  {
    id: "diet",
    title: "What does your diet look like?",
    subtitle: "Be honest — this is private to you",
    field: "diet",
    options: [
      { value: "vegan", label: "Vegan", emoji: "🌱" },
      { value: "vegetarian", label: "Vegetarian", emoji: "🥕" },
      { value: "flexitarian", label: "Flexitarian", emoji: "🥑" },
      { value: "omnivore", label: "Omnivore", emoji: "🍗" },
      { value: "heavy_meat", label: "Meat most meals", emoji: "🥩" },
    ],
  },
  {
    id: "energy",
    title: "Home energy use",
    subtitle: "Rough monthly electricity use (kWh). Check a recent bill if unsure.",
    field: "monthlyElectricity",
    type: "slider",
    min: 50,
    max: 1000,
    default: 300,
    unit: "kWh/month",
  },
  {
    id: "shopping",
    title: "How would you describe your shopping habits?",
    subtitle: "New clothes, gadgets, homewares — how often?",
    field: "shoppingHabits",
    options: [
      { value: "low", label: "Minimal buyer", emoji: "♻️" },
      { value: "medium", label: "Occasional", emoji: "🛍️" },
      { value: "high", label: "Regular shopper", emoji: "🏪" },
    ],
  },
  {
    id: "commute",
    title: "How far is your daily commute?",
    subtitle: "One way, in kilometres",
    field: "commuteKm",
    type: "slider",
    min: 0,
    max: 100,
    default: 15,
    unit: "km one way",
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ monthlyElectricity: 300, commuteKm: 15 });
  const [name, setName] = useState("");
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return (
      <div className="onboarding-wrap">
        <div className="onboarding-card intro-card">
          <div className="intro-logo">🌿</div>
          <h1 className="intro-title">CarbonTrace</h1>
          <p className="intro-sub">
            Know your footprint. Cut what matters. No guilt — just clarity.
          </p>
          <p className="intro-body">
            In 5 quick questions we'll calculate your personal carbon footprint,
            identify your biggest opportunities, and give you a daily action
            plan that actually fits your life.
          </p>
          <div className="name-input-wrap">
            <input
              className="name-input"
              placeholder="What should we call you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => name.trim() && setShowIntro(false)}
            disabled={!name.trim()}
          >
            Let's find out →
          </button>
          <p className="intro-privacy">All data stays on your device. Nothing is uploaded.</p>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const handleSelect = (field, value) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);
    if (current.type !== "slider") {
      setTimeout(() => {
        if (isLast) {
          onComplete({ ...updated, name: name.trim() });
        } else {
          setStep(step + 1);
        }
      }, 200);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onComplete({ ...answers, name: name.trim() });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="step-count">{step + 1} of {STEPS.length}</div>
        <h2 className="step-title">{current.title}</h2>
        <p className="step-sub">{current.subtitle}</p>

        {current.type === "slider" ? (
          <div className="slider-wrap">
            <div className="slider-value">
              {answers[current.field]} <span className="slider-unit">{current.unit}</span>
            </div>
            <input
              type="range"
              min={current.min}
              max={current.max}
              value={answers[current.field]}
              onChange={(e) => setAnswers({ ...answers, [current.field]: parseInt(e.target.value) })}
              className="range-input"
            />
            <div className="slider-labels">
              <span>{current.min}</span>
              <span>{current.max}</span>
            </div>
            <button className="btn-primary" onClick={handleNext}>
              {isLast ? "Calculate my footprint →" : "Next →"}
            </button>
          </div>
        ) : (
          <div className="options-grid">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                className={`option-btn ${answers[current.field] === opt.value ? "selected" : ""}`}
                onClick={() => handleSelect(current.field, opt.value)}
              >
                <span className="option-emoji">{opt.emoji}</span>
                <span className="option-label">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {step > 0 && (
          <button className="btn-back" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
