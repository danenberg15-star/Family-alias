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
    <div style={{ ...styles.flexLayout, justifyContent: 'space-between', padding: '10px 0' }}>
      
      {/* 1. דלג למעלה */}
      <div 
        ref={props.skipRef} 
        style={{
          width: '320px',
          padding: '12px',
          borderRadius: '12px',
          border: '2px solid #ef4444',
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          backgroundColor: props.activeHover === "SKIP" ? "rgba(239, 68, 68, 0.4)" : "transparent"
        }}
      >
        דלג (1-) ⏭️
      </div>

      <div style={styles.timerDisplay}>{props.timeLeft}</div>

      {/* 2. האובייקט באמצע */}
      <div style={{ width: '320px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div
          ref={props.wordRef}
          onPointerDown={props.onPointerDown}
          style={{
            width: '260px',
            height: '220px',
            backgroundColor: 'white',
            borderRadius: '24px',
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
            <img src={props.currentWord.img} alt="" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '10px' }} />
          )}
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#05081c', textAlign: 'center' }}>{props.currentWord?.word}</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#64748b', textAlign: 'center', marginTop: '5px' }}>{props.currentWord?.en}</div>
        </div>
      </div>

      {/* 3. שחקנים למטה */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '320px', marginBottom: '10px' }}>
        {props.targets.map((t) => (
          <div
            key={t}
            ref={(el) => { if (props.targetsRef.current) props.targetsRef.current[t] = el; }}
            style={{
              padding: '15px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: props.activeHover === t ? "rgba(255, 215, 0, 0.2)" : "rgba(255,255,255,0.05)",
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {t}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '320px', paddingBottom: '20px' }}>
        <button onClick={props.onPause} style={{ background: 'rgba(255,255,255,0.1)', width: '45px', height: '45px', borderRadius: '12px', border: 'none', color: 'white' }}>⏸️</button>
        <div style={{ color: '#ffd700', fontSize: '28px', fontWeight: 'bold' }}>{props.score}</div>
      </div>
    </div>
  );
}