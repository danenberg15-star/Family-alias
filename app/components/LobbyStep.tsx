"use client";

import React, { useState } from "react";
import { styles } from "../game.styles";

interface LobbyStepProps {
  onCreateRoom: () => void;
  onJoinRoom: (id: string) => void;
  recentRooms: any[];
}

export default function LobbyStep({ onCreateRoom, onJoinRoom, recentRooms }: LobbyStepProps) {
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
      <h1 style={{ ...styles.title, marginTop: '20px' }}>לובי המשחק</h1>

      {/* כפתור יצירה מהיר */}
      <button onClick={onCreateRoom} style={{ ...styles.goldButton, marginBottom: '20px' }}>
        צור חדר חדש +
      </button>

      {/* מסגרת שהיא כפתור להצטרפות ידנית */}
      <div style={styles.joinFrameBtn} onClick={() => setIsModalOpen(true)}>
        <span style={{ color: '#ffd700', fontSize: '1.1rem', fontWeight: 'bold' }}>הצטרפות לחדר לפי קוד</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>לחץ כאן להזנה ידנית</span>
      </div>

      <div style={{ width: '100%', textAlign: 'right', marginBottom: '10px' }}>
        <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>חדרים פעילים (3 דק' אחרונות):</span>
      </div>

      {/* רשימת חדרים נגללת */}
      <div style={styles.scrollContainer}>
        {recentRooms.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '20px' }}>אין חדרים זמינים כרגע</div>
        ) : (
          recentRooms.map((room) => (
            <div key={room.id} style={styles.roomCard} onClick={() => onJoinRoom(room.id)}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{room.id}</span>
              <span style={{ color: '#ffd700', fontSize: '0.9rem' }}>{room.players?.length || 0} שחקנים 👤</span>
            </div>
          ))
        )}
      </div>

      {/* מיני תפריט להזנת קוד */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: 'white', fontSize: '1.2rem', textAlign: 'center' }}>מה קוד החדר שאתה רוצה להיכנס אליו?</h2>
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