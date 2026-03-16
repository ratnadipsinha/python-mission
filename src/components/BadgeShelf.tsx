import { LEVELS } from '../levels/levels';

interface Props {
  completedLevels: number[];
  onClose: () => void;
}

export default function BadgeShelf({ completedLevels, onClose }: Props) {
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
          border: '1px solid #ffd70033',
          boxShadow: '0 0 40px #ffd70022, 0 8px 60px #00000099',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-black tracking-widest uppercase"
            style={{ color: '#ffd700', textShadow: '0 0 10px #ffd70088' }}
          >
            🏅 TROPHY HANGAR
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none transition-all hover:scale-110"
            style={{ color: '#64748b' }}
          >
            &times;
          </button>
        </div>

        {completedLevels.length === 0 && (
          <p
            className="text-center py-6 text-sm"
            style={{ color: '#64748b' }}
          >
            Complete missions to earn trophies, Space Cadet! 🌟
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {LEVELS.map(level => {
            const earned = completedLevels.includes(level.id);
            return (
              <div
                key={level.id}
                className="rounded-2xl p-4 text-center transition-all"
                style={{
                  background: earned ? '#ffd70008' : '#050514',
                  border: earned ? '1px solid #ffd70066' : '1px solid #ffffff11',
                  boxShadow: earned ? '0 0 12px #ffd70033' : 'none',
                  opacity: earned ? 1 : 0.4,
                }}
              >
                <div className="text-4xl mb-1">{earned ? level.emoji : '❓'}</div>
                <p
                  className="text-sm font-bold"
                  style={{ color: earned ? '#e2e8f0' : '#64748b' }}
                >
                  {earned ? level.badge : '???'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                  MISSION {level.id}
                </p>
                {earned && (
                  <p
                    className="text-xs font-black mt-1"
                    style={{ color: '#ffd700', textShadow: '0 0 6px #ffd70088' }}
                  >
                    +{level.xpReward} FUEL ⭐
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
