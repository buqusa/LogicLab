import { useStorage } from './useStorage';

const GATE_KEYS = ['AND', 'OR', 'NAND', 'NOR', 'XOR'];

const initProgress = {
  clearedMissions: [],
  currentMission: 1,
  totalScore: 0,
  lastAccessAt: null,
};

const initStats = {
  gateAccuracy: Object.fromEntries(
    GATE_KEYS.map(g => [g, { attempts: 0, correct: 0 }])
  ),
};

export function useProgress() {
  const [progress, setProgress] = useStorage('logiclab_progress', initProgress);
  const [stats, setStats]       = useStorage('logiclab_stats', initStats);
  const [wrongNotes, setWrongNotes] = useStorage('logiclab_wrongNotes', []);

  function clearMission(id, score) {
    setProgress(prev => ({
      ...prev,
      clearedMissions: prev.clearedMissions.includes(id)
        ? prev.clearedMissions
        : [...prev.clearedMissions, id],
      currentMission: Math.max(prev.currentMission, id + 1),
      totalScore: prev.totalScore + (prev.clearedMissions.includes(id) ? 0 : score),
      lastAccessAt: new Date().toISOString(),
    }));
  }

  function recordAttempt(gate, isCorrect) {
    setStats(prev => {
      const acc = { ...prev.gateAccuracy };
      if (!acc[gate]) return prev;
      acc[gate] = {
        attempts: acc[gate].attempts + 1,
        correct:  acc[gate].correct + (isCorrect ? 1 : 0),
      };
      return { gateAccuracy: acc };
    });
  }

  function addWrongNote(missionId, userGate, correctGate) {
    const note = {
      id: `wn_${Date.now()}`,
      missionId,
      userAnswer:    { gate: userGate },
      correctAnswer: { gate: correctGate },
      memo: '',
      createdAt: new Date().toISOString(),
      reviewed: false,
    };
    setWrongNotes(prev => [note, ...prev]);
  }

  function updateMemo(noteId, memo) {
    setWrongNotes(prev =>
      prev.map(n => (n.id === noteId ? { ...n, memo } : n))
    );
  }

  function markReviewed(noteId) {
    setWrongNotes(prev =>
      prev.map(n => (n.id === noteId ? { ...n, reviewed: true } : n))
    );
  }

  function resetAll() {
    setProgress(initProgress);
    setStats(initStats);
    setWrongNotes([]);
  }

  return {
    progress, stats, wrongNotes,
    clearMission, recordAttempt,
    addWrongNote, updateMemo, markReviewed,
    resetAll,
  };
}
