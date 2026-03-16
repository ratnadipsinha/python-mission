import { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS, getRank } from './levels/levels';
import { runCode, initPyodide } from './engine/evaluator';
import { savePlayer } from './cloudSave';
import type { CloudSave } from './cloudSave';
import { isConfigured } from './supabase';
import Header from './components/Header';
import ProblemCard from './components/ProblemCard';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import RankUpModal from './components/RankUpModal';
import LevelMap from './components/LevelMap';
import BadgeShelf from './components/BadgeShelf';
import WinScreen from './components/WinScreen';
import WelcomeScreen from './components/WelcomeScreen';
import RefresherPanel from './components/RefresherPanel';
import './index.css';

const STORAGE_KEY = 'pyquest_save';
const PROFILE_KEY = 'pyquest_profile';

interface SaveData {
  xp: number;
  currentLevelId: number;
  completedLevels: number[];
  streak: number;
}

interface Profile {
  name: string;
  photo: string;
  pin: string;
}

function loadLocalSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { xp: 0, currentLevelId: 1, completedLevels: [], streak: 0 };
}

function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function persistLocal(data: SaveData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(loadProfile);
  const localSave = loadLocalSave();
  const [xp, setXp] = useState(localSave.xp);
  const [currentLevelId, setCurrentLevelId] = useState(localSave.currentLevelId);
  const [completedLevels, setCompletedLevels] = useState<number[]>(localSave.completedLevels);
  const [streak, setStreak] = useState(localSave.streak ?? 0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pyReady, setPyReady] = useState(false);
  const [rankUpRank, setRankUpRank] = useState<{ name: string; emoji: string } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [won, setWon] = useState(false);
  const prevRankRef = useRef(getRank(localSave.xp).name);
  const problemRef = useRef<HTMLDivElement>(null);

  const level = LEVELS.find(l => l.id === currentLevelId) ?? LEVELS[0];

  useEffect(() => {
    initPyodide().then(() => setPyReady(true)).catch(console.error);
  }, []);

  useEffect(() => {
    setCode('');
    setOutput('');
    setError(null);
    setIsCorrect(null);
    setAttempts(0);
    setXpGained(0);
  }, [currentLevelId]);

  // Auto-save to cloud whenever progress changes
  const cloudSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!profile || !isConfigured) return;
    const data: SaveData = { xp, currentLevelId, completedLevels, streak };
    persistLocal(data);
    // Debounce cloud saves by 2s to avoid excessive writes
    if (cloudSaveTimeoutRef.current) clearTimeout(cloudSaveTimeoutRef.current);
    cloudSaveTimeoutRef.current = setTimeout(() => {
      const save: CloudSave = { name: profile.name, xp, currentLevelId, completedLevels, streak };
      savePlayer(profile.name, profile.pin, save).catch(console.error);
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xp, currentLevelId, completedLevels, streak]);

  const handleRun = useCallback(async () => {
    if (!pyReady || loading) return;
    setLoading(true);

    const result = await runCode(code);
    setOutput(result.output);
    setError(result.error);

    const correct = !result.error && level.checkFn(result.output, code);
    setIsCorrect(correct);
    setAttempts(a => a + 1);

    if (correct && !completedLevels.includes(level.id)) {
      const streakBonus = streak >= 2 ? Math.round(level.xpReward * 0.5) : 0;
      const gained = level.xpReward + streakBonus;
      const newXp = xp + gained;
      const newCompleted = [...completedLevels, level.id];
      const newStreak = streak + 1;

      setXpGained(gained);
      setXp(newXp);
      setCompletedLevels(newCompleted);
      setStreak(newStreak);

      const newRank = getRank(newXp);
      if (newRank.name !== prevRankRef.current) {
        setRankUpRank(newRank);
        prevRankRef.current = newRank.name;
      }
    }

    setLoading(false);
  }, [pyReady, loading, code, level, completedLevels, xp, streak]);

  const handleNext = () => {
    if (level.id === 10) { setWon(true); return; }
    const nextId = level.id + 1;
    setCurrentLevelId(nextId);
    setTimeout(() => problemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_KEY);
    setXp(0); setCurrentLevelId(1); setCompletedLevels([]);
    setStreak(0); setWon(false); setProfile(null);
    prevRankRef.current = 'Seedling';
  };

  const handleWelcome = (name: string, photo: string, pin: string, cloudSave?: CloudSave) => {
    const p: Profile = { name, photo, pin };
    setProfile(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));

    if (cloudSave) {
      // Resume from cloud
      setXp(cloudSave.xp);
      setCurrentLevelId(cloudSave.currentLevelId);
      setCompletedLevels(cloudSave.completedLevels);
      setStreak(cloudSave.streak ?? 0);
      prevRankRef.current = getRank(cloudSave.xp).name;
      persistLocal({
        xp: cloudSave.xp,
        currentLevelId: cloudSave.currentLevelId,
        completedLevels: cloudSave.completedLevels,
        streak: cloudSave.streak ?? 0,
      });
    }
  };

  if (!profile) return <WelcomeScreen onStart={handleWelcome} />;
  if (won) return <WinScreen xp={xp} onReset={handleReset} />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        xp={xp}
        completedLevels={completedLevels}
        playerName={profile.name}
        playerPhoto={profile.photo}
        onShowMap={() => setShowMap(true)}
        onShowBadges={() => setShowBadges(true)}
        onNewPlayer={handleReset}
      />

      {!pyReady && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-700 text-sm text-center">
            ⏳ Loading Python engine... (first load may take 10-20 seconds)
          </div>
        </div>
      )}

      {isConfigured && (
        <div className="max-w-3xl mx-auto px-4 pt-2">
          <div className="rounded-xl px-3 py-1.5 text-xs text-center"
            style={{ background: '#22c55e11', border: '1px solid #22c55e33', color: '#22c55e' }}>
            ☁️ Cloud sync active — your progress saves automatically to all devices
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div ref={problemRef} />
            <ProblemCard
              level={level.id}
              total={LEVELS.length}
              title={level.title}
              topic={level.topic}
              emoji={level.emoji}
              mode={level.mode}
              instruction={level.instruction}
            />
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRun}
              loading={loading || !pyReady}
              placeholder={`# Write your code here, ${profile.name}!`}
            />
            <OutputPanel
              output={output}
              error={error}
              isCorrect={isCorrect}
              attempts={attempts}
              hint={level.hint}
              onNext={handleNext}
              isLastLevel={level.id === 10}
              xpGained={xpGained}
            />
          </div>

          <div className="w-72 flex-shrink-0 sticky top-4">
            <RefresherPanel
              key={level.id}
              topic={level.topic}
              emoji={level.emoji}
              sections={level.refresher}
              youtubeUrl={level.youtubeUrl}
            />
          </div>
        </div>
      </div>

      {rankUpRank && <RankUpModal rank={rankUpRank} onClose={() => setRankUpRank(null)} />}
      {showMap && (
        <LevelMap
          currentLevel={currentLevelId}
          completedLevels={completedLevels}
          onSelect={id => setCurrentLevelId(id)}
          onClose={() => setShowMap(false)}
        />
      )}
      {showBadges && (
        <BadgeShelf completedLevels={completedLevels} onClose={() => setShowBadges(false)} />
      )}
    </div>
  );
}
