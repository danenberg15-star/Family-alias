// app/lib/useGameState.ts
import { useState, useEffect } from "react";
import { db } from "./firebase"; // תיקון נתיב
import { 
  doc, setDoc, onSnapshot, updateDoc, arrayUnion, getDoc 
} from "firebase/firestore";
import { CategoryType } from "../game.config"; // תיקון נתיב
import { generateRoomCode, getShuffledWords } from "./game-utils"; // תיקון נתיב

export function useGameState() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");

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

  const handleJoinRoom = async (idInput: string) => {
    const id = idInput.toUpperCase();
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

    const snap = await getDoc(doc(db, "rooms", id));
    if (snap.exists()) {
      const data = snap.data();
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

  return {
    mounted, userId, roomId, roomData, step, setStep,
    userName, setUserName, userAge, setUserAge,
    updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom
  };
}