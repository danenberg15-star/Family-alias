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
    paddingTop: 'env(safe-area-inset-top, 10px)', paddingBottom: 'env(safe-area-inset-bottom, 30px)', 
    paddingLeft: '20px', paddingRight: '20px', alignItems: 'center', position: 'relative', 
    boxSizing: 'border-box', justifyContent: 'flex-start' // מבטיח שהכל יתחיל מלמעלה
  },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' },
  
  // --- מסך כניסה מאוחד (Entry) ---
  entryLogo: { width: 'min(220px, 60vw)', height: 'auto', marginTop: '5px', marginBottom: '15px', objectFit: 'contain' },
  entryTitle: { color: '#ffd700', fontSize: '1.3rem', fontWeight: '900', textAlign: 'center', marginBottom: '20px', lineHeight: '1.2' },
  entryInput: { width: '100%', minHeight: '50px', padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', textAlign: 'center', boxSizing: 'border-box' },
  
  // כפתורים
  lobbyButton: { width: '100%', minHeight: '56px', borderRadius: '16px', backgroundColor: '#ffd700', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)' },
  lobbyJoinFrame: { width: '100%', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '20px' },

  // --- כללי ---
  modalOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' },
  modalContent: { width: '100%', maxWidth: '350px', backgroundColor: '#0f172a', borderRadius: '24px', padding: '25px', border: '1px solid #ffd700', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' },
  exitBtn: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }
};