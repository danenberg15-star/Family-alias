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
import { WORD_DATABASE, CategoryType } from "./game.config";
import { generateRoomCode, getShuffledWords } from "./lib/game-utils";

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [userId] = useState(() => "u_" + Math.random().toString(36).substring(2, 9));
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

  useEffect(() => { setMounted(true); }, []);

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

  const getCategoryByAge = (ageStr: string): CategoryType => {
    const age = parseInt(ageStr);
    if (age <= 6) return "KIDS";
    if (age <= 10) return "JUNIOR";
    if (age <= 16) return "TEEN";
    return "ADULT";
  };

  // משתני עזר לשימוש בתוך ה-UI וה-Effects
  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;
  const currentPlayerCategory = currentP ? getCategoryByAge(currentP.age) : "ADULT";

  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused) return;
    if (!isIDescriber) return;

    const timer = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) {
          updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        } else {
          updateRoom({ step: 5, timeLeft: 60, shuffledWords: getShuffledWords(currentPlayerCategory) });
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
  }, [step, roomId, roomData?.timeLeft, roomData?.preGameTimer, roomData?.isPaused, isIDescriber]);

  const updateRoom = async (newData: any) => {
    if (roomId) await updateDoc(doc(db, "rooms", roomId), newData);
  };

  const handleGuess = async (isSkip: boolean) => {
    if (!roomData) return;
    const curP = roomData.players[roomData.currentTurnIdx];
    const target = roomData.gameMode === "individual" ? (activeHover || "") : roomData.teamNames[curP.teamIdx];
    const change = isSkip ? -1 : 1;
    const newRoundScore = roomData.roundScore + change;
    const currentTotal = (roomData.totalScores[target] || 0) + (isSkip ? 0 : 1);

    if (!isSkip && currentTotal >= 50) {
      await updateRoom({ step: 7, winner: target, [`totalScores.${target}`]: currentTotal });
    } else {
      await updateRoom({ roundScore: newRoundScore, currentWordIdx: roomData.currentWordIdx + 1 });
    }
  };

  const handleRoundEnd = async () => {
    if (!roomData) return;
    const curP = roomData.players[roomData.currentTurnIdx];
    const target = roomData.gameMode === "individual" ? curP.name : roomData.teamNames[curP.teamIdx];
    const finalTotal = (roomData.totalScores[target] || 0) + roomData.roundScore;
    await updateRoom({ step: 6, [`totalScores.${target}`]: finalTotal });
  };

  const isIntersecting = (r1: DOMRect, r2: DOMRect) => {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !isIDescriber || roomData?.isPaused) return;
    if (wordRef.current) {
      wordRef.current.style.left = `${e.clientX - 140}px`; 
      wordRef.current.style.top = `${e.clientY - 120}px`;
      const wordRect = wordRef.current.getBoundingClientRect();
      let h: string | null = null;
      if (skipRef.current && isIntersecting(wordRect, skipRef.current.getBoundingClientRect())) h = "SKIP";
      const tgts = roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]];
      tgts.forEach((t:string) => { 
        const el = targetsRef.current[t]; 
        if (el && isIntersecting(wordRect, el.getBoundingClientRect())) h = t;
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
        {step === 1 && <EntryStep onNext={(n, a) => { setUserName(n); setUserAge(a); setStep(2); }} />}
        
        {step === 2 && <LobbyStep onCreateRoom={async () => {
          const id = generateRoomCode();
          await setDoc(doc(db, "rooms", id), { id, step: 3, gameMode: "individual", numTeams: 2, players: [{ id: userId, name: userName, age: userAge, teamIdx: 0 }], teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"], totalScores: {}, roundScore: 0, timeLeft: 60, isPaused: false, currentTurnIdx: 0, currentWordIdx: 0, preGameTimer: 3 });
          setRoomId(id);
        }} onJoinRoom={async () => {
          const id = prompt("קוד חדר:"); if(!id) return;
          const snap = await getDoc(doc(db, "rooms", id.toUpperCase()));
          if(snap.exists()){ await updateDoc(doc(db, "rooms", id.toUpperCase()), { players: arrayUnion({ id: userId, name: userName, age: userAge, teamIdx: 0 }) }); setRoomId(id.toUpperCase()); }
        }} />}

        {step === 3 && roomData && <SetupStep roomId={roomId || ""} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} numTeams={roomData.numTeams} setNumTeams={(n) => updateRoom({ numTeams: n })} teamNames={roomData.teamNames} editTeamName={(idx) => { const n = prompt("שם חדש:", roomData.teamNames[idx]); if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } }} players={roomData.players.map((p:any)=>p.name)} playerTeamMap={roomData.players.reduce((acc:any, p:any)=>({...acc, [p.name]: p.teamIdx}), {})} onPlayerPointerDown={()=>{}} activeHover={activeHover} teamsRef={teamsRef as any} onStart={() => updateRoom({ step: 4, timeLeft: 60, roundScore: 0, preGameTimer: 3 })} />}
        
        {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP.name, team: roomData.teamNames[currentP.teamIdx]}} isTeamMode={roomData.gameMode === "team"} />}
        
        {step === 5 && roomData && (
          isIDescriber ? (
            <GameStep 
              timeLeft={roomData.timeLeft} 
              currentWord={roomData.shuffledWords?.[roomData.currentWordIdx % roomData.shuffledWords.length] || {word: "טוען...", en: ""}} 
              wordRef={wordRef} skipRef={skipRef} 
              onPointerDown={(e) => { isDragging.current = true; setIsDraggingWord(true); if(wordRef.current) { wordRef.current.style.position = 'fixed'; wordRef.current.style.left = `${e.clientX-140}px`; wordRef.current.style.top = `${e.clientY-120}px`; } }} 
              isTextOnly={currentPlayerCategory === "TEEN" || currentPlayerCategory === "ADULT"} 
              isDraggingWord={isDraggingWord} 
              targets={roomData.gameMode === "individual" ? roomData.players.filter((p:any) => p.id !== userId).map((p:any)=>p.name) : [roomData.teamNames[currentP.teamIdx]]} 
              targetsRef={targetsRef as any} score={roomData.roundScore} onPause={() => updateRoom({ isPaused: true })} activeHover={activeHover} 
            />
          ) : (
            <GuesserView timeLeft={roomData.timeLeft} describerName={currentP?.name} describerTeam={roomData.teamNames[currentP?.teamIdx]} isTeamMode={roomData.gameMode === 'team'} totalScores={roomData.totalScores} roundScore={roomData.roundScore} entities={roomData.gameMode === 'individual' ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} onPause={() => updateRoom({ isPaused: true })} />
          )
        )}

        {step === 6 && roomData && <ScoreStep scores={roomData.totalScores} entities={roomData.gameMode === "individual" ? roomData.players.map((p:any)=>p.name) : roomData.teamNames.slice(0, roomData.numTeams)} onNextRound={() => updateRoom({ step: 4, currentTurnIdx: (roomData.currentTurnIdx + 1) % roomData.players.length, timeLeft: 60, roundScore: 0, preGameTimer: 3 })} />}
        {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={() => updateRoom({ step: 1, players: [] })} />}
      </div>
      
      {/* כפתור ה-Reset לניקוי ה-Step התקוע */}
      <button 
        onClick={() => { localStorage.clear(); window.location.reload(); }} 
        style={{ position: 'fixed', bottom: '5px', left: '5px', opacity: 0.1, fontSize: '10px', color: 'white', border: 'none', background: 'none' }}
      >
        Reset
      </button>
    </div>
  );
}