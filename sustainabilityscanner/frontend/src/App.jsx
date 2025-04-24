// src/App.jsx
import './App.css';
import fiji from './assets/fiji.png';
import graphz from './assets/graph.png.PNG';
import treeloading from './assets/treeloading1.gif';


import { useState, useEffect } from 'react';

function CameraScreen({ image, loading, scanResult, onBack, setMode }) {
  const [animatedScores, setAnimatedScores] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showReason, setShowReason] = useState(false);

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
    const percent = Math.min(score / max, 1);
    const hue = percent * 120;
    return `hsl(${hue}, 80%, 50%)`;
  };

  return (
    <div className="camera-screen" style={{ background: "white", color: "black", padding: "1rem" }}>
      {image && (
        <img
          src={image}
          alt="Captured"
          style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "12px", marginBottom: "1rem" }}
        />
      )}

{loading ? (
  <div style={{ textAlign: "center", marginTop: "2rem" }}>
    <img src={treeloading} alt="Loading..." style={{ width: "140px", height: "140px" }} />
  </div>
) : (

        scanResult && (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", textAlign: "center" }}>{scanResult["Name"]}</h2>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{scanResult["Total Score"]}</span>
              <div style={{ background: "#eee", borderRadius: "999px", overflow: "hidden", height: "10px", marginTop: "0.5rem" }}>
                <div style={{
                  height: "100%",
                  width: `${scanResult["Total Score"]}%`,
                  background: "#ffa500"
                }}></div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {Object.entries(scanResult).map(([key, value]) =>
                typeof value === "object" && value.score !== undefined ? (
                  <div
                      key={key}
                      onClick={() => {
                        setHoveredCategory({ label: key, reason: value.reason });
                        setShowReason(true);
                      }}
                      
                      style={{
                        background: "#f9f9f9",
                        borderRadius: "16px",
                        padding: "1rem",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                        cursor: "pointer"
                      }}
                    >
                    <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>{key}</div>
                    <div style={{ background: "#e0e0e0", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(animatedScores[key] || 0) / categoryMaxes[key] * 100}%`,
                        background: getSliderColour(animatedScores[key] || 0, categoryMaxes[key])
                      }}></div>
                    </div>
                  </div>
                ) : null
              )}
            </div>

                        {/* Move outside main render return */}
                        {showReason && hoveredCategory && (
  <div className="modal-overlay">
    <div className="modal">
      <h3 style={{ marginBottom: "0.5rem" }}>{hoveredCategory.label}</h3>
      <p style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#333" }}>
        {hoveredCategory.reason}
      </p>
      <button
        onClick={() => {
          setShowReason(false);
          setHoveredCategory(null);
        }}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          background: "#f0f0f0",
          border: "none",
          cursor: "pointer"
        }}
      >
        Close
      </button>
    </div>
  </div>
)}




          </div>
        )
      )}

<div className="camera-controls" style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
  <button style={{ padding: "0.6rem 1rem", borderRadius: "12px", fontSize: "1rem" }} onClick={onBack}>🔙</button>
  <button style={{ padding: "0.6rem 1rem", borderRadius: "12px", fontSize: "1rem" }} onClick={() => {
    setAnimatedScores({});
    setHoveredCategory(null);
    setShowReason(false);
    setTimeout(() => setMode("capture"), 0);
  }}>📷</button>
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

function DatabaseView({ onBack, query, onQueryChange, onSubmit, result, dbLoading }) {
  return (
    <div
  style={{
    position: "relative",
    height: "100%",
    background: "white",
    padding: "1rem",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflowY: "auto",         // ✅ enable vertical scrolling
    maxHeight: "calc(100vh - 2rem)" // ✅ avoids spilling out of frame
  }}
>

      <div>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          Search Product Sustainability
        </h2>

        <div style={{ position: "relative" }}>
          <textarea
            placeholder="Enter a product name..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            style={{
              width: "100%",
              height: "120px",
              padding: "1rem",
              fontSize: "1rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              resize: "none",
              fontFamily: "inherit",
              boxSizing: "border-box"
            }}
          />
          <button
            onClick={onSubmit}
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              fontSize: "1.2rem",
              border: "none",
              background: "none",
              cursor: "pointer"
            }}
            aria-label="Submit"
          >
            ⏎
          </button>
        </div>

        {dbLoading && (
  <div style={{ textAlign: "center", marginTop: "2rem" }}>
    <img src={treeloading} alt="Loading..." style={{ width: "120px", height: "120px" }} />
  </div>
)}



        {result && (
  <div style={{ marginTop: "1.5rem" }}>
    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", textAlign: "center" }}>{result["Name"]}</h2>

    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{result["Total Score"]}</span>
      <div style={{ background: "#eee", borderRadius: "999px", overflow: "hidden", height: "10px", marginTop: "0.5rem" }}>
        <div style={{
          height: "100%",
          width: `${result["Total Score"]}%`,
          background: "#ffa500"
        }}></div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
      {Object.entries(result).map(([key, value]) =>
        typeof value === "object" && value.score !== undefined ? (
          <div
            key={key}
            style={{
              background: "#f9f9f9",
              borderRadius: "16px",
              padding: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>{key}</div>
            <div style={{ background: "#e0e0e0", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${value.score}%`,
                background: `hsl(${Math.min(value.score / (
                  key === "Packaging Impact" ? 30 :
                  key === "Product Ingredients" ? 40 :
                  key === "Manufacturing Process" ? 20 :
                  key === "Supply Chain & Distribution" ? 10 :
                  key === "Material Impact" ? 35 :
                  key === "Manufacturing & Energy Use" ? 30 :
                  key === "Transport & Distribution" ? 20 :
                  key === "End-of-Life" ? 15 : 100
                ), 1) * 120}, 80%, 50%)`
              }}></div>
            </div>
            <div style={{ fontSize: "0.75rem", marginTop: "0.4rem", color: "#555" }}>{value.reason}</div>
          </div>
        ) : null
      )}
    </div>
  </div>
)}

      </div>

      <div style={{ textAlign: "center", paddingTop: "1rem" }}>
        <button
          onClick={onBack}
          style={{
            padding: "0.7rem 1.4rem",
            borderRadius: "999px",
            background: "#f0f0f0",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          🔙 Back
        </button>
      </div>
    </div>
  );
}






