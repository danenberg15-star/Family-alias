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
    justifyContent: 'space-between', position: 'relative'
  },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' },

  // כפתור X אדום בפינה
  exitBtnRed: { position: 'absolute', top: '15px', left: '15px', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#ef4444', border: 'none', color: 'white', fontSize: '20px', fontWeight: 'bold', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  // מינוס אדום - גדול וממורכז
  minusBtnCentered: { 
    width: '64px', height: '64px', borderRadius: '50%', 
    backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '2px solid #ef4444', 
    color: '#ef4444', fontSize: '36px', fontWeight: 'bold', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
  },

  teamBox: { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '18px', border: '1px solid rgba(255,215,0,0.1)', padding: '12px', display: 'flex', flexDirection: 'column', minHeight: '140px', position: 'relative' },
  setupGrid: { display: 'grid', gap: '10px', width: '100%', flex: 1, margin: '15px 0', alignContent: 'start' },
  playerCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '10px', borderRadius: '12px', margin: '4px 0', fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' },
  lobbyButton: { width: '100%', minHeight: '60px', borderRadius: '20px', backgroundColor: '#ffd700', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.3rem' },
  disabledButton: { width: '100%', minHeight: '60px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)', fontWeight: '900', border: 'none', fontSize: '1.3rem' },
  setupToggleBtn: { flex: 1, minHeight: '52px', borderRadius: '16px', border: '2px solid rgba(255,215,0,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: '900', fontSize: '1.1rem' },
  setupToggleActive: { backgroundColor: '#ffd700', color: '#05081c', borderColor: '#ffd700', boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)' },
  whatsappIcon: { backgroundColor: '#25D366', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }
};