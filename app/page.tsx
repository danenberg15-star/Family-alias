"use client";

import { useState, useEffect, useRef } from "react";
import Logo from "./components/Logo";
import WordCard from "./components/WordCard"; 
import { styles } from "./game.styles";
import { WORD_DATABASE, CategoryType } from "./game.config";

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: כניסה, 2: לובי, 3: חדר, 4: משחק
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gameMode, setGameMode] = useState<"individual" | "team">("individual");
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  
  // מצב משחק (מנוע הגרירה היציב)
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
    } else if (timeLeft === 0 && step === 4) { setStep(1); /* או מסך סיכום */ }
    return () => clearInterval(timer);
  }, [step, timeLeft, isPaused]);

  if (!mounted) return null;

  // פונקציות ניווט ולוגיקה
  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setTeam1([name, "אבא"]);
    setTeam2(["אמא", "יעל"]);
    setStep(2);
  };

  const startActualGame = () => {
    const ageNum = parseInt(age);
    const cat: CategoryType = ageNum <= 6 ? "KIDS" : ageNum <= 10 ? "JUNIOR" : ageNum <= 17 ? "TEEN" : "ADULT";
    setSelectedCategory(cat);
    const pool = [...WORD_DATABASE[cat]];
    setGameWords(Array(30).fill([...pool].sort(() => Math.random() - 0.5)).flat());
    setScore(0);
    setTimeLeft(60);
    setStep(4);
  };

  const movePlayer = (playerName: string, from: "t1" | "t2") => {
    if (from === "t1") {
      setTeam1(team1.filter(p => p !== playerName));
      setTeam2([...team2, playerName]);
    } else {
      setTeam2(team2.filter(p => p !== playerName));
      setTeam1([...team1, playerName]);
    }
  };

  // --- מנוע הגרירה היציב (מתוך הגרסה ששמרנו) ---
  const handleNextWord = (isSkip = false) => {
    setScore(prev => isSkip ? prev - 1 : prev + 1);
    setCurrentWordIndex(prev => prev + 1);
    isDragging.current = false;
    setIsDraggingWord(false);
    setActiveHover(null);
    if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
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
    if (skipRef.current?.getBoundingClientRect()) {
      const r = skipRef.current.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hovered = "SKIP";
    }
    [...team1, ...team2].forEach((pName) => {
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
      if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
    }
    setActiveHover(null);
  };

  const canStart = gameMode === "individual" ? (team1.length + team2.length >= 2) : (team1.length >= 2 && team2.length >= 2);
  const isTextOnly = selectedCategory === "TEEN" || selectedCategory === "ADULT";

  return (
    <div style={styles.container} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div style={styles.safeAreaWrapper}>
        
        {step === 1 && (
          <div style={styles.flexLayout}>
            <Logo />
            <div style={styles.formCard}>
              <form onSubmit={handleEntry} style={styles.form}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} placeholder="שם השחקן..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={styles.input} placeholder="גיל..." />
                <button type="submit" style={styles.goldButton}>קדימה 🚀</button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={styles.flexLayout}>
            <Logo />
            <button onClick={() => setStep(3)} style={{...styles.goldButton, backgroundColor:'#4f46e5', color:'white'}}>➕ צור חדר חדש</button>
            <div style={{marginTop: '30px', width: '100%', textAlign: 'right'}}>
              <h3 style={{color: 'white', marginBottom: '10px'}}>חדרים פעילים:</h3>
              <div style={{display:'flex', justifyContent:'space-between', padding:'15px', backgroundColor:'rgba(255,255,255,0.05)', borderRadius:'12px', color:'white'}}>
                <span>🏠 חלון</span>
                <button onClick={() => setStep(3)} style={{backgroundColor:'#10b981', color:'white', border:'none', padding:'5px 15px', borderRadius:'8px'}}>הצטרף</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{...styles.flexLayout, justifyContent:'flex-start', paddingTop:'40px'}}>
            <button onClick={() => setStep(2)} style={{alignSelf:'flex-start', background:'none', border:'none', color:'white', fontSize:'24px'}}>✕</button>
            <h2 style={{color:'white', marginBottom:'20px'}}>חדר: "חלון"</h2>
            <div style={{display:'flex', gap:'5px', width:'100%', backgroundColor:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'12px'}}>
              <button onClick={() => setGameMode("individual")} style={gameMode === "individual" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק אישי</button>
              <button onClick={() => setGameMode("team")} style={gameMode === "team" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק קבוצתי</button>
            </div>

            <div style={{display:'flex', gap:'10px', width:'100%', marginTop:'20px'}}>
              <div style={{flex:1, backgroundColor:'rgba(255,255,255,0.03)', padding:'10px', borderRadius:'12px'}}>
                <p style={{color:'#ffd700', fontSize:'12px', textAlign:'center'}}>קבוצה א'</p>
                {team1.map(p => <div key={p} onClick={() => movePlayer(p, "t1")} style={{padding:'8px', backgroundColor:'rgba(255,255,255,0.05)', borderRadius:'8px', color:'white', fontSize:'13px', marginBottom:'5px', display:'flex', justifyContent:'space-between'}}>{p} <span>⬅</span></div>)}
              </div>
              {gameMode === "team" && (
                <div style={{flex:1, backgroundColor:'rgba(255,255,255,0.03)', padding:'10px', borderRadius:'12px'}}>
                  <p style={{color:'#ffd700', fontSize:'12px', textAlign:'center'}}>קבוצה ב'</p>
                  {team2.map(p => <div key={p} onClick={() => movePlayer(p, "t2")} style={{padding:'8px', backgroundColor:'rgba(255,255,255,0.05)', borderRadius:'8px', color:'white', fontSize:'13px', marginBottom:'5px', display:'flex', justifyContent:'space-between'}}><span>➔</span> {p}</div>)}
                </div>
              )}
            </div>
            <button disabled={!canStart} onClick={startActualGame} style={{...styles.goldButton, marginTop:'30px', opacity: canStart ? 1 : 0.4}}>התחל משחק 🏁</button>
          </div>
        )}

        {step === 4 && (
          <div style={styles.gameLayout}>
            <div style={{...styles.timerDisplay, color: timeLeft <= 15 ? '#ef4444' : 'white'}}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
            <div style={styles.topGroup}>
              <div ref={skipRef} onPointerDown={(e) => { e.stopPropagation(); handleNextWord(true); }} style={{...styles.skipButton, backgroundColor: activeHover === "SKIP" ? '#ef4444' : 'transparent'}}>🚫 דלג</div>
              <div style={{...styles.wordCardArea, minHeight: isTextOnly ? '200px' : '240px'}}>
                {gameWords[currentWordIndex] && <WordCard word={gameWords[currentWordIndex].word} en={gameWords[currentWordIndex].en} img={gameWords[currentWordIndex].img} wordRef={wordRef} onPointerDown={handlePointerDown} isTextOnly={isTextOnly} />}
                {isDraggingWord && <div style={{...styles.wordCardPlaceholder, height: isTextOnly ? '180px' : '223px'}}></div>}
              </div>
              <div style={styles.guessersBox}>
                {[...team1, ...team2].map(p => (
                  <div key={p} ref={el => { playersRef.current[p] = el; }} onPointerDown={(e) => { e.stopPropagation(); handleNextWord(false); }}
                    style={{...styles.guesserButton, backgroundColor: activeHover === p ? '#10b981' : 'rgba(255,255,255,0.03)', borderColor: activeHover === p ? '#10b981' : 'rgba(255,255,255,0.1)'}}>
                    <div style={styles.miniAvatar}>{p[0]}</div>
                    <span style={{ color: 'white', userSelect: 'none' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{flex: 1}}></div>
            <div style={styles.gameFooter}>
              <button onClick={() => setIsPaused(true)} style={styles.modernPauseBtn}>⏸️</button>
              <div style={styles.bottomScore}>🏆 <span style={{direction:'ltr', display:'inline-block'}}>{score}</span></div>
            </div>
            {isPaused && <div style={styles.pauseOverlay}><button onClick={() => setIsPaused(false)} style={styles.hugePlayBtn}>▶️</button></div>}
          </div>
        )}
      </div>
    </div>
  );
}