import { useEffect, useRef, useState } from 'react';
import { getRank } from '../levels/levels';

interface Props {
  xp: number;
  completedLevels: number[];
  playerName: string;
  playerPhoto: string;
  onShowMap: () => void;
  onShowBadges: () => void;
  onNewPlayer: () => void;
}

export default function Header({ xp, completedLevels, playerName, playerPhoto, onShowMap, onShowBadges, onNewPlayer }: Props) {
  const rank = getRank(xp);
  const nextRankXP = [0, 100, 200, 350, 550, 800, 9999];
  const ranks = ['Seedling', 'Explorer', 'Squire', 'Warrior', 'Champion', 'Python Master'];
  const rankIdx = ranks.indexOf(rank.name);
  const nextXP = nextRankXP[rankIdx + 1] ?? nextRankXP[rankIdx];
  const prevXP = nextRankXP[rankIdx] ?? 0;
  const progress = Math.min(100, Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100));

  // Thrust animation triggers when XP changes
  const [thrusting, setThrusting] = useState(false);
  const prevXpRef = useRef(xp);

  useEffect(() => {
    if (xp !== prevXpRef.current) {
      prevXpRef.current = xp;
      setThrusting(true);
      const t = setTimeout(() => setThrusting(false), 700);
      return () => clearTimeout(t);
    }
  }, [xp]);

  return (
    <div
      className="text-white px-6 py-4 shadow-2xl"
      style={{
        background: '#0d1117',
        borderBottom: '2px solid #00d4ff',
        boxShadow: '0 0 20px #00d4ff33, 0 4px 24px #00000099',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">

          {/* Left: Avatar + name + rank */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                border: '2px solid #00d4ff',
                boxShadow: '0 0 12px #00d4ff88',
                background: '#050514',
              }}
            >
              {playerPhoto
                ? <img src={playerPhoto} alt={playerName} className="w-full h-full object-cover" />
                : <span className="text-2xl">👨‍🚀</span>}
            </div>
            <div>
              <h1
                className="text-lg font-black tracking-widest leading-tight"
                style={{ color: '#00d4ff', textShadow: '0 0 10px #00d4ffaa' }}
              >
                {playerName ? `COMMANDER ${playerName.toUpperCase()}` : 'PYQUEST'}
              </h1>
              <p className="text-xs" style={{ color: '#a855f7' }}>
                {rank.emoji} {rank.name} · PYTHON SPACE ACADEMY
              </p>
            </div>
          </div>

          {/* Right: stats */}
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-xs" style={{ color: '#a855f7' }}>MISSIONS</p>
              <p className="font-bold text-sm" style={{ color: '#00d4ff' }}>
                🚀 {completedLevels.length}/10
              </p>
            </div>
            <div
              className="text-right px-3 py-1 rounded-lg"
              style={{ border: '1px solid #ffd70066', background: '#ffd70011' }}
            >
              <p className="text-xs" style={{ color: '#ffd700aa' }}>FUEL (XP)</p>
              <p className="font-bold text-sm" style={{ color: '#ffd700', textShadow: '0 0 8px #ffd70088' }}>
                ⭐ {xp}
              </p>
            </div>
          </div>
        </div>

        {/* FUEL GAUGE with rocket */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold" style={{ color: '#00d4ffaa' }}>FUEL GAUGE</span>

          <div className="flex-1 relative" style={{ height: '20px' }}>
            {/* Track */}
            <div
              className="absolute inset-y-0 left-0 right-0 my-auto rounded-full"
              style={{
                height: '8px',
                background: '#ffffff1a',
                border: '1px solid #00d4ff33',
              }}
            />
            {/* Fill */}
            <div
              className="absolute left-0 my-auto rounded-full transition-all duration-700"
              style={{
                height: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
                boxShadow: '0 0 8px #00d4ff88',
              }}
            />
            {/* Rocket — clamp between 2% and 98% so it stays on the bar */}
            <div
              className={`absolute text-lg transition-all duration-700 ${thrusting ? 'animate-thrust' : ''}`}
              style={{
                left: `${Math.min(Math.max(progress, 2), 96)}%`,
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
                filter: thrusting
                  ? 'drop-shadow(0 0 8px #ff6600) drop-shadow(0 -4px 6px #ffcc00)'
                  : 'drop-shadow(0 0 4px #00d4ff88)',
                zIndex: 10,
              }}
            >
              🚀
            </div>
            {/* Thrust flame trail — only when thrusting */}
            {thrusting && (
              <div
                className="absolute my-auto rounded-full animate-fade"
                style={{
                  height: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: `${Math.min(Math.max(progress, 2), 96) - 4}%`,
                  background: 'linear-gradient(90deg, transparent, #ff660044, #ffcc0066)',
                  filter: 'blur(3px)',
                }}
              />
            )}
          </div>

          <span className="text-xs whitespace-nowrap" style={{ color: '#00d4ffaa' }}>
            {xp}/{nextXP} XP
          </span>
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onShowMap}
            className="text-xs font-bold px-4 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ background: '#00d4ff11', border: '1px solid #00d4ff55', color: '#00d4ff' }}
          >
            🗺️ MISSION MAP
          </button>
          <button
            onClick={onShowBadges}
            className="text-xs font-bold px-4 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ background: '#a855f711', border: '1px solid #a855f755', color: '#a855f7' }}
          >
            🏅 TROPHY HANGAR ({completedLevels.length})
          </button>
          <button
            onClick={onNewPlayer}
            className="text-xs font-bold px-4 py-1.5 rounded-full transition-all hover:scale-105 ml-auto"
            style={{ background: '#ef444411', border: '1px solid #ef444455', color: '#ef4444' }}
          >
            👤 NEW PLAYER
          </button>
        </div>
      </div>
    </div>
  );
}
