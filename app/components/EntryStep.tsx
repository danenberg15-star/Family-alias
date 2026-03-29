"use client";

import { useState } from "react";
import Logo from "./Logo";
import { styles } from "../game.styles";

interface EntryStepProps {
  onNext: (name: string, age: string) => void;
}

export default function EntryStep({ onNext }: EntryStepProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age) {
      onNext(name, age);
    }
  };

  return (
    <div style={styles.flexLayout}>
      <Logo />
      <div style={styles.formCard}>
        <h2 style={{...styles.title, fontSize: '20px', marginBottom: '20px'}}>ברוכים הבאים!</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={styles.input} 
            placeholder="שם השחקן..." 
          />
          <input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            required 
            style={styles.input} 
            placeholder="בן כמה אתה?" 
          />
          <button type="submit" style={styles.goldButton}>קדימה 🚀</button>
        </form>
      </div>
    </div>
  );
}