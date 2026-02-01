import { useState } from "react";
import { LogOutUser } from "./Account";
import "./Hamburger.css";

function Hamburger({ dashboard, addRound, viewHistory, viewStatistics, userProfile}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const handleNavClick = (action) => {
    action();
    setMenuOpen(false); // Close menu after clicking
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo/Brand - Same as home page */}
          <div className="navbar-brand" onClick={() => handleNavClick(dashboard)}>
            <div className="golf-logo">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="8" fill="#fff" />
                <path d="M 50 50 L 50 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="10" r="4" fill="#fff" />
              </svg>
            </div>
            <span className="brand-text">Golf Stats Tracker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            <button className="nav-link" onClick={() => handleNavClick(dashboard)}>
              <span className="nav-icon">🏠</span>
              Home
            </button>
            <button className="nav-link" onClick={() => handleNavClick(addRound)}>
              <span className="nav-icon">➕</span>
              Add Round
            </button>
            <button className="nav-link" onClick={() => handleNavClick(viewHistory)}>
              <span className="nav-icon">📝</span>
              History
            </button>
            <button className="nav-link" onClick={() => handleNavClick(viewStatistics)}>
              <span className="nav-icon">📊</span>
              Statistics
            </button>
          </div>

          {/* User Profile & Menu */}
          <div className="navbar-actions">
            <button 
              className={`profile-menu-btn ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="profile-avatar-small">{userProfile && userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={`${userProfile.username} avatar`} />
              ) : (
                <div className="avatar-placeholder-small">
                  {(userProfile?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}</div>
              <svg 
                className="dropdown-arrow"
                width="12" 
                height="8" 
                viewBox="0 0 12 8" 
                fill="none"
              >
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      <div className={`dropdown-menu ${menuOpen ? "open" : ""}`}>
        <div className="dropdown-content">
          <button className="dropdown-link home-link" onClick={() => handleNavClick(dashboard)}>
            <span className="nav-icon">🏠</span>
            Home
          </button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-link mobile-only" onClick={() => handleNavClick(addRound)}>
            <span className="nav-icon">➕</span>
            Add Round
          </button>
          <button className="dropdown-link mobile-only" onClick={() => handleNavClick(viewHistory)}>
            <span className="nav-icon">📝</span>
            History
          </button>
          <button className="dropdown-link mobile-only" onClick={() => handleNavClick(viewStatistics)}>
            <span className="nav-icon">📊</span>
            Statistics
          </button>
          <div className="dropdown-divider mobile-only"></div>
          <button className="dropdown-link logout" onClick={() => { setShowSignOut(true); setMenuOpen(false); }}>
            <span className="nav-icon">🚪</span>
            Log Out
          </button>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Logout Modal */}
      {showSignOut && (
        <LogOutUser closeLogOut={() => setShowSignOut(false)} />
      )}
    </>
  );
}

export default Hamburger;