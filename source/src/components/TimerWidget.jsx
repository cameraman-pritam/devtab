import { useState, useEffect, useRef } from "react";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playAlarm() {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const createBeep = (freq, delay) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(
      0.5,
      audioCtx.currentTime + delay + 0.05
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + delay + 1.5
    );
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + 1.5);
  };
  createBeep(587.33, 0);
  createBeep(880.0, 0.2);
}

export default function TimerWidget() {
  const [mode, setMode] = useState("pomodoro");
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState("25:00");
  const [isEditing, setIsEditing] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!isEditing) {
      const m = Math.floor(timeRemaining / 60)
        .toString()
        .padStart(2, "0");
      const s = (timeRemaining % 60).toString().padStart(2, "0");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(`${m}:${s}`);
    }

    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (mode === "stopwatch") return prev + 1;
          if (prev > 0) return prev - 1;

          setIsRunning(false);
          clearInterval(timerRef.current);
          playAlarm();
          return 0;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeRemaining, mode, isEditing]);

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setIsEditing(false);
    if (newMode === "pomodoro") {
      setTotalTime(25 * 60);
      setTimeRemaining(25 * 60);
    } else if (newMode === "stopwatch") {
      setTotalTime(0);
      setTimeRemaining(0);
    } else {
      if (timeRemaining === 0) {
        setTotalTime(15 * 60);
        setTimeRemaining(15 * 60);
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    // eslint-disable-next-line no-useless-assignment
    let mins = 0,
      secs = 0;
    if (inputValue.includes(":")) {
      const parts = inputValue.split(":");
      mins = parseInt(parts[0]) || 0;
      secs = parseInt(parts[1]) || 0;
    } else {
      mins = parseInt(inputValue) || 0;
    }
    const newTotal = mins * 60 + secs;
    setTimeRemaining(newTotal);
    if (mode !== "stopwatch") setTotalTime(newTotal);
  };

  const toggleTimer = () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
    setIsRunning(!isRunning);
  };

  const progressWidth =
    mode === "stopwatch" || totalTime === 0
      ? "100%"
      : `${(timeRemaining / totalTime) * 100}%`;

  return (
    <div className="widget timer-widget">
      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === "pomodoro" ? "active" : ""}`}
          onClick={() => handleModeChange("pomodoro")}
        >
          Pomodoro
        </button>
        <button
          className={`mode-btn ${mode === "stopwatch" ? "active" : ""}`}
          onClick={() => handleModeChange("stopwatch")}
        >
          Stopwatch
        </button>
        <button
          className={`mode-btn ${mode === "timer" ? "active" : ""}`}
          onClick={() => handleModeChange("timer")}
        >
          Timer
        </button>
      </div>
      <div className="timer-display-container">
        <input
          type="text"
          className="mono-text display-time timer-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            setIsRunning(false);
            setIsEditing(true);
          }}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
          spellCheck="false"
        />
      </div>
      <div className="controls">
        <button
          className={`btn ${isRunning ? "btn-secondary" : "btn-primary"}`}
          onClick={toggleTimer}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleModeChange(mode)}
        >
          Reset
        </button>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: progressWidth }}></div>
      </div>
    </div>
  );
}
