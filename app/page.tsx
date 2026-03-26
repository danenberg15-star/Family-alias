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
          <div style={stepOneLayout}>
            {/* לוגו ממורכז ומוקטן */}
            <div style={logoCenterer}>
              <div style={miniLogoArea}>
                <Logo />
              </div>
            </div>

            {/* כרטיס טופס */}
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
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={logoCenterer}>
               <div style={{ width: '80px' }}><Logo /></div>
            </div>
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

// === Styles - Final Layout Fix ===

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

const contentWrapper: CSSProperties = {
  width: '100%',
  maxWidth: '350px',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '8vh', // העליתי את זה עוד קצת למעלה (מ-10 ל-8)
  paddingLeft: '20px',
  paddingRight: '20px',
  boxSizing: 'border-box'
};

const stepOneLayout: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%'
};

const logoCenterer: CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '30px'
};

const miniLogoArea: CSSProperties = {
  width: '160px', // גודל מאוזן
  display: 'block'
};

const formCardStyle: CSSProperties = {
  width: '100%',
  padding: '25px',
  backgroundColor: 'rgba(17, 24, 39, 0.9)',
  borderRadius: '24px',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  boxSizing: 'border-box',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
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
  marginTop: '10px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(212, 175, 55, 0.2)'
};