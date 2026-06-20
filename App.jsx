import { useState, useEffect, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";
import ActionHub from "./components/ActionHub";
import Insights from "./components/Insights";
import Nav from "./components/Nav";
import { calculateFootprint } from "./utils/footprintCalc";
import { generateInsights } from "./utils/insightEngine";

const STORAGE_KEY = "carbontrace_user";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [weeklyLog, setWeeklyLog] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setUser(data.user);
      setWeeklyLog(data.weeklyLog || []);
    }
  }, []);

  const saveData = useCallback((userData, log) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, weeklyLog: log }));
  }, []);

  const handleOnboardingComplete = (profileData) => {
    const footprint = calculateFootprint(profileData);
    const newUser = { ...profileData, footprint, joined: new Date().toISOString() };
    setUser(newUser);
    saveData(newUser, []);
  };

  const logAction = (action) => {
    const entry = { ...action, date: new Date().toISOString(), id: Date.now() };
    const newLog = [entry, ...weeklyLog].slice(0, 100);
    setWeeklyLog(newLog);
    saveData(user, newLog);
  };

  if (!user) return <Onboarding onComplete={handleOnboardingComplete} />;

  const insights = generateInsights(user, weeklyLog);

  return (
    <div className="app">
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === "dashboard" && (
          <Dashboard user={user} weeklyLog={weeklyLog} insights={insights} />
        )}
        {activeTab === "actions" && (
          <ActionHub user={user} onLog={logAction} weeklyLog={weeklyLog} />
        )}
        {activeTab === "insights" && (
          <Insights user={user} weeklyLog={weeklyLog} insights={insights} />
        )}
      </main>
    </div>
  );
}
