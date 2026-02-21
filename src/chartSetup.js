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
import { getStatLabel, getStatValues } from "./Statistics";
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

// Detect mobile once at render time
const isMobile = () => window.innerWidth <= 600;

export const LineGraph = ({ rounds, statType, availableStats, dataType }) => {
  if (!rounds || rounds.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#546e5a" }}>
        <p>No rounds data available yet. Add some rounds to see your progress!</p>
      </div>
    );
  }

  const mobile = isMobile();

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
      // Shorter date format on mobile
      return date.toLocaleDateString("en-US", mobile
        ? { month: "short", day: "numeric" }
        : { month: "short", day: "numeric", year: "numeric" }
      );
    });
  } else if (dataType === "monthly") {
    const monthlyAverages = calculateMonthlyAverages(filteredRounds, statType);
    dataValues = monthlyAverages.map((entry) => entry.average);
    labels = monthlyAverages.map((entry) => {
      const [yearStr, monthStr] = entry.yearMonth.split("-");
      const year = Number(yearStr);
      const monthIndex = Number(monthStr) - 1;
      const date = new Date(year, monthIndex, 1);
      if (!Number.isNaN(year) && year >= 0 && year < 100) date.setFullYear(year);
      return date.toLocaleDateString("en-US", mobile
        ? { month: "short" }
        : { month: "short", year: "numeric" }
      );
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
        pointRadius: mobile ? 3 : 5,
        pointHoverRadius: mobile ? 5 : 7,
        pointBackgroundColor: "rgba(122, 203, 155, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2
      },
      {
        label: "All-Time Avg",
        data: Array(dataValues.length).fill(allTimeAverage),
        borderDash: [5, 5],
        borderColor: "rgba(26, 228, 107, 0.8)",
        backgroundColor: "rgba(31, 61, 43, 0.2)",
        pointRadius: 0,
        borderWidth: 1,
        tension: 0
      },
      {
        label: "Yearly Avg",
        data: Array(dataValues.length).fill(yearlyMovingAverages),
        borderDash: [5, 5],
        borderColor: "rgba(28, 42, 233, 0.8)",
        backgroundColor: "rgba(122, 203, 155, 0.2)",
        pointRadius: 0,
        borderWidth: 1,
        tension: 0
      },
      {
        label: "Monthly Avg",
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

  // Compute suggested min/max
  const numericData = (dataValues || []).filter((v) => typeof v === "number" && Number.isFinite(v));
  let suggestedMin, suggestedMax;
  if (numericData.length === 0) {
    suggestedMin = 0;
    suggestedMax = 100;
  } else {
    const minVal = Math.min(...numericData);
    const maxVal = Math.max(...numericData);
    if (statType === "score") {
      suggestedMin = Math.min(30, minVal - 5);
      suggestedMax = maxVal + 5;
    } else if (numericData.every((v) => v >= 0 && v <= 100)) {
      const padding = (maxVal - minVal) * 0.1;
      suggestedMin = Math.max(0, minVal - padding);
      suggestedMax = Math.min(100, maxVal + padding);
    } else {
      const padding = (maxVal - minVal) * 0.1 || 5;
      suggestedMin = minVal - padding;
      suggestedMax = maxVal + padding;
    }
  }

  const options = {
    responsive: true,
    // On mobile: disable fixed aspect ratio so we can control height via the container
    maintainAspectRatio: !mobile,
    aspectRatio: mobile ? undefined : 2,
    plugins: {
      legend: {
        display: true,
        position: mobile ? "bottom" : "top",
        labels: {
          font: { size: mobile ? 10 : 12 },
          boxWidth: mobile ? 20 : 40,
          padding: mobile ? 8 : 10,
          // Wrap long labels on mobile
          usePointStyle: true,
          pointStyleWidth: mobile ? 8 : 10
        }
      },
      title: {
        display: true,
        text: getStatLabel(statType, availableStats),
        font: { size: mobile ? 13 : 18, weight: "bold" },
        color: "#1f3d2b",
        padding: { bottom: mobile ? 8 : 16 }
      },
      tooltip: {
        backgroundColor: "rgba(31, 61, 43, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: mobile ? 8 : 12,
        cornerRadius: 8,
        // Larger touch targets on mobile
        intersect: false,
        mode: "index"
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin,
        suggestedMax,
        title: {
          display: !mobile, // Hide y-axis title on mobile to save space
          text: statType === "score" ? "Score" : "Value",
          color: "#1f3d2b",
          font: { size: 14, weight: "bold" }
        },
        ticks: {
          font: { size: mobile ? 10 : 12 },
          maxTicksLimit: mobile ? 5 : 8
        },
        grid: { color: "rgba(122, 203, 155, 0.1)" }
      },
      x: {
        title: {
          display: !mobile, // Hide x-axis title on mobile to save space
          text: "Date",
          color: "#1f3d2b",
          font: { size: 14, weight: "bold" }
        },
        ticks: {
          font: { size: mobile ? 9 : 12 },
          maxRotation: mobile ? 45 : 0,
          autoSkip: true,
          maxTicksLimit: mobile ? 6 : 12 // Show fewer labels on mobile
        },
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{
      padding: mobile ? "12px" : "20px",
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      // Fixed height container on mobile so chart fills it properly
      height: mobile ? "300px" : "auto",
      position: "relative"
    }}>
      <Line options={options} data={lineChartData} />
    </div>
  );
};