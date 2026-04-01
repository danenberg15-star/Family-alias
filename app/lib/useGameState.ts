import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { generateRoomCode } from "./game-utils";

export function useGameState() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");

  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("alias_userId") || "u_" + Math.random().toString(36).substring(2, 9);
    setUserId(id); localStorage.setItem("alias_userId", id);
    const n = localStorage.getItem("alias_userName");
    const a = localStorage.getItem("alias_userAge");
    if (n && a) { 
      setUserName(n); 
      setUserAge(a); 
      const r = localStorage.getItem("alias_roomId"); 
      if (r) setRoomId(r); else setStep(2); 
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    return onSnapshot(doc(db, "rooms", roomId), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setRoomData(d);
        if (d.step !== step) setStep(d.step);
      }
    });
  }, [roomId, step]);

  const updateRoom = async (newData: any) => { if (roomId) await updateDoc(doc(db, "rooms", roomId), newData); };
  const handleFullReset = () => { localStorage.clear(); window.location.href = '/'; };

  const handleCreateRoom = async (nameOverride?: string, ageOverride?: string) => {
    const finalName = nameOverride || userName;
    const finalAge = ageOverride || userAge;
    const id = generateRoomCode();
    
    setRoomId(id);
    setStep(3);
    localStorage.setItem("alias_roomId", id);
    localStorage.setItem("alias_userName", finalName);
    localStorage.setItem("alias_userAge", finalAge);

    await setDoc(doc(db, "rooms", id), {
      id, step: 3, createdAt: Date.now(), gameMode: "individual", difficulty: "age-appropriate", numTeams: 2,
      players: [{ id: userId, name: finalName, age: finalAge, teamIdx: 0 }],
      teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"],
      totalScores: {}, roundScore: 0, timeLeft: 60, isPaused: false, currentTurnIdx: 0, 
      poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 }, preGameTimer: 3, shuffledPools: {}
    });
  };

  const handleJoinRoom = async (idInput: string, nameOverride?: string, ageOverride?: string) => {
    const finalName = nameOverride || userName;
    const finalAge = ageOverride || userAge;
    const id = idInput.toUpperCase();

    if (id === "עומר") {
      const qp = [
        { id: userId, name: finalName || "עומר", age: finalAge || "30", teamIdx: 0 }, 
        ...Array(5).fill(0).map((_, i) => ({ id: `d_${i}`, name: `שחקן ${i+2}`, age: "25", teamIdx: 1 }))
      ];
      await setDoc(doc(db, "rooms", "עומר"), { 
        id: "עומר", step: 3, createdAt: Date.now(), gameMode: "team", numTeams: 2, 
        players: qp, teamNames: ["קבוצה א'", "קבוצה ב'"], totalScores: {}, roundScore: 0, 
        timeLeft: 60, isPaused: false, currentTurnIdx: 0, 
        poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 }, preGameTimer: 3, shuffledPools: {} 
      });
      setRoomId("עומר"); setStep(3); localStorage.setItem("alias_roomId", "עומר");
      return;
    }

    const snap = await getDoc(doc(db, "rooms", id));
    if (snap.exists()) { 
      setRoomId(id); 
      setStep(snap.data().step); 
      localStorage.setItem("alias_roomId", id); 
      if (snap.data().step === 3) {
        // התיקון: שימוש ישיר ב-updateDoc עם ה-id כדי לעקוף את בעיית הסטייט
        await updateDoc(doc(db, "rooms", id), { 
          players: arrayUnion({ id: userId, name: finalName, age: finalAge, teamIdx: 0 }) 
        }); 
      } 
    }
  };

  return { mounted, userId, roomId, roomData, step, setStep, userName, setUserName, userAge, setUserAge, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom };
}