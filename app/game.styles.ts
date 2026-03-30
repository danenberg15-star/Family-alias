import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    height: '100dvh', 
    width: '100vw', 
    backgroundColor: '#05081c', 
    direction: 'rtl', 
    overflow: 'hidden', 
    position: 'fixed', 
    touchAction: 'none', 
    userSelect: 'none' 
  },
  safeAreaWrapper: { 
    width: '100%', 
    maxWidth: '450px', // גבול מקסימלי לטלפונים רחבים או טאבלטים
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    // שימוש במרחבי הגנה של המכשיר (Notch ופס הבית)
    paddingTop: 'env(safe-area-inset-top, 10px)',
    paddingBottom: 'env(safe-area-inset-bottom, 10px)',
    paddingLeft: '20px',
    paddingRight: '20px',
    alignItems: 'center', 
    position: 'relative' 
  },
  flexLayout: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between', // דוחף את האלמנטים לקצוות בצורה חכמה
    alignItems: 'center', 
    width: '100%' 
  },
  
  // כפתורים עם גודל לחיצה תקני (מינימום 44px)
  goldButton: { 
    width: '100%', 
    minHeight: '54px', 
    padding: '12px', 
    borderRadius: '16px', 
    background: 'linear-gradient(135deg, #ffd700, #b8860b)', 
    color: '#05081c', 
    fontWeight: '900', 
    border: 'none', 
    cursor: 'pointer', 
    fontSize: '1.2rem',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
  },
  
  // טוגלים רספונסיביים
  toggleContainer: { 
    display: 'flex', 
    width: '100%', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: '4px', 
    borderRadius: '14px', 
    marginBottom: '15px', 
    border: '1px solid rgba(255,255,255,0.1)' 
  },

  // התאמת כרטיס המילה למסכים קטנים וגדולים
  wordCardArea: { 
    flex: 1, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%',
    minHeight: '200px'
  },
  
  // כפתורי השחקנים למטה - גמישים
  guesserButton: { 
    width: '100%', 
    minHeight: '50px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '12px', 
    borderRadius: '16px', 
    border: '1px solid rgba(255,255,255,0.1)', 
    cursor: 'pointer',
    fontSize: '1.1rem'
  },

  timerDisplay: { 
    fontSize: 'min(15vw, 60px)', // גודל דינמי לפי רוחב המסך
    fontWeight: '900', 
    color: '#ffd700', 
    margin: '10px 0' 
  },

  pauseOverlay: { 
    position: 'absolute', 
    inset: 0, 
    backgroundColor: 'rgba(5, 8, 28, 0.98)', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 3000, 
    padding: '20px' 
  }
};