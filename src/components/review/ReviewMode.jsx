import { useState } from 'react';
import { MISSIONS } from '../../constants/missions';
import { useDiagnosis } from '../../hooks/useDiagnosis';

const GATE_ORDER = ['AND', 'OR', 'NAND', 'NOR', 'XOR'];

const DIAG_COLORS = {
  warn: { bg: 'rgba(255,82,82,0.08)',   border: 'rgba(255,82,82,0.3)',   text: 'var(--error)' },
  info: { bg: 'rgba(255,171,64,0.08)',  border: 'rgba(255,171,64,0.3)',  text: 'var(--warn)' },
  good: { bg: 'rgba(0,230,118,0.08)',   border: 'rgba(0,230,118,0.3)',   text: 'var(--success)' },
};

const DIAG_ICONS = { warn: '⚠', info: 'ℹ', good: '✓' };

function accuracy(stat) {
  if (!stat || stat.attempts === 0) return null;
  return Math.round((stat.correct / stat.attempts) * 100);
}

function AccuracyBar({ gate, stat, isWeak, onGoTo }) {
  const pct = accuracy(stat);
  const cls = pct === null ? '' : pct < 50 ? 'weak' : pct < 75 ? 'mid' : '';

  return (
    <div className="accuracy-bar-wrap">
      <div className="accuracy-bar-header">
        <div>
          <strong>{gate} Gate</strong>
          {isWeak && (
            <button
              className="focus-badge"
              style={{ marginLeft: 8, cursor: 'pointer' }}
              onClick={() => onGoTo(gate)}
            >
              집중 복습 추천 →
            </button>
          )}
        </div>
        <span>
          {pct !== null ? `${pct}%` : '미도전'}
          {stat && stat.attempts > 0 && (
            <span style={{ marginLeft: 6, fontSize: '0.75rem' }}>({stat.correct}/{stat.attempts})</span>
          )}
        </span>
      </div>
      <div className="accuracy-bar-track">
        <div className={`accuracy-bar-fill ${cls}`} style={{ width: pct !== null ? `${pct}%` : '0%' }} />
      </div>
    </div>
  );
}

function DiagnosisPanel({ diagnoses, overallRate, totalAttempts }) {
  if (totalAttempts === 0) {
    return (
      <div className="card mb-20">
        <div className="section-label">맞춤형 학습 진단</div>
        <div className="empty-state" style={{ padding: '24px 16px' }}>
          <div className="icon">🧠</div>
          <p>미션을 풀면 개인 오답 패턴을 분석해 맞춤 피드백을 제공합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-20">
      <div className="flex between center mb-16">
        <div className="section-label" style={{ margin: 0 }}>맞춤형 학습 진단</div>
        {overallRate !== null && (
          <span style={{ fontSize: '0.82rem', color: 'var(--txt-muted)' }}>
            전체 정답률 <strong style={{ color: overallRate >= 70 ? 'var(--success)' : 'var(--warn)' }}>{overallRate}%</strong>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {diagnoses.map((d, i) => {
          const c = DIAG_COLORS[d.level];
          return (
            <div key={i} style={{
              padding: '12px 14px',
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: c.text, marginBottom: 4 }}>
                {DIAG_ICONS[d.level]} {d.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--txt-muted)', lineHeight: 1.7 }}>
                {d.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WrongNoteCard({ note, missions, onMemoChange, onMarkReviewed }) {
  const mission = missions.find(m => m.id === note.missionId);
  const dateStr = new Date(note.createdAt).toLocaleDateString('ko-KR', {
    month: '2-digit', day: '2-digit',
  });

  return (
    <div className={`note-card ${note.reviewed ? 'reviewed' : ''}`}>
      <div className="note-header">
        <div>
          <div className="note-title">
            {mission
              ? `M${String(mission.id).padStart(2, '0')} ${mission.title}`
              : `미션 ${note.missionId}`}
          </div>
          <div className="note-answer">
            내 답: <strong>{note.userAnswer.gate}</strong>
            &nbsp;→ 정답: <span>{note.correctAnswer.gate}</span>
          </div>
        </div>
        <span className="note-date">{dateStr}</span>
      </div>

      <textarea
        className="note-textarea"
        placeholder="메모를 남겨보세요 (예: NAND는 AND의 반대값이라는 걸 자꾸 잊는다)"
        value={note.memo}
        onChange={e => onMemoChange(note.id, e.target.value)}
      />

      {!note.reviewed && (
        <button
          className="btn btn-ghost mt-8"
          style={{ fontSize: '0.78rem' }}
          onClick={() => onMarkReviewed(note.id)}
        >
          ✓ 복습 완료
        </button>
      )}
    </div>
  );
}

export default function ReviewMode({ progress, stats, wrongNotes, updateMemo, markReviewed, resetAll, onGoToChallenge }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [filterUnreviewed, setFilterUnreviewed] = useState(false);

  const { weak, diagnoses, overallRate, totalAttempts } = useDiagnosis(stats, wrongNotes);

  const gateStats = stats?.gateAccuracy ?? {};
  const clearedCount = progress?.clearedMissions?.length ?? 0;
  const totalWrong = wrongNotes?.length ?? 0;
  const unreviewedCount = wrongNotes?.filter(n => !n.reviewed).length ?? 0;

  const visibleNotes = filterUnreviewed
    ? (wrongNotes ?? []).filter(n => !n.reviewed)
    : (wrongNotes ?? []);

  return (
    <div>
      <div className="flex between center wrap gap-8 mb-16">
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>학습 분석 다이어리</h2>
          <p className="text-muted mt-8">축적된 오답 데이터를 바탕으로 취약점을 진단합니다.</p>
        </div>
        <button
          className={`btn ${confirmReset ? 'btn-danger' : 'btn-ghost'}`}
          onClick={() => confirmReset ? (resetAll(), setConfirmReset(false)) : setConfirmReset(true)}
          style={{ fontSize: '0.78rem' }}
        >
          {confirmReset ? '⚠ 정말 초기화' : '학습 기록 초기화'}
        </button>
      </div>

      <div className="flex gap-12 wrap mb-20">
        {[
          { label: '완료 미션',  value: `${clearedCount} / 15` },
          { label: '총 오답 수', value: totalWrong },
          { label: '미복습 오답', value: unreviewedCount },
          { label: '누적 점수', value: `${(progress?.totalScore ?? 0).toLocaleString()}점` },
        ].map(({ label, value }) => (
          <div key={label} className="card" style={{ flex: '1 1 110px', textAlign: 'center' }}>
            <div className="text-muted mb-8" style={{ fontSize: '0.75rem' }}>{label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>{value}</div>
          </div>
        ))}
      </div>

      <DiagnosisPanel
        diagnoses={diagnoses}
        overallRate={overallRate}
        totalAttempts={totalAttempts}
      />

      <div className="flex gap-16 wrap">
        <div className="card" style={{ flex: '1 1 300px' }}>
          <div className="section-label">게이트별 성취도</div>
          {GATE_ORDER.map(g => (
            <AccuracyBar key={g} gate={g} stat={gateStats[g]} isWeak={weak.includes(g)} onGoTo={onGoToChallenge} />
          ))}
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <div className="flex between center mb-12">
            <div className="section-label" style={{ margin: 0 }}>최근 오답 노트</div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem' }}
              onClick={() => setFilterUnreviewed(f => !f)}
            >
              {filterUnreviewed ? '전체 보기' : '미복습만'}
            </button>
          </div>

          {visibleNotes.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📝</div>
              <p>
                {filterUnreviewed
                  ? '미복습 오답이 없습니다.'
                  : '아직 오답이 없습니다. 미션에 도전해보세요!'}
              </p>
            </div>
          ) : (
            visibleNotes.map(note => (
              <WrongNoteCard
                key={note.id}
                note={note}
                missions={MISSIONS}
                onMemoChange={updateMemo}
                onMarkReviewed={markReviewed}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
