import { useState, useEffect, useRef } from "react";

export default function NotesWidget() {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Saved");
  const timeoutRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("devtab-notes");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setNotes(saved);
  }, []);

  const handleChange = (e) => {
    setNotes(e.target.value);
    setStatus("Saving...");
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem("devtab-notes", e.target.value);
      setStatus("Saved");
    }, 500);
  };

  const clearNotes = () => {
    setNotes("");
    localStorage.removeItem("devtab-notes");
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
      {/* The class notes-area has overflow-y: auto */}
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
