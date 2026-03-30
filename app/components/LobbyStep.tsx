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

  return (
    <div style={styles.flexLayout}>
      <h1 style={styles.lobbyTitle}>בחרו איך להתחיל</h1>

      <div style={styles.lobbyCenterArea}>
        <div style={{ textAlign: 'right', width: '100%', paddingRight: '15%' }}>
          <button onClick={onCreateRoom} style={styles.lobbyButtonWhite}>
            צור חדר חדש +
          </button>
        </div>

        <div style={styles.lobbyJoinText} onClick={() => setIsModalOpen(true)}>
          <span style={{ color: '#ffd700' }}>הצטרפות לחדר</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'normal' }}> לחצו כאן להזנת קוד חדר</span>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={{ width: '100%', maxWidth: '350px', backgroundColor: '#0f172a', borderRadius: '24px', padding: '30px', border: '1px solid #ffd700', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: 'white', textAlign: 'center' }}>מה קוד החדר?</h2>
            <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="הזן קוד..." style={styles.entryInput} autoFocus />
            <button onClick={() => { onJoinRoom(inputCode); setIsModalOpen(false); }} style={styles.entryButton}>כנס לחדר</button>
          </div>
        </div>
      )}
    </div>
  );
}