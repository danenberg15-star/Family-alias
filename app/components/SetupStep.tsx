"use client";

import React, { useState, useRef, useEffect } from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string; gameMode: "individual" | "team"; setGameMode: (m: "individual" | "team") => void;
  difficulty: "age-appropriate" | "easy"; setDifficulty: (d: "age-appropriate" | "easy") => void;
  numTeams: number; setNumTeams: (n: number) => void; players: any[];
  onPlayerMove: (pId: string, tIdx: number) => void; onStart: () => void; teamNames: string[];
  updateTeamNames: (names: string[]) => void; onExit: () => void; editTeamName: (idx: number) => void;
}

export default function SetupStep(props: SetupStepProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<any>(null);
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const teamRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (draggedPlayer) e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, [draggedPlayer]);

  const HEBREW_LETTERS = ['א', 'ב', 'ג', 'ד'];

  const getNextTeamName = () => {
    for (let letter of HEBREW_LETTERS) {
      const nameToCheck = `קבוצה ${letter}`;
      if (!props.teamNames.slice(0, props.numTeams).includes(nameToCheck)) return nameToCheck;
    }
    return `קבוצה ?`;
  };

  const handleAddTeam = () => {
    if (props.numTeams >= 4) return;
    const newNames = [...props.teamNames];
    newNames[props.numTeams] = getNextTeamName();
    props.updateTeamNames(newNames);
    props.setNumTeams(props.numTeams + 1);
  };

  const handleRemoveTeam = (idx: number) => {
    const newNames = [...props.teamNames];
    newNames.splice(idx, 1);
    props.updateTeamNames(newNames);
    props.setNumTeams(props.numTeams - 1);
  };

  const hasEmptyTeam = Array.from({ length: props.numTeams }).some((_, i) => 
    props.players.filter(p => p.teamIdx === i).length === 0
  );

  const canStart = props.gameMode === "individual" ? props.players.length >= 2 : 
    Array.from({ length: props.numTeams }).every((_, i) => props.players.filter(p => p.teamIdx === i).length >= 2);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedPlayer) return;
    if (ghostRef.current) {
      ghostRef.current.style.left = `${e.clientX - 60}px`;
      ghostRef.current.style.top = `${e.clientY - 25}px`;
    }
    let found: number | null = null;
    const count = props.gameMode === "team" ? props.numTeams : 1;
    for (let i = 0; i < count; i++) {
      const rect = teamRefs.current[i]?.getBoundingClientRect();
      if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        found = i;
        break;
      }
    }
    if (found !== hoveredTeam) setHoveredTeam(found);
  };

  return (
    <div 
      style={{ 
        ...styles.flexLayout, 
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr auto',
        height: '100dvh',
        width: '100vw',
        maxWidth: '100%',
        gap: '10px',
        padding: '10px',
        margin: '0 auto',
        overflow: 'hidden',
        boxSizing: 'border-box',
        touchAction: 'none',
        userSelect: 'none',
        overscrollBehavior: 'none',
        direction: 'rtl'
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={() => {
        if (draggedPlayer && hoveredTeam !== null) props.onPlayerMove(draggedPlayer.id, hoveredTeam);
        setDraggedPlayer(null); setHoveredTeam(null);
      }}
    >
      <button onClick={props.onExit} style={{...styles.exitBtnRed, zIndex: 10}}>✕</button>

      {/* Header */}
      <div style={{...styles.setupHeader, width: '100%', boxSizing: 'border-box', padding: '0 5px'}}>
        <div style={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
          קוד: <span style={{ color: '#ffd700', fontWeight: '900', fontSize: '1.6rem', marginRight: '5px' }}>{props.roomId}</span>
        </div>
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button onClick={() => props.setGameMode("individual")} style={{ ...styles.bigToggleBtn, flex: 1, margin: 0, ...(props.gameMode === "individual" ? styles.bigToggleBtnActive : {}) }}>יחידים</button>
          <button onClick={() => props.setGameMode("team")} style={{ ...styles.bigToggleBtn, flex: 1, margin: 0, ...(props.gameMode === "team" ? styles.bigToggleBtnActive : {}) }}>קבוצות</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button onClick={() => props.setDifficulty("age-appropriate")} style={{ ...styles.bigToggleBtn, flex: 1, margin: 0, ...(props.difficulty === "age-appropriate" ? styles.bigToggleBtnActive : {}) }}>מותאמת גיל</button>
          <button onClick={() => props.setDifficulty("easy")} style={{ ...styles.bigToggleBtn, flex: 1, margin: 0, ...(props.difficulty === "easy" ? styles.bigToggleBtnActive : {}) }}>רמה קלה</button>
        </div>
      </div>

      {/* Players Grid */}
      <div style={{ 
        ...styles.setupGrid, 
        gridTemplateColumns: props.gameMode === "team" ? '1fr 1fr' : '1fr',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        marginTop: 0,
        boxSizing: 'border-box',
        gap: '8px'
      }}>
        {Array.from({ length: props.gameMode === "team" ? props.numTeams : 1 }).map((_, tIdx) => {
          const teamPlayers = props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx);
          return (
            <div key={tIdx} ref={el => { teamRefs.current[tIdx] = el; }} style={{ 
              ...styles.teamBox, 
              minHeight: 0, 
              height: '100%', 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column',
              boxSizing: 'border-box',
              touchAction: 'none',
              ...(hoveredTeam === tIdx ? { borderColor: '#ffd700', backgroundColor: 'rgba(255,215,0,0.1)' } : {}) 
            }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '4px', textAlign: 'center', fontSize: '0.75rem', color: '#ffd700', fontWeight: 'bold' }}>
                {props.gameMode === "team" ? props.teamNames[tIdx] : "משתתפים"}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {teamPlayers.map(p => (
                  <div 
                    key={p.id} 
                    onPointerDown={(e) => {
                      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                      setDraggedPlayer(p);
                    }} 
                    style={{ ...styles.playerCard, padding: '6px 2px', fontSize: '0.85rem', flexShrink: 0, touchAction: 'none', width: '100%', boxSizing: 'border-box' }}
                  >
                    {p.name}
                  </div>
                ))}
                {props.gameMode === "team" && props.numTeams > 2 && teamPlayers.length === 0 && (
                  <button onClick={() => handleRemoveTeam(tIdx)} style={{...styles.minusBtnCentered, margin: '5px auto'}}>-</button>
                )}
              </div>
            </div>
          );
        })}
        {props.gameMode === "team" && props.numTeams < 4 && !hasEmptyTeam && (
          <button onClick={handleAddTeam} style={{ ...styles.teamBox, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', minHeight: 0, width: '100%', boxSizing: 'border-box' }}>
            <span style={{ fontSize: '1.5rem', color: '#ffd700' }}>+</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{ width: '100%', paddingBottom: '5px', boxSizing: 'border-box' }}>
        {!canStart && props.gameMode === "team" && <p style={{ color: '#ef4444', fontSize: '0.7rem', textAlign: 'center', marginBottom: '4px' }}>לפחות 2 בכל קבוצה</p>}
        <button onClick={props.onStart} disabled={!canStart} style={{...(canStart ? styles.lobbyButton : styles.disabledButton), width: '100%', margin: 0}}>בואו נשחק! 🚀</button>
      </div>

      {draggedPlayer && (
        <div ref={ghostRef} style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', backgroundColor: '#ffd700', padding: '10px', borderRadius: '12px', color: '#05081c', fontWeight: 'bold', width: '100px', textAlign: 'center' }}>
          {draggedPlayer.name}
        </div>
      )}
    </div>
  );
}