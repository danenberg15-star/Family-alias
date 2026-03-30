// app/game.styles.ts
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
    maxWidth: '450px', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    paddingTop: 'env(safe-area-inset-top, 20px)',
    paddingBottom: 'env(safe-area-inset-bottom, 20px)',
    paddingLeft: '20px',
    paddingRight: '20px',
    alignItems: 'center', 
    position: 'relative',
    boxSizing: 'border-box'
  },
  flexLayout: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  },
  logo: {
    width: '180px', // גודל לוגו מותאם
    height: 'auto',
    marginBottom: '10px',
    objectFit: 'contain'
  },
  exitBtn: { 
    position: 'absolute', 
    top: 'env(safe-area-inset-top, 10px)', 
    left: 'env(safe-area-inset-left, 10px)', 
    background: 'rgba(255,255,255,0.1)', 
    border: 'none', 
    color: 'white', 
    borderRadius: '50%', 
    width: '40px', 
    height: '40px', 
    fontSize: '20px', 
    cursor: 'pointer', 
    zIndex: 1000, 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputField: { 
    width: '100%', 
    minHeight: '48px', 
    padding: '12px', 
    borderRadius: '16px', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    color: 'white', 
    border: '1px solid rgba(255,255,255,0.1)', 
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '15px',
    boxSizing: 'border-box'
  },
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
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    marginTop: 'auto',
    marginBottom: '20px'
  },
  title: { 
    color: '#ffd700', 
    fontSize: '1.6rem', 
    fontWeight: '900', 
    textAlign: 'center', 
    marginBottom: '20px' 
  },
  // שאר הסגנונות הקיימים (Timer, Pause, וכו') נשארים אותו דבר
  timerDisplay: { fontSize: 'min(15vw, 60px)', fontWeight: '900', color: '#ffd700', margin: '10px 0' },
  pauseOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px' },
  scoreTable: { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '10px', marginBottom: '20px' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  adjBtn: { width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #ffd700', color: '#ffd700', backgroundColor: 'transparent', fontSize: '20px' },
  hugePlayBtn: { backgroundColor: '#10b981', width: '180px', padding: '15px', borderRadius: '50px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', marginTop: '20px' },
  gameFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingBottom: '10px' },
  toggleContainer: { display: 'flex', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '14px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' },
  toggleActive: { flex: 1, padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  toggleInactive: { flex: 1, padding: '10px', color: '#64748b', border: 'none', background: 'none', cursor: 'pointer' },
  wordCardArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '200px' },
  guesserButton: { width: '100%', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '1.1rem' }
};