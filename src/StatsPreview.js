import { useRef, useEffect, useState } from "react";

function StatsPreview({ round, roundElementRef }) {
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
                {round.stats.putts && (
                    <div className="stat-preview-item">
                        <span className="stat-preview-label">Putts</span>
                        <span className="stat-preview-value">{round.stats.putts}</span>
                    </div>
                )}
                {round.stats.fairways && (
                    <div className="stat-preview-item">
                        <span className="stat-preview-label">Fairways Hit</span>
                        <span className="stat-preview-value">
                            {round.stats.fairways.made}/{round.stats.fairways.outOf}
                            <span className="stat-preview-percent">
                                ({Math.round((round.stats.fairways.made / round.stats.fairways.outOf) * 100)}%)
                            </span>
                        </span>
                    </div>
                )}
                {round.stats.greens && (
                    <div className="stat-preview-item">
                        <span className="stat-preview-label">Greens in Regulation</span>
                        <span className="stat-preview-value">
                            {round.stats.greens.made}/{round.stats.greens.outOf}
                            <span className="stat-preview-percent">
                                ({Math.round((round.stats.greens.made / round.stats.greens.outOf) * 100)}%)
                            </span>
                        </span>
                    </div>
                )}
                {round.stats.up_and_downs && (
                    <div className="stat-preview-item">
                        <span className="stat-preview-label">Up & Downs</span>
                        <span className="stat-preview-value">
                            {round.stats.up_and_downs.made}/{round.stats.up_and_downs.outOf}
                            <span className="stat-preview-percent">
                                ({Math.round((round.stats.up_and_downs.made / round.stats.up_and_downs.outOf) * 100)}%)
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatsPreview;