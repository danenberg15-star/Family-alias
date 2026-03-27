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
  padding: '5px', // מינימום ריווח מהמסגרת
  borderRadius: '20px', 
  border: '2px solid rgba(255,255,255,0.2)', 
  display: 'inline-flex', 
  flexDirection: 'column', 
  alignItems: 'center',
  gap: '2px', // כמעט ללא מרווח בין תמונה לטקסט
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  overflow: 'hidden'
};

const imageStyle: CSSProperties = { 
  width: '200px', 
  height: '200px', 
  objectFit: 'cover', 
  pointerEvents: 'none', 
  borderRadius: '15px 15px 5px 5px',
  display: 'block'
};

const textContainerStyle: CSSProperties = {
  padding: '2px 0 8px 0', // ריווח מינימלי בתחתית בלבד
  width: '100%'
};

const wordTextStyle: CSSProperties = { 
  color: 'white', 
  fontSize: '28px', 
  margin: '0', 
  lineHeight: '1.1',
  pointerEvents: 'none', 
  fontWeight: 'bold' 
};

const enTextStyle: CSSProperties = { 
  color: '#ffd700', 
  fontSize: '15px', 
  margin: '0',
  fontWeight: 'bold', 
  pointerEvents: 'none', 
  opacity: 0.9 
};