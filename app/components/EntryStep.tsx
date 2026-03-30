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
      {/* אזור הכותרת והשדות - ממורכז */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%', marginTop: 'auto', marginBottom: 'auto' }}>
        <h1 style={styles.title}>משפחת אליאס... משפחת אליאס הכי טובה בעולם</h1>
        
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
      </div>

      {/* כפתור למטה */}
      <button 
        onClick={handleStart} 
        style={styles.goldButton}
      >
        בואו נתחיל
      </button>
    </div>
  );
}