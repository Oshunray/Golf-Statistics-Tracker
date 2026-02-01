import './Dashboard.css';

function Dashboard({ roundHistory, viewHistory, userProfile, addRound, viewStatistics }) {
  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome Back, {userProfile?.username || 'Golfer'}! ⛳</h1>

        </div>
        
        <div className="hero-profile">
          <div className="profile-avatar-large">
            {userProfile && userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt={`${userProfile.username} avatar`} />
            ) : (
              <div className="avatar-placeholder">
                {(userProfile?.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button className="edit-profile-btn" onClick={() => {}}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-card" onClick={addRound}>
          <div className="action-icon">➕</div>
          <h3>Add Round</h3>
          <p>Log a new score</p>
        </div>

        <div className="action-card" onClick={viewHistory}>
          <div className="action-icon">📝</div>
          <h3>Round History</h3>
          <p>See all your rounds</p>
        </div>

        <div className="action-card" onClick={viewStatistics}>
          <div className="action-icon">📊</div>
          <h3>View Statistics</h3>
          <p>Analyze your performance</p>
        </div>
        
      </div>

      {/* Recent Rounds Section */}
      <div className="recent-rounds-section">
        <div className="section-header">
          <h2>Recent Rounds</h2>
          <button className="view-all-btn" onClick={viewHistory}>
            View All →
          </button>
        </div>
        
        <div className="rounds-grid">
          {roundHistory()}
        </div>
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <div className="tip-card">
          <div className="tip-icon"></div>
          <div className="tip-content">
            <h4>Pro Tip</h4>
            <p>Tracking your statistics is just as important as staying consistent!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;