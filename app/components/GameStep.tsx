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
  targets: string[];
  targetsRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  score: number;
  onPause: () => void;
  activeHover: string | null;
  onGuess: (target: string) => void;
}

export default function GameStep(props: GameStepProps) {
  return (
    <div style={styles.flexLayout}>
      {/* שורת כותרת */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>ניקוד נוכחי: {props.score}</div>
        <button onClick={props.onPause} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid white', color: 'white', padding: '6px 18px', borderRadius: '12px', fontWeight: 'bold' }}>
          עצור ⏸️
        </button>
      </div>

      {/* טיימר מודגש */}
      <div style={styles.timerBold}>{props.timeLeft}</div>

      {/* אזור התמונה - תופס את רוב המסך */}
      <div style={styles.imageContainer}>
        <div 
          ref={props.wordRef}
          onPointerDown={props.onPointerDown}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            touchAction: 'none',
            zIndex: 100,
            visibility: props.isDraggingWord ? 'hidden' : 'visible'
          }}
        >
          <img src={props.currentWord?.image} alt={props.currentWord?.word} style={styles.fullImage} />
          <div style={styles.wordOverlay}>{props.currentWord?.word}</div>
        </div>
      </div>

      {/* רשת המטרות - שחקנים/קבוצות ודילוג */}
      <div style={styles.gameTargetsGrid}>
        {props.targets.map((t) => (
          <div 
            key={t}
            ref={el => { if(props.targetsRef.current) props.targetsRef.current[t] = el; }}
            onClick={() => props.onGuess(t)}
            style={{ 
              ...styles.targetBtn, 
              ...(props.activeHover === t ? styles.targetBtnActive : {}) 
            }}
          >
            {t}
          </div>
        ))}
        
        <button 
          ref={props.skipRef as any}
          onClick={() => props.onGuess("SKIP")}
          style={{ 
            ...styles.skipBtn, 
            ...(props.activeHover === "SKIP" ? styles.skipBtnActive : {}) 
          }}
        >
          דילוג (נקודה אדומה -1) ❌
        </button>
      </div>
    </div>
  );
}