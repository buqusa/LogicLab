import { useState, useEffect } from 'react';
import { GATES, applyGate } from '../../utils/gateLogic';
import { DIFFICULTY_LABEL, MISSIONS } from '../../constants/missions';

const MAX_TRIES = 3;

function buildValidationRows(mission, selectedGate) {
  const n = mission.inputs.length;
  return Array.from({ length: 2 ** n }, (_, i) => {
    const ins = Array.from({ length: n }, (_, k) => (i >> (n - 1 - k)) & 1);
    const expected = applyGate(mission.answer, ins);
    const actual   = applyGate(selectedGate, ins);
    return { ins, expected, actual, ok: expected === actual };
  });
}

export default function MissionView({
  mission, isCleared, totalCount,
  wrongNotes,
  onBack, onNavigate,
  onClear, onRecord, onWrong,
}) {
  const [selectedGate, setSelectedGate]     = useState('AND');
  const [localInputVals, setLocalInputVals] = useState(mission.inputs.map(i => i.value));
  const [tries, setTries]                   = useState(0);
  const [showHint, setShowHint]             = useState(false);
  const [result, setResult]                 = useState(null);
  const [cleared, setCleared]               = useState(isCleared);
  const [earnedBonus, setEarnedBonus]       = useState(0);

  const isValidateMission = typeof mission.validate === 'function';
  const currentOut = applyGate(selectedGate, localInputVals);
  const isMatch    = currentOut === mission.targetOutput;

  const validationRows = isValidateMission
    ? buildValidationRows(mission, selectedGate)
    : null;
  const allRowsPass = validationRows ? validationRows.every(r => r.ok) : null;

  const currentRowIdx = isValidateMission
    ? localInputVals.reduce((acc, v) => acc * 2 + v, 0)
    : null;

  const prevMemo = (wrongNotes ?? [])
    .filter(n => n.missionId === mission.id && n.memo?.trim())
    .at(-1)?.memo ?? null;

  useEffect(() => {
    setResult(null);
  }, [selectedGate]);

  useEffect(() => {
    setSelectedGate('AND');
    setLocalInputVals(mission.inputs.map(i => i.value));
    setTries(0);
    setResult(null);
    setShowHint(false);
    setCleared(isCleared);
    setEarnedBonus(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.id]);

  function toggleInput(idx) {
    if (cleared) return;
    setLocalInputVals(v => v.map((x, i) => i === idx ? 1 - x : x));
  }

  function submit() {
    if (cleared || tries >= MAX_TRIES) return;
    const correct = isValidateMission
      ? mission.validate(selectedGate)
      : selectedGate === mission.answer;
    onRecord(selectedGate, correct);
    if (correct) {
      const bonus = (tries === 0 ? 50 : 0) + (!showHint ? 30 : 0);
      setEarnedBonus(bonus);
      setResult('correct');
      setCleared(true);
      onClear(mission.id, mission.score + bonus);
    } else {
      const next = tries + 1;
      setTries(next);
      setResult('wrong');
      onWrong(mission.id, selectedGate, mission.answer);
      if (next >= MAX_TRIES) setShowHint(true);
    }
  }

  function retry() {
    setSelectedGate('AND');
    setLocalInputVals(mission.inputs.map(i => i.value));
    setTries(0);
    setResult(null);
    setShowHint(false);
    setCleared(false);
    setEarnedBonus(0);
  }

  const missionIdx  = MISSIONS.findIndex(m => m.id === mission.id);
  const prevMission = MISSIONS[missionIdx - 1];
  const nextMission = MISSIONS[missionIdx + 1];

  return (
    <div>
      <div className="flex between center mb-16 wrap gap-8">
        <button className="btn btn-ghost" onClick={onBack}>← 목록으로</button>
        <span className="text-muted">MISSION {mission.id} / {totalCount}</span>
        <div className="flex gap-8">
          {prevMission && (
            <button className="btn btn-ghost" onClick={() => onNavigate(prevMission.id)}>← 이전</button>
          )}
          {nextMission && (
            <button className="btn btn-ghost" onClick={() => onNavigate(nextMission.id)}>다음 →</button>
          )}
        </div>
      </div>

      {prevMemo && (
        <div style={{
          marginBottom: 16,
          padding: '10px 14px',
          background: 'rgba(124,77,255,0.07)',
          border: '1px solid rgba(124,77,255,0.25)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: 'var(--txt-muted)',
          lineHeight: 1.6,
        }}>
          <span style={{ color: 'var(--purple)', fontWeight: 600 }}>📝 이전 메모: </span>
          {prevMemo}
        </div>
      )}

      <div className="card mb-16">
        <div className="flex between center wrap gap-8 mb-8">
          <div className="flex gap-8 center">
            <span className={`badge badge-${mission.difficulty}`}>{DIFFICULTY_LABEL[mission.difficulty]}</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{mission.category}</span>
            {cleared && <span className="badge badge-done">✓ 완료</span>}
            {isValidateMission && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 99,
                background: 'rgba(124,77,255,0.12)', border: '1px solid rgba(124,77,255,0.35)',
                fontSize: '0.7rem', fontWeight: 600, color: 'var(--purple)',
              }}>
                ⚡ 전체 진리표 검증
              </span>
            )}
          </div>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>+{mission.score}점</span>
        </div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>{mission.title}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--txt-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {mission.description}
        </p>
      </div>

      <div className="flex gap-16 wrap">
        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card">
            <div className="flex between center mb-12">
              <div className="section-label" style={{ margin: 0 }}>입력 센서 (INPUTS)</div>
              {!cleared && (
                <span style={{ fontSize: '0.7rem', color: 'var(--txt-muted)' }}>
                  토글해서 동작 확인 가능
                </span>
              )}
            </div>
            <div className="flex gap-16 wrap center">
              {mission.inputs.map((inp, idx) => (
                <div className="switch-wrap" key={idx}>
                  <span style={{ fontSize: '1.4rem' }}>{inp.icon}</span>
                  <span className="switch-label">{inp.label}</span>
                  <button
                    className={`switch ${localInputVals[idx] ? 'on' : ''}`}
                    onClick={() => toggleInput(idx)}
                    style={cleared ? { cursor: 'default' } : {}}
                    aria-label={`${inp.label} 토글`}
                  />
                  <span className={`switch-val ${localInputVals[idx] ? 'on' : ''}`}>● {localInputVals[idx]}</span>
                </div>
              ))}
            </div>
            {isValidateMission && (
              <p style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--txt-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                ※ 제시된 입력은 참고용입니다. 아래 진리표 검증에서 <strong>모든 조합</strong>을 통과해야 합니다.
              </p>
            )}
          </div>

          <div className="card">
            <div className="section-label">회로 설계 (CIRCUIT)</div>
            <div className="gate-grid">
              {GATES.filter(g => g !== 'NOT').map(g => (
                <button
                  key={g}
                  className={`gate-btn ${selectedGate === g ? 'active' : ''}`}
                  disabled={cleared}
                  onClick={() => setSelectedGate(g)}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="circuit-row mt-16">
              <span style={{ fontSize: '0.82rem', color: 'var(--txt-muted)' }}>
                {mission.inputs.map(i => i.key).join(', ')}
              </span>
              <div className="wire active" />
              <div className="gate-box">{selectedGate}</div>
              <div className={`wire ${currentOut ? 'active' : ''}`} />
              <div className="led-wrap">
                <div className={`led ${currentOut ? 'on' : ''}`} />
                <div className="led-label">
                  <span style={{ fontSize: '1rem' }}>{mission.output.icon}</span><br />
                  <span style={{ fontSize: '0.7rem' }}>{mission.output.label}</span>
                </div>
              </div>
            </div>
          </div>

          {isValidateMission && validationRows && (
            <div className="card">
              <div className="flex between center mb-12">
                <div className="section-label" style={{ margin: 0 }}>진리표 검증 현황</div>
                <span style={{ fontSize: '0.75rem', color: allRowsPass ? 'var(--success)' : 'var(--txt-muted)' }}>
                  {validationRows.filter(r => r.ok).length} / {validationRows.length} 통과
                </span>
              </div>
              <table className="truth-table">
                <thead>
                  <tr>
                    {mission.inputs.map(i => <th key={i.key}>{i.key}</th>)}
                    <th>목표</th>
                    <th>현재</th>
                  </tr>
                </thead>
                <tbody>
                  {validationRows.map((row, i) => (
                    <tr key={i} className={i === currentRowIdx ? 'highlight' : ''}>
                      {row.ins.map((v, k) => <td key={k}>{v}</td>)}
                      <td className={row.expected ? 'out-1' : 'out-0'}>{row.expected}</td>
                      <td style={{ fontWeight: 700, color: row.ok ? 'var(--success)' : 'var(--error)' }}>
                        {row.actual} {row.ok ? '✓' : '✗'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="section-label">정답 판정 (VERDICT)</div>

            <div className="verdict-row">
              <span className="verdict-key">시나리오 목표 출력</span>
              <span className="verdict-value">{mission.targetOutput}</span>
            </div>
            <div className="verdict-row">
              <span className="verdict-key">현재 출력</span>
              <span className={`verdict-value ${isMatch ? 'match' : 'mismatch'}`}>{currentOut}</span>
            </div>
            {isValidateMission && (
              <div className="verdict-row">
                <span className="verdict-key">진리표 전체 통과</span>
                <span className={`verdict-value ${allRowsPass ? 'match' : 'mismatch'}`}>
                  {allRowsPass ? '✓ 통과' : '✗ 미통과'}
                </span>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              {cleared ? (
                <div className="mission-clear-anim" style={{
                  textAlign: 'center', padding: '14px',
                  background: 'rgba(0,230,118,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--success)', fontWeight: 700,
                }}>
                  ✓ 정답입니다!
                  {earnedBonus > 0 && (
                    <div style={{ fontSize: '0.82rem', marginTop: 4, color: 'var(--accent)' }}>
                      보너스 +{earnedBonus}점
                      {earnedBonus >= 80 && ' 🎉 힌트 없이 첫 번에 성공!'}
                    </div>
                  )}
                </div>
              ) : result === 'wrong' ? (
                <div style={{
                  textAlign: 'center', padding: '12px',
                  background: 'rgba(255,82,82,0.1)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--error)', fontWeight: 700,
                }}>
                  ✗ 정답이 아닙니다 (시도 {tries}/{MAX_TRIES})
                  {isValidateMission && (
                    <div style={{ fontSize: '0.75rem', marginTop: 4, color: 'var(--txt-muted)' }}>
                      왼쪽 진리표 검증 현황에서 ✗ 행을 확인하세요.
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {!cleared && (
              <button
                className="btn btn-primary w-full mt-16"
                onClick={submit}
                disabled={tries >= MAX_TRIES}
              >
                {tries >= MAX_TRIES ? '시도 초과' : '제출하기'}
              </button>
            )}

            {!cleared && (
              <button
                className="btn btn-ghost w-full mt-8"
                onClick={() => setShowHint(h => !h)}
              >
                {showHint ? '힌트 숨기기' : '💡 힌트 보기'}
              </button>
            )}

            {cleared && (
              <button className="btn btn-ghost w-full mt-12" onClick={retry}>다시 풀기</button>
            )}
          </div>

          {showHint && <div className="hint-box">{mission.hint}</div>}

          {result === 'wrong' && tries === 1 && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(124,77,255,0.08)',
              border: '1px solid rgba(124,77,255,0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: 'var(--txt-muted)',
            }}>
              △ 자동 기록<br />
              오답이 다이어리에 자동으로 저장되었습니다. Review 모드에서 다시 확인할 수 있습니다.
            </div>
          )}

          {!cleared && tries === 0 && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(0,212,200,0.05)',
              border: '1px solid rgba(0,212,200,0.2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: 'var(--txt-muted)',
            }}>
              ✨ 보너스 점수 안내<br />
              힌트 미사용 +30점 / 첫 시도 성공 +50점
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
