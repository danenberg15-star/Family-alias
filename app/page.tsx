"use client";

import { useState, useEffect, CSSProperties } from "react";
import Logo from "./components/Logo";

export default function FamilyAliasApp() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [step, setStep] = useState(1); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    let group = "בוגר";
    if (ageNum <= 6) group = "ילד";
    else if (ageNum <= 10) group = "ג'וניור";
    else if (ageNum <= 16) group = "נוער";
    
    setAgeGroup(group);
    setStep(2);
  };

  return (
    <div style={containerStyle}>
      {step === 1 && (
        <div style={screenLayout}>
          
          {/* חלק עליון ריק לאיזון */}
          <div style={spacerStyle}></div>

          {/* חלק מרכזי - לוגו מוקטן */}
          <div style={logoContainerStyle}>
            <Logo />
          </div>

          {/* חלק תחתון - טופס */}
          <div style={formCardStyle}>
            <form onSubmit={handleEntry} style={formStyle}>
              <div style={inputGroupStyle}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="שם..."
                />
              </div>
              <div style={inputGroupStyle}>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="גיל..."
                />
              </div>
              <button type="submit" style={goldButtonStyle}>
                המשך
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={fullScreenCenterStyle}>
          <div style={{...logoContainerStyle, width: '100px'}}>
             <Logo />
          </div>
          <div style={cardStyle}>
            <h2 style={{ color: 'white' }}>ברוך הבא, {name}!</h2>
            <p style={{ color: '#94a3b8' }}>קבוצת הגיל שלך: {ageGroup}</p>
          </div>
          <button style={primaryButtonStyle}>➕ צור חדר חדש</button>
        </div>
      )}
    </div>
  );
}

// === CSS Styles המותאמים אישית למובייל לפי התמונה ===

const containerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#05081c', // צבע הרקע העמוק מהתמונה
  direction: 'rtl',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const screenLayout: CSSProperties = {
  width: '100%',
  maxWidth: '360px', // רוחב מקסימלי לטלפון
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // מחלק את הרווח באופן שווה בין האלמנטים
  padding: '40px 20px', // רווח מהקצוות
  boxSizing: 'border-box'
};

const spacerStyle: CSSProperties = {
  flex: 1 // תופס מקום בחלק העליון לאיזון
};

const logoContainerStyle: CSSProperties = {
  width: '150px', // הגבלת הרווח שהלוגו תופס
  margin: '0 auto', // מרכוז
  flex: 1.5, // תופס את החלק המרכזי של המסך
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const formCardStyle: CSSProperties = {
  width: '100%',
  padding: '25px',
  backgroundColor: '#111827', // צבע רקע הכרטיס
  borderRadius: '24px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxSizing: 'border-box'
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const inputGroupStyle: CSSProperties = {
  width: '100%'
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'white',
  fontSize: '16px',
  boxSizing: 'border-box',
  textAlign: 'right',
  outline: 'none'
};

const goldButtonStyle: CSSProperties = {
  width: '100%',
  padding: '18px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)', // צבע זהב/חרדל מהתמונה
  color: '#05081c',
  fontWeight: 'bold',
  fontSize: '18px',
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.1s',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
};

const fullScreenCenterStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
  maxWidth: '360px',
  padding: '20px'
};

const cardStyle: CSSProperties = {
  width: '100%',
  padding: '20px',
  backgroundColor: '#111827',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'center'
};

const primaryButtonStyle: CSSProperties = {
  width: '100%',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: 'white',
  fontWeight: 'bold',
  border: '1px solid rgba(255,255,255,0.1)',
  cursor: 'pointer'
};