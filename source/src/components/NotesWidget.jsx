/* eslint-disable no-undef */
import { useState, useEffect, useRef } from "react";

export default function NotesWidget() {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Saved");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (window.chrome && chrome.storage) {
      chrome.storage.local.get(["devtab-notes"], (res) => {
        if (res["devtab-notes"]) setNotes(res["devtab-notes"]);
      });
    } else {
      const saved = localStorage.getItem("devtab-notes");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setNotes(saved);
    }
  }, []);

  const handleChange = (e) => {
    const newText = e.target.value;
    setNotes(newText);
    setStatus("Saving...");
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (window.chrome && chrome.storage) {
        chrome.storage.local.set({ "devtab-notes": newText });
      } else {
        localStorage.setItem("devtab-notes", newText);
      }
      setStatus("Saved");
    }, 500);
  };

  const clearNotes = () => {
    setNotes("");
    if (window.chrome && chrome.storage) {
      chrome.storage.local.remove("devtab-notes");
    } else {
      localStorage.removeItem("devtab-notes");
    }
    setStatus("Cleared");
  };

  return (
    <div className="widget notes-widget">
      <div className="widget-header">
        <span>Brain Dump</span>
        <button className="btn-clear" onClick={clearNotes}>
          Clear
        </button>
      </div>
      <textarea
        className="notes-area mono-text"
        placeholder="Clear your head..."
        value={notes}
        onChange={handleChange}
      ></textarea>
      <div className="status-text">{status}</div>
    </div>
  );
}