function App() {
  const [mode, setMode] = useState("home"); // 'home' | 'capture' | 'result'
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null);
  const [dbLoading, setDbLoading] = useState(false);



  
  // Fix this: DATABASE SEARCH — should go to /product-info
const handleQuerySubmit = async () => {
  if (!userInput.trim()) return;
  setDbLoading(true);
  setResult(null);
  try {
    const res = await fetch("/product-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: userInput })  // ✅ correct payload
    });
    const data = await res.json();
    setResult(data);
  } catch (err) {
    console.error("DB fetch error:", err);
  } finally {
    setDbLoading(false);
  }
};

  
  
  
  
  
  
const handleCapture = (imageBase64) => {
  setCapturedImage(imageBase64);
  setMode("result");
  setLoading(true);

  fetch("/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64 })  // ✅ correct key
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
    return (
      <CameraScreen
        image={capturedImage}
        loading={loading}
        scanResult={scanResult}
        onBack={() => setMode("home")}
        setMode={setMode} 
      />
    );
  }

  if (mode === "database") {
    return (
      <DatabaseView
        onBack={() => setMode("home")}
        query={userInput}
        onQueryChange={setUserInput}
        onSubmit={handleQuerySubmit}
        result={result}
        dbLoading={dbLoading} // ✅ pass the missing prop
      />
    );
  }
  
  
  
  
  

  return (
    <div className="app">
      <header className="topbar">
  <div>
    <div className="time">19:25</div>
    <div className="logo"><b>Eco</b><span className="green">AI</span></div>
  </div>
  <div className="status-icons">
    <span className="flame">🔥 0</span>
    <span className="battery">🔋41</span>
  </div>
</header>





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
          <div className="streak-label">Sustainability Streak April</div>
        </div>
        <div className="streak-circle-visual">
  <span role="img" aria-label="fire">🔥</span>
</div>

      </div>

        


      <div className="charts">
  <div className="card chart">
    <div className="chart-header">
      <h4>Your Carbon Footprint</h4>
    </div>
    <img src={graphz} alt="Carbon Graph" className="carbon-graph" />
  </div>

  <div className="card goal-card">
    <div className="goal-percentage">70%</div>
    <div className="goal-label">
      Weekly CO₂<br />goal reached
    </div>
    <div className="goal-circle">
      <span role="img" aria-label="tree">🌳</span>
    </div>
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
        <button className="nav-btn" onClick={() => setMode("database")}>⚙️<br />Database</button>
        <button className="plus" onClick={() => setMode("capture")}>📷</button>
        </footer>
    </div>
  );
}

export default App;