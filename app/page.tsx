"use client";

import { useState, useEffect, CSSProperties } from "react";
import Logo from "./components/Logo";

type WordEntry = { word: string; en: string; img?: string };
type WordDatabase = { KIDS: WordEntry[]; JUNIOR: WordEntry[]; TEEN: WordEntry[]; ADULT: WordEntry[]; };

const WORD_DATABASE: WordDatabase = {
  KIDS: [{ word: "כַּדּוּר", en: "Ball", img: "⚽" }, { word: "בַּיִת", en: "House", img: "🏠" }],
  JUNIOR: [{ word: "מָטוֹס", en: "Airplane", img: "✈️" }, { word: "מַחְשֵׁב", en: "Computer", img: "💻" }],
  TEEN: [{ word: "הַשְׁרָאָה", en: "Inspiration" }, { word: "תַּרְבּוּת", en: "Culture" }],
  ADULT: [{ word: "אַלְתְּרוּאִיזְם", en: "Altruism" }, { word: "פָּרָדִיגְמָה", en: "Paradigm" }]
};

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [ageGroup, setAgeGroup] = useState<keyof WordDatabase>("ADULT");
  const [players, setPlayers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(age);
    let group: keyof WordDatabase = "ADULT";
    if (n <= 6) group = "KIDS"; else if (n <= 10) group = "JUNIOR"; else if (n <= 16) group = "TEEN";
    setAgeGroup(group);
    setPlayers([name, "אבא", "אמא", "יעל"]);
    setStep(2);
  };

  const onDrop = (playerName: string) => {
    setScore(score + 1);
    setCurrentWordIndex(prev => prev + 1);
    setDraggedOver(null);
  };

  return (
    <div style={containerStyle}>
      <div style={appFrameStyle}>
        {(step === 3 || step === 4) && <button onClick={() => setStep(2)} style={closeButtonStyle}>✕</button>}

        {step === 1 && (
          <div style={fullScreenCenter}>
            <div style={logoWrapper}><Logo /></div>
            <div style={formCardStyle}>
              <form onSubmit={handleEntry} style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="שם..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} placeholder="גיל..." />
                <button type="submit" style={goldButtonStyle}>המשך</button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={fullScreenCenter}>
            <div style={logoWrapper}><Logo /></div>
            <button onClick={() => setStep(3)} style={primaryButtonStyle}>➕ צור חדר חדש</button>
            <div style={roomListStyle}>
              <div style={roomItemStyle}><span>🏠 חדר: "חלון"</span><button style={joinButtonStyle}>הצטרף</button></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={fullScreenCenter}>
            <div style={scoreCircle}>🏆 {score}</div>
            <button onClick={() => { setTimeLeft(60); setIsPaused(false); setStep(4); }} style={goldButtonStyle}>התחל סיבוב</button>
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
                <h1 style={{ color: 'white', fontSize: '28px', margin: '0' }}>{WORD_DATABASE[ageGroup][currentWordIndex % WORD_DATABASE[ageGroup].length]?.word}</h1>
                <p style={{ color: '#ffd700', fontSize: '14px', fontWeight: 'bold', margin: '2px 0 0' }}>{WORD_DATABASE[ageGroup][currentWordIndex % WORD_DATABASE[ageGroup].length]?.en}</p>
              </div>
              {isPaused && (
                <div style={pauseOverlay}>
                  <button onClick={() => setIsPaused(false)} style={actionBtn}>▶️</button>
                  <button onClick={() => { setScore(score - 1); setCurrentWordIndex(prev => prev + 1); setIsPaused(false); }} style={{ ...actionBtn, backgroundColor: '#ef4444' }}>✕</button>
                </div>
              )}
            </div>

            <div style={guessersBox}>
               <p style={{ color: '#64748b', fontSize: '10px', textAlign: 'center', marginBottom: '5px' }}>גרור למנחש</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {players.filter(p => p !== name).map(p => (
                    <div key={p} onDragOver={(e) => { e.preventDefault(); setDraggedOver(p); }} onDragLeave={() => setDraggedOver(null)} onDrop={() => onDrop(p)}
                        style={{ ...guesserRow, background: draggedOver === p ? 'rgba(16, 185, 129, 0.4)' : guesserRow.background, borderColor: draggedOver === p ? '#10b981' : guesserRow.borderColor }}>
                        <div style={miniAvatar}>{p[0]}</div>
                        <span style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>{p}</span>
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

// === Styles Fixed for Mobile Viewport ===
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', backgroundColor: '#02040a', direction: 'rtl', overflow: 'hidden' };
const appFrameStyle: CSSProperties = { width: '100%', maxWidth: '400px', height: '100dvh', backgroundColor: '#05081c', display: 'flex', flexDirection: 'column', padding: '15px', position: 'relative', boxSizing: 'border-box' };
const fullScreenCenter: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' };
const logoWrapper: CSSProperties = { width: '120px', marginBottom: '10px' }; // הקטנת הלוגו
const closeButtonStyle: CSSProperties = { position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', width: '30px', height: '30px', borderRadius: '50%', zIndex: 100 };
const formCardStyle: CSSProperties = { width: '90%', padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.08)' };
const inputStyle: CSSProperties = { width: '180px', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'right' };
const goldButtonStyle: CSSProperties = { width: '180px', padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)', color: '#05081c', fontWeight: 'bold', border: 'none' };
const primaryButtonStyle: CSSProperties = { width: '180px', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' };
const roomListStyle: CSSProperties = { width: '100%', marginTop: '5px' };
const roomItemStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', color: 'white' };
const joinButtonStyle: CSSProperties = { backgroundColor: '#ffd700', color: '#05081c', border: 'none', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', gap: '8px' };
const gameHeader: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' };
const statLabel: CSSProperties = { color: '#ffd700', fontWeight: 'bold', fontSize: '15px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '8px' };
const miniPauseBtn: CSSProperties = { background: 'none', border: 'none', color: '#64748b', fontSize: '18px' };
const wordCardArea: CSSProperties = { flex: 0.8, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', borderRadius: '15px', zIndex: 10 };
const actionBtn: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', width: '50px', height: '50px', borderRadius: '50%', fontSize: '20px' };
const guessersBox: CSSProperties = { flex: 1.5, paddingBottom: '10px' };
const guesserRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' };
const miniAvatar: CSSProperties = { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' };
const scoreCircle: CSSProperties = { fontSize: '40px', color: '#ffd700', border: '3px solid #ffd700', width: '110px', height: '110px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };