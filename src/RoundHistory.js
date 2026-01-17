function RoundHistory({ round, editMode, isSelected, toggleSelect, index, onClick, isHomePage}) {

  const formattedDate = new Date(
    round.date + "T00:00:00"
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="round-wrapper">
      <button
        className={`round-history-entry ${editMode ? "edit" : ""}`}
        onClick={isHomePage ? undefined : () => onClick(round)}>
        <h3>{round.course}</h3>
        <p>Date: {formattedDate}</p>
        <p>Score: {round.score}</p>
      </button>

      {editMode && (
        <button
          className={`select ${isSelected ? "true" : ""}`}
          onClick={() => toggleSelect(index)}
        />
      )}
    </div>
  );
}

export default RoundHistory;