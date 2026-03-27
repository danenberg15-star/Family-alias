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
  const [gameMode, setGameMode] = useState<"individual" | "team">("individual");
  const [numTeams, setNumTeams] = useState(2);
  
  // סימולציית 8 שחקנים
  const [players, setPlayers] = useState<string[]>([]);
  const [teamNames, setTeamNames] = useState(["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"]);
  const [playerTeamMap, setPlayerTeamMap] = useState<{[key: string]: number}>({});

  const [preGameTimer, setPreGameTimer] = useState(5);
  const [turnInfo, setTurnInfo] = useState({ name: "", team: "" });
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
  const skipRef = useRef<HTMLDivElement | null>(null); // תיקון השגיאה מהצילום מסך
  const isDragging = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && preGameTimer > 0) {
      timer = setInterval(() => setPreGameTimer(p => p - 1), 1000);
    } else if (step === 4 && preGameTimer === 0) {
      setStep(5);
    } else if (step === 5 && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, preGameTimer, timeLeft, isPaused]);

  if (!mounted) return null;

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const mockPlayers = [name || "אני", "אבא", "אמא", "יעל", "סבא", "סבתא", "רוני", "דן"];
    setPlayers(mockPlayers);
    const initialMap: any = {};
    mockPlayers.forEach((p, i) => initialMap[p] = (i % numTeams));
    setPlayerTeamMap(initialMap);
    setStep(2);
  };

  const movePlayer = (pName: string) => {
    setPlayerTeamMap(prev => ({
      ...prev,
      [pName]: (prev[pName] + 1) % numTeams
    }));
  };

  const editTeamName = (idx: number) => {
    const n = prompt("שם קבוצה חדש:", teamNames[idx]);
    if (n) {
      const newNames = [...teamNames];
      newNames[idx] = n;
      setTeamNames(newNames);
    }
  };

  const startPreGame = () => {
    const ageNum = parseInt(age);
    const cat: CategoryType = ageNum <= 6 ? "KIDS" : ageNum <= 10 ? "JUNIOR" : ageNum <= 16 ? "TEEN" : "ADULT";
    setSelectedCategory(cat);
    setGameWords([...WORD_DATABASE[cat]].sort(() => Math.random() - 0.5));
    
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    setTurnInfo({ name: randomPlayer, team: teamNames[playerTeamMap[randomPlayer]] });
    setPreGameTimer(5);
    setStep(4);
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
    let h: string | null = null;
    if (skipRef.current) {
      const r = skipRef.current.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) h = "SKIP";
    }
    const targets = gameMode === "individual" ? players : teamNames.slice(0, numTeams);
    targets.forEach((t) => {
      const el = targetsRef.current[t];
      if (el) {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) h = t;
      }
    });
    setActiveHover(h);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    if (activeHover === "SKIP") handleNextWord(true);
    else if (activeHover) handleNextWord(false);
    else { 
      isDragging.current = false; setIsDraggingWord(false);
      if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
    }
    setActiveHover(null);
  };

  const isTextOnly = selectedCategory === "TEEN" || selectedCategory === "ADULT";

  // לוגיקה לבדיקת תקינות התחלת משחק
  const teamPlayerCounts = teamNames.slice(0, numTeams).map((_, i) => players.filter(p => playerTeamMap[p] === i).length);
  const canStart = gameMode === "individual" ? players.length >= 2 : teamPlayerCounts.every(count => count >= 2);

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
              <div style={styles.guesserButton}><span>🏠 חלון</span><button onClick={() => setStep(3)} style={{backgroundColor:'#10b981', color:'white', border:'none', padding:'5px 15px', borderRadius:'8px'}}>הצטרף</button></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{...styles.flexLayout, justifyContent:'flex-start', paddingTop:'20px'}}>
            <h2 style={{color:'white', marginBottom:'15px'}}>חדר: "חלון"</h2>
            <div style={{display:'flex', gap:'5px', width:'100%', backgroundColor:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'12px'}}>
              <button onClick={() => setGameMode("individual")} style={gameMode === "individual" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק אישי</button>
              <button onClick={() => setGameMode("team")} style={gameMode === "team" ? {flex:1, padding:'10px', backgroundColor:'#4f46e5', color:'white', border:'none', borderRadius:'10px'} : {flex:1, color:'#64748b', border:'none', background:'none'}}>משחק קבוצתי</button>
            </div>

            {gameMode === "team" && (
              <div style={{marginTop:'10px', width:'100%'}}>
                <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                  {[2, 3, 4].map(n => (
                    <button key={n} onClick={() => setNumTeams(n)} style={{width:'35px', height:'35px', borderRadius:'50%', border: numTeams === n ? '2px solid #ffd700' : '1px solid white', backgroundColor: numTeams === n ? '#ffd700' : 'transparent', color: numTeams === n ? 'black' : 'white'}}>{n}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={gameMode === "team" ? styles.teamsGrid : {width:'100%', marginTop:'15px'}}>
              {(gameMode === "team" ? teamNames.slice(0, numTeams) : ["שחקנים"]).map((tName, tIdx) => (
                <div key={tIdx} style={styles.teamColumn}>
                  {gameMode === "team" && (
                    <div style={styles.teamHeaderWrapper}>
                      <span style={{color:'#ffd700', fontSize:'13px'}}>{tName}</span>
                      <span onClick={() => editTeamName(tIdx)} style={styles.editIcon}>✏️</span>
                    </div>
                  )}
                  {players.filter(p => gameMode === "individual" || playerTeamMap[p] === tIdx).map(p => (
                    <div key={p} onClick={() => movePlayer(p)} style={styles.playerTag}>
                      <span>{p}</span>
                      {gameMode === "team" && <span style={{fontSize:'10px'}}>{playerTeamMap[p] === numTeams - 1 ? '⬅️' : '➔'}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button disabled={!canStart} onClick={startPreGame} style={{...styles.goldButton, marginTop:'20px', opacity: canStart ? 1 : 0.4}}>התחל משחק 🏁</button>
          </div>
        )}

        {step === 4 && (
          <div style={styles.flexLayout}>
            <div style={styles.turnInfo}>תור השחקן <b>{turnInfo.name}</b> {gameMode === "team" && `מ${turnInfo.team}`}</div>
            <div style={styles.hugeTimer}>{preGameTimer}</div>
            <div style={styles.loadingText}>טוען תמונות...</div>
          </div>
        )}

        {step === 5 && (
          <div style={styles.gameLayout}>
            <div style={{...styles.timerDisplay, color: timeLeft <= 15 ? '#ef4444' : 'white'}}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
            <div style={styles.topGroup}>
              <div ref={skipRef} style={{...styles.skipButton, backgroundColor: activeHover === "SKIP" ? '#ef4444' : 'transparent', borderColor: '#ef4444'}}>🚫 דלג</div>
              <div style={styles.wordCardArea}>
                {gameWords[currentWordIndex] && <WordCard word={gameWords[currentWordIndex].word} en={gameWords[currentWordIndex].en} img={gameWords[currentWordIndex].img} wordRef={wordRef} onPointerDown={handlePointerDown} isTextOnly={isTextOnly} />}
                {isDraggingWord && <div style={{...styles.wordCardPlaceholder, height: isTextOnly ? '180px' : '223px'}}></div>}
              </div>
              <div style={styles.guessersBox}>
                {(gameMode === "individual" ? players : teamNames.slice(0, numTeams)).map(target => (
                  <div key={target} ref={el => { targetsRef.current[target] = el; }} onPointerDown={(e) => { e.stopPropagation(); handleNextWord(false); }}
                    style={{...styles.guesserButton, backgroundColor: activeHover === target ? '#10b981' : 'rgba(255,255,255,0.03)', borderColor: activeHover === target ? '#10b981' : 'rgba(255,255,255,0.1)'}}>
                    <div style={styles.miniAvatar}>{target[0]}</div>
                    <span style={{ color: 'white', userSelect: 'none' }}>{target}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.gameFooter}>
              <div style={styles.bottomScore}>🏆 <span>{score}</span></div>
              <button onClick={() => setIsPaused(true)} style={styles.modernPauseBtn}>⏸️</button>
            </div>
            {isPaused && <div style={styles.pauseOverlay}><button onClick={() => setIsPaused(false)} style={styles.hugePlayBtn}>▶️</button></div>}
          </div>
        )}
      </div>
    </div>
  );
}