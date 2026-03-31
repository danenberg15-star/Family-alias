// app/components/EntryStep.tsx
"use client";

import React, { useState } from "react";
import { styles } from "../game.styles";

interface EntryStepProps {
  onNext: (name: string, age: string, action: 'create' | 'join', code?: string) => void;
}

export default function EntryStep({ onNext }: EntryStepProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const validate = (action: 'create' | 'join') => {
    if (name.trim() && age.trim()) {
      if (action === 'join') setIsModalOpen(true);
      else onNext(name, age, 'create');
    } else {
      alert("אנא מלא שם וגיל כדי להמשיך! 🙂");
    }
  };

  return (
    <div style={styles.flexLayout}>
      {/* קבוצה עליונה: לוגו וכותרת */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', paddingTop: '10px' }}>
        <img src="/logo.webp" alt="Logo" style={styles.entryLogo} />
        <h1 style={styles.entryTitle}>נראה אתכם תופסים את המילה הנרדפת</h1>
      </div>

      <div style={{ flex: 0.5 }} /> {/* רווח גמיש 1 */}

      {/* קבוצה אמצעית: שדות קלט */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" value={name} onChange={(e) => setName(e.target.value)} 
          placeholder="שם" style={styles.entryInput} 
        />
        <input 
          type="number" value={age} onChange={(e) => setAge(e.target.value)} 
          placeholder="גיל" style={styles.entryInput} 
        />
      </div>

      <div style={{ flex: 1 }} /> {/* רווח גמיש 2 - גדול יותר כדי לדחוף למטה */}

      {/* קבוצה תחתונה: כפתורי פעולה */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '10px' }}>
        <button onClick={() => validate('create')} style={styles.lobbyButton}>
          צור חדר חדש +
        </button>
        
        <div style={styles.lobbyJoinFrame} onClick={() => validate('join')}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#ffd700', fontSize: '1.4rem', fontWeight: '900', display: 'block' }}>הצטרפות לחדר</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>לחצו כאן להזנת קוד חדר</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>קוד החדר:</h2>
            <input 
              type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} 
              placeholder="למשל: עומר" style={styles.entryInput} autoFocus 
            />
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button onClick={() => onNext(name, age, 'join', inputCode)} style={styles.lobbyButton}>כנס</button>
              <button onClick={() => setIsModalOpen(false)} style={{ ...styles.lobbyButton, background: 'rgba(255,255,255,0.1)', color: 'white' }}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}