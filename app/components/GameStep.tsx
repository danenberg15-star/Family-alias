// app/components/GameStep.tsx
"use client";

import React from "react";
import { styles } from "../game.styles";

interface GameStepProps {
  timeLeft: number;
  currentWord: any;
  wordRef: React.RefObject<HTMLDivElement | null>;
  skipRef: React.RefObject<HTMLButtonElement | null>;
  isDraggingWord: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  isTextOnly: boolean;
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
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 'bold' }}>ניקוד: {props.score}</div>
        <button onClick={props.onPause} style={{ color: 'white', background: 'none', border: '1px solid white', borderRadius: '10px', padding: '5px 15px' }}>השהה ⏸️</button>
      </div>

      <div style={{ fontSize: '4rem', color: '#ffd700', fontWeight: '900', margin: '10px 0' }}>{props.timeLeft}</div>

      <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div 
          ref={props.wordRef}
          onPointerDown={props.onPointerDown}
          style={{
            zIndex: 100, cursor: 'grab', width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            visibility: props.isDraggingWord ? 'hidden' : 'visible'
          }}
        >
          {props.isTextOnly ? (
            <h2 style={{ color: 'white', fontSize: '3.5rem', textAlign: 'center' }}>{props.currentWord?.word}</h2>
          ) : (
            <>
              <img src={props.currentWord?.image} alt={props.currentWord?.word} style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain', borderRadius: '20px' }} />
              <h2 style={{ color: 'white', fontSize: '2.5rem', marginTop: '10px' }}>{props.currentWord?.word}</h2>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '20px' }}>
        {props.targets.map((t) => (
          <div key={t} ref={el => { if(props.targetsRef.current) props.targetsRef.current[t] = el; }} onClick={() => props.onGuess(t)}
            style={{ 
              minHeight: '60px', borderRadius: '16px', border: '2px solid rgba(255,215,0,0.3)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...(props.activeHover === t ? { borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.2)' } : {}) 
            }}
          >
            {t}
          </div>
        ))}
        <button ref={props.skipRef} onClick={() => props.onGuess("SKIP")}
          style={{ 
            gridColumn: 'span 2', minHeight: '55px', borderRadius: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem',
            ...(props.activeHover === "SKIP" ? { backgroundColor: '#ef4444', color: 'white' } : {}) 
          }}
        >
          דילוג ❌
        </button>
      </div>
    </div>
  );
}