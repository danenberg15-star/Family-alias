"use client";

import { useState, useEffect, CSSProperties, DragEvent } from "react";
import Logo from "./components/Logo";

// סוגי נתונים
type WordEntry = { word: string; en: string; img?: string };
type WordDatabase = { KIDS: WordEntry[]; JUNIOR: WordEntry[]; TEEN: WordEntry[]; ADULT: WordEntry[]; };

// מאגר מילים לדוגמה
const WORD_DATABASE: WordDatabase = {
  KIDS: [{ word: "כַּדּוּר", en: "Ball", img: "⚽" }, { word: "בַּיִת", en: "House", img: "🏠" }],
  JUNIOR: [{ word: "מָטוֹס", en: "Airplane", img: "✈️" }, { word: "מַחְשֵׁב", en: "Computer", img: "💻" }],
  TEEN: [{ word: "הַשְׁרָאָה", en: "Inspiration" }, { word: "תַּרְבּוּת", en: "Culture" }],
  ADULT: [{ word: "אַלְתְּרוּאִיזְם", en: "Altruism" }, { word: "דִּיסוֹנַנְס", en: "Dissonance" }]
};

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1:Entry, 2:Lobby, 3:Room, 4:Game
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [ageGroup, setAgeGroup] = useState<keyof WordDatabase>("ADULT");
  const [players, setPlayers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // ניהול טיימר (דקה אחת) - סעיף 26
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 4) {
      setStep(3); // חזרה ללוח ניקוד בסוף דקה (סעיף 36)
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, isPaused]);

  if (!mounted) return null;

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(age);
    let group: keyof WordDatabase = "ADULT";
    if (n <= 6) group = "KIDS"; else if (n <= 10) group = "JUNIOR"; else if (n <= 16) group = "TEEN";
    setAgeGroup(group);
    setPlayers([name, "אבא", "אמא", "יעל"]); // שחקני דמה לבדיקה
    setStep(2);
  };

  const currentWord = WORD_DATABASE[ageGroup][currentWordIndex % WORD_DATABASE[ageGroup].length];

  // לוגיקת גרירה והענקת נקודה (סעיף 24)
  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("word", "true");
  };

  const onDrop = (playerName: string) => {
    setScore(score + 1); // ניחוש נכון: +1 נקודה למתאר (במשחק אישי)
    setCurrentWordIndex(prev => prev + 1); // החלפת מילה
    setDraggedOver(null);
  };

  // אחוז שעון חול (SVG)
  const hourglassPercent = (timeLeft / 60) * 100;

  return (
    <div style={containerStyle}>
      <div style={mobileFrameStyle}>
        
        {/* כפתור X לחזרה ללובי (סעיף 17) */}
        {(step === 3 || step === 4) && <button onClick={() => setStep(2)} style={closeButtonStyle}>✕</button>}

        {step === 1 && (
          <div style={screenContainerStyle}>
            <Logo />
            <div style={formCardStyle}>
              <form onSubmit={handleEntry} style={formStyle}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="שם השחקן..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} placeholder="גיל..." />
                <button type="submit" style={goldButtonStyle}>כניסה</button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={screenContainerStyle}>
            <Logo />
            <button onClick={() => setStep(3)} style={{ ...primaryButtonStyle, marginTop: '30px' }}>➕ צור חדר חדש</button>
            <div style={lobbyRoomsStyle}>
              <h3 style={{ color: 'white', marginBottom: '15px' }}>חדרים פעילים:</h3>
              <div style={roomItemStyle}><span>🏠 חדר: "בלון"</span><button style={joinButtonStyle}>הצטרף</button></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={screenContainerStyle}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>לוח ניקוד</div>
            <div style={scoreBoardStyle}>
               <p style={{ fontSize: '48px', color: '#ffd700', margin: '0' }}>{score}</p>
               <p style={{ fontSize: '14px', color: '#94a3b8' }}>הניקוד שלך</p>
            </div>
            <button onClick={() => { setTimeLeft(60); setIsPaused(false); setStep(4); }} style={{ ...goldButtonStyle, marginTop: '30px' }}>לסיבוב הבא 🏁</button>
          </div>
        )}

        {step === 4 && (
          <div style={gameScreenStyle}>
            <div style={gameHeaderStyle}>
              {/* טיימר שעון חול גרפי (סעיף 26) */}
              <div style={timerContainerStyle}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
                    <path d="M5 22h14" /><path d="M5 2h14" />
                    <path d="M17 22V18.15C17 16.8 16.2 15.6 15 15L13.8 14.4C12.7 13.8 12.7 12.2 13.8 11.6L15 11C16.2 10.4 17 9.2 17 7.85V2M7 22V18.15C7 16.8 7.8 15.6 9 15L10.2 14.4C11.3 13.8 11.3 12.2 10.2 11.6L9 11C7.8 10.4 7 9.2 7 7.85V2"/>
                    <rect x="7" y="2" width="10" height={hourglassPercent * 0.2} fill="#ffd700" opacity="0.3" rx="1" transform="translate(0, 15)" />
                </svg>
                <span>{timeLeft}s</span>
              </div>
              <div style={scoreBoxStyle}>🏆 {score}</div>
              {!isPaused && <button onClick={() => setIsPaused(true)} style={gamePauseButtonStyle}>⏸️</button>}
            </div>

            {/* כרטיסיית המילה עם גרירה פיזית (סעיף 24) */}
            <div style={{ ...wordCardStyle, position: 'relative' }}>
              
              {/* ממשק השהיה (סעיף 27) */}
              {isPaused && (
                <div style={pauseOverlayStyle}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <button onClick={() => setIsPaused(false)} style={playButtonStyle}>▶️</button>
                    <button onClick={() => { setScore(score - 1); setCurrentWordIndex(prev => prev + 1); setIsPaused(false); }} style={foulButtonStyle}>✕</button>
                  </div>
                </div>
              )}

              <div draggable onDragStart={onDragStart} style={draggableWordStyle}>
                <h1 style={{ color: 'white', fontSize: '40px', margin: '0' }}>{currentWord?.word}</h1>
                <p style={{ color: '#ffd700', fontSize: '18px', fontWeight: 'bold' }}>{currentWord?.en}</p>
              </div>
            </div>

            {/* רשימת המנחשים בשורות ממתחת למילה (סעיפים 24, 25) */}
            <div style={guessersAreaStyle}>
               <h4 style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', marginBottom: '15px' }}>גרור למנחש (1+)</h4>
               <div style={guessersListStyle}>
                  {players.filter(p => p !== name).map(p => (
                    <div 
                        key={p}
                        onDragOver={(e) => { e.preventDefault(); setDraggedOver(p); }}
                        onDragLeave={() => setDraggedOver(null)}
                        onDrop={() => onDrop(p)}
                        style={{
                            ...guesserRowStyle,
                            background: draggedOver === p ? 'rgba(16, 185, 129, 0.4)' : guesserRowStyle.background,
                            borderColor: draggedOver === p ? '#10b981' : guesserRowStyle.borderColor,
                        }}
                    >
                        <div style={guesserAvatarStyle}>{p[0]}</div>
                        <span style={guesserNameStyle}>{p}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// === CSS Styles (Premium & Gold) ===

const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#02040a', direction: 'rtl', fontFamily: 'system-ui, sans-serif' };
const mobileFrameStyle: CSSProperties = { width: '100%', maxWidth: '380px', height: '85vh', backgroundColor: '#05081c', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', position: 'relative', borderRadius: '40px', border: '8px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', overflow: 'hidden' };
const screenContainerStyle: CSSProperties = { width: '100%', textAlign: 'center', marginTop: '30px' };

const closeButtonStyle: CSSProperties = { position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', zIndex: 100 };

// כפתורים וטפסים (הצרת רוחב - סעיף 2)
const formCardStyle: CSSProperties = { width: '90%', padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '20px', marginInline: 'auto' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' };
const inputStyle: CSSProperties = { width: '90%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', textAlign: 'right', outline: 'none' };

// כפתור זהב יוקרתי (סעיף 35)
const goldButtonStyle: CSSProperties = { width: '90%', padding: '15px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)', color: '#05081c', fontWeight: 'bold', fontSize: '17px', border: '1px solid #d4af37', cursor: 'pointer', boxShadow: '0 4px 6px rgba(212, 175, 55, 0.3)', transition: '0.2s' };
const primaryButtonStyle: CSSProperties = { width: '90%', padding: '15px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' };

const lobbyRoomsStyle: CSSProperties = { marginTop: '40px', textAlign: 'right', paddingInline: '20px', width: '100%', boxSizing: 'border-box' };
const roomItemStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '8px', color: 'white' };
const joinButtonStyle: CSSProperties = { backgroundColor: '#ffd700', color: '#05081c', border: 'none', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' };

const scoreBoardStyle: CSSProperties = { width: '80%', padding: '30px 20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '2px solid #ffd700', marginTop: '20px', marginInline: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' };

// עיצוב מסך משחק (סעיף 5)
const gameScreenStyle: CSSProperties = { width: '100%', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' };
const gameHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '15px', padding: '0 5px' };

// טיימר גרפי (שעון חול - סעיף 26)
const timerContainerStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd700', fontWeight: 'bold', fontSize: '18px' };
const scoreBoxStyle: CSSProperties = { backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 15px', borderRadius: '8px', color: '#ffd700', fontWeight: 'bold', fontSize: '18px' };
const gamePauseButtonStyle: CSSProperties = { background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer' };

// כרטיסיית המילה
const wordCardStyle: CSSProperties = { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', touchAction: 'none' };
const draggableWordStyle: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'grab', transition: '0.1s' };
const hintStyle: CSSProperties = { textAlign: 'center', padding: '10px', color: 'rgba(255, 255, 255, 0.15)', fontSize: '10px' };

// ממשק השהיה ועבירה (סעיף 27)
const pauseOverlayStyle: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 };
const playButtonStyle: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px' };
const foulButtonStyle: CSSProperties = { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px' };

// רשימת שחקנים המנחשים (שודרג - סעיפים 24, 25)
const guessersAreaStyle: CSSProperties = { width: '100%', padding: '15px 10px', boxSizing: 'border-box' };
const guessersListStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' };
const guesserRowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'default', transition: '0.15s' };
const guesserAvatarStyle: CSSProperties = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)' };
const guesserNameStyle: CSSProperties = { fontSize: '14px', color: 'white', fontWeight: 'bold' };