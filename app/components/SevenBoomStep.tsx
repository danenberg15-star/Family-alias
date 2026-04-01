"use client";

import React, { useState, useMemo } from "react";
import { styles } from "../game.styles";

export default function SevenBoomStep({ roomData, userId, updateRoom, handleAction, onExit }: any) {
  const [showExplanation, setShowExplanation] = useState(true);
  const [wordsCount, setWordsCount] = useState(0);

  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;

  const wordData = useMemo(() => {
    const age = parseInt(currentP.age) || 10;
    const isEasy = roomData.difficulty === "easy";
    const idxs = roomData.poolIndices || { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 };
    
    let key: "KIDS" | "JUNIOR" | "TEEN" | "ADULT";
    if (isEasy || age <= 6) key = "KIDS";
    else if (age <= 10) key = "JUNIOR";
    else if (age <= 16) key = (idxs.TEEN + idxs.JUNIOR) % 2 === 0 ? "TEEN" : "JUNIOR";
    else key = (idxs.ADULT + idxs.TEEN) % 2 === 0 ? "ADULT" : "TEEN";
    
    const pool = roomData.shuffledPools?.[key] || [];
    return pool[idxs[key] % pool.length] || { heb: "נגמרו המילים", en: "" };
  }, [roomData.poolIndices, roomData.shuffledPools, currentP]);

  const handleCorrect = (teamName: string) => {
    handleAction(teamName, 2); // 2 נקודות ב-7 בום
    if (wordsCount + 1 >= 7) {
      updateRoom({ step: 6 });
    } else {
      setWordsCount(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    handleAction("SKIP");
    if (wordsCount + 1 >= 7) {
      updateRoom({ step: 6 });
    } else {
      setWordsCount(prev => prev + 1);
    }
  };

  if (showExplanation) {
    return (
      <div style={{ ...styles.flexLayout, padding: '30px', textAlign: 'center', backgroundColor: '#05081c' }}>
        <h1 style={{ color: '#ffd700', fontSize: '3rem', fontWeight: '900', marginBottom: '20px' }}>7 בום! 💣</h1>
        <div style={{ backgroundColor: 'rgba(255,215,0,0.1)', padding: '20px', borderRadius: '25px', border: '2px solid #ffd700', color: 'white', fontSize: '1.3rem', lineHeight: '1.6' }}>
          <p><strong>בשלב זה אין טיימר!</strong></p>
          <p>אתם הולכים לקבל 7 מילים לתאר אך הפעם כל הקבוצות יכולות לנחש את המילה ולזכות בניקוד.</p>
          <p style={{ color: '#ffd700', fontWeight: 'bold' }}>בתור זה בלבד כל ניחוש נכון שווה 2 נקודות!</p>
        </div>
        <button onClick={() => setShowExplanation(false)} style={{ ...styles.lobbyButton, marginTop: '30px', width: '200px' }}>סגור</button>
      </div>
    );
  }

  return (
    <div style={{ ...styles.flexLayout, padding: '15px', justifyContent: 'space-between' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <button onClick={onExit} style={styles.exitBtnRed}>✕</button>
        <div style={{ color: '#ffd700', fontSize: '1.2rem', fontWeight: 'bold' }}>מילה: {wordsCount + 1} / 7</div>
        <div style={{ width: '40px' }} />
      </div>

      {/* Word Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <div style={{ color: '#ffd700', fontSize: '0.9rem', opacity: 0.8 }}>המתאר: {currentP.name}</div>
        <div style={{ backgroundColor: 'white', width: '100%', borderRadius: '35px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#05081c', fontSize: '2.8rem', fontWeight: '900', textAlign: 'center' }}>{wordData.heb}</div>
          <div style={{ color: '#05081c', fontSize: '1.5rem', opacity: 0.5, textAlign: 'center' }}>{wordData.en}</div>
        </div>
      </div>

      {/* Targets Area */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' }}>
        <p style={{ textAlign: 'center', color: 'white', fontSize: '1rem', marginBottom: '5px' }}>מי ניחש נכון? (2 נקודות)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {roomData.teamNames.slice(0, roomData.numTeams).map((team: string) => (
            <button 
              key={team} 
              onClick={() => handleCorrect(team)}
              style={{ ...styles.target, fontSize: '1rem', height: '60px' }}
            >
              {team}
            </button>
          ))}
        </div>
        <button onClick={handleSkip} style={{ ...styles.skipBtn, marginTop: '5px' }}>דילוג (-1)</button>
      </div>
    </div>
  );
}