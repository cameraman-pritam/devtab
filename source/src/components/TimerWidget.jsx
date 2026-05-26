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
      audioCtx.currentTime + delay + 0.05,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + delay + 1.5,
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

  // Sync helper: Saves the TARGET time, not just remaining time
  const syncState = (running, currentMode, rem, tot) => {
    const target =
      currentMode === "stopwatch"
        ? Date.now() - rem * 1000 // target is when it started
        : Date.now() + rem * 1000; // target is when it ends

    localStorage.setItem(
      "devtab-timer",
      JSON.stringify({
        isRunning: running,
        mode: currentMode,
        targetTime: target,
        savedRemaining: rem,
        totalTime: tot,
      }),
    );
  };

  // On Mount: Check if a timer was already running in the background
  useEffect(() => {
    const stored = localStorage.getItem("devtab-timer");
    if (stored) {
      const parsed = JSON.parse(stored);
      setMode(parsed.mode);
      setTotalTime(parsed.totalTime);

      if (parsed.isRunning) {
        if (parsed.mode === "stopwatch") {
          setTimeRemaining(Math.floor((Date.now() - parsed.targetTime) / 1000));
        } else {
          const left = Math.floor((parsed.targetTime - Date.now()) / 1000);
          setTimeRemaining(Math.max(0, left));
          if (left <= 0) syncState(false, parsed.mode, 0, parsed.totalTime);
        }
        setIsRunning(
          parsed.isRunning &&
            (parsed.mode === "stopwatch" || parsed.targetTime > Date.now()),
        );
      } else {
        setTimeRemaining(parsed.savedRemaining);
      }
    }
  }, []);

  // The Engine: Calculates true time based on the timestamp to prevent drift
  useEffect(() => {
    if (!isEditing) {
      const m = Math.floor(timeRemaining / 60)
        .toString()
        .padStart(2, "0");
      const s = (timeRemaining % 60).toString().padStart(2, "0");
      setInputValue(`${m}:${s}`);
    }

    if (isRunning) {
      timerRef.current = setInterval(() => {
        const stored = JSON.parse(localStorage.getItem("devtab-timer") || "{}");

        if (stored.isRunning) {
          let newRem = 0;
          if (stored.mode === "stopwatch") {
            newRem = Math.floor((Date.now() - stored.targetTime) / 1000);
          } else {
            newRem = Math.floor((stored.targetTime - Date.now()) / 1000);
            if (newRem <= 0) {
              newRem = 0;
              setIsRunning(false);
              playAlarm();
              syncState(false, stored.mode, 0, stored.totalTime);
            }
          }
          setTimeRemaining(newRem);

          // UPDATE TAB TITLE HERE
          const m = Math.floor(newRem / 60)
            .toString()
            .padStart(2, "0");
          const s = (newRem % 60).toString().padStart(2, "0");
          document.title = `DevTab [${m}:${s}]`;
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      document.title = "DevTab";
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeRemaining, isEditing]);

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setIsEditing(false);
    let newTotal = 0;

    if (newMode === "pomodoro") newTotal = 25 * 60;
    else if (newMode === "stopwatch") newTotal = 0;
    else newTotal = timeRemaining === 0 ? 15 * 60 : timeRemaining;

    setTotalTime(newTotal);
    setTimeRemaining(newTotal);
    syncState(false, newMode, newTotal, newTotal);
    document.title = "DevTab";
  };

  const handleBlur = () => {
    setIsEditing(false);
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
    syncState(
      false,
      mode,
      newTotal,
      mode !== "stopwatch" ? newTotal : totalTime,
    );
  };

  const toggleTimer = () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
    const newRunning = !isRunning;
    setIsRunning(newRunning);
    syncState(newRunning, mode, timeRemaining, totalTime);
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
