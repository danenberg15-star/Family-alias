// app/page.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useGameState } from "./lib/useGameState";
import { styles } from "./game.styles";
import { getShuffledWords } from "./lib/game-utils";

import EntryStep from "./components/EntryStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import GuesserView from "./components/GuesserView";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";

export default function FamilyAliasApp() {
  const { 
    mounted, userId, roomId, roomData, step, setStep, 
    userName, setUserName, userAge, setUserAge, 
    updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom 
  } = useGameState();

  // Refs לניהול הגרירה והמשחק - תואם ל-GameStep
  const wordRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const teamsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const isDragging = useRef(false);
  const [isDraggingWord, setIsDraggingWord] = useState(false);

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  // פונקציית עזר לקביעת קטגוריית מילים לפי גיל
  const getCategory = () => {
    if (roomData?.difficulty === "easy") return "JUNIOR";
    const age = parseInt(currentP?.age || "20");
    if (age <= 6) return "KIDS";
    if (age <= 10) return "JUNIOR";
    return "ADULT";
  };

  // לוגיקת טיימר מרכזית - מנהלת את המעברים בין השלבים
  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || !isIDescriber || step < 4) return;

    const interval = setInterval(() => {
      if (step === 4) { // ספירה לאחור לפני תחילת תור
        if (roomData.preGameTimer > 0) {
          updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        } else {
          updateRoom({ 
            step: 5, 
            timeLeft: 60, 
            shuffledWords: getShuffledWords(getCategory()),
            currentWordIdx: 0,
            roundScore: 0 
          });
        }
      } else if (step === 5) { // זמן משחק פעיל
        if (roomData.timeLeft > 0) {
          updateRoom({ timeLeft: roomData.timeLeft - 1 });
        } else {
          updateRoom({ step: 6 }); // מעבר לסיכום סבב
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, roomId, roomData?.preGameTimer, roomData?.timeLeft, roomData?.isPaused, isIDescriber]);

  const handleGuess = async (target: string) => {
    if (!roomData) return;
    const isSkip = target === "SKIP";
    const change = isSkip ? -1 : 1;
    const updates: any = { roundScore: (roomData.roundScore || 0) + change, currentWordIdx: roomData.currentWordIdx + 1 };
    
    if (!isSkip) {
      const entity = roomData.gameMode === 'individual' ? target : roomData.teamNames[currentP.teamIdx];
      updates[`totalScores.${entity}`] = (roomData.totalScores[entity] || 0) + 1;
    }
    await updateRoom(updates);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !isIDescriber || roomData?.isPaused) return;
    if (wordRef.current) {
      wordRef.current.style.position = 'fixed';
      wordRef.current.style.width = '150px';
      wordRef.current.style.height = '150px';
      wordRef.current.style.transform = `translate3d(${e.clientX - 75}px, ${e.clientY - 75}px, 0)`;
      
      const rect = wordRef.current.getBoundingClientRect();
      let h: string | null = null;
      
      if (skipRef.current) {
        const s = skipRef.current.getBoundingClientRect();
        if (!(s.left > rect.right || s.right < rect.left || s.top > rect.bottom || s.bottom < rect.top)) h = "SKIP";
      }

      Object.keys(targetsRef.current).forEach(t => {
        const r = targetsRef.current[t]?.getBoundingClientRect();
        if (r && !(r.left > rect.right || r.right < rect.left || r.top > rect.bottom || r.bottom < rect.top)) h = t;
      });
      setActiveHover(h);
    }
  };

  if (!mounted) return null;

  const gameTargets = roomData?.gameMode === "individual" 
    ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) 
    : [roomData?.teamNames[currentP?.teamIdx]];

  return (
    <div 
      style={styles.container} 
      onPointerMove={handlePointerMove} 
      onPointerUp={() => {
        if (isDragging.current && activeHover) handleGuess(activeHover);
        isDragging.current = false; setActiveHover(null); setIsDraggingWord(false);
        if (wordRef.current) { 
          wordRef.current.style.position = 'relative'; 
          wordRef.current.style.transform = 'none'; 
          wordRef.current.style.width = '100%'; 
          wordRef.current.style.height = '100%'; 
        }
      }}
    >
      <div style={styles.safeAreaWrapper}>
        {step > 1 && <button onClick={handleFullReset} style={styles.exitBtn}>✕</button>}
        
        {/* שלב 1: כניסה מאוחדת (שם + חדר) */}
        {step === 1 && (
          <EntryStep 
            onNext={(n, a, action, code) => { 
              setUserName(n); setUserAge(a); 
              localStorage.setItem("alias_userName", n); localStorage.setItem("alias_userAge", a); 
              if (action === 'create') handleCreateRoom(); 
              else if (action === 'join' && code) handleJoinRoom(code); 
            }} 
          />
        )}

        {/* שלב 3: אפיון חדר וחלוקה לקבוצות */}
        {step === 3 && roomData && (
          <SetupStep 
            roomId={roomId!} 
            gameMode={roomData.gameMode} 
            setGameMode={(m) => updateRoom({ gameMode: m })} 
            difficulty={roomData.difficulty || "age-appropriate"} 
            setDifficulty={(d) => updateRoom({ difficulty: d })}
            numTeams={roomData.numTeams} 
            setNumTeams={(n) => updateRoom({ numTeams: n })}
            players={roomData.players} 
            teamNames={roomData.teamNames}
            onPlayerMove={(pId, tIdx) => {
              const p = roomData.players.map((pl:any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl);
              updateRoom({ players: p });
            }} 
            onStart={() => updateRoom({ step: 4, preGameTimer: 3, roundScore: 0 })} 
          />
        )}
        
        {/* שלב 4: ספירה לאחור */}
        {step === 4 && roomData && (
          <CountdownStep 
            timer={roomData.preGameTimer} 
            turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} 
            isTeamMode={roomData.gameMode === "team"} 
          />
        )}
        
        {/* שלב 5: מסך תיאור האובייקט */}
        {step === 5 && roomData && (
          isIDescriber ? (
            <GameStep 
              timeLeft={roomData.timeLeft} 
              currentWord={roomData.shuffledWords[roomData.currentWordIdx % roomData.shuffledWords.length]} 
              wordRef={wordRef} skipRef={skipRef} isDraggingWord={isDraggingWord}
              onPointerDown={() => { isDragging.current = true; setIsDraggingWord(true); }} 
              isTextOnly={false} 
              targets={gameTargets} 
              targetsRef={targetsRef as any} 
              score={roomData.roundScore} 
              onPause={() => updateRoom({ isPaused: true })} 
              activeHover={activeHover} 
              onGuess={handleGuess}
            />
          ) : (
            <GuesserView 
              timeLeft={roomData.timeLeft} 
              describerName={currentP?.name} 
              describerTeam={roomData.teamNames[currentP?.teamIdx]} 
              isTeamMode={roomData.gameMode === 'team'} 
              totalScores={roomData.totalScores} 
              roundScore={roomData.roundScore} 
              entities={gameTargets} 
              onPause={() => updateRoom({ isPaused: true })} 
            />
          )
        )}

        {/* שלב 6: סיכום סבב */}
        {step === 6 && roomData && (
          <ScoreStep 
            scores={roomData.totalScores} 
            entities={gameTargets} 
            onNextRound={() => updateRoom({ 
              step: 4, 
              currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, 
              preGameTimer: 3,
              roundScore: 0
            })} 
          />
        )}

        {/* שלב 7: ניצחון */}
        {step === 7 && roomData && (
          <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />
        )}
      </div>

      {/* מסך השהיה (Pause) */}
      {roomData?.isPaused && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,8,28,0.98)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: 'white', marginBottom: '20px' }}>משחק מושהה ⏸️</h1>
          <button 
            onClick={() => updateRoom({ isPaused: false })} 
            style={{ padding: '15px 40px', borderRadius: '30px', backgroundColor: '#10b981', color: 'white', border: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            חזרה למשחק ▶️
          </button>
        </div>
      )}
    </div>
  );
}