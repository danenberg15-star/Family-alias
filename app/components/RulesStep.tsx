"use client";
import React from "react";

export default function RulesStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={s.layout}>
      <div style={s.container}>
        <h1 style={{ ...s.title, fontSize: '1.8rem', marginBottom: '15px' }}>איך משחקים? 🏆</h1>
        
        <div style={{ ...s.scrollArea, overflowY: 'hidden' }}>
          <section style={{ ...s.section, marginBottom: '12px', paddingBottom: '8px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>1. התחברות</h2>
            <p style={s.text}>פותחים חדר חדש ושולחים את הקוד לחברים, או מצטרפים לחדר קיים בעזרת קוד או קישור.</p>
          </section>

          <section style={{ ...s.section, marginBottom: '12px', paddingBottom: '8px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>2. הגדרות החדר</h2>
            <p style={s.text}>בדף החדר תגדירו את סוג המשחק: <b>יחידים</b> או <b>קבוצות</b>. ברמה הקלה תקבלו מילים עם תמונות שכל ילד בן 5 מכיר.</p>
          </section>

          <section style={{ ...s.section, borderBottom: 'none', marginBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>3. מהלך המשחק והניקוד</h2>
            <p style={s.text}>
              בכל תור (דקה) תתאר מילה <b>בלי להשתמש בשורש המילה או בשפה אחרת.</b>
            </p>
            <p style={{ ...s.text, marginTop: '5px' }}>
              • <b>ניחשו?</b> לחץ על שם השחקן לניקוד (+1).<br/>
              • <b>קשה?</b> "דלג" יחליף מילה ויוריד נקודה (-1).
            </p>
          </section>

          <div style={{ textAlign: 'center', color: '#ffd700', fontWeight: '900', fontSize: '1.1rem', marginTop: '5px' }}>
            הראשון ל-50 נקודות מנצח!
          </div>
        </div>

        {/* שורת הקרדיט ל-Pixabay */}
        <div style={{ textAlign: 'center', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px', color: 'white' }}>
          Images courtesy of Pixabay
        </div>

        <button onClick={onStart} style={{ ...s.button, height: '48px' }}>הבנתי, בואו נתחיל!</button>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#05081c', color: 'white', padding: '15px', direction: 'rtl', alignItems: 'center', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '450px', height: 'auto', maxHeight: '95%', backgroundColor: '#1a1d2e', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 215, 0, 0.2)' },
  title: { color: '#ffd700', textAlign: 'center', fontWeight: '900' },
  scrollArea: { flex: 1, marginBottom: '5px' },
  section: { borderBottom: '1px solid rgba(255,255,255,0.1)' },
  subTitle: { color: '#ffd700', marginBottom: '5px', fontWeight: '700' },
  text: { fontSize: '0.92rem', lineHeight: '1.35', opacity: 0.9 },
  button: { width: '100%', backgroundColor: '#ffd700', color: '#05081c', border: 'none', borderRadius: '15px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer' }
};