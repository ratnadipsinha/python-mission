import { useState } from 'react';
import type { RefresherSection } from '../levels/levels';

interface Props {
  topic: string;
  emoji: string;
  sections: RefresherSection[];
  youtubeUrl: string;
}

export default function RefresherPanel({ topic, emoji, sections, youtubeUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      style={{
        background: '#0d1117',
        border: '1px solid #00d4ff33',
        boxShadow: '0 0 16px #00d4ff11, 0 4px 24px #00000066',
      }}
    >
      {/* Top cyan accent border */}
      <div
        className="h-0.5 w-full"
        style={{ background: 'linear-gradient(90deg, #00d4ff, #a855f7)' }}
      />

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between px-4 py-3 w-full text-left transition-all hover:opacity-90"
        style={{
          background: open
            ? 'linear-gradient(135deg, #00d4ff11, #a855f711)'
            : '#050514',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{emoji}</span>
          <div>
            <p
              className="text-xs font-black tracking-widest uppercase leading-none"
              style={{ color: '#00d4ff' }}
            >
              {open ? '📡 SIGNAL RECEIVED' : '📡 SIGNAL RECEIVED'}
            </p>
            <p
              className="font-black text-sm leading-tight mt-0.5"
              style={{ color: '#e2e8f0' }}
            >
              {open ? topic : `Tap to access space datapad — ${topic}`}
            </p>
          </div>
        </div>
        <span
          className={`text-base font-bold transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: '#00d4ff' }}
        >
          ▼
        </span>
      </button>

      {/* Closed state hint */}
      {!open && (
        <div
          className="px-4 py-2 text-center"
          style={{ background: '#050514', borderTop: '1px solid #00d4ff11' }}
        >
          <p className="text-xs" style={{ color: '#64748b' }}>
            Stuck? Access the space datapad for <strong style={{ color: '#a855f7' }}>{topic}</strong>
          </p>
        </div>
      )}

      {/* Open content */}
      {open && (
        <div className="animate-fade">
          {/* Tabs */}
          <div
            className="flex overflow-x-auto"
            style={{ borderBottom: '1px solid #00d4ff22', background: '#050514' }}
          >
            {sections.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="flex-shrink-0 px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap"
                style={{
                  borderBottomColor: activeIdx === i ? '#00d4ff' : 'transparent',
                  color: activeIdx === i ? '#00d4ff' : '#64748b',
                  background: activeIdx === i ? '#00d4ff0a' : 'transparent',
                }}
              >
                {s.heading.slice(0, 20)}{s.heading.length > 20 ? '…' : ''}
              </button>
            ))}
          </div>

          {/* Active section */}
          {sections[activeIdx] && (
            <div className="p-4 flex flex-col gap-3">
              <h3
                className="font-black text-sm"
                style={{ color: '#e2e8f0' }}
              >
                {sections[activeIdx].heading}
              </h3>
              <p
                className="text-xs leading-relaxed whitespace-pre-line"
                style={{ color: '#94a3b8' }}
              >
                {sections[activeIdx].body}
              </p>
              {sections[activeIdx].code && (
                <pre
                  className="text-xs rounded-xl p-3 overflow-x-auto leading-relaxed font-mono"
                  style={{
                    background: '#000000',
                    color: '#22c55e',
                    border: '1px solid #22c55e22',
                    boxShadow: '0 0 10px #22c55e11',
                  }}
                >
                  {sections[activeIdx].code}
                </pre>
              )}
            </div>
          )}

          {/* Dot nav */}
          {sections.length > 1 && (
            <div className="flex justify-center gap-1.5 py-2">
              {sections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background: activeIdx === i ? '#00d4ff' : '#ffffff22',
                    boxShadow: activeIdx === i ? '0 0 6px #00d4ff88' : 'none',
                  }}
                />
              ))}
            </div>
          )}

          {/* YouTube link */}
          <div className="mx-4 mb-4">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-bold text-xs px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] w-full justify-center"
              style={{
                background: '#ff000022',
                border: '1px solid #ff000066',
                color: '#ff4444',
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" style={{ fill: '#ff4444' }}>
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
              </svg>
              📺 Watch Space Academy on YouTube
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
