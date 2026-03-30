// app/components/EntryStep.tsx
"use client";

import React, { useState } from "react";
import { styles } from "../game.styles";

interface EntryStepProps {
  onNext: (name: string, age: string) => void;
}

export default function EntryStep({ onNext }: EntryStepProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleStart = () => {
    if (name.trim() && age.trim()) {
      onNext(name, age);
    } else {
      alert("אנא מלא שם וגיל! 🙂");
    }
  };

  return (
    <div style={styles.flexLayout}>
      <img src="/logo.webp" alt="Logo" style={styles.entryLogo} />
      <h1 style={styles.entryTitle}>נראה אתכם תופסים את המילה הנרדפת</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: 'auto' }}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="שם" 
          style={styles.entryInput} 
        />
        <input 
          type="number" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          placeholder="גיל" 
          style={styles.entryInput} 
        />
        <button onClick={handleStart} style={styles.entryButton}>בואו נתחיל</button>
      </div>
    </div>
  );
}