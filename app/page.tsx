"use client";
import { useEffect, useRef, useState } from "react";
import { useGameState } from "./lib/useGameState";
import { getInitialShuffledPools } from "./lib/game-utils";
import RulesStep from "./components/RulesStep"; 
import EntryStep from "./components/EntryStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";
import SevenBoomStep from "./components/SevenBoomStep";

export default function FamilyAliasApp() {
  const { mounted, userId, roomId, roomData, step, setStep, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, setUserName, setUserAge } = useGameState();

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;
  const wakeLockRef = useRef<any>(null);
  
  // טיימר מקומי. QA: ברירת מחדל 5 לחדר עומר
  const [localTimeLeft, setLocalTimeLeft] = useState(roomId === "עומר" ? 5 : 60);

  const calculatePoolKey = (age: number, idxs: any, difficulty: string) => {
    const totalIdx = (idxs.KIDS + idxs.JUNIOR + idxs.TEEN + idxs.ADULT);
    if (difficulty === "easy") return (totalIdx % 2 === 0) ? "KIDS" : "JUNIOR";
    
    // לוגיקה מעודכנת לפי דרישות גיל
    if (age <= 6) {
      return (totalIdx % 5 < 4) ? "KIDS" : "JUNIOR"; // 80% KIDS, 20% JUNIOR
    } 
    if (age <= 12) {
      return (totalIdx % 10 < 1) ? "KIDS" : "JUNIOR"; // 10% KIDS, 90% JUNIOR
    } 
    if (age <= 20) { 
      const mod = totalIdx % 10;
      if (mod < 3) return "JUNIOR"; // 30% JUNIOR
      if (mod < 9) return "TEEN";   // 60% TEEN
      return "ADULT";               // 10% ADULT
    } 
    // גיל 21 ומעלה
    const mod = totalIdx % 10;
    if (mod < 2) return "JUNIOR";   // 20% JUNIOR
    if (mod < 4) return "TEEN";     // 20% TEEN
    return "ADULT";                 // 60% ADULT
  };

  useEffect(() => {
    if (!mounted) return;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) { console.log('Wake Lock error:', err); }
    };
    const handleVisibilityChange = () => { if (document.visibilityState === 'visible') requestWakeLock(); };
    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) { wakeLockRef.current.release().catch(() => {}); wakeLockRef.current = null; }
    };
  }, [mounted]);

  // טיימר ל-3 שניות לפני התחלת סיבוב (שלב 4)
  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || step !== 4) return;
    const isBot = currentP?.id?.startsWith('d_');
    const isHost = roomData.players[0].id === userId;
    if (!isIDescriber && !(isBot && isHost)) return;

    const interval = setInterval(() => {
      if (roomData.preGameTimer > 0) {
        updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
      } else {
        // QA Logic: חדר עומר מקבל 5 שניות, חדרים אחרים 60
        const durationSeconds = roomId === "עומר" ? 5 : 60;
        updateRoom({ 
          step: 5, 
          turnEndTime: Date.now() + (durationSeconds * 1000), 
          pausedTimeLeft: durationSeconds, 
          roundScore: 0, 
          isPaused: false 
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, roomId, roomData?.preGameTimer, roomData?.isPaused, isIDescriber, currentP, updateRoom]);

  // הטיימר המקומי למשחק (שלב 5)
  useEffect(() => {
    if (step === 5 && roomData) {
      if (roomData.isPaused) {
        setLocalTimeLeft(roomData.pausedTimeLeft || (roomId === "עומר" ? 5 : 60));
        return;
      }

      const interval = setInterval(() => {
        if (!roomData.turnEndTime) return;
        const remaining = Math.max(0, Math.ceil((roomData.turnEndTime - Date.now()) / 1000));
        setLocalTimeLeft(remaining);

        const isBot = currentP?.id?.startsWith('d_');
        const isHost = roomData.players?.[0]?.id === userId;
        const describerOrHost = isIDescriber || (isBot && isHost);

        if (remaining === 0 && describerOrHost) {
          const age = parseInt(currentP.age) || 21;
          const idxs = roomData.poolIndices || { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 };
          const poolKey = calculatePoolKey(age, idxs, roomData.difficulty || "age-appropriate");

          const newIndices = { ...idxs };
          newIndices[poolKey] = (newIndices[poolKey] || 0) + 1;
          updateRoom({ step: 6, poolIndices: newIndices });
        }
      }, 100); 

      return () => clearInterval(interval);
    }
  }, [step, roomId, roomData?.turnEndTime, roomData?.isPaused, roomData?.pausedTimeLeft, isIDescriber, currentP, updateRoom]);

  if (!mounted) return null;

  const handleScoreAction = (targetName: string, points: number = 1) => {
    if (roomData.isPaused) return;
    const age = parseInt(currentP.age) || 21;
    const idxs = roomData.poolIndices || { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 };
    const poolKey = calculatePoolKey(age, idxs, roomData.difficulty || "age-appropriate");
    
    const newIndices = { ...idxs };
    newIndices[poolKey] = (newIndices[poolKey] || 0) + 1;
    const newScores = { ...roomData.totalScores };
    let winnerFound = null;

    if (targetName === "SKIP") {
      if (roomData.gameMode === "individual") {
        newScores[currentP.name] = (newScores[currentP.name] || 0) - 1;
      } else {
        const teamName = roomData.teamNames[currentP.teamIdx];
        newScores[teamName] = (newScores[teamName] || 0) - 1;
      }
      updateRoom({ roundScore: (roomData.roundScore || 0) - 1, poolIndices: newIndices, totalScores: newScores });
    } else {
      newScores[targetName] = (newScores[targetName] || 0) + points;
      if (roomData.gameMode === "individual") {
        newScores[currentP.name] = (newScores[currentP.name] || 0) + points;
        if (newScores[targetName] >= 50) winnerFound = targetName;
        if (newScores[currentP.name] >= 50) winnerFound = currentP.name;
      } else {
        if (newScores[targetName] >= 50) winnerFound = targetName;
      }
      
      if (winnerFound) {
        updateRoom({ roundScore: (roomData.roundScore || 0) + points, poolIndices: newIndices, totalScores: newScores, step: 7, winner: winnerFound });
      } else {
        updateRoom({ roundScore: (roomData.roundScore || 0) + points, poolIndices: newIndices, totalScores: newScores });
      }
    }
  };

  const gameTargets = roomData?.gameMode === "individual" 
    ? roomData.players.filter((p: any) => p.id !== currentP?.id).map((p: any) => p.name) 
    : [roomData?.teamNames[currentP?.teamIdx]];

  return (
    <div style={{ backgroundColor: '#05081c', height: '100dvh', color: 'white', direction: 'rtl', overscrollBehavior: 'none', overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}>
      {step === 0 && <RulesStep onStart={() => setStep(1)} />}
      {step === 1 && <EntryStep onJoin={handleJoinRoom} onCreate={handleCreateRoom} onSetName={setUserName} onSetAge={setUserAge} />}
      {step === 3 && roomData && (
        <SetupStep roomId={roomId!} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} difficulty={roomData.difficulty || "age-appropriate"} setDifficulty={(d) => updateRoom({ difficulty: d })} numTeams={roomData.numTeams} setNumTeams={(n) => updateRoom({ numTeams: n })} players={roomData.players} teamNames={roomData.teamNames} updateTeamNames={(names) => updateRoom({ teamNames: names })} onPlayerMove={(pId, tIdx) => { const p = roomData.players.map((pl: any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl); updateRoom({ players: p }); }} editTeamName={(idx: number) => { const n = prompt("שם קבוצה:", roomData.teamNames[idx]); if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } }} 
          onStart={() => { 
            // איפוס מוחלט של מוני התורות בתחילת המשחק
            updateRoom({ 
              step: 4, preGameTimer: 3, shuffledPools: getInitialShuffledPools(), 
              poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 }, roundScore: 0,
              currentTurnIdx: 0, teamPointers: [0, 0, 0, 0]
            }); 
          }} 
          onExit={handleFullReset} 
        />
      )}
      {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
      {step === 5 && roomData && <GameStep roomData={roomData} localTimeLeft={localTimeLeft} userId={userId!} targets={gameTargets} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
      {step === 6 && roomData && (
        <ScoreStep scores={roomData.totalScores} entities={roomData.gameMode === 'individual' ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams)} gameMode={roomData.gameMode} players={roomData.players} 
          onNextRound={() => {
            let nextIdx = (roomData.currentTurnIdx + 1) % roomData.players.length;
            let newTeamPointers = roomData.teamPointers ? [...roomData.teamPointers] : [0, 0, 0, 0];

            if (roomData.gameMode === 'team') {
              const currentTeamIdx = roomData.players[roomData.currentTurnIdx].teamIdx;
              
              // 1. קדם את מונה התורות של הקבוצה שסיימה לשחק עכשיו
              newTeamPointers[currentTeamIdx] += 1;

              // 2. חשב מי הקבוצה הבאה שצריכה לשחק (במעגליות)
              const nextTeamIdx = (currentTeamIdx + 1) % roomData.numTeams;

              // 3. שלוף את כל השחקנים ששייכים לקבוצה הבאה (לפי סדר ההצטרפות שלהם)
              const nextTeamPlayers = roomData.players.filter((p: any) => p.teamIdx === nextTeamIdx);

              // 4. מצא את השחקן הבא בתור בתוך הקבוצה (לפי המונה של אותה קבוצה) וידוא שיש שחקנים בקבוצה
              if (nextTeamPlayers.length > 0) {
                const nextPlayerInTeam = nextTeamPlayers[newTeamPointers[nextTeamIdx] % nextTeamPlayers.length];
                // 5. מצא את האינדקס המקורי של השחקן הזה במערך השחקנים הכללי
                nextIdx = roomData.players.findIndex((p: any) => p.id === nextPlayerInTeam.id);
              }
            }

            const nextP = roomData.players[nextIdx];
            const nextScore = Number(roomData.totalScores[roomData.gameMode === 'team' ? roomData.teamNames[nextP.teamIdx] : nextP.name] || 0);
            const boomScores = [7, 14, 21, 28, 35, 42, 49];
            
            if (roomData.gameMode === 'team' && boomScores.includes(nextScore)) {
              updateRoom({ step: 8, currentTurnIdx: nextIdx, roundScore: 0, teamPointers: newTeamPointers });
            } else {
              updateRoom({ step: 4, currentTurnIdx: nextIdx, preGameTimer: 3, roundScore: 0, teamPointers: newTeamPointers });
            }
          }} 
        />
      )}
      {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
      {step === 8 && roomData && <SevenBoomStep roomData={roomData} userId={userId!} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
    </div>
  );
}