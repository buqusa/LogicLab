import { useState } from 'react';
import { MISSIONS, DIFFICULTY_LABEL, CATEGORY_ICONS } from '../../constants/missions';
import MissionView from './MissionView';

const GATE_FILTERS = ['전체', 'AND', 'OR', 'NAND', 'NOR', 'XOR'];

export default function ChallengeMode({ progress, wrongNotes, recordAttempt, clearMission, addWrongNote, focusGate }) {
  const [activeMissionId, setActiveMissionId] = useState(null);
  const [gateFilter, setGateFilter] = useState(focusGate ?? '전체');

  const cleared = new Set(progress.clearedMissions);
  const clearedCount = cleared.size;
  const progressPct = Math.round((clearedCount / 15) * 100);

  const filteredMissions = gateFilter === '전체'
    ? MISSIONS
    : MISSIONS.filter(m => m.answer === gateFilter);

  if (activeMissionId !== null) {
    const mission = MISSIONS.find(m => m.id === activeMissionId);
    return (
      <MissionView
        mission={mission}
        isCleared={cleared.has(mission.id)}
        totalCount={MISSIONS.length}
        wrongNotes={wrongNotes}
        onBack={() => setActiveMissionId(null)}
        onNavigate={id => setActiveMissionId(id)}
        onClear={(id, score) => clearMission(id, score)}
        onRecord={(gate, ok) => recordAttempt(gate, ok)}
        onWrong={(id, userGate, correctGate) => addWrongNote(id, userGate, correctGate)}
      />
    );
  }

  return (
    <div>
      <div className="flex between center wrap gap-8 mb-16">
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>미션 챌린지</h2>
          <p className="text-muted mt-8">
            완료 {clearedCount} / 15 &nbsp;·&nbsp; 총 점수 {progress.totalScore.toLocaleString()}점
          </p>
        </div>
      </div>

      <div className="progress-bar-wrap mb-16">
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${clearedCount === 15 ? 'complete' : ''}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="progress-bar-label">
          {clearedCount === 15 ? '전체 완료!' : `${progressPct}%`}
        </span>
      </div>

      {clearedCount === 15 && (
        <div className="all-clear-banner mb-16">
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)' }}>모든 미션 완료!</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--txt-muted)', marginTop: 6 }}>
            총 {progress.totalScore.toLocaleString()}점 달성 · Review 모드에서 학습 진단을 확인해보세요.
          </div>
        </div>
      )}

      <div className="flex gap-8 wrap mb-16">
        {GATE_FILTERS.map(f => (
          <button
            key={f}
            className={`btn ${gateFilter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.78rem', padding: '5px 14px' }}
            onClick={() => setGateFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mission-grid">
        {filteredMissions.map(m => {
          const done = cleared.has(m.id);
          return (
            <button
              key={m.id}
              className={`mission-card ${done ? 'cleared' : ''}`}
              onClick={() => setActiveMissionId(m.id)}
              style={{ textAlign: 'left' }}
            >
              <div className="mission-card-top">
                <span className="mission-num">M{String(m.id).padStart(2, '0')}</span>
                <div className="flex gap-8 center">
                  <span className={`badge badge-${m.difficulty}`}>
                    {DIFFICULTY_LABEL[m.difficulty]}
                  </span>
                  {done && <span className="badge badge-done">✓ 완료</span>}
                </div>
              </div>
              <div className="mission-title">{m.title}</div>
              <div className="mission-cat">
                {CATEGORY_ICONS[m.category]} {m.category}
              </div>
            </button>
          );
        })}
        {filteredMissions.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="icon">🔍</div>
            <p>{gateFilter} 게이트 미션이 아직 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
