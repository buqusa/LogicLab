import { useState } from 'react';
import { GATES, buildTruthTable } from '../../utils/gateLogic';
import { GATE_META, getRowInsight } from '../../utils/insightText';
import { useCircuit } from '../../hooks/useCircuit';
import { useLabels } from '../../hooks/useLabels';
import LabelEditor from './LabelEditor';

const SENSOR_PRESETS = {
  inputA: [
    { name: 'A',           icon: '●' },
    { name: 'PIR 센서',    icon: '👤' },
    { name: '조도 센서',   icon: '🌟' },
    { name: '온도 센서',   icon: '🌡️' },
    { name: 'CO₂ 센서',   icon: '💨' },
  ],
  inputB: [
    { name: 'B',           icon: '●' },
    { name: '조도 센서',   icon: '🌟' },
    { name: '온도 센서',   icon: '🌡️' },
    { name: '습도 센서',   icon: '💧' },
    { name: '야간 모드',   icon: '🌙' },
  ],
  output: [
    { name: '출력',        icon: '💡' },
    { name: '공장 조명',   icon: '🏭' },
    { name: '경보 사이렌', icon: '🚨' },
    { name: '에어컨',      icon: '❄️' },
    { name: '환기 팬',     icon: '🌀' },
  ],
};

export default function SandboxMode() {
  const { inputs, gate, output, setGate, toggle } = useCircuit([0, 0], 'AND');
  const { labels, updateLabel, resetLabels } = useLabels();
  const [showEditor, setShowEditor] = useState(false);
  const [toggleCount, setToggleCount] = useState(0);

  const isNot = gate === 'NOT';
  const table = buildTruthTable(gate, isNot ? 1 : 2);

  const currentIdx = isNot
    ? inputs[0]
    : inputs[0] * 2 + inputs[1];

  const inputLabels = [
    labels.inputA,
    ...(isNot ? [] : [labels.inputB]),
  ];

  const meta = GATE_META[gate];
  const insight = getRowInsight(gate, inputs);

  function handleToggle(idx) {
    toggle(idx);
    setToggleCount(c => c + 1);
  }

  return (
    <div>
      <div className="flex between center mb-16 wrap gap-8">
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>자유 시뮬레이터</h2>
          <p className="text-muted mt-8">논리 게이트를 자유롭게 배치하고 가상 IoT 센서 환경을 커스텀하세요.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => setShowEditor(true)}>⚙ 라벨 편집</button>
      </div>

      <div className="flex gap-16 wrap">
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card">
            <div className="section-label">가상 센서 스위치 (INPUTS)</div>
            <div className="flex gap-20 center">
              {inputLabels.map((lbl, idx) => (
                <div className="switch-wrap" key={idx}>
                  <span style={{ fontSize: '1.4rem' }}>{lbl.icon}</span>
                  <span className="switch-label">{lbl.name}</span>
                  <button
                    className={`switch ${inputs[idx] ? 'on' : ''}`}
                    onClick={() => handleToggle(idx)}
                    aria-label={`${lbl.name} 토글`}
                  />
                  <span className={`switch-val ${inputs[idx] ? 'on' : ''}`}>● {inputs[idx]}</span>
                </div>
              ))}
            </div>

            {toggleCount < 3 && (
              <p style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--txt-muted)', textAlign: 'center' }}>
                💡 스위치를 토글하며 진리표의 강조 행이 어떻게 바뀌는지 확인해보세요.
              </p>
            )}
          </div>

          <div className="card">
            <div className="section-label">논리 소자 선택 (SELECT GATE)</div>
            <div className="gate-grid">
              {GATES.map(g => (
                <button
                  key={g}
                  className={`gate-btn ${gate === g ? 'active' : ''}`}
                  onClick={() => setGate(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {meta && (
            <div className="card" style={{ borderColor: 'rgba(124,77,255,0.35)' }}>
              <div className="section-label" style={{ color: 'var(--purple)' }}>게이트 특성</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', color: 'var(--accent)', marginBottom: 8 }}>
                {meta.symbol}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--txt-main)', marginBottom: 6 }}>
                {meta.rule}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', fontFamily: 'monospace' }}>
                출력 패턴: {meta.pattern}
              </div>
            </div>
          )}

          <div className="card">
            <div className="section-label">실시간 흐름 시뮬레이션</div>
            <div className="circuit-row">
              <div>
                {inputLabels.map((lbl, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem', color: inputs[idx] ? 'var(--accent)' : 'var(--txt-muted)', marginBottom: 4 }}>
                    {lbl.name}: <strong>{inputs[idx]}</strong>
                  </div>
                ))}
              </div>
              <div className={`wire ${inputs.some(v => v) ? 'active' : ''}`} />
              <div className="gate-box">{gate}</div>
              <div className={`wire ${output ? 'active' : ''}`} />
              <div className="led-wrap">
                <div className={`led ${output ? 'on' : ''}`} />
                <div className="led-label">
                  <span style={{ fontSize: '1.1rem' }}>{labels.output.icon}</span><br />
                  <span style={{ fontSize: '0.72rem' }}>{labels.output.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="section-label">실시간 진리표 (TRUTH TABLE)</div>
            <p className="text-muted mb-16" style={{ fontSize: '0.75rem' }}>
              현재 스위치 값과 일치하는 행이 실시간으로 하이라이트됩니다.
            </p>

            <table className="truth-table">
              <thead>
                <tr>
                  <th>{labels.inputA.name}</th>
                  {!isNot && <th>{labels.inputB.name}</th>}
                  <th>Output ({gate})</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row, i) => (
                  <tr key={i} className={i === currentIdx ? 'highlight' : ''}>
                    {row.inputs.map((v, k) => <td key={k}>{v}</td>)}
                    <td className={row.out ? 'out-1' : 'out-0'}>{row.out}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{
              marginTop: 14,
              padding: '10px 12px',
              background: 'rgba(0,212,200,0.06)',
              border: '1px solid rgba(0,212,200,0.2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--txt-muted)',
              lineHeight: 1.7,
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>현재 상태 해석: </span>
              {insight}
            </div>

            <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--bg-raised)', borderRadius: 'var(--radius-sm)' }}>
              <div className="text-muted mb-8" style={{ fontSize: '0.75rem' }}>진리표 현재 상태:</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Input [{inputs.slice(0, isNot ? 1 : 2).join(', ')}] → Output {output}
              </div>
              <button
                style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--accent)', background: 'none', padding: 0 }}
                onClick={() => {
                  const full = table.map(r => `[${r.inputs.join(',')}] → ${r.out}`).join('\n');
                  alert(`${gate} 전체 진리표\n\n${full}`);
                }}
              >
                전체 진리표 펼쳐보기 ↓
              </button>
            </div>
          </div>

          {toggleCount >= 4 && (
            <div style={{
              padding: '12px 14px',
              background: 'rgba(124,77,255,0.08)',
              border: '1px solid rgba(124,77,255,0.25)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--txt-muted)',
              lineHeight: 1.7,
            }}>
              <span style={{ color: 'var(--purple)', fontWeight: 600 }}>🔁 심화 학습 팁: </span>
              게이트를 NAND로 바꾸고 같은 입력 조합을 다시 눌러보세요.
              AND와 NAND의 출력 패턴이 어떻게 다른지 진리표에서 비교해보세요.
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <LabelEditor
          labels={labels}
          presets={SENSOR_PRESETS}
          onUpdate={updateLabel}
          onReset={resetLabels}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}
