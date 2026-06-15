export default function LabelEditor({ labels, presets, onUpdate, onReset, onClose }) {
  const fields = [
    { key: 'inputA', title: '입력 A 라벨' },
    { key: 'inputB', title: '입력 B 라벨' },
    { key: 'output', title: '출력 라벨' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⚙ 센서 라벨 편집</div>

        {fields.map(({ key, title }) => (
          <div key={key} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>{title}</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {(presets[key] || []).map(p => (
                <button
                  key={p.name}
                  title={p.name}
                  style={{
                    fontSize: '1.1rem',
                    padding: '4px 6px',
                    borderRadius: 6,
                    border: '1.5px solid var(--border)',
                    background: labels[key].name === p.name ? 'rgba(0,212,200,0.15)' : 'var(--bg-raised)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onClick={() => { onUpdate(key, 'icon', p.icon); onUpdate(key, 'name', p.name); }}
                >
                  {p.icon}
                </button>
              ))}
            </div>

            <div className="flex gap-8">
              <div className="modal-field" style={{ flex: 1 }}>
                <label>아이콘</label>
                <input
                  value={labels[key].icon}
                  maxLength={4}
                  onChange={e => onUpdate(key, 'icon', e.target.value)}
                  placeholder="예: 💡"
                />
              </div>
              <div className="modal-field" style={{ flex: 3 }}>
                <label>이름</label>
                <input
                  value={labels[key].name}
                  maxLength={12}
                  onChange={e => onUpdate(key, 'name', e.target.value)}
                  placeholder="예: PIR 센서"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onReset}>초기화</button>
          <button className="btn btn-primary" onClick={onClose}>완료</button>
        </div>
      </div>
    </div>
  );
}
