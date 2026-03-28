"use client";

import Logo from "./Logo";
import { styles } from "../game.styles";

interface VictoryStepProps {
  winnerName: string;
  onRestart: () => void;
}

export default function VictoryStep({ winnerName, onRestart }: VictoryStepProps) {
  return (
    <div style={{...styles.flexLayout, backgroundColor: '#05081c'}}>
      <div className="confetti-container">
        {/* קונפטי פשוט מבוסס CSS */}
        <style>{`
          .confetti-container { position: absolute; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .confetti { position: absolute; width: 10px; height: 10px; background: #ffd700; animation: fall 3s linear infinite; }
          @keyframes fall { 0% { transform: translateY(-10vh) rotate(0deg); } 100% { transform: translateY(110vh) rotate(360deg); } }
        `}</style>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, backgroundColor: i % 2 === 0 ? '#ffd700' : '#ffffff' }} />
        ))}
      </div>
      
      <Logo />
      <div style={{ fontSize: '80px', marginBottom: '10px' }}>🏆</div>
      <h1 style={{ color: 'white', textAlign: 'center', fontSize: '28px', padding: '0 20px' }}>
        כל הכבוד ל-<span style={{ color: '#ffd700' }}>{winnerName}</span> על הניצחון המוחץ!
      </h1>
      
      <button 
        onClick={onRestart} 
        style={{ ...styles.goldButton, marginTop: '40px', width: '200px' }}
      >
        משחק חדש 🔄
      </button>
    </div>
  );
}