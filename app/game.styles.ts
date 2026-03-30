// app/game.styles.ts
import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none' },
  safeAreaWrapper: { 
    width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', 
    paddingTop: 'env(safe-area-inset-top, 20px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', 
    paddingLeft: '20px', paddingRight: '20px', alignItems: 'center', position: 'relative', boxSizing: 'border-box' 
  },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', boxSizing: 'border-box' },
  
  logo: { width: 'min(270px, 70vw)', height: 'auto', marginTop: '20px', marginBottom: '20px', objectFit: 'contain' },
  title: { color: '#ffd700', fontSize: '1.4rem', fontWeight: '900', textAlign: 'center', marginBottom: '25px', lineHeight: '1.3' },
  
  // מרכוז אזור הכפתורים בלובי
  lobbyCenterArea: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%', flex: 1
  },

  joinFrameBtn: {
    width: '100%', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', border: '2px dashed rgba(255, 215, 0, 0.3)',
    cursor: 'pointer', transition: 'all 0.2s'
  },

  modalOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' },
  modalContent: { width: '100%', maxWidth: '350px', backgroundColor: '#0f172a', borderRadius: '24px', padding: '30px', border: '1px solid #ffd700', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },

  inputField: { width: '100%', minHeight: '48px', padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', textAlign: 'center', boxSizing: 'border-box' },
  goldButton: { width: '100%', minHeight: '54px', padding: '12px', borderRadius: '16px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)' },
  exitBtn: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  // סגנונות Setup ומשחק נשמרים
  toggleContainer: { display: 'flex', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '14px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' },
  toggleActive: { flex: 1, padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  toggleInactive: { flex: 1, padding: '10px', color: '#64748b', border: 'none', background: 'none' },
  timerDisplay: { fontSize: 'min(15vw, 60px)', fontWeight: '900', color: '#ffd700', margin: '10px 0' },
  wordCardArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '200px' },
  guesserButton: { width: '100%', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '1.1rem' },
  pauseOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px' },
  scoreTable: { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '10px', marginBottom: '20px' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  adjBtn: { width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #ffd700', color: '#ffd700', backgroundColor: 'transparent', fontSize: '20px' },
  hugePlayBtn: { backgroundColor: '#10b981', width: '180px', padding: '15px', borderRadius: '50px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', marginTop: '20px' }
};