"use client";

import { useState, useEffect, CSSProperties, useRef } from "react";
import Logo from "./components/Logo";

const WORD_DATABASE = {
  KIDS: [
    { word: "פָּרָה", en: "Cow", img: "cow.png" }, { word: "גִּ'ירָפָה", en: "Giraffe", img: "giraffe.png" },
    { word: "כֶּלֶב", en: "Dog", img: "dog.png" }, { word: "תּוּכִּי", en: "Parrot", img: "parrot.png" },
    { word: "פִּיל", en: "Elephant", img: "elephant.png" }, { word: "צָב", en: "Turtle", img: "turtle.png" },
    { word: "קוֹף", en: "Monkey", img: "monkey.png" }, { word: "פַּרְפַּר", en: "Butterfly", img: "butterfly.png" },
    { word: "סוּס", en: "Horse", img: "horse.png" }, { word: "תַּרְנְגוֹלֶת", en: "Chicken", img: "chicken.png" }
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
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const playersRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const skipRef = useRef<HTMLDivElement | null>(null);

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

  // פונקציית Shuffle (סעיף 2)
  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const generateGameWords = (selectedGroup: keyof typeof WORD_DATABASE) => {
    const order: (keyof typeof WORD_DATABASE)[] = ["KIDS", "JUNIOR", "TEEN", "ADULT"];
    const currentIndex = order.indexOf(selectedGroup);
    let pool = [...WORD_DATABASE[selectedGroup]];

    if (currentIndex > 0) {
      const lowerGroup = order[currentIndex - 1];
      const lowerPool = [...WORD_DATABASE[lowerGroup]];
      // 50/50 לוגיקה
      const combined = [
        ...shuffleArray(pool).slice(0, 10),
        ...shuffleArray(lowerPool).slice(0, 10)
      ];
      setGameWords(shuffleArray(combined));
    } else {
      setGameWords(shuffleArray(pool));
    }
  };

  const handleNextWord = (isSkip = false) => {
    if (isSkip) setScore(prev => prev - 1);
    else setScore(prev => prev + 1);
    setCurrentWordIndex(prev => prev + 1);
  };

  const startDrag = (e: React.PointerEvent) => {
    if (isPaused || !gameWords[currentWordIndex]) return;
    setIsDragging(true);
    setDragPos({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
    
    let hovered: string | null = null;
    // בדיקת דלג
    if (skipRef.current) {
      const r = skipRef.current.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hovered = "SKIP";
    }
    // בדיקת שחקנים
    Object.entries(playersRef.current).forEach(([pName, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) hovered = pName;
      }
    });
    setActiveHover(hovered);
  };

  const endDrag = () => {
    if (!isDragging) return;
    if (activeHover === "SKIP") handleNextWord(true);
    else if (activeHover) handleNextWord(false);
    setIsDragging(false);
    setActiveHover(null);
  };

  const players = [name, "אבא", "אמא", "יעל"];
  const currentWord = gameWords[currentWordIndex % gameWords.length];

  return (
    <div style={containerStyle}>
      <div style={safeAreaWrapper}>
        
        {step === 1 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={logoSizer}><Logo /></div></div>
            <div style={formCardStyle}>
              <form style={formStyle} onSubmit={(e) => {
                e.preventDefault();
                const n = parseInt(age);
                let g: keyof typeof WORD_DATABASE = n <= 6 ? "KIDS" : n <= 10 ? "JUNIOR" : n <= 16 ? "TEEN" : "ADULT";
                generateGameWords(g);
                setStep(2);
              }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="שם המשתמש..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} placeholder="גיל..." />
                <button type="submit" style={goldButtonStyle}>המשך</button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={{width:'100px'}}><Logo /></div></div>
            <button onClick={() => { setTimeLeft(60); setScore(0); setStep(4); }} style={goldButtonStyle}>התחל משחק 🏁</button>
          </div>
        )}

        {step === 3 && (
          <div style={flexLayout}>
            <h2 style={{color:'white'}}>הסיבוב נגמר!</h2>
            <div style={scoreCircle}>🏆 {score}</div>
            <button onClick={() => { setStep(2); }} style={goldButtonStyle}>חזרה ללובי</button>
          </div>
        )}

        {step === 4 && (
          <div style={gameLayout}>
            {/* כפתור דלג עליון (סעיף 3, 4) */}
            <div 
              ref={skipRef}
              onClick={() => handleNextWord(true)}
              style={{
                ...skipArea,
                background: activeHover === "SKIP" ? '#ef4444' : 'rgba(239, 68, 68, 0.1)',
                borderColor: '#ef4444'
              }}
            >
              ⏭️ דלג (-1)
            </div>

            {/* טיימר מונפש גדול (סעיף 5) */}
            <div style={timerContainer}>
              <div style={timerText}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
              <div style={timerBarBackground}>
                <div style={{...timerBarFill, width: `${(timeLeft/60)*100}%`}}></div>
              </div>
            </div>

            <div style={wordCardArea}>
              {currentWord && (
                <div 
                  onPointerDown={startDrag} onPointerMove={onDrag} onPointerUp={endDrag}
                  style={{
                    ...wordItemStyle,
                    position: isDragging ? 'fixed' : 'relative',
                    left: isDragging ? dragPos.x - 70 : 'auto',
                    top: isDragging ? dragPos.y - 50 : 'auto',
                    zIndex: 1000,
                    transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '150px'
                  }}
                >
                  {currentWord.img && <img src={`/words/${currentWord.img}`} alt="" style={wordImgStyle} />}
                  <h1 style={{ color: 'white', fontSize: '28px', margin: '0', pointerEvents: 'none' }}>{currentWord.word}</h1>
                  <p style={{ color: '#ffd700', fontSize: '14px', fontWeight: 'bold', pointerEvents: 'none' }}>{currentWord.en}</p>
                </div>
              )}
            </div>

            {/* רשימת מנחשים ככפתורים (סעיף 4) */}
            <div style={guessersBox}>
               {players.filter(p => p !== name).map(p => (
                 <div key={p} ref={el => { playersRef.current[p] = el; }}
                    onClick={() => handleNextWord(false)}
                    style={{ 
                      ...guesserButton, 
                      borderColor: activeHover === p ? '#10b981' : 'rgba(255,255,255,0.1)',
                      background: activeHover === p ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.03)'
                    }}
                 >
                     <div style={miniAvatar}>{p[0]}</div>
                     <span style={{ color: 'white', fontWeight: 'bold' }}>{p}</span>
                 </div>
               ))}
            </div>

            {/* ניקוד בתחתית ופאוז גדול (סעיף 6, 7) */}
            <div style={gameFooter}>
              <div style={bottomScore}>🏆 {score}</div>
              <button onClick={() => setIsPaused(true)} style={bigPauseBtn}>⏸️</button>
            </div>

            {isPaused && (
              <div style={pauseOverlay}><button onClick={() => setIsPaused(false)} style={actionBtn}>▶️</button></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// === CSS Styles המעודכנים ===
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed' };
const safeAreaWrapper: CSSProperties = { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 20px' };
const flexLayout: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const logoFlexBox: CSSProperties = { marginBottom: '20px' };
const logoSizer: CSSProperties = { width: '150px' };
const formCardStyle: CSSProperties = { width: '100%', padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'right' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)', color: '#05081c', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', gap: '10px', paddingBottom: '20px' };

const skipArea: CSSProperties = { width: '100%', padding: '10px', borderRadius: '12px', border: '2px dashed', color: 'white', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' };

const timerContainer: CSSProperties = { marginTop: '10px', textAlign: 'center' };
const timerText: CSSProperties = { fontSize: '42px', fontWeight: 'bold', color: '#ffd700', fontFamily: 'monospace' };
const timerBarBackground: CSSProperties = { width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '5px', overflow: 'hidden' };
const timerBarFill: CSSProperties = { height: '100%', backgroundColor: '#ffd700', transition: 'width 1s linear' };

const wordCardArea: CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const wordItemStyle: CSSProperties = { cursor: 'pointer', touchAction: 'none', userSelect: 'none', textAlign: 'center', transition: 'transform 0.1s' };
const wordImgStyle: CSSProperties = { width: '70px', height: '70px', marginBottom: '8px', objectFit: 'contain', pointerEvents: 'none' };

const guessersBox: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const guesserButton: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '15px', border: '2px solid transparent', cursor: 'pointer' };
const miniAvatar: CSSProperties = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' };

const gameFooter: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '15px' };
const bottomScore: CSSProperties = { color: '#ffd700', fontSize: '24px', fontWeight: 'bold' };
const bigPauseBtn: CSSProperties = { background: 'rgba(255,255,255,0.05)', border: 'none', fontSize: '28px', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' };

const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const actionBtn: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', width: '80px', height: '80px', borderRadius: '50%', fontSize: '32px' };
const scoreCircle: CSSProperties = { fontSize: '48px', color: '#ffd700', border: '3px solid #ffd700', width: '130px', height: '130px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' };