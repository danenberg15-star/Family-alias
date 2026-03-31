// app/components/SetupStep.tsx
"use client";

import React from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string;
  gameMode: "individual" | "team";
  setGameMode: (m: "individual" | "team") => void;
  difficulty: "age-appropriate" | "easy";
  setDifficulty: (d: "age-appropriate" | "easy") => void;
  numTeams: number;
  setNumTeams: (n: number) => void;
  players: any[];
  onPlayerMove: (pId: string, tIdx: number) => void;
  onStart: () => void;
  teamNames: string[];
}

export default function SetupStep(props: SetupStepProps) {
  
  // בדיקה אם אפשר להתחיל: בכל קבוצה פעילה חייבים להיות לפחות 2 שחקנים
  const canStart = props.gameMode === "individual" 
    ? props.players.length >= 2
    : Array.from({ length: props.numTeams }).every((_, i) => 
        props.players.filter(p => p.teamIdx === i).length >= 2
      );

  const shareWhatsApp = () => {
    const text = `בואו לשחק איתי אליאס! כנסו לחדר: ${props.roomId}\nלינק: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // חישוב גריד דינמי
  const gridStyle = {
    ...styles.setupGrid,
    gridTemplateColumns: props.gameMode === "team" && props.numTeams === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(130px, 1fr))'
  };

  return (
    <div style={styles.flexLayout}>
      {/* כותרת וקוד חדר */}
      <div style={{ textAlign: 'center', width: '100%', paddingTop: '10px' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>קוד החדר שלך:</span>
        <h1 style={{ ...styles.entryTitle, fontSize: '2.5rem', marginTop: '0' }}>{props.roomId}</h1>
        <button onClick={shareWhatsApp} style={styles.whatsappBtn}>הזמן שחקנים בוואטסאפ 📱</button>
      </div>

      {/* הגדרות משחק */}
      <div style={{ width: '100%', marginTop: '20px' }}>
        <div style={styles.toggleContainer}>
          <button onClick={() => props.setGameMode("individual")} style={props.gameMode === "individual" ? styles.toggleActive : styles.toggleInactive}>יחידים</button>
          <button onClick={() => props.setGameMode("team")} style={props.gameMode === "team" ? styles.toggleActive : styles.toggleInactive}>קבוצות</button>
        </div>
        <div style={styles.toggleContainer}>
          <button onClick={() => props.setDifficulty("age-appropriate")} style={props.difficulty === "age-appropriate" ? styles.toggleActive : styles.toggleInactive}>מותאמת גיל</button>
          <button onClick={() => props.setDifficulty("easy")} style={props.difficulty === "easy" ? styles.toggleActive : styles.toggleInactive}>רמה קלה</button>
        </div>
      </div>

      {/* אזור הקבוצות/שחקנים */}
      <div style={gridStyle}>
        {Array.from({ length: props.gameMode === "team" ? props.numTeams : 1 }).map((_, tIdx) => (
          <div key={tIdx} style={styles.teamBox}>
            <div style={{ borderBottom: '1px solid rgba(255,215,0,0.2)', paddingBottom: '5px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={styles.goldText}>{props.gameMode === "team" ? props.teamNames[tIdx] : "משתתפים"}</span>
              <span style={{ color: 'white', fontSize: '0.8rem' }}>({props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).length})</span>
            </div>
            <div style={{ flex: 1 }}>
              {props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx).map(p => (
                <div key={p.id} style={styles.playerBadge}>{p.name}</div>
              ))}
            </div>
            {/* כפתור העברה מהירה בין קבוצות (במקום גרירה מסובכת בנייד) */}
            {props.gameMode === "team" && (
              <button 
                onClick={() => {
                  const pId = props.players.find(p => p.teamIdx === tIdx)?.id;
                  if (pId) props.onPlayerMove(pId, (tIdx + 1) % props.numTeams);
                }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '5px' }}
              >
                העבר שחקן ⇄
              </button>
            )}
          </div>
        ))}
        
        {/* כפתור הוספת קבוצה */}
        {props.gameMode === "team" && props.numTeams < 4 && (
          <button 
            onClick={() => props.setNumTeams(props.numTeams + 1)}
            style={{ ...styles.teamBox, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', opacity: 0.6 }}
          >
            <span style={{ fontSize: '2rem', color: '#ffd700' }}>+</span>
            <span style={{ color: 'white', fontSize: '0.8rem' }}>הוסף קבוצה</span>
          </button>
        )}
      </div>

      {/* כפתור התחלה */}
      <div style={{ width: '100%', paddingBottom: '10px' }}>
        {!canStart && props.gameMode === "team" && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', marginBottom: '5px' }}>
            חייבים לפחות 2 שחקנים בכל קבוצה כדי להתחיל
          </p>
        )}
        <button 
          onClick={props.onStart} 
          disabled={!canStart}
          style={canStart ? styles.lobbyButton : styles.disabledButton}
        >
          בואו נשחק! 🚀
        </button>
      </div>
    </div>
  );
}