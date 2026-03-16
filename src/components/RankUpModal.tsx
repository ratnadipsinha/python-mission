import { useEffect } from 'react';

interface Props {
  rank: { name: string; emoji: string };
  onClose: () => void;
}

export default function RankUpModal({ rank, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(5,5,20,0.85)' }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl p-10 text-center animate-pop max-w-sm mx-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #111827 100%)',
          border: '2px solid #ffd700',
          boxShadow: '0 0 40px #ffd70066, 0 0 80px #ffd70033, 0 8px 60px #00000099',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #ffd700, #a855f7, #ffd700)' }}
        />

        {/* Spinning ring behind emoji */}
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              border: '2px dashed #ffd70066',
              margin: '-8px',
            }}
          />
          <div className="text-8xl relative z-10">{rank.emoji}</div>
        </div>

        <h2
          className="text-4xl font-black mb-2 tracking-widest"
          style={{
            color: '#ffd700',
            textShadow: '0 0 20px #ffd700, 0 0 40px #ffd70066',
          }}
        >
          RANK UP! 🚀
        </h2>

        <p
          className="text-lg font-bold mb-1"
          style={{ color: '#94a3b8' }}
        >
          YOU ARE NOW A
        </p>

        <p
          className="text-3xl font-black mb-4"
          style={{
            color: '#00d4ff',
            textShadow: '0 0 16px #00d4ff',
          }}
        >
          {rank.name.toUpperCase()}!
        </p>

        <p className="text-sm" style={{ color: '#ffffff44' }}>
          Tap anywhere to continue your mission
        </p>

        {/* Bottom decorative stars */}
        <div className="flex justify-center gap-2 mt-4">
          {['⭐','🌟','⭐'].map((s, i) => (
            <span key={i} className="text-lg" style={{ opacity: 0.6 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
