import React, { useState } from "react";
import StatsModal from "./StatsModal";

function AddRound({ onClose, onAddRound}) {
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [score, setScore] = useState("");
  const [holesPlayed, setHolesPlayed] = useState("");

  const [selectedStats, setSelectedStats] = useState([]);
  const [stats, setStats] = useState({});

  const [showStats, setShowStats] = useState(false);

  const today = new Date();
  today.setHours(0,0,0,0);

  const AVAILABLE_STATS = [
    { key: "fairways", label: "Fairways Hit", type: "ratio", max: 18, min: 0},
    { key: "greens", label: "Greens in Regulation", type: "ratio", max: 18, min: 0 },
    { key: "putts", label: "Putts", type: "number", min: 0},
    { key: "up_and_downs", label: "Up and Downs", type: "ratio", min: 0},
  ];

  const handleRound = () => {
    if (!course || !date || !score || new Date(date) > today || (holesPlayed !== 9 && holesPlayed !== 18)) {
      return;
    }

    const round = {
      course,
      date,
      score: Number(score),
      holesPlayed,
      stats,
      id: crypto.randomUUID(),
    };

    onAddRound(round);
    onClose();         
  };


  return (
    <div className="overlay">
      <div className ="addRound">
        <h2>Add New Round</h2>

        <label>Course Name:</label>
        <input 

          type="text"
          placeholder="Enter course name"
          value={course}
          onChange ={(e) => setCourse(e.target.value)}
        />
        <br></br>

        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange ={(e) => setDate(e.target.value)}
        />
        <br></br>

        <label>Score:</label>
        <input
          type="number"
          placeholder="e.g. 72"
          value={score}
          onChange ={(e) => setScore(e.target.value)}
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

        <div>
          <button onClick={() => setShowStats(true)}>
            Statistics (optional)
          </button>
          <div>
            {selectedStats.length > 0 && (
            <div>
              <h4>Selected Statistics</h4>
              {selectedStats.map(statKey => {
                const stat = AVAILABLE_STATS.find(s => s.key === statKey);
                const value = stats[statKey];

                if (!value) return null;

                if (stat.type === "ratio") {
                  return (
                    <p key={statKey}>
                      {stat.label}: {value.made}/{value.outOf}
                    </p>
                  );
                }

                return (
                  <p key={statKey}>
                    {stat.label}: {value}
                  </p>
                );
              })}
            </div>
          )}
          </div>

          <button onClick={onClose}>Cancel</button>
          <button onClick={handleRound}>Submit</button>
        </div>
      </div>

      {showStats && (
        <StatsModal
          availableStats={AVAILABLE_STATS}
          selectedStats={selectedStats}
          stats={stats}
          onSave={(newSelectedStats, newStats) => {
            setSelectedStats(newSelectedStats);
            setStats(newStats);
            setShowStats(false);
          }}
          onClose={() => setShowStats(false)}
        />
      )}

    </div>
  );
}

export default AddRound;