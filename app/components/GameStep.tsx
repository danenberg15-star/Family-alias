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
  onGuess: (target: string) => void;
}

export default function GameStep(props: GameStepProps) {
  return (
    <div style={styles.flexLayout}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 'bold' }}>ניקוד: {props.score}</div>
        <button onClick={props.onPause} style={{ color: 'white', background: 'none', border: '1px solid white', borderRadius: '10px', padding: '5px 15px' }}>השהה ⏸️</button>
      </div>
      <div style={styles.timerDisplay}>{props.timeLeft}</div>
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img src={props.currentWord?.image} alt={props.currentWord?.word} style={styles.gameImage} />
        <h2 style={{ color: 'white', fontSize: '2.5rem', marginTop: '10px' }}>{props.currentWord?.word}</h2>
      </div>
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
        {props.targets.map(t => (
          <button key={t} onClick={() => props.onGuess(t)} style={styles.targetBtn}>{t}</button>
        ))}
        <button onClick={() => props.onGuess("SKIP")} style={{ gridColumn: 'span 2', padding: '15px', borderRadius: '12px', background: '#ef4444', color: 'white', border: 'none', fontWeight: 'bold' }}>דלג (1-)</button>
      </div>
    </div>
  );
}