function HomePage({ roundHistory, viewHistory, userProfile }) {
  return (
    <div className="homepage-container">
      <h1>
        Welcome to Golf Tracker! This is where you can track your stats and make
        improvements! Click on the side menu to add rounds, view your round
        history, and see your statistics!
      </h1>

      <div className="profile-card">
        <div className="profile-avatar">
          {userProfile && userProfile.avatarUrl ? (
            <img src={userProfile.avatarUrl} alt={`${userProfile.name} avatar`} />
          ) : null}
        </div>

        <div className="profile-info">
          <div className="profile-name">{userProfile?.name || 'Your Name'}</div>
          <div className="profile-role">All-Time Average Score: {userProfile?.averageScore ?? '—'}</div>
          <div className="profile-role">Best Score: {userProfile?.minScore ?? '—'}</div>

          <div className="profile-stats">
            <div className="profile-stat">Rounds: {userProfile?.roundsPlayed ?? '—'}</div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-btn" onClick={() => {}}>Edit</button>
          <button className="profile-btn" onClick={viewHistory}>History</button>
        </div>
      </div>

      <div className="homepage-rounds-preview">
        <h3>Your recent rounds</h3>

        <button className="expand-rounds-link" onClick={viewHistory}>
          Expand History
        </button>

        <div className="rounds-list">{roundHistory()}</div>
      </div>
    </div>
  );
}

export default HomePage;