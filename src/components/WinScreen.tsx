import { RANKS } from '../levels/levels';

interface Props {
  xp: number;
  onReset: () => void;
}

export default function WinScreen({ xp, onReset }: Props) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#050514' }}
    >
      <div
        className="rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-pop relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #111827 100%)',
          border: '2px solid #ffd700',
          boxShadow: '0 0 60px #ffd70044, 0 0 120px #ffd70022, 0 8px 60px #00000099',
        }}
      >
        {/* Top gradient bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #ffd700, #00d4ff, #a855f7, #ffd700)' }}
        />

        {/* Floating rocket */}
        <div className="text-8xl mb-4 animate-float">🚀</div>

        <h1
          className="text-3xl font-black mb-2 tracking-wide"
          style={{
            color: '#ffd700',
            textShadow: '0 0 20px #ffd700, 0 0 40px #ffd70066',
          }}
        >
          MISSION ACCOMPLISHED!
        </h1>

        <p
          className="text-lg font-bold mb-6"
          style={{ color: '#00d4ff', textShadow: '0 0 10px #00d4ff88' }}
        >
          YOU ARE A PYTHON MASTER 🌌
        </p>

        {/* XP display */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: '#ffd70011',
            border: '1px solid #ffd70066',
            boxShadow: '0 0 20px #ffd70033',
          }}
        >
          <p
            className="text-3xl font-black"
            style={{ color: '#ffd700', textShadow: '0 0 12px #ffd70088' }}
          >
            ⭐ {xp} FUEL COLLECTED
          </p>
          <p
            className="font-bold mt-1"
            style={{ color: '#a855f7' }}
          >
            GALAXY COMMANDER 🐉
          </p>
        </div>

        {/* Rank progression display */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {RANKS.map(r => (
            <div
              key={r.name}
              className="rounded-xl p-2 text-center"
              style={{
                background: '#050514',
                border: '1px solid #00d4ff22',
              }}
            >
              <div className="text-2xl">{r.emoji}</div>
              <p className="text-xs font-bold mt-0.5" style={{ color: '#94a3b8' }}>{r.name}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onReset}
          className="font-black text-base px-8 py-3 rounded-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
            color: '#050514',
            border: '1px solid #00d4ff',
            boxShadow: '0 0 20px #00d4ff66',
          }}
        >
          🔄 NEW MISSION
        </button>
      </div>
    </div>
  );
}
