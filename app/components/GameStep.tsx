"use client";

import WordCard from "./WordCard";
import { styles } from "../game.styles";

interface GameStepProps {
  timeLeft: number;
  currentWord: any;
  wordRef: React.RefObject<HTMLDivElement | null>;
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
          style={{...styles.skipButton, backgroundColor: props.activeHover === "SKIP" ? '#ef4444' : 'transparent', borderColor: '#ef4444'}}
          onPointerDown={() => props.onGuess(true)}
        >
          🚫 דלג [cite: 1, 23]
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
              style={{...styles.guesserButton, backgroundColor: props.activeHover === target ? '#10b981' : 'rgba(255,255,255,0.03)', borderColor: props.activeHover === target ? '#10b981' : 'rgba(255,255,255,0.1)'}}
            >
              <div style={styles.miniAvatar}>{target[0]}</div>
              <span style={{ color: 'white' }}>{target}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.gameFooter}>
        <div style={styles.bottomScore}>🏆 {props.score} [cite: 1, 30, 31]</div>
        <button onClick={props.onPause} style={styles.modernPauseBtn}>⏸️ [cite: 1, 26]</button>
      </div>

      {props.isPaused && (
        <div style={styles.pauseOverlay}>
          <button onClick={props.onUnpause} style={styles.hugePlayBtn}>▶️ [cite: 1, 27]</button>
        </div>
      )}
    </div>
  );
}