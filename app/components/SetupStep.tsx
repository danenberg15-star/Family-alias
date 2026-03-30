"use client";

import React from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string;
  gameMode: "individual" | "team";
  setGameMode: (mode: "individual" | "team") => void;
  numTeams: number;
  setNumTeams: (n: number) => void;
  teamNames: string[];
  editTeamName: (idx: number) => void;
  players: any[];
  onPlayerMove: (pId: string, teamIdx: number) => void;
  activeHover: string | null;
  teamsRef: React.MutableRefObject<{[key: number]: HTMLDivElement | null}>;
  onStart: () => void;
}

export default function SetupStep(props: SetupStepProps) {
  return (
    <div style={{...styles.flexLayout, justifyContent:'flex-start', paddingTop:'40px'}}>
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '14px'}}>קוד חדר</div>
        <h1 style={{color: '#ffd700', fontSize: '48px', fontWeight: '900', letterSpacing: '4px', margin: '0'}}>{props.roomId}</h1>
      </div>

      {/* טוגל מצב משחק */}
      <div style={styles.toggleContainer}>
        <button 
          onClick={() => props.setGameMode("individual")} 
          style={props.gameMode === "individual" ? styles.toggleActive : styles.toggleInactive}
        >
          יחידים
        </button>
        <button 
          onClick={() => props.setGameMode("team")} 
          style={props.gameMode === "team" ? styles.toggleActive : styles.toggleInactive}
        >
          קבוצות
        </button>
      </div>

      {props.gameMode === "team" && (
        <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px'}}>
          <span style={{color:'white', fontWeight:'bold'}}>מספר קבוצות:</span>
          <div style={{display:'flex', gap:'8px'}}>
            {[2, 3, 4].map(n => (
              <button 
                key={n} 
                onClick={() => props.setNumTeams(n)} 
                style={props.numTeams === n ? styles.numberCircleActive : styles.numberCircle}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* גריד קבוצות / שחקנים */}
      <div style={props.gameMode === "team" ? styles.teamsGrid : {width:'320px', marginTop:'10px'}}>
        {(props.gameMode === "team" ? props.teamNames.slice(0, props.numTeams) : ["שחקנים בחדר"]).map((tName, tIdx) => (
          <div 
            key={tIdx} 
            ref={(el) => { if (props.teamsRef.current) props.teamsRef.current[tIdx] = el; }} 
            style={{
              ...styles.teamColumn, 
              borderColor: props.activeHover === `TEAM_${tIdx}` ? '#ffd700' : 'rgba(255,255,255,0.1)',
              backgroundColor: props.activeHover === `TEAM_${tIdx}` ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.03)'
            }}
          >
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', alignItems:'center'}}>
              <span style={{color:'#ffd700', fontSize:'14px', fontWeight:'bold'}}>{tName}</span>
              {props.gameMode === "team" && (
                <button onClick={() => props.editTeamName(tIdx)} style={{background:'none', border:'none', fontSize:'12px'}}>✏️</button>
              )}
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
              {props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).map(p => (
                <div 
                  key={p.id} 
                  draggable 
                  onDragStart={(e) => e.dataTransfer.setData("playerId", p.id)}
                  style={styles.playerTag}
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={props.onStart} style={{...styles.goldButton, marginTop:'auto', marginBottom:'20px'}}>
        התחלנו! 🚀
      </button>
    </div>
  );
}