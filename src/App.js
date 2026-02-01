import './App.css';
import './RoundHistory.css';
import './ViewRound.css';
import './Dashboard.css';
import './StatsModal.css'
import "./chartSetup";
import './Statistics.css';
import './Hamburger.css';
import './Account.css';
import './RoundGraph.css';
import './StatsPreview.css';
import './CustomStatsModal.css';

import { useState, useEffect, useRef} from "react";


import AddRound from './AddRound';
import RoundHistory from './RoundHistory';
import ViewRound from './ViewRound';
import Dashboard from './Dashboard';
import Hamburger from './Hamburger';
import RoundGraph from './RoundGraph';
import StatsPreview from './StatsPreview';
import CustomStatsModal from './CustomStatsModal';

import Home from './Home';
import {SignUpButton, LoginButton} from './Account';

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc} from "firebase/firestore";

import Statistics from './Statistics';

function GolfApp() {
  const [currentView, setCurrentView] = useState("home");
  const [rounds, setRounds] = useState([]);
  const [edit, setEdit] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [selectedRounds, setSelectedRounds] = useState([]);
  const [clickedRound, setClickedRound] = useState(null);
  const [hoveredRound, setHoveredRound] = useState(null);
  const [customStatModalOpen, setCustomStatModalOpen] = useState(false);


  const [AVAILABLE_STATS, setAvailableStats] = useState([
    { key: "fairways", label: "Fairways Hit", type: "ratio", max: 18, min: 0},
    { key: "greens", label: "Greens in Regulation", type: "ratio", max: 18, min: 0 },
    { key: "putts", label: "Putts", type: "number", min: 0},
    { key: "up_and_downs", label: "Up and Downs", type: "ratio", min: 0},
    { key: "bogeyOnParFive", label: "Bogeys on Par 5", type: "number", min: 0},
    { key: "three-putts", label: "Three Putts", type: "number", min: 0},
    { key: "bogey_under_130" , label: "Bogeys under 130 yards", type: "number", min: 0},
    { key: "two_chips", label: "Two Chips", type: "number", min: 0},
    { key: "double_bogeys", label: "Double Bogeys", type: "number", min: 0}
  ]);



  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const roundRefs = useRef({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const snap = await getDoc(
          doc(db, "users", firebaseUser.uid)
        );

        if (snap.exists()) {
          const userData = snap.data();
          setProfile(userData);
          // Load rounds from Firebase
          setRounds(userData.rounds || []);

          setAvailableStats(userData.availableStats || AVAILABLE_STATS);
        }

        // Store Availabe Stats with User Data


        setCurrentView("dashboard");
      } else {
        setUser(null);
        setProfile(null);
        setRounds([]);
        setCurrentView("home");
      }
    });

    return () => unsubscribe();
  }, []);


  const handleAddRound = async (round) => {
    if (!user) return;

    const newRounds = [...rounds, round].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    setRounds(newRounds);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        rounds: newRounds
      });
    } catch (error) {
      console.error("Error adding round:", error);
    }
  };

  const handleOnAddCustomStat = async (newStat) => {
    const updatedStats = [...AVAILABLE_STATS, newStat];
    setAvailableStats(updatedStats);

    // Update in Firebase
    if(user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          availableStats: updatedStats
        });
      }
      catch (error) {
        console.error("Error updating available stats:", error);
      }
    }
  };

  const handleDeleteRounds = async () => {
    if (!user) return;

    const newRounds = rounds.filter((_, index) => !selectedRounds.includes(index));
    setRounds(newRounds);
    setSelectedRounds([]);

    // Save to Firebase
    try {
      await updateDoc(doc(db, "users", user.uid), {
        rounds: newRounds
      });
    } catch (error) {
      console.error("Error deleting rounds:", error);
    }
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

  const closeViewRound = async (updatedRound) => {
    setCurrentView("viewHistory");
    setCurrentRound(null);
    
    const newRounds = rounds.map(round =>
      round.id === updatedRound.id ? updatedRound : round
    );
    setRounds(newRounds);

    // Save to Firebase
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          rounds: newRounds
        });
      } catch (error) {
        console.error("Error updating round:", error);
      }
    }
  };

  const homePageRounds = () => {
    return rounds.length === 0 ? (
      <p>No rounds recorded yet.</p>
    ) : (
      rounds.toReversed().slice(0, 3).map((round, index) => (
        <RoundHistory
          key={index}
          round={round}
          index={index}
          editMode={false}
          toggleSelect={handleToggleSelect}
          isSelected={false}
          onClick={handleRoundClick}
          isHomePage={true}
          onHover = {setHoveredRound}
        />
      ))
    );
  };

  const views = {
    dashboard: (
      <Dashboard
        roundHistory={homePageRounds}
        viewHistory={() => setCurrentView("viewHistory")}
        viewStatistics={() => setCurrentView("viewStatistics")}
        addRound={() => setCurrentView("addRound")}
        userProfile={profile}
        onCustomStatChange={() => setCustomStatModalOpen(true)}
      />
    ),


    addRound: (
      <AddRound
        onClose={() => setCurrentView("viewHistory")}
        onAddRound={handleAddRound}
        availableStats = {AVAILABLE_STATS}
        onCustomStatChange={() => setCustomStatModalOpen(true)}
      />
    ),

    viewHistory: (
      <div className="round-history-container">
        <div className="round-history-header">
          <h2>Round History</h2>
          <button
            className="close-icon"
            onClick={() => setCurrentView("dashboard")}
          >
            ✕
          </button>
        </div>

        <div className="round-history-content">
          <div className="round-history-list-wrapper">
            <div className="round-history-list">
              {rounds.length === 0 ? (
                <p className="no-rounds">No rounds recorded yet. Add your first round to get started!</p>
              ) : (
                rounds.toReversed().map((round, index) => (
                  <RoundHistory
                    key={index}
                    round={round}
                    index={index}
                    editMode={edit}
                    toggleSelect={handleToggleSelect}
                    isSelected={selectedRounds.includes(index)}
                    onClick={handleRoundClick}
                    isClicked={clickedRound && round ? clickedRound.id === round.id : false}
                    onRoundClick={setClickedRound}
                    onHover = {setHoveredRound}
                    registerRef={(el) => (roundRefs.current[round.id] = el)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="round-history-preview">
            <RoundGraph clickedRound={clickedRound} allRounds={rounds} availableStats={AVAILABLE_STATS} />
          </div>
        </div>

        <div className="round-history-footer">
          <button
            className="add-round-button"
            onClick={() => setCurrentView("addRound")}
          >
            + Add Round
          </button>
          
          {edit ? (
            <>
              {selectedRounds.length > 0 && (
                <button
                  className="header-btn danger"
                  onClick={handleDeleteRounds}
                >
                  Delete ({selectedRounds.length})
                </button>
              )}
              <button
                className="header-btn secondary"
                onClick={handleCancelEdit}
                style={{background: '#546e5a', color: 'white', border: 'none'}}
              >
                Done
              </button>
            </>
          ) : (
            <button
              className="header-btn secondary"
              onClick={() => setEdit(true)}
              style={{background: '#546e5a', color: 'white', border: 'none'}}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    ),

    viewStatistics: (
      <Statistics rounds={rounds} availableStats={AVAILABLE_STATS} />
    ),

    viewRound: (
      <ViewRound
        selectedRound={currentRound}
        onSave={closeViewRound}
        availableStats={AVAILABLE_STATS}
      />
    ),

    home: (
      <Home
        SignUp={SignUpButton}
        Login={LoginButton}
      />
    )
  };

  return (
    <div>
      {user && currentView !== "viewHistory" && currentView !== "addRound" && (
        <Hamburger
          dashboard={() => setCurrentView("dashboard")}
          addRound={() => setCurrentView("addRound")}
          viewHistory={() => setCurrentView("viewHistory")}
          viewStatistics={() => setCurrentView("viewStatistics")}
          userProfile={profile}
        />
      )}

      {clickedRound && currentView === "viewHistory" && (
        <StatsPreview round={clickedRound} roundElementRef={{ current: roundRefs.current[clickedRound.id] }}/>
      )}

      {hoveredRound && currentView === "viewHistory" && !clickedRound && (
        <StatsPreview round={hoveredRound} roundElementRef={{ current: roundRefs.current[hoveredRound.id] }}/>
      )}

      {customStatModalOpen && (
        <CustomStatsModal
          onClose={() => setCustomStatModalOpen(false)}
          onAddCustomStat={handleOnAddCustomStat}
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
        {currentView === "home" ? views.home : null}
        {currentView === "dashboard" ? views.dashboard : null}
        {currentView === "addRound" ? views.addRound : null}
        {currentView === "viewHistory" ? views.viewHistory : null}
        {currentView === "viewStatistics" ? views.viewStatistics : null}
        {currentView === "viewRound" ? views.viewRound : null}
      </div>
    </div>
  );
}

export default GolfApp;