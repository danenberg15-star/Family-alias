// app/components/SetupStep.tsx
"use client";

import React, { useState, useRef } from "react";
import { styles } from "../game.styles";

// אייקון שיתוף סטנדרטי (משולש עם עיגולים)
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
  const [showTeamMenu, setShowTeamMenu] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<any>(null);
  const [localHover, setLocalHover] = useState<number | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  // חישוב גודל תגי שחקן לפי הכמות
  const h = props.players.length > 10 ? '32px' : props.players.length > 6 ? '42px' : '52px';
  const fs = props.players.length > 10 ? '0.85rem' : '1rem';

  const onPointerDown = (e: React.PointerEvent, p: any) => {
    setDraggedPlayer(p);
    if (ghostRef.current) {
      ghostRef.current.style.display = 'flex';
      ghostRef.current.style.left = `${e.clientX - 60}px`;
      ghostRef.current.style.top = `${e.clientY - 20}px`;
      ghostRef.current.innerText = p.name;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggedPlayer || !ghostRef.current) return;
    ghostRef.current.style.left = `${e.clientX - 60}px`;
    ghostRef.current.style.top = `${e.clientY - 20}px`;

    let found: number | null = null;
    for (let i = 0; i < (props.gameMode === "team" ? props.numTeams : 1); i++) {
      const el = props.teamsRef.current[i];
      if (el) {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          found = i; break;
        }
      }
    }
    setLocalHover(found);
  };

  const onPointerUp = () => {
    if (draggedPlayer && localHover !== null) props.onPlayerMove(draggedPlayer.id, localHover);
    setDraggedPlayer(null); setLocalHover(null);
    if (ghostRef.current) ghostRef.current.style.display = 'none';
  };

  const shareLink = () => {
    const text = `בואו לשחק איתי באליאס! קוד חדר: ${props.roomId}\n${window.location.origin}?room=${props.roomId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={styles.flexLayout} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <div ref={ghostRef} style={{ position: 'fixed', pointerEvents: 'none', display: 'none', backgroundColor: '#ffd700', color: '#05081c', padding: '10px 20px', borderRadius: '12px', zIndex: 5000, fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />

      {/* חלק עליון (30% קטן יותר) */}
      <div style={styles.setupTop}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <h1 style={{ color: '#ffd700', fontSize: '2.2rem', fontWeight: '900', margin: 0 }}>{props.roomId}</h1>
          <button onClick={shareLink} style={{ background: '#25D366', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShareIcon />
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '4px' }}>סוג משחק</div>
            <div style={styles.toggleContainer}>
              <button onClick={() => props.setGameMode("individual")} style={props.gameMode === "individual" ? styles.toggleActive : styles.toggleInactive}>יחידים</button>
              <button onClick={() => { props.setGameMode("team"); setShowTeamMenu(true); }} style={props.gameMode === "team" ? styles.toggleActive : styles.toggleInactive}>קבוצות</button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '4px' }}>רמת מילים</div>
            <div style={styles.toggleContainer}>
              <button onClick={() => props.setDifficulty("age-appropriate")} style={props.difficulty === "age-appropriate" ? styles.toggleActive : styles.toggleInactive}>מותאמת</button>
              <button onClick={() => props.setDifficulty("easy")} style={props.difficulty === "easy" ? styles.toggleActive : styles.toggleInactive}>קלה</button>
            </div>
          </div>
        </div>
      </div>

      {/* לוח קבוצות (30% גדול יותר) */}
      <div style={{ 
        ...styles.teamsGrid, 
        gridTemplateColumns: '1fr 1fr', 
        gridTemplateRows: (props.gameMode === "team" && props.numTeams > 2) ? '1fr 1fr' : '1fr' 
      }}>
        {(props.gameMode === "team" ? props.teamNames.slice(0, props.numTeams) : ["שחקנים בחדר"]).map((tName, tIdx) => (
          <div 
            key={tIdx} ref={el => { if(props.teamsRef.current) props.teamsRef.current[tIdx] = el; }}
            style={{ ...styles.teamBox, ...(localHover === tIdx ? styles.teamBoxGlowing : {}) }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
              <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1rem' }}>{tName}</span>
              {props.gameMode === "team" && <button onClick={() => props.editTeamName(tIdx)} style={{ background: 'none', border: 'none', color: '#ffd700', fontSize: '1.2rem' }}>✏️</button>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
              {props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).map(p => (
                <div 
                  key={p.id} 
                  onPointerDown={(e) => onPointerDown(e, p)} 
                  style={{ ...styles.playerCard, height: h, fontSize: fs, opacity: draggedPlayer?.id === p.id ? 0.4 : 1 }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={props.onStart} style={{ ...styles.goldButton, height: '70px', fontSize: '1.6rem' }}>בואו נשחק! 🚀</button>

      {/* תפריט מספר קבוצות */}
      {showTeamMenu && (
        <div style={styles.verticalMenuOverlay}>
          <h2 style={{ color: 'white', fontSize: '1.6rem', marginBottom: '15px' }}>כמה קבוצות תרצו?</h2>
          {[2, 3, 4].map(n => (
            <div key={n} style={styles.menuOption} onClick={() => { props.setNumTeams(n); setShowTeamMenu(false); }}>{n} קבוצות</div>
          ))}
          <button onClick={() => setShowTeamMenu(false)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', fontSize: '1.2rem', marginTop: '10px' }}>ביטול</button>
        </div>
      )}
    </div>
  );
}