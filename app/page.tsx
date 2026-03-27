"use client";

import { useState, useEffect, useRef } from "react";
import Logo from "./components/Logo";
import WordCard from "./components/WordCard"; 
import { styles } from "./game.styles";
import { WORD_DATABASE, CategoryType } from "./game.config";

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1:Entry, 2:Lobby, 3:Setup, 4:Countdown, 5:Game
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gameMode, setGameMode] = useState<"individual" | "team">("individual");
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState([{name: "קבוצה א'", players: []}, {name: "קבוצה ב'", players: []}, {name: "קבוצה ג'", players: []}, {name: "קבוצה ד'", players: []}]);
  const [players, setPlayers] = useState<string[]>([]);
  
  const [preGameTimer, setPreGameTimer] = useState(5);
  const [startingTurn, setStartingTurn] = useState("");
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isDraggingWord, setIsDraggingWord] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("KIDS");

  const wordRef = useRef<HTMLDivElement | null>(null);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isDragging = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  // ניהול טיימרים
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && preGameTimer > 0) {
      timer = setInterval(() => setPreGameTimer(prev => prev - 1), 1000);
    } else if (step === 4 && preGameTimer === 0) {
      setStep(5);
    } else if (step === 5 && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 5) {
      setStep(1); // סיום
    }
    return () => clearInterval(timer);
  }, [step, preGameTimer, timeLeft, isPaused]);

  if (!mounted) return null;

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setPlayers([name, "אבא", "אמא", "יעל"]); // סימולציה של 4 שחקנים [cite: 8]
    setStep(2);
  };

  const startPreGame = () => {
    const ageNum = parseInt(age);
    const cat: CategoryType = ageNum <= 6 ? "KIDS" : ageNum <= 10 ? "JUNIOR" : ageNum <= 16 ? "TEEN" : "ADULT";
    setSelectedCategory(cat);
    setGameWords([...WORD_DATABASE[cat]].sort(() => Math.random() - 0.5));
    
    // הגרלת תור ראשון [cite: 36]
    const entities = gameMode === "individual" ? players : teams.slice(0, numTeams).map(t => t.name);
    setStartingTurn(entities[Math.floor(Math.random() * entities.length)]);
    
    setPreGameTimer(5);
    setStep(4);
  };

  const editTeamName = (index: number) => {
    const newName = prompt("הכנס שם חדש לקבוצה:", teams[index].name);
    if (newName) {
      const updated = [...teams];
      updated[index].name = newName;
      setTeams(updated);
    }
  };

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
    
    // גרירה למעלה לדילוג [cite: 23]
    if (e.clientY < 80) hovered = "SKIP";

    const targets = gameMode === "individual" ? players : teams.slice(0, numTeams).map(t => t.name);
    targets.forEach((tName) => {
      const el = targetsRef.current[tName];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) hovered = tName;
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
            <h2 style={{color:'white', marginBottom:'20px'}}>חדר: "חלון" [cite: 14]</h2>
            <div style={{display:'flex', gap:'5px', width:'100%', backgroundColor:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'12px'}}>
              <button onClick={() => setGameMode("individual")} style={gameMode === "individual" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק אישי</button>
              <button onClick={() => setGameMode("team")} style={gameMode === "team" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק קבוצתי</button>
            </div>

            {gameMode === "team" && (
              <div style={{marginTop:'15px', width:'100%'}}>
                <p style={{color:'white', fontSize:'12px', textAlign:'center', marginBottom:'10px'}}>מספר קבוצות:</p>
                <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                  {[2, 3, 4].map(n => (
                    <button key={n} onClick={() => setNumTeams(n)} style={{width:'40px', height:'40px', borderRadius:'50%', border: numTeams === n ? '2px solid #ffd700' : '1px solid white', backgroundColor: numTeams === n ? '#ffd700' : 'transparent', color: numTeams === n ? 'black' : 'white'}}>{n}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={gameMode === "team" ? styles.teamsGrid : {width:'100%', marginTop:'20px'}}>
              {(gameMode === "team" ? teams.slice(0, numTeams) : [{name: "שחקנים", players}]).map((item, idx) => (
                <div key={idx} style={styles.teamColumn}>
                  {gameMode === "team" && (
                    <div style={styles.teamNameWrapper}>
                      <span style={{color:'#ffd700', fontSize:'14px'}}>{item.name}</span>
                      <span onClick={() => editTeamName(idx)} style={styles.editIcon}>✏️</span>
                    </div>
                  )}
                  {(gameMode === "team" ? item.players : players).map(p => (
                    <div key={p} style={{padding:'6px', backgroundColor:'rgba(255,255,255,0.05)', borderRadius:'8px', color:'white', fontSize:'13px', marginBottom:'4px'}}>{p}</div>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={startPreGame} style={{...styles.goldButton, marginTop:'30px'}}>התחל משחק 🏁</button>
          </div>
        )}

        {step === 4 && (
          <div style={styles.flexLayout}>
            <div style={styles.turnAnnouncement}>תור המנצח הראשון: [cite: 36]</div>
            <div style={{fontSize:'32px', color:'#ffd700', fontWeight:'bold'}}>{startingTurn}</div>
            <div style={styles.hugeTimer}>{preGameTimer}</div>
            <div style={{color:'white', opacity:0.6}}>טוען תמונות... [cite: 9]</div>
          </div>
        )}

        {step === 5 && (
          <div style={styles.gameLayout}>
            <div style={{...styles.timerDisplay, color: timeLeft <= 15 ? '#ef4444' : 'white'}}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
            <div style={styles.topGroup}>
              <div style={{...styles.skipButton, backgroundColor: activeHover === "SKIP" ? '#ef4444' : 'transparent', borderColor: activeHover === "SKIP" ? '#ef4444' : '#ef4444'}}>🚫 דלג [cite: 23]</div>
              <div style={styles.wordCardArea}>
                {gameWords[currentWordIndex] && <WordCard word={gameWords[currentWordIndex].word} en={gameWords[currentWordIndex].en} img={gameWords[currentWordIndex].img} wordRef={wordRef} onPointerDown={handlePointerDown} isTextOnly={isTextOnly} />}
                {isDraggingWord && <div style={{...styles.wordCardPlaceholder, height: isTextOnly ? '180px' : '223px'}}></div>}
              </div>
              <div style={styles.guessersBox}>
                {(gameMode === "individual" ? players : teams.slice(0, numTeams).map(t => t.name)).map(tName => (
                  <div key={tName} ref={el => { targetsRef.current[tName] = el; }} onPointerDown={(e) => { e.stopPropagation(); handleNextWord(false); }}
                    style={{...styles.guesserButton, backgroundColor: activeHover === tName ? '#10b981' : 'rgba(255,255,255,0.03)', borderColor: activeHover === tName ? '#10b981' : 'rgba(255,255,255,0.1)'}}>
                    <div style={styles.miniAvatar}>{tName[0]}</div>
                    <span style={{ color: 'white', userSelect: 'none' }}>{tName}</span>
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