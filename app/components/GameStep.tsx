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
      
      {/* 1. דלג למעלה - ברוחב 320px */}
      <div 
        ref={props.skipRef} 
        style={{
          ...styles.skipButton,
          borderColor: props.activeHover === "SKIP" ? "#fff" : "#ef4444",
          backgroundColor: props.activeHover === "SKIP" ? "rgba(239, 68, 68, 0.4)" : "transparent"
        }}
      >
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>דלג (1-) ⏭️</span>
      </div>

      <div style={styles.timerDisplay}>{props.timeLeft}</div>

      {/* 2. האובייקט באמצע - תמונה, עברית ואנגלית באותו גודל */}
      <div style={styles.wordCardArea}>
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

      {/* 3. כפתורי המטרה למטה - באותו רוחב של הדלג */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '5px' }}>גרור לכאן או לחץ:</div>
        {props.targets.map((t) => (
          <div
            key={t}
            ref={(el) => { if (props.targetsRef.current) props.targetsRef.current[t] = el; }}
            style={{
              ...styles.guesserButton,
              borderColor: props.activeHover === t ? "#ffd700" : "rgba(255,255,255,0.1)",
              backgroundColor: props.activeHover === t ? "rgba(255, 215, 0, 0.15)" : "rgba(255,255,255,0.05)"
            }}
          >
            <div style={styles.miniAvatar}>{t[0]}</div>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{t}</span>
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