import { useState, useEffect } from "react";
import { getRandomQuote } from "everyday-fun";

export default function QuoteWidget() {
  const [quote, setQuote] = useState({ quote: "Loading...", author: "" });

  const fetchQuote = () => {
    // everyday-fun is synchronous and fast, but we can fake a micro-delay for UX if we want
    try {
      const data = getRandomQuote();
      setQuote({ quote: data.quote, author: data.author });
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setQuote({ quote: "Keep pushing forward.", author: "DevTab" });
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuote();
  }, []);

  return (
    <div className="widget quote-widget">
      <div className="widget-header">
        <span>DevTab Quotes</span>
        <button className="btn-clear" onClick={fetchQuote}>
          Next
        </button>
      </div>
      {/* The class quote-container has overflow-y: auto */}
      <div className="quote-container">
        <blockquote className="quote-text">"{quote.quote}"</blockquote>
        <cite className="quote-author">- {quote.author}</cite>
      </div>
    </div>
  );
}
