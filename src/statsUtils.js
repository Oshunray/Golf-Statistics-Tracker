import { useState } from 'react';
import { getStatValues } from './Statistics';

function parseDate(dateStr) {
  return new Date(dateStr + 'T00:00:00');
}

export function calculateAverage(values) {
  if (!values || values.length === 0) return null;

  const average = values.reduce((acc, v) => acc + v, 0) / values.length;
  return average.toFixed(2);
}

export function calculateMonthlyAverages(rounds, statKey) {
  const monthlyMap = {};

  rounds.forEach(round => {
    if (!round.date) return;

    // Parse date correctly (assuming YYYY-MM-DD format)
    const date = new Date(round.date + 'T00:00:00');
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyMap[yearMonth]) {
      monthlyMap[yearMonth] = [];
    }


    let value;
    if (statKey === 'score') {
      value = round.score;
    } else if (round.stats && statKey in round.stats) {
      const stat = round.stats[statKey];

      if (stat && typeof stat === 'object' && 'made' in stat && 'outOf' in stat) {
        value = (stat.made / stat.outOf) * 100;
      } else {
        value = stat;
      }
    }

    if (value !== undefined && value !== null) {
      monthlyMap[yearMonth].push(value);
    }
  });

  return Object.entries(monthlyMap).map(([yearMonth, values]) => ({
    yearMonth,
    average: calculateAverage(values)
  }));
}

export function calculateMonthlyMovingAverage(rounds, statKey) {
  if (!rounds || rounds.length === 0) return 0;

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentRounds = rounds.filter(round => {
    const roundDate = parseDate(round.date);
    return roundDate >= oneMonthAgo && roundDate <= now;
  });

  if (recentRounds.length === 0) return 0;

  const values = getStatValues(recentRounds, statKey);

  if (values.length === 0) return 0;

  return calculateAverage(values);
}

export function calculateMovingYearlyAverages(rounds, statKey) {
  if (!rounds || rounds.length === 0) return null;

  // Sort rounds by date (oldest → newest)
  const sorted = [...rounds].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // current date and 12 months ago
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(startDate.getMonth() - 12);

  // filter rounds in the last 12 months and extract the stat
  const last12Months = sorted
    .map(r => {
      if (!r.date) return null;
      const d = new Date(r.date);
      if (d <= startDate || d > currentDate) return null;

      let value;
      if (statKey === "score") {
        value = r.score;
      } else if (r.stats && statKey in r.stats) {
        const stat = r.stats[statKey];
        if (stat && typeof stat === "object" && "made" in stat && "outOf" in stat) {
          value = (stat.made / stat.outOf) * 100;
        } else {
          value = stat;
        }
      }

      return value != null ? Number(value) : null;
    })
    .filter(v => v != null);

  if (last12Months.length === 0) return null;

  const sum = last12Months.reduce((acc, v) => acc + v, 0);
  return (sum / last12Months.length).toFixed(2);
}


export function calculateYearlyAverages(rounds, statKey) {
  const yearlyMap = {};
  rounds.forEach(round => {
    if (!round.date) return;
    const date = new Date(round.date + 'T00:00:00');
    const year = date.getFullYear();

    if (!yearlyMap[year]) {
      yearlyMap[year] = [];
    }

    let value;
    if (statKey === 'score') {
      value = round.score;
    } else if (round.stats && statKey in round.stats) {
      const stat = round.stats[statKey];

      if (stat && typeof stat === 'object' && 'made' in stat && 'outOf' in stat) {
        value = (stat.made / stat.outOf) * 100;
      } else {
        value = stat;
      }
    }

    if (value !== undefined && value !== null) {
      yearlyMap[year].push(value);
    }
  });

  return Object.entries(yearlyMap).map(([year, values]) => ({
    year,
    average: calculateAverage(values)
  }));
}

export function calculateMin(rounds) {
  if (!rounds || rounds.length === 0) return 0;
  const min = Math.min(...rounds.map(r => r.score));
  return min;
}


export function StatSelector({ onStatChange, availableStats }) {
  const [selectedStat, setSelectedStat] = useState("score");

  const handleChange = (e) => {
    const newStat = e.target.value;
    setSelectedStat(newStat);
    onStatChange(newStat);
  };

  const statsOptions = availableStats.map(statKey => (
    <option key ={statKey.key} value={statKey.key}>{statKey.label}{statKey.type === "ratio" && " (%)"}</option>
     
  ));

  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        htmlFor="stat-select"
        style={{
          display: 'block',
          marginBottom: '8px',
          color: '#1f3d2b',
          fontWeight: '600',
          fontSize: '14px'
        }}
      >
        Select Statistic:
      </label>
      <select
        id="stat-select"
        value={selectedStat}
        onChange={handleChange}
        style={{
          padding: '10px 15px',
          borderRadius: '8px',
          border: '2px solid #e6f4ed',
          background: '#f8fdf9',
          color: '#1f3d2b',
          fontSize: '15px',
          cursor: 'pointer',
          fontWeight: '600',
          minWidth: '200px'
        }}
      >
        {statsOptions}
      </select>
    </div>
  );
}

export function getStatValue(round, statKey) {
  if (!round) return null;

  if (statKey === "score") {
    return round.score ?? null;
  }

  if (statKey === "par") {
    return round.score != null && round.par != null
      ? round.score - round.par
      : null;
  }

  if (round.stats && statKey in round.stats) {
    const stat = round.stats[statKey];

    if (
      typeof stat === "object" &&
      stat != null &&
      "made" in stat &&
      "outOf" in stat
    ) {
      return stat.outOf > 0
        ? (stat.made / stat.outOf) * 100
        : null;
    }

    return stat;
  }

  return null;
}