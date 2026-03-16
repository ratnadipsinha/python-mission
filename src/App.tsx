import { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS, getRank } from './levels/levels';
import { runCode, initPyodide } from './engine/evaluator';
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
}

interface Profile {
  name: string;
  photo: string;
}

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { xp: 0, currentLevelId: 1, completedLevels: [] };
}

function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function persistSave(data: SaveData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(loadProfile);
  const save = loadSave();
  const [xp, setXp] = useState(save.xp);
  const [currentLevelId, setCurrentLevelId] = useState(save.currentLevelId);
  const [completedLevels, setCompletedLevels] = useState<number[]>(save.completedLevels);
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
  const [streak, setStreak] = useState(0);
  const prevRankRef = useRef(getRank(save.xp).name);

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

      persistSave({ xp: newXp, currentLevelId, completedLevels: newCompleted });
    }

    setLoading(false);
  }, [pyReady, loading, code, level, completedLevels, xp, streak, currentLevelId]);

  const handleNext = () => {
    if (level.id === 10) { setWon(true); return; }
    const nextId = level.id + 1;
    setCurrentLevelId(nextId);
    persistSave({ xp, currentLevelId: nextId, completedLevels });
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_KEY);
    setXp(0); setCurrentLevelId(1); setCompletedLevels([]);
    setStreak(0); setWon(false); setProfile(null);
    prevRankRef.current = 'Seedling';
  };

  const handleWelcome = (name: string, photo: string) => {
    const p = { name, photo };
    setProfile(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  };

  // Show welcome screen if no profile yet
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-5 items-start">

          {/* Left column — problem + editor + output */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
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

          {/* Right column — course refresher */}
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

      {rankUpRank && (
        <RankUpModal rank={rankUpRank} onClose={() => setRankUpRank(null)} />
      )}
      {showMap && (
        <LevelMap
          currentLevel={currentLevelId}
          completedLevels={completedLevels}
          onSelect={id => {
            setCurrentLevelId(id);
            persistSave({ xp, currentLevelId: id, completedLevels });
          }}
          onClose={() => setShowMap(false)}
        />
      )}
      {showBadges && (
        <BadgeShelf completedLevels={completedLevels} onClose={() => setShowBadges(false)} />
      )}
    </div>
  );
}
