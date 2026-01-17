import { useState} from 'react';

function Hamburger({home,addRound,viewHistory,viewStatistics}) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className = "top-bar">
            <div className = {`hamburger-menu ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {menuOpen && (
                <div className={`side-menu ${menuOpen ? "open" : ""}`}>
                    <button onClick={home}>Home</button>
                    <button onClick={addRound}>Add Round</button>
                    <button onClick={viewHistory}>View History</button>
                    <button onClick={viewStatistics}>View Statistics</button>
                </div>
            )}
        </div>
    );
}

export default Hamburger;