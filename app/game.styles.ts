import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none', userSelect: 'none' },
  safeAreaWrapper: { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '5px 20px' },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  formCard: { width: '100%', padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' },
  goldButton: { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700, #b8860b)', color: '#05081c', fontWeight: 'bold', border: 'none' },
  gameLayout: { display: 'flex', flexDirection: 'column', height: '100%', gap: '4px' },
  timerDisplay: { fontSize: '48px', fontWeight: 'bold', textAlign: 'center', margin: '15px 0 5px 0' },
  topGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' },
  skipButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', borderRadius: '12px', border: '2px solid #ef4444', color: 'white', cursor: 'pointer', fontSize: '14px', userSelect: 'none', width: '100%' },
  wordCardArea: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px', position: 'relative', width: '100%' },
  wordCardPlaceholder: { width: '100%', backgroundColor: 'transparent', visibility: 'hidden' },
  guessersBox: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '5px', width: '100%' },
  guesserButton: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', userSelect: 'none', width: '100%' },
  miniAvatar: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' },
  gameFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px' },
  bottomScore: { color: '#ffd700', fontSize: '24px', fontWeight: 'bold' },
  modernPauseBtn: { background: 'rgba(255,255,255,0.1)', width: '45px', height: '45px', borderRadius: '12px', border: 'none', color: 'white' },
  pauseOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 },
  hugePlayBtn: { backgroundColor: '#10b981', width: '80px', height: '80px', borderRadius: '50%', border: 'none', fontSize: '30px' },
  scoreCircle: { fontSize: '40px', color: '#ffd700', border: '3px solid #ffd700', width: '110px', height: '110px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};