"use client";

import Logo from "./Logo";
import { styles } from "../game.styles";

interface LobbyStepProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export default function LobbyStep({ onCreateRoom, onJoinRoom }: LobbyStepProps) {
  return (
    <div style={styles.flexLayout}>
      <Logo />
      <button 
        onClick={onCreateRoom} 
        style={{...styles.goldButton, backgroundColor:'#4f46e5', color:'white'}}
      >
        ➕ צור חדר חדש
      </button>
      <div style={{marginTop: '30px', width: '100%', textAlign: 'right'}}>
        <h3 style={{color: 'white', marginBottom: '10px'}}>חדרים פעילים:</h3>
        <div style={styles.guesserButton}>
          <span>🏠 חלון</span>
          <button 
            onClick={onJoinRoom} 
            style={{backgroundColor:'#10b981', color:'white', border:'none', padding:'5px 15px', borderRadius:'8px', cursor: 'pointer'}}
          >
            הצטרף
          </button>
        </div>
      </div>
    </div>
  );
}