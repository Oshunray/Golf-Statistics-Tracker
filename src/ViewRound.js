import { useState } from "react";
function ViewRound({selectedRound, onSave}) {

    const [course, setCourse] = useState(selectedRound.course);
    const [date, setDate] = useState(selectedRound.date);
    const [score, setScore] = useState(selectedRound.score);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const handleRound = () => {
      if (!course || !date || !score || new Date(date) > today) {
        return;
      }

      const updatedRound = {
        course,
        date,
        score: Number(score),
        id: selectedRound.id,
      }

        onSave(updatedRound);
    };
    

    return (
    <div className="viewRound-overlay" onClick={onSave}>
      <div className="viewRound" onClick={(e) => e.stopPropagation()}>
        <h2>Round Data</h2>

        <label>Course Name:</label>
        <input 

          type="text"
          placeholder="Enter course name"
          value={course}
          onChange ={(e) => setCourse(e.target.value)}
        />
        <br></br>

        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange ={(e) => setDate(e.target.value)}
        />
        <br></br>

        <label>Score:</label>
        <input
          type="number"
          placeholder="e.g. 72"
          value={score}
          onChange ={(e) => setScore(e.target.value)}
        />
        <button onClick={handleRound}>Save</button>
      </div>
    </div>
    );
};

export default ViewRound;