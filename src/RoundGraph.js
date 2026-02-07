import { useState } from 'react';
import { getStatValue, calculateMonthlyMovingAverage, calculateMovingYearlyAverages } from './statsUtils';
import './RoundGraph.css';
import { handicapStatisticsCorrelation } from './statsUtils'; 

function RoundGraph({ clickedRound, allRounds, availableStats, userProfile}) {
    const [currentStat, setCurrentStat] = useState(0);
    const [comparisonMode, setComparisonMode] = useState("allTime");

    // Find which statistics have been recorded for the clicked round
    const selectedStats = [];
    if (clickedRound && clickedRound.stats) {
        availableStats.forEach(stat => {
            if (clickedRound.stats[stat.key]) {
                selectedStats.push({ key: stat.key, label: stat.label, type: stat.type });
            }
        });
    }

    if (selectedStats.length === 0) {
        return (
            <div className="round-graph-empty">
                <p>No statistics recorded for this round.</p>
            </div>
        );
    }

    // Safety check: ensure currentStat is within bounds
    const safeCurrentStat = Math.min(currentStat, selectedStats.length - 1);
    
    // Update currentStat if it's out of bounds
    if (safeCurrentStat !== currentStat) {
        setCurrentStat(safeCurrentStat);
    }

    const statKey = selectedStats[safeCurrentStat].key;
    const uncheckedCurrentValue = getStatValue(clickedRound, statKey);
    const currentValue = (typeof uncheckedCurrentValue === 'number') ? uncheckedCurrentValue : (parseFloat(uncheckedCurrentValue) || null);

    // Calculate average based on comparison mode
    let avgValue = null;
    let comparisonLabel = "";

    if (comparisonMode === "allTime") {
        const values = allRounds
            .map(r => getStatValue(r, statKey))
            .filter(v => v !== null && v !== undefined && typeof v === 'number');
        
        if (values.length > 0) {
            const sum = values.reduce((acc, v) => acc + v, 0);
            avgValue = sum / values.length;
        }
        comparisonLabel = "All Time Average";
    }
    else if (comparisonMode === "monthly") {
        const result = calculateMonthlyMovingAverage(allRounds, statKey);
        avgValue = (result && typeof result === 'number') ? result : (parseFloat(result) || null);
        comparisonLabel = "Moving Monthly Average";
    }
    else if (comparisonMode === "yearly") {
        const result = calculateMovingYearlyAverages(allRounds, statKey);
        avgValue = (result && typeof result === 'number') ? result : (parseFloat(result) || null);
        comparisonLabel = "Moving Yearly Average";
    }

    const isPercentage = selectedStats[safeCurrentStat].type === "ratio";

    // Get goal benchmark if available
    const goalValue = userProfile && 
                      userProfile.currentGoal && 
                      handicapStatisticsCorrelation[userProfile.currentGoal] &&
                      handicapStatisticsCorrelation[userProfile.currentGoal][statKey]
                      ? handicapStatisticsCorrelation[userProfile.currentGoal][statKey]
                      : null;

    // Only calculate if we have valid values
    const hasValidComparison = currentValue !== null && avgValue !== null && !isNaN(avgValue);
    const hasGoalComparison = goalValue !== null && currentValue !== null;

    let maxValue = 100;
    let currentBarWidth = 0;
    let avgBarWidth = 0;
    let goalBarWidth = 0;

    if (hasValidComparison || hasGoalComparison) {
        const statType = selectedStats[safeCurrentStat] && selectedStats[safeCurrentStat].type;
        if (statType !== "ratio") {
            // For non-ratio stats, calculate max based on all values
            const valuesToCompare = [currentValue];
            if (avgValue !== null) valuesToCompare.push(avgValue);
            if (goalValue !== null) valuesToCompare.push(goalValue);
            maxValue = Math.max(...valuesToCompare) * 1.1;
        } else {
            maxValue = 100;
        }

        currentBarWidth = Math.min(100, (currentValue / maxValue) * 100);
        if (avgValue !== null) {
            avgBarWidth = Math.min(100, (avgValue / maxValue) * 100);
        }
        if (goalValue !== null) {
            goalBarWidth = Math.min(100, (goalValue / maxValue) * 100);
        }
    }

    const handlePrevStat = () => {
        setCurrentStat((prev) => {
            const newVal = (prev - 1 + selectedStats.length) % selectedStats.length;
            return newVal;
        });
    };

    const handleNextStat = () => {
        setCurrentStat((prev) => {
            const newVal = (prev + 1) % selectedStats.length;
            return newVal;
        });
    };

    return (
        <div className="round-graph-container">
            <div className="graph-header">
                <h3>Performance Analysis</h3>
                <select
                    value={comparisonMode}
                    onChange={(e) => setComparisonMode(e.target.value)}
                    className="comparison-select"
                >
                    <option value="allTime">vs All Time Average</option>
                    <option value="monthly">vs Monthly Moving Avg</option>
                    <option value="yearly">vs Yearly Moving Avg</option>
                </select>
            </div>

            <div className="stat-navigation">
                <button
                    onClick={handlePrevStat}
                    className="nav-arrow"
                    disabled={selectedStats.length <= 1}
                >
                    ←
                </button>
                <h4 className="stat-title">{selectedStats[safeCurrentStat].label}</h4>
                <button
                    onClick={handleNextStat}
                    className="nav-arrow"
                    disabled={selectedStats.length <= 1}
                >
                    →
                </button>
            </div>

            <div className="comparison-bars">
                {hasValidComparison ? (
                    <>
                        <div className="bar-row">
                            <div className="bar-label">This Round</div>
                            <div className="bar-container">
                                <div
                                    className="bar current"
                                    style={{ width: `${currentBarWidth}%` }}
                                >
                                    <span className="bar-value">
                                        {currentValue.toFixed(isPercentage ? 1 : 0)}
                                        {isPercentage ? '%' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bar-row">
                            <div className="bar-label">{comparisonLabel}</div>
                            <div className="bar-container">
                                <div
                                    className="bar average"
                                    style={{ width: `${avgBarWidth}%` }}
                                >
                                    <span className="bar-value">
                                        {avgValue.toFixed(isPercentage ? 1 : 0)}
                                        {isPercentage ? '%' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {hasGoalComparison && (
                            <div className="bar-row">
                                <div className="bar-label">Goal Target ({userProfile.currentGoal})</div>
                                <div className="bar-container">
                                    <div
                                        className="bar goal"
                                        style={{ width: `${goalBarWidth}%` }}
                                    >
                                        <span className="bar-value">
                                            {goalValue.toFixed(isPercentage ? 1 : 0)}
                                            {isPercentage ? '%' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-comparison-data">
                        {comparisonMode === "monthly" && <p>No rounds played in the last month.</p>}
                        {comparisonMode === "yearly" && <p>No rounds played in the last year.</p>}
                        {comparisonMode === "allTime" && <p>No historical data available for comparison.</p>}
                    </div>
                )}
            </div>

            <div className="stat-counter">
                {safeCurrentStat + 1} of {selectedStats.length} stats
            </div>
        </div>
    );
}

export default RoundGraph;