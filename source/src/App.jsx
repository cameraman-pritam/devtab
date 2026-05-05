import React, { Suspense } from "react";
import QuickLinks from "./components/QuickLinks";
import SkeletonWidget from "./components/SkeletonWidget";

// Lazy loading all the heavy widgets
const ClockWidget = React.lazy(() => import("./components/ClockWidget"));
const TimerWidget = React.lazy(() => import("./components/TimerWidget"));
const NotesWidget = React.lazy(() => import("./components/NotesWidget"));
const QuoteWidget = React.lazy(() => import("./components/QuoteWidget"));

function App() {
  return (
    <main className="container">
      <QuickLinks />

      <div className="grid">
        <Suspense fallback={<SkeletonWidget />}>
          <ClockWidget />
        </Suspense>

        <Suspense fallback={<SkeletonWidget />}>
          <TimerWidget />
        </Suspense>

        <Suspense fallback={<SkeletonWidget />}>
          <NotesWidget />
        </Suspense>

        <Suspense fallback={<SkeletonWidget />}>
          <QuoteWidget />
        </Suspense>
      </div>
    </main>
  );
}

export default App;
