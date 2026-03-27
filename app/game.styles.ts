import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none' },
  safeAreaWrapper: { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '5px 20px' },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  formCard: { width: '100%', padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '20px' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '10px' },
  goldButton: { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  
  // הגדרות קבוצות
  teamsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginTop: '10px' },
  teamColumn: { backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px', textAlign: 'center' },
  teamHeaderWrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '10px' },
  editIcon: { cursor: 'pointer', fontSize: '14px' },
  playerTag: { padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'white', fontSize: '13px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },

  // מסך טיימר 5 שניות
  hugeTimer: { fontSize: '120px', fontWeight: 'bold', color: '#ffd700' },
  turnInfo: { color: 'white', fontSize: '22px', textAlign: 'center', marginBottom: '10px' },
  loadingText: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '20px' },

  // דף ניחוש (העיצוב המושלם)
  gameLayout: { display: 'flex', flexDirection: 'column', height: '100%', gap: '4px' },
  timerDisplay: { fontSize: '48px', fontWeight: 'bold', textAlign: 'center', margin: '15px 0 5px 0' },
  topGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  skipButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: '2px solid #ef4444', color: 'white', fontSize: '16px', width: '100%' },
  wordCardArea: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', minHeight: '240px' },
  wordCardPlaceholder: { width: '100%', backgroundColor: 'transparent', visibility: 'hidden' },
  guessersBox: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' },
  guesserButton: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', width: '100%' },
  miniAvatar: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' },
  
  // פוטר עם גביע משמאל
  gameFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', marginTop: 'auto' },
  bottomScore: { color: '#ffd700', fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
  modernPauseBtn: { background: 'rgba(255,255,255,0.1)', width: '50px', height: '50px', borderRadius: '15px', border: 'none', color: 'white' },
  pauseOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }
};