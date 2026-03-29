"use client";

import React, { useState } from "react";
import { styles } from "../game.styles";
import { DifficultyLevel } from "../game.config";

interface SetupStepProps {
  roomId: string;
  gameMode: "individual" | "team";
  setGameMode: (m: "individual" | "team") => void;
  difficulty: DifficultyLevel;
  setDifficulty: (d: DifficultyLevel) => void;
  numTeams: number;
  setNumTeams: (n: number) => void;
  teamNames: string[];
  editTeamName: (idx: number) => void;
  players: any[];
  onPlayerMove: (pId: string, teamIdx: number) => void;
  onExit: () => void;
  onStart: () => void;
}

const SetupStep: React.FC<SetupStepProps> = ({
  roomId, gameMode, setGameMode, difficulty, setDifficulty, numTeams, setNumTeams, 
  teamNames, editTeamName, players, onPlayerMove, onExit, onStart
}) => {

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const handleStartAttempt = () => {
    if (gameMode === "team") {
      const counts = Array.from({length: numTeams}, (_, i) => players.filter(p => p.teamIdx === i).length);
      if (counts.some(c => c < 2)) {
        alert("כל קבוצה חייבת לפחות 2 שחקנים!");
        return;
      }
    }
    onStart();
  };

  return (
    <div style={{...styles.stepContainer, paddingTop: '50px'}}>
      <button onClick={onExit} style={styles.exitBtn}>✕</button>
      <h1 style={styles.title}>קוד חדר: {roomId}</h1>

      <div style={styles.toggleContainer} onClick={() => setGameMode(gameMode === 'team' ? 'individual' : 'team')}>
        <div style={{...styles.toggleOption, backgroundColor: gameMode === 'individual' ? '#ffd700' : 'transparent', color: gameMode === 'individual' ? '#000' : '#fff'}}>👤 יחידים</div>
        <div style={{...styles.toggleOption, backgroundColor: gameMode === 'team' ? '#ffd700' : 'transparent', color: gameMode === 'team' ? '#000' : '#fff'}}>👥 קבוצות</div>
      </div>

      <div style={styles.toggleContainer} onClick={() => setDifficulty(difficulty === 'EASY' ? 'VARIABLE' : 'EASY')}>
        <div style={{...styles.toggleOption, backgroundColor: difficulty === 'VARIABLE' ? '#ffd700' : 'transparent', color: difficulty === 'VARIABLE' ? '#000' : '#fff'}}>🧩 משתנה</div>
        <div style={{...styles.toggleOption, backgroundColor: difficulty === 'EASY' ? '#ffd700' : 'transparent', color: difficulty === 'EASY' ? '#000' : '#fff'}}>👶 קל</div>
      </div>

      {gameMode === "team" ? (
        <div style={{width:'100%', display:'flex', flexDirection:'column', gap:'15px'}}>
          <div style={{display:'flex', gap:'8px', justifyContent:'center'}}>
            {[2,3,4].map(n => (
              <button key={n} onClick={() => setNumTeams(n)} style={{...styles.btn, backgroundColor: numTeams === n ? '#ffd700' : '#333', color: numTeams === n ? '#000' : '#fff'}}>{n} קבוצות</button>
            ))}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', width:'100%'}}>
            {teamNames.slice(0, numTeams).map((name, idx) => (
              <div 
                key={idx} 
                onPointerUp={() => { if(activeDragId) { onPlayerMove(activeDragId, idx); setActiveDragId(null); } }}
                style={{...styles.teamCard, border: activeDragId ? '2px dashed #ffd700' : styles.teamCard.border}}
              >
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                  <span style={{color:'#ffd700', fontWeight:'bold', fontSize:'14px'}}>{name}</span>
                  <span onClick={(e) => { e.stopPropagation(); editTeamName(idx); }} style={{cursor:'pointer', fontSize:'12px'}}>✏️</span>
                </div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'4px', minHeight:'50px'}}>
                  {players.filter(p => p.teamIdx === idx).map(p => (
                    <div key={p.id} onPointerDown={() => setActiveDragId(p.id)} style={{...styles.playerTag, opacity: activeDragId === p.id ? 0.5 : 1, cursor:'grab'}}>{p.name}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{width:'100%', textAlign:'center'}}>
          <h3 style={{color:'#ffd700', marginBottom:'15px'}}>שחקנים בחדר:</h3>
          <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'10px'}}>
            {players.map(p => <div key={p.id} style={styles.playerTag}>{p.name}</div>)}
          </div>
        </div>
      )}

      <button onClick={handleStartAttempt} style={styles.hugePlayBtn}>התחל משחק</button>
    </div>
  );
};

export default SetupStep;