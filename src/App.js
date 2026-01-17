import './App.css';
import './RoundHistory.css';
import './ViewRound.css';
import './HomePage.css';
import './StatsModal.css'

import { useState, useEffect } from "react";

import AddRound from './AddRound';
import RoundHistory from './RoundHistory';
import ViewRound from './ViewRound';
import HomePage from './HomePage';
import Hamburger from './Hamburger';
import Statistics, { findMonthlyAverages } from './Statistics';

import { calculateAverage, calculateMin } from './Statistics';

function GolfApp() {
  const [currentView, setCurrentView] = useState("home");
  const [rounds, setRounds] = useState([]);
  const [edit, setEdit] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [selectedRounds, setSelectedRounds] = useState([]);

  const [profile, setProfile] = useState({
    name: "Roshun",
    averageScore: null,
    minScore: null,
    monthlyAverages: [],
    roundsPlayed: 0
  });

  useEffect(() => {
    
    setProfile(prev => ({
      ...prev,
      averageScore: calculateAverage(rounds),
      minScore: calculateMin(rounds),
      monthlyAverages: findMonthlyAverages(rounds),
      roundsPlayed: rounds.length
    }));
  }, [rounds]);


  const handleAddRound = (round) => {
    setRounds(prev => [...prev, round]);
  };

  const handleSaveHistory = () => {
    setEdit(false);
    setCurrentView("home");
  };

  const handleDeleteRounds = () => {
    setRounds(prev =>
      prev.filter((_, index) => !selectedRounds.includes(index))
    );
    setSelectedRounds([]);
  };

  const handleToggleSelect = (index) => {
    setSelectedRounds(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setSelectedRounds([]);
  };

  const handleRoundClick = (round) => {
    setCurrentRound(round);
    setCurrentView("viewRound");
  };

  const closeViewRound = (updatedRound) => {
    setCurrentView("home");
    setCurrentRound(null);

    setRounds(prev =>
      prev.map(round =>
        round.id === updatedRound.id ? updatedRound : round
      )
    );
  };

  const homePageRounds = () => {
    return rounds.length === 0 ? (
      <p>No rounds recorded yet.</p>
    ) : (
      rounds.slice(0, 3).map((round, index) => (
        <RoundHistory
          key={index}
          round={round}
          index={index}
          editMode={false}
          toggleSelect={handleToggleSelect}
          isSelected={false}
          onClick={handleRoundClick}
          isHomePage={true}
        />
      ))
    );
  };

  const views = {
    home: (
      <HomePage
        roundHistory={homePageRounds}
        viewHistory={() => setCurrentView("viewHistory")}
        userProfile={profile}
      />
    ),

    addRound: (
      <AddRound
        onClose={() => setCurrentView("viewHistory")}
        onAddRound={handleAddRound}
      />
    ),

    viewHistory: (
      <div className="round-history-container">
        <button
          className="add-round-from-history-button"
          onClick={() => setCurrentView("addRound")}
        >
          Add
        </button>

        <h2>Round History</h2>

        

        {edit && (
          <button
            className="close-history-button"
            onClick={handleSaveHistory}
          >
            Save
          </button>
        )}

        {edit && selectedRounds.length > 0 && (
          <>
            <button
              className="add-round-from-history-button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>

            <button
              className="delete-rounds-button"
              onClick={handleDeleteRounds}
            >
              Delete
            </button>
          </>
        )}

        {rounds.length === 0 ? (
          <p>No rounds recorded yet.</p>
        ) : (
          rounds.map((round, index) => (
            <RoundHistory
              key={index}
              round={round}
              index={index}
              editMode={edit}
              toggleSelect={handleToggleSelect}
              isSelected={selectedRounds.includes(index)}
              onClick={handleRoundClick}
            />
          ))
        )}

        {!edit && (
          <>
            <button
              className="edit-history-button"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>

            <button
              className="close-history-button"
              onClick={() => setCurrentView("home")}
            >
              Close History
            </button>
          </>
        )}
      </div>
    ),

    viewStatistics: (
      <Statistics rounds={rounds} userProfile = {profile} />
    ),

    viewRound: (
      <ViewRound
        selectedRound={currentRound}
        onSave={closeViewRound}
      />
    )
  };

  return (
    <div>
      {currentView !== "viewHistory" && currentView !== "addRound" && (
        <Hamburger
          home={() => setCurrentView("home")}
          addRound={() => setCurrentView("addRound")}
          viewHistory={() => setCurrentView("viewHistory")}
          viewStatistics={() => setCurrentView("viewStatistics")}
        />
      )}

      <div
        style={{
          marginTop:
            currentView !== "viewHistory" &&
            currentView !== "addRound"
              ? "60px"
              : "0"
        }}
      >
        {views[currentView] || views.home}
      </div>
    </div>
  );
}

export default GolfApp;