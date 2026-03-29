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

const GameStep: React.FC<GameStepProps> = ({
  timeLeft, currentWord, wordRef, skipRef, onPointerDown, isTextOnly, 
  isDraggingWord, targets, targetsRef, score, onPause, activeHover
}) => {
  return (
    <div style={{...styles.stepContainer, justifyContent: 'space-between', padding: '10px 0'}}>
      
      {/* 1. דלג למעלה - ברוחב 320px */}
      <div 
        ref={skipRef} 
        style={{
          ...styles.skipButton,
          borderColor: activeHover === "SKIP" ? "#fff" : "#ef4444",
          backgroundColor: activeHover === "SKIP" ? "rgba(239, 68, 68, 0.4)" : "transparent"
        }}
      >
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>דלג (1-) ⏭️</span>
      </div>

      <div style={styles.timerDisplay}>{timeLeft}</div>

      {/* 2. האובייקט באמצע - תמונה, עברית ואנגלית באותו גודל */}
      <div style={styles.wordCardArea}>
        <div
          ref={wordRef}
          onPointerDown={onPointerDown}
          style={{
            width: '280px',
            height: '240px',
            backgroundColor: 'white',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isDraggingWord ? '0 20px 50px rgba(0,0,0,0.5)' : 'none',
            cursor: 'grab',
            touchAction: 'none',
            zIndex: 100,
            padding: '20px',
            position: 'relative'
          }}
        >
          {currentWord?.img && !isTextOnly && (
            <img src={currentWord.img} alt="" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '10px' }} />
          )}
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#05081c', textAlign: 'center' }}>{currentWord?.word}</div>
          {/* מילה באנגלית באותו גודל אך צבע שונה */}
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#64748b', textAlign: 'center', marginTop: '5px' }}>{currentWord?.en}</div>
        </div>
      </div>

      {/* 3. כפתורי המטרה למטה - באותו רוחב של הדלג */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {targets.map((t) => (
          <div
            key={t}
            ref={(el) => { if (targetsRef.current) targetsRef.current[t] = el; }}
            style={{
              ...styles.guesserButton,
              borderColor: activeHover === t ? "#ffd700" : "rgba(255,255,255,0.1)",
              backgroundColor: activeHover === t ? "rgba(255, 215, 0, 0.15)" : "rgba(255,255,255,0.05)"
            }}
          >
            <div style={styles.miniAvatar}>{t[0]}</div>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{t}</span>
          </div>
        ))}
      </div>

      <div style={styles.gameFooter}>
        <button onClick={onPause} style={styles.modernPauseBtn}>⏸️</button>
        <div style={styles.bottomScore}>{score}</div>
      </div>
    </div>
  );
};

export default GameStep;