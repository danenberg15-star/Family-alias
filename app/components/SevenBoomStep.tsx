"use client";
import React, { useState, useMemo } from "react";

export default function SevenBoomStep({ roomData, userId, updateRoom, handleAction, onExit }: any) {
  const [showExplanation, setShowExplanation] = useState(true);
  const [wordsCount, setWordsCount] = useState(0);

  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;
  const me = roomData.players.find((p: any) => p.id === userId);

  const myDisplayScore = useMemo(() => {
    if (roomData.gameMode === 'individual') {
      return roomData.totalScores[me?.name] || 0;
    } else {
      const myTeamName = roomData.teamNames[me?.teamIdx];
      return roomData.totalScores[myTeamName] || 0;
    }
  }, [roomData.totalScores, roomData.gameMode, me]);

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
    const index = idxs[key] || 0;
    
    return { 
      ...(pool[index % (pool.length || 1)] || { word: "טוען...", en: "" }), 
      isYoung: (age <= 10 || isEasy) 
    };
  }, [roomData.currentTurnIdx, roomData.poolIndices, roomData.shuffledPools, roomData.difficulty]);

  const handleCorrect = (teamName: string) => {
    handleAction(teamName, 2); // ניקוד כפול ב-7 בום
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

  // מסך הסבר (Screen A)
  if (showExplanation) {
    return (
      <div style={{...s.layout, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <div style={{...s.pauseBox, height: 'auto', padding: '40px 20px', maxWidth: '400px'}}>
          <h1 style={{ color: '#ffd700', fontSize: '3rem', fontWeight: '900', marginBottom: '20px' }}>7 בום! 💣</h1>
          <div style={{ color: 'white', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>
            <p><strong>בשלב זה אין טיימר!</strong></p>
            <p>עליכם לתאר 7 מילים.</p>
            <p>כל הקבוצות יכולות לנחש.</p>
            <p style={{ color: '#ffd700', fontWeight: 'bold', marginTop: '10px' }}>כל ניחוש נכון שווה 2 נקודות!</p>
          </div>
          <button onClick={() => setShowExplanation(false)} style={s.resume}>הבנתי, בואו נתחיל!</button>
        </div>
      </div>
    );
  }

  // מסך המשחק (Screen B) - תואם ל-GameStep
  return (
    <div style={s.layout}>
      <div style={s.header}>
        <div style={s.scoreBox}>🏆 {myDisplayScore}</div>
        {/* מונה מילים במקום טיימר */}
        <div style={{...s.timer, color: '#ffd700', fontSize: '1.5rem', width: 'max-content'}}>מילה {wordsCount + 1} / 7</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={onExit} style={s.icon}>✕</button>
        </div>
      </div>
      
      <button onClick={handleSkip} style={s.skip}>דלג (1-)</button>

      <div style={s.center}>
          <div style={s.card}>
            {isIDescriber ? (
              <>
                {wordData.isYoung ? (
                  <>
                    {wordData.img && <div style={s.imgBox}><img src={wordData.img} alt="" style={s.img} /></div>}
                    <div style={s.heb}>{wordData.word}</div>
                    <div style={s.en}>{wordData.en}</div>
                  </>
                ) : (
                  <>
                    <div style={s.hebL}>{wordData.word}</div>
                    <div style={s.enL}>{wordData.en}</div>
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#ffd700', fontSize: '2rem' }}>{currentP.name} מתאר/ת...</h2>
                <p style={{ opacity: 0.7 }}>כל הקבוצות יכולות לנחש!</p>
              </div>
            )}
          </div>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.8 }}>מי ניחש נכון? (2+)</p>
        <div style={s.grid}>
          {roomData.teamNames.slice(0, roomData.numTeams).map((n: string) => (
            <button key={n} onClick={() => handleCorrect(n)} style={s.target}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', padding: 'env(safe-area-inset-top) 20px 20px', gap: '10px', maxWidth: '600px', margin: '0 auto', direction: 'rtl' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  scoreBox: { backgroundColor: 'rgba(255,215,0,0.15)', padding: '8px 15px', borderRadius: '15px', color: '#ffd700', fontWeight: '900', fontSize: '1.2rem', minWidth: '70px', textAlign: 'center' },
  timer: { fontSize: '2.5rem', fontWeight: '900', color: '#ef4444', position: 'absolute', left: '50%', transform: 'translateX(-50%)' },
  icon: { background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', padding: '5px' },
  skip: { width: '100%', height: '55px', border: '2px dashed #ef4444', borderRadius: '15px', color: '#ef4444', fontWeight: 'bold', background: 'none', cursor: 'pointer', fontSize: '1.1rem' },
  center: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' },
  card: { width: '100%', maxWidth: '320px', height: '100%', maxHeight: '280px', backgroundColor: '#1a1d2e', borderRadius: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  imgBox: { width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'contain' },
  heb: { fontSize: '1.8rem', fontWeight: '900', textAlign: 'center' }, 
  en: { fontSize: '1.3rem', opacity: 0.6, textAlign: 'center' },
  hebL: { fontSize: '2.5rem', fontWeight: '900', textAlign: 'center' }, 
  enL: { fontSize: '1.6rem', opacity: 0.6, textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', paddingBottom: '10px' },
  target: { height: '75px', border: '2px solid #ffd700', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '900', backgroundColor: 'rgba(255,215,0,0.05)', color: '#ffd700', cursor: 'pointer' },
  pauseBox: { width: '100%', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '20px', display: 'flex', flexDirection: 'column' },
  resume: { height: '50px', backgroundColor: '#ffd700', color: '#05081c', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '10px' }
};