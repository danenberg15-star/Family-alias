"use client";

import { useState, useEffect, CSSProperties, useRef } from "react";
import Logo from "./components/Logo";

// === כאן אתה מעדכן תמונות חדשות! פשוט תוסיף שורה לרשימה ===
const KIDS_WORDS = [
  { word: "פָּרָה", en: "Cow", img: "cow.png" },
  { word: "גִּ'ירָפָה", en: "Giraffe", img: "giraffe.png" },
  { word: "כֶּלֶב", en: "Dog", img: "dog.png" },
  { word: "תּוּכִּי", en: "Parrot", img: "parrot.png" },
  { word: "פִּיל", en: "Elephant", img: "elephant.png" },
  { word: "צָב", en: "Turtle", img: "turtle.png" },
  { word: "קוֹף", en: "Monkey", img: "monkey.png" },
  { word: "פַּרְפַּר", en: "Butterfly", img: "butterfly.png" },
  { word: "סוּס", en: "Horse", img: "horse.png" },
  { word: "תַּרְנְגוֹלֶת", en: "Chicken", img: "chicken.png" },
  // תוסיף כאן את התמונות החדשות שהעלית, למשל:
  // { word: "חָתוּל", en: "Cat", img: "cat.png" },
];

const WORD_DATABASE = {
  KIDS: KIDS_WORDS,
  JUNIOR: [
    { word: "מָטוֹס", en: "Airplane" }, { word: "מַחְשֵׁב", en: "Computer" },
    { word: "פִּיצָה", en: "Pizza" }, { word: "סֵפֶר", en: "Book" }
  ],
  TEEN: [
    { word: "הַשְׁרָאָה", en: "Inspiration" }, { word: "תַּרְבּוּת", en: "Culture" },
    { word: "טֶכְנוֹלוֹגְיָה", en: "Technology" }
  ],
  ADULT: [
    { word: "אַלְתְּרוּאִיזְם", en: "Altruism" }, { word: "פָּרָדִיגְמָה", en: "Paradigm" }
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
  
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);
  const playersRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const skipRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

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

  const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const generateGameWords = (selectedGroup: keyof typeof WORD_DATABASE) => {
    const order: (keyof typeof WORD_DATABASE)[] = ["KIDS", "JUNIOR", "TEEN", "ADULT"];
    const currentIndex = order.indexOf(selectedGroup);
    let pool = [...WORD_DATABASE[selectedGroup]];
    
    let combined = [];
    if (currentIndex > 0) {
      const lowerGroup = order[currentIndex - 1];
      combined = [...shuffleArray(pool), ...shuffleArray(WORD_DATABASE[lowerGroup])];
    } else {
      combined = shuffleArray(pool);
    }
    // מאגר אינסופי (Loop)
    setGameWords(Array(20).fill(shuffleArray(combined)).flat());
  };

  const resetWordPosition = () => {
    if (wordRef.current) {
      wordRef.current.style.position = 'relative';
      wordRef.current.style.left = 'auto';
      wordRef.current.style.top = 'auto';
      wordRef.current.style.zIndex = '1';
    }
  };

  const handleNextWord = (isSkip = false) => {
    setScore(prev => isSkip ? prev - 1 : prev + 1);
    setCurrentWordIndex(prev => prev + 1);
    isDragging.current = false;
    setActiveHover(null);
    resetWordPosition();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPaused || !gameWords[currentWordIndex]) return;
    isDragging.current = true;
    if (wordRef.current) {
      wordRef.current.style.position = 'fixed';
      wordRef.current.style.zIndex = '1000';
      updatePosition(e.clientX, e.clientY);
    }
  };

  const updatePosition = (x: number, y: number) => {
    if (wordRef.current) {
      wordRef.current.style.left = `${x - 70}px`;
      wordRef.current.style.top = `${y - 50}px`;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX, e.clientY);
    let hovered: string | null = null;
    if (skipRef.current) {
      const r = skipRef.current.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hovered = "SKIP";
    }
    Object.entries(playersRef.current).forEach(([pName, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) hovered = pName;
      }
    });
    setActiveHover(hovered);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    if (activeHover === "SKIP") handleNextWord(true);
    else if (activeHover) handleNextWord(false);
    else {
      isDragging.current = false;
      resetWordPosition();
    }
    setActiveHover(null);
  };

  const players = [name, "אבא", "אמא", "יעל"];
  const currentWord = gameWords[currentWordIndex];
  const timerColor = timeLeft <= 15 ? '#ef4444' : '#ffffff';

  return (
    <div style={containerStyle} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <div style={safeAreaWrapper}>
        
        {step === 1 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={logoSizer}><Logo /></div></div>
            <div style={formCardStyle}>
              <form style={formStyle} onSubmit={(e) => {
                e.preventDefault();
                generateGameWords(parseInt(age) <= 6 ? "KIDS" : parseInt(age) <= 10 ? "JUNIOR" : parseInt(age) <= 16 ? "TEEN" : "ADULT");
                setStep(2);
              }}>
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
            <button onClick={() => { setTimeLeft(60); setScore(0); setCurrentWordIndex(0); setStep(4); }} style={goldButtonStyle}>התחל משחק 🏁</button>
          </div>
        )}

        {step === 3 && (
          <div style={flexLayout}>
            <div style={scoreCircle}>🏆 {score}</div>
            <button onClick={() => setStep(2)} style={goldButtonStyle}>חזרה ללובי</button>
          </div>
        )}

        {step === 4 && (
          <div style={gameLayout}>
            <div style={{...timerDisplay, color: timerColor}}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>

            <div 
              ref={skipRef}
              onClick={() => handleNextWord(true)}
              style={{
                ...skipButtonStyle,
                backgroundColor: activeHover === "SKIP" ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.1)'
              }}
            >
              <span style={{fontSize: '20px'}}>🚫</span>
              <span>דלג (הורדה של נקודה)</span>
            </div>

            <div style={wordCardArea}>
              {currentWord ? (
                <div ref={wordRef} onPointerDown={handlePointerDown} style={wordItemStyle}>
                  <div style={wordInnerCard}>
                    {currentWord.img && <img src={`/words/${currentWord.img}`} alt="" style={wordImgStyle} />}
                    <h1 style={{ color: 'white', fontSize: '24px', margin: '0', pointerEvents: 'none' }}>{currentWord.word}</h1>
                    <p style={{ color: '#ffd700', fontSize: '13px', fontWeight: 'bold', pointerEvents: 'none' }}>{currentWord.en}</p>
                  </div>
                </div>
              ) : (
                <div style={{color:'white'}}>טוען מילים...</div>
              )}
            </div>

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

            <div style={gameFooter}>
              <button onClick={() => setIsPaused(true)} style={modernPauseBtn}>⏸️</button>
              <div style={bottomScore}>🏆 {score}</div>
            </div>

            {isPaused && (
              <div style={pauseOverlay}>
                <button onClick={() => setIsPaused(false)} style={hugePlayBtn}>▶️</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// === Styles (זהים לקוד היציב הקודם) ===
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none' };
const safeAreaWrapper: CSSProperties = { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 20px' };
const flexLayout: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const logoFlexBox: CSSProperties = { marginBottom: '20px' };
const logoSizer: CSSProperties = { width: '150px' };
const formCardStyle: CSSProperties = { width: '100%', padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'right' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)', color: '#05081c', fontWeight: 'bold', fontSize: '18px', border: 'none' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', gap: '8px', paddingBottom: '10px' };
const timerDisplay: CSSProperties = { fontSize: '56px', fontWeight: 'bold', textAlign: 'center', fontFamily: 'monospace' };
const skipButtonStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', borderRadius: '16px', border: '3px solid #ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const wordCardArea: CSSProperties = { flex: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const wordItemStyle: CSSProperties = { cursor: 'pointer', touchAction: 'none', userSelect: 'none', textAlign: 'center' };
const wordInnerCard: CSSProperties = { backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '140px' };
const wordImgStyle: CSSProperties = { width: '60px', height: '60px', marginBottom: '5px', objectFit: 'contain', pointerEvents: 'none' };
const guessersBox: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const guesserButton: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '15px', border: '2px solid transparent', cursor: 'pointer' };
const miniAvatar: CSSProperties = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' };
const gameFooter: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', padding: '10px 0' };
const bottomScore: CSSProperties = { color: '#ffd700', fontSize: '28px', fontWeight: 'bold' };
const modernPauseBtn: CSSProperties = { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: '55px', height: '55px', borderRadius: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'24px' };
const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 };
const hugePlayBtn: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', width: '140px', height: '140px', borderRadius: '50%', fontSize: '64px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const scoreCircle: CSSProperties = { fontSize: '48px', color: '#ffd700', border: '3px solid #ffd700', width: '130px', height: '130px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' };