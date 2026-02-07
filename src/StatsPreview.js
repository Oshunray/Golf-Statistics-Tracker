import { useRef, useEffect, useState } from "react";

function StatsPreview({ round, roundElementRef, availableStats }) {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const previewRef = useRef(null);

    useEffect(() => {
        const updatePosition = () => {
            if (previewRef.current && roundElementRef?.current) {
                // Use requestAnimationFrame to ensure DOM is fully rendered
                requestAnimationFrame(() => {
                    if (!previewRef.current || !roundElementRef?.current) return;
                    
                    const previewRect = previewRef.current.getBoundingClientRect();
                    const roundRect = roundElementRef.current.getBoundingClientRect();
                    
                    const gap = 16;
                    const previewWidth = 350; // Match CSS width
                    
                    // Position to the left of the round
                    let leftPos = roundRect.left - previewWidth - gap - 40;
                    
                    // If not enough space on left, try right
                    if (leftPos < 12) {
                        leftPos = roundRect.right + gap;
                        
                        // If also not enough space on right, clamp to screen
                        if (leftPos + previewWidth > window.innerWidth - 12) {
                            leftPos = 12;
                        }
                    }
                    
                    // Center vertically on round
                    let topPos = roundRect.top + (roundRect.height / 2) - (previewRect.height / 2);
                    
                    // Clamp to viewport
                    if (topPos < 12) topPos = 12;
                    if (topPos + previewRect.height > window.innerHeight - 12) {
                        topPos = window.innerHeight - previewRect.height - 12;
                    }
                    
                    setPosition({ top: topPos, left: leftPos });
                });
            }
        };

        // Initial position
        updatePosition();

        // Recalculate on scroll (in case user scrolls while hovering)
        window.addEventListener('scroll', updatePosition, true);
        
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [roundElementRef]);

    // Filter stats that exist for this round
    const displayStats = availableStats.filter(stat => 
        round.stats && round.stats[stat.key]
    );

    return (
        <div 
            ref={previewRef}
            className="round-history-stats-preview"
            style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
        >
            <h4 className="stats-preview-title">Statistics</h4>
            <div className="stats-preview-list">
                {displayStats.length === 0 ? (
                    <p className="no-stats-message">No statistics recorded</p>
                ) : (
                    displayStats.map(stat => {
                        const statValue = round.stats[stat.key];
                        
                        if (stat.type === "ratio") {
                            // Display ratio stats (e.g., fairways, greens, up_and_downs)
                            const percentage = statValue.outOf > 0 
                                ? Math.round((statValue.made / statValue.outOf) * 100)
                                : 0;
                            
                            return (
                                <div key={stat.key} className="stat-preview-item">
                                    <span className="stat-preview-label">{stat.label}</span>
                                    <span className="stat-preview-value">
                                        {statValue.made}/{statValue.outOf}
                                        <span className="stat-preview-percent">
                                            ({percentage}%)
                                        </span>
                                    </span>
                                </div>
                            );
                        } else {
                            // Display number stats (e.g., putts, three_putts, double_bogeys)
                            return (
                                <div key={stat.key} className="stat-preview-item">
                                    <span className="stat-preview-label">{stat.label}</span>
                                    <span className="stat-preview-value">{statValue}</span>
                                </div>
                            );
                        }
                    })
                )}
            </div>
        </div>
    );
}

export default StatsPreview;