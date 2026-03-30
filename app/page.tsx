// app/page.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useGameState } from "./lib/useGameState";
import { styles } from "./game.styles";
import { getShuffledWords } from "./lib/game-utils";

import EntryStep from "./components/EntryStep";
import LobbyStep from "./components/LobbyStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import GuesserView from "./components/GuesserView";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";

export default function FamilyAliasApp() {
  const { mounted, userId, roomId, roomData, step, setStep, userName, setUserName, userAge, setUserAge, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom } = useGameState();
  const teamsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const wordRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const isDragging = useRef(false);
  const [isDraggingWord, setIsDraggingWord] = useState(false);

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  const handleGuess = async (target: string) => {
    if (!roomData) return;
    const isSkip = target === "SKIP";
    const change = isSkip ? -1 : 1;
    const updates: any = { 
      roundScore: (roomData.roundScore || 0) + change, 
      currentWordIdx: roomData.currentWordIdx + 1 
    };
    
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
      wordRef.current.style.left = `${e.clientX - 100}px`; 
      wordRef.current.style.top = `${e.clientY - 100}px`;
      wordRef.current.style.width = '200px';
      wordRef.current.style.height = '200px';

      const wordRect = wordRef.current.getBoundingClientRect();
      let h: string | null = null;
      
      if (skipRef.current) {
        const sRect = skipRef.current.getBoundingClientRect();
        if (!(sRect.left > wordRect.right || sRect.right < wordRect.left || sRect.top > wordRect.bottom || sRect.bottom < wordRect.top)) h = "SKIP";
      }

      const tgts = roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]];
      tgts.forEach((t:string) => { 
        const el = targetsRef.current[t]; 
        if (el) {
          const r = el.getBoundingClientRect();
          if (!(r.left > wordRect.right || r.right < wordRect.left || r.top > wordRect.bottom || r.bottom < wordRect.top)) h = t;
        }
      });
      setActiveHover(h);
    }
  };

  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || step < 4 || !isIDescriber) return;
    const timer = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 60, shuffledWords: getShuffledWords("ADULT") });
      } else if (step === 5) {
        if (roomData.timeLeft > 0) updateRoom({ timeLeft: roomData.timeLeft - 1 });
        else updateRoom({ step: 6 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [step, roomId, roomData, isIDescriber]);

  if (!mounted) return null;

  return (
    <div style={styles.container} onPointerMove={handlePointerMove} onPointerUp={() => {
      if (isDragging.current && activeHover) handleGuess(activeHover);
      isDragging.current = false; setActiveHover(null); setIsDraggingWord(false);
      if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto', width: '100%', height: '100%' });
    }}>
      <div style={styles.safeAreaWrapper}>
        {step > 1 && <button onClick={handleFullReset} style={styles.exitBtn}>✕</button>}
        
        {step === 1 && <EntryStep onNext={(n, a) => { setUserName(n); setUserAge(a); localStorage.setItem("alias_userName", n); localStorage.setItem("alias_userAge", a); setStep(2); }} />}
        {step === 2 && <LobbyStep onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />}
        {step === 3 && roomData && (
          <SetupStep 
            roomId={roomId!} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} 
            difficulty={roomData.difficulty || "age-appropriate"} setDifficulty={(d) => updateRoom({ difficulty: d })}
            numTeams={roomData.numTeams} setNumTeams={(n) => updateRoom({ numTeams: n })}
            teamNames={roomData.teamNames} editTeamName={(idx) => {
              const n = prompt("שם קבוצה:", roomData.teamNames[idx]);
              if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); }
            }} 
            players={roomData.players} onPlayerMove={(pId, tIdx) => {
              const p = roomData.players.map((pl:any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl);
              updateRoom({ players: p });
            }} 
            activeHover={null} teamsRef={teamsRef as any} 
            onStart={() => updateRoom({ step: 4, preGameTimer: 3 })} 
          />
        )}
        
        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
        
        {step === 5 && roomData && (
          <>
            {isIDescriber ? (
              <GameStep 
                timeLeft={roomData.timeLeft} currentWord={roomData.shuffledWords[roomData.currentWordIdx % roomData.shuffledWords.length]} 
                wordRef={wordRef as any} skipRef={skipRef as any} isDraggingWord={isDraggingWord}
                onPointerDown={(e) => { isDragging.current = true; setIsDraggingWord(true); }} 
                isTextOnly={false} targets={roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]]} 
                targetsRef={targetsRef as any} score={roomData.roundScore} onPause={() => updateRoom({ isPaused: true })} activeHover={activeHover} onGuess={handleGuess}
              />
            ) : <GuesserView timeLeft={roomData.timeLeft} describerName={currentP?.name} describerTeam={roomData.teamNames[currentP?.teamIdx]} isTeamMode={roomData.gameMode === 'team'} totalScores={roomData.totalScores} roundScore={roomData.roundScore} entities={[]} onPause={() => updateRoom({ isPaused: true })} />}
            
            {roomData.isPaused && (
              <div style={styles.pauseOverlay}>
                <h1 style={{color: 'white', marginBottom: '20px'}}>משחק מושהה ⏸️</h1>
                <div style={styles.scoreTable}>
                  {(roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)).map((entity: string) => (
                    <div key={entity} style={styles.scoreRow}>
                      <span style={{fontWeight:'bold', color: 'white'}}>{entity}</span>
                      <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                        <button style={styles.adjBtn} onClick={() => updateRoom({ [`totalScores.${entity}`]: Math.max(0, (roomData.totalScores[entity] || 0) - 1) })}>-</button>
                        <span style={{fontSize:'20px', minWidth:'30px', textAlign:'center', color:'#ffd700'}}>{roomData.totalScores[entity] || 0}</span>
                        <button style={styles.adjBtn} onClick={() => updateRoom({ [`totalScores.${entity}`]: (roomData.totalScores[entity] || 0) + 1 })}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => updateRoom({ isPaused: false })} style={styles.hugePlayBtn}>חזרה למשחק ▶️</button>
              </div>
            )}
          </>
        )}
        
        {step === 6 && roomData && <ScoreStep scores={roomData.totalScores} entities={[]} onNextRound={() => updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, preGameTimer: 3 })} />}
        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
      </div>
    </div>
  );
}