// app/components/LobbyStep.tsx
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
      <h1 style={{ ...styles.entryTitle, marginTop: '40px' }}>בחרו איך להתחיל</h1>

      <div style={styles.lobbyCenterArea}>
        <button onClick={onCreateRoom} style={styles.lobbyButton}>
          צור חדר חדש +
        </button>

        <div style={styles.lobbyJoinFrame} onClick={() => setIsModalOpen(true)}>
          <span style={{ color: '#ffd700', fontSize: '1.3rem', fontWeight: '900', marginBottom: '8px' }}>הצטרפות לחדר</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>לחצו כאן להזנת קוד חדר</span>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: 'white', fontSize: '1.3rem', textAlign: 'center', fontWeight: 'bold' }}>מה קוד החדר שאתה רוצה להיכנס אליו?</h2>
            <input 
              type="text" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value)} 
              placeholder="למשל: עומר" 
              style={styles.entryInput}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button onClick={handleManualJoin} style={styles.lobbyButton}>כנס לחדר</button>
              <button onClick={() => setIsModalOpen(false)} style={{ ...styles.lobbyButton, background: 'rgba(255,255,255,0.1)', color: 'white' }}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}