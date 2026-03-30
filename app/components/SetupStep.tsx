// app/components/SetupStep.tsx
"use client";

import React, { useState, useRef } from "react";
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
  activeHover: string | null; // הוספת השדה שפתרה את השגיאה ב-PAGE
  teamsRef: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
  onStart: () => void;
}

export default function SetupStep(props: SetupStepProps) {
  const [isSelectingTeams, setIsSelectingTeams] = useState(false);
  const draggedPlayer = useRef<any>(null);
  const lastHoveredTeam = useRef<number | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  // גרירה "חלקה" - Direct DOM Manipulation
  const onPointerDown = (e: React.PointerEvent, player: any) => {
    draggedPlayer.current = player;
    if (ghostRef.current) {
      ghostRef.current.style.display = 'flex';
      ghostRef.current.style.transform = `translate3d(${e.clientX - 60}px, ${e.clientY - 25}px, 0)`;
      ghostRef.current.innerText = player.name;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggedPlayer.current || !ghostRef.current) return;
    
    // הזזה דרך ה-GPU (הכי מהיר שיש)
    ghostRef.current.style.transform = `translate3d(${e.clientX - 60}px, ${e.clientY - 25}px, 0)`;

    // זיהוי קבוצה "זוהרת"
    let found: number | null = null;
    const targets = props.gameMode === "team" ? props.numTeams : 1;
    for (let i = 0; i < targets; i++) {
      const el = props.teamsRef.current[i];
      if (el) {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          found = i; break;
        }
      }
    }

    // עדכון ויזואלי של ה"זוהר" בלי לרנדר את כל ה-React
    if (found !== lastHoveredTeam.current) {
      if (lastHoveredTeam.current !== null) {
        const oldEl = props.teamsRef.current[lastHoveredTeam.current];
        if (oldEl) oldEl.style.borderColor = 'rgba(255,255,255,0.1)';
      }
      if (found !== null) {
        const newEl = props.teamsRef.current[found];
        if (newEl) newEl.style.borderColor = '#ffd700';
      }
      lastHoveredTeam.current = found;
    }
  };

  const onPointerUp = () => {
    if (draggedPlayer.current && lastHoveredTeam.current !== null) {
      props.onPlayerMove(draggedPlayer.current.id, lastHoveredTeam.current);
    }
    if (lastHoveredTeam.current !== null) {
      const el = props.teamsRef.current[lastHoveredTeam.current];
      if (el) el.style.borderColor = 'rgba(255,255,255,0.1)';
    }
    draggedPlayer.current = null;
    lastHoveredTeam.current = null;
    if (ghostRef.current) ghostRef.current.style.display = 'none';
  };

  return (
    <div style={styles.flexLayout} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      {/* אלמנט הגרירה */}
      <div ref={ghostRef} style={{ position: 'fixed', pointerEvents: 'none', display: 'none', backgroundColor: '#ffd700', color: '#05081c', padding: '10px 20px', borderRadius: '12px', zIndex: 5000, fontWeight: 'bold', top: 0, left: 0, willChange: 'transform' }} />

      <div style={styles.setupTop}>
        <h1 style={{ color: '#ffd700', fontSize: '2.4rem', fontWeight: '900', margin: 0 }}>{props.roomId}</h1>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <div style={styles.toggleContainer}>
            <button onClick={() => { props.setGameMode("individual"); setIsSelectingTeams(false); }} style={props.gameMode === "individual" ? styles.toggleActive : styles.toggleInactive}>יחידים</button>
            <button onClick={() => setIsSelectingTeams(true)} style={props.gameMode === "team" && !isSelectingTeams ? styles.toggleActive : styles.toggleInactive}>קבוצות</button>
          </div>
          <div style={styles.toggleContainer}>
            <button onClick={() => props.setDifficulty("age-appropriate")} style={props.difficulty === "age-appropriate" ? styles.toggleActive : styles.toggleInactive}>מותאמת</button>
            <button onClick={() => props.setDifficulty("easy")} style={props.difficulty === "easy" ? styles.toggleActive : styles.toggleInactive}>קלה</button>
          </div>
        </div>
      </div>

      {isSelectingTeams ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px', width: '100%' }}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>כמה קבוצות תרצו?</h2>
          {[2, 3, 4].map(n => (
            <button key={n} onClick={() => { props.setNumTeams(n); props.setGameMode("team"); setIsSelectingTeams(false); }} style={{ ...styles.entryButton, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid #ffd700' }}>{n} קבוצות</button>
          ))}
        </div>
      ) : (
        <div style={{ ...styles.teamsGrid, gridTemplateColumns: '1fr 1fr', gridTemplateRows: props.numTeams > 2 ? '1fr 1fr' : '1fr' }}>
          {(props.gameMode === "team" ? props.teamNames.slice(0, props.numTeams) : ["שחקנים בחדר"]).map((tName, tIdx) => (
            <div key={tIdx} ref={el => { if(props.teamsRef.current) props.teamsRef.current[tIdx] = el; }} style={styles.teamBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px' }}>
                <span style={{ color: '#ffd700', fontSize: '0.9rem', fontWeight: 'bold' }}>{tName}</span>
                {props.gameMode === "team" && <button onClick={() => props.editTeamName(tIdx)} style={{ background: 'none', border: 'none', color: '#ffd700' }}>✏️</button>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
                {props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).map(p => (
                  <div key={p.id} onPointerDown={(e) => onPointerDown(e, p)} style={styles.playerCard}>{p.name}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={props.onStart} style={styles.goldButtonFixed}>בואו נשחק! 🚀</button>
    </div>
  );
}