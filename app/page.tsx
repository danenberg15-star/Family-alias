"use client";
import { useEffect } from "react";
import { useGameState } from "./lib/useGameState";
import { getInitialShuffledPools } from "./lib/game-utils";
import EntryStep from "./components/EntryStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";

export default function FamilyAliasApp() {
  const { mounted, userId, roomId, roomData, step, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, setUserName, setUserAge } = useGameState();

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
    const isEasy = roomData.difficulty === "easy";
    const idxs = roomData.poolIndices || { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 };
    
    let poolKey: "KIDS" | "JUNIOR" | "TEEN" | "ADULT";
    if (isEasy || age <= 6) {
      poolKey = "KIDS";
    } else if (age <= 10) {
      poolKey = "JUNIOR";
    } else if (age <= 16) {
      poolKey = (idxs.TEEN + idxs.JUNIOR) % 2 === 0 ? "TEEN" : "JUNIOR";
    } else {
      poolKey = (idxs.ADULT + idxs.TEEN) % 2 === 0 ? "ADULT" : "TEEN";
    }
    
    const newIndices = { ...idxs };
    newIndices[poolKey] = (newIndices[poolKey] || 0) + 1;
    const newScores = { ...roomData.totalScores };

    if (targetName === "SKIP") {
      updateRoom({ roundScore: (roomData.roundScore || 0) - 1, poolIndices: newIndices });
    } else {
      // עדכון ניקוד: המנחש מקבל נקודה
      newScores[targetName] = (newScores[targetName] || 0) + 1;
      
      // אם משחק אישי - גם המתאר מקבל נקודה אחת
      if (roomData.gameMode === "individual") {
        newScores[currentP.name] = (newScores[currentP.name] || 0) + 1;
      }
      
      updateRoom({ 
        roundScore: (roomData.roundScore || 0) + 1, 
        poolIndices: newIndices, 
        totalScores: newScores 
      });
    }
  };

  const gameTargets = roomData?.gameMode === "individual" 
    ? roomData.players.filter((p: any) => p.id !== currentP?.id).map((p: any) => p.name) 
    : [roomData?.teamNames[currentP?.teamIdx]];

  return (
    <div style={{ backgroundColor: '#05081c', minHeight: '100dvh', color: 'white', direction: 'rtl', overscrollBehavior: 'none' }}>
      {step === 1 && (
        <EntryStep 
          onNext={(n, a, action, code) => { 
            setUserName(n); 
            setUserAge(a); 
            if (action === 'create') handleCreateRoom(n, a); 
            else if (action === 'join' && code) handleJoinRoom(code, n, a); 
          }} 
        />
      )}
      
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
          updateTeamNames={(names) => updateRoom({ teamNames: names })} 
          onPlayerMove={(pId, tIdx) => { 
            const p = roomData.players.map((pl: any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl); 
            updateRoom({ players: p }); 
          }} 
          editTeamName={(idx: number) => { 
            const n = prompt("שם קבוצה:", roomData.teamNames[idx]); 
            if(n) { 
              const t = [...roomData.teamNames]; 
              t[idx] = n; 
              updateRoom({ teamNames: t }); 
            } 
          }} 
          onStart={() => updateRoom({ 
            step: 4, 
            preGameTimer: 3, 
            shuffledPools: getInitialShuffledPools(), 
            poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 }, 
            roundScore: 0 
          })} 
          onExit={handleFullReset} 
        />
      )}

      {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
      
      {step === 5 && roomData && (
        <GameStep 
          roomData={roomData} 
          userId={userId!} 
          targets={gameTargets} 
          updateRoom={updateRoom} 
          handleAction={handleScoreAction} 
          onExit={handleFullReset} 
        />
      )}

      {step === 6 && roomData && (
        <ScoreStep 
          scores={roomData.totalScores} 
          entities={roomData.gameMode === 'individual' ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams)} 
          onNextRound={() => {
            const WIN = 50; 
            const sc = roomData.totalScores;
            const winner = roomData.gameMode === 'individual' 
              ? roomData.players.find((p: any) => (sc[p.name] || 0) >= WIN) 
              : roomData.teamNames.find((n: any) => (sc[n] || 0) >= WIN);
            
            if (winner) updateRoom({ step: 7, winner: roomData.gameMode === 'individual' ? winner.name : winner });
            else updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, preGameTimer: 3 });
          }} 
        />
      )}

      {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
    </div>
  );
}