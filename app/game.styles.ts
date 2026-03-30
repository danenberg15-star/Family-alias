import { CSSProperties } from "react";

const COMMON_WIDTH = '320px';

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none' },
  safeAreaWrapper: { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 20px', alignItems: 'center', position: 'relative' },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', width: '100%' },
  
  // כפתור X ליציאה
  exitBtn: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '35px', height: '35px', fontSize: '18px', cursor: 'pointer', zIndex: 100 },
  
  // טוגלים (Toggles)
  toggleContainer: { display: 'flex', width: COMMON_WIDTH, backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '14px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.1)' },
  toggleActive: { flex: 1, padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },
  toggleInactive: { flex: 1, padding: '10px', color: '#64748b', border: 'none', background: 'none', cursor: 'pointer' },
  
  // כפתורי מספרים (קבוצות)
  numberCircle: { width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  numberCircleActive: { width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #ffd700', backgroundColor: '#ffd700', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' },
  
  // מסך הגדרות
  teamsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: COMMON_WIDTH, marginTop: '10px' },
  teamColumn: { backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '130px', transition: 'all 0.2s' },
  playerTag: { padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', fontSize: '13px', marginBottom: '6px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'grab', touchAction: 'none' },
  
  // מסך השהיה (Pause) עם טבלת ניקוד
  pauseOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px' },
  scoreTable: { width: COMMON_WIDTH, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '10px', marginBottom: '20px' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  adjBtn: { width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #ffd700', color: '#ffd700', backgroundColor: 'transparent', fontSize: '20px' },
  
  // כפתורים וטקסט כללי
  goldButton: { width: COMMON_WIDTH, padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '18px' },
  timerDisplay: { fontSize: '56px', fontWeight: '900', color: '#ffd700', margin: '10px 0' },
  hugePlayBtn: { backgroundColor: '#10b981', width: '180px', padding: '15px', borderRadius: '50px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', marginTop: '20px' }
};