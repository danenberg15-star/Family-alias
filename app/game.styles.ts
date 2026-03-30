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
    userSelect: 'none',
    // ביטול אפקט המשיכה לרענון (Pull-to-refresh)
    overscrollBehavior: 'none' 
  },
  safeAreaWrapper: { 
    width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', 
    paddingTop: 'env(safe-area-inset-top, 20px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', 
    paddingLeft: '15px', paddingRight: '15px', alignItems: 'center', position: 'relative', boxSizing: 'border-box' 
  },
  flexLayout: { 
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', boxSizing: 'border-box' 
  },
  
  // כפתור תחתון קבוע
  goldButtonFixed: { 
    width: '100%', minHeight: '65px', borderRadius: '20px', 
    background: 'linear-gradient(135deg, #ffd700, #b8860b)', 
    color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.5rem',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
    marginTop: 'auto' // דוחף לתחתית ה-Flex
  },

  // לוח הקבוצות
  teamsGrid: {
    display: 'grid', gap: '10px', width: '100%', flex: 1, marginTop: '10px', boxSizing: 'border-box'
  },
  teamBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', flexDirection: 'column', padding: '10px', transition: 'border 0.2s', overflow: 'hidden'
  },
  teamBoxGlowing: {
    borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.15)', boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)'
  },

  playerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', cursor: 'grab',
    touchAction: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', boxSizing: 'border-box', fontWeight: 'bold', margin: '4px 0'
  },

  setupTop: { textAlign: 'center', width: '100%', transform: 'scale(0.85)', transformOrigin: 'top', marginBottom: '5px' },
  toggleContainer: { display: 'flex', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' },
  toggleActive: { flex: 1, padding: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  toggleInactive: { flex: 1, padding: '8px', color: '#64748b', border: 'none', background: 'none' },
  
  exitBtn: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }
};