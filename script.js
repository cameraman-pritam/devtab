document.addEventListener("DOMContentLoaded", () => {
  // --- Search Engine Integration ---
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      // Uses your browser's official default search engine
      if (chrome.search && chrome.search.query) {
        chrome.search.query({ text: query, disposition: "CURRENT_TAB" });
      } else {
        // Fallback (just in case the browser blocks the API)
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          query
        )}`;
      }
    }
  });

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playAlarm() {
    if (audioCtx.state === "suspended") audioCtx.resume();
    createBeep(587.33, 0);
    createBeep(880.0, 0.2);
  }

  function createBeep(freq, delay) {
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
  }

  const timeEl = document.getElementById("clock-time");
  const dateEl = document.getElementById("clock-date");
  const greetingEl = document.getElementById("greeting-text");

  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, "0");
    timeEl.textContent = `${hours.toString().padStart(2, "0")}:${mins}`;
    dateEl.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    let greeting = "Good evening";
    if (hours >= 5 && hours < 12) greeting = "Good morning";
    else if (hours >= 12 && hours < 17) greeting = "Good afternoon";
    greetingEl.textContent = greeting;
  }

  setInterval(updateClock, 1000);
  updateClock();

  const notesArea = document.getElementById("notes-area");
  const notesStatus = document.getElementById("notes-status");
  const clearNotes = document.getElementById("clear-notes");
  let saveTimeout;

  chrome.storage.local.get(["brainDump"], (res) => {
    if (res.brainDump) notesArea.value = res.brainDump;
  });

  notesArea.addEventListener("input", (e) => {
    notesStatus.textContent = "Saving...";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      chrome.storage.local.set({ brainDump: e.target.value }, () => {
        notesStatus.textContent = "Saved";
      });
    }, 500);
  });

  clearNotes.addEventListener("click", () => {
    notesArea.value = "";
    chrome.storage.local.set({ brainDump: "" });
    notesStatus.textContent = "Cleared";
  });

  let timerInterval;
  let timeRemaining = 25 * 60;
  let totalTime = 25 * 60;
  let isRunning = false;
  let mode = "pomodoro";

  const timerInput = document.getElementById("timer-input");
  const btnStart = document.getElementById("btn-start");
  const btnReset = document.getElementById("btn-reset");
  const progressBar = document.getElementById("timer-progress");
  const modeBtns = {
    pomodoro: document.getElementById("mode-pomodoro"),
    stopwatch: document.getElementById("mode-stopwatch"),
    timer: document.getElementById("mode-timer"),
  };

  function updateTimerUI() {
    if (document.activeElement === timerInput) return;
    const m = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const s = (timeRemaining % 60).toString().padStart(2, "0");
    timerInput.value = `${m}:${s}`;

    if (mode === "stopwatch" || totalTime === 0) {
      progressBar.style.width = "100%";
    } else {
      const percentage = (timeRemaining / totalTime) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

  timerInput.addEventListener("focus", () => {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      btnStart.textContent = "Resume";
      btnStart.className = "btn btn-primary";
    }
    timerInput.select();
  });

  timerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") timerInput.blur();
  });

  timerInput.addEventListener("blur", () => {
    const val = timerInput.value.trim();
    let mins = 0,
      secs = 0;
    if (val.includes(":")) {
      const parts = val.split(":");
      mins = parseInt(parts[0]) || 0;
      secs = parseInt(parts[1]) || 0;
    } else {
      mins = parseInt(val) || 0;
    }
    const newTotalSeconds = mins * 60 + secs;
    timeRemaining = newTotalSeconds;
    if (mode !== "stopwatch") totalTime = newTotalSeconds;
    updateTimerUI();
  });

  function setMode(newMode) {
    mode = newMode;
    clearInterval(timerInterval);
    isRunning = false;
    btnStart.textContent = "Start";
    btnStart.className = "btn btn-primary";

    Object.values(modeBtns).forEach((btn) => btn.classList.remove("active"));
    modeBtns[newMode].classList.add("active");

    if (mode === "pomodoro") {
      totalTime = 25 * 60;
      timeRemaining = totalTime;
    } else if (mode === "stopwatch") {
      totalTime = 0;
      timeRemaining = 0;
    } else if (mode === "timer") {
      if (timeRemaining === 0) {
        totalTime = 15 * 60;
        timeRemaining = totalTime;
      }
    }
    updateTimerUI();
  }

  Object.keys(modeBtns).forEach((key) => {
    modeBtns[key].addEventListener("click", () => setMode(key));
  });

  btnStart.addEventListener("click", () => {
    timerInput.blur();
    if (audioCtx.state === "suspended") audioCtx.resume();

    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      btnStart.textContent = "Resume";
      btnStart.className = "btn btn-primary";
      return;
    }

    isRunning = true;
    btnStart.textContent = "Pause";
    btnStart.className = "btn btn-secondary";

    timerInterval = setInterval(() => {
      if (mode === "stopwatch") {
        timeRemaining++;
      } else {
        if (timeRemaining > 0) {
          timeRemaining--;
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          btnStart.textContent = "Start";
          btnStart.className = "btn btn-primary";
          playAlarm();
        }
      }
      updateTimerUI();
    }, 1000);
  });

  btnReset.addEventListener("click", () => setMode(mode));
  updateTimerUI();

  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const newQuoteBtn = document.getElementById("new-quote-btn");

  async function fetchQuote() {
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;

    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      const data = await res.json();

      setTimeout(() => {
        quoteText.textContent = `"${data.quote}"`;
        quoteAuthor.textContent = `- ${data.author}`;
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
      }, 300);
    } catch (err) {
      setTimeout(() => {
        quoteText.textContent = `"Keep pushing forward."`;
        quoteAuthor.textContent = `- DevTab`;
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
      }, 300);
    }
  }

  newQuoteBtn.addEventListener("click", fetchQuote);
  fetchQuote();
});
