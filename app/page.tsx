"use client";

import { useState, useEffect, useRef } from "react";
import EntryStep from "./components/EntryStep";
import LobbyStep from "./components/LobbyStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import { styles } from "./game.styles";
import { WORD_DATABASE, CategoryType } from "./game.config";

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gameMode, setGameMode] = useState<"individual" | "team">("individual");
  const [numTeams, setNumTeams] = useState(2);
  const [players, setPlayers] = useState<string[]>([]);
  const [teamNames, setTeamNames] = useState(["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"]);
  const [playerTeamMap, setPlayerTeamMap] = useState<{[key: string]: number}>({});
  const [preGameTimer, setPreGameTimer] = useState(5);
  const [turnInfo, setTurnInfo] = useState({ name: "", team: "" });
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isDraggingWord, setIsDraggingWord] = useState(false);
  const [draggingPlayer, setDraggingPlayer] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("KIDS");

  const wordRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef<HTMLDivElement | null>(null);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const teamsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const dragPlayerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && preGameTimer > 0) timer = setInterval(() => setPreGameTimer(p => p - 1), 1000);
    else if (step === 4 && preGameTimer === 0) setStep(5);
    else if (step === 5 && timeLeft > 0 && !isPaused) timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [step, preGameTimer, timeLeft, isPaused]);

  if (!mounted) return null;

  const handleEntryComplete = (uName: string, uAge: string) => {
    setName(uName); setAge(uAge);
    const mock = [uName || "אני", "אבא", "אמא", "יעל", "סבא", "סבתא", "רוני", "דן"];
    setPlayers(mock);
    const map: any = {}; mock.forEach((p, i) => map[p] = (i % numTeams));
    setPlayerTeamMap(map); setStep(2);
  };

  const startPreGame = () => {
    const cat: CategoryType = parseInt(age) <= 6 ? "KIDS" : parseInt(age) <= 10 ? "JUNIOR" : parseInt(age) <= 16 ? "TEEN" : "ADULT";
    setSelectedCategory(cat);
    setGameWords([...WORD_DATABASE[cat]].sort(() => Math.random() - 0.5));
    const randomP = players[Math.floor(Math.random() * players.length)];
    setTurnInfo({ name: randomP, team: teamNames[playerTeamMap[randomP]] });
    setPreGameTimer(5); setStep(4);
  };

  const isIntersecting = (r1: DOMRect, r2: DOMRect) => {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    if (draggingPlayer && dragPlayerRef.current) {
      dragPlayerRef.current.style.left = `${e.clientX - 50}px`;
      dragPlayerRef.current.style.top = `${e.clientY - 20}px`;
      let h: string | null = null;
      for (let i = 0; i < numTeams; i++) {
        const el = teamsRef.current[i];
        if (el && e.clientX >= el.getBoundingClientRect().left && e.clientX <= el.getBoundingClientRect().right && e.clientY >= el.getBoundingClientRect().top && e.clientY <= el.getBoundingClientRect().bottom) h = `TEAM_${i}`;
      }
      setActiveHover(h);
    } else if (wordRef.current) {
      wordRef.current.style.left = `${e.clientX - 110}px`; 
      wordRef.current.style.top = `${e.clientY - 90}px`;
      
      const wordRect = wordRef.current.getBoundingClientRect();
      let h: string | null = null;

      // בדיקת התנגשות עם דלג
      if (skipRef.current) {
        if (isIntersecting(wordRect, skipRef.current.getBoundingClientRect())) h = "SKIP";
      }

      // בדיקת התנגשות עם שחקנים/קבוצות
      const tgts = gameMode === "individual" ? players : [turnInfo.team];
      tgts.forEach(t => { 
        const el = targetsRef.current[t]; 
        if (el && isIntersecting(wordRect, el.getBoundingClientRect())) h = t;
      });
      setActiveHover(h);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (draggingPlayer) {
      if (activeHover?.startsWith("TEAM_")) setPlayerTeamMap(prev => ({ ...prev, [draggingPlayer]: parseInt(activeHover.split("_")[1]) }));
      setDraggingPlayer(null);
    } else if (activeHover) {
      setScore(prev => activeHover === "SKIP" ? prev - 1 : prev + 1);
      setCurrentWordIndex(prev => prev + 1);
      setIsDraggingWord(false);
      if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
    } else {
      setIsDraggingWord(false);
      if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
    }
    setActiveHover(null);
  };

  return (
    <div style={styles.container} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div style={styles.safeAreaWrapper}>
        {step === 1 && <EntryStep onNext={handleEntryComplete} />}
        {step === 2 && <LobbyStep onCreateRoom={() => setStep(3)} onJoinRoom={() => setStep(3)} />}
        {step === 3 && <SetupStep gameMode={gameMode} setGameMode={setGameMode} numTeams={numTeams} setNumTeams={setNumTeams} teamNames={teamNames} editTeamName={(idx) => { const n = prompt("שם חדש:", teamNames[idx]); if(n) { const nms = [...teamNames]; nms[idx] = n; setTeamNames(nms); } }} players={players} playerTeamMap={playerTeamMap} onPlayerPointerDown={(e, p) => { setDraggingPlayer(p); isDragging.current = true; if(dragPlayerRef.current) { dragPlayerRef.current.style.position = 'fixed'; dragPlayerRef.current.style.left = `${e.clientX-50}px`; dragPlayerRef.current.style.top = `${e.clientY-20}px`; } }} activeHover={activeHover} teamsRef={teamsRef} onStart={startPreGame} />}
        {step === 4 && <CountdownStep timer={preGameTimer} turnInfo={turnInfo} isTeamMode={gameMode === "team"} />}
        {step === 5 && (
          <GameStep 
            timeLeft={timeLeft} currentWord={gameWords[currentWordIndex]} wordRef={wordRef} skipRef={skipRef}
            onPointerDown={(e) => { isDragging.current = true; setIsDraggingWord(true); if(wordRef.current) { wordRef.current.style.position = 'fixed'; wordRef.current.style.left = `${e.clientX-110}px`; wordRef.current.style.top = `${e.clientY-90}px`; } }} 
            isTextOnly={selectedCategory === "TEEN" || selectedCategory === "ADULT"} isDraggingWord={isDraggingWord} 
            targets={gameMode === "individual" ? players : [turnInfo.team]} targetsRef={targetsRef} 
            onGuess={(skip) => { setScore(s => skip ? s - 1 : s + 1); setCurrentWordIndex(i => i + 1); }} 
            score={score} onPause={() => setIsPaused(true)} isPaused={isPaused} onUnpause={() => setIsPaused(false)} activeHover={activeHover} 
          />
        )}
        {draggingPlayer && <div ref={dragPlayerRef} style={{...styles.playerTag, pointerEvents:'none', width:'100px'}}>{draggingPlayer}</div>}
      </div>
    </div>
  );
}