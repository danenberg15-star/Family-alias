"use client";

import { useState, useEffect, CSSProperties, useRef } from "react";
import Logo from "./components/Logo";
import WordCard from "./components/WordCard"; 
import { KIDS_WORDS } from "../data/words/kids";
import { JUNIOR_WORDS } from "../data/words/junior";
import { TEEN_WORDS } from "../data/words/teen";
import { ADULT_WORDS } from "../data/words/adult";
import { db } from "./lib/firebase";
import { ref, onValue, set, update, get, query, orderByChild, startAt } from "firebase/database";

const WORD_DATABASE = {
  KIDS: KIDS_WORDS,
  JUNIOR: JUNIOR_WORDS,
  TEEN: TEEN_WORDS,
  ADULT: ADULT_WORDS
};

// רשימת מילים בעברית בת 4 אותיות לקוד חדר
const ROOM_WORDS = ["בלון", "חלון", "סביב", "גינה", "פרפר", "שמש", "כדור", "ביתה", "אורן", "נחל", "ענב", "תמר"];

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [gameMode, setGameMode] = useState<"SOLO" | "GROUP">("SOLO");
  const [roomID, setRoomID] = useState("");
  const [joinID, setJoinID] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [players, setPlayers] = useState<{name: string, team?: number}[]>([]);
  const [activeRooms, setActiveRooms] = useState<string[]>([]);
  
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof WORD_DATABASE>("KIDS");

  useEffect(() => { setMounted(true); fetchActiveRooms(); }, []);

  // מציג חדרים פעילים מ-5 הדקות האחרונות
  const fetchActiveRooms = () => {
    const roomsRef = ref(db, 'rooms');
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
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
      score: 0,
      wordIndex: 0,
      isPaused: false,
      mode: gameMode
    });
    setStep(2);
  };

  const joinRoom = async (id: string) => {
    const roomRef = ref(db, `rooms/${id}`);
    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      setRoomID(id);
      setGameMode(snapshot.val().mode);
      setStep(2);
    }
  };

  const startActualGame = () => {
    const ageNum = parseInt(age);
    const cat = ageNum <= 6 ? "KIDS" : ageNum <= 10 ? "JUNIOR" : ageNum <= 17 ? "TEEN" : "ADULT";
    setSelectedCategory(cat);
    setGameWords([...WORD_DATABASE[cat]].sort(() => Math.random() - 0.5));
    setStep(3);
  };

  if (!mounted) return null;

  return (
    <div style={containerStyle}>
      <div style={safeAreaWrapper}>
        
        {/* שלב 1: לובי עם בחירת מילה בעברית */}
        {step === 1 && (
          <div style={flexLayout}>
            <Logo />
            <div style={formCardStyle}>
              <div style={toggleContainer}>
                <button onClick={() => setGameMode("SOLO")} style={gameMode === "SOLO" ? activeToggle : inactiveToggle}>משחק אישי</button>
                <button onClick={() => setGameMode("GROUP")} style={gameMode === "GROUP" ? activeToggle : inactiveToggle}>משחק קבוצתי</button>
              </div>
              <button onClick={createRoom} style={goldButtonStyle}>צור חדר חדש 🏠</button>
              
              <div style={roomsListHeader}>חדרים פעילים (5 דק' אחרונות):</div>
              <div style={roomsGrid}>
                {activeRooms.map(room => (
                  <button key={room} onClick={() => joinRoom(room)} style={roomItemStyle}>{room}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* שלב 2: הגדרות וחלוקה לקבוצות */}
        {step === 2 && (
          <div style={flexLayout}>
            <h2 style={{color:'white'}}>חדר: {roomID}</h2>
            <div style={formCardStyle}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="השם שלך..." />
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} placeholder="גיל..." />
              
              {gameMode === "GROUP" ? (
                <div style={teamsLayout}>
                  <div style={teamColumn}>
                    <div style={teamTitle}>קבוצה 1</div>
                    {players.filter(p => p.team === 1).map(p => <div key={p.name} style={playerTag}>{p.name}</div>)}
                    <button onClick={() => setPlayers([...players, {name: name || "שחקן", team: 1}])} style={addBtn}>+</button>
                  </div>
                  <div style={teamColumn}>
                    <div style={teamTitle}>קבוצה 2</div>
                    {players.filter(p => p.team === 2).map(p => <div key={p.name} style={playerTag}>{p.name}</div>)}
                    <button onClick={() => setPlayers([...players, {name: name || "שחקן", team: 2}])} style={addBtn}>+</button>
                  </div>
                </div>
              ) : (
                <div style={{marginTop:'10px'}}>
                  {players.map((p, i) => <div key={i} style={playerTag}>{p.name}</div>)}
                  <button onClick={() => setPlayers([...players, {name: name || "שחקן"}])} style={goldButtonStyle}>הוסף מנחש</button>
                </div>
              )}
              
              <button onClick={startActualGame} style={{...goldButtonStyle, marginTop:'20px'}}>התחל משחק!</button>
            </div>
          </div>
        )}

        {/* שלב 3: מסך המשחק (ללא שינוי בלוגיקת ה-WordCard) */}
        {step === 3 && (
          <div style={gameLayout}>
             {/* כאן נשאר הקוד של מסך המשחק שטיבנו (טיימר, WordCard וגרירה) */}
             <div style={timerDisplay}>00:{timeLeft}</div>
             <WordCard 
                word={gameWords[currentWordIndex]?.word} 
                en={gameWords[currentWordIndex]?.en} 
                img={gameWords[currentWordIndex]?.img} 
                isTextOnly={selectedCategory === "TEEN" || selectedCategory === "ADULT"}
             />
             {/* שאר כפתורי הניחוש בתחתית... */}
          </div>
        )}

      </div>
    </div>
  );
}

// סטיילס להדבקה
const containerStyle: CSSProperties = { height: '100dvh', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden' };
const safeAreaWrapper: CSSProperties = { maxWidth: '360px', margin: '0 auto', height: '100%', padding: '20px' };
const flexLayout: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', paddingTop: '40px' };
const formCardStyle: CSSProperties = { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px' };
const toggleContainer: CSSProperties = { display: 'flex', gap: '10px', marginBottom: '20px' };
const activeToggle: CSSProperties = { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#ffd700', fontWeight: 'bold' };
const inactiveToggle: CSSProperties = { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ffd700', backgroundColor: 'transparent', color: '#ffd700' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', border: 'none', fontWeight: 'bold' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white' };
const roomsGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' };
const roomItemStyle: CSSProperties = { padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px' };
const roomsListHeader: CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '20px' };
const teamsLayout: CSSProperties = { display: 'flex', gap: '10px', marginTop: '20px' };
const teamColumn: CSSProperties = { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px', textAlign: 'center' };
const teamTitle: CSSProperties = { color: '#ffd700', fontSize: '14px', marginBottom: '10px' };
const playerTag: CSSProperties = { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '5px', borderRadius: '5px', marginBottom: '5px', fontSize: '12px' };
const addBtn: CSSProperties = { width: '100%', border: '1px dashed #ffd700', background: 'none', color: '#ffd700', borderRadius: '5px' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%' };
const timerDisplay: CSSProperties = { fontSize: '40px', color: 'white', textAlign: 'center', margin: '20px 0' };