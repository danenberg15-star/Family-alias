"use client";

import { useState, useEffect, CSSProperties, useRef } from "react";
import Logo from "./components/Logo";
import WordCard from "./components/WordCard"; 
import { KIDS_WORDS } from "../data/words/kids";
import { JUNIOR_WORDS } from "../data/words/junior";

const WORD_DATABASE = {
  KIDS: KIDS_WORDS,
  JUNIOR: JUNIOR_WORDS,
  TEEN: [{ word: "הַשְׁרָאָה", en: "Inspiration" }], 
  ADULT: [{ word: "פָּרָדִיגְמָה", en: "Paradigm" }]
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
    } else if (timeLeft === 0 && step === 4) { setStep(3); }
    return () => clearInterval(timer);
  }, [step, timeLeft, isPaused]);

  if (!mounted) return null;

  const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const generateGameWords = (selectedGroup: keyof typeof WORD_DATABASE) => {
    const order: (keyof typeof WORD_DATABASE)[] = ["KIDS", "JUNIOR", "TEEN", "ADULT"];
    const currentIndex = order.indexOf(selectedGroup);
    let pool = [...WORD_DATABASE[selectedGroup]];
    let combined = currentIndex > 0 ? [...shuffleArray(pool), ...shuffleArray(WORD_DATABASE[order[currentIndex - 1]])] : shuffleArray(pool);
    setGameWords(Array(20).fill(shuffleArray(combined)).flat());
  };

  const handleNextWord = (isSkip = false) => {
    setScore(prev => isSkip ? prev - 1 : prev + 1);
    setCurrentWordIndex(prev => prev + 1);
    isDragging.current = false;
    setActiveHover(null);
    if (wordRef.current) { 
      wordRef.current.style.position = 'relative'; 
      wordRef.current.style.left = 'auto'; 
      wordRef.current.style.top = 'auto'; 
      wordRef.current.style.zIndex = '1';
    }
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
      wordRef.current.style.left = `${x - 100}px`; 
      wordRef.current.style.top = `${y - 100}px`; 
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
      if (wordRef.current) { 
        wordRef.current.style.position = 'relative'; 
        wordRef.current.style.left = 'auto'; 
        wordRef.current.style.top = 'auto'; 
      } 
    }
    setActiveHover(null);
  };

  const players = [name, "אבא", "אמא", "יעל"];
  const currentWord = gameWords[currentWordIndex];

  return (
    <div style={containerStyle} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div style={safeAreaWrapper}>
        {step === 1 && (
          <div style={flexLayout}>
            <Logo />
            <div style={formCardStyle}>
              <form style={formStyle} onSubmit={(e) => {
                e.preventDefault();
                generateGameWords(parseInt(age) <= 6 ? "KIDS" : parseInt(age) <= 10 ? "JUNIOR" : "TEEN");
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
            <Logo />
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
            {/* תיקון צבע טיימר */}
            <div style={{...timerDisplay, color: timeLeft <= 15 ? '#ef4444' : 'white'}}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
            
            {/* תיקון קליק לדלג */}
            <div 
              ref={skipRef} 
              onPointerDown={(e) => { e.stopPropagation(); handleNextWord(true); }}
              style={{...skipButtonStyle, backgroundColor: activeHover === "SKIP" ? 'rgba(239, 68, 68, 0.4)' : 'transparent'}}
            >
              🚫 דלג
            </div>

            <div style={wordCardArea}>
              {currentWord ? (
                <WordCard 
                  word={currentWord.word} 
                  en={currentWord.en} 
                  img={currentWord.img} 
                  wordRef={wordRef} 
                  onPointerDown={handlePointerDown} 
                />
              ) : <div style={{color:'white'}}>טוען...</div>}
            </div>

            <div style={guessersBox}>
                {players.filter(p => p !== name).map(p => (
                  <div 
                    key={p} 
                    ref={el => { playersRef.current[p] = el; }} 
                    onPointerDown={(e) => { e.stopPropagation(); handleNextWord(false); }}
                    style={{ ...guesserButton, background: activeHover === p ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.03)' }}
                  >
                      <div style={miniAvatar}>{p[0]}</div>
                      <span style={{ color: 'white' }}>{p}</span>
                  </div>
                ))}
            </div>

            <div style={gameFooter}>
              <button onClick={() => setIsPaused(true)} style={modernPauseBtn}>⏸️</button>
              <div style={bottomScore}>🏆 {score}</div>
            </div>

            {isPaused && <div style={pauseOverlay}><button onClick={() => setIsPaused(false)} style={hugePlayBtn}>▶️</button></div>}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none' };
const safeAreaWrapper: CSSProperties = { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 20px' };
const flexLayout: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' };
const formCardStyle: CSSProperties = { width: '100%', padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '20px' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: 'bold' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' };
const timerDisplay: CSSProperties = { fontSize: '56px', fontWeight: 'bold', textAlign: 'center' };
const skipButtonStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '16px', border: '2px solid #ef4444', color: 'white', cursor: 'pointer' };
const wordCardArea: CSSProperties = { flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const guessersBox: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const guesserButton: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' };
const miniAvatar: CSSProperties = { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' };
const gameFooter: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' };
const bottomScore: CSSProperties = { color: '#ffd700', fontSize: '28px', fontWeight: 'bold' };
const modernPauseBtn: CSSProperties = { background: 'rgba(255,255,255,0.1)', width: '50px', height: '50px', borderRadius: '15px', border: 'none', color: 'white' };
const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 };
const hugePlayBtn: CSSProperties = { backgroundColor: '#10b981', width: '100px', height: '100px', borderRadius: '50%', border: 'none', fontSize: '40px' };
const scoreCircle: CSSProperties = { fontSize: '48px', color: '#ffd700', border: '3px solid #ffd700', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };