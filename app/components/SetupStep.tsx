"use client";

import React, { useState, useRef } from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string; gameMode: "individual" | "team"; setGameMode: (m: "individual" | "team") => void;
  difficulty: "age-appropriate" | "easy"; setDifficulty: (d: "age-appropriate" | "easy") => void;
  numTeams: number; setNumTeams: (n: number) => void; teamNames: string[]; editTeamName: (i: number) => void;
  players: any[]; onPlayerMove: (pId: string, tIdx: number) => void; activeHover: string | null;
  teamsRef: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>; onStart: () => void;
}

export default function SetupStep(props: SetupStepProps) {
  const [showTeamMenu, setShowTeamMenu] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<any>(null);
  const [localHover, setLocalHover] = useState<number | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null!);

  const onPointerDown = (e: React.PointerEvent, p: any) => {
    setDraggedPlayer(p);
    if (ghostRef.current) {
      ghostRef.current.style.display = 'flex';
      ghostRef.current.style.transform = `translate3d(${e.clientX - 60}px, ${e.clientY - 20}px, 0)`;
      ghostRef.current.innerText = p.name;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggedPlayer || !ghostRef.current) return;
    ghostRef.current.style.transform = `translate3d(${e.clientX - 60}px, ${e.clientY - 20}px, 0)`;
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

  return (
    <div style={styles.flexLayout} onPointerMove={onPointerMove} onPointerUp={() => { if(draggedPlayer && localHover !== null) props.onPlayerMove(draggedPlayer.id, localHover); setDraggedPlayer(null); setLocalHover(null); if(ghostRef.current) ghostRef.current.style.display = 'none'; }}>
      <div ref={ghostRef} style={{ position: 'fixed', pointerEvents: 'none', display: 'none', backgroundColor: '#ffd700', color: '#05081c', padding: '10px 20px', borderRadius: '12px', zIndex: 5000, fontWeight: 'bold', top: 0, left: 0 }} />
      <div style={styles.setupTop}>
        <h1 style={{ color: '#ffd700', fontSize: '2.4rem', fontWeight: '900', margin: 0 }}>{props.roomId}</h1>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <div style={styles.toggleContainer}><button onClick={() => props.setGameMode("individual")} style={props.gameMode === "individual" ? styles.toggleActive : styles.toggleInactive}>יחידים</button><button onClick={() => { props.setGameMode("team"); setShowTeamMenu(true); }} style={props.gameMode === "team" ? styles.toggleActive : styles.toggleInactive}>קבוצות</button></div>
          <div style={styles.toggleContainer}><button onClick={() => props.setDifficulty("age-appropriate")} style={props.difficulty === "age-appropriate" ? styles.toggleActive : styles.toggleInactive}>מותאמת</button><button onClick={() => props.setDifficulty("easy")} style={props.difficulty === "easy" ? styles.toggleActive : styles.toggleInactive}>קלה</button></div>
        </div>
      </div>
      {!showTeamMenu && (
        <div style={{ ...styles.teamsGrid, gridTemplateColumns: '1fr 1fr', gridTemplateRows: props.numTeams > 2 ? '1fr 1fr' : '1fr' }}>
          {(props.gameMode === "team" ? props.teamNames.slice(0, props.numTeams) : ["שחקנים"]).map((tName, tIdx) => (
            <div key={tIdx} ref={el => { if(props.teamsRef.current) props.teamsRef.current[tIdx] = el; }} style={{ ...styles.teamBox, ...(localHover === tIdx ? styles.teamBoxGlowing : {}) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px' }}>
                <span style={{ color: '#ffd700', fontSize: '0.9rem', fontWeight: 'bold' }}>{tName}</span>
                {props.gameMode === "team" && <button onClick={() => props.editTeamName(tIdx)} style={{ background: 'none', border: 'none', color: '#ffd700' }}>✏️</button>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).map(p => (
                  <div key={p.id} onPointerDown={(e) => onPointerDown(e, p)} style={{ ...styles.playerCard, height: '48px', opacity: draggedPlayer?.id === p.id ? 0.4 : 1 }}>{p.name}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {showTeamMenu && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px', width: '100%' }}>
          {[2, 3, 4].map(n => <button key={n} onClick={() => { props.setNumTeams(n); setShowTeamMenu(false); }} style={{ ...styles.entryButton, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid #ffd700' }}>{n} קבוצות</button>)}
        </div>
      )}
      <button onClick={props.onStart} style={styles.goldButtonFixed}>בואו נשחק! 🚀</button>
    </div>
  );
}