import React, { useState, useEffect } from "react";
import "./StatsModal.css";

function StatsModal({
  availableStats,
  selectedStats,
  stats,
  onSave,
  onClose,
  openCustomStats
}) {
  // LOCAL draft state - Initialize properly from props
  const [draftSelectedStats, setDraftSelectedStats] = useState([]);
  const [draftStats, setDraftStats] = useState({});

  // Initialize state when modal opens
  useEffect(() => {
    setDraftSelectedStats([...selectedStats]);
    setDraftStats({ ...stats });
  }, [selectedStats, stats]);

  const handleDone = () => {
    onSave(draftSelectedStats, draftStats);
  };

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="stats-modal-header">
          <h2>Statistics</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="stats-modal-body">
          {/* Select stats */}
          <div className="stats-selection">
            <h3>Select Statistics to Track</h3>
            <div className="stats-checkboxes">
              {availableStats.map(stat => (
                <label key={stat.key} className="checkbox-item">
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
                  <span className="checkbox-label">{stat.label}</span>
                </label>
              ))}
              
            </div>
          </div>

          {/* Enter values */}
          {draftSelectedStats.length > 0 && (
            <div className="stats-inputs">
              <h3>Enter Values</h3>
              {draftSelectedStats.map(statKey => {
                const stat = availableStats.find(s => s.key === statKey);

                if (stat.type === "ratio") {
                  const value = draftStats[statKey] || { made: "", outOf: "" };

                  return (
                    <div key={statKey} className="stat-input-group">
                      <label className="stat-label">{stat.label}</label>
                      <div className="ratio-inputs">
                        <input
                          type="number"
                          placeholder="Made"
                          value={value.made}
                          onChange={e =>
                            setDraftStats(prev => ({
                              ...prev,
                              [statKey]: { ...value, made: Number(e.target.value) }
                            }))
                          }
                          className="ratio-input"
                        />
                        <span className="ratio-separator">/</span>
                        <input
                          type="number"
                          placeholder="Out of"
                          value={value.outOf}
                          onChange={e =>
                            setDraftStats(prev => ({
                              ...prev,
                              [statKey]: { ...value, outOf: Number(e.target.value) }
                            }))
                          }
                          className="ratio-input"
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={statKey} className="stat-input-group">
                    <label className="stat-label">{stat.label}</label>
                    <input
                      type="number"
                      placeholder={`Enter ${stat.label.toLowerCase()}`}
                      value={draftStats[statKey] || ""}
                      onChange={e =>
                        setDraftStats(prev => ({
                          ...prev,
                          [statKey]: Number(e.target.value)
                        }))
                      }
                      className="stat-input"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="stats-modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <div> <button className="btn-custom" onClick={(e) => {e.stopPropagation(); openCustomStats(); console.log("OPEN CUSTOM MODAL");}} type="button">Create Custom Stat</button></div>
          <button className="btn-save" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatsModal;