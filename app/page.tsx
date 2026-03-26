"use client";

import { useState, useEffect, CSSProperties } from "react";
import Logo from "./components/Logo";

export default function FamilyAliasApp() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [step, setStep] = useState(1); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={containerStyle}>
      <div style={contentWrapper}>
        
        {step === 1 && (
          <>
            {/* לוגו קטן בראש המסך */}
            <div style={miniLogoArea}>
              <Logo />
            </div>

            {/* כרטיס טופס במרכז */}
            <div style={formCardStyle}>
              <form style={formStyle} onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="שם..."
                />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="גיל..."
                />
                <button type="submit" style={goldButtonStyle}>
                  המשך
                </button>
              </form>
            </div>
          </>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', margin: '0 auto 20px' }}><Logo /></div>
            <div style={formCardStyle}>
              <h2 style={{ color: 'white' }}>שלום {name}!</h2>
              <button style={goldButtonStyle} onClick={() => setStep(1)}>חזרה</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// === Styles - Ultra Compact Version ===

const containerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start', // מתחיל מלמעלה כדי שלא ייחתך
  height: '100dvh', // גובה דינמי
  width: '100vw',
  backgroundColor: '#05081c',
  direction: 'rtl',
  overflow: 'hidden',
  position: 'fixed'
};

const contentWrapper: CSSProperties = {
  width: '100%',
  maxWidth: '350px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '10vh' // נותן מרווח קבוע מלמעלה
};

const miniLogoArea: CSSProperties = {
  width: '120px', // הקטנה משמעותית של הלוגו
  marginBottom: '30px'
};

const formCardStyle: CSSProperties = {
  width: '90%',
  padding: '25px',
  backgroundColor: 'rgba(17, 24, 39, 0.8)',
  borderRadius: '24px',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  boxSizing: 'border-box'
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  fontSize: '16px',
  textAlign: 'right',
  outline: 'none',
  boxSizing: 'border-box'
};

const goldButtonStyle: CSSProperties = {
  width: '100%',
  padding: '16px',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)',
  color: '#05081c',
  fontWeight: 'bold',
  fontSize: '18px',
  border: 'none',
  marginTop: '10px',
  cursor: 'pointer'
};