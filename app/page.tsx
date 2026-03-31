"use client";

import { useRef, useEffect, useState } from "react";
import { useGameState } from "./lib/useGameState";
import { styles } from "./game.styles";
import { getInitialShuffledPools } from "./lib/game-utils";

import EntryStep from "./components/EntryStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";

export default function FamilyAliasApp() {
  const { 
    mounted, userId, roomId, roomData, step, 
    userName, setUserName, userAge, setUserAge, 
    updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom 
  } = useGameState();

  const wordRef = useRef<HTMLDivElement>(null!);
  const skipRef = useRef<HTMLButtonElement>(null!);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const isDragging = useRef(false);
  const [isDraggingWord, setIsDraggingWord] = useState(false);

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  // ניהול טיימרים (ספירה לאחור וזמן משחק)
  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || !isIDescriber || step < 4) return;
    
    const interval = setInterval(() => {
      if (step === 4) { // מסך הכנה
        if (roomData.preGameTimer > 0) {
          updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        } else {
          updateRoom({ step: 5, timeLeft: 60, roundScore: 0 });
        }
      } else if (step === 5) { // מסך משחק פעיל
        if (roomData.timeLeft > 0) {
          updateRoom({ timeLeft: roomData.timeLeft - 1 });
        } else {
          // סיום זמן: שמירת הניקוד המצטבר ומעבר למסך תוצאות
          const entityName = roomData.gameMode === "individual" 
            ? currentP.name 
            : roomData.teamNames[currentP.teamIdx];
          
          const newTotalScores = { ...roomData.totalScores };
          newTotalScores[entityName] = (newTotalScores[entityName] || 0) + (roomData.roundScore || 0);
          
          updateRoom({ step: 6, totalScores: newTotalScores });
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [step, roomId, roomData?.preGameTimer, roomData?.timeLeft, roomData?.isPaused, isIDescriber]);

  if (!mounted) return null;

  // פונקציה להתחלת המשחק - מבצעת ערבוב ראשוני של כל המאגרים
  const handleStartGame = () => {
    updateRoom({ 
      step: 4, 
      preGameTimer: 3,
      shuffledPools: getInitialShuffledPools(), // מביא את כל המילים מהקבצים שלך ומערבב
      poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 }, // מאפס את המיקום בכל חפיסה
      roundScore: 0,
      totalScores: {}
    });
  };

  // בדיקת ניצחון (50 נקודות) ומעבר לתור הבא
  const checkVictoryAndMove = () => {
    const scores = roomData.totalScores || {};
    const WIN_SCORE = 50;
    
    let winnerName = "";
    if (roomData.gameMode === 'individual') {
      const winner = roomData.players.find((p: any) => (scores[p.name] || 0) >= WIN_SCORE);
      if (winner) winnerName = winner.name;
    } else {
      const winnerIdx = roomData.teamNames.findIndex((name: string) => (scores[name] || 0) >= WIN_SCORE);
      if (winnerIdx !== -1) winnerName = roomData.teamNames[winnerIdx];
    }

    if (winnerName) {
      updateRoom({ step: 7, winner: winnerName });
    } else {
      updateRoom({ 
        step: 4, 
        currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, 
        preGameTimer: 3 
      });
    }
  };

  const gameTargets = roomData?.gameMode === "individual" 
    ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) 
    : [roomData?.teamNames[currentP?.teamIdx]];

  return (
    <div style={styles.container} onPointerMove={(e) => {
      if (!isDragging.current || !isIDescriber) return;
      if (wordRef.current) {
        wordRef.current.style.position = 'fixed';
        wordRef.current.style.transform = `translate3d(${e.clientX - 75}px, ${e.clientY - 75}px, 0)`;
        const rect = wordRef.current.getBoundingClientRect();
        let h: string | null = null;
        
        if (skipRef.current?.getBoundingClientRect()) {
          const s = skipRef.current.getBoundingClientRect();
          if (!(s.left > rect.right || s.right < rect.left || s.top > rect.bottom || s.bottom < rect.top)) h = "SKIP";
        }
        
        Object.keys(targetsRef.current).forEach(t => {
          const r = targetsRef.current[t]?.getBoundingClientRect();
          if (r && !(r.left > rect.right || r.right < rect.left || r.top > rect.bottom || r.bottom < rect.top)) h = t;
        });
        setActiveHover(h);
      }
    }} onPointerUp={() => {
      if (isDragging.current && activeHover) {
        // לוגיקת קידום האינדקס כדי שלא תהיה כפילות מילים
        const age = parseInt(currentP.age) || 10;
        const isEasy = roomData.difficulty === "easy";
        let poolKey: "KIDS" | "JUNIOR" | "TEEN" | "ADULT" = "ADULT";
        
        if (isEasy) poolKey = "KIDS";
        else if (age <= 6) poolKey = "KIDS";
        else if (age <= 10) poolKey = "JUNIOR";
        else if (age <= 16) poolKey = "TEEN";

        const newIndices = { ...roomData.poolIndices };
        newIndices[poolKey] = (newIndices[poolKey] || 0) + 1;

        updateRoom({ 
          roundScore: (roomData.roundScore || 0) + (activeHover === "SKIP" ? -1 : 1),
          poolIndices: newIndices
        });
      }
      isDragging.current = false; setActiveHover(null); setIsDraggingWord(false);
      if (wordRef.current) { wordRef.current.style.position = 'relative'; wordRef.current.style.transform = 'none'; }
    }}>
      <div style={styles.safeAreaWrapper}>
        {/* שלב 1: כניסה */}
        {step === 1 && <EntryStep onNext={(n, a, action, code) => { 
          setUserName(n); setUserAge(a); 
          if (action === 'create') handleCreateRoom(); 
          else if (action === 'join' && code) handleJoinRoom(code); 
        }} />}
        
        {/* שלב 3: הגדרות (קבוצות/שמות) */}
        {step === 3 && roomData && (
          <SetupStep 
            roomId={roomId!} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} 
            difficulty={roomData.difficulty || "age-appropriate"} setDifficulty={(d) => updateRoom({ difficulty: d })}
            numTeams={roomData.numTeams} setNumTeams={(n) => updateRoom({ numTeams: n })}
            players={roomData.players} teamNames={roomData.teamNames}
            updateTeamNames={(names) => updateRoom({ teamNames: names })}
            onPlayerMove={(pId, tIdx) => { 
              const p = roomData.players.map((pl:any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl);
              updateRoom({ players: p }); 
            }} 
            editTeamName={(idx: number) => { 
              const n = prompt("שם קבוצה:", roomData.teamNames[idx]); 
              if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } 
            }} 
            onStart={handleStartGame} onExit={handleFullReset} 
          />
        )}

        {/* שלב 4: ספירה לאחור לפני תור */}
        {step === 4 && roomData && (
          <CountdownStep 
            timer={roomData.preGameTimer} 
            turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} 
            isTeamMode={roomData.gameMode === "team"} 
          />
        )}
        
        {/* שלב 5: המסך המשחק הפעיל (Drag & Drop) */}
        {step === 5 && roomData && (
          <GameStep 
            roomData={roomData} userId={userId!} wordRef={wordRef} skipRef={skipRef} 
            isDraggingWord={isDraggingWord} onPointerDown={() => { isDragging.current = true; setIsDraggingWord(true); }}
            targets={gameTargets} targetsRef={targetsRef as any} activeHover={activeHover}
            updateRoom={updateRoom}
          />
        )}

        {/* שלב 6: סיכום סיבוב וניקוד מצטבר */}
        {step === 6 && roomData && (
          <ScoreStep 
            scores={roomData.totalScores} 
            entities={roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} 
            onNextRound={checkVictoryAndMove} 
          />
        )}

        {/* שלב 7: מסך ניצחון */}
        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
      </div>
    </div>
  );
}