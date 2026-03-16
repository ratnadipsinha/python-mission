import { useState, useRef } from 'react';
import { LEVELS, RANKS } from '../levels/levels';
import { loadPlayer, playerExists } from '../cloudSave';
import type { CloudSave } from '../cloudSave';
import { isConfigured } from '../supabase';

interface Props {
  onStart: (name: string, photo: string, pin: string, cloudSave?: CloudSave) => void;
}

const MODE_LABEL: Record<string, { label: string; color: string; border: string; bg: string }> = {
  fill:  { label: '✏️ Fill-in-blank', color: '#00d4ff', border: '#00d4ff55', bg: '#00d4ff11' },
  fix:   { label: '🐛 Debug Alert',   color: '#ef4444', border: '#ef444455', bg: '#ef444411' },
  write: { label: '🖊️ Free Code',     color: '#a855f7', border: '#a855f755', bg: '#a855f711' },
};

type Tab = 'new' | 'continue';

export default function WelcomeScreen({ onStart }: Props) {
  const [tab, setTab] = useState<Tab>('new');

  // Shared
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New mission only
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const pinDigits = pin.split('');

  const handlePinKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (pinDigits[idx]) {
        const next = [...pinDigits];
        next[idx] = '';
        setPin(next.join(''));
      } else if (idx > 0) {
        pinRefs[idx - 1].current?.focus();
      }
      setPinError('');
    }
  };

  const handlePinInput = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...pinDigits];
    next[idx] = digit;
    // fill trailing empties
    for (let i = 0; i < idx; i++) if (!next[i]) next[i] = '0';
    setPin(next.join(''));
    setPinError('');
    if (digit && idx < 3) pinRefs[idx + 1].current?.focus();
  };

  // Camera helpers
  const openCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      }, 100);
    } catch { setCameraError('Camera not available. Please upload a photo instead.'); }
  };
  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
  };
  const takeSnap = () => {
    const video = videoRef.current; const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg', 0.8));
    closeCamera();
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── LAUNCH NEW MISSION ──────────────────────────────────────────────────
  const handleNewMission = async () => {
    if (!name.trim()) { setError('Please enter your callsign!'); return; }
    if (pin.length < 4) { setPinError('Enter all 4 digits'); return; }
    setLoading(true); setError('');
    try {
      if (isConfigured) {
        const exists = await playerExists(name.trim(), pin);
        if (exists) {
          setError('That callsign + PIN already exists. Use "Continue Mission" to log in!');
          setLoading(false); return;
        }
      }
      onStart(name.trim(), photo ?? '', pin);
    } catch {
      setError('Connection error. Starting offline…');
      onStart(name.trim(), photo ?? '', pin);
    }
    setLoading(false);
  };

  // ── CONTINUE MISSION ────────────────────────────────────────────────────
  const handleContinue = async () => {
    if (!name.trim()) { setError('Please enter your callsign!'); return; }
    if (pin.length < 4) { setPinError('Enter all 4 digits'); return; }
    setLoading(true); setError('');
    try {
      if (!isConfigured) {
        setError('Cloud sync not configured yet. Ask your teacher to set it up!');
        setLoading(false); return;
      }
      const cloudSave = await loadPlayer(name.trim(), pin);
      if (!cloudSave) {
        setError('Callsign + PIN not found. Check spelling or create a New Mission!');
        setLoading(false); return;
      }
      onStart(name.trim(), '', pin, cloudSave);
    } catch {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  const isNew = tab === 'new';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* HERO */}
        <div
          className="rounded-3xl px-8 py-10 text-center shadow-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #0d1117 0%, #111827 50%, #0d1117 100%)',
            border: '1px solid #00d4ff33',
            boxShadow: '0 0 40px #00d4ff22, 0 8px 40px #00000088',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #00d4ff, #a855f7, #00d4ff)' }} />
          <div className="text-7xl mb-3 animate-float">👨‍🚀</div>
          <h1 className="text-5xl font-black tracking-widest mb-1"
            style={{ color: '#00d4ff', textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff44' }}>
            PYQUEST
          </h1>
          <p className="text-base font-bold tracking-widest mb-6" style={{ color: '#a855f7' }}>
            🌌 PYTHON SPACE ACADEMY
          </p>
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            {RANKS.map(r => (
              <div key={r.name} className="text-center">
                <div className="text-2xl">{r.emoji}</div>
                <div className="text-xs mt-0.5 font-bold" style={{ color: '#64748b' }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGIN / REGISTER CARD */}
        <div
          className="rounded-3xl shadow-2xl overflow-hidden"
          style={{
            background: '#0d1117',
            border: '1px solid #00d4ff33',
            boxShadow: '0 0 20px #00d4ff11, 0 4px 32px #00000088',
          }}
        >
          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid #00d4ff22' }}>
            {(['new', 'continue'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setPinError(''); }}
                className="flex-1 py-4 text-sm font-black tracking-widest uppercase transition-all"
                style={{
                  background: tab === t ? '#050514' : 'transparent',
                  color: tab === t ? '#00d4ff' : '#475569',
                  borderBottom: tab === t ? '2px solid #00d4ff' : '2px solid transparent',
                  textShadow: tab === t ? '0 0 8px #00d4ff88' : 'none',
                }}
              >
                {t === 'new' ? '🚀 New Mission' : '▶️ Continue Mission'}
              </button>
            ))}
          </div>

          <div className="px-6 py-6 flex flex-col gap-5">

            {/* Photo (new only) */}
            {isNew && (
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                  {cameraOpen ? (
                    <>
                      <video ref={videoRef}
                        className="w-28 h-28 rounded-2xl object-cover"
                        style={{ border: '2px solid #00d4ff', boxShadow: '0 0 16px #00d4ff66' }}
                        autoPlay muted playsInline />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="flex gap-2">
                        <button onClick={takeSnap}
                          className="text-xs font-bold px-4 py-1.5 rounded-xl transition-all hover:scale-105"
                          style={{ background: 'linear-gradient(135deg,#00d4ff,#0099bb)', color: '#050514', border: '1px solid #00d4ff' }}>
                          📸 SNAP!
                        </button>
                        <button onClick={closeCamera}
                          className="text-xs font-bold px-4 py-1.5 rounded-xl"
                          style={{ background: '#ffffff11', border: '1px solid #ffffff22', color: '#94a3b8' }}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                        style={{ border: '3px solid #00d4ff', boxShadow: '0 0 20px #00d4ff66', background: '#050514' }}>
                        {photo ? <img src={photo} alt="You" className="w-full h-full object-cover" /> : <span className="text-4xl">👨‍🚀</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={openCamera}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl hover:scale-105 transition-all"
                          style={{ background: '#00d4ff11', border: '1px solid #00d4ff55', color: '#00d4ff' }}>
                          📷 Camera
                        </button>
                        <button onClick={() => fileRef.current?.click()}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl hover:scale-105 transition-all"
                          style={{ background: '#ffffff0a', border: '1px solid #ffffff22', color: '#94a3b8' }}>
                          🖼️ Upload
                        </button>
                        {photo && (
                          <button onClick={() => setPhoto(null)}
                            className="text-xs font-bold px-2 py-1.5 rounded-xl"
                            style={{ background: '#ef444411', border: '1px solid #ef444455', color: '#ef4444' }}>
                            ✕
                          </button>
                        )}
                      </div>
                      {cameraError && <p className="text-xs text-center" style={{ color: '#ef4444' }}>{cameraError}</p>}
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 w-full">
                  <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: '#a855f7' }}>
                    SPACE CALLSIGN 🌟
                  </label>
                  <input
                    type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }}
                    placeholder="Enter your callsign..."
                    className="w-full rounded-xl px-4 py-3 text-lg font-semibold outline-none transition-all"
                    style={{ background: '#050514', border: '2px solid #00d4ff33', color: '#e2e8f0', caretColor: '#00d4ff' }}
                    maxLength={24} autoFocus
                    onFocus={e => (e.target.style.borderColor = '#00d4ff')}
                    onBlur={e => (e.target.style.borderColor = '#00d4ff33')}
                    onKeyDown={e => e.key === 'Enter' && handleNewMission()}
                  />
                </div>
              </div>
            )}

            {/* Name (continue tab) */}
            {!isNew && (
              <div>
                <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: '#a855f7' }}>
                  YOUR SPACE CALLSIGN
                </label>
                <input
                  type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="Enter your callsign..."
                  className="w-full rounded-xl px-4 py-3 text-lg font-semibold outline-none transition-all"
                  style={{ background: '#050514', border: '2px solid #00d4ff33', color: '#e2e8f0', caretColor: '#00d4ff' }}
                  maxLength={24} autoFocus
                  onFocus={e => (e.target.style.borderColor = '#00d4ff')}
                  onBlur={e => (e.target.style.borderColor = '#00d4ff33')}
                />
              </div>
            )}

            {/* PIN entry */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-3" style={{ color: '#ffd700' }}>
                {isNew ? 'SET YOUR 4-DIGIT PIN 🔐' : 'ENTER YOUR 4-DIGIT PIN 🔐'}
              </label>
              <div className="flex gap-3 justify-center">
                {[0, 1, 2, 3].map(idx => (
                  <input
                    key={idx}
                    ref={pinRefs[idx]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={pinDigits[idx] ?? ''}
                    onChange={e => handlePinInput(idx, e.target.value)}
                    onKeyDown={e => handlePinKey(idx, e)}
                    className="w-14 h-14 text-center text-2xl font-black rounded-2xl outline-none transition-all"
                    style={{
                      background: '#050514',
                      border: `2px solid ${pinError ? '#ef4444' : pinDigits[idx] ? '#ffd700' : '#ffd70033'}`,
                      color: '#ffd700',
                      caretColor: '#ffd700',
                      boxShadow: pinDigits[idx] ? '0 0 12px #ffd70044' : 'none',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#ffd700')}
                    onBlur={e => (e.target.style.borderColor = pinDigits[idx] ? '#ffd700' : '#ffd70033')}
                  />
                ))}
              </div>
              {pinError && (
                <p className="text-xs text-center mt-2" style={{ color: '#ef4444' }}>⚠️ {pinError}</p>
              )}
              {isNew && (
                <p className="text-xs text-center mt-2" style={{ color: '#64748b' }}>
                  Remember this PIN — you'll need it on every device!
                </p>
              )}
            </div>

            {/* Cloud status badge */}
            {!isConfigured && (
              <div className="rounded-xl px-4 py-2 text-xs text-center"
                style={{ background: '#f59e0b11', border: '1px solid #f59e0b44', color: '#f59e0b' }}>
                ⚠️ Cloud sync not configured — progress saves locally only
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl px-4 py-2 text-xs text-center"
                style={{ background: '#ef444411', border: '1px solid #ef444455', color: '#ef4444' }}>
                {error}
              </div>
            )}

            {/* Action button */}
            <button
              onClick={isNew ? handleNewMission : handleContinue}
              disabled={loading || !name.trim() || pin.length < 4}
              className="w-full font-black text-lg py-3.5 rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: loading ? '#0d1117' : isNew
                  ? 'linear-gradient(135deg,#00d4ff,#0099bb)'
                  : 'linear-gradient(135deg,#a855f7,#7c3aed)',
                color: loading ? '#00d4ff' : '#050514',
                border: `1px solid ${isNew ? '#00d4ff' : '#a855f7'}`,
                boxShadow: !loading && name.trim() && pin.length === 4
                  ? `0 0 24px ${isNew ? '#00d4ff66' : '#a855f766'}`
                  : 'none',
              }}
            >
              {loading
                ? '⏳ Connecting...'
                : isNew
                ? '🚀 LAUNCH MY MISSION!'
                : '▶️ CONTINUE MY MISSION!'}
            </button>
          </div>
        </div>

        {/* MISSION LOG */}
        <div
          className="rounded-3xl shadow-2xl overflow-hidden"
          style={{ background: '#0d1117', border: '1px solid #a855f733', boxShadow: '0 0 20px #a855f711, 0 4px 32px #00000088' }}
        >
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid #a855f733', background: '#050514' }}>
            <h2 className="text-sm font-black tracking-widest uppercase" style={{ color: '#a855f7', textShadow: '0 0 8px #a855f788' }}>
              🗺️ MISSION LOG — 10-LEVEL CAMPAIGN
            </h2>
            <span className="text-xs font-bold" style={{ color: '#ffd700' }}>
              ⭐ TOTAL: {LEVELS.reduce((s, l) => s + l.xpReward, 0)} FUEL
            </span>
          </div>
          <div>
            {LEVELS.map((level, idx) => {
              const mode = MODE_LABEL[level.mode];
              return (
                <div key={level.id} className="flex items-start gap-4 px-6 py-4 transition-all"
                  style={{ borderBottom: idx < LEVELS.length - 1 ? '1px solid #ffffff08' : 'none' }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                    style={{ background: '#050514', border: '1px solid #00d4ff33' }}>
                    <span className="text-xl leading-none">{level.emoji}</span>
                    <span className="text-[9px] font-black leading-none mt-0.5" style={{ color: '#00d4ff' }}>M{level.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-sm" style={{ color: '#e2e8f0' }}>{level.title}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ color: mode.color, border: `1px solid ${mode.border}`, background: mode.bg }}>
                        {mode.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs" style={{ color: '#64748b' }}>🪐 {level.topic}</span>
                      <span className="text-xs" style={{ color: '#64748b' }}>🏅 <span className="font-semibold" style={{ color: '#94a3b8' }}>{level.badge}</span></span>
                      <span className="text-xs font-bold" style={{ color: '#ffd700' }}>⭐ +{level.xpReward} FUEL</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs" style={{ color: '#64748b' }}>RANK</div>
                    <div className="text-xs font-bold" style={{ color: '#a855f7' }}>{level.rank}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-6 py-5" style={{ borderTop: '1px solid #ffffff11', background: '#050514' }}>
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: '#64748b' }}>🚀 RANK PROGRESSION</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RANKS.map(r => (
                <div key={r.name} className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: '#0d1117', border: '1px solid #ffffff11' }}>
                  <span className="text-xl">{r.emoji}</span>
                  <div>
                    <p className="text-xs font-black" style={{ color: '#e2e8f0' }}>{r.name}</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>{r.minXP}+ FUEL</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
