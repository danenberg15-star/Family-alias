"use client";

import WordCard from "./WordCard";
import { styles } from "../game.styles";

interface GameStepProps {
  timeLeft: number;
  currentWord: any;
  wordRef: React.RefObject<HTMLDivElement | null>;
  skipRef: React.RefObject<HTMLDivElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  isTextOnly: boolean;
  isDraggingWord: boolean;
  targets: string[];
  targetsRef: React.MutableRefObject<{[key: string]: HTMLDivElement | null}>;
  onGuess: (isSkip?: boolean) => void;
  score: number;
  onPause: () => void;
  isPaused: boolean;
  onUnpause: () => void;
  activeHover: string | null;
}

export default function GameStep(props: GameStepProps) {
  return (
    <div style={styles.gameLayout}>
      <div style={{...styles.timerDisplay, color: props.timeLeft <= 15 ? '#ef4444' : 'white'}}>
        00:{props.timeLeft < 10 ? `0${props.timeLeft}` : props.timeLeft}
      </div>
      
      <div style={styles.topGroup}>
        <div 
          ref={props.skipRef}
          onPointerDown={(e) => { e.stopPropagation(); props.onGuess(true); }}
          style={{
            ...styles.skipButton, 
            backgroundColor: props.activeHover === "SKIP" ? '#ef4444' : 'transparent', 
            boxShadow: props.activeHover === "SKIP" ? '0 0 20px #ef4444' : 'none'
          }}
        >
          🚫 דלג
        </div>

        <div style={styles.wordCardArea}>
          {props.currentWord && (
            <WordCard 
              word={props.currentWord.word} 
              en={props.currentWord.en} 
              img={props.currentWord.img} 
              wordRef={props.wordRef} 
              onPointerDown={props.onPointerDown} 
              isTextOnly={props.isTextOnly} 
            />
          )}
          {props.isDraggingWord && <div style={{...styles.wordCardPlaceholder, height: '223px'}}></div>}
        </div>

        <div style={styles.guessersBox}>
          {props.targets.map(target => (
            <div 
              key={target} 
              ref={(el) => { if (props.targetsRef.current) props.targetsRef.current[target] = el; }}
              onPointerDown={(e) => { e.stopPropagation(); props.onGuess(false); }} // לחיצה מביאה נקודה
              style={{
                ...styles.guesserButton, 
                backgroundColor: props.activeHover === target ? '#10b981' : 'rgba(255,255,255,0.03)', 
                borderColor: props.activeHover === target ? '#10b981' : 'rgba(255,255,255,0.1)',
                boxShadow: props.activeHover === target ? '0 0 20px #10b981' : 'none'
              }}
            >
              <div style={styles.miniAvatar}>{target[0]}</div>
              <span style={{ color: 'white' }}>{target}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.gameFooter}>
        <div style={styles.bottomScore}>🏆 {props.score}</div>
        <button onClick={props.onPause} style={styles.modernPauseBtn}>⏸️</button>
      </div>

      {props.isPaused && (
        <div style={styles.pauseOverlay}>
          <button onClick={props.onUnpause} style={styles.hugePlayBtn}>▶️</button>
        </div>
      )}
    </div>
  );
}