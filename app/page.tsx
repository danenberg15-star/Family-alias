"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "./lib/firebase";
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  updateDoc, 
  arrayUnion, 
  getDoc 
} from "firebase/firestore";
import EntryStep from "./components/EntryStep";
import LobbyStep from "./components/LobbyStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import GuesserView from "./components/GuesserView";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";
import { styles } from "./game.styles";
import { CategoryType } from "./game.config";
import { generateRoomCode, getShuffledWords } from "./lib/game-utils";

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");

  const wordRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef<HTMLDivElement | null>(null);
  const targetsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const teamsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const isDragging = useRef(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [isDraggingWord, setIsDraggingWord] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUserId = localStorage.getItem("alias_userId") || "u_" + Math.random().toString(36).substring(2, 9);
    setUserId(savedUserId);
    localStorage.setItem("alias_userId", savedUserId);
    
    const savedName = localStorage.getItem("alias_userName");
    const savedAge = localStorage.getItem("alias_userAge");
    if (savedName && savedAge) {
      setUserName(savedName);
      setUserAge(savedAge);
      const sRoomId = localStorage.getItem("alias_roomId");
      if (sRoomId) setRoomId(sRoomId);
      else setStep(2);
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRoomData(data);
        setStep(data.step);
      }
    });
    return () => unsub();
  }, [roomId]);

  const updateRoom = async (newData: any) => {
    if (roomId) await updateDoc(doc(db, "rooms", roomId), newData);
  };

  const handleFullReset = () => {
    localStorage.clear();
    setRoomId(null);
    setUserName("");
    setUserAge("");
    setStep(1);
    window.location.reload();
  };

  const handleCreateRoom = async () => {
    const id = generateRoomCode();
    await setDoc(doc(db, "rooms", id), {
      id,
      step: 3,
      createdAt: Date.now(),
      gameMode: "individual",
      numTeams: 2,
      players: [{ id: userId, name: userName, age: userAge, teamIdx: 0 }],
      teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"],
      totalScores: {},
      roundScore: 0,
      timeLeft: 60,
      isPaused: false,
      currentTurnIdx: 0,
      currentWordIdx: 0,
      preGameTimer: 3,
      shuffledWords: []
    });
    setRoomId(id);
    localStorage.setItem("alias_roomId", id);
  };

  const handleJoinRoom = async (id: string) => {
    // לוגיקת "עומר" - חדר QA עם משתמשי דמה
    if (id === "עומר") {
       const qaPlayers = [
         { id: userId, name: userName || "עומר", age: userAge || "30", teamIdx: 0 },
         ...Array(7).fill(0).map((_, i) => ({
           id: `dummy_${i}`,
           name: `שחקן ${i + 2}`,
           age: "25",
           teamIdx: Math.floor((i + 1) / 2)
         }))
       ];
       await setDoc(doc(db, "rooms", "עומר"), {
         id: "עומר",
         step: 3,
         createdAt: Date.now(),
         gameMode: "team",
         numTeams: 4,
         players: qaPlayers,
         teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"],
         totalScores: {},
         roundScore: 0,
         timeLeft: 60,
         isPaused: false,
         currentTurnIdx: 0,
         currentWordIdx: 0,
         preGameTimer: 3,
         shuffledWords: []
       });
       setRoomId("עומר");
       localStorage.setItem("alias_roomId", "עומר");
       return;
    }

    // הצטרפות רגילה
    const snap = await getDoc(doc(db, "rooms", id));
    if (snap.exists()) {
      const data = snap.data();
      // אם החדר כבר התחיל, פשוט נכנסים לצפייה. אם הוא ב-Setup, מוסיפים את השחקן.
      if (data.step === 3) {
        await updateDoc(doc(db, "rooms", id), {
          players: arrayUnion({ id: userId, name: userName, age: userAge, teamIdx: 0 })
        });
      }
      setRoomId(id);
      localStorage.setItem("alias_roomId", id);
    } else {
      alert("החדר לא נמצא 😕");
    }
  };

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;
  const getCategoryByAge = (age: string): CategoryType => {
    const a = parseInt(age);
    if (a <= 6) return "KIDS";
    if (a <= 10) return "JUNIOR";
    if (a <= 16) return "TEEN";
    return "ADULT";
  };
  const currentPlayerCategory = currentP ? getCategoryByAge(currentP.age) : "ADULT";

  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || step < 4 || !isIDescriber) return;
    const timer = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 60, shuffledWords: getShuffledWords(currentPlayerCategory) });
      } else if (step === 5) {
        if (roomData.timeLeft > 0) updateRoom({ timeLeft: roomData.timeLeft - 1 });
        else updateRoom({ step: 6 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [step, roomId, roomData?.timeLeft, roomData?.preGameTimer, roomData?.isPaused, isIDescriber, currentPlayerCategory]);

  const handleGuess = async (isSkip: boolean) => {
    if (!roomData) return;
    const curP = roomData.players[roomData.currentTurnIdx];
    const change = isSkip ? -1 : 1;
    const updates: any = { roundScore: (roomData.roundScore || 0) + change, currentWordIdx: roomData.currentWordIdx + 1 };
    if (!isSkip && activeHover && activeHover !== 'SKIP') {
      const entity = roomData.gameMode === 'individual' ? activeHover : roomData.teamNames[curP.teamIdx];
      updates[`totalScores.${entity}`] = (roomData.totalScores[entity] || 0) + 1;
    }
    await updateRoom(updates);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !isIDescriber || roomData?.isPaused) return;
    if (wordRef.current) {
      wordRef.current.style.left = `${e.clientX - 130}px`; 
      wordRef.current.style.top = `${e.clientY - 110}px`;
      const wordRect = wordRef.current.getBoundingClientRect();
      let h: string | null = null;
      if (skipRef.current && !(skipRef.current.getBoundingClientRect().left > wordRect.right || skipRef.current.getBoundingClientRect().right < wordRect.left || skipRef.current.getBoundingClientRect().top > wordRect.bottom || skipRef.current.getBoundingClientRect().bottom < wordRect.top)) h = "SKIP";
      const tgts = roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]];
      tgts.forEach((t:string) => { 
        const el = targetsRef.current[t]; 
        if (el && !(el.getBoundingClientRect().left > wordRect.right || el.getBoundingClientRect().right < wordRect.left || el.getBoundingClientRect().top > wordRect.bottom || el.getBoundingClientRect().bottom < wordRect.top)) h = t;
      });
      setActiveHover(h);
    }
  };

  if (!mounted) return null;

  return (
    <div style={styles.container} onPointerMove={handlePointerMove} onPointerUp={() => {
      if (isDragging.current && activeHover) handleGuess(activeHover === "SKIP");
      isDragging.current = false; setActiveHover(null); setIsDraggingWord(false);
      if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
    }}>
      <div style={styles.safeAreaWrapper}>
        {step > 1 && <button onClick={handleFullReset} style={styles.exitBtn}>✕</button>}
        
        {step === 1 && <EntryStep onNext={(n, a) => { setUserName(n); setUserAge(a); localStorage.setItem("alias_userName", n); localStorage.setItem("alias_userAge", a); setStep(2); }} />}
        
        {step === 2 && <LobbyStep onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />}

        {step === 3 && roomData && (
          <SetupStep 
            roomId={roomId!} 
            gameMode={roomData.gameMode} 
            setGameMode={(m) => updateRoom({ gameMode: m })} 
            numTeams={roomData.numTeams} 
            setNumTeams={(n) => { const up = roomData.players.map((p:any) => p.teamIdx >= n ? {...p, teamIdx: 0} : p); updateRoom({ numTeams: n, players: up }); }} 
            teamNames={roomData.teamNames} 
            editTeamName={(idx) => { const n = prompt("שם:", roomData.teamNames[idx]); if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } }} 
            players={roomData.players} 
            onPlayerMove={(pId, teamIdx) => { const p = roomData.players.map((p:any) => p.id === pId ? {...p, teamIdx} : p); updateRoom({ players: p }); }} 
            activeHover={activeHover} 
            teamsRef={teamsRef as any} 
            onStart={() => updateRoom({ step: 4, shuffledWords: getShuffledWords(currentPlayerCategory), currentWordIdx: 0, roundScore: 0, preGameTimer: 3 })} 
          />
        )}

        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP?.name || "", team: roomData.teamNames[currentP?.teamIdx] || ""}} isTeamMode={roomData.gameMode === "team"} />}

        {step === 5 && roomData && (
          <>
            {isIDescriber ? (
              <GameStep timeLeft={roomData.timeLeft} currentWord={roomData.shuffledWords[roomData.currentWordIdx % roomData.shuffledWords.length]} wordRef={wordRef} skipRef={skipRef} onPointerDown={(e) => { isDragging.current = true; setIsDraggingWord(true); if(wordRef.current) { wordRef.current.style.position = 'fixed'; wordRef.current.style.left = `${e.clientX-130}px`; wordRef.current.style.top = `${e.clientY-110}px`; } }} isTextOnly={parseInt(userAge) > 10} isDraggingWord={isDraggingWord} targets={roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]]} targetsRef={targetsRef as any} score={roomData.roundScore} onPause={() => updateRoom({ isPaused: true })} activeHover={activeHover} />
            ) : <GuesserView timeLeft={roomData.timeLeft} describerName={currentP?.name} describerTeam={roomData.teamNames[currentP?.teamIdx]} isTeamMode={roomData.gameMode === 'team'} totalScores={roomData.totalScores} roundScore={roomData.roundScore} entities={roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} onPause={() => updateRoom({ isPaused: true })} />}
            
            {roomData.isPaused && (
              <div style={styles.pauseOverlay}>
                <h1 style={{...styles.title, color: 'white'}}>משחק מושהה ⏸️</h1>
                <div style={styles.scoreTable}>
                  {(roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)).map((entity: string) => (
                    <div key={entity} style={styles.scoreRow}>
                      <span style={{fontWeight:'bold', color: 'white'}}>{entity}</span>
                      <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                        <button style={styles.adjBtn} onClick={() => updateRoom({ [`totalScores.${entity}`]: Math.max(0, (roomData.totalScores[entity] || 0) - 1) })}>-</button>
                        <span style={{fontSize:'20px', minWidth:'30px', textAlign:'center', color:'#ffd700'}}>{roomData.totalScores[entity] || 0}</span>
                        <button style={styles.adjBtn} onClick={() => updateRoom({ [`totalScores.${entity}`]: (roomData.totalScores[entity] || 0) + 1 })}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => updateRoom({ isPaused: false })} style={styles.hugePlayBtn}>חזרה למשחק ▶️</button>
              </div>
            )}
          </>
        )}

        {step === 6 && roomData && <ScoreStep scores={roomData.totalScores} entities={roomData.gameMode === "individual" ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} onNextRound={() => updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, timeLeft: 60, roundScore: 0, preGameTimer: 3, currentWordIdx: 0, shuffledWords: getShuffledWords(currentPlayerCategory) })} />}
        
        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={() => handleFullReset()} />}
      </div>
    </div>
  );
}