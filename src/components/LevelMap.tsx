import { LEVELS } from '../levels/levels';

interface Props {
  currentLevel: number;
  completedLevels: number[];
  onSelect: (id: number) => void;
  onClose: () => void;
}

const STAGE_EMOJIS = ['🌑', '🪐', '🌠', '☄️', '🔮', '🛸', '🌋', '🌌', '🐉', '👑'];

export default function LevelMap({ currentLevel, completedLevels, onSelect, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(5,5,20,0.85)' }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl p-6 max-w-md w-full shadow-2xl animate-pop"
        style={{
          background: '#0d1117',
          border: '1px solid #00d4ff33',
          boxShadow: '0 0 40px #00d4ff22, 0 8px 60px #00000099',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-black tracking-widest uppercase"
            style={{ color: '#00d4ff', textShadow: '0 0 10px #00d4ff88' }}
          >
            🗺️ MISSION MAP
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none transition-all hover:scale-110"
            style={{ color: '#64748b' }}
          >
            &times;
          </button>
        </div>

        {/* Level grid */}
        <div className="grid grid-cols-2 gap-3">
          {LEVELS.map((level, i) => {
            const done = completedLevels.includes(level.id);
            const active = level.id === currentLevel;
            const locked = !done && level.id > (Math.max(...completedLevels, 0) + 1);

            let borderColor = '#ffffff11';
            let bgColor = '#050514';
            let extraStyle: React.CSSProperties = {};

            if (done) {
              borderColor = '#22c55e66';
              bgColor = '#22c55e08';
              extraStyle = { boxShadow: '0 0 10px #22c55e22' };
            } else if (active) {
              borderColor = '#00d4ff';
              bgColor = '#00d4ff08';
              extraStyle = { boxShadow: '0 0 16px #00d4ff44', animation: 'pulse-neon 2s ease-in-out infinite' };
            } else if (locked) {
              bgColor = '#050514';
            }

            return (
              <button
                key={level.id}
                onClick={() => { if (!locked) { onSelect(level.id); onClose(); } }}
                disabled={locked}
                className="rounded-2xl p-3 text-left transition-all"
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  opacity: locked ? 0.4 : 1,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  ...extraStyle,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{locked ? '🔒' : STAGE_EMOJIS[i]}</span>
                  <span className="text-xs font-bold" style={{ color: '#64748b' }}>
                    MISSION {level.id}
                  </span>
                  {done && (
                    <span className="ml-auto text-sm" style={{ color: '#22c55e' }}>✅</span>
                  )}
                  {active && !done && (
                    <span className="ml-auto text-xs" style={{ color: '#00d4ff' }}>▶</span>
                  )}
                </div>
                <p className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{level.title}</p>
                <p className="text-xs" style={{ color: '#64748b' }}>{level.rank}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
