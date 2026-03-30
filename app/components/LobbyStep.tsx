"use client";

import React, { useState } from "react";
import { styles } from "../game.styles";

interface LobbyStepProps {
  onCreateRoom: () => void;
  onJoinRoom: (id: string) => void;
}

export default function LobbyStep({ onCreateRoom, onJoinRoom }: LobbyStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const handleManualJoin = () => {
    if (inputCode.trim()) {
      onJoinRoom(inputCode.toUpperCase());
      setIsModalOpen(false);
    }
  };

  return (
    <div style={styles.flexLayout}>
      <h1 style={{ ...styles.title, marginTop: '40px' }}>בחרו איך להתחיל</h1>

      <div style={styles.lobbyCenterArea}>
        {/* כפתור יצירה */}
        <button onClick={onCreateRoom} style={styles.goldButton}>
          צור חדר חדש +
        </button>

        {/* מסגרת הצטרפות ממורכזת */}
        <div style={styles.joinFrameBtn} onClick={() => setIsModalOpen(true)}>
          <span style={{ color: '#ffd700', fontSize: '1.3rem', fontWeight: '900', marginBottom: '8px' }}>הצטרפות לחדר</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>לחצו כאן להזנת קוד חדר</span>
        </div>
      </div>

      {/* מיני תפריט (Modal) */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: 'white', fontSize: '1.3rem', textAlign: 'center', fontWeight: 'bold' }}>מה קוד החדר שאתה רוצה להיכנס אליו?</h2>
            <input 
              type="text" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value)} 
              placeholder="למשל: עומר" 
              style={styles.inputField}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button onClick={handleManualJoin} style={styles.goldButton}>כנס לחדר</button>
              <button onClick={() => setIsModalOpen(false)} style={{ ...styles.goldButton, background: 'rgba(255,255,255,0.1)', color: 'white' }}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}