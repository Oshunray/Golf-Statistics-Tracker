import { useState, useEffect} from "react";

function CustomStatsModal({ onClose, onAddCustomStat }) {
  const [statName, setStatName] = useState("");
  const [statType, setStatType] = useState("number");
  const [key, setKey] = useState("");

  useEffect (() => {
    setKey(statName.toLowerCase().replace(/\s+/g, "_"));
  }, [statName]);

  const handleAdd = () => {
    if (statName.trim() === "") {
      return;
    }

    onAddCustomStat({
      key,
      label: statName,
      type: statType
    });

    setStatName("");
    setStatType("number");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">✕</button>
        <h2>Add Custom Statistic</h2>
        
        {/* Row 1: Statistic Name */}
        <div className="form-group full-width">
          <label>Statistic Name:</label>
          <input 
            type="text"
            value={statName}
            onChange={(e) => setStatName(e.target.value)}
            placeholder="e.g., Sand Saves"
          />
        </div>

        {/* Row 2: Type and Add Button */}
        <div className="form-row-with-button">
          <div className="form-group">
            <label>Type:</label>
            <select
              value={statType}
              onChange={(e) => setStatType(e.target.value)}
            >
              <option value="number">Number</option>
              <option value="ratio">Percentage</option>
            </select>
          </div>

          <button onClick={handleAdd} className="add-button">Add Statistic</button>
        </div>
      </div>
    </div>
  )
}

export default CustomStatsModal;