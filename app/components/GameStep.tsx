"use client";
import React, { useMemo } from "react";

export default function GameStep({ roomData, userId, wordRef, skipRef, isDraggingWord, onPointerDown, targets, targetsRef, activeHover, updateRoom, handleAction, onExit }: any) {
  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;

  const wordData = useMemo(() => {
    const age = parseInt(currentP.age) || 10;
    const isEasy = roomData.difficulty === "easy";
    const key: any = (age <= 6 || isEasy) ? "KIDS" : (age <= 10) ? "JUNIOR" : (age <= 16) ? "TEEN" : "ADULT";
    const pool = roomData.shuffledPools?.[key] || [];
    return { ...(pool[(roomData.poolIndices?.[key] || 0) % (pool.length || 1)] || { word: "טוען...", en: "" }), isYoung: (age <= 10 || isEasy) };
  }, [roomData.currentTurnIdx, roomData.poolIndices]);

  const scoreTotal = roomData.totalScores[roomData.gameMode === 'individual' ? currentP.name : roomData.teamNames[currentP.teamIdx]] || 0;

  if (!isIDescriber) return (
    <div style={s.layout}><div style={s.header}><button onClick={onExit} style={s.icon}>✕</button><div style={s.timer}>{roomData.timeLeft}</div><div style={s.icon}></div></div><div style={{ textAlign: 'center', marginTop: '100px' }}><h2 style={{ color: '#ffd700', fontSize: '2.5rem' }}>{currentP.name} מתאר/ת...</h2></div></div>
  );

  return (
    <div style={s.layout}>
      <div style={s.header}><button onClick={onExit} style={s.icon}>✕</button><div style={s.timer}>{roomData.timeLeft}</div><button onClick={() => updateRoom({ isPaused: !roomData.isPaused })} style={s.icon}>{roomData.isPaused ? '▶️' : '⏸️'}</button></div>
      <div style={s.scoreTop}>ניקוד מצטבר: {scoreTotal + (roomData.roundScore || 0)}</div>
      <button ref={skipRef} onClick={() => handleAction("SKIP")} style={{ ...s.skip, backgroundColor: activeHover === "SKIP" ? 'rgba(239,68,68,0.2)' : 'transparent' }}>דלג (-1)</button>
      <div style={s.center}>
        {roomData.isPaused ? (
          <div style={s.pauseBox}><h3 style={{ color: '#ffd700' }}>ניהול ניקוד</h3><div style={s.scroll}>{(roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)).map((n: string) => (<div key={n} style={s.row}><span>{n}</span><div style={s.rowBtn}><button onClick={() => { const sc = {...roomData.totalScores}; sc[n]=(sc[n]||0)-1; updateRoom({totalScores:sc}); }}>-</button><span>{roomData.totalScores[n] || 0}</span><button onClick={() => { const sc = {...roomData.totalScores}; sc[n]=(sc[n]||0)+1; updateRoom({totalScores:sc}); }}>+</button></div></div>))}</div><button onClick={() => updateRoom({ isPaused: false })} style={s.resume}>המשך</button></div>
        ) : (
          <div ref={wordRef} onPointerDown={onPointerDown} style={{ ...s.card, opacity: isDraggingWord ? 0.8 : 1 }}>
            {wordData.isYoung ? (<>{wordData.img && <div style={s.imgBox}><img src={wordData.img} alt="" style={s.img} /></div>}<div style={s.heb}>{wordData.word}</div><div style={s.en}>{wordData.en}</div></>) : <><div style={s.hebL}>{wordData.word}</div><div style={s.enL}>{wordData.en}</div></>}
          </div>
        )}
      </div>
      {!roomData.isPaused && <div style={s.grid}>{targets.map((n: string) => (<div key={n} ref={(el) => { if (targetsRef.current) targetsRef.current[n] = el; }} onClick={() => handleAction(n)} style={{ ...s.target, backgroundColor: activeHover === n ? '#ffd700' : 'rgba(255,215,0,0.05)', color: activeHover === n ? '#05081c' : '#ffd700' }}>{n} (+1)</div>))}</div>}
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', padding: 'env(safe-area-inset-top) 20px 20px', gap: '10px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', position: 'relative' },
  timer: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '2.8rem', fontWeight: '900', color: '#ef4444' },
  icon: { background: 'none', border: 'none', color: 'white', fontSize: '2rem' },
  scoreTop: { textAlign: 'center', color: '#ffd700', fontWeight: 'bold', fontSize: '1.2rem' },
  skip: { width: '100%', height: '60px', border: '2px dashed #ef4444', borderRadius: '15px', color: '#ef4444', fontWeight: 'bold' },
  center: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: '320px', height: '380px', backgroundColor: '#1a1d2e', borderRadius: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', touchAction: 'none' },
  imgBox: { width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' },
  img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  heb: { fontSize: '2.2rem', fontWeight: '900' }, en: { fontSize: '1.2rem', opacity: 0.6 },
  hebL: { fontSize: '3.5rem', fontWeight: '900', textAlign: 'center' }, enL: { fontSize: '1.8rem', opacity: 0.6 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' },
  target: { height: '80px', border: '2px solid #ffd700', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: '900' },
  pauseBox: { width: '100%', height: '100%', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '20px', display: 'flex', flexDirection: 'column' },
  scroll: { flex: 1, overflowY: 'auto', margin: '10px 0' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' },
  rowBtn: { display: 'flex', gap: '15px', alignItems: 'center' },
  resume: { height: '50px', backgroundColor: '#ffd700', color: '#05081c', borderRadius: '15px', fontWeight: 'bold' }
};