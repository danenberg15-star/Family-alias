import { CSSProperties, RefObject } from "react";

interface WordCardProps {
  word: string;
  en?: string;
  img?: string;
  wordRef: RefObject<HTMLDivElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
}

export default function WordCard({ word, en, img, wordRef, onPointerDown }: WordCardProps) {
  return (
    <div ref={wordRef} onPointerDown={onPointerDown} style={cardWrapperStyle}>
      <div style={innerCardStyle}>
        {img && (
          <img 
            src={img.startsWith('/') ? img : `/${img}`} 
            alt={word} 
            style={imageStyle} 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
            }}
          />
        )}
        <h1 style={wordTextStyle}>{word}</h1>
        {en && <p style={enTextStyle}>{en}</p>}
      </div>
    </div>
  );
}

const cardWrapperStyle: CSSProperties = { cursor: 'pointer', touchAction: 'none', userSelect: 'none', textAlign: 'center', zIndex: 10 };
const innerCardStyle: CSSProperties = { 
  backgroundColor: 'rgba(25, 30, 60, 0.9)', 
  padding: '25px', 
  borderRadius: '30px', 
  border: '1px solid rgba(255,255,255,0.2)', 
  minWidth: '280px', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  boxShadow: '0 15px 35px rgba(0,0,0,0.6)' 
};
const imageStyle: CSSProperties = { width: '220px', height: '220px', marginBottom: '15px', objectFit: 'contain', pointerEvents: 'none', borderRadius: '15px' };
const wordTextStyle: CSSProperties = { color: 'white', fontSize: '36px', margin: '0', pointerEvents: 'none', fontWeight: 'bold' };
const enTextStyle: CSSProperties = { color: '#ffd700', fontSize: '18px', fontWeight: 'bold', pointerEvents: 'none', marginTop: '5px' };