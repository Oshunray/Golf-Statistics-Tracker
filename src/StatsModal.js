import React, { useState } from "react";

function StatsModal({
  availableStats,
  selectedStats,
  stats,
  onSave,
  onClose
}) {
  // LOCAL draft state
  const [draftSelectedStats, setDraftSelectedStats] = useState([...selectedStats]);
  const [draftStats, setDraftStats] = useState({ ...stats });

  const handleDone = () => {
    onSave(draftSelectedStats, draftStats);
  };

  return (
    <div className="stats-modal-overlay">
      <div className="stats-modal">
        <h2>Statistics</h2>

        {/* Select stats */}
        <div className="stats-grid">
          {availableStats.map(stat => (
            <label key={stat.key} className="stats-item">
              <span className="stats-key">{stat.label}</span>
              <input
                type="checkbox"
                checked={draftSelectedStats.includes(stat.key)}
                onChange={() =>
                  setDraftSelectedStats(prev =>
                    prev.includes(stat.key)
                      ? prev.filter(s => s !== stat.key)
                      : [...prev, stat.key]
                  )
                }
              />
            </label>
          ))}
        </div>

        {/* Enter values */}
        {draftSelectedStats.map(statKey => {
          const stat = availableStats.find(s => s.key === statKey);

          if (stat.type === "ratio") {
            const value = draftStats[statKey] || { made: "", outOf: "" };

            return (
              <div key={statKey} className="stats-item">
                <span className="stats-key">{stat.label}</span>
                <input
                  type="number"
                  placeholder="Made"
                  value={value.made}
                  onChange={e =>
                    setDraftStats(prev => ({
                      ...prev,
                      [statKey]: { ...value, made: e.target.value }
                    }))
                  }
                />
                <span> / </span>
                <input
                  type="number"
                  placeholder="Out of"
                  value={value.outOf}
                  onChange={e =>
                    setDraftStats(prev => ({
                      ...prev,
                      [statKey]: { ...value, outOf: e.target.value }
                    }))
                  }
                />
              </div>
            );
          }

          return (
            <div key={statKey} className="stats-item">
              <span className="stats-key">{stat.label}</span>
              <input
                type="number"
                value={draftStats[statKey] || ""}
                onChange={e =>
                  setDraftStats(prev => ({
                    ...prev,
                    [statKey]: e.target.value
                  }))
                }
              />
            </div>
          );
        })}

        <div className="stats-modal-footer">
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatsModal;