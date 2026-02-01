import { useState } from "react";
import "./Home.css";

function Home({ SignUp, Login }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="home-modal-overlay">
      <div className="home-container">
        <div className="home-content">
          <div className="home-hero">
            <div className="golf-icon">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="8" fill="#fff" />
                <path d="M 50 50 L 50 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="10" r="4" fill="#fff" />
              </svg>
            </div>
            <h1 className="home-title">Golf Stats Tracker</h1>
            <p className="home-subtitle">Track your rounds, analyze your game, improve your score</p>
          </div>

          <div className="home-buttons">
            <button className="home-login-btn" onClick={() => setShowLogin(true)}>
              Log In
            </button>
            <button className="home-signup-btn" onClick={() => setShowSignUp(true)}>
              Sign Up
            </button>
          </div>

          <div className="home-features">
            <div className="feature-card" onClick={() => setShowLogin(true)}>
              <div className="feature-icon">📊</div>
              <h3>Track Stats</h3>
              <p>Record every round and watch your progress</p>
            </div>
            <div className="feature-card" onClick={() => setShowLogin(true)}>
              <div className="feature-icon">📈</div>
              <h3>Analyze Performance</h3>
              <p>View detailed analytics and trends</p>
            </div>
            <div className="feature-card" onClick={() => setShowLogin(true)}>
              <div className="feature-icon">🏆</div>
              <h3>Improve Your Game</h3>
              <p>Identify strengths and areas to work on</p>
            </div>
          </div>
        </div>

        {showLogin && (
          <Login closeLogin={() => setShowLogin(false)} signUpFromLogin={() => { setShowLogin(false); setShowSignUp(true); }} />
        )}

        {showSignUp && (
          <SignUp closeSignUp={() => setShowSignUp(false)} loginFromSignUp={() => { setShowSignUp(false); setShowLogin(true); }} />
        )}
      </div>
    </div>
  );
}

export default Home;