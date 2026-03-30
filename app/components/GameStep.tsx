// app/components/GameStep.tsx
"use client";

import React from "react";
import { styles } from "../game.styles";

interface GameStepProps {
  timeLeft: number;
  currentWord: any;
  wordRef: React.RefObject<HTMLDivElement>;
  skipRef: React.RefObject<HTMLButtonElement>;
  isDraggingWord: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  isTextOnly: boolean;
  targets: string[];
  targetsRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  score: number;
  onPause: () => void;
  activeHover: string | null;
  onGuess: (target: string) => void; // פונקציה חדשה ללחיצה
}

export default function GameStep(props: GameStepProps) {
  return (
    <div style={styles.flexLayout}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>ניקוד: {props.score}</div>
        <button onClick={props.onPause} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 15px', borderRadius: '10px' }}>עצור ⏸️</button>
      </div>

      <div style={styles.timerDisplay}>{props.timeLeft}</div>

      <div style={styles.wordCardArea}>
        <div 
          ref={props.wordRef}
          onPointerDown={props.onPointerDown}
          style={{
            zIndex: 100,
            cursor: 'grab',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            visibility: props.isDraggingWord ? 'hidden' : 'visible'
          }}
        >
          {props.isTextOnly ? (
            <h2 style={{ color: 'white', fontSize: '3rem', textAlign: 'center' }}>{props.currentWord?.word}</h2>
          ) : (
            <>
              <img src={props.currentWord?.image} alt={props.currentWord?.word} style={styles.gameImage} />
              <h2 style={{ color: 'white', fontSize: '2rem', marginTop: '10px' }}>{props.currentWord?.word}</h2>
            </>
          )}
        </div>
      </div>

      {/* אזור המטרות - שמות שחקנים או קבוצות */}
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
        {props.targets.map((target) => (
          <div 
            key={target}
            ref={el => { if(props.targetsRef.current) props.targetsRef.current[target] = el; }}
            onClick={() => props.onGuess(target)}
            style={{ 
              ...styles.targetButton, 
              ...(props.activeHover === target ? styles.targetButtonActive : {}) 
            }}
          >
            {target}
          </div>
        ))}
        
        {/* כפתור דלג (גלד) */}
        <button 
          ref={props.skipRef as any}
          onClick={() => props.onGuess("SKIP")}
          style={{ 
            ...styles.skipButton, 
            gridColumn: 'span 2', 
            ...(props.activeHover === "SKIP" ? styles.skipButtonActive : {}) 
          }}
        >
          דלג (1-) ❌
        </button>
      </div>
    </div>
  );
}