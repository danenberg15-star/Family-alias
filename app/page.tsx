"use client";

import { useRef, useEffect, useState } from "react";
import { useGameState } from "./lib/useGameState";
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
    updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom,
    setUserName, setUserAge, userName, userAge
  } = useGameState();

  const wordRef = useRef<HTMLDivElement>(null!);
  const skipRef = useRef<HTMLButtonElement>(null!);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // רפרנסים לשיפור ביצועי גרירה - מונעים רינדור מיותר
  const targetRects = useRef<{ name: string, rect: DOMRect }[]>([]);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isDraggingWord, setIsDraggingWord] = useState(false);

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || step < 4) return;
    const isBot = currentP?.id?.startsWith('d_');
    const isHost = roomData.players[0].id === userId;
    if (!isIDescriber && !(isBot && isHost)) return;

    const interval = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 60, roundScore: 0 });
      } else if (step === 5) {
        if (roomData.timeLeft > 0) updateRoom({ timeLeft: roomData.timeLeft - 1 });
        else updateRoom({ step: 6 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, roomId, roomData?.preGameTimer, roomData?.timeLeft, roomData?.isPaused, isIDescriber, currentP]);

  if (!mounted) return null;

  const handleScoreAction = (targetName: string) => {
    if (roomData.isPaused) return;
    const age = parseInt(currentP.age) || 10;
    const poolKey = (roomData.difficulty === "easy" || age <= 6) ? "KIDS" : (age <= 10) ? "JUNIOR" : (age <= 16) ? "TEEN" : "ADULT";
    const newIndices = { ...roomData.poolIndices };
    newIndices[poolKey] = (newIndices[poolKey] || 0) + 1;
    const newScores = { ...roomData.totalScores };

    if (targetName === "SKIP") {
      updateRoom({ roundScore: (roomData.roundScore || 0) - 1, poolIndices: newIndices });
    } else {
      newScores[targetName] = (newScores[targetName] || 0) + 1;
      if (roomData.gameMode === "individual") newScores[currentP.name] = (newScores[currentP.name] || 0) + 1;
      updateRoom({ roundScore: (roomData.roundScore || 0) + 1, poolIndices: newIndices, totalScores: newScores });
    }
  };

  const gameTargets = roomData?.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData?.teamNames[currentP?.teamIdx]];

  return (
    <div 
      style={{ backgroundColor: '#05081c', minHeight: '100dvh', color: 'white', direction: 'rtl', touchAction: 'none' }}
      onPointerMove={(e) => {
        if (step !== 5 || !isDragging.current || !isIDescriber || roomData.isPaused) return;
        
        if (wordRef.current) {
          // הזזה ישירה ב-DOM לביצועים חלקים
          const x = e.clientX - dragOffset.current.x;
          const y = e.clientY - dragOffset.current.y;
          wordRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

          // בדיקת התנגשות מתמטית מול הערכים ששמרנו ב-targetRects
          let foundHover: string | null = null;
          for (const target of targetRects.current) {
            if (e.clientX >= target.rect.left && e.clientX <= target.rect.right &&
                e.clientY >= target.rect.top && e.clientY <= target.rect.bottom) {
              foundHover = target.name;
              break;
            }
          }
          
          if (foundHover !== activeHover) {
            setActiveHover(foundHover);
          }
        }
      }} 
      onPointerUp={() => {
        if (step !== 5) return;
        if (isDragging.current && activeHover) handleScoreAction(activeHover);
        
        isDragging.current = false; 
        setActiveHover(null); 
        setIsDraggingWord(false);
        targetRects.current = [];
        
        if (wordRef.current) { 
          wordRef.current.style.position = 'relative'; 
          wordRef.current.style.transform = 'none'; 
        }
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {step === 1 && <EntryStep onNext={(n, a, action, code) => { setUserName(n); setUserAge(a); if (action === 'create') handleCreateRoom(); else if (action === 'join' && code) handleJoinRoom(code); }} />}
        
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
            onStart={() => updateRoom({ step: 4, preGameTimer: 3, shuffledPools: getInitialShuffledPools(), poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 }, roundScore: 0 })} 
            onExit={handleFullReset} 
          />
        )}

        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
        
        {step === 5 && roomData && (
          <GameStep 
            roomData={roomData} userId={userId!} wordRef={wordRef} skipRef={skipRef} 
            isDraggingWord={isDraggingWord} 
            onPointerDown={(e: React.PointerEvent) => { 
              isDragging.current = true; 
              setIsDraggingWord(true); 
              
              // חישוב אופסט כדי שהכרטיס לא יקפוץ למרכז האצבע
              const rect = wordRef.current.getBoundingClientRect();
              dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              };
              
              wordRef.current.style.position = 'fixed';
              wordRef.current.style.width = `${rect.width}px`;
              wordRef.current.style.height = `${rect.height}px`;

              // שמירת מיקומי היעדים פעם אחת בלבד בתחילת הגרירה
              const rects: { name: string, rect: DOMRect }[] = [];
              if (skipRef.current) rects.push({ name: "SKIP", rect: skipRef.current.getBoundingClientRect() });
              Object.keys(targetsRef.current).forEach(t => {
                const r = targetsRef.current[t]?.getBoundingClientRect();
                if (r) rects.push({ name: t, rect: r });
              });
              targetRects.current = rects;
            }}
            targets={gameTargets} targetsRef={targetsRef as any} activeHover={activeHover}
            updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} 
          />
        )}

        {step === 6 && roomData && (
          <ScoreStep 
            scores={roomData.totalScores} 
            entities={roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} 
            onNextRound={() => {
              const WIN = 50; const sc = roomData.totalScores;
              const winner = roomData.gameMode === 'individual' ? roomData.players.find((p:any) => (sc[p.name]||0) >= WIN) : roomData.teamNames.find((n:any) => (sc[n]||0) >= WIN);
              if (winner) updateRoom({ step: 7, winner: roomData.gameMode === 'individual' ? winner.name : winner });
              else updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, preGameTimer: 3 });
            }} 
          />
        )}

        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
      </div>
    </div>
  );
}