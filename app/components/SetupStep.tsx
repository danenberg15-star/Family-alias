// app/components/SetupStep.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string; gameMode: "individual" | "team"; setGameMode: (m: "individual" | "team") => void;
  difficulty: "age-appropriate" | "easy"; setDifficulty: (d: "age-appropriate" | "easy") => void;
  numTeams: number; setNumTeams: (n: number) => void; players: any[];
  onPlayerMove: (pId: string, tIdx: number) => void; onStart: () => void; teamNames: string[];
}

export default function SetupStep(props: SetupStepProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<any>(null);
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const teamRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const canStart = props.gameMode === "individual" ? props.players.length >= 2 : 
    Array.from({ length: props.numTeams }).every((_, i) => props.players.filter(p => p.teamIdx === i).length >= 2);

  const shareWhatsApp = () => {
    const text = `בואו לשחק איתי אליאס! כנסו לחדר: ${props.roomId}\nhttps://family-alias.vercel.app/`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePointerDown = (e: React.PointerEvent, player: any) => {
    // התחלה מהירה - 100ms
    pressTimer.current = setTimeout(() => {
      setDraggedPlayer(player);
      setGhostPos({ x: e.clientX, y: e.clientY });
    }, 100);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedPlayer) return;
    setGhostPos({ x: e.clientX, y: e.clientY });

    // בדיקת התנגשות עם קבוצות
    let foundTeam: number | null = null;
    const numToSearch = props.gameMode === "team" ? props.numTeams : 1;
    
    for (let i = 0; i < numToSearch; i++) {
      const rect = teamRefs.current[i]?.getBoundingClientRect();
      if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        foundTeam = i;
        break;
      }
    }
    setHoveredTeam(foundTeam);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (draggedPlayer && hoveredTeam !== null) {
      props.onPlayerMove(draggedPlayer.id, hoveredTeam);
    }
    setDraggedPlayer(null);
    setHoveredTeam(null);
  };

  return (
    <div style={styles.flexLayout} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      {/* Ghost שחקן שנגרר */}
      {draggedPlayer && (
        <div style={{ ...styles.draggingGhost, left: ghostPos.x - 60, top: ghostPos.y - 25 }}>
          {draggedPlayer.name}
        </div>
      )}

      {/* חלק עליון: קוד ואייקון שיתוף */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: '10px' }}>
        <h1 style={{ ...styles.entryTitle, fontSize: '2.5rem', margin: 0 }}>{props.roomId}</h1>
        <button onClick={shareWhatsApp} style={styles.whatsappIconBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.415 0 12.051c0 2.12.553 4.189 1.601 6.01L0 24l6.135-1.61a11.815 11.815 0 005.912 1.583h.005c6.635 0 12.05-5.417 12.05-12.052a11.75 11.75 0 00-3.528-8.52z"/></svg>
        </button>
      </div>

      <div style={{ width: '100%', marginTop: '15px' }}>
        <div style={styles.toggleContainer}>
          <button onClick={() => props.setGameMode("individual")} style={props.gameMode === "individual" ? styles.toggleActive : styles.toggleInactive}>יחידים</button>
          <button onClick={() => props.setGameMode("team")} style={props.gameMode === "team" ? styles.toggleActive : styles.toggleInactive}>קבוצות</button>
        </div>
      </div>

      {/* גריד קבוצות דינמי */}
      <div style={{ ...styles.setupGrid, gridTemplateColumns: props.gameMode === "team" && props.numTeams === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(130px, 1fr))' }}>
        {Array.from({ length: props.gameMode === "team" ? props.numTeams : 1 }).map((_, tIdx) => (
          <div 
            key={tIdx} 
            ref={el => { teamRefs.current[tIdx] = el; }}
            style={{ ...styles.teamBox, ...(hoveredTeam === tIdx ? styles.teamBoxGlowing : {}) }}
          >
            <div style={{ borderBottom: '1px solid rgba(255,215,0,0.2)', paddingBottom: '5px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={styles.goldText}>{props.gameMode === "team" ? props.teamNames[tIdx] : "משתתפים"}</span>
              <span style={{ color: 'white', fontSize: '0.8rem' }}>({props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).length})</span>
            </div>
            <div style={{ flex: 1 }}>
              {props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).map(p => (
                <div 
                  key={p.id} 
                  onPointerDown={(e) => handlePointerDown(e, p)}
                  style={{ ...styles.playerCard, opacity: draggedPlayer?.id === p.id ? 0 : 1 }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {props.gameMode === "team" && props.numTeams < 4 && (
          <button onClick={() => props.setNumTeams(props.numTeams + 1)} style={{ ...styles.teamBox, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', opacity: 0.6 }}>
            <span style={{ fontSize: '2rem', color: '#ffd700' }}>+</span>
            <span style={{ color: 'white', fontSize: '0.8rem' }}>הוסף קבוצה</span>
          </button>
        )}
      </div>

      <div style={{ width: '100%', paddingBottom: '10px' }}>
        {!canStart && props.gameMode === "team" && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', marginBottom: '5px' }}>חייבים לפחות 2 שחקנים בכל קבוצה</p>}
        <button onClick={props.onStart} disabled={!canStart} style={canStart ? styles.lobbyButton : styles.disabledButton}>בואו נשחק! 🚀</button>
      </div>
    </div>
  );
}