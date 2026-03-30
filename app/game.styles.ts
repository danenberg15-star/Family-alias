// app/game.styles.ts
import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none' },
  safeAreaWrapper: { width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top, 20px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', paddingLeft: '15px', paddingRight: '15px', alignItems: 'center', position: 'relative', boxSizing: 'border-box' },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', boxSizing: 'border-box' },
  
  // --- סטיילים נעולים למסך הפתיחה (Entry) ---
  entryLogo: { width: 'min(270px, 70vw)', height: 'auto', marginTop: '20px', marginBottom: '20px', objectFit: 'contain' },
  entryTitle: { color: '#ffd700', fontSize: '1.4rem', fontWeight: '900', textAlign: 'center', marginBottom: '25px', lineHeight: '1.3' },
  entryInput: { width: '100%', minHeight: '48px', padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' },
  entryButton: { width: '100%', minHeight: '54px', padding: '12px', borderRadius: '16px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)' },

  // --- סטיילים למסך האפיון (Setup) ---
  setupTop: { textAlign: 'center', width: '100%', transform: 'scale(0.85)', transformOrigin: 'top', marginBottom: '5px' },
  teamsGrid: { display: 'grid', gap: '10px', width: '100%', flex: 1, marginTop: '10px', boxSizing: 'border-box' },
  teamBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', padding: '10px', transition: 'border 0.2s', overflow: 'hidden' },
  teamBoxGlowing: { borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.15)' },
  playerCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box', fontWeight: 'bold', margin: '4px 0' },
  goldButtonFixed: { width: '100%', minHeight: '65px', borderRadius: '20px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)', marginTop: 'auto' },
  toggleContainer: { display: 'flex', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' },
  toggleActive: { flex: 1, padding: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  toggleInactive: { flex: 1, padding: '8px', color: '#64748b', border: 'none', background: 'none' },
  
  // תפריט ורטיקלי
  verticalMenuOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 3000, gap: '15px' },
  exitBtn: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }
};