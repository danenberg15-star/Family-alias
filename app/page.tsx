"use client";

import { useState, useEffect, CSSProperties, useRef } from "react";
import Logo from "./components/Logo";

const WORD_DATABASE = {
  KIDS: [
    { word: "פָּרָה", en: "Cow", img: "cow.png" },
    { word: "גִּ'ירָפָה", en: "Giraffe", img: "giraffe.png" },
    { word: "כֶּלֶב", en: "Dog", img: "dog.png" },
    { word: "תּוּכִּי", en: "Parrot", img: "parrot.png" },
    { word: "פִּיל", en: "Elephant", img: "elephant.png" },
    { word: "צָב", en: "Turtle", img: "turtle.png" },
    { word: "קוֹף", en: "Monkey", img: "monkey.png" },
    { word: "פַּרְפַּר", en: "Butterfly", img: "butterfly.png" },
    { word: "סוּס", en: "Horse", img: "horse.png" },
    { word: "תַּרְנְגוֹלֶת", en: "Chicken", img: "chicken.png" }
  ],
  JUNIOR: [
    { word: "מָטוֹס", en: "Airplane" }, { word: "מַחְשֵׁב", en: "Computer" },
    { word: "פִּיצָה", en: "Pizza" }, { word: "סֵפֶר", en: "Book" }
  ],
  TEEN: [
    { word: "הַשְׁרָאָה", en: "Inspiration" }, { word: "תַּרְבּוּת", en: "Culture" },
    { word: "טֶכְנוֹלוֹגְיָה", en: "Technology" }, { word: "מוּזִיקָה", en: "Music" }
  ],
  ADULT: [
    { word: "אַלְתְּרוּאִיזְם", en: "Altruism" }, { word: "פָּרָדִיגְמָה", en: "Paradigm" },
    { word: "דִּיסוֹנַנְס", en: "Dissonance" }, { word: "קונסנזוס", en: "Consensus" }
  ]
};

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
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

  const generateGameWords = (selectedGroup: keyof typeof WORD_DATABASE) => {
    const currentPool = [...WORD_DATABASE[selectedGroup]];
    let finalPool = [];
    const order: (keyof typeof WORD_DATABASE)[] = ["KIDS", "JUNIOR", "TEEN", "ADULT"];
    const currentIndex = order.indexOf(selectedGroup);

    if (currentIndex > 0) {
      const lowerGroup = order[currentIndex - 1];
      const lowerPool = [...WORD_DATABASE[lowerGroup]];
      for (let i = 0; i < 20; i++) {
        finalPool.push(i % 2 === 0 ? 
          currentPool[Math.floor(Math.random() * currentPool.length)] : 
          lowerPool[Math.floor(Math.random() * lowerPool.length)]
        );
      }
    } else {
      finalPool = currentPool;
    }
    setGameWords(finalPool);
  };

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(age);
    let group: keyof typeof WORD_DATABASE = "ADULT";
    if (n <= 6) group = "KIDS";
    else if (n <= 10) group = "JUNIOR";
    else if (n <= 16) group = "TEEN";
    generateGameWords(group);
    setStep(2);
  };

  const players = [name, "אבא", "אמא", "יעל"];
  const currentWord = gameWords[currentWordIndex % gameWords.length];

  const startDrag = (e: React.PointerEvent) => {
    if (isPaused || !currentWord) return;
    setIsDragging(true);
    setDragPos({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
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

  const endDrag = () => {
    if (!isDragging) return;
    if (activePlayerHover) {
      setScore(prev => prev + 1);
      setCurrentWordIndex(prev => prev + 1);
    }
    setIsDragging(false);
    setActivePlayerHover(null);
  };

  return (
    <div style={containerStyle}>
      <div style={safeAreaWrapper}>
        {(step >= 2) && <button onClick={() => setStep(1)} style={closeButtonStyle}>✕</button>}

        {step === 1 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={logoSizer}><Logo /></div></div>
            <div style={formCardStyle}>
              <form style={formStyle} onSubmit={handleEntry}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="שם..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} placeholder="גיל..." />
                <button type="submit" style={goldButtonStyle}>המשך</button>
              </form>
            </div>
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
              {currentWord && (
                <div 
                  onPointerDown={startDrag} onPointerMove={onDrag} onPointerUp={endDrag}
                  style={{
                    ...wordItemStyle,
                    position: isDragging ? 'fixed' : 'relative',
                    left: isDragging ? dragPos.x - 90 : 'auto',
                    top: isDragging ? dragPos.y - 60 : 'auto',
                    zIndex: 1000,
                    opacity: isDragging ? 0.9 : 1,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    padding: '20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '180px'
                  }}
                >
                  {/* הצגת תמונה אם קיימת במאגר (סעיף 12) */}
                  {currentWord.img && (
                    <img 
                      src={`/words/${currentWord.img}`} 
                      alt="" 
                      style={{ width: '80px', height: '80px', marginBottom: '10px', objectFit: 'contain', pointerEvents: 'none' }} 
                    />
                  )}
                  <h1 style={{ color: 'white', fontSize: '32px', margin: '0', pointerEvents: 'none' }}>{currentWord.word}</h1>
                  <p style={{ color: '#ffd700', fontSize: '16px', fontWeight: 'bold', pointerEvents: 'none' }}>{currentWord.en}</p>
                </div>
              )}
              {isPaused && (
                <div style={pauseOverlay}><button onClick={() => setIsPaused(false)} style={actionBtn}>▶️</button></div>
              )}
            </div>

            <div style={guessersBox}>
               {players.filter(p => p !== name).map(p => (
                 <div key={p} ref={el => { playersRef.current[p] = el; }}
                    style={{ 
                      ...guesserRow, 
                      borderColor: activePlayerHover === p ? '#10b981' : 'rgba(255,255,255,0.1)',
                      background: activePlayerHover === p ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.03)'
                    }}
                 >
                     <div style={miniAvatar}>{p[0]}</div>
                     <span style={{ color: 'white', fontWeight: 'bold' }}>{p}</span>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* שלבים 2 ו-3 נשארים ללא שינוי מהקוד הקודם */}
        {step === 2 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={{width:'100px'}}><Logo /></div></div>
            <button onClick={() => setStep(3)} style={goldButtonStyle}>➕ צור חדר חדש</button>
          </div>
        )}
        {step === 3 && (
          <div style={flexLayout}>
            <div style={scoreCircle}>🏆 {score}</div>
            <button onClick={() => { setTimeLeft(60); setStep(4); }} style={{...goldButtonStyle, marginTop:'20px'}}>התחל סיבוב 🏁</button>
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
const wordCardArea: CSSProperties = { flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const wordItemStyle: CSSProperties = { cursor: 'pointer', touchAction: 'none', userSelect: 'none', textAlign: 'center' };
const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', zIndex: 2000 };
const actionBtn: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', width: '60px', height: '60px', borderRadius: '50%', fontSize: '24px' };
const guessersBox: CSSProperties = { flex: 1.5, display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' };
const guesserRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', border: '2px solid transparent', transition: '0.15s all' };
const miniAvatar: CSSProperties = { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' };
const scoreCircle: CSSProperties = { fontSize: '48px', color: '#ffd700', border: '3px solid #ffd700', width: '130px', height: '130px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };