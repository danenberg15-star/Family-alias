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
      <div style={safeAreaWrapper}>
        
        {step === 1 && (
          <div style={flexLayout}>
            {/* מרכוז לוגו מוחלט */}
            <div style={logoFlexBox}>
              <div style={logoSizer}>
                <Logo />
              </div>
            </div>

            {/* כרטיס טופס מורם */}
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
          </div>
        )}

        {step === 2 && (
          <div style={flexLayout}>
            <div style={{ width: '100px', marginBottom: '20px' }}><Logo /></div>
            <div style={formCardStyle}>
              <h2 style={{ color: 'white', margin: '0 0 10px' }}>שלום {name}!</h2>
              <button style={goldButtonStyle} onClick={() => setStep(1)}>חזרה</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// === Styles: Optimized for Android Chrome with Toolbar ===

const containerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  height: '100dvh', 
  width: '100vw',
  backgroundColor: '#05081c',
  direction: 'rtl',
  overflow: 'hidden',
  position: 'fixed'
};

const safeAreaWrapper: CSSProperties = {
  width: '100%',
  maxWidth: '360px',
  height: '90%', // משאיר 10% מרווח בטחון מלמטה לשורת הניווט של אנדרואיד
  display: 'flex',
  flexDirection: 'column',
  padding: '0 20px',
  boxSizing: 'border-box'
};

const flexLayout: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // מרכז הכל אנכית במסך הפנוי
  alignItems: 'center',
  width: '100%'
};

const logoFlexBox: CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px'
};

const logoSizer: CSSProperties = {
  width: '180px', // גודל לוגו ברור
  display: 'flex',
  justifyContent: 'center'
};

const formCardStyle: CSSProperties = {
  width: '100%',
  padding: '25px',
  backgroundColor: 'rgba(17, 24, 39, 0.95)',
  borderRadius: '24px',
  border: '1px solid rgba(255,255,255,0.1)',
  boxSizing: 'border-box',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%'
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
  cursor: 'pointer'
};