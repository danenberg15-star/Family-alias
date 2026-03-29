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
  onGuess: (isSkip: boolean) => void;
  score: number;
  onPause: () => void;
  isPaused: boolean;
  onUnpause: () => void;
  activeHover: string | null;
}

export default function GameStep(props: GameStepProps) {
  return (
    <div style={{ ...styles.flexLayout, justifyContent: 'space-between', padding: '10px 0' }}>
      
      {/* 1. דלג למעלה */}
      <div 
        ref={props.skipRef} 
        onClick={() => props.onGuess(true)}
        style={{
          ...styles.skipButton,
          borderColor: props.activeHover === "SKIP" ? "#fff" : "#ef4444",
          backgroundColor: props.activeHover === "SKIP" ? "rgba(239, 68, 68, 0.4)" : "transparent",
          cursor: 'pointer'
        }}
      >
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>דלג (1-) ⏭️</span>
      </div>

      <div style={{...styles.timerDisplay, color: props.timeLeft <= 10 ? '#ef4444' : 'white', margin: '5px 0'}}>
        {props.timeLeft}
      </div>

      {/* 2. האובייקט באמצע */}
      <div style={styles.wordCardArea}>
        <div
          ref={props.wordRef}
          onPointerDown={props.onPointerDown}
          style={{
            width: '280px',
            minHeight: '240px',
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
            padding: '20px',
            position: 'relative'
          }}
        >
          {props.currentWord?.img && !props.isTextOnly && (
            <img src={props.currentWord.img} alt="" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '10px' }} />
          )}
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#05081c', textAlign: 'center', lineHeight: '1.2' }}>{props.currentWord?.word}</div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#64748b', textAlign: 'center', marginTop: '5px', lineHeight: '1.2' }}>{props.currentWord?.en}</div>
        </div>
      </div>

      {/* 3. כפתורי המטרה למטה */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '320px', marginBottom: '10px' }}>
        {props.targets.map((t) => (
          <div
            key={t}
            ref={(el) => { if (props.targetsRef.current) props.targetsRef.current[t] = el; }}
            onClick={() => props.onGuess(false)}
            style={{
              ...styles.guesserButton,
              borderColor: props.activeHover === t ? "#ffd700" : "rgba(255,255,255,0.1)",
              backgroundColor: props.activeHover === t ? "rgba(255, 215, 0, 0.15)" : "rgba(255,255,255,0.05)",
              cursor: 'pointer'
            }}
          >
            <div style={styles.miniAvatar}>{t[0]}</div>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{t}</span>
          </div>
        ))}
      </div>

      <div style={styles.gameFooter}>
        <button onClick={props.onPause} style={styles.modernPauseBtn}>⏸️</button>
        <div style={styles.bottomScore}>{props.score}</div>
      </div>
    </div>
  );
}