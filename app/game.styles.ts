import { CSSProperties } from "react";

const COMMON_WIDTH = '320px';

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none' },
  safeAreaWrapper: { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '5px 20px', alignItems: 'center' },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', width: '100%' },
  
  // רוחב אחיד לאינפוטים וכפתורים
  formCard: { width: COMMON_WIDTH, padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '20px' },
  input: { width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '10px', fontSize: '16px' },
  goldButton: { width: COMMON_WIDTH, padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  
  // הגדרות חדר וגריד קבוצות (2 עמודות)
  toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', width: COMMON_WIDTH, marginTop: '10px' },
  teamLabel: { color: 'white', fontSize: '14px', fontWeight: 'bold' },
  teamsGrid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', // 2 עמודות שוות
    gap: '10px', 
    width: COMMON_WIDTH, // רוחב אחיד לשאר הכפתורים
    marginTop: '15px' 
  },
  teamColumn: { backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px', textAlign: 'center', minHeight: '120px', border: '1px solid rgba(255,255,255,0.05)' },
  teamHeaderWrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '8px' },
  editIcon: { cursor: 'pointer', fontSize: '12px', opacity: 0.8 },
  playerTag: { padding: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white', fontSize: '12px', marginBottom: '5px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'grab', touchAction: 'none', textAlign: 'center' },

  // דף המשחק
  gameLayout: { display: 'flex', flexDirection: 'column', height: '100%', gap: '4px', width: '100%', alignItems: 'center' },
  wordCardArea: { display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: COMMON_WIDTH, minHeight: '240px' },
  skipButton: { width: COMMON_WIDTH, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', border: '2px solid #ef4444', color: 'white', cursor: 'pointer' },
  guesserButton: { width: COMMON_WIDTH, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' },
  
  timerDisplay: { fontSize: '48px', fontWeight: 'bold', textAlign: 'center', margin: '15px 0 5px 0' },
  gameFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', marginTop: 'auto', width: COMMON_WIDTH },
  bottomScore: { color: '#ffd700', fontSize: '28px', fontWeight: 'bold' },
  hugePlayBtn: { backgroundColor: '#10b981', width: '200px', padding: '15px', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold', marginTop: '20px' },
  
  hugeTimer: { fontSize: '120px', fontWeight: 'bold', color: '#ffd700' },
  miniAvatar: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' },
};