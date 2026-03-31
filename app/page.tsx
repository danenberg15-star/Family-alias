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
  const { mounted, userId, roomId, roomData, step, userName, setUserName, userAge, setUserAge, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom } = useGameState();
  const wordRef = useRef<HTMLDivElement>(null!);
  const skipRef = useRef<HTMLButtonElement>(null!);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const isDragging = useRef(false);
  const [isDraggingWord, setIsDraggingWord] = useState(false);

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || !isIDescriber || step < 4) return;
    const interval = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 60, shuffledWords: getShuffledWords("ADULT"), currentWordIdx: 0, roundScore: 0 });
      } else if (step === 5) {
        if (roomData.timeLeft > 0) updateRoom({ timeLeft: roomData.timeLeft - 1 });
        else updateRoom({ step: 6 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, roomId, roomData?.preGameTimer, roomData?.timeLeft, roomData?.isPaused, isIDescriber]);

  if (!mounted) return null;
  const gameTargets = roomData?.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData?.teamNames[currentP?.teamIdx]];

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
      if (isDragging.current && activeHover) updateRoom({ roundScore: (roomData.roundScore || 0) + (activeHover === "SKIP" ? -1 : 1), currentWordIdx: roomData.currentWordIdx + 1 });
      isDragging.current = false; setActiveHover(null); setIsDraggingWord(false);
      if (wordRef.current) { wordRef.current.style.position = 'relative'; wordRef.current.style.transform = 'none'; }
    }}>
      <div style={styles.safeAreaWrapper}>
        {step === 1 && <EntryStep onNext={(n, a, action, code) => { setUserName(n); setUserAge(a); if (action === 'create') handleCreateRoom(); else if (action === 'join' && code) handleJoinRoom(code); }} />}
        
        {step === 3 && roomData && (
          <SetupStep 
            roomId={roomId!} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} 
            difficulty={roomData.difficulty || "age-appropriate"} setDifficulty={(d) => updateRoom({ difficulty: d })}
            numTeams={roomData.numTeams} setNumTeams={(n) => updateRoom({ numTeams: n })}
            players={roomData.players} teamNames={roomData.teamNames}
            updateTeamNames={(names) => updateRoom({ teamNames: names })}
            onPlayerMove={(pId, tIdx) => { const p = roomData.players.map((pl:any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl); updateRoom({ players: p }); }} 
            editTeamName={(idx: number) => { const n = prompt("שם קבוצה:", roomData.teamNames[idx]); if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } }} 
            onStart={() => updateRoom({ step: 4, preGameTimer: 3 })} onExit={handleFullReset} 
          />
        )}

        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
        {step === 5 && roomData && (
          <GameStep 
            timeLeft={roomData.timeLeft} currentWord={roomData.shuffledWords[roomData.currentWordIdx % roomData.shuffledWords.length]} 
            wordRef={wordRef} skipRef={skipRef} isDraggingWord={isDraggingWord} onPointerDown={() => { isDragging.current = true; setIsDraggingWord(true); }} 
            targets={gameTargets} targetsRef={targetsRef as any} score={roomData.roundScore} onPause={() => updateRoom({ isPaused: true })} 
            activeHover={activeHover} onGuess={() => {}} isTextOnly={false} 
          />
        )}
        {step === 6 && roomData && <ScoreStep scores={roomData.totalScores} entities={gameTargets} onNextRound={() => updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, preGameTimer: 3 })} />}
        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
      </div>
    </div>
  );
}