import { useState } from "react";
import "./ViewRound.css";
import StatsModal from "./StatsModal";

function ViewRound({ selectedRound, onSave, availableStats }) {
  const [course, setCourse] = useState(selectedRound.course);
  const [date, setDate] = useState(selectedRound.date);
  const [score, setScore] = useState(selectedRound.score);
  const [par, setPar] = useState(selectedRound.par || "");
  const [holesPlayed, setHolesPlayed] = useState(selectedRound.holesPlayed || 18);
  const [stats, setStats] = useState(selectedRound.stats || {});
  const [showStatsModal, setShowStatsModal] = useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get selected stats from current round stats
  const getSelectedStats = () => {
    return Object.keys(stats).filter(key => {
      const value = stats[key];
      // Check if stat has a value
      if (typeof value === 'object' && value.made !== undefined) return true;
      if (typeof value === 'number' || (typeof value === 'string' && value !== '')) return true;
      return false;
    });
  };

  const handleSave = () => {
    if (!course || !date || !score || new Date(date) > today) {
      alert("Please fill in all required fields with valid data");
      return;
    }

    const updatedRound = {
      ...selectedRound,
      course,
      date,
      score: Number(score),
      par: par ? Number(par) : selectedRound.par,
      holesPlayed,
      stats,
      id: selectedRound.id,
    };

    onSave(updatedRound);
  };

  const handleCancel = () => {
    onSave(selectedRound);
  };

  const handleStatsEdit = () => {
    setShowStatsModal(true);
  };

  const handleStatsSave = (newSelectedStats, newStats) => {
    setStats(newStats);
    setShowStatsModal(false);
  };

  return (
    <div className="viewround-overlay" onClick={handleCancel}>
      <div className="viewround-modal" onClick={(e) => e.stopPropagation()}>
        <div className="viewround-header">
          <h2>View Round</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>

        <div className="viewround-body">
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              placeholder="Enter course name"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Score</label>
              <input
                type="number"
                placeholder="e.g. 72"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Par</label>
              <input
                type="number"
                placeholder="e.g. 72"
                value={par}
                onChange={(e) => setPar(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Holes Played</label>
              <select
                value={holesPlayed}
                onChange={(e) => setHolesPlayed(Number(e.target.value))}
                className="form-select"
              >
                <option value={9}>9 Holes</option>
                <option value={18}>18 Holes</option>
              </select>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="stats-section">
            <div className="stats-section-header">
              <h3>Statistics</h3>
              <button className="edit-stats-btn" onClick={handleStatsEdit}>
                {Object.keys(stats).length > 0 ? 'Edit Stats' : 'Add Stats'}
              </button>
            </div>

            {Object.keys(stats).length > 0 ? (
              <div className="stats-preview">
                <div className="stats-grid">
                  {stats.putts && (
                    <div className="stat-item">
                      <span className="stat-label">Putts:</span>
                      <span className="stat-value">{stats.putts}</span>
                    </div>
                  )}
                  {stats.fairways && (
                    <div className="stat-item">
                      <span className="stat-label">Fairways:</span>
                      <span className="stat-value">{stats.fairways.made}/{stats.fairways.outOf}</span>
                    </div>
                  )}
                  {stats.greens && (
                    <div className="stat-item">
                      <span className="stat-label">GIR:</span>
                      <span className="stat-value">{stats.greens.made}/{stats.greens.outOf}</span>
                    </div>
                  )}
                  {stats.up_and_downs && (
                    <div className="stat-item">
                      <span className="stat-label">Up & Downs:</span>
                      <span className="stat-value">{stats.up_and_downs.made}/{stats.up_and_downs.outOf}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="no-stats">No statistics recorded for this round</p>
            )}
          </div>
        </div>

        <div className="viewround-footer">
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* Stats Modal */}
      {showStatsModal && (
        <StatsModal
          availableStats={availableStats}
          selectedStats={getSelectedStats()}
          stats={stats}
          onSave={handleStatsSave}
          onClose={() => setShowStatsModal(false)}
        />
      )}
    </div>
  );
}

export default ViewRound;