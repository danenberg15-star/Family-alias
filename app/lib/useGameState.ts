"use client";

import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { generateRoomCode } from "./game-utils";

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
    
    // בדיקה אם המשתמש הגיע דרך לינק שיתוף (?room=CODE)
    const urlParams = new URLSearchParams(window.location.search);
    const sharedRoom = urlParams.get('room');

    if (savedName && savedAge) {
      setUserName(savedName);
      setUserAge(savedAge);
      if (sharedRoom) {
        handleJoinRoom(sharedRoom);
      } else {
        const sRoomId = localStorage.getItem("alias_roomId");
        if (sRoomId) setRoomId(sRoomId);
        else setStep(2);
      }
    } else if (sharedRoom) {
      // אם אין פרטי משתמש אבל יש לינק, נשמור את החדר ונבקש פרטים
      localStorage.setItem("pending_room", sharedRoom);
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRoomData(data);
        if (data.step !== step) setStep(data.step);
      }
    });
    return () => unsub();
  }, [roomId, step]);

  const updateRoom = async (newData: any) => {
    if (roomId) await updateDoc(doc(db, "rooms", roomId), newData);
  };

  const handleFullReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleCreateRoom = async () => {
    const id = generateRoomCode();
    setRoomId(id);
    setStep(3);
    localStorage.setItem("alias_roomId", id);

    await setDoc(doc(db, "rooms", id), {
      id,
      step: 3,
      createdAt: Date.now(),
      gameMode: "individual",
      difficulty: "age-appropriate", // ברירת מחדל
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
  };

  const handleJoinRoom = async (idInput: string) => {
    const id = idInput.toUpperCase();
    setRoomId(id);
    localStorage.setItem("alias_roomId", id);

    const snap = await getDoc(doc(db, "rooms", id));
    if (snap.exists()) {
      const data = snap.data();
      setStep(data.step);
      if (data.step === 3) {
        await updateDoc(doc(db, "rooms", id), {
          players: arrayUnion({ id: userId, name: userName, age: userAge, teamIdx: 0 })
        });
      }
    }
  };

  return {
    mounted, userId, roomId, roomData, step, setStep,
    userName, setUserName, userAge, setUserAge,
    updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom
  };
}