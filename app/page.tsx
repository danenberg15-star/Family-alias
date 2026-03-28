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
import { 
  WORD_DATABASE, 
  CategoryType, 
  HEBREW_ROOM_CODES, 
  getShuffledWords, 
  DifficultyLevel,
  WordItem 
} from "./game.config";

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

  // Persistence logic
  useEffect(() => {
    setMounted(true);
    const savedUserId = localStorage.getItem("alias_userId");
    const savedRoomId = localStorage.getItem("alias_roomId");
    const savedName = localStorage.getItem("alias_userName");
    const savedAge = localStorage.getItem("alias_userAge");

    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      const newId = "u_" + Math.random().toString(36).substring(2, 9);
      setUserId(newId);
      localStorage.setItem("alias_userId", newId);
    }

    if (savedName) setUserName(savedName);
    if (savedAge) setUserAge(savedAge);
    if (savedRoomId) setRoomId(savedRoomId);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRoomData(data);
        setStep(data.step);
        localStorage.setItem("alias_roomId", roomId);
      } else {
        localStorage.removeItem("alias_roomId");
        setRoomId(null);
        setStep(1);
      }
    });
    return () => unsub();
  }, [roomId]);

  const getCategoryByAge = (ageStr: string): CategoryType => {
    const age = parseInt(ageStr) || 30;
    if (age <= 6) return "KIDS";
    if (age <= 10) return "JUNIOR";
    if (age <= 16) return "TEEN";
    return "ADULT";
  };

  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused) return;
    const isIDescriber = roomData.players[roomData.currentTurnIdx]?.id === userId;
    if (!isIDescriber) return;

    const timer = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) {
          updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        } else {
          updateRoom({ step: 5, timeLeft: 60 });
        }
      } 
      else if (step === 5) {
        if (roomData.timeLeft > 0) {
          updateRoom({ timeLeft: roomData.timeLeft - 1 });
        } else {
          handleRoundEnd();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [step, roomId, roomData?.timeLeft, roomData?.preGameTimer, roomData?.isPaused, roomData?.currentTurnIdx, userId]);

  if (!mounted) return null;

  const updateRoom = async (newData: any) => {
    if (roomId) await updateDoc(doc(db, "rooms", roomId), newData);
  };

  const adjustScoreInPause = async (entity: string, amount: number) => {
    if (!roomData) return;
    const current = roomData.totalScores[entity] || 0;
    const newValue = Math.max(0, current + amount);
    await updateRoom({ [`totalScores.${entity}`]: newValue });
  };

  const handleGuess = async (isSkip: boolean) => {
    if (!roomData) return;
    const curP = roomData.players[roomData.currentTurnIdx];
    const change = isSkip ? -1 : 1;
    
    const updates: any = {
      roundScore: (roomData.roundScore || 0) + change,
      currentWordIdx: roomData.currentWordIdx + 1
    };

    if (!isSkip) {
      if (roomData.gameMode === "individual") {
        const describerName = curP.name;
        const guesserName = activeHover;
        if (guesserName && guesserName !== "SKIP") {
          updates[`totalScores.${describerName}`] = (roomData.totalScores[describerName] || 0) + 1;
          updates[`totalScores.${guesserName}`] = (roomData.totalScores[guesserName] || 0) + 1;
        }
      } else {
        const teamName = roomData.teamNames[curP.teamIdx];
        updates[`totalScores.${teamName}`] = (roomData.totalScores[teamName] || 0) + 1;
      }
    }

    await updateRoom(updates);

    const winnerTargets = roomData.gameMode === "individual" ? [curP.name, activeHover] : [roomData.teamNames[curP.teamIdx]];
    for (const name of winnerTargets) {
      if (name && name !== "SKIP" && (roomData.totalScores[name] || 0) + (isSkip ? 0 : 1) >= 50) {
        await updateRoom({ step: 7, winner: name });
        break;
      }
    }
  };

  const handleRoundEnd = async () => {
    if (!roomData) return;
    await updateRoom({ step: 6 });
  };

  const isIntersecting = (r1: DOMRect, r2: DOMRect) => {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
  };

  const isIDescriber = roomData?.players[roomData?.currentTurnIdx]?.id === userId;
  const currentP = roomData?.players[roomData?.currentTurnIdx];
  const currentPlayerCategory = currentP ? getCategoryByAge(currentP.age) : "ADULT";

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !isIDescriber || roomData?.isPaused) return;
    if (wordRef.current) {
      wordRef.current.style.left = `${e.clientX - 110}px`; 
      wordRef.current.style.top = `${e.clientY - 90}px`;
      const wordRect = wordRef.current.getBoundingClientRect();
      let h: string | null = null;
      if (skipRef.current && isIntersecting(wordRect, skipRef.current.getBoundingClientRect())) h = "SKIP";
      
      const tgts = roomData.gameMode === "individual" 
        ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) 
        : [roomData.teamNames[currentP.teamIdx]];
        
      tgts.forEach((t:string) => { 
        const el = targetsRef.current[t]; 
        if (el && isIntersecting(wordRect, el.getBoundingClientRect())) h = t;
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
          setUserName(n); setUserAge(a); 
          localStorage.setItem("alias_userName", n);
          localStorage.setItem("alias_userAge", a);
          setStep(2); 
        }} />}
        
        {step === 2 && <LobbyStep onCreateRoom={async () => {
          const codes = HEBREW_ROOM_CODES.filter(c => c !== "עומר");
          const id = codes[Math.floor(Math.random() * codes.length)]; 
          await setDoc(doc(db, "rooms", id), { 
            id, step: 3, gameMode: "individual", difficulty: "VARIABLE", numTeams: 2, 
            players: [{ id: userId, name: userName, age: userAge, teamIdx: 0 }], 
            teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"], 
            totalScores: {}, roundScore: 0, timeLeft: 60, isPaused: false, 
            currentTurnIdx: 0, currentWordIdx: 0, preGameTimer: 3, shuffledWords: [] 
          });
          setRoomId(id);
        }} onJoinRoom={async () => {
          const id = prompt("קוד חדר בעברית:"); if(!id) return;
          
          if (id === "עומר") {
            const qaPlayers = [
              { id: userId, name: userName || "עומר (QA)", age: userAge || "30", teamIdx: 0 },
              { id: "bot1", name: "שחקן 2", age: "25", teamIdx: 0 },
              { id: "bot2", name: "שחקן 3", age: "25", teamIdx: 1 },
              { id: "bot3", name: "שחקן 4", age: "25", teamIdx: 1 },
              { id: "bot4", name: "שחקן 5", age: "25", teamIdx: 2 },
              { id: "bot5", name: "שחקן 6", age: "25", teamIdx: 2 },
              { id: "bot6", name: "שחקן 7", age: "25", teamIdx: 3 },
              { id: "bot7", name: "שחקן 8", age: "25", teamIdx: 3 },
            ];
            await setDoc(doc(db, "rooms", "עומר"), {
              id: "עומר", step: 3, gameMode: "team", difficulty: "VARIABLE", numTeams: 4,
              players: qaPlayers, teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"],
              totalScores: {}, roundScore: 0, timeLeft: 60, isPaused: false,
              currentTurnIdx: 0, currentWordIdx: 0, preGameTimer: 3, shuffledWords: []
            });
            setRoomId("עומר");
            return;
          }
          const snap = await getDoc(doc(db, "rooms", id));
          if(snap.exists()){ 
            await updateDoc(doc(db, "rooms", id), { players: arrayUnion({ id: userId, name: userName, age: userAge, teamIdx: 0 }) }); 
            setRoomId(id); 
          }
        }} />}

        {step === 3 && roomData && (
          <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column'}}>
            <div style={{display:'flex', justifyContent:'center', gap:'5px', marginBottom:'10px', padding:'0 5px'}}>
               {(["VARIABLE", "EASY", "MEDIUM", "HARD"] as DifficultyLevel[]).map(lvl => (
                 <button 
                  key={lvl}
                  onClick={() => updateRoom({ difficulty: lvl })}
                  style={{
                    flex: 1, padding: '5px', borderRadius: '5px', fontSize: '12px', border: 'none',
                    backgroundColor: roomData.difficulty === lvl ? '#ffd700' : '#333',
                    color: roomData.difficulty === lvl ? '#000' : '#fff'
                  }}
                 >
                   {lvl === "VARIABLE" ? "משתנה" : lvl === "EASY" ? "קלה" : lvl === "MEDIUM" ? "בינונית" : "קשה"}
                 </button>
               ))}
            </div>
            <SetupStep 
              roomId={roomId || ""} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} 
              numTeams={roomData.numTeams} setNumTeams={(n) => updateRoom({ numTeams: n })} 
              teamNames={roomData.teamNames} editTeamName={(idx) => { const n = prompt("שם חדש:", roomData.teamNames[idx]); if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } }} 
              players={roomData.players} 
              onPlayerMove={async (pId: string, teamIdx: number) => {
                const updated = roomData.players.map((p:any) => p.id === pId ? {...p, teamIdx} : p);
                await updateRoom({ players: updated });
              }}
              activeHover={activeHover} teamsRef={teamsRef} 
              onStart={() => {
                const words = getShuffledWords(currentPlayerCategory, roomData.difficulty);
                updateRoom({ step: 4, timeLeft: 60, roundScore: 0, preGameTimer: 3, currentWordIdx: 0, shuffledWords: words });
              }} 
            />
          </div>
        )}
        
        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP.name, team: roomData.teamNames[currentP.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
        
        {step === 5 && roomData && (
          <>
            {isIDescriber ? (
              <GameStep 
                timeLeft={roomData.timeLeft} 
                currentWord={roomData.shuffledWords[roomData.currentWordIdx % roomData.shuffledWords.length]} 
                wordRef={wordRef} skipRef={skipRef} 
                onPointerDown={(e) => { isDragging.current = true; setIsDraggingWord(true); if(wordRef.current) { wordRef.current.style.position = 'fixed'; wordRef.current.style.left = `${e.clientX-110}px`; wordRef.current.style.top = `${e.clientY-90}px`; } }} 
                isTextOnly={roomData.difficulty !== "VARIABLE" ? (roomData.difficulty !== "EASY") : (currentPlayerCategory === "TEEN" || currentPlayerCategory === "ADULT")} 
                isDraggingWord={isDraggingWord} 
                targets={roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]]} 
                targetsRef={targetsRef} onGuess={(s) => handleGuess(!!s)} score={roomData.roundScore} onPause={() => updateRoom({ isPaused: true })} isPaused={false} onUnpause={() => {}} activeHover={activeHover} 
              />
            ) : (
              <GuesserView timeLeft={roomData.timeLeft} describerName={currentP.name} describerTeam={roomData.teamNames[currentP.teamIdx]} isTeamMode={roomData.gameMode === "team"} totalScores={roomData.totalScores} roundScore={roomData.roundScore} entities={roomData.gameMode === "individual" ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} onPause={() => updateRoom({ isPaused: true })} />
            )}
            {roomData.isPaused && (
              <div style={styles.pauseOverlay}>
                <h2 style={{color: '#ffd700', marginBottom: '20px', textAlign:'center'}}>תיקון ניקוד</h2>
                <div style={{width:'95%', maxWidth:'400px', background:'rgba(255,255,255,0.05)', borderRadius:'15px', padding:'10px'}}>
                  {(roomData.gameMode === "individual" ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)).map((entity: string) => (
                    <div key={entity} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                      <span style={{fontSize:'16px', fontWeight:'bold'}}>{entity}</span>
                      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <button style={styles.adjBtn} onClick={() => adjustScoreInPause(entity, -1)}>-</button>
                        <span style={{fontSize:'18px', minWidth:'25px', textAlign:'center', color:'#ffd700'}}>{roomData.totalScores[entity] || 0}</span>
                        <button style={styles.adjBtn} onClick={() => adjustScoreInPause(entity, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => updateRoom({ isPaused: false })} style={{...styles.hugePlayBtn, marginTop:'30px'}}>▶️ המשך</button>
              </div>
            )}
          </>
        )}

        {step === 6 && roomData && <ScoreStep scores={roomData.totalScores} entities={roomData.gameMode === "individual" ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} onNextRound={() => {
           const nextWords = getShuffledWords(currentPlayerCategory, roomData.difficulty);
           updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, timeLeft: 60, roundScore: 0, preGameTimer: 3, currentWordIdx: 0, shuffledWords: nextWords });
        }} />}
        
        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={() => {
           localStorage.removeItem("alias_roomId");
           updateRoom({ step: 1, players: [] });
           setRoomId(null);
           setStep(1);
        }} />}
      </div>
    </div>
  );
}