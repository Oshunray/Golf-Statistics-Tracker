import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getStatLabel, getStatValues} from "./Statistics";
import { calculateAverage, calculateMovingYearlyAverages, calculateMonthlyMovingAverage, calculateMonthlyAverages, calculateYearlyAverages } from "./statsUtils";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineGraph = ({ rounds, statType, availableStats, dataType}) => {
  if (!rounds || rounds.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#546e5a" }}>
        <p>No rounds data available yet. Add some rounds to see your progress!</p>
      </div>
    );
  }

  const filteredRounds = rounds.filter(round => {
    if (statType === "score") return round.score != null;
    if (statType === "par") return round.score != null && round.par != null;
    return round.stats && statType in round.stats && round.stats[statType] != null;
  });

  let labels;
  let dataValues;
  
  if (dataType === "individual") {
    dataValues = filteredRounds.map((round) => {
      if (statType === "score") return round.score;
      if (statType === "par") return round.score - round.par;

      const stat = round.stats[statType];
      if (typeof stat === "object" && "made" in stat && "outOf" in stat) {
        return stat.outOf > 0 ? (stat.made / stat.outOf) * 100 : null;
      }
      return stat;
    });

    labels = filteredRounds.map((round) => {
      const date = new Date(round.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    });
  } else if (dataType === "monthly") {
    const monthlyAverages = calculateMonthlyAverages(filteredRounds, statType);
    dataValues = monthlyAverages.map((entry) => entry.average);
    labels = monthlyAverages.map((entry) => entry.yearMonth);
    labels = labels.map((ym) => {
      const [yearStr, monthStr] = ym.split("-");
      const year = Number(yearStr);
      const monthIndex = Number(monthStr) - 1;
      const date = new Date(year, monthIndex, 1);
      if (!Number.isNaN(year) && year >= 0 && year < 100) {
        date.setFullYear(year);
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    });
  } else if (dataType === "yearly") {
    const yearlyAverages = calculateYearlyAverages(filteredRounds, statType);
    dataValues = yearlyAverages.map((entry) => entry.average);
    labels = yearlyAverages.map((entry) => entry.year);
  }

  const allTimeAverage = Number(calculateAverage(getStatValues(filteredRounds, statType)));
  const monthlyMovingAverages = calculateMonthlyMovingAverage(filteredRounds, statType);
  const yearlyMovingAverages = calculateMovingYearlyAverages(filteredRounds, statType);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: getStatLabel(statType, availableStats),
        data: dataValues,
        borderColor: "rgba(122, 203, 155, 1)",
        backgroundColor: "rgba(122, 203, 155, 0.2)",
        tension: 0.15,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgba(122, 203, 155, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2
      },
      
      {
        label: "All-Time Average",
        data: Array(dataValues.length).fill(allTimeAverage),
        borderDash: [5, 5],
        borderColor: "rgba(26, 228, 107, 0.8)",
        backgroundColor: "rgba(31, 61, 43, 0.2)",
        pointRadius: 0,
        borderWidth: 1,
        tension: 0
      },
      {
        label: "Moving Yearly Average",
        data: Array(dataValues.length).fill(yearlyMovingAverages),
        borderDash: [5, 5],
        borderColor: "rgba(28, 42, 233, 0.8)",
        backgroundColor: "rgba(122, 203, 155, 0.2)",
        pointRadius: 0,
        borderWidth: 1,
        tension: 0
      },
      {
        label: "Monthly Moving Average",
        data: Array(dataValues.length).fill(monthlyMovingAverages),
        borderDash: [5, 5],
        borderColor: "rgba(218, 43, 31, 0.8)",
        backgroundColor: "rgba(123, 122, 203, 0.2)",
        pointRadius: 0,
        borderWidth: 1,
        tension: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: getStatLabel(statType, availableStats),
        font: { size: 18, weight: "bold" },
        color: "#1f3d2b"
      },
      tooltip: {
        backgroundColor: "rgba(31, 61, 43, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: statType === "score" ? "Score" : "Value",
          color: "#1f3d2b",
          font: { size: 14, weight: "bold" }
        },
        grid: { color: "rgba(122, 203, 155, 0.1)" }
      },
      x: {
        title: { display: true, text: "Date", color: "#1f3d2b", font: { size: 14, weight: "bold" } },
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <Line options={options} data={lineChartData} />
    </div>
  );
};