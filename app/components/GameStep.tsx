"use client";

import React from "react";
import { styles } from "../game.styles";

interface GameStepProps {
  timeLeft: number;
  currentWord: { word: string; en: string; img?: string };
  wordRef: React.RefObject<HTMLDivElement | null>;
  skipRef: React.RefObject<HTMLDivElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  isTextOnly: boolean;
  isDraggingWord: boolean;
  targets: string[];
  targetsRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  score: number;
  onPause: () => void;
  activeHover: string | null;
}

export default function GameStep(props: GameStepProps) {
  return (
    <div style={{ ...styles.flexLayout, padding: '10px 0' }}>
      
      {/* טיימר דינמי */}
      <div style={styles.timerDisplay}>{props.timeLeft}</div>

      {/* כפתור דלג ברוחב מלא */}
      <div 
        ref={props.skipRef} 
        style={{
          width: '100%',
          minHeight: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px',
          border: '2px solid #ef4444',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          backgroundColor: props.activeHover === "SKIP" ? "rgba(239, 68, 68, 0.4)" : "transparent"
        }}
      >
        דלג (1-) ⏭️
      </div>

      {/* אזור המילה - מרכזי וגמיש */}
      <div style={styles.wordCardArea}>
        <div
          ref={props.wordRef}
          onPointerDown={props.onPointerDown}
          style={{
            width: 'min(85vw, 300px)', // לא יותר מ-85% מרוחב המסך
            aspectRatio: '1 / 0.8', // שומר על פרופורציה ריבועית-מלבנית
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: props.isDraggingWord ? '0 20px 50px rgba(0,0,0,0.5)' : 'none',
            cursor: 'grab',
            touchAction: 'none',
            zIndex: 100,
            padding: '20px'
          }}
        >
          {props.currentWord?.img && !props.isTextOnly && (
            <img 
              src={props.currentWord.img} 
              alt="" 
              style={{ width: '50%', height: '50%', objectFit: 'contain', marginBottom: '15px' }} 
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', textAlign: 'center' }}>{props.currentWord?.word}</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#64748b', textAlign: 'center', marginTop: '5px' }}>{props.currentWord?.en}</div>
        </div>
      </div>

      {/* כפתורי שחקנים למטה */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginBottom: '15px' }}>
        {props.targets.map((t) => (
          <div
            key={t}
            ref={(el) => { if (props.targetsRef.current) props.targetsRef.current[t] = el; }}
            style={{
              ...styles.guesserButton,
              backgroundColor: props.activeHover === t ? "rgba(255, 215, 0, 0.2)" : "rgba(255,255,255,0.05)",
              borderColor: props.activeHover === t ? "#ffd700" : "rgba(255,255,255,0.1)",
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* פוטר - כפתור השהיה וניקוד */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingBottom: '10px' }}>
        <button onClick={props.onPause} style={{ background: 'rgba(255,255,255,0.1)', width: '48px', height: '48px', borderRadius: '14px', border: 'none', color: 'white', fontSize: '20px' }}>⏸️</button>
        <div style={{ color: '#ffd700', fontSize: '2rem', fontWeight: '900' }}>{props.score}</div>
      </div>
    </div>
  );
}