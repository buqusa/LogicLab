import { useState } from 'react';
import Header from './components/layout/Header';
import SandboxMode from './components/sandbox/SandboxMode';
import ChallengeMode from './components/challenge/ChallengeMode';
import ReviewMode from './components/review/ReviewMode';
import { useProgress } from './hooks/useProgress';

export default function App() {
  const [mode, setMode] = useState('sandbox');
  const [focusGate, setFocusGate] = useState(null);
  const progressData = useProgress();

  function goToChallenge(gate) {
    setFocusGate(gate);
    setMode('challenge');
  }

  return (
    <div className="app">
      <Header mode={mode} onModeChange={setMode} />
      <main className="main-content">
        {mode === 'sandbox'   && <SandboxMode />}
        {mode === 'challenge' && <ChallengeMode {...progressData} focusGate={focusGate} />}
        {mode === 'review'    && <ReviewMode {...progressData} onGoToChallenge={goToChallenge} />}
      </main>
    </div>
  );
}
