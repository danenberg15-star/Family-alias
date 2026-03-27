"use client";

import { useState, useEffect, useRef } from "react";
import Logo from "./components/Logo";
import WordCard from "./components/WordCard"; 
import EntryStep from "./components/EntryStep";
import LobbyStep from "./components/LobbyStep";
import SetupStep from "./components/SetupStep";
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("KIDS");

  const wordRef = useRef<HTMLDivElement | null>(null);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const teamsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const dragPlayerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const [draggingPlayer, setDraggingPlayer] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && preGameTimer > 0) {
      timer = setInterval(() => setPreGameTimer(p => p - 1), 1000);
    } else if (step === 4 && preGameTimer === 0) {
      setStep(5);
    } else if (step === 5 && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, preGameTimer, timeLeft, isPaused]);

  if (!mounted) return null;

  const handleEntryComplete = (userName: string, userAge: string) => {
    setName(userName);
    setAge(userAge);
    const mock = [userName || "אני", "אבא", "אמא", "יעל", "סבא", "סבתא", "רוני", "דן"];
    setPlayers(mock);
    const map: any = {};
    mock.forEach((p, i) => map[p] = (i % numTeams));
    setPlayerTeamMap(map);
    setStep(2);
  };

  const handlePlayerPointerDown = (e: React.PointerEvent, pName: string) => {
    e.preventDefault();
    setTimeout(() => {
      setDraggingPlayer(pName);
      isDragging.current = true;
      if (dragPlayerRef.current) {
        dragPlayerRef.current.style.position = 'fixed';
        dragPlayerRef.current.style.zIndex = '2000';
        dragPlayerRef.current.style.left = `${e.clientX - 50}px`;
        dragPlayerRef.current.style.top = `${e.clientY - 20}px`;
      }
    }, 10);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPaused || !gameWords[currentWordIndex]) return;
    isDragging.current = true;
    setIsDraggingWord(true);
    if (wordRef.current) { 
      wordRef.current.style.position = 'fixed'; 
      wordRef.current.style.zIndex = '1000';
      wordRef.current.style.left = `${e.clientX - 110}px`; 
      wordRef.current.style.top = `${e.clientY - 90}px`; 
    }
  };

  const startPreGame = () => {
    const ageNum = parseInt(age);
    const cat: CategoryType = ageNum <= 6 ? "KIDS" : ageNum <= 10 ? "JUNIOR" : ageNum <= 16 ? "TEEN" : "ADULT";
    setSelectedCategory(cat);
    setGameWords([...WORD_DATABASE[cat]].sort(() => Math.random() - 0.5));
    const randomP = players[Math.floor(Math.random() * players.length)];
    setTurnInfo({ name: randomP, team: teamNames[playerTeamMap[randomP]] });
    setPreGameTimer(5);
    setStep(4);
  };

  const editTeamName = (idx: number) => {
    const n = prompt("שם קבוצה חדש:", teamNames[idx]);
    if (n) {
      const newNames = [...teamNames];
      newNames[idx] = n;
      setTeamNames(newNames);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    
    if (draggingPlayer && dragPlayerRef.current) {
      dragPlayerRef.current.style.left = `${e.clientX - 50}px`;
      dragPlayerRef.current.style.top = `${e.clientY - 20}px`;
      let h: string | null = null;
      for (let i = 0; i < numTeams; i++) {
        const el = teamsRef.current[i];
        if (el) {
          const r = el.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) h = `TEAM_${i}`;
        }
      }
      setActiveHover(h);
      return;
    }

    if (wordRef.current) { 
      wordRef.current.style.left = `${e.clientX - 110}px`; 
      wordRef.current.style.top = `${e.clientY - 90}px`; 
    }
    let hovered: string | null = null;
    if (e.clientY < 80) hovered = "SKIP";
    const targets = gameMode === "individual" ? players : [turnInfo.team];
    targets.forEach((t) => {
      const el = targetsRef.current[t];
      if (el) {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hovered = t;
      }
    });
    setActiveHover(hovered);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (draggingPlayer) {
      if (activeHover?.startsWith("TEAM_")) {
        const teamIdx = parseInt(activeHover.split("_")[1]);
        setPlayerTeamMap(prev => ({ ...prev, [draggingPlayer]: teamIdx }));
      }
      setDraggingPlayer(null);
      setActiveHover(null);
      return;
    }

    if (activeHover === "SKIP") {
      setScore(prev => prev - 1);
      setCurrentWordIndex(prev => prev + 1);
    } else if (activeHover) {
      setScore(prev => prev + 1);
      setCurrentWordIndex(prev => prev + 1);
    }
    
    setIsDraggingWord(false);
    setActiveHover(null);
    if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
  };

  const isTextOnly = selectedCategory === "TEEN" || selectedCategory === "ADULT";

  return (
    <div style={styles.container} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div style={styles.safeAreaWrapper}>
        {step === 1 && <EntryStep onNext={handleEntryComplete} />}
        {step === 2 && <LobbyStep onCreateRoom={() => setStep(3)} onJoinRoom={() => setStep(3)} />}
        
        {step === 3 && (
          <SetupStep 
            gameMode={gameMode} setGameMode={setGameMode}
            numTeams={numTeams} setNumTeams={setNumTeams}
            teamNames={teamNames} editTeamName={editTeamName}
            players={players} playerTeamMap={playerTeamMap}
            onPlayerPointerDown={handlePlayerPointerDown}
            activeHover={activeHover} teamsRef={teamsRef}
            onStart={startPreGame}
          />
        )}

        {draggingPlayer && <div ref={dragPlayerRef} style={{...styles.playerTag, pointerEvents:'none', width:'100px'}}>{draggingPlayer}</div>}

        {step === 4 && (
          <div style={styles.flexLayout}>
            <div style={styles.turnInfo}>תור השחקן <b>{turnInfo.name}</b> {gameMode === "team" && `מ${turnInfo.team}`}</div>
            <div style={styles.hugeTimer}>{preGameTimer}</div>
            <div style={styles.loadingText}>טוען תמונות...</div>
          </div>
        )}

        {step === 5 && (
          <div style={styles.gameLayout}>
            <div style={{...styles.timerDisplay, color: timeLeft <= 15 ? '#ef4444' : 'white'}}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
            <div style={styles.topGroup}>
              <div style={{...styles.skipButton, backgroundColor: activeHover === "SKIP" ? '#ef4444' : 'transparent', borderColor: '#ef4444'}}>🚫 דלג</div>
              <div style={styles.wordCardArea}>
                {gameWords[currentWordIndex] && <WordCard word={gameWords[currentWordIndex].word} en={gameWords[currentWordIndex].en} img={gameWords[currentWordIndex].img} wordRef={wordRef} onPointerDown={handlePointerDown} isTextOnly={isTextOnly} />}
                {isDraggingWord && <div style={{...styles.wordCardPlaceholder, height: '223px'}}></div>}
              </div>
              <div style={styles.guessersBox}>
                {(gameMode === "individual" ? players : [turnInfo.team]).map(target => (
                  <div key={target} ref={(el) => { targetsRef.current[target] = el; }} onPointerDown={(e) => { e.stopPropagation(); }}
                    style={{...styles.guesserButton, backgroundColor: activeHover === target ? '#10b981' : 'rgba(255,255,255,0.03)', borderColor: activeHover === target ? '#10b981' : 'rgba(255,255,255,0.1)'}}>
                    <div style={styles.miniAvatar}>{target[0]}</div>
                    <span style={{ color: 'white' }}>{target}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.gameFooter}>
              <div style={styles.bottomScore}>🏆 {score}</div>
              <button onClick={() => setIsPaused(true)} style={styles.modernPauseBtn}>⏸️</button>
            </div>
            {isPaused && <div style={styles.pauseOverlay}><button onClick={() => setIsPaused(false)} style={styles.hugePlayBtn}>▶️</button></div>}
          </div>
        )}
      </div>
    </div>
  );
}