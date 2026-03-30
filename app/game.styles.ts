// app/game.styles.ts
import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none' },
  safeAreaWrapper: { width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top, 20px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', paddingLeft: '15px', paddingRight: '15px', alignItems: 'center', position: 'relative', boxSizing: 'border-box' },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', boxSizing: 'border-box' },
  
  // --- לובי ופתיחה (נעולים) ---
  entryInput: { width: '100%', minHeight: '48px', padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' },
  entryButton: { width: '100%', minHeight: '54px', padding: '12px', borderRadius: '16px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1.2rem' },
  lobbyButton: { width: '100%', minHeight: '54px', borderRadius: '16px', backgroundColor: '#ffd700', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.2rem', cursor: 'pointer' },

  // --- מסך משחק (GameStep) ---
  timerBold: { fontSize: '5rem', fontWeight: '900', color: '#ffd700', textShadow: '0 0 20px rgba(255, 215, 0, 0.4)', margin: '10px 0' },
  imageContainer: { flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' },
  fullImage: { width: '100%', height: '100%', objectFit: 'contain' },
  wordOverlay: { position: 'absolute', bottom: '20px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '12px', color: 'white', fontSize: '2rem', fontWeight: 'bold', backdropFilter: 'blur(5px)' },
  
  // מטרות (Targets)
  gameTargetsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '20px' },
  targetBtn: { minHeight: '60px', borderRadius: '16px', border: '2px solid rgba(255,215,0,0.3)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' },
  targetBtnActive: { borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.2)', transform: 'scale(1.02)' },
  skipBtn: { gridColumn: 'span 2', minHeight: '55px', borderRadius: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '5px' },
  skipBtnActive: { backgroundColor: '#ef4444', color: 'white' },

  // השהייה וניקוד
  pauseOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' },
  scoreAdjustRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '15px', marginBottom: '10px' },
  adjCircle: { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #ffd700', color: '#ffd700', backgroundColor: 'transparent', fontSize: '24px', fontWeight: 'bold' },

  exitBtn: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }
};