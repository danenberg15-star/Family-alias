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
  
  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  // לוגיקת שעון מתוקנת - לא נתקעת בטיימר
  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || !isIDescriber || step < 4) return;

    const interval = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) {
          updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        } else {
          updateRoom({ 
            step: 5, 
            timeLeft: 60, 
            shuffledWords: getShuffledWords("ADULT"),
            currentWordIdx: 0,
            roundScore: 0
          });
        }
      } else if (step === 5) {
        if (roomData.timeLeft > 0) {
          updateRoom({ timeLeft: roomData.timeLeft - 1 });
        } else {
          updateRoom({ step: 6 });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, roomId, roomData?.preGameTimer, roomData?.timeLeft, roomData?.isPaused, isIDescriber]);

  if (!mounted) return null;

  return (
    <div style={styles.container}>
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
            onStart={() => updateRoom({ step: 4, preGameTimer: 3, roundScore: 0 })} 
          />
        )}
        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
        {step === 5 && roomData && (
          isIDescriber ? <div>מסך משחק (בפיתוח)</div> : <GuesserView timeLeft={roomData.timeLeft} describerName={currentP?.name} describerTeam={roomData.teamNames[currentP?.teamIdx]} isTeamMode={roomData.gameMode === 'team'} totalScores={roomData.totalScores} roundScore={roomData.roundScore} entities={[]} onPause={() => updateRoom({ isPaused: true })} />
        )}
        {step === 6 && roomData && <ScoreStep scores={roomData.totalScores} entities={[]} onNextRound={() => updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, preGameTimer: 3 })} />}
        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
      </div>
    </div>
  );
}