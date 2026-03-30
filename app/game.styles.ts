// app/game.styles.ts
import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none' },
  safeAreaWrapper: { width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 'env(safe-area-inset-top, 20px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', paddingLeft: '20px', paddingRight: '20px', alignItems: 'center', position: 'relative', boxSizing: 'border-box' },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', boxSizing: 'border-box' },
  
  // --- מסך פתיחה (Entry) ---
  entryLogo: { width: 'min(270px, 70vw)', height: 'auto', marginTop: '20px', marginBottom: '20px', objectFit: 'contain' },
  entryTitle: { color: '#ffd700', fontSize: '1.4rem', fontWeight: '900', textAlign: 'center', marginBottom: '25px', lineHeight: '1.3' },
  entryInput: { width: '100%', minHeight: '48px', padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' },
  entryButton: { width: '100%', minHeight: '54px', padding: '12px', borderRadius: '16px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: '900', border: 'none', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)' },

  // --- מסך לובי (Lobby) - שחזור מרכוז ---
  lobbyCenterArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px', width: '100%', flex: 1 },
  lobbyButton: { width: '100%', minHeight: '54px', borderRadius: '16px', backgroundColor: 'white', color: 'black', fontWeight: '900', border: 'none', fontSize: '1.2rem', cursor: 'pointer' },
  lobbyJoinFrame: { width: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', border: '2px dashed rgba(255, 215, 0, 0.3)', cursor: 'pointer' },

  // --- מסך אפיון (Setup) ---
  setupTop: { textAlign: 'center', width: '100%', transform: 'scale(0.85)', transformOrigin: 'top', marginBottom: '5px' },
  teamsGrid: { display: 'grid', gap: '10px', width: '100%', flex: 1, marginTop: '10px', boxSizing: 'border-box' },
  teamBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', padding: '12px', overflow: 'hidden' },
  teamBoxGlowing: { borderColor: '#ffd700', backgroundColor: 'rgba(255, 215, 0, 0.15)', boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)' },
  playerCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box', fontWeight: 'bold', margin: '4px 0' },
  goldButtonFixed: { width: '100%', minHeight: '65px', borderRadius: '20px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.5rem', marginTop: 'auto' },
  toggleContainer: { display: 'flex', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' },
  toggleActive: { flex: 1, padding: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  toggleInactive: { flex: 1, padding: '8px', color: '#64748b', border: 'none', background: 'none' },

  // כללי
  modalOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' },
  modalContent: { width: '100%', maxWidth: '350px', backgroundColor: '#0f172a', borderRadius: '24px', padding: '30px', border: '1px solid #ffd700', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  exitBtn: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }
};