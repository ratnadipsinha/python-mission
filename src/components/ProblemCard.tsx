interface Props {
  level: number;
  total: number;
  title: string;
  topic: string;
  emoji: string;
  mode: string;
  instruction: string;
}

export default function ProblemCard({ level, total, title, topic, emoji, mode, instruction }: Props) {
  const modeConfig: Record<string, { label: string; color: string; border: string; bg: string }> = {
    fill:  { label: '✏️ FILL THE GAP',      color: '#00d4ff', border: '#00d4ff55', bg: '#00d4ff11' },
    fix:   { label: '🐛 DEBUG ALERT',        color: '#ef4444', border: '#ef444455', bg: '#ef444411' },
    write: { label: '🖊️ FREE CODE',          color: '#a855f7', border: '#a855f755', bg: '#a855f711' },
  };
  const mc = modeConfig[mode] ?? modeConfig.write;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: '#0d1117',
        border: '1px solid #a855f744',
        boxShadow: '0 0 20px #a855f722, 0 4px 32px #00000088',
      }}
    >
      {/* Gradient top border bar */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, #00d4ff, #a855f7, #00d4ff)' }}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background: '#050514',
                border: '1px solid #a855f744',
                boxShadow: '0 0 12px #a855f733',
              }}
            >
              {emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: '#a855f7' }}
                >
                  MISSION BRIEFING
                </span>
              </div>
              <h2
                className="text-lg font-black leading-tight"
                style={{ color: '#e2e8f0' }}
              >
                MISSION {level}/{total} — {title}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                🪐 SECTOR: {topic}
              </p>
            </div>
          </div>

          {/* Mode badge */}
          <span
            className="text-xs font-black px-4 py-1.5 rounded-full tracking-wide"
            style={{
              color: mc.color,
              border: `1px solid ${mc.border}`,
              background: mc.bg,
              textShadow: `0 0 8px ${mc.color}88`,
            }}
          >
            {mc.label}
          </span>
        </div>

        {/* Instruction box */}
        <div
          className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            background: '#050514',
            border: '1px solid #ffffff11',
            color: '#94a3b8',
          }}
        >
          {instruction}
        </div>
      </div>
    </div>
  );
}
