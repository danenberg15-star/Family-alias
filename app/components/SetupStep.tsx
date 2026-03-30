"use client";

import React from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string;
  gameMode: "individual" | "team";
  setGameMode: (mode: "individual" | "team") => void;
  difficulty: "age-appropriate" | "easy";
  setDifficulty: (d: "age-appropriate" | "easy") => void;
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

export default function SetupStep(props: SetupStepProps) {
  const shareLink = () => {
    const text = `בואו לשחק איתי באליאס! כנסו לקישור והצטרפו לחדר: ${props.roomId}\n${window.location.origin}?room=${props.roomId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ ...styles.flexLayout, justifyContent: 'flex-start', paddingTop: '20px' }}>
      {/* קוד חדר ושיתוף */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>קוד חדר</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
          <h1 style={{ color: '#ffd700', fontSize: '3.5rem', fontWeight: '900', margin: '0' }}>{props.roomId}</h1>
          <button onClick={shareLink} style={{ background: '#25D366', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            🔗
          </button>
        </div>
      </div>

      {/* טוגל מצב משחק */}
      <div style={{ width: '100%', marginBottom: '10px' }}>
        <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px', textAlign: 'right' }}>סוג משחק:</div>
        <div style={styles.toggleContainer}>
          <button onClick={() => props.setGameMode("individual")} style={props.gameMode === "individual" ? styles.toggleActive : styles.toggleInactive}>יחידים</button>
          <button onClick={() => props.setGameMode("team")} style={props.gameMode === "team" ? styles.toggleActive : styles.toggleInactive}>קבוצות</button>
        </div>
      </div>

      {/* טוגל רמת קושי */}
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px', textAlign: 'right' }}>רמת מילים:</div>
        <div style={styles.toggleContainer}>
          <button onClick={() => props.setDifficulty("age-appropriate")} style={props.difficulty === "age-appropriate" ? styles.toggleActive : styles.toggleInactive}>מותאמת גיל</button>
          <button onClick={() => props.setDifficulty("easy")} style={props.difficulty === "easy" ? styles.toggleActive : styles.toggleInactive}>קלה (עם תמונות)</button>
        </div>
      </div>

      {/* רשימת קבוצות/שחקנים */}
      <div style={props.gameMode === "team" ? styles.teamsGrid : { width: '100%' }}>
        {(props.gameMode === "team" ? props.teamNames.slice(0, props.numTeams) : ["שחקנים בחדר"]).map((tName, tIdx) => (
          <div key={tIdx} ref={(el) => { if (props.teamsRef.current) props.teamsRef.current[tIdx] = el; }} style={{ ...styles.teamColumn, minHeight: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
              <span style={{ color: '#ffd700', fontSize: '1rem', fontWeight: 'bold' }}>{tName}</span>
              {props.gameMode === "team" && <button onClick={() => props.editTeamName(tIdx)} style={{ background: 'none', border: 'none', fontSize: '14px' }}>✏️</button>}
            </div>
            {props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).map(p => (
              <div key={p.id} style={styles.playerTag}>{p.name}</div>
            ))}
          </div>
        ))}
      </div>

      <button onClick={props.onStart} style={styles.goldButton}>התחלנו! 🚀</button>
    </div>
  );
}