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
      {/* 1. הלוגו הועלה למעלה */}
      <img 
        src="/logo.webp" 
        alt="Alias Logo" 
        style={styles.logo} 
        onError={(e) => (e.currentTarget.style.display = 'none')} 
      />

      {/* 2. עדכון הטקסט */}
      <h1 style={styles.title}>נראה אתכם תופסים את המילה הנרדפת</h1>
      
      {/* אזור השדות והכפתור צמודים יחד */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: 'auto' }}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="שם" 
          style={styles.inputField} 
        />
        
        <input 
          type="number" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          placeholder="גיל" 
          style={styles.inputField} 
          min="1"
          max="120"
        />

        {/* 3. הכפתור הועלה למעלה וצמוד לשדה הגיל */}
        <button 
          onClick={handleStart} 
          style={styles.goldButton}
        >
          בואו נתחיל
        </button>
      </div>
    </div>
  );
}