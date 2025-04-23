// src/App.jsx
import './App.css';
import fiji from './assets/fiji.png';
import { useState, useEffect } from 'react';

function CameraScreen({ image, loading, scanResult, onBack }) {
  const [animatedScores, setAnimatedScores] = useState({});

  // Define max score per category (align with your Gemini prompt)
  const categoryMaxes = {
    "Packaging Impact": 30,
    "Product Ingredients": 40,
    "Manufacturing Process": 20,
    "Supply Chain & Distribution": 10,
    "Material Impact": 35,
    "Manufacturing & Energy Use": 30,
    "Transport & Distribution": 20,
    "End-of-Life": 15
  };

  useEffect(() => {
    if (!loading && scanResult) {
      const targets = {};
      Object.entries(scanResult).forEach(([key, value]) => {
        if (typeof value === "object" && value.score !== undefined) {
          targets[key] = value.score;
        }
      });

      const start = performance.now();
      const animate = () => {
        const now = performance.now();
        const elapsed = now - start;
        const progress = Math.min(elapsed / 700, 1);

        const currentScores = {};
        Object.entries(targets).forEach(([key, target]) => {
          currentScores[key] = Math.round(target * progress);
        });

        setAnimatedScores(currentScores);
        if (progress < 1) requestAnimationFrame(animate);
      };

      animate();
    }
  }, [scanResult, loading]);

  const getSliderColour = (score, max) => {
    const percent = Math.min(score / max, 1); // Ensure not over 100%
    const hue = percent * 120; // 0 (red) → 120 (green)
    return `hsl(${hue}, 80%, 50%)`;
  };
  

  return (
    <div className="camera-screen" style={{ background: "white", color: "black", padding: "1rem" }}>
      {image && (
        <img
          src={image}
          alt="Captured"
          style={{ width: "100%", maxHeight: "250px", objectFit: "cover", marginBottom: "1rem" }}
        />
      )}

      {loading ? (
        <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>🔄 Scanning item...</p>
      ) : (
        scanResult && (
          <div>
            {Object.entries(scanResult).map(([key, value]) =>
              typeof value === "object" && value.score !== undefined ? (
                <div key={key} style={{ marginBottom: "1.2rem" }}>
                  <label style={{ fontWeight: "bold", fontSize: "1rem", display: "block", marginBottom: "0.2rem" }}>
                    {key}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={categoryMaxes[key] || 10}
                    value={Math.min(animatedScores[key] || 0, categoryMaxes[key] || 10)}
                    disabled
                    style={{
                      width: "100%",
                      appearance: "none",
                      height: "6px",
                      borderRadius: "5px",
                      background: getSliderColour(animatedScores[key] || 0, categoryMaxes[key] || 10),
                      transition: "background 0.2s linear"
                    }}
                  />
                </div>
              ) : null
            )}

            {scanResult["Total Score"] !== undefined && (
              <h3 style={{ marginTop: "2rem", textAlign: "center" }}>
                🌍 Total Score: {scanResult["Total Score"]} / 100
              </h3>
            )}
          </div>
        )
      )}

      <div className="camera-controls">
        <button onClick={onBack}>🔙 Back to Home</button>
      </div>
    </div>
  );
}



function CaptureView({ onCapture }) {
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById("camera");
        if (video) video.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    startCamera();
  }, []);

  const takePhoto = () => {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("capture");

    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL("image/jpeg");
      onCapture(imageBase64);
    }
  };

  return (
    <div className="camera-screen">
      <video id="camera" autoPlay playsInline style={{ width: '100%', height: '100%' }}></video>
      <canvas id="capture" style={{ display: "none" }}></canvas>
      <div className="camera-controls">
        <button onClick={takePhoto}>📸</button>
      </div>
    </div>
  );
}


function App() {
  const [mode, setMode] = useState("home"); // 'home' | 'capture' | 'result'
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleCapture = (imageBase64) => {
    setCapturedImage(imageBase64);
    setMode("result");
    setLoading(true);

    fetch("http://localhost:5000/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 })
    })
      .then(res => res.json())
      .then(data => {
        setScanResult(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
        alert("Failed to score image.");
      });
  };

  if (mode === "capture") {
    return <CaptureView onCapture={handleCapture} />;
  }

  if (mode === "result") {
    return <CameraScreen image={capturedImage} loading={loading} scanResult={scanResult} onBack={() => setMode("home")} />;
  }

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
        <button className="plus" onClick={() => setMode("capture")}>＋</button>
      </footer>
    </div>
  );
}

export default App;