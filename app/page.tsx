"use client";

import { useState, useEffect, CSSProperties } from "react";
import { useSwipeable } from "react-swipeable";
import Logo from "./components/Logo";

type WordEntry = { word: string; en: string; img?: string };
type WordDatabase = {
  KIDS: WordEntry[];
  JUNIOR: WordEntry[];
  TEEN: WordEntry[];
  ADULT: WordEntry[];
};

// מאגר מילים נקי (בלי הערות cite)
const WORD_DATABASE: WordDatabase = {
  KIDS: [
    { word: "כַּדּוּר", en: "Ball", img: "⚽" },
    { word: "בַּיִת", en: "House", img: "🏠" },
    { word: "כֶּלֶב", en: "Dog", img: "🐶" }
  ],
  JUNIOR: [
    { word: "מָטוֹס", en: "Airplane", img: "✈️" },
    { word: "מַחְשֵׁב", en: "Computer", img: "💻" },
    { word: "גְּלִידָה", en: "Ice Cream", img: "🍦" }
  ],
  TEEN: [
    { word: "הַשְׁרָאָה", en: "Inspiration" },
    { word: "טֶכְנוֹלוֹגְיָה", en: "Technology" },
    { word: "תַּרְבּוּת", en: "Culture" }
  ],
  ADULT: [
    { word: "אַלְתְּרוּאִיזְם", en: "Altruism" },
    { word: "דִּיסוֹנַנְס", en: "Dissonance" },
    { word: "פָּרָדִיגְמָה", en: "Paradigm" }
  ]
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
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // לוגיקת גרירה נקייה (סעיפים 23-24)
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => {
      if (step === 4 && !isPaused) {
        setScore(prev => prev - 1); // עונש דילוג [cite: 23]
        setCurrentWordIndex(prev => prev + 1);
      }
    },
    onSwipedDown: () => {
      if (step === 4 && !isPaused) {
        setScore(prev => prev + 1); // ניחוש נכון [cite: 24]
        setCurrentWordIndex(prev => prev + 1);
      }
    },
    trackMouse: true
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, isPaused]);

  if (!mounted) return null;

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(age);
    let group: keyof WordDatabase = "ADULT";
    if (n <= 6) group = "KIDS";
    else if (n <= 10) group = "JUNIOR";
    else if (n <= 16) group = "TEEN";
    setAgeGroup(group);
    setPlayers([name, "אבא", "אמא", "יעל"]); // שחקני דמה 
    setStep(2);
  };

  const currentWord = WORD_DATABASE[ageGroup][currentWordIndex % WORD_DATABASE[ageGroup].length];

  return (
    <div style={containerStyle}>
      <div style={mobileFrameStyle}>
        
        {(step === 3 || step === 4) && (
          <button onClick={() => setStep(2)} style={closeButtonStyle}>✕</button>
        )}

        {step === 1 && (
          <div style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
            <Logo />
            <div style={cardStyle}>
              <form onSubmit={handleEntry} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <label style={labelStyle}>שם השחקן</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="איך קוראים לך?" />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <label style={labelStyle}>גיל</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} placeholder="בן כמה אתה?" />
                </div>
                <button type="submit" style={primaryButtonStyle}>התחל 🚀</button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <Logo />
            <button onClick={() => setStep(3)} style={{ ...primaryButtonStyle, marginTop: '40px', backgroundColor: '#4f46e5', color: 'white' }}>➕ צור חדר חדש</button>
            <div style={{ marginTop: '40px', textAlign: 'right' }}>
              <h3 style={{ color: 'white', fontSize: '18px' }}>חדרים פעילים:</h3>
              <div style={roomItemStyle}><span>🏠 חדר: "בלון"</span><button style={joinButtonStyle}>הצטרף</button></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '24px' }}>חדר: "חלון"</h2>
            <div style={cardStyle}>
               <p style={{ color: 'white', marginBottom: '10px' }}>שחקנים בחדר:</p>
               {players.map(p => <div key={p} style={{ color: '#94a3b8' }}>• {p}</div>)}
            </div>
            <button onClick={() => { setTimeLeft(60); setScore(0); setStep(4); }} style={{ ...primaryButtonStyle, marginTop: '30px' }}>התחל משחק 🏁</button>
          </div>
        )}

        {step === 4 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <div style={gameHeaderStyle}>
              <div style={statBoxStyle}>⏱️ {timeLeft}s</div>
              <div style={statBoxStyle}>🏆 {score}</div>
            </div>

            <div {...swipeHandlers} style={wordCardStyle}>
              {!isPaused && (
                <button onClick={() => setIsPaused(true)} style={pauseTriggerStyle}>⏸️ השהייה</button>
              )}

              <div style={hintStyle}>דילוג (1-) ⬆️</div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: isPaused ? 0.1 : 1 }}>
                {currentWord?.img && <div style={{ fontSize: '70px', marginBottom: '10px' }}>{currentWord.img}</div>}
                <h1 style={{ color: 'white', fontSize: '38px', margin: '0 0 5px' }}>{currentWord?.word}</h1>
                <p style={{ color: '#4f46e5', fontSize: '18px', fontWeight: 'bold' }}>{currentWord?.en}</p>
              </div>

              <div style={hintStyle}>ניחוש נכון ⬇️</div>

              {isPaused && (
                <div style={pauseOverlayStyle}>
                  <p style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px' }}>המשחק מושהה</p>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setIsPaused(false)} style={playButtonStyle}>▶️ פליי</button>
                    <button onClick={() => { setScore(score - 1); setCurrentWordIndex(prev => prev + 1); setIsPaused(false); }} style={foulButtonStyle}>✕ פסילה</button>
                  </div>
                </div>
              )}
            </div>

            <div style={guessersContainerStyle}>
               <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  {players.filter(p => p !== name).map(p => (
                    <div key={p} style={playerAvatarStyle}>
                       <div style={avatarCircleStyle}>{p[0]}</div>
                       <span style={{ fontSize: '11px', color: 'white' }}>{p}</span>
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

// --- סגנונות (Styles) מעודכנים למראה Mobile-Frame ---
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#02040a', direction: 'rtl' };
const mobileFrameStyle: CSSProperties = { width: '100%', maxWidth: '400px', height: '90vh', backgroundColor: '#05081c', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', position: 'relative', borderRadius: '40px', border: '8px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' };
const cardStyle: CSSProperties = { width: '100%', padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '20px' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginTop: '8px', boxSizing: 'border-box', textAlign: 'right' };
const labelStyle: CSSProperties = { color: '#64748b', fontSize: '12px', fontWeight: 'bold' };
const primaryButtonStyle: CSSProperties = { width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: 'white', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' };
const roomItemStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '10px', color: 'white' };
const joinButtonStyle: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' };
const closeButtonStyle: CSSProperties = { position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '50%', fontSize: '16px', zIndex: 100, cursor: 'pointer' };
const gameHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' };
const statBoxStyle: CSSProperties = { backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 15px', borderRadius: '10px', color: 'white', fontWeight: 'bold', fontSize: '16px' };
const wordCardStyle: CSSProperties = { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '25px', border: '2px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', touchAction: 'none', width: '100%' };
const pauseTriggerStyle: CSSProperties = { position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', zIndex: 10 };
const hintStyle: CSSProperties = { textAlign: 'center', padding: '10px', color: 'rgba(255, 255, 255, 0.2)', fontSize: '10px', fontWeight: 'bold' };
const pauseOverlayStyle: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.95)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 50 };
const playButtonStyle: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' };
const foulButtonStyle: CSSProperties = { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' };
const guessersContainerStyle: CSSProperties = { width: '100%', padding: '15px 0' };
const playerAvatarStyle: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' };
const avatarCircleStyle: CSSProperties = { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', border: '2px solid rgba(255,255,255,0.1)' };