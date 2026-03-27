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
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div style={textContainerStyle}>
          <h1 style={wordTextStyle}>{word}</h1>
          {en && <p style={enTextStyle}>{en}</p>}
        </div>
      </div>
    </div>
  );
}

const cardWrapperStyle: CSSProperties = { cursor: 'pointer', touchAction: 'none', userSelect: 'none', textAlign: 'center', zIndex: 10 };
const innerCardStyle: CSSProperties = { 
  backgroundColor: 'rgba(25, 30, 60, 0.9)', 
  padding: '4px', 
  borderRadius: '15px', 
  border: '2px solid rgba(255,255,255,0.2)', 
  display: 'inline-flex', 
  flexDirection: 'column', 
  alignItems: 'center',
  gap: '0px', 
  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
  overflow: 'hidden',
  maxWidth: '220px',
  userSelect: 'none'
};
const imageStyle: CSSProperties = { width: '180px', height: '180px', objectFit: 'cover', borderRadius: '12px 12px 4px 4px', display: 'block' };
const textContainerStyle: CSSProperties = { padding: '2px 0 4px 0', width: '100%' };
const wordTextStyle: CSSProperties = { color: 'white', fontSize: '24px', margin: '0', lineHeight: '1.1', fontWeight: 'bold' };
const enTextStyle: CSSProperties = { color: '#ffd700', fontSize: '14px', margin: '0', fontWeight: 'bold', opacity: 0.9 };