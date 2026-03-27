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

const ROOM_WORDS = ["בלון", "חלון", "סביב", "גינה", "פרפר", "שמש", "כדור", "נחל", "ענב", "תמר"];

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [gameMode, setGameMode] = useState<"SOLO" | "GROUP">("SOLO");
  const [roomID, setRoomID] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [players, setPlayers] = useState<{name: string, team: number, score: number}[]>([]);
  const [activeRooms, setActiveRooms] = useState<string[]>([]);
  
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
  const isDragging = useRef(false);

  useEffect(() => { setMounted(true); fetchActiveRooms(); }, []);

  const fetchActiveRooms = () => {
    const roomsRef = ref(db, 'rooms');
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const active = Object.keys(data).filter(key => data[key].createdAt > fiveMinutesAgo);
        setActiveRooms(active);
      }
    });
  };

  const createRoom = () => {
    const randomWord = ROOM_WORDS[Math.floor(Math.random() * ROOM_WORDS.length)];
    setRoomID(randomWord);
    set(ref(db, `rooms/${randomWord}`), {
      createdAt: Date.now(),
      mode: gameMode,
      score: 0
    });
    setStep(2);
  };

  const startActualGame = () => {
    const ageNum = parseInt(age);
    const cat = ageNum <= 6 ? "KIDS" : ageNum <= 10 ? "JUNIOR" : ageNum <= 16 ? "TEEN" : "ADULT";
    setSelectedCategory(cat);
    setGameWords([...WORD_DATABASE[cat]].sort(() => Math.random() - 0.5));
    setStep(3);
  };

  // --- לוגיקת הגרירה המקורית והטובה שביקשת לא לשנות ---
  const handleNextWord = (isSkip = false) => {
    setCurrentScore(prev => isSkip ? prev - 1 : prev + 1);
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
    if (activeHover) handleNextWord(false);
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

  if (!mounted) return null;

  const isTextOnly = selectedCategory === "TEEN" || selectedCategory === "ADULT";

  return (
    <div style={containerStyle} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div style={safeAreaWrapper}>
        
        {step === 1 && (
          <div style={flexLayout}>
            <Logo />
            <div style={formCardStyle}>
              <div style={toggleContainer}>
                <button onClick={() => setGameMode("SOLO")} style={gameMode === "SOLO" ? activeToggle : inactiveToggle}>משחק אישי</button>
                <button onClick={() => setGameMode("GROUP")} style={gameMode === "GROUP" ? activeToggle : inactiveToggle}>משחק קבוצתי</button>
              </div>
              <button onClick={createRoom} style={goldButtonStyle}>צור חדר חדש 🏠</button>
              <div style={roomsGrid}>
                {activeRooms.map(r => <button key={r} onClick={() => { setRoomID(r); setStep(2); }} style={roomItemStyle}>{r}</button>)}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={flexLayout}>
            <h2 style={{color:'white'}}>חדר: {roomID}</h2>
            <div style={formCardStyle}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="שם..." />
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} placeholder="גיל..." />
              
              <div style={teamsLayout}>
                <div style={teamColumn}>
                  <div style={teamTitle}>קבוצה 1</div>
                  {players.filter(p => p.team === 1).map(p => <div key={p.name} style={playerTag}>{p.name}</div>)}
                  <button onClick={() => setPlayers([...players, {name: name || "שחקן", team: 1, score: 0}])} style={addBtn}>+</button>
                </div>
                {gameMode === "GROUP" && (
                  <div style={teamColumn}>
                    <div style={teamTitle}>קבוצה 2</div>
                    {players.filter(p => p.team === 2).map(p => <div key={p.name} style={playerTag}>{p.name}</div>)}
                    <button onClick={() => setPlayers([...players, {name: name || "שחקן", team: 2, score: 0}])} style={addBtn}>+</button>
                  </div>
                )}
              </div>
              <button onClick={startActualGame} style={{...goldButtonStyle, marginTop: '20px'}}>התחל!</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={gameLayout}>
             <div style={timerDisplay}>00:{timeLeft}</div>
             <div style={wordCardArea}>
                <WordCard 
                    word={gameWords[currentWordIndex]?.word} 
                    en={gameWords[currentWordIndex]?.en} 
                    img={gameWords[currentWordIndex]?.img} 
                    wordRef={wordRef}
                    onPointerDown={handlePointerDown}
                    isTextOnly={isTextOnly}
                />
                {isDraggingWord && <div style={{...wordCardPlaceholderStyle, height: isTextOnly ? '180px' : '223px'}}></div>}
             </div>
             <div style={guessersBox}>
                {players.map(p => (
                    <div key={p.name} ref={el => { playersRef.current[p.name] = el; }} 
                         style={{...guesserButton, backgroundColor: activeHover === p.name ? '#10b981' : 'rgba(255,255,255,0.05)'}}>
                        {p.name}
                    </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = { height: '100dvh', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden' };
const safeAreaWrapper: CSSProperties = { maxWidth: '360px', margin: '0 auto', height: '100%', padding: '20px' };
const flexLayout: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' };
const formCardStyle: CSSProperties = { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px' };
const toggleContainer: CSSProperties = { display: 'flex', gap: '10px', marginBottom: '20px' };
const activeToggle: CSSProperties = { flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: '#ffd700', fontWeight: 'bold', border: 'none' };
const inactiveToggle: CSSProperties = { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ffd700', color: '#ffd700', backgroundColor: 'transparent' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', fontWeight: 'bold', border: 'none' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' };
const teamsLayout: CSSProperties = { display: 'flex', gap: '10px' };
const teamColumn: CSSProperties = { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px' };
const teamTitle: CSSProperties = { color: '#ffd700', fontSize: '12px', marginBottom: '10px', textAlign: 'center' };
const playerTag: CSSProperties = { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '5px', borderRadius: '5px', marginBottom: '5px', fontSize: '11px', textAlign: 'center' };
const addBtn: CSSProperties = { width: '100%', border: '1px dashed #ffd700', background: 'none', color: '#ffd700', borderRadius: '5px' };
const roomsGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' };
const roomItemStyle: CSSProperties = { padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%' };
const timerDisplay: CSSProperties = { fontSize: '40px', color: 'white', textAlign: 'center', margin: '20px 0' };
const wordCardArea: CSSProperties = { display: 'flex', justifyContent: 'center', minHeight: '250px', position: 'relative' };
const wordCardPlaceholderStyle: CSSProperties = { width: '100%', backgroundColor: 'transparent', visibility: 'hidden' };
const guessersBox: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '20px' };
const guesserButton: CSSProperties = { padding: '10px', color: 'white', borderRadius: '10px', textAlign: 'center' };