import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ActionHub from './components/ActionHub';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import OnboardingWizard from './components/OnboardingWizard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(() => {
    return !localStorage.getItem('onboardingComplete');
  });
  const [onboardingData, setOnboardingData] = React.useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleOnboardingComplete = (data) => {
    setShowOnboarding(false);
    setOnboardingData(data);
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(data));
  };

  // Optionally allow skipping onboarding for dev/testing
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingComplete', 'true');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {showOnboarding && isAuthenticated && (
          <OnboardingWizard
            isOpen={showOnboarding}
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/action-hub" /> : 
              <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/action-hub" 
            element={
              isAuthenticated && !showOnboarding ? 
              <ActionHub onboardingData={onboardingData} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/analytics" 
            element={
              isAuthenticated && !showOnboarding ? 
              <AnalyticsPage onboardingData={onboardingData} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/settings" 
            element={
              isAuthenticated && !showOnboarding ? 
              <SettingsPage onboardingData={onboardingData} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App
