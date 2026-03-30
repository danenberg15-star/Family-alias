// app/game.styles.ts
import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none' },
  safeAreaWrapper: { width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top, 20px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', paddingLeft: '20px', paddingRight: '20px', alignItems: 'center', position: 'relative', boxSizing: 'border-box' },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', boxSizing: 'border-box' },
  
  // --- לובי ---
  lobbyTitle: { color: '#ffd700', fontSize: '2rem', fontWeight: '900', marginTop: '40px', marginBottom: '30px' },
  lobbyButton: { width: '100%', minHeight: '54px', borderRadius: '16px', backgroundColor: '#ffd700', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)' },
  
  // --- משחק (Game) ---
  timerDisplay: { fontSize: 'min(20vw, 80px)', fontWeight: '900', color: '#ffd700', margin: '5px 0', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
  wordCardArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '250px', position: 'relative' },
  gameImage: { width: '100%', height: '100%', objectFit: 'contain', borderRadius: '20px' },
  
  // כפתורי מטרות (שחקנים/קבוצות)
  targetButton: { width: '100%', minHeight: '50px', padding: '10px', borderRadius: '12px', border: '2px solid rgba(255,215,0,0.3)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' },
  targetButtonActive: { borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.2)', transform: 'scale(1.02)' },
  
  skipButton: { width: '100%', minHeight: '50px', borderRadius: '12px', border: '2px solid #ef4444', color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', cursor: 'pointer' },
  skipButtonActive: { backgroundColor: '#ef4444', color: 'white' },

  // --- השהייה (Pause) ---
  pauseOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px' },
  scoreTable: { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '10px', marginBottom: '20px' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  adjBtn: { width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #ffd700', color: '#ffd700', backgroundColor: 'transparent', fontSize: '20px' },
  hugePlayBtn: { backgroundColor: '#10b981', width: '180px', padding: '15px', borderRadius: '50px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', marginTop: '20px' },
  
  // השאר נשאר כפי שהיה ב-Setup (לוח גרירה וכו')
  setupTop: { textAlign: 'center', width: '100%', transform: 'scale(0.85)', transformOrigin: 'top', marginBottom: '5px' },
  teamsGrid: { display: 'grid', gap: '10px', width: '100%', flex: 1, marginTop: '10px', boxSizing: 'border-box' },
  teamBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', padding: '10px', overflow: 'hidden' },
  teamBoxGlowing: { borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.15)' },
  playerCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box', fontWeight: 'bold', margin: '4px 0' },
  goldButtonFixed: { width: '100%', minHeight: '65px', borderRadius: '20px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.5rem', marginTop: 'auto' },
  toggleContainer: { display: 'flex', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' },
  toggleActive: { flex: 1, padding: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  toggleInactive: { flex: 1, padding: '8px', color: '#64748b', border: 'none', background: 'none' },
  exitBtn: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }
};