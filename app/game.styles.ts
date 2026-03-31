// app/game.styles.ts
import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { 
    display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', 
    backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed' 
  },
  safeAreaWrapper: { 
    width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', 
    paddingTop: 'env(safe-area-inset-top, 10px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', 
    paddingLeft: '15px', paddingRight: '15px', alignItems: 'center', boxSizing: 'border-box',
    justifyContent: 'space-between'
  },
  flexLayout: { 
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', 
    height: '100%', justifyContent: 'space-between' 
  },
  
  // כותרות ואלמנטים משותפים
  entryTitle: { color: '#ffd700', fontSize: '1.4rem', fontWeight: '900', textAlign: 'center', lineHeight: '1.2' },
  goldText: { color: '#ffd700', fontWeight: 'bold' },
  
  // כפתורים
  lobbyButton: { 
    width: '100%', minHeight: '56px', borderRadius: '18px', backgroundColor: '#ffd700', 
    color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.2rem', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)'
  },
  disabledButton: {
    width: '100%', minHeight: '56px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.3)', fontWeight: '900', border: 'none', fontSize: '1.2rem'
  },
  whatsappBtn: {
    backgroundColor: '#25D366', color: 'white', width: '100%', minHeight: '45px', 
    borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px'
  },

  // הגדרות קבוצות (Setup)
  setupGrid: {
    display: 'grid', gap: '10px', width: '100%', flex: 1, margin: '15px 0',
    overflowY: 'auto', alignContent: 'start'
  },
  teamBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px',
    border: '1px solid rgba(255,215,0,0.1)', padding: '10px', display: 'flex',
    flexDirection: 'column', minHeight: '120px'
  },
  playerBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', padding: '6px',
    borderRadius: '8px', margin: '3px 0', fontSize: '0.9rem', textAlign: 'center'
  },

  // טוגלים
  toggleContainer: { 
    display: 'flex', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: '4px', borderRadius: '12px', marginBottom: '10px' 
  },
  toggleActive: { flex: 1, padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  toggleInactive: { flex: 1, padding: '10px', color: '#64748b', border: 'none', background: 'none' }
};