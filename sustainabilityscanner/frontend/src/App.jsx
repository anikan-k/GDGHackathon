// src/App.jsx
import './App.css';
import fiji from './assets/fiji.png';
import { useState } from 'react';

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app">
      <header className="topbar">
        <div className="time">19:25</div>
        <div className="status">🔋41</div>
      </header>

      <div className="logo-row">
        <h1 className="logo">Eco<span className="green">AI</span></h1>
        <div className="streak-icon">🔥 0</div>
      </div>

      <div className="calendar-row">
        {['T', 'F', 'S', 'S', 'M', 'T', 'W'].map((d, i) => (
          <div key={i} className={`day ${i === 6 ? 'today' : ''}`}>
            <div>{d}</div>
            <div className="day-num">{17 + i}</div>
          </div>
        ))}
      </div>

      <div className="card streak">
        <div>
          <div className="streak-num">32</div>
          <div className="streak-label">Sustainability Streak</div>
        </div>
        <div className="streak-circle">🔥</div>
      </div>

      <div className="charts">
        <div className="card chart">
          <h4>Your Carbon Footprint</h4>
          <img src="https://i.imgur.com/5bL7dlT.png" alt="Chart" />
          <p><b>This Month</b> 1,589 kg CO2</p>
          <p><b>Last Month</b> 2,339 kg CO2</p>
        </div>
        <div className="card saved">
          <p><b>Dollars Saved $</b></p>
        </div>
      </div>

      <h3 className="section-title">Recently logged</h3>

      <div className="card logged">
        <img src={fiji} alt="Fiji Bottle" />
        <div className="log-info">
          <div className="log-top">
            <span className="log-name">Bottled Water</span>
            <span className="log-time">19:28</span>
          </div>
          <div className="log-score">
            <span>🧪</span>
            <span className="score">30 Sustainability Score</span>
          </div>
          <div className="log-meta">
            <span>⚡ 42</span>
            <span>🚛 30</span>
            <span>♻️ 20</span>
            <span className="reliability">Reliability: <span className="low">Low</span></span>
          </div>
        </div>
      </div>

      <footer className="navbar">
        <button className="nav-btn">🏠<br />Home</button>
        <button className="nav-btn">📈<br />Progress</button>
        <button className="nav-btn">⚙️<br />Database</button>
        <button className="plus" onClick={() => setShowModal(true)}>＋</button>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Action</h3>
            <p>This is where your form, camera, or add feature can go.</p>
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

