// app/components/EntryStep.tsx
"use client";

import React, { useState, CSSProperties } from "react";

// --- חומת המגן: כל העיצוב של המסך הראשון נעול כאן בלבד ---
const localStyles: { [key: string]: CSSProperties } = {
  flexLayout: { 
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', 
    width: '100%', height: '100%', justifyContent: 'space-between', 
    direction: 'rtl', boxSizing: 'border-box' 
  },
  entryLogo: { 
    width: '90%', height: 'auto', maxHeight: '30vh', objectFit: 'contain', 
    marginTop: '10px' 
  },
  entryTitle: { 
    color: '#ffd700', fontSize: '1.4rem', fontWeight: '900', 
    textAlign: 'center', lineHeight: '1.2' 
  },
  entryInput: { 
    width: '100%', minHeight: '52px', padding: '12px', borderRadius: '16px', 
    backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', 
    border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', 
    textAlign: 'center', boxSizing: 'border-box' 
  },
  lobbyButton: { 
    width: '100%', minHeight: '60px', borderRadius: '18px', 
    backgroundColor: '#ffd700', color: '#05081c', fontWeight: '900', 
    border: 'none', fontSize: '1.3rem', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
  },
  lobbyJoinFrame: { 
    width: '100%', padding: '10px 0', display: 'flex', 
    flexDirection: 'column', alignItems: 'center', 
    justifyContent: 'center', cursor: 'pointer' 
  },
  modalOverlay: { 
    position: 'fixed', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    zIndex: 3000, padding: '20px' 
  },
  modalContent: { 
    width: '100%', maxWidth: '350px', backgroundColor: '#0f172a', 
    borderRadius: '24px', padding: '25px', border: '1px solid #ffd700', 
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' 
  }
};

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
    <div style={localStyles.flexLayout}>
      {/* חלק עליון */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <img src="/logo.webp" alt="Logo" style={localStyles.entryLogo} />
        <h1 style={localStyles.entryTitle}>נראה אתכם תופסים את המילה הנרדפת</h1>
      </div>

      <div style={{ flex: 0.5 }} />

      {/* חלק אמצעי */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" value={name} onChange={(e) => setName(e.target.value)} 
          placeholder="שם" style={localStyles.entryInput} 
        />
        <input 
          type="number" value={age} onChange={(e) => setAge(e.target.value)} 
          placeholder="גיל" style={localStyles.entryInput} 
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* חלק תחתון */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '10px' }}>
        <button onClick={() => validate('create')} style={localStyles.lobbyButton}>
          צור חדר חדש +
        </button>
        
        <div style={localStyles.lobbyJoinFrame} onClick={() => validate('join')}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#ffd700', fontSize: '1.4rem', fontWeight: '900', display: 'block' }}>הצטרפות לחדר</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>לחצו כאן להזנת קוד חדר</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={localStyles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={localStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>קוד החדר:</h2>
            <input 
              type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} 
              placeholder="למשל: עומר" style={localStyles.entryInput} autoFocus 
            />
            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
              <button onClick={() => onNext(name, age, 'join', inputCode)} style={localStyles.lobbyButton}>כנס</button>
              <button onClick={() => setIsModalOpen(false)} style={{ ...localStyles.lobbyButton, background: 'rgba(255,255,255,0.1)', color: 'white' }}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}