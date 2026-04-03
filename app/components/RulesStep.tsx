"use client";
import React from "react";

export default function RulesStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={s.layout}>
      <div style={s.container}>
        <h1 style={{ ...s.title, fontSize: '1.8rem', marginBottom: '15px' }}>איך משחקים? 🏆</h1>
        
        <div style={{ ...s.scrollArea, overflowY: 'hidden' }}>
          <section style={{ ...s.section, marginBottom: '15px', paddingBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>1. התחברות</h2>
            <p style={s.text}>פותחים חדר חדש ושולחים את הקוד לחברים, או מצטרפים לחדר קיים בעזרת קוד או קישור.</p>
          </section>

          <section style={{ ...s.section, marginBottom: '15px', paddingBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>2. הגדרות החדר</h2>
            <p style={s.text}>בדף החדר תגדירו את סוג המשחק: <b>יחידים</b> או <b>קבוצות</b> ומי יהיה בכל קבוצה. ברמה הקלה תקבלו מילים עם תמונות שכל ילד בן 5 מכיר.</p>
          </section>

          <section style={{ ...s.section, borderBottom: 'none', marginBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>3. מהלך המשחק והניקוד</h2>
            <p style={s.text}>
              בכל תור (דקה אחת) תקבל מילה שעליך לתאר <b>בלי להשתמש בשורש המילה או בשפה אחרת.</b>
            </p>
            <p style={{ ...s.text, marginTop: '8px' }}>
              • <b>ניחשו נכון?</b> לחץ על שם השחקן/הקבוצה לניקוד (+1).<br/>
              • <b>קשה מדי?</b> לחיצה על "דלג" תחליף מילה ותוריד נקודה (-1).
            </p>
          </section>

          <div style={{ textAlign: 'center', color: '#ffd700', fontWeight: '900', fontSize: '1.1rem', marginTop: '5px' }}>
            הראשון שמגיע ל-50 נקודות מנצח!
          </div>
        </div>

        <button onClick={onStart} style={{ ...s.button, height: '50px', marginTop: '10px' }}>הבנתי, בואו נתחיל!</button>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#05081c', color: 'white', padding: '15px', direction: 'rtl', alignItems: 'center', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '450px', height: 'auto', maxHeight: '95%', backgroundColor: '#1a1d2e', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 215, 0, 0.2)' },
  title: { color: '#ffd700', textAlign: 'center', fontWeight: '900' },
  scrollArea: { flex: 1, marginBottom: '10px' },
  section: { borderBottom: '1px solid rgba(255,255,255,0.1)' },
  subTitle: { color: '#ffd700', marginBottom: '5px', fontWeight: '700' },
  text: { fontSize: '0.95rem', lineHeight: '1.4', opacity: 0.9 },
  button: { width: '100%', backgroundColor: '#ffd700', color: '#05081c', border: 'none', borderRadius: '15px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer' }
};