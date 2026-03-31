// app/game.styles.ts
import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { 
    display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', 
    backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed',
    touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none' 
  },
  safeAreaWrapper: { 
    width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', 
    paddingTop: 'env(safe-area-inset-top, 10px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', 
    paddingLeft: '15px', paddingRight: '15px', alignItems: 'center', boxSizing: 'border-box',
    justifyContent: 'space-between'
  },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' },

  // --- עיצוב כפתורי בחירה (כמו במסך הראשון) ---
  setupSelectionRow: { display: 'flex', gap: '10px', width: '100%', marginBottom: '10px' },
  setupSelectionBtn: {
    flex: 1, minHeight: '52px', borderRadius: '16px', border: '2px solid rgba(255,215,0,0.3)',
    backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold', fontSize: '1rem',
    cursor: 'pointer', transition: 'all 0.2s'
  },
  setupSelectionBtnActive: {
    backgroundColor: '#ffd700', color: '#05081c', borderColor: '#ffd700',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
  },

  // --- קבוצות וגרירה ---
  setupGrid: { display: 'grid', gap: '10px', width: '100%', flex: 1, margin: '10px 0', alignContent: 'start' },
  teamBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px',
    border: '1px solid rgba(255,215,0,0.1)', padding: '10px', display: 'flex',
    flexDirection: 'column', minHeight: '120px', transition: 'all 0.2s'
  },
  teamBoxGlowing: { borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.15)', transform: 'scale(1.02)' },
  playerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '10px',
    borderRadius: '12px', margin: '4px 0', fontSize: '1rem', textAlign: 'center', fontWeight: 'bold', cursor: 'grab'
  },
  draggingGhost: { position: 'fixed', pointerEvents: 'none', zIndex: 9999, width: '120px', backgroundColor: '#ffd700', color: '#05081c', padding: '10px', borderRadius: '12px', fontWeight: 'bold', textAlign: 'center' },

  // --- כפתורים ראשיים ---
  whatsappIconBtn: { backgroundColor: '#25D366', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', marginRight: '10px' },
  lobbyButton: { width: '100%', minHeight: '60px', borderRadius: '20px', backgroundColor: '#ffd700', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.3rem', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)' },
  disabledButton: { width: '100%', minHeight: '60px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)', fontWeight: '900', border: 'none', fontSize: '1.3rem' }
};