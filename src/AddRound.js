import React, { useState } from "react";
import StatsModal from "./StatsModal";

function AddRound({ onClose, onAddRound, availableStats, onCustomStatChange }) {
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [score, setScore] = useState("");
  const [holesPlayed, setHolesPlayed] = useState("");
  const [par, setPar] = useState("");

  const [selectedStats, setSelectedStats] = useState([]);
  const [stats, setStats] = useState({});

  const [showStats, setShowStats] = useState(false);

  const today = new Date();
  today.setHours(0,0,0,0);

  const handleRound = () => {
    if (
      !course ||
      !date ||
      !score ||
      new Date(date) > today ||
      (holesPlayed !== 9 && holesPlayed !== 18) ||
      !par
    ) {
      return;
    }

    let adjustedStats = { ...stats };

    // Normalize 9-hole rounds to 18 holes
    if (holesPlayed === 9) {
      Object.keys(adjustedStats).forEach(statKey => {
        const stat = adjustedStats[statKey];

        if (stat == null) return;

        // ratio stats → DO NOT SCALE
        if (typeof stat === "object" && "made" in stat && "outOf" in stat) {
          return;
        }

        // numeric stats → scale
        if (typeof stat === "number") {
          adjustedStats[statKey] = stat * 2;
        }
      });
    }

    const round = {
      course,
      date,
      score: holesPlayed === 9 ? Number(score) * 2 : Number(score),
      par: holesPlayed === 9 ? Number(par) * 2 : Number(par),
      holesPlayed: 18, // everything stored as 18-hole equivalent
      stats: adjustedStats,
      id: crypto.randomUUID(),
    };

    onAddRound(round);
    onClose();
  };

  return (
    <div className="overlay">
      <div className="addRound">
        <div><button onClick={onClose} className="cancel-btn-AddRound">X</button></div>
        <br/>
        <h2>Add New Round</h2>

        <label>Course Name:</label>
        <input 
          type="text"
          placeholder="Enter course name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Score:</label>
        <input
          type="number"
          placeholder="e.g. 72"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <label>Par:</label>
        <input
          type="number"
          placeholder="e.g. 72"
          value={par}
          onChange={(e) => setPar(e.target.value)}
        />

        <label>Holes Played:</label>
        <select
          value={holesPlayed}
          onChange={(e) => setHolesPlayed(Number(e.target.value))}
        >
          <option value="">Select holes played</option>
          <option value={9}>9 Holes</option>
          <option value={18}>18 Holes</option>
        </select>

        <button onClick={() => setShowStats(true)} className ="addStatistics_optional">
          Add Statistics (optional)
        </button>

        {selectedStats.length > 0 && (
          <div className="selected-stats-display">
            <h4>Selected Statistics</h4>
            {selectedStats.map(statKey => {
              const stat = availableStats.find(s => s.key === statKey);
              const value = stats[statKey];

              if (!value) return null;

              if (stat.type === "ratio") {
                return (
                  <p key={statKey}>
                    <strong>{stat.label}:</strong> {value.made}/{value.outOf}
                  </p>
                );
              }

              return (
                <p key={statKey}>
                  <strong>{stat.label}:</strong> {value}
                </p>
              );
            })}
          </div>
        )}

        <div className="action-buttons">

          <button onClick={handleRound} className="submit-btn">Submit Round</button>
        </div>
      </div>

      {showStats && (
        <StatsModal
          availableStats={availableStats}
          selectedStats={selectedStats}
          stats={stats}
          onSave={(newSelectedStats, newStats) => {
            setSelectedStats(newSelectedStats);
            setStats(newStats);
            setShowStats(false);
          }}
          onClose={() => setShowStats(false)}
          openCustomStats={() => {onCustomStatChange();}}
        />
      )}
    </div>
  );
}

export default AddRound;