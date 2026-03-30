// app/components/SetupStep.tsx
"use client";

import React from "react";
import { styles } from "../game.styles";

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="white" xmlns="http://www.w3.org/2000/svg">
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
    <div style={{ ...styles.flexLayout, justifyContent: 'flex-start', paddingTop: '10px' }}>
      
      {/* חלק עליון - הוקטן ב-30% */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>קוד חדר</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <h1 style={{ color: '#ffd700', fontSize: '2.4rem', fontWeight: '900', margin: '0' }}>{props.roomId}</h1>
          <button 
            onClick={shareLink} 
            style={{ 
              background: '#25D366', border: 'none', borderRadius: '50%', 
              width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ShareIcon />
          </button>
        </div>
      </div>

      {/* טוגלים - הגדרות משחק */}
      <div style={{ width: '100%', marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '8px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '4px', textAlign: 'right' }}>סוג משחק:</div>
            <div style={styles.toggleContainer}>
              <button onClick={() => props.setGameMode("individual")} style={props.gameMode === "individual" ? styles.toggleActive : styles.toggleInactive}>יחידים</button>
              <button onClick={() => props.setGameMode("team")} style={props.gameMode === "team" ? styles.toggleActive : styles.toggleInactive}>קבוצות</button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '4px', textAlign: 'right' }}>רמת מילים:</div>
            <div style={styles.toggleContainer}>
              <button onClick={() => props.setDifficulty("age-appropriate")} style={props.difficulty === "age-appropriate" ? styles.toggleActive : styles.toggleInactive}>מותאמת</button>
              <button onClick={() => props.setDifficulty("easy")} style={props.difficulty === "easy" ? styles.toggleActive : styles.toggleInactive}>קלה</button>
            </div>
          </div>
        </div>

        {/* בחירת מספר קבוצות - מופיע רק במצב קבוצות */}
        {props.gameMode === "team" && (
          <div style={{ width: '100%', marginTop: '5px' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginBottom: '4px', textAlign: 'right' }}>מספר קבוצות:</div>
            <div style={{ ...styles.toggleContainer, width: '60%', marginRight: 'auto' }}>
              {[2, 3, 4].map((num) => (
                <button 
                  key={num}
                  onClick={() => props.setNumTeams(num)} 
                  style={props.numTeams === num ? styles.toggleActive : styles.toggleInactive}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* חלק תחתון - הוגדל ב-30% */}
      <div style={{ width: '100%', textAlign: 'right', marginBottom: '8px' }}>
        <span style={{ color: '#ffd700', fontSize: '1.1rem', fontWeight: 'bold' }}>חלוקה לקבוצות ושחקנים:</span>
      </div>

      <div style={props.gameMode === "team" ? styles.teamsGrid : { width: '100%', flex: 1, overflowY: 'auto' }}>
        {(props.gameMode === "team" ? props.teamNames.slice(0, props.numTeams) : ["שחקנים בחדר"]).map((tName, tIdx) => (
          <div 
            key={tIdx} 
            ref={(el) => { if (props.teamsRef.current) props.teamsRef.current[tIdx] = el; }} 
            style={{ 
              ...styles.teamColumn, 
              minHeight: '140px',
              border: props.activeHover === tIdx.toString() ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center', width: '100%' }}>
              <span style={{ color: '#ffd700', fontSize: '1.3rem', fontWeight: '900' }}>{tName}</span>
              {props.gameMode === "team" && <button onClick={() => props.editTeamName(tIdx)} style={{ background: 'none', border: 'none', fontSize: '18px' }}>✏️</button>}
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).map(p => (
                <div key={p.id} style={styles.playerTag}>{p.name}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={props.onStart} style={{ ...styles.goldButton, height: '70px', fontSize: '1.5rem' }}>התחלנו! 🚀</button>
    </div>
  );
}