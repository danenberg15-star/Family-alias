// app/components/SetupStep.tsx
"use client";

import React from "react";
import { styles } from "../game.styles";

// רכיב SVG פנימי של אייקון השיתוף הסטנדרטי (nodes-and-lines)
const ShareIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    fill="white" // צבע לבן לאייקון
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
  </svg>
);

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
          
          {/* כפתור שיתוף מעודכן עם אייקון שיתוף סטנדרטי על רקע ירוק */}
          <button 
            onClick={shareLink} 
            style={{ 
              background: '#25D366', // שומרים על הרקע הירוק של וואטסאפ
              border: 'none', 
              borderRadius: '50%', 
              width: '45px', 
              height: '45px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              padding: '0'
            }}
            title="שתף קישור לחדר"
          >
            <ShareIcon />
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