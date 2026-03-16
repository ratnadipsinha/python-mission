import { useRef, type KeyboardEvent } from 'react';

interface Props {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  loading: boolean;
  placeholder?: string;
}

export default function CodeEditor({ code, onChange, onRun, loading, placeholder }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newVal = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newVal);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      }, 0);
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      onRun();
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: '#0a0a1a',
        border: '1px solid #00d4ff33',
        boxShadow: '0 0 20px #00d4ff11, 0 4px 32px #00000088',
      }}
    >
      {/* Terminal header bar */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{
          background: '#0d1117',
          borderBottom: '1px solid #00d4ff22',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Status dots */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 6px #ef444488' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#ffd700', boxShadow: '0 0 6px #ffd70088' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e88' }} />
          </div>
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: '#00d4ff', textShadow: '0 0 8px #00d4ff88' }}
          >
            ⚡ COMMAND TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: '#00d4ff55' }}>mission.py</span>
          <span className="text-xs" style={{ color: '#ffffff33' }}>Ctrl+Enter to launch</span>
        </div>
      </div>

      {/* Code textarea */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full min-h-[180px] p-4 font-mono text-sm resize-y outline-none leading-relaxed"
        style={{
          background: '#0a0a1a',
          color: '#22c55e',
          caretColor: '#00d4ff',
          border: 'none',
        }}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* Footer with launch button */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          borderTop: '1px solid #00d4ff22',
          background: '#0d1117',
        }}
      >
        <span className="text-xs" style={{ color: '#ffffff33' }}>
          🌌 Python Space Academy — Cockpit v1.0
        </span>
        <button
          onClick={onRun}
          disabled={loading}
          className="font-black text-sm px-6 py-2.5 rounded-xl transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          style={{
            background: loading ? '#00d4ff22' : 'linear-gradient(135deg, #00d4ff, #0099bb)',
            color: loading ? '#00d4ff' : '#050514',
            border: '1px solid #00d4ff',
            boxShadow: loading ? 'none' : '0 0 16px #00d4ff66',
          }}
        >
          {loading ? (
            <>
              <span className="animate-spin">⚙️</span> LAUNCHING...
            </>
          ) : (
            <>🚀 LAUNCH CODE</>
          )}
        </button>
      </div>
    </div>
  );
}
