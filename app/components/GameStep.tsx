"use client";

import React from "react";
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
  targetsRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  score: number;
  onPause: () => void;
  onExit: () => void;
  activeHover: string | null;
}

const GameStep: React.FC<GameStepProps> = ({
  timeLeft, currentWord, wordRef, skipRef, onPointerDown, isTextOnly, 
  isDraggingWord, targets, targetsRef, score, onPause, onExit, activeHover
}) => {
  return (
    <div style={styles.stepContainer}>
      <button onClick={onExit} style={styles.exitBtn}>✕</button>
      <button onClick={onPause} style={{...styles.exitBtn, left:'auto', right:'15px', borderRadius:'10px', width:'auto', padding:'0 15px', fontSize:'14px', background:'#ffd700', color:'#000'}}>⏸️ השהה</button>

      <div style={{fontSize:'60px', fontWeight:'900', color: timeLeft <= 10 ? '#ff4444' : '#ffd700', marginTop:'40px'}}>{timeLeft}</div>
      
      <div style={{flex: 1, position:'relative', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <div style={{display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center', marginBottom:'40px'}}>
           {targets.map(t => (
             <div key={t} ref={(el) => { if (targetsRef.current) targetsRef.current[t] = el; }} style={{
               padding:'12px 20px', borderRadius:'15px', border:'2px solid',
               borderColor: activeHover === t ? '#ffd700' : 'rgba(255,255,255,0.1)',
               backgroundColor: activeHover === t ? 'rgba(255,215,0,0.2)' : 'transparent',
               color: '#fff', fontWeight:'bold'
             }}>{t}</div>
           ))}
        </div>

        <div 
          ref={wordRef}
          onPointerDown={onPointerDown}
          style={{
            width: '220px', height: '180px', backgroundColor: '#fff', borderRadius: '20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#000', cursor: 'grab', boxShadow: isDraggingWord ? '0 10px 30px rgba(0,0,0,0.5)' : '0 4px 10px rgba(0,0,0,0.2)',
            zIndex: 10, touchAction: 'none'
          }}
        >
          {currentWord?.img && !isTextOnly ? (
            <img src={currentWord.img} alt="" style={{width:'80%', height:'60%', objectFit:'contain'}} />
          ) : null}
          <div style={{fontSize: '24px', fontWeight: 'bold', marginTop: '10px'}}>{currentWord?.word}</div>
        </div>

        <div 
          ref={skipRef}
          style={{
            marginTop: '60px', width: '220px', padding: '15px', borderRadius: '50px',
            border: '2px solid', borderColor: activeHover === 'SKIP' ? '#ff4444' : 'rgba(255,255,255,0.2)',
            backgroundColor: activeHover === 'SKIP' ? 'rgba(255,68,68,0.2)' : 'transparent',
            textAlign: 'center', color: '#fff', fontWeight: 'bold'
          }}
        >
          דלג (1-)
        </div>
      </div>

      <div style={{fontSize:'18px', marginBottom:'20px', color:'rgba(255,255,255,0.6)'}}>ניקוד בסיבוב: <span style={{color:'#ffd700', fontWeight:'bold'}}>{score}</span></div>
    </div>
  );
};

export default GameStep;