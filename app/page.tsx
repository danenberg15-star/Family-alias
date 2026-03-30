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
  const skipRef = useRef<HTMLDivElement | null>(null);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
            onStart={() => updateRoom({ step: 4, currentWordIdx: 0, roundScore: 0, preGameTimer: 3 })} 
          />
        )}
        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: roomData.players[roomData.currentTurnIdx]?.name, team: roomData.teamNames[roomData.players[roomData.currentTurnIdx]?.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
        {/* ... שאר השלבים נשארים כפי שהיו ... */}
      </div>
    </div>
  );
}