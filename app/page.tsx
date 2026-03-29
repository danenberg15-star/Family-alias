"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "./lib/firebase";
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
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

  // Persistence - טעינה ראשונית
  useEffect(() => {
    setMounted(true);
    const savedUserId = localStorage.getItem("alias_userId") || "u_" + Math.random().toString(36).substring(2, 9);
    const savedName = localStorage.getItem("alias_userName");
    const savedAge = localStorage.getItem("alias_userAge");
    const savedRoomId = localStorage.getItem("alias_roomId");

    setUserId(savedUserId);
    localStorage.setItem("alias_userId", savedUserId);

    if (savedName && savedAge) {
      setUserName(savedName);
      setUserAge(savedAge);
      if (savedRoomId) {
        setRoomId(savedRoomId);
      } else {
        setStep(2);
      }
    } else {
      // אם אין פרטים - מנקים הכל וחוזרים לשלב 1
      localStorage.removeItem("alias_roomId");
      setRoomId(null);
      setStep(1);
    }
  }, []);

  // האזנה ל-Firebase - רצה רק אם יש שם וחדר
  useEffect(() => {
    if (!roomId || !userName) return;
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRoomData(data);
        // רק אם המשתמש כבר עבר את שלב הלובי, נאפשר ל-DB לשנות לו את ה-Step
        if (step >= 2 || data.step > 2) {
          setStep(data.step);
        }
        localStorage.setItem("alias_roomId", roomId);
      } else {
        localStorage.removeItem("alias_roomId");
        setRoomId(null);
        setStep(2);
      }
    });
    return () => unsub();
  }, [roomId, userName, step]);

  const updateRoom = async (newData: any) => {
    if (roomId) await updateDoc(doc(db, "rooms", roomId), newData);
  };

  const adjustScoreInPause = async (entity: string, amount: number) => {
    if (!roomData) return;
    const current = roomData.totalScores[entity] || 0;
    await updateRoom({ [`totalScores.${entity}`]: Math.max(0, current + amount) });
  };

  // טיימר
  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused) return;
    const isIDescriber = roomData.players[roomData.currentTurnIdx]?.id === userId;
    if (!isIDescriber) return;

    const intervalId = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 60 });
      } else if (step === 5) {
        if (roomData.timeLeft > 0) updateRoom({ timeLeft: roomData.timeLeft - 1 });
        else updateRoom({ step: 6 });
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [step, roomId, roomData?.timeLeft, roomData?.preGameTimer, roomData?.isPaused, roomData?.currentTurnIdx, userId]);

  if (!mounted) return null;

  const handleGuess = async (isSkip: boolean) => {
    if (!roomData) return;
    const curP = roomData.players[roomData.currentTurnIdx];
    const change = isSkip ? -1 : 1;
    const updates: any = { roundScore: (roomData.roundScore || 0) + change, currentWordIdx: roomData.currentWordIdx + 1 };

    if (!isSkip && activeHover && activeHover !== 'SKIP') {
      if (roomData.gameMode === 'individual') {
        updates[`totalScores.${curP.name}`] = (roomData.totalScores[curP.name] || 0) + 1;
        updates[`totalScores.${activeHover}`] = (roomData.totalScores[activeHover] || 0) + 1;
      } else {
        const team = roomData.teamNames[curP.teamIdx];
        updates[`totalScores.${team}`] = (roomData.totalScores[team] || 0) + 1;
      }
    }
    await updateRoom(updates);

    const checkTargets = roomData.gameMode === 'individual' ? [curP.name, activeHover] : [roomData.teamNames[curP.teamIdx]];
    for (const name of checkTargets) {
      if (name && name !== 'SKIP' && (roomData.totalScores[name] || 0) >= 50) {
        await updateRoom({ step: 7, winner: name });
        break;
      }
    }
  };

  const currentP = roomData?.players[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;
  const currentPlayerCategory: CategoryType = currentP ? (parseInt(currentP.age) <= 6 ? "KIDS" : parseInt(currentP.age) <= 10 ? "JUNIOR" : parseInt(currentP.age) <= 16 ? "TEEN" : "ADULT") : "ADULT";

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !isIDescriber || roomData?.isPaused) return;
    if (wordRef.current) {
      wordRef.current.style.left = `${e.clientX - 110}px`; 
      wordRef.current.style.top = `${e.clientY - 90}px`;
      const wordRect = wordRef.current.getBoundingClientRect();
      let h: string | null = null;
      if (skipRef.current && !(skipRef.current.getBoundingClientRect().left > wordRect.right || skipRef.current.getBoundingClientRect().right < wordRect.left || skipRef.current.getBoundingClientRect().top > wordRect.bottom || skipRef.current.getBoundingClientRect().bottom < wordRect.top)) h = "SKIP";
      const targets = roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]];
      targets.forEach((t:string) => { 
        const el = targetsRef.current[t]; 
        if (el && !(el.getBoundingClientRect().left > wordRect.right || el.getBoundingClientRect().right < wordRect.left || el.getBoundingClientRect().top > wordRect.bottom || el.getBoundingClientRect().bottom < wordRect.top)) h = t;
      });
      setActiveHover(h);
    }
  };

  return (
    <div style={styles.container} onPointerMove={handlePointerMove} onPointerUp={() => {
      if (isDragging.current && activeHover) handleGuess(activeHover === "SKIP");
      isDragging.current = false; setActiveHover(null); setIsDraggingWord(false);
      if (wordRef.current) Object.assign(wordRef.current.style, { position: 'relative', left: 'auto', top: 'auto' });
    }}>
      <div style={styles.safeAreaWrapper}>
        {step === 1 && <EntryStep onNext={(n, a) => { 
          setUserName(n); 
          setUserAge(a); 
          localStorage.setItem("alias_userName", n); 
          localStorage.setItem("alias_userAge", a); 
          setStep(2); 
        }} />}
        
        {step === 2 && <LobbyStep onCreateRoom={async () => {
          const id = generateRoomCode();
          await setDoc(doc(db, "rooms", id), { id, step: 3, gameMode: "individual", numTeams: 2, players: [{ id: userId, name: userName, age: userAge, teamIdx: 0 }], teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"], totalScores: {}, roundScore: 0, timeLeft: 60, isPaused: false, currentTurnIdx: 0, currentWordIdx: 0, preGameTimer: 3, shuffledWords: [] });
          setRoomId(id);
        }} onJoinRoom={async () => {
          const id = prompt("קוד חדר:"); if(!id) return;
          if (id === "עומר") {
             const qaPlayers = [{ id: userId, name: userName || "עומר", age: "30", teamIdx: 0 }, ...Array(7).fill(0).map((_,i)=>({id:`b${i}`, name:`שחקן ${i+2}`, age:"25", teamIdx: Math.floor((i+1)/2)}))];
             await setDoc(doc(db, "rooms", "עומר"), { id: "עומר", step: 3, gameMode: "team", numTeams: 4, players: qaPlayers, teamNames: ["קבוצה א'","קבוצה ב'","קבוצה ג'","קבוצה ד'"], totalScores: {}, roundScore: 0, timeLeft: 60, isPaused: false, currentTurnIdx: 0, currentWordIdx: 0, preGameTimer: 3, shuffledWords: [] });
             setRoomId("עומר"); return;
          }
          const snap = await getDoc(doc(db, "rooms", id));
          if(snap.exists()){ await updateDoc(doc(db, "rooms", id), { players: arrayUnion({ id: userId, name: userName, age: userAge, teamIdx: 0 }) }); setRoomId(id); }
        }} />}

        {step === 3 && roomData && <SetupStep roomId={roomId!} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} numTeams={roomData.numTeams} setNumTeams={(n) => { const up = roomData.players.map((p:any) => p.teamIdx >= n ? {...p, teamIdx: 0} : p); updateRoom({ numTeams: n, players: up }); }} teamNames={roomData.teamNames} editTeamName={(idx) => { const n = prompt("שם:", roomData.teamNames[idx]); if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } }} players={roomData.players} onPlayerMove={(pId, teamIdx) => { const p = roomData.players.map((p:any) => p.id === pId ? {...p, teamIdx} : p); updateRoom({ players: p }); }} activeHover={activeHover} teamsRef={teamsRef} onStart={() => updateRoom({ step: 4, shuffledWords: getShuffledWords(currentPlayerCategory), currentWordIdx: 0, roundScore: 0 })} />}

        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP.name, team: roomData.teamNames[currentP.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}

        {step === 5 && roomData && (
          <>
            {isIDescriber ? (
              <GameStep timeLeft={roomData.timeLeft} currentWord={roomData.shuffledWords[roomData.currentWordIdx % roomData.shuffledWords.length]} wordRef={wordRef} skipRef={skipRef} onPointerDown={(e) => { isDragging.current = true; setIsDraggingWord(true); if(wordRef.current) { wordRef.current.style.position = 'fixed'; wordRef.current.style.left = `${e.clientX-110}px`; wordRef.current.style.top = `${e.clientY-90}px`; } }} isTextOnly={currentPlayerCategory === 'TEEN' || currentPlayerCategory === 'ADULT'} isDraggingWord={isDraggingWord} targets={roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]]} targetsRef={targetsRef} score={roomData.roundScore} onPause={() => updateRoom({ isPaused: true })} activeHover={activeHover} />
            ) : <GuesserView timeLeft={roomData.timeLeft} describerName={currentP.name} describerTeam={roomData.teamNames[currentP.teamIdx]} isTeamMode={roomData.gameMode === 'team'} totalScores={roomData.totalScores} roundScore={roomData.roundScore} entities={roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} onPause={() => updateRoom({ isPaused: true })} />}
            
            {roomData.isPaused && (
              <div style={styles.pauseOverlay}>
                <h1 style={{...styles.title, marginBottom: '20px'}}>תיקון ניקוד בלייב</h1>
                <div style={{width:'100%', maxWidth:'400px', background:'rgba(255,255,255,0.05)', borderRadius:'15px', padding:'15px'}}>
                  {(roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)).map((entity: string) => (
                    <div key={entity} style={styles.scoreAdjustRow}>
                      <span style={{fontSize:'18px', fontWeight:'bold', color: '#fff'}}>{entity}</span>
                      <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                        <button style={styles.adjBtn} onClick={() => adjustScoreInPause(entity, -1)}>-</button>
                        <span style={{fontSize:'22px', minWidth:'30px', textAlign:'center', color:'#ffd700'}}>{roomData.totalScores[entity] || 0}</span>
                        <button style={styles.adjBtn} onClick={() => adjustScoreInPause(entity, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => updateRoom({ isPaused: false })} style={{...styles.hugePlayBtn, marginTop:'30px'}}>▶️ חזרה למשחק</button>
              </div>
            )}
          </>
        )}

        {step === 6 && roomData && <ScoreStep scores={roomData.totalScores} entities={roomData.gameMode === "individual" ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} onNextRound={() => updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, timeLeft: 60, roundScore: 0, preGameTimer: 3, currentWordIdx: 0, shuffledWords: getShuffledWords(currentPlayerCategory) })} />}
        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={() => { localStorage.removeItem("alias_roomId"); updateRoom({ step: 1, players: [] }); setRoomId(null); setStep(1); }} />}
      </div>
    </div>
  );
}