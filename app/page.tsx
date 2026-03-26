"use client";

import { useState, useEffect, CSSProperties } from "react";
import Logo from "./components/Logo";

type WordEntry = { word: string; en: string };
const WORD_DATABASE = [
  { word: "כַּדּוּר", en: "Ball" }, { word: "מָטוֹס", en: "Airplane" }, 
  { word: "מַחְשֵׁב", en: "Computer" }, { word: "הַשְׁרָאָה", en: "Inspiration" }
];

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1:Entry, 2:Lobby, 3:Scoreboard, 4:Game
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 4) {
      setStep(3); 
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, isPaused]);

  if (!mounted) return null;

  const players = [name, "אבא", "אמא", "יעל"];
  const currentWord = WORD_DATABASE[currentWordIndex % WORD_DATABASE.length];

  return (
    <div style={containerStyle}>
      <div style={safeAreaWrapper}>
        
        {/* כפתור X לחזרה (סעיף 17) */}
        {(step >= 2) && <button onClick={() => setStep(1)} style={closeButtonStyle}>✕</button>}

        {step === 1 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={logoSizer}><Logo /></div></div>
            <div style={formCardStyle}>
              <form style={formStyle} onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="שם..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} placeholder="גיל..." />
                <button type="submit" style={goldButtonStyle}>המשך</button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={{width:'100px'}}><Logo /></div></div>
            <button onClick={() => setStep(3)} style={goldButtonStyle}>➕ צור חדר חדש</button>
            <div style={roomListStyle}>
              <div style={roomItemStyle}><span>🏠 חדר: "חלון"</span><button style={joinButtonStyle}>הצטרף</button></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={flexLayout}>
            <div style={scoreCircle}>🏆 {score}</div>
            <h2 style={{color:'white', marginTop:'20px'}}>לוח ניקוד</h2>
            <button onClick={() => { setTimeLeft(60); setIsPaused(false); setStep(4); }} style={goldButtonStyle}>התחל סיבוב 🏁</button>
          </div>
        )}

        {step === 4 && (
          <div style={gameLayout}>
            <div style={gameHeader}>
              <div style={statLabel}>⏱️ {timeLeft}s</div>
              <div style={statLabel}>🏆 {score}</div>
              <button onClick={() => setIsPaused(true)} style={miniPauseBtn}>⏸️</button>
            </div>
            <div style={wordCardArea}>
              <div draggable onDragStart={(e) => e.dataTransfer.setData("word", "true")} style={{ textAlign: 'center' }}>
                <h1 style={{ color: 'white', fontSize: '32px', margin: '0' }}>{currentWord.word}</h1>
                <p style={{ color: '#ffd700', fontSize: '16px', fontWeight: 'bold' }}>{currentWord.en}</p>
              </div>
              {isPaused && (
                <div style={pauseOverlay}>
                  <button onClick={() => setIsPaused(false)} style={actionBtn}>▶️</button>
                </div>
              )}
            </div>
            <div style={guessersBox}>
               {players.filter(p => p !== name).map(p => (
                 <div key={p} onDragOver={(e) => { e.preventDefault(); setDraggedOver(p); }} onDragLeave={() => setDraggedOver(null)}
                      onDrop={() => { setScore(score+1); setCurrentWordIndex(prev=>prev+1); setDraggedOver(null); }}
                      style={{ ...guesserRow, background: draggedOver === p ? 'rgba(16, 185, 129, 0.4)' : guesserRow.background }}>
                     <div style={miniAvatar}>{p[0]}</div>
                     <span style={{ color: 'white', fontWeight: 'bold' }}>{p}</span>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// === Styles ===
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed' };
const safeAreaWrapper: CSSProperties = { width: '100%', maxWidth: '360px', height: '95%', display: 'flex', flexDirection: 'column', padding: '0 20px', boxSizing: 'border-box' };
const flexLayout: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' };
const logoFlexBox: CSSProperties = { width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px' };
const logoSizer: CSSProperties = { width: '180px', display: 'flex', justifyContent: 'center' };
const formCardStyle: CSSProperties = { width: '100%', padding: '25px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' };
const inputStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'right', outline: 'none' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)', color: '#05081c', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer', marginTop: '10px' };
const closeButtonStyle: CSSProperties = { position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#64748b', width: '30px', height: '30px', borderRadius: '50%', zIndex: 100 };
const roomListStyle: CSSProperties = { width: '100%', marginTop: '20px' };
const roomItemStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', color: 'white' };
const joinButtonStyle: CSSProperties = { backgroundColor: '#ffd700', color: '#05081c', border: 'none', padding: '5px 12px', borderRadius: '6px', fontWeight: 'bold' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', gap: '10px', paddingTop: '40px' };
const gameHeader: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const statLabel: CSSProperties = { color: '#ffd700', fontWeight: 'bold', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 15px', borderRadius: '10px' };
const miniPauseBtn: CSSProperties = { background: 'none', border: 'none', color: '#64748b', fontSize: '20px' };
const wordCardArea: CSSProperties = { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px' };
const actionBtn: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', width: '60px', height: '60px', borderRadius: '50%', fontSize: '24px' };
const guessersBox: CSSProperties = { flex: 1.2, display: 'flex', flexDirection: 'column', gap: '8px' };
const guesserRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' };
const miniAvatar: CSSProperties = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' };
const scoreCircle: CSSProperties = { fontSize: '48px', color: '#ffd700', border: '3px solid #ffd700', width: '130px', height: '130px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };