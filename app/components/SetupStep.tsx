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
  return (
    <div style={{ ...styles.stepContainer, overflowY: "auto", paddingBottom: "40px" }}>
      <h1 style={styles.title}>קוד חדר: {roomId}</h1>

      {/* טוגל מצב משחק - יחידים או קבוצות */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button 
          onClick={() => setGameMode("individual")} 
          style={{...styles.btn, backgroundColor: gameMode === "individual" ? "#ffd700" : "#333", color: gameMode === "individual" ? "#000" : "#fff"}}
        >
          יחידים
        </button>
        <button 
          onClick={() => setGameMode("team")} 
          style={{...styles.btn, backgroundColor: gameMode === "team" ? "#ffd700" : "#333", color: gameMode === "team" ? "#000" : "#fff"}}
        >
          קבוצות
        </button>
      </div>

      {gameMode === "team" && (
        <>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {[2, 3, 4].map((n) => (
              <button 
                key={n} 
                onClick={() => setNumTeams(n)} 
                style={{...styles.btn, fontSize: "14px", backgroundColor: numTeams === n ? "#ffd700" : "#333", color: numTeams === n ? "#000" : "#fff"}}
              >
                {n} קבוצות
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", width: "100%" }}>
            {teamNames.slice(0, numTeams).map((name, idx) => (
              <div 
                key={idx} 
                ref={(el) => { if (teamsRef.current) teamsRef.current[idx] = el; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const pId = e.dataTransfer.getData("playerId");
                  if (pId) onPlayerMove(pId, idx);
                }}
                style={{
                  ...styles.teamCard,
                  border: activeHover === name ? "2px solid #ffd700" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", color: "#ffd700" }}>{name}</span>
                  <button onClick={() => editTeamName(idx)} style={{ background: "none", border: "none", cursor: "pointer" }}>✏️</button>
                </div>
                <div style={{ minHeight: "50px", marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {players.filter((p) => p.teamIdx === idx).map((p) => (
                    <div 
                      key={p.id} 
                      draggable 
                      onDragStart={(e) => e.dataTransfer.setData("playerId", p.id)} 
                      style={{ ...styles.playerTag, cursor: "grab" }}
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
        <div style={{ width: "100%", marginTop: "20px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "10px", color: "#ffd700", textAlign: "center" }}>שחקנים בחדר:</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {players.map((p) => (
              <div key={p.id} style={styles.playerTag}>{p.name} ({p.age})</div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onStart} style={styles.hugePlayBtn}>🚀 התחל משחק!</button>
    </div>
  );
};

export default SetupStep;