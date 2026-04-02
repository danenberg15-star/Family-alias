"use client";
import React from "react";

export default function RulesStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={s.layout}>
      <div style={s.container}>
        <h1 style={s.title}>איך משחקים? 🏆</h1>
        
        <div style={s.scrollArea}>
          <section style={s.section}>
            <h2 style={s.subTitle}>💡 המטרה</h2>
            <p style={s.text}>לתאר לחברים או לקבוצה כמה שיותר מילים לפני שהזמן נגמר. הראשון (או הקבוצה הראשונה) שמגיע ל-50 נקודות מנצח!</p>
          </section>

          <section style={s.section}>
            <h2 style={s.subTitle}>✨ הקסם: התאמת גיל</h2>
            <p style={s.text}>המשחק חכם! הוא מזהה מי השחקן שמתאר כרגע ומתאים לו את המילים:</p>
            <ul style={s.list}>
              <li>👶 <b>ילדים (עד גיל 6):</b> מילים פשוטות עם תמונות.</li>
              <li>👦 <b>צעירים (7-12):</b> מילים יומיומיות קלות.</li>
              <li>🧑 <b>נוער ומבוגרים:</b> מושגים מופשטים ומאתגרים.</li>
            </ul>
          </section>

          <section style={s.section}>
            <h2 style={s.subTitle}>📊 ניקוד</h2>
            <p style={s.text}>• <b>ניחוש נכון:</b> נקודה אחת פלוס (+1).</p>
            <p style={s.text}>• <b>דילוג:</b> נקודה אחת פחות (-1). אל תדלגו בקלות!</p>
            <p style={s.text}>• <b>ביחידים:</b> גם המתאר וגם המנחש מקבלים נקודה.</p>
          </section>

          <section style={s.section}>
            <h2 style={s.subTitle}>💣 7 בום!</h2>
            <p style={s.text}>כשהניקוד מגיע לכפולה של 7, נכנסים לסבב בונוס! אין טיימר, מתארים 7 מילים ברצף, וכל ניחוש שווה <b>2 נקודות</b>. זהירות - כולם יכולים לגנוב לכם את הנקודות!</p>
          </section>
        </div>

        <button onClick={onStart} style={s.button}>הבנתי, בואו נתחיל!</button>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#05081c', color: 'white', padding: '20px', direction: 'rtl', alignItems: 'center', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '500px', height: '90%', backgroundColor: '#1a1d2e', borderRadius: '30px', padding: '25px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 215, 0, 0.2)' },
  title: { color: '#ffd700', fontSize: '2.2rem', textAlign: 'center', marginBottom: '20px', fontWeight: '900' },
  scrollArea: { flex: 1, overflowY: 'auto', paddingLeft: '10px', marginBottom: '20px', scrollbarWidth: 'none' },
  section: { marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' },
  subTitle: { color: '#ffd700', fontSize: '1.3rem', marginBottom: '8px', fontWeight: '700' },
  text: { fontSize: '1rem', lineHeight: '1.5', opacity: 0.9 },
  list: { marginTop: '10px', paddingRight: '20px', listStyleType: 'none', fontSize: '0.95rem' },
  button: { width: '100%', height: '60px', backgroundColor: '#ffd700', color: '#05081c', border: 'none', borderRadius: '15px', fontSize: '1.3rem', fontWeight: '900', cursor: 'pointer' }
};