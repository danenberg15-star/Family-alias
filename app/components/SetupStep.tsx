"use client";

import React, { useState } from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string;
  gameMode: "individual" | "team";
  setGameMode: (m: "individual" | "team") => void;
  difficulty: "VARIABLE" | "EASY";
  setDifficulty: (d: "VARIABLE" | "EASY") => void;
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

  const handleToggleMode = () => setGameMode(gameMode === "team" ? "individual" : "team");
  const handleToggleDiff = () => setDifficulty(difficulty === "EASY" ? "VARIABLE" : "EASY");

  const handlePlayerClick = (pId: string) => {
    if (gameMode !== "team") return;
    const p = players.find(x => x.id === pId);
    if (!p) return;
    const nextTeam = (p.teamIdx + 1) % numTeams;
    onPlayerMove(pId, nextTeam);
  };

  const handleStartAttempt = () => {
    if (gameMode === "team") {
      const teamsWithPlayers = Array.from({length: numTeams}, (_, i) => players.filter(p => p.teamIdx === i).length);
      if (teamsWithPlayers.some(count => count < 2)) {
        alert("במשחק קבוצתי, חייבים לפחות 2 שחקנים בכל קבוצה!");
        return;
      }
    }
    onStart();
  };

  return (
    <div style={{...styles.stepContainer, paddingTop: '40px'}}>
      <button onClick={onExit} style={styles.exitBtn}>✕</button>
      <h1 style={styles.title}>חדר: {roomId}</h1>

      <div style={styles.toggleContainer} onClick={handleToggleMode}>
        <div style={{...styles.toggleOption, backgroundColor: gameMode === 'individual' ? '#ffd700' : 'transparent', color: gameMode === 'individual' ? '#000' : '#fff'}}>👤 יחידים</div>
        <div style={{...styles.toggleOption, backgroundColor: gameMode === 'team' ? '#ffd700' : 'transparent', color: gameMode === 'team' ? '#000' : '#fff'}}>👥 קבוצות</div>
      </div>

      <div style={styles.toggleContainer} onClick={handleToggleDiff}>
        <div style={{...styles.toggleOption, backgroundColor: difficulty === 'VARIABLE' ? '#ffd700' : 'transparent', color: difficulty === 'VARIABLE' ? '#000' : '#fff'}}>🧩 משתנה</div>
        <div style={{...styles.toggleOption, backgroundColor: difficulty === 'EASY' ? '#ffd700' : 'transparent', color: difficulty === 'EASY' ? '#000' : '#fff'}}>👶 קל</div>
      </div>

      {gameMode === "team" ? (
        <div style={{width:'100%', display:'flex', flexDirection:'column', gap:'15px'}}>
          <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
            {[2,3,4].map(n => (
              <button key={n} onClick={() => setNumTeams(n)} style={{...styles.btn, padding:'8px 15px', backgroundColor: numTeams === n ? '#ffd700' : '#333', color: numTeams === n ? '#000' : '#fff', fontSize:'14px'}}>{n} קבוצות</button>
            ))}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
            {teamNames.slice(0, numTeams).map((name, idx) => (
              <div key={idx} style={styles.teamCard}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                   <span style={{color:'#ffd700', fontSize:'14px', fontWeight:'bold'}}>{name}</span>
                   <span onClick={() => editTeamName(idx)} style={{cursor:'pointer'}}>✏️</span>
                </div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'4px', minHeight:'40px'}}>
                  {players.filter(p => p.teamIdx === idx).map(p => (
                    <div key={p.id} onClick={() => handlePlayerClick(p.id)} style={{...styles.playerTag, cursor:'pointer'}}>{p.name}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{width:'100%', textAlign:'center'}}>
           <h3 style={{color:'#ffd700', marginBottom:'15px'}}>שחקנים בחדר:</h3>
           <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px'}}>
              {players.map(p => <div key={p.id} style={styles.playerTag}>{p.name}</div>)}
           </div>
        </div>
      )}

      <button onClick={handleStartAttempt} style={{...styles.hugePlayBtn, marginTop:'auto'}}>התחל משחק</button>
    </div>
  );
};

export default SetupStep;