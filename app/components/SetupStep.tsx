"use client";

import React from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string;
  gameMode: "individual" | "team";
  setGameMode: (m: "individual" | "team") => void;
  numTeams: number;
  setNumTeams: (n: number) => void;
  teamNames: string[];
  editTeamName: (idx: number) => void;
  players: any[];
  onPlayerMove: (pId: string, teamIdx: number) => void;
  activeHover: string | null;
  teamsRef: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
  onStart: () => void;
}

const SetupStep: React.FC<SetupStepProps> = ({
  roomId, gameMode, setGameMode, numTeams, setNumTeams, teamNames, editTeamName, players, onPlayerMove, activeHover, teamsRef, onStart
}) => {

  const handleDragStart = (e: React.DragEvent, pId: string) => {
    e.dataTransfer.setData("playerId", pId);
  };

  const handleDrop = (e: React.DragEvent, teamIdx: number) => {
    e.preventDefault();
    const pId = e.dataTransfer.getData("playerId");
    if (pId) onPlayerMove(pId, teamIdx);
  };

  const isIndividualModePossible = true;
  const isTeamModePossible = players.length >= 4;

  return (
    <div style={{...styles.stepContainer, overflowY: 'auto', paddingBottom: '100px'}}>
      {/* כותרת החדר המקורית */}
      <h1 style={{...styles.title, color: '#fff', fontSize: '28px', marginBottom: '30px'}}>קוד חדר: {roomId}</h1>
      
      {/* בחירת מצב משחק - יחידים תמיד ראשון */}
      <div style={{display:'flex', gap:'10px', marginBottom:'25px', width: '100%'}}>
        <button 
          onClick={() => setGameMode("individual")} 
          style={{...styles.btn, flex: 1, backgroundColor: gameMode === "individual" ? "#ffd700" : "#333", color: gameMode === "individual" ? "#000" : "#fff"}}
        >
          👤 יחידים
        </button>
        <button 
          onClick={() => {
            if (isTeamModePossible) setGameMode("team");
            else alert("צריך לפחות 4 שחקנים למשחק קבוצתי");
          }} 
          style={{
            ...styles.btn, 
            flex: 1, 
            opacity: isTeamModePossible ? 1 : 0.5,
            backgroundColor: gameMode === "team" ? "#ffd700" : "#333", 
            color: gameMode === "team" ? "#000" : "#fff"
          }}
        >
          👥 קבוצות
        </button>
      </div>

      {gameMode === "team" && (
        <>
          <div style={{display:'flex', gap:'10px', marginBottom:'20px', width: '100%'}}>
            {[2, 3, 4].map(n => (
              <button 
                key={n} 
                onClick={() => setNumTeams(n)} 
                style={{...styles.btn, flex: 1, fontSize:'14px', backgroundColor: numTeams === n ? "#ffd700" : "#333", color: numTeams === n ? "#000" : "#fff"}}
              >
                {n} קבוצות
              </button>
            ))}
          </div>
          
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', width:'100%'}}>
            {teamNames.slice(0, numTeams).map((name, idx) => (
              <div 
                key={idx} 
                ref={el => { if (teamsRef.current) teamsRef.current[idx] = el; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, idx)}
                style={{
                  ...styles.teamCard, 
                  minHeight: '130px',
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  border: activeHover === name ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                  color: '#fff'
                }}
              >
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px'}}>
                  <span style={{fontWeight:'bold', color: '#ffd700'}}>{name}</span>
                  <button onClick={() => editTeamName(idx)} style={{background:'none', border:'none', cursor:'pointer', fontSize: '14px'}}>✏️</button>
                </div>
                <div style={{minHeight:'60px', marginTop:'10px', display:'flex', flexWrap:'wrap', gap:'6px'}}>
                  {players.filter(p => p.teamIdx === idx).map(p => (
                    <div 
                      key={p.id} 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, p.id)} 
                      style={{...styles.playerTag, color: '#fff', border: '1px solid #ffd700', cursor: 'grab'}}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {gameMode === "individual" && (
        <div style={{width:'100%', marginTop:'20px'}}>
          <h2 style={{fontSize:'20px', marginBottom:'15px', color: '#ffd700', textAlign: 'center'}}>שחקנים בחדר:</h2>
          <div style={{display:'flex', flexWrap:'wrap', gap:'12px', justifyContent: 'center'}}>
            {players.map(p => (
              <div key={p.id} style={{...styles.playerTag, color: '#fff', fontSize: '16px', padding: '8px 15px', border: '1px solid rgba(255,255,255,0.2)'}}>
                {p.name} <span style={{fontSize: '12px', opacity: 0.7}}>({p.age})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onStart} style={{...styles.hugePlayBtn, marginTop: '40px'}}>🚀 התחל משחק!</button>
    </div>
  );
};

export default SetupStep;