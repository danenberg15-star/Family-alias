"use client";

import { useState, useEffect, useRef } from "react";
import Logo from "./components/Logo";
import WordCard from "./components/WordCard"; 
import { styles } from "./game.styles";
import { WORD_DATABASE, CategoryType } from "./game.config";

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
  const [isDraggingWord, setIsDraggingWord] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("KIDS");
  
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

  const generateGameWords = (cat: CategoryType) => {
    setSelectedCategory(cat);
    const pool = [...WORD_DATABASE[cat]];
    setGameWords(Array(30).fill([...pool].sort(() => Math.random() - 0.5)).flat());
  };

  const handleNextWord = (isSkip = false) => {
    setScore(prev => isSkip ? prev - 1 : prev + 1);
    setCurrentWordIndex(prev => prev + 1);
    isDragging.current = false;
    setIsDraggingWord(false);
    setActiveHover(null);
    if (wordRef.current) { 
      wordRef.current.style.position = 'relative'; 
      wordRef.current.style.left = 'auto'; 
      wordRef.current.style.top = 'auto'; 
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPaused || !gameWords[currentWordIndex]) return;
    isDragging.current = true;
    setIsDraggingWord(true);
    if (wordRef.current) { 
      wordRef.current.style.position = 'fixed'; 
      wordRef.current.style.zIndex = '1000';
      updatePosition(e.clientX, e.clientY); 
    }
  };

  const updatePosition = (x: number, y: number) => {
    if (wordRef.current) { 
      wordRef.current.style.left = `${x - 110}px`; 
      wordRef.current.style.top = `${y - 90}px`; 
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
    ["אבא", "אמא", "יעל"].forEach((pName) => {
      const el = playersRef.current[pName];
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
      setIsDraggingWord(false);
      if (wordRef.current) { 
        Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
      } 
    }
    setActiveHover(null);
  };

  const isTextOnly = selectedCategory === "TEEN" || selectedCategory === "ADULT";
  const currentWord = gameWords[currentWordIndex];

  return (
    <div style={styles.container} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div style={styles.safeAreaWrapper}>
        {step === 1 && (
          <div style={styles.flexLayout}>
            <Logo />
            <div style={styles.formCard}>
              <form style={styles.form} onSubmit={(e) => {
                e.preventDefault();
                const ageNum = parseInt(age);
                const cat: CategoryType = ageNum <= 6 ? "KIDS" : ageNum <= 10 ? "JUNIOR" : ageNum <= 17 ? "TEEN" : "ADULT";
                generateGameWords(cat);
                setStep(2);
              }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} placeholder="שם..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={styles.input} placeholder="גיל..." />
                <button type="submit" style={styles.goldButton}>המשך</button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={styles.flexLayout}>
            <Logo />
            <button onClick={() => { setTimeLeft(60); setScore(0); setCurrentWordIndex(0); setStep(4); }} style={styles.goldButton}>התחל משחק 🏁</button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.flexLayout}>
            <div style={styles.scoreCircle}>
                <span style={{ direction: 'ltr', display: 'inline-block' }}>{score}</span> 🏆
            </div>
            <button onClick={() => setStep(2)} style={styles.goldButton}>חזרה ללובי</button>
          </div>
        )}

        {step === 4 && (
          <div style={styles.gameLayout}>
            <div style={{...styles.timerDisplay, color: timeLeft <= 15 ? '#ef4444' : 'white'}}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
            
            <div style={styles.topGroup}>
                <div ref={skipRef} onPointerDown={(e) => { e.stopPropagation(); handleNextWord(true); }}
                  style={{...styles.skipButton, backgroundColor: activeHover === "SKIP" ? '#ef4444' : 'transparent', borderColor: activeHover === "SKIP" ? '#ef4444' : 'rgba(239, 68, 68, 0.6)'}}>
                  🚫 דלג
                </div>

                <div style={{...styles.wordCardArea, minHeight: isTextOnly ? '200px' : '240px'}}>
                  {currentWord && <WordCard word={currentWord.word} en={currentWord.en} img={currentWord.img} wordRef={wordRef} onPointerDown={handlePointerDown} isTextOnly={isTextOnly} />}
                  {isDraggingWord && <div style={{...styles.wordCardPlaceholder, height: isTextOnly ? '180px' : '223px'}}></div>}
                </div>

                <div style={styles.guessersBox}>
                    {["אבא", "אמא", "יעל"].map(p => (
                      <div key={p} ref={el => { playersRef.current[p] = el; }} onPointerDown={(e) => { e.stopPropagation(); handleNextWord(false); }}
                        style={{...styles.guesserButton, backgroundColor: activeHover === p ? '#10b981' : 'rgba(255,255,255,0.03)', borderColor: activeHover === p ? '#10b981' : 'rgba(255,255,255,0.1)'}}>
                          <div style={styles.miniAvatar}>{p[0]}</div>
                          <span style={{ color: 'white', userSelect: 'none' }}>{p}</span>
                      </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1 }}></div>

            <div style={styles.gameFooter}>
              <button onClick={() => setIsPaused(true)} style={styles.modernPauseBtn}>⏸️</button>
              <div style={styles.bottomScore}>🏆 <span style={{ direction: 'ltr', display: 'inline-block' }}>{score}</span></div>
            </div>

            {isPaused && <div style={styles.pauseOverlay}><button onClick={() => setIsPaused(false)} style={styles.hugePlayBtn}>▶️</button></div>}
          </div>
        )}
      </div>
    </div>
  );
}