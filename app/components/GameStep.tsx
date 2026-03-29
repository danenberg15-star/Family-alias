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
  onTargetClick: (target: string) => void;
  onSkipClick: () => void;
}

const GameStep: React.FC<GameStepProps> = ({
  timeLeft, currentWord, wordRef, skipRef, onPointerDown, isTextOnly, 
  isDraggingWord, targets, targetsRef, score, onPause, activeHover, 
  onTargetClick, onSkipClick
}) => {
  return (
    <div style={{...styles.stepContainer, justifyContent: 'space-between', padding: '10px 0'}}>
      
      {/* 1. דלג למעלה - רוחב מלא */}
      <div
        ref={skipRef}
        onClick={onSkipClick}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "15px",
          border: "2px solid",
          borderColor: activeHover === "SKIP" ? "#ff4444" : "rgba(255,68,68,0.3)",
          backgroundColor: activeHover === "SKIP" ? "rgba(255,68,68,0.2)" : "rgba(255,68,68,0.1)",
          textAlign: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "20px",
          cursor: "pointer"
        }}
      >
        דלג (1-)
      </div>

      {/* מידע אמצעי: טיימר וניקוד */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', padding: '0 10px' }}>
        <div style={{ fontSize: "22px", fontWeight: "900", color: timeLeft <= 10 ? "#ff4444" : "#ffd700" }}>{timeLeft} ש'</div>
        <div style={{ fontSize: "18px", color: "#fff" }}>ניקוד: <span style={{color: "#ffd700"}}>{score}</span></div>
        <button onClick={onPause} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>⏸️</button>
      </div>

      {/* 2. האובייקט באמצע - עברית ואנגלית באותו גודל */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div
          ref={wordRef}
          onPointerDown={onPointerDown}
          style={{
            width: "280px",
            minHeight: "200px",
            backgroundColor: "#fff",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            cursor: "grab",
            boxShadow: isDraggingWord ? "0 15px 40px rgba(0,0,0,0.6)" : "0 4px 15px rgba(0,0,0,0.2)",
            zIndex: 10,
            touchAction: "none",
            padding: "20px"
          }}
        >
          {currentWord?.img && !isTextOnly && (
            <img src={currentWord.img} alt="" style={{ width: "80px", height: "80px", objectFit: "contain", marginBottom: "10px" }} />
          )}
          <div style={{ fontSize: "32px", fontWeight: "900", textAlign: 'center', lineHeight: '1.1' }}>{currentWord?.word}</div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "#888", textAlign: 'center', marginTop: "8px", lineHeight: '1.1' }}>{currentWord?.en}</div>
        </div>
      </div>

      {/* 3. כפתורי השחקנים למטה - רוחב מלא כמו הדלג */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
        {targets.map((t) => (
          <div
            key={t}
            ref={(el) => { if (targetsRef.current) targetsRef.current[t] = el; }}
            onClick={() => onTargetClick(t)}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "15px",
              border: "2px solid",
              borderColor: activeHover === t ? "#ffd700" : "rgba(255,255,255,0.1)",
              backgroundColor: activeHover === t ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.05)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "center",
              cursor: "pointer"
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameStep;