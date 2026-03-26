"use client";

import { useState, useEffect, CSSProperties, useRef } from "react";
import Logo from "./components/Logo";

type WordEntry = { word: string; en: string };
const WORD_DATABASE = [
  { word: "כַּדּוּר", en: "Ball" }, { word: "מָטוֹס", en: "Airplane" }, 
  { word: "מַחְשֵׁב", en: "Computer" }, { word: "הַשְׁרָאָה", en: "Inspiration" }
];

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  // לוגיקת גרירה מיידית
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [activePlayerHover, setActivePlayerHover] = useState<string | null>(null);
  const playersRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // פונקציות גרירה מהירות (Touch/Pointer)
  const startDrag = (e: React.PointerEvent) => {
    if (isPaused) return;
    setIsDragging(true);
    setDragPos({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });

    // בדיקה מעל איזה שחקן אנחנו נמצאים (Hit Detection)
    let hovered: string | null = null;
    Object.entries(playersRef.current).forEach(([pName, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          hovered = pName;
        }
      }
    });
    setActivePlayerHover(hovered);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!isDragging) return;
    if (activePlayerHover) {
      setScore(prev => prev + 1);
      setCurrentWordIndex(prev => prev + 1);
    }
    setIsDragging(false);
    setActivePlayerHover(null);
    setDragPos({ x: 0, y: 0 });
  };

  return (
    <div style={containerStyle}>
      <div style={safeAreaWrapper}>
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
          </div>
        )}

        {step === 3 && (
          <div style={flexLayout}>
            <div style={scoreCircle}>🏆 {score}</div>
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
              <div 
                onPointerDown={startDrag}
                onPointerMove={onDrag}
                onPointerUp={endDrag}
                style={{
                  ...wordItemStyle,
                  transform: isDragging ? `translate(${dragPos.x - dragPos.x}px, ${dragPos.y - dragPos.y}px)` : 'none',
                  position: isDragging ? 'fixed' : 'relative',
                  left: isDragging ? dragPos.x - 75 : 'auto',
                  top: isDragging ? dragPos.y - 40 : 'auto',
                  zIndex: 1000,
                  opacity: isDragging ? 0.8 : 1,
                  backgroundColor: isDragging ? 'rgba(79, 70, 229, 0.4)' : 'transparent',
                  padding: '20px',
                  borderRadius: '20px'
                }}
              >
                <h1 style={{ color: 'white', fontSize: '32px', margin: '0', pointerEvents: 'none' }}>{currentWord.word}</h1>
                <p style={{ color: '#ffd700', fontSize: '16px', fontWeight: 'bold', pointerEvents: 'none' }}>{currentWord.en}</p>
              </div>
              {isPaused && (
                <div style={pauseOverlay}><button onClick={() => setIsPaused(false)} style={actionBtn}>▶️</button></div>
              )}
            </div>

            <div style={guessersBox}>
               {players.filter(p => p !== name).map(p => (
                 <div 
                    key={p} 
                    ref={el => { playersRef.current[p] = el; }}
                    style={{ 
                      ...guesserRow, 
                      borderColor: activePlayerHover === p ? '#10b981' : 'rgba(255,255,255,0.1)',
                      background: activePlayerHover === p ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                      transform: activePlayerHover === p ? 'scale(1.05)' : 'scale(1)'
                    }}
                 >
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
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none' };
const safeAreaWrapper: CSSProperties = { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '0 20px', boxSizing: 'border-box' };
const flexLayout: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' };
const logoFlexBox: CSSProperties = { width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px' };
const logoSizer: CSSProperties = { width: '180px', display: 'flex', justifyContent: 'center' };
const formCardStyle: CSSProperties = { width: '100%', padding: '25px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' };
const inputStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'right', outline: 'none' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)', color: '#05081c', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer', marginTop: '10px' };
const closeButtonStyle: CSSProperties = { position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#64748b', width: '30px', height: '30px', borderRadius: '50%', zIndex: 100 };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', gap: '10px', paddingTop: '40px' };
const gameHeader: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const statLabel: CSSProperties = { color: '#ffd700', fontWeight: 'bold', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 15px', borderRadius: '10px' };
const miniPauseBtn: CSSProperties = { background: 'none', border: 'none', color: '#64748b', fontSize: '20px' };
const wordCardArea: CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const wordItemStyle: CSSProperties = { cursor: 'pointer', touchAction: 'none', userSelect: 'none', textAlign: 'center' };
const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', zIndex: 2000 };
const actionBtn: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', width: '60px', height: '60px', borderRadius: '50%', fontSize: '24px' };
const guessersBox: CSSProperties = { flex: 1.2, display: 'flex', flexDirection: 'column', gap: '8px' };
const guesserRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', border: '2px solid transparent', transition: '0.1s all' };
const miniAvatar: CSSProperties = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' };
const scoreCircle: CSSProperties = { fontSize: '48px', color: '#ffd700', border: '3px solid #ffd700', width: '130px', height: '130px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };