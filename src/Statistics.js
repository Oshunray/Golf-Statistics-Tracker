
import { calculateAverage, calculateYearlyAverages, calculateMin, StatSelector, calculateMovingYearlyAverages } from "./statsUtils";
import { useState } from "react";
import { LineGraph } from "./chartSetup";

export function getStatValues(rounds, statKey) {
  // Filter out rounds that don't have the stat
  return rounds
    .map(round => {
      if (!round) return null;

      if (statKey === "score") {
        return round.score != null ? round.score : null;
      } else if (statKey === "par") {
        return round.score != null && round.par != null ? round.score - round.par : null;
      } else if (round.stats && statKey in round.stats) {
        const stat = round.stats[statKey];
        if (stat == null) return null;

        // If stat is object like {made, outOf}, calculate %
        if (typeof stat === "object" && "made" in stat && "outOf" in stat) {
          return stat.outOf > 0 ? (stat.made / stat.outOf) * 100 : null;
        }

        // Otherwise return the value (like putts)
        return Number(stat);
      }

      return null;
    })
    // Remove any nulls — rounds without this stat
    .filter(v => v != null);
}

export function getStatLabel(statKey, availableStats) {
  if (statKey === "score") return "Score";
  if (!Array.isArray(availableStats)) return statKey;
  const stat = availableStats.find(s => s && s.key === statKey);
  return stat && stat.label ? stat.label : statKey;
}

function Statistics({ rounds, availableStats }) {
  const [currentStat, setCurrentStat] = useState("score");
  const [typeOfData, setTypeOfData] = useState("individual");

  if (!rounds || rounds.length === 0) {
    return (
      <div className="statistics" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#1f3d2b', marginBottom: '30px', textAlign: 'center' }}>Statistics</h1>
        <p style={{ textAlign: 'center', color: '#546e5a' }}>No rounds recorded yet. Add some rounds to see your statistics!</p>
      </div>
    );
  }

  // Get values for current stat
  const statValues = getStatValues(rounds, currentStat);
  
  // Calculate stats
  const allTimeAverage = calculateAverage(statValues);
  const yearlyAverages = calculateYearlyAverages(rounds, currentStat);
  const movingYearlyAverages =
  calculateMovingYearlyAverages(rounds, currentStat);

  const recentMovingYearlyAverages =
    !movingYearlyAverages || movingYearlyAverages.length === 0
      ? "-"
      : movingYearlyAverages;
  

  
  const recentYearAvg = yearlyAverages.length > 0 
    ? yearlyAverages[yearlyAverages.length - 1].average 
    : '—';


  // For score, show best score instead of monthly average
  const bestScore = currentStat === 'score' ? calculateMin(rounds) : null;

  return (
    <div className="statistics" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1f3d2b', marginBottom: '30px', textAlign: 'center' }}>Statistics</h1>
      
      {/* Total Rounds Display */}
      <div style={{ 
        background: '#f8fdf9', 
        padding: '15px 25px', 
        borderRadius: '12px', 
        border: '2px solid #e6f4ed',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#546e5a', fontSize: '14px' }}>Total Rounds Played</p>
        <p style={{ margin: '5px 0 0 0', color: '#1f3d2b', fontSize: '32px', fontWeight: 'bold' }}>
          {rounds.length}
        </p>
      </div>


      <div>
        {/* Stat Selector */}
        <StatSelector onStatChange={setCurrentStat} availableStats={availableStats} />

        <label style={{ display: 'block', marginBottom: '8px', color: '#1f3d2b', fontWeight: '600', fontSize: '14px' }}>
          View Data As:
        </label>
        <select value={typeOfData} onChange={(e) => setTypeOfData(e.target.value)}>
          <option value="individual">Individual Rounds</option>
          <option value="monthly">Monthly Averages</option>
          <option value="yearly">Yearly Averages</option>
        </select>

      </div>

      {/* Stat Cards */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1f3d2b', marginBottom: '15px' }}>
          {getStatLabel(currentStat, availableStats)} Statistics
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '15px', 
          marginBottom: '30px' 
        }}>
          <div style={{ background: '#f8fdf9', padding: '20px', borderRadius: '12px', border: '2px solid #e6f4ed' }}>
            <p style={{ margin: 0, color: '#546e5a', fontSize: '14px' }}>All-Time Average</p>
            <p style={{ margin: '5px 0 0 0', color: '#1f3d2b', fontSize: '28px', fontWeight: 'bold' }}>
              {allTimeAverage || '—'}
            </p>
          </div>

          {currentStat === 'score' ? (
            <div style={{ background: '#f8fdf9', padding: '20px', borderRadius: '12px', border: '2px solid #e6f4ed' }}>
              <p style={{ margin: 0, color: '#546e5a', fontSize: '14px' }}>Best Score</p>
              <p style={{ margin: '5px 0 0 0', color: '#1f3d2b', fontSize: '28px', fontWeight: 'bold' }}>
                {bestScore || '—'}
              </p>
            </div>
          ) : (
            <div style={{ background: '#f8fdf9', padding: '20px', borderRadius: '12px', border: '2px solid #e6f4ed' }}>
              <p style={{ margin: 0, color: '#546e5a', fontSize: '14px' }}>This Year Average</p>
              <p style={{ margin: '5px 0 0 0', color: '#1f3d2b', fontSize: '28px', fontWeight: 'bold' }}>
                {recentYearAvg}
              </p>
            </div>
          )}

          <div style={{ background: '#f8fdf9', padding: '20px', borderRadius: '12px', border: '2px solid #e6f4ed' }}>
            <p style={{ margin: 0, color: '#546e5a', fontSize: '14px' }}>Moving Yearly Average</p>
            <p style={{ margin: '5px 0 0 0', color: '#1f3d2b', fontSize: '28px', fontWeight: 'bold' }}>
              {recentMovingYearlyAverages}
            </p>
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#546e5a'
      }}>

      <LineGraph rounds={rounds} statType={currentStat} availableStats={availableStats} dataType={typeOfData} />
      </div>
    </div>
  );
}

export default Statistics;