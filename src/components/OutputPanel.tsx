interface Props {
  output: string;
  error: string | null;
  isCorrect: boolean | null;
  attempts: number;
  hint: string;
  onNext: () => void;
  isLastLevel: boolean;
  xpGained: number;
}

export default function OutputPanel({
  output, error, isCorrect, attempts, hint, onNext, isLastLevel, xpGained
}: Props) {
  const showHint = attempts >= 3 && isCorrect === false;

  const borderColor =
    isCorrect === true  ? '#22c55e' :
    isCorrect === false ? '#ef4444' :
    '#a855f7';

  const glowColor =
    isCorrect === true  ? '#22c55e44' :
    isCorrect === false ? '#ef444444' :
    '#a855f744';

  return (
    <div
      className="rounded-2xl p-6 shadow-2xl transition-all"
      style={{
        background: '#0d1117',
        border: `1px solid ${borderColor}55`,
        boxShadow: `0 0 20px ${glowColor}, 0 4px 32px #00000088`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-sm font-black tracking-widest uppercase"
          style={{
            color: borderColor,
            textShadow: `0 0 8px ${borderColor}88`,
          }}
        >
          {isCorrect === true  ? '✅ MISSION COMPLETE' :
           isCorrect === false ? '❌ TRANSMISSION ERROR' :
           '📡 MISSION CONTROL'}
        </span>
        {isCorrect === true && xpGained > 0 && (
          <span
            className="text-xs font-black px-3 py-0.5 rounded-full animate-xp"
            style={{
              background: '#ffd70022',
              border: '1px solid #ffd70066',
              color: '#ffd700',
              textShadow: '0 0 8px #ffd70088',
            }}
          >
            +{xpGained} FUEL ⭐
          </span>
        )}
      </div>

      {/* Output terminal */}
      <div
        className="rounded-xl p-4 font-mono text-sm min-h-[60px] whitespace-pre-wrap mb-4"
        style={{
          background: '#050514',
          border: '1px solid #ffffff11',
          color: '#94a3b8',
        }}
      >
        {error ? (
          <span style={{ color: '#ef4444' }}>{error}</span>
        ) : output ? (
          <span style={{ color: '#22c55e' }}>{output}</span>
        ) : (
          <span style={{ color: '#ffffff33', fontStyle: 'italic' }}>
            Awaiting transmission from mission control...
          </span>
        )}
      </div>

      {/* Success state */}
      {isCorrect === true && (
        <div className="animate-fade">
          <p className="font-semibold mb-3" style={{ color: '#22c55e' }}>
            🎉 Outstanding work, Space Cadet! Mission accomplished!
          </p>
          <button
            onClick={onNext}
            className="font-black text-sm px-8 py-3 rounded-xl transition-all hover:scale-105 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
              color: '#050514',
              border: '1px solid #00d4ff',
              boxShadow: '0 0 16px #00d4ff66',
            }}
          >
            {isLastLevel ? '🏆 CLAIM YOUR GALAXY TROPHY!' : '🚀 NEXT MISSION'}
          </button>
        </div>
      )}

      {/* Failure state */}
      {isCorrect === false && (
        <div className="animate-fade">
          <p className="text-sm mb-2" style={{ color: '#ef4444' }}>
            {attempts === 1 ? "Signal lost — re-calibrate and try again! 💪" :
             attempts === 2 ? "Almost docked — adjust your trajectory! 🤔" :
             "Stay the course, Commander — you've got this! 🔥"}
          </p>
          {showHint && (
            <div
              className="rounded-lg p-3 text-sm"
              style={{
                background: '#ffd70011',
                border: '1px solid #ffd70033',
                color: '#ffd700',
              }}
            >
              📡 <strong>SIGNAL RECEIVED:</strong> {hint}
            </div>
          )}
          {!showHint && (
            <p className="text-xs" style={{ color: '#ffffff33' }}>
              Signal unlocks after {3 - attempts} more attempt{3 - attempts !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Idle state */}
      {isCorrect === null && (
        <p className="text-sm italic" style={{ color: '#a855f7aa' }}>
          Write your code above and click 🚀 Launch Code
        </p>
      )}
    </div>
  );
}
