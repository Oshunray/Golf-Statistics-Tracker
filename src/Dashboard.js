import './Dashboard.css';
import { handicapStatisticsCorrelation } from './statsUtils';
import { useState } from 'react';
import './EditProfile.css';

function Dashboard({ roundHistory, viewHistory, userProfile, addRound, viewStatistics, openEditProfile }) {
  
  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome Back, {userProfile?.username || 'Golfer'}! ⛳</h1>
          <button className = "edit-profile-btn" onClick={openEditProfile}>Current Goal: {userProfile?.currentGoal || 'Set Your Goal Score!'}</button>
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


export function EditProfileModal({ userProfile, onClose, onSave }) {
  const [selectedGoal, setSelectedGoal] = useState(userProfile?.currentGoal || '');

  const handleSave = () => {
    if (onSave && selectedGoal) {
      onSave({ ...userProfile, currentGoal: selectedGoal });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="goal-select">Select Your Goal Score Range</label>
            <select
              id="goal-select"
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="goal-select"
            >
              <option value="">-- Select a Goal --</option>
              {Object.keys(handicapStatisticsCorrelation).map(scoreRange => (
                <option key={scoreRange} value={scoreRange}>
                  {scoreRange}
                </option>
              ))}
            </select>
          </div>

          {selectedGoal && (
            <div className="goal-stats-preview">
              <h4>Target Statistics for {selectedGoal}:</h4>
              <ul>
                <li>Fairways: {handicapStatisticsCorrelation[selectedGoal].fairways}%</li>
                <li>Greens in Regulation: {handicapStatisticsCorrelation[selectedGoal].greens}%</li>
                <li>Putts: {handicapStatisticsCorrelation[selectedGoal].putts}</li>
                <li>Up & Downs: {handicapStatisticsCorrelation[selectedGoal].up_and_downs}%</li>
                <li>Three Putts: {handicapStatisticsCorrelation[selectedGoal].three_putts}</li>
                <li>Double Bogeys: {handicapStatisticsCorrelation[selectedGoal].double_bogeys}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn-save" 
            onClick={handleSave}
            disabled={!selectedGoal}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}