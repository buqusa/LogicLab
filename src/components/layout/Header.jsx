const TABS = [
  { key: 'sandbox',   label: '자유 실습' },
  { key: 'challenge', label: '미션' },
  { key: 'review',    label: '리뷰' },
];

export default function Header({ mode, onModeChange }) {
  return (
    <header className="header">
      <div className="header-logo">
        🔬 Logic<span>Lab</span>
      </div>

      <nav className="nav-tabs" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={mode === tab.key}
            className={`nav-tab ${mode === tab.key ? 'active' : ''}`}
            onClick={() => onModeChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
