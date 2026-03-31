// app/components/GameStep.tsx
"use client";

import React, { useMemo } from "react";
import { styles } from "../game.styles";

interface GameStepProps {
  roomData: any; userId: string; wordRef: any; skipRef: any;
  isDraggingWord: boolean; onPointerDown: () => void;
  targets: string[]; targetsRef: any; activeHover: string | null;
  updateRoom: (data: any) => void;
}

export default function GameStep(props: GameStepProps) {
  const { roomData, userId } = props;
  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;

  const currentWordData = useMemo(() => {
    const age = parseInt(currentP.age) || 10;
    const isEasy = roomData.difficulty === "easy";
    
    let poolKey: "KIDS" | "JUNIOR" | "TEEN" | "ADULT" = "ADULT";
    let showAssets = false;

    if (isEasy) { poolKey = "KIDS"; showAssets = true; } 
    else {
      if (age <= 6) { poolKey = "KIDS"; showAssets = true; }
      else if (age <= 10) { poolKey = "JUNIOR"; showAssets = true; }
      else if (age <= 16) { poolKey = "TEEN"; showAssets = false; }
      else { poolKey = "ADULT"; showAssets = false; }
    }

    const idx = roomData.poolIndices?.[poolKey] || 0;
    const pool = roomData.shuffledPools?.[poolKey] || [];
    const wordObj = pool[idx % pool.length] || { word: "טוען...", en: "" };

    return { ...wordObj, showAssets, activeKey: poolKey };
  }, [roomData.currentTurnIdx, roomData.poolIndices]);

  if (!isIDescriber) {
    return (
      <div style={styles.flexLayout}>
        <div style={{ marginTop: '120px', textAlign: 'center' }}>
          <h2 style={{ color: '#ffd700', fontSize: '2rem' }}>{currentP.name} מתאר/ת...</h2>
          <p style={{ color: 'white', fontSize: '1.2rem', opacity: 0.8 }}>נסו לנחש את המילה!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.flexLayout}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '15px 20px' }}>
        <div style={{ color: '#ef4444', fontWeight: '900', fontSize: '2rem' }}>{roomData.timeLeft}</div>
        <div style={{ color: '#ffd700', fontWeight: '900', fontSize: '2rem' }}>{roomData.roundScore}</div>
      </div>

      <div ref={props.wordRef} onPointerDown={props.onPointerDown} style={{
          width: '280px', height: '380px', backgroundColor: 'white', borderRadius: '35px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 15px 45px rgba(0,0,0,0.6)', cursor: 'grab', zIndex: 100, padding: '20px',
          position: 'relative', touchAction: 'none'
        }}>
        {currentWordData.showAssets && currentWordData.img && (
          <div style={{ width: '100%', height: '180px', marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
            <img src={currentWordData.img} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        )}
        <div style={{ color: '#05081c', fontSize: '2.5rem', fontWeight: '900', textAlign: 'center', lineHeight: 1.1 }}>
          {currentWordData.word}
        </div>
        {currentWordData.showAssets && currentWordData.en && (
          <div style={{ color: '#05081c', fontSize: '1.2rem', opacity: 0.5, marginTop: '10px', fontWeight: 'bold' }}>
            {currentWordData.en}
          </div>
        )}
      </div>

      <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
        <button ref={props.skipRef} style={{ height: '70px', borderRadius: '20px', border: '2px dashed #ef4444', color: '#ef4444', fontWeight: '900', fontSize: '1.2rem' }}>דלג (-1)</button>
        {props.targets.map(target => (
          <div key={target} ref={(el) => { if (props.targetsRef.current) props.targetsRef.current[target] = el; }} 
            style={{ height: '90px', borderRadius: '25px', border: '2px solid #ffd700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: '900', backgroundColor: props.activeHover === target ? '#ffd700' : 'rgba(255,215,0,0.05)', color: props.activeHover === target ? '#05081c' : '#ffd700' }}>
            {target} (+1)
          </div>
        ))}
      </div>
    </div>
  );
}