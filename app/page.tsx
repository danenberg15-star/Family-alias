"use client";

import { useState, useEffect, CSSProperties, useRef } from "react";
import Logo from "./components/Logo";
import WordCard from "./components/WordCard"; 
import { KIDS_WORDS } from "../data/words/kids";
import { JUNIOR_WORDS } from "../data/words/junior";
import { TEEN_WORDS } from "../data/words/teen";
import { ADULT_WORDS } from "../data/words/adult";
import { db } from "./lib/firebase";
import { ref, onValue, set, update, get } from "firebase/database";

const WORD_DATABASE = {
  KIDS: KIDS_WORDS,
  JUNIOR: JUNIOR_WORDS,
  TEEN: TEEN_WORDS,
  ADULT: ADULT_WORDS
};

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [gameMode, setGameMode] = useState<"SOLO" | "GROUP">("SOLO");
  const [roomID, setRoomID] = useState("");
  const [joinID, setJoinID] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [players, setPlayers] = useState<{name: string, score: number}[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isDraggingWord, setIsDraggingWord] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof WORD_DATABASE>("KIDS");
  
  const wordRef = useRef<HTMLDivElement | null>(null);
  const playersRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const skipRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  // סנכרון Firebase
  useEffect(() => {
    if (!roomID) return;
    const roomRef = ref(db, `rooms/${roomID}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.score !== undefined) setCurrentScore(data.score);
        if (data.wordIndex !== undefined) setCurrentWordIndex(data.wordIndex);
        if (data.isPaused !== undefined) setIsPaused(data.isPaused);
        if (data.players) setPlayers(Object.values(data.players));
        if (data.category && WORD_DATABASE[data.category as keyof typeof WORD_DATABASE]) {
            setSelectedCategory(data.category as keyof typeof WORD_DATABASE);
            setGameWords(WORD_DATABASE[data.category as keyof typeof WORD_DATABASE]);
        }
      }
    });
    return () => unsubscribe();
  }, [roomID]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3 && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 3) { 
      setStep(4);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, isPaused]);

  if (!mounted) return null;

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomID(id);
    set(ref(db, `rooms/${id}`), {
      createdAt: Date.now(),
      score: 0,
      wordIndex: 0,
      isPaused: false,
      players: {}
    });
    setStep(2);
  };

  const joinRoom = async () => {
    if (!joinID) return;
    const id = joinID.toUpperCase();
    const roomRef = ref(db, `rooms/${id}`);
    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      setRoomID(id);
      setGameMode("GROUP");
      setStep(2);
    } else {
      alert("חדר לא נמצא!");
    }
  };

  const generateGameWords = (cat: keyof typeof WORD_DATABASE) => {
    setSelectedCategory(cat);
    let pool = [...WORD_DATABASE[cat]];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setGameWords(shuffled);
    if (roomID) {
        update(ref(db, `rooms/${roomID}`), { category: cat });
    }
  };

  const handleNextWord = (isSkip = false) => {
    const newScore = isSkip ? currentScore - 1 : currentScore + 1;
    const newIndex = currentWordIndex + 1;
    if (roomID) {
      update(ref(db, `rooms/${roomID}`), { score: newScore, wordIndex: newIndex });
    } else {
      setCurrentScore(newScore);
      setCurrentWordIndex(newIndex);
    }
    isDragging.current = false;
    setIsDraggingWord(false);
    setActiveHover(null);
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
    players.forEach((p) => {
      const el = playersRef.current[p.name];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) hovered = p.name;
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
        wordRef.current.style.position = 'relative'; 
        wordRef.current.style.left = 'auto'; 
        wordRef.current.style.top = 'auto'; 
      } 
    }
    setActiveHover(null);
  };

  const currentWord = gameWords[currentWordIndex];
  const isTextOnly = selectedCategory === "TEEN" || selectedCategory === "ADULT";

  return (
    <div style={containerStyle} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div style={safeAreaWrapper}>
        
        {/* שלב 1: לובי משופר */}
        {step === 1 && (
          <div style={flexLayout}>
            <Logo />
            <h1 style={{color:'white', fontSize:'24px', fontWeight:'bold', marginBottom:'10px'}}>Family Alias</h1>
            <div style={formCardStyle}>
                <button onClick={() => { setGameMode("SOLO"); createRoom(); }} style={{...goldButtonStyle, marginBottom:'15px'}}>צור חדר חדש 🏠</button>
                <div style={{borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'15px'}}>
                    <input 
                        type="text" 
                        value={joinID} 
                        onChange={(e) => setJoinID(e.target.value.toUpperCase())} 
                        style={{...inputStyle, textAlign:'center', fontSize:'20px', letterSpacing:'4px'}} 
                        placeholder="קוד חדר..." 
                    />
                    <button onClick={joinRoom} style={{...goldButtonStyle, marginTop:'10px', background:'linear-gradient(135deg, #10b981, #059669)'}}>הצטרף לחדר 🌐</button>
                </div>
            </div>
          </div>
        )}

        {/* שלב 2: הגדרות */}
        {step === 2 && (
          <div style={flexLayout}>
            <Logo />
            <div style={formCardStyle}>
              <h2 style={{color:'white', textAlign:'center', marginBottom:'15px'}}>קוד חדר: <span style={{color:'#ffd700'}}>{roomID}</span></h2>
              <form style={formStyle} onSubmit={(e) => {
                e.preventDefault();
                const ageNum = parseInt(age);
                const cat = ageNum <= 6 ? "KIDS" : ageNum <= 10 ? "JUNIOR" : ageNum <= 17 ? "TEEN" : "ADULT";
                generateGameWords(cat);
                setStep(5);
              }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="השם שלך..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} placeholder="הגיל שלך..." />
                <button type="submit" style={goldButtonStyle}>המשך</button>
              </form>
            </div>
          </div>
        )}

        {/* שלב 5: שחקנים */}
        {step === 5 && (
          <div style={flexLayout}>
            <Logo />
            <div style={formCardStyle}>
              <h3 style={{color:'white', textAlign:'center', marginBottom:'10px'}}>שחקנים בחדר {roomID}</h3>
              <div style={{display:'flex', gap:'5px', marginBottom:'15px'}}>
                <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} style={inputStyle} placeholder="שם שחקן..." />
                <button onClick={() => { 
                    if(newPlayerName) { 
                        const updatedPlayers = [...players, {name: newPlayerName, score: 0}];
                        setPlayers(updatedPlayers);
                        if(roomID) update(ref(db, `rooms/${roomID}`), { players: updatedPlayers });
                        setNewPlayerName(""); 
                    } 
                }} style={{...goldButtonStyle, width:'60px'}}>+</button>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px'}}>
                {players.map((p, i) => (
                  <div key={i} style={playerTagStyle}>
                    <span>{p.name}</span>
                    <button onClick={() => {
                        const filtered = players.filter((_, idx) => idx !== i);
                        setPlayers(filtered);
                        if(roomID) update(ref(db, `rooms/${roomID}`), { players: filtered });
                    }} style={{background:'none', border:'none', color:'#ef4444'}}>✕</button>
                  </div>
                ))}
              </div>
              <button disabled={players.length === 0} onClick={() => { setTimeLeft(60); setStep(3); }} style={{...goldButtonStyle, opacity: players.length === 0 ? 0.5 : 1}}>התחל!</button>
            </div>
          </div>
        )}

        {/* שלב 3: משחק */}
        {step === 3 && (
          <div style={gameLayout}>
            <div style={{...timerDisplay, color: timeLeft <= 15 ? '#ef4444' : 'white'}}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
            <div style={{textAlign:'center', color:'#ffd700', fontSize:'14px', marginBottom:'5px'}}>חדר: {roomID}</div>
            <div style={topGroupStyle}>
                <div ref={skipRef} onPointerDown={(e) => { e.stopPropagation(); handleNextWord(true); }}
                  style={{...skipButtonStyle, backgroundColor: activeHover === "SKIP" ? '#ef4444' : 'transparent'}}>🚫 דלג</div>
                <div style={{...wordCardArea, minHeight: isTextOnly ? '200px' : '240px'}}>
                  {currentWord ? <WordCard word={currentWord.word} en={currentWord.en} img={currentWord.img} wordRef={wordRef} onPointerDown={handlePointerDown} isTextOnly={isTextOnly} /> : <div style={{color:'white'}}>טוען מילים...</div>}
                  {isDraggingWord && <div style={{...wordCardPlaceholderStyle, height: isTextOnly ? '180px' : '223px'}}></div>}
                </div>
                <div style={guessersBox}>
                    {players.map(p => (
                      <div key={p.name} ref={el => { playersRef.current[p.name] = el; }} onPointerDown={(e) => { e.stopPropagation(); handleNextWord(false); }}
                        style={{ ...guesserButton, backgroundColor: activeHover === p.name ? '#10b981' : 'rgba(255,255,255,0.03)' }}>
                          <div style={miniAvatar}>{p.name[0]}</div>
                          <span style={{ color: 'white' }}>{p.name}</span>
                      </div>
                    ))}
                </div>
            </div>
            <div style={{flex:1}}></div>
            <div style={gameFooter}>
              <button onClick={() => { if(roomID) update(ref(db, `rooms/${roomID}`), {isPaused: !isPaused}); else setIsPaused(!isPaused); }} style={modernPauseBtn}>{isPaused ? '▶️' : '⏸️'}</button>
              <div style={bottomScore}>🏆 <span style={{direction:'ltr', display:'inline-block'}}>{currentScore}</span></div>
            </div>
            {isPaused && <div style={pauseOverlay}><button onClick={() => { if(roomID) update(ref(db, `rooms/${roomID}`), {isPaused: false}); else setIsPaused(false); }} style={hugePlayBtn}>▶️</button></div>}
          </div>
        )}

        {/* שלב 4: סיום */}
        {step === 4 && (
          <div style={flexLayout}>
            <div style={{fontSize:'80px'}}>🎊</div>
            <h1 style={{color:'white', fontSize:'32px', fontWeight:'bold'}}>כל הכבוד {name}!</h1>
            <div style={formCardStyle}>
                <h2 style={{color:'#ffd700', textAlign:'center', fontSize:'48px'}}>{currentScore}</h2>
                <p style={{color:'white', textAlign:'center'}}>נקודות בסיבוב הזה</p>
                <div style={{marginTop:'20px', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'15px'}}>
                    <h3 style={{color:'white', fontSize:'18px', marginBottom:'10px'}}>שחקנים:</h3>
                    {players.map((p, i) => (
                        <div key={i} style={{display:'flex', justifyContent:'space-between', color:'white', marginBottom:'5px'}}>
                            <span>{p.name}</span>
                            <span>{p.score} נק'</span>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => { setStep(1); setRoomID(""); setPlayers([]); setCurrentScore(0); }} style={goldButtonStyle}>חזור להתחלה 🔄</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles (נשארים זהים)
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none' };
const safeAreaWrapper: CSSProperties = { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '5px 20px' };
const flexLayout: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' };
const formCardStyle: CSSProperties = { width: '100%', padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color: 'white' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: 'bold', border:'none', cursor:'pointer' };
const playerTagStyle: CSSProperties = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 15px', backgroundColor:'rgba(255,255,255,0.05)', borderRadius:'10px', color:'white' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', gap: '4px' };
const timerDisplay: CSSProperties = { fontSize: '48px', fontWeight: 'bold', textAlign: 'center', margin: '15px 0 5px 0' };
const topGroupStyle: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' };
const skipButtonStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', borderRadius: '12px', border: '2px solid #ef4444', color: 'white', width: '100%' };
const wordCardArea: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%' };
const wordCardPlaceholderStyle: CSSProperties = { width: '100%', backgroundColor: 'transparent', visibility: 'hidden' };
const guessersBox: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' };
const guesserButton: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', width: '100%' };
const miniAvatar: CSSProperties = { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' };
const gameFooter: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px' };
const bottomScore: CSSProperties = { color: '#ffd700', fontSize: '24px', fontWeight: 'bold' };
const modernPauseBtn: CSSProperties = { background: 'rgba(255,255,255,0.1)', width: '45px', height: '45px', borderRadius: '12px', border: 'none', color: 'white' };
const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 };
const hugePlayBtn: CSSProperties = { backgroundColor: '#10b981', width: '80px', height: '80px', borderRadius: '50%', border: 'none', fontSize: '30px' };
const scoreCircle: CSSProperties = { fontSize: '40px', color: '#ffd700', border: '3px solid #ffd700', width: '110px', height: '110px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };