import { useRef } from "react";
import StatsPreview from "./StatsPreview";
import { set } from "date-fns";

function RoundHistory({
  round,
  editMode,
  isSelected,
  toggleSelect,
  index,
  onClick,
  isHomePage,
  isClicked,
  onRoundClick,
  onHover,
  registerRef
}) {

  const formattedDate = new Date(
    round.date + "T00:00:00"
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const differential = round.score - round.par;
  const differentialClass =
    differential < 0 ? "under" : differential > 0 ? "over" : "even";
  const differentialText = differential > 0 ? `+${differential}` : differential;

  const handleClick = () => {
    if (editMode) {
      onClick(round);
    } 
    
    if (isClicked) {
      onRoundClick(null);
    }
    else if (!isHomePage) {
      onRoundClick(round);
    }
  };
    

  const handleHover = () => {
    if (!editMode && !isHomePage && round.stats && Object.keys(round.stats).length > 0){
      onHover(round);
    }
  };

  return (
    <>
      {/* HOVER ZONE */}
      <div
        className="round-wrapper"
        onMouseEnter={handleHover}
        onMouseLeave={() => onHover(null)}
        
      >
        {/* ROUND CARD */}
        <button
          className={`round-history-entry ${
            editMode ? "edit" : ""
          } ${isClicked ? "selected" : ""}`}
          onClick={handleClick}
          ref={registerRef}
        >
          <div className="round-entry-header">
            <h3>{round.course}</h3>
          </div>

          <div className="round-entry-body">
            <div className="round-stat">
              <span className="stat-label">Date</span>
              <span className="stat-value">{formattedDate}</span>
            </div>

            <div className="round-stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">
                {round.score}
                <span className={`score-differential ${differentialClass}`}>
                  ({differentialText})
                </span>
              </span>
            </div>

            <div className="round-stat">
              <span className="stat-label">Holes Played</span>
              <span className="stat-value">{round.holesPlayed}</span>
            </div>
          </div>
        </button>

        {/* EDIT MODE SELECT */}
        {editMode && (
          <button
            className={`select ${isSelected ? "true" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelect(index);
            }}
          />
        )}
      </div>
    </>
  );
}

export default RoundHistory;