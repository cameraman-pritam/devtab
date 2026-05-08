import { useState, useEffect } from "react";

export default function ClockWidget() {
  const [time, setTime] = useState({
    clock: "00:00",
    date: "Loading...",
    greeting: "Welcome",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, "0");

      let greeting = "Good evening";
      if (hours >= 5 && hours < 12) greeting = "Good morning";
      else if (hours >= 12 && hours < 17) greeting = "Good afternoon";

      setTime({
        clock: `${hours.toString().padStart(2, "0")}:${mins}`,
        date: now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        greeting,
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="widget clock-widget">
      <h1 className="mono-text display-time">{time.clock}</h1>
      <p className="date-text">{time.date}</p>
      <p className="greeting-text">{time.greeting}</p>
    </div>
  );
}
