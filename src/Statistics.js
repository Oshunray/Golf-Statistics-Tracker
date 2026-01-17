export function calculateAverage(values) {
  if (!values || values.length === 0) return 0;

  const sum = values.reduce((acc, v) => {
    return acc + (typeof v === "number" ? v : v.score);
  }, 0);

  return (sum / values.length).toFixed(2);
}


export function calculateMin(rounds) {
  if (!rounds || rounds.length === 0) return 0;
  return Math.min(...rounds.map(r => r.score));
}


export function findMonthlyAverages(rounds) {
  const monthlyMap = {};

  rounds.forEach(round => {
    if (!round.date) return;

    const [month, , year] = round.date.split("/");
    const yearMonth = `${year}-${month}`;

    if (!monthlyMap[yearMonth]) {
      monthlyMap[yearMonth] = [];
    }

    monthlyMap[yearMonth].push(round.score);
  });

  return Object.entries(monthlyMap).map(([yearMonth, scores]) => ({
    yearMonth,
    average: calculateAverage(scores)
  }));
}


export function formatYearMonth(yearMonth) {
  const [year, month] = yearMonth.split("/");

  const date = new Date(year, month - 1);
  return date.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });
}

function Statistics({ userProfile, rounds}) {

  return (
    <div className="statistics">
      <h2>Statistics</h2>

      <p>
        Average Score: {userProfile.averageScore ?? "N/A"}
      </p>

      <p>
        Minimum Score: {userProfile.minScore ?? "N/A"}
      </p>

      <h3>Monthly Averages</h3>

      {userProfile.monthlyAverages.length === 0 ? (
        <p>No rounds yet</p>
      ) : (
        userProfile.monthlyAverages.map((m, i) => (
          <p key={i}>
            {formatYearMonth(m.yearMonth)}: {m.average}
          </p>
        ))
      )}

      {findMonthlyAverages(rounds).map((monthlyAvg, index) => (
        <p key={index}>
          {monthlyAvg.month}: {monthlyAvg.average}
        </p>
      ))}
    </div>
  );
}

export default Statistics;