"use client";

import { useState, useEffect, CSSProperties, useRef } from "react";
import Logo from "./components/Logo";

// === מאגר המילים המעודכן לפי הספריות הפיזיות שלך ===
const KIDS_WORDS = [
  { word: "נְמָלָה", en: "Ant", img: "kids/ant.png" },
  { word: "תַּפּוּחַ", en: "Apple", img: "kids/apple.png" },
  { word: "אַסְטְרוֹנָאוּט", en: "Astronaut", img: "kids/astronaut.png" },
  { word: "בָּנָנָה", en: "Banana", img: "kids/banana.png" },
  { word: "סוֹלְלָה", en: "Battery", img: "kids/battery.png" },
  { word: "דְּבוֹרָה", en: "Bee", img: "kids/bee.png" },
  { word: "אוֹפַנַּיִם", en: "Bicycle", img: "kids/bicycle.png" },
  { word: "לֶחֶם", en: "Bread", img: "kids/bread.png" },
  { word: "פַּרְפַּר", en: "Butterfly", img: "kids/butterfly.png" },
  { word: "מַחְשֵׁבוֹן", en: "Calculator", img: "kids/calculator.png" },
  { word: "גָּמָל", en: "Camel", img: "kids/camel.png" },
  { word: "מְכוֹנִית", en: "Car", img: "kids/car.png" },
  { word: "חָתוּל", en: "Cat", img: "kids/cat.png" },
  { word: "תַּרְנְגוֹלֶת", en: "Chicken", img: "kids/chicken.png" },
  { word: "עָנָן", en: "Cloud", img: "kids/cloud.png" },
  { word: "תִּירָס", en: "Corn", img: "kids/corn.png" },
  { word: "פָּרָה", en: "Cow", img: "kids/cow.png" },
  { word: "סַרְטָן", en: "Crab", img: "kids/crab.png" },
  { word: "מְלָפְפוֹן", en: "Cucumber", img: "kids/cucumber.png" },
  { word: "כּוֹס", en: "Cup", img: "kids/cup.png" },
  { word: "כֶּלֶב", en: "Dog", img: "kids/dog.png" },
  { word: "דֶּלֶת", en: "Door", img: "kids/door.png" },
  { word: "מַקְדֵּחָה", en: "Drill", img: "kids/drill.png" },
  { word: "בּרווז", en: "Duck", img: "kids/duck.png" },
  { word: "פִּיל", en: "Elephant", img: "kids/elephant.png" },
  { word: "כַּבַּאי", en: "Firefighter", img: "kids/firefighter.png" },
  { word: "פֶּרַח", en: "Flower", img: "kids/flower.png" },
  { word: "מְקָרֵר", en: "Fridge", img: "kids/fridge.png" },
  { word: "צְפַרְדֵּעַ", en: "Frog", img: "kids/frog.png" },
  { word: "גִּ'ירָפָה", en: "Giraffe", img: "kids/giraffe.png" },
  { word: "עֲנָבִים", en: "Grapes", img: "kids/grapes.png" },
  { word: "דֶּשֶׁא", en: "Grass", img: "kids/grass.png" },
  { word: "יָד", en: "Hand", img: "kids/hand.png" },
  { word: "כּוֹבַע", en: "Hat", img: "kids/hat.png" },
  { word: "אוֹזְנִיּוֹת", en: "Headphones", img: "kids/headphones.png" },
  { word: "הֶלִיקוֹפְּטֶר", en: "Helicopter", img: "kids/helicopter.png" },
  { word: "הִיפּוֹפּוֹטָם", en: "Hippopotamus", img: "kids/hippopotamus.png" },
  { word: "סוּס", en: "Horse", img: "kids/horse.png" },
  { word: "סֻלָּם", en: "Ladder", img: "kids/ladder.png" },
  { word: "עָלֶה", en: "Leaf", img: "kids/leaf.png" },
  { word: "אַרְיֵה", en: "Lion", img: "kids/lion.png" },
  { word: "מַדַּלְיָה", en: "Medal", img: "kids/medal.png" },
  { word: "חָלָב", en: "Milk", img: "kids/milk.png" },
  { word: "קוֹף", en: "Monkey", img: "kids/monkey.png" },
  { word: "יָרֵחַ", en: "Moon", img: "kids/moon.png" },
  { word: "פִּטְרִיָּה", en: "Mushroom", img: "kids/mushroom.png" },
  { word: "תַּפּוּז", en: "Orange", img: "kids/orange.png" },
  { word: "יַנְשׁוּף", en: "Owl", img: "kids/owl.png" },
  { word: "אַגָּס", en: "Pear", img: "kids/pear.png" },
  { word: "עֵט", en: "Pen", img: "kids/pen.png" },
  { word: "פִּלְפֵּל", en: "Pepper", img: "kids/pepper.png" },
  { word: "אֲנָנָס", en: "Pineapple", img: "kids/pineapple.png" },
  { word: "פִּיצָה", en: "Pizza", img: "kids/pizza.png" },
  { word: "אַרְנָב", en: "Rabbit", img: "kids/rabbit.png" },
  { word: "קוֹרְקִינֶט", en: "Scooter", img: "kids/scooter.png" },
  { word: "כֶּבֶשׂ", en: "Sheep", img: "kids/sheep.png" },
  { word: "נַעֲלַיִם", en: "Shoes", img: "kids/shoes.png" },
  { word: "חִלָּזוֹן", en: "Snail", img: "kids/snail.png" },
  { word: "נָחָשׁ", en: "Snake", img: "kids/snake.png" },
  { word: "כַּדּוּרֶגֶל", en: "Soccer", img: "kids/soccer.png" },
  { word: "אוֹהֶל", en: "Tent", img: "kids/tent.png" },
  { word: "עַגְבָנִיָּה", en: "Tomato", img: "kids/tomato.png" },
  { word: "טְרַקְטוֹר", en: "Tractor", img: "kids/tractor.png" },
  { word: "רַכֶּבֶת", en: "Train", img: "kids/train.png" },
  { word: "עֵץ", en: "Tree", img: "kids/tree.png" },
  { word: "מַשָּׂאִית", en: "Truck", img: "kids/truck.png" },
  { word: "צָב", en: "Turtle", img: "kids/turtle.png" },
  { word: "שׁוֹאֵב אָבָק", en: "Vacuum Cleaner", img: "kids/vacuum_cleaner.png" },
  { word: "זֶבְּרָה", en: "Zebra", img: "kids/zebra.png" }
];

const JUNIOR_WORDS = [
  { word: "מַזְגָן", en: "Air Conditioner", img: "junior/air_conditioner.png" },
  { word: "אַסְטְרוֹנָאוּט", en: "Astronaut", img: "junior/astronaut.png" },
  { word: "כַּדּוּרֶסֶל", en: "Basketball", img: "junior/basketball.png" },
  { word: "סוֹלְלָה", en: "Battery", img: "junior/battery.png" },
  { word: "אוֹפַנַּיִם", en: "Bicycle", img: "junior/bicycle.png" },
  { word: "לוּחַ", en: "Board", img: "junior/board.png" },
  { word: "סִיר", en: "Boat", img: "junior/boat.png" },
  { word: "גֶּשֶׁר", en: "Bridge", img: "junior/bridge.png" },
  { word: "כֶּבֶל", en: "Cable", img: "junior/cable.png" },
  { word: "מַחְשֵׁבוֹן", en: "Calculator", img: "junior/calculator.png" },
  { word: "מַצְלֵמָה", en: "Camera", img: "junior/camera.png" },
  { word: "מַצְפֵּן", en: "Compass", img: "junior/compass.png" },
  { word: "מִדְבָּר", en: "Desert", img: "junior/desert.png" },
  { word: "צוללן", en: "Diver", img: "junior/diver.png" },
  { word: "מַקְדֵּחָה", en: "Drill", img: "junior/drill.png" },
  { word: "כַּבַּאי", en: "Firefighter", img: "junior/firefighter.png" },
  { word: "יַעַר", en: "Forest", img: "junior/forest.png" },
  { word: "מְקָרֵר", en: "Fridge", img: "junior/fridge.png" },
  { word: "גּלוֹבּוּס", en: "Globe", img: "junior/globe.png" },
  { word: "פַּטִּישׁ", en: "Hammer", img: "junior/hammer.png" },
  { word: "יָד", en: "Hand", img: "junior/hand.png" },
  { word: "אוֹזְנִיּוֹת", en: "Headphones", img: "junior/headphones.png" },
  { word: "הֶלִיקוֹפְּטֶר", en: "Helicopter", img: "junior/helicopter.png" },
  { word: "מַרְקֶר", en: "Highlighter", img: "junior/highlighter.png" },
  { word: "מַגְהֵץ", en: "Iron", img: "junior/iron.png" },
  { word: "מָטוֹס סִילוֹן", en: "Jet", img: "junior/jet.png" },
  { word: "קַמְקוּם חַשְׁמַלִּי", en: "Kettle", img: "junior/kettle.png" },
  { word: "מַקְלֶדֶת", en: "Keyboard", img: "junior/keyboard.png" },
  { word: "סֻלָּם", en: "Ladder", img: "junior/ladder.png" },
  { word: "נּוּרָה", en: "Light Bulb", img: "junior/light_bulb.png" },
  { word: "מַדַּלְיָה", en: "Medal", img: "junior/medal.png" },
  { word: "עֶפְרוֹנוֹת", en: "Pencils", img: "junior/pencils.png" },
  { word: "מַדְפֶּסֶת", en: "Printer", img: "junior/printer.png" },
  { word: "גַּלְגִּלַּיִם", en: "Rollerblades", img: "junior/rollerblades.png" },
  { word: "קוֹרְקִינֶט", en: "Scooter", img: "junior/scooter.png" },
  { word: "כַּדּוּרֶגֶל", en: "Soccer", img: "junior/soccer.png" },
  { word: "מַהְדֵּק", en: "Stapler", img: "junior/stapler.png" },
  { word: "מִזְוָדָה", en: "Suitcase", img: "junior/suitcase.png" },
  { word: "טֶנִיס", en: "Tennis", img: "junior/tennis.png" },
  { word: "אוֹהֶל", en: "Tent", img: "junior/tent.png" },
  { word: "טוֹסְטֶר", en: "Toaster", img: "junior/toaster.png" },
  { word: "טְרַקְטוֹר", en: "Tractor", img: "junior/tractor.png" },
  { word: "שׁוֹאֵב אָבָק", en: "Vacuum Cleaner", img: "junior/vacuum_cleaner.png" },
  { word: "הַר גַּעַשׁ", en: "Volcano", img: "junior/volcano.png" },
  { word: "אַרְנָק", en: "Wallet", img: "junior/wallet.png" },
  { word: "מַפָּל", en: "Waterfall", img: "junior/waterfall.png" },
  { word: "מַשְׁרוֹקִית", en: "Whistle", img: "junior/whistle.png" }
];

const WORD_DATABASE = {
  KIDS: KIDS_WORDS,
  JUNIOR: JUNIOR_WORDS,
  TEEN: [
    { word: "הַשְׁרָאָה", en: "Inspiration" }, { word: "תַּרְבּוּת", en: "Culture" },
    { word: "טֶכְנוֹלוֹגְיָה", en: "Technology" }
  ],
  ADULT: [
    { word: "אַלְתְּרוּאִיזְם", en: "Altruism" }, { word: "פָּרָדִיגְמָה", en: "Paradigm" }
  ]
};

export default function FamilyAliasApp() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);
  const playersRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const skipRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4 && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 4) {
      setStep(3); 
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, isPaused]);

  if (!mounted) return null;

  const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const generateGameWords = (selectedGroup: keyof typeof WORD_DATABASE) => {
    const order: (keyof typeof WORD_DATABASE)[] = ["KIDS", "JUNIOR", "TEEN", "ADULT"];
    const currentIndex = order.indexOf(selectedGroup);
    let pool = [...WORD_DATABASE[selectedGroup]];
    
    let combined = [];
    if (currentIndex > 0) {
      const lowerGroup = order[currentIndex - 1];
      combined = [...shuffleArray(pool), ...shuffleArray(WORD_DATABASE[lowerGroup])];
    } else {
      combined = shuffleArray(pool);
    }
    // מאגר אינסופי (Loop)
    setGameWords(Array(20).fill(shuffleArray(combined)).flat());
  };

  const resetWordPosition = () => {
    if (wordRef.current) {
      wordRef.current.style.position = 'relative';
      wordRef.current.style.left = 'auto';
      wordRef.current.style.top = 'auto';
      wordRef.current.style.zIndex = '1';
    }
  };

  const handleNextWord = (isSkip = false) => {
    setScore(prev => isSkip ? prev - 1 : prev + 1);
    setCurrentWordIndex(prev => prev + 1);
    isDragging.current = false;
    setActiveHover(null);
    resetWordPosition();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPaused || !gameWords[currentWordIndex]) return;
    isDragging.current = true;
    if (wordRef.current) {
      wordRef.current.style.position = 'fixed';
      wordRef.current.style.zIndex = '1000';
      updatePosition(e.clientX, e.clientY);
    }
  };

  const updatePosition = (x: number, y: number) => {
    if (wordRef.current) {
      wordRef.current.style.left = `${x - 70}px`;
      wordRef.current.style.top = `${y - 50}px`;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX, e.clientY);
    let hovered: string | null = null;
    if (skipRef.current) {
      const r = skipRef.current.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hovered = "SKIP";
    }
    Object.entries(playersRef.current).forEach(([pName, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) hovered = pName;
      }
    });
    setActiveHover(hovered);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    if (activeHover === "SKIP") handleNextWord(true);
    else if (activeHover) handleNextWord(false);
    else {
      isDragging.current = false;
      resetWordPosition();
    }
    setActiveHover(null);
  };

  const players = [name, "אבא", "אמא", "יעל"];
  const currentWord = gameWords[currentWordIndex];
  const timerColor = timeLeft <= 15 ? '#ef4444' : '#ffffff';

  return (
    <div style={containerStyle} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <div style={safeAreaWrapper}>
        
        {step === 1 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={logoSizer}><Logo /></div></div>
            <div style={formCardStyle}>
              <form style={formStyle} onSubmit={(e) => {
                e.preventDefault();
                generateGameWords(parseInt(age) <= 6 ? "KIDS" : parseInt(age) <= 10 ? "JUNIOR" : parseInt(age) <= 16 ? "TEEN" : "ADULT");
                setStep(2);
              }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="שם..." />
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} placeholder="גיל..." />
                <button type="submit" style={goldButtonStyle}>המשך</button>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={flexLayout}>
            <div style={logoFlexBox}><div style={{width:'100px'}}><Logo /></div></div>
            <button onClick={() => { setTimeLeft(60); setScore(0); setCurrentWordIndex(0); setStep(4); }} style={goldButtonStyle}>התחל משחק 🏁</button>
          </div>
        )}

        {step === 3 && (
          <div style={flexLayout}>
            <div style={scoreCircle}>🏆 {score}</div>
            <button onClick={() => setStep(2)} style={goldButtonStyle}>חזרה ללובי</button>
          </div>
        )}

        {step === 4 && (
          <div style={gameLayout}>
            <div style={{...timerDisplay, color: timerColor}}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>

            <div 
              ref={skipRef}
              onClick={() => handleNextWord(true)}
              style={{
                ...skipButtonStyle,
                backgroundColor: activeHover === "SKIP" ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.1)'
              }}
            >
              <span style={{fontSize: '20px'}}>🚫</span>
              <span>דלג (הורדה של נקודה)</span>
            </div>

            <div style={wordCardArea}>
              {currentWord ? (
                <div ref={wordRef} onPointerDown={handlePointerDown} style={wordItemStyle}>
                  <div style={wordInnerCard}>
                    {currentWord.img && <img src={`/words/${currentWord.img}`} alt="" style={wordImgStyle} />}
                    <h1 style={{ color: 'white', fontSize: '24px', margin: '0', pointerEvents: 'none' }}>{currentWord.word}</h1>
                    <p style={{ color: '#ffd700', fontSize: '13px', fontWeight: 'bold', pointerEvents: 'none' }}>{currentWord.en}</p>
                  </div>
                </div>
              ) : (
                <div style={{color:'white'}}>טוען מילים...</div>
              )}
            </div>

            <div style={guessersBox}>
                {players.filter(p => p !== name).map(p => (
                  <div key={p} ref={el => { playersRef.current[p] = el; }}
                    onClick={() => handleNextWord(false)}
                    style={{ 
                      ...guesserButton, 
                      borderColor: activeHover === p ? '#10b981' : 'rgba(255,255,255,0.1)',
                      background: activeHover === p ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.03)'
                    }}
                  >
                      <div style={miniAvatar}>{p[0]}</div>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>{p}</span>
                  </div>
                ))}
            </div>

            <div style={gameFooter}>
              <button onClick={() => setIsPaused(true)} style={modernPauseBtn}>⏸️</button>
              <div style={bottomScore}>🏆 {score}</div>
            </div>

            {isPaused && (
              <div style={pauseOverlay}>
                <button onClick={() => setIsPaused(false)} style={hugePlayBtn}>▶️</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// === Styles ===
const containerStyle: CSSProperties = { display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed', touchAction: 'none' };
const safeAreaWrapper: CSSProperties = { width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 20px' };
const flexLayout: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const logoFlexBox: CSSProperties = { marginBottom: '20px' };
const logoSizer: CSSProperties = { width: '150px' };
const formCardStyle: CSSProperties = { width: '100%', padding: '20px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' };
const formStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'right' };
const goldButtonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)', color: '#05081c', fontWeight: 'bold', fontSize: '18px', border: 'none' };
const gameLayout: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', gap: '8px', paddingBottom: '10px' };
const timerDisplay: CSSProperties = { fontSize: '56px', fontWeight: 'bold', textAlign: 'center', fontFamily: 'monospace' };
const skipButtonStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', borderRadius: '16px', border: '3px solid #ef4444', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const wordCardArea: CSSProperties = { flex: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const wordItemStyle: CSSProperties = { cursor: 'pointer', touchAction: 'none', userSelect: 'none', textAlign: 'center' };
const wordInnerCard: CSSProperties = { backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '140px' };
const wordImgStyle: CSSProperties = { width: '60px', height: '60px', marginBottom: '5px', objectFit: 'contain', pointerEvents: 'none' };
const guessersBox: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const guesserButton: CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '15px', border: '2px solid transparent', cursor: 'pointer' };
const miniAvatar: CSSProperties = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' };
const gameFooter: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', padding: '10px 0' };
const bottomScore: CSSProperties = { color: '#ffd700', fontSize: '28px', fontWeight: 'bold' };
const modernPauseBtn: CSSProperties = { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: '55px', height: '55px', borderRadius: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'24px' };
const pauseOverlay: CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 };
const hugePlayBtn: CSSProperties = { backgroundColor: '#10b981', color: 'white', border: 'none', width: '140px', height: '140px', borderRadius: '50%', fontSize: '64px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const scoreCircle: CSSProperties = { fontSize: '48px', color: '#ffd700', border: '3px solid #ffd700', width: '130px', height: '130px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' };