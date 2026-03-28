import os
import requests
import time
from PIL import Image
from io import BytesIO

# --- הגדרות ---
API_KEY = '55198187-ed108d21348c5cd70a52ac7cc' 
# הנתיב המדויק שביקשת
OUTPUT_DIR = r"C:\Users\danen\Documents\GitHub\ALIAS\family-alias\public\words\junior\TO CHECK"
IMAGE_STYLE = "photo" 
TARGET_SIZE = (800, 800)
QUALITY = 75

# 250 מושגים חדשים (Batch #2 - מותאם לגילאי 6-10)
words_map = {
    # חלל ומדע
    "mercury": "planet mercury", "venus": "planet venus", "mars": "planet mars", "jupiter": "planet jupiter",
    "saturn": "planet saturn", "uranus": "planet uranus", "neptune": "planet neptune", "comet": "comet space",
    "asteroid": "asteroid space", "galaxy": "galaxy nebula", "black_hole": "black hole space", "meteor": "meteor shower",
    "astronaut_helmet": "astronaut helmet", "lunar_rover": "moon rover", "observatory": "space observatory",
    "microscope": "microscope", "telescope": "telescope", "magnifying_glass": "magnifying glass", "test_tube": "test tube",
    "magnet": "horseshoe magnet", "battery": "electric battery", "prism": "glass prism", "dna": "dna double helix",
    
    # טבע וגיאוגרפיה
    "desert": "sand desert", "jungle": "tropical jungle", "swamp": "swamp", "cave": "dark cave",
    "mountain_peak": "mountain peak", "valley": "green valley", "canyon": "canyon rock", "glacier": "glacier ice",
    "coral_reef": "coral reef underwater", "earthquake": "cracked ground", "tsunami": "giant wave", "lightning": "lightning bolt",
    "rainbow": "rainbow sky", "snowflake": "snowflake macro", "dew": "dew drops", "moss": "green moss",
    "fern": "fern leaf", "cactus": "cactus plant", "pine_tree": "pine tree", "palm_tree": "palm tree",
    "sunflower": "sunflower", "tulip": "tulip flower", "mushroom": "wild mushroom", "forest_path": "forest path",
    
    # חיות אקזוטיות
    "axolotl": "axolotl", "capybara": "capybara", "chameleon": "chameleon", "cheetah": "cheetah running",
    "chimpanzee": "chimpanzee", "cobra": "cobra snake", "hummingbird": "hummingbird", "iguana": "iguana",
    "jellyfish": "jellyfish", "lemur": "lemur", "meerkat": "meerkat", "narwhal": "narwhal",
    "ostrich": "ostrich", "otter": "sea otter", "platypus": "platypus", "pufferfish": "pufferfish",
    "scorpion": "scorpion", "sloth": "sloth", "toucan": "toucan bird", "walrus": "walrus",
    "yak": "yak animal", "pelican": "pelican", "woodpecker": "woodpecker",
    
    # ספורט ותחביבים
    "archery": "archery bow", "bowling": "bowling ball", "chess": "chess pieces", "darts": "dart board",
    "fencing": "fencing sport", "golf": "golf ball", "gymnastics": "gymnastics", "karate": "karate",
    "kayak": "kayaking", "origami": "origami paper", "painting": "painting palette", "pottery": "pottery wheel",
    "sailing": "sailing boat", "skating": "ice skating", "skiing": "skiing", "snorkeling": "snorkeling",
    "surfing": "surfing wave", "yoga": "yoga pose", "ballet": "ballet shoes", "skateboarding": "skateboard",
    
    # כלי עבודה והמצאות
    "binoculars": "binoculars", "compass_tool": "navigation compass", "wrench": "adjustable wrench",
    "screwdriver": "screwdriver", "pliers": "pliers tool", "saw": "hand saw", "ax": "wood ax",
    "calculator": "digital calculator", "laptop": "laptop computer", "tablet": "tablet computer",
    "headphones": "music headphones", "microphone": "microphone", "speaker": "audio speaker",
    "robot": "toy robot", "drone": "flying drone", "joystick": "game controller",
    
    # חפצים מורכבים ויומיום
    "backpack": "school backpack", "canteen": "water canteen", "flashlight": "flashlight",
    "sleeping_bag": "sleeping bag", "first_aid": "first aid kit", "map": "folded map",
    "whistle": "referee whistle", "medal": "gold medal", "trophy": "sports trophy",
    "tent": "camping tent", "campfire": "burning campfire", "compass": "compass tool"
}

# יצירת התיקייה אם היא לא קיימת
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

counter = 0
for en, query in words_map.items():
    file_path = os.path.join(OUTPUT_DIR, f"{en}.png")
    
    if os.path.exists(file_path):
        continue

    # חוק ההשהיה (כל 90 הורדות מחכים דקה)
    if counter > 0 and counter % 90 == 0:
        print(f"⏳ הגענו ל-{counter} הורדות. מחכים 65 שניות...")
        time.sleep(65)

    print(f"🔎 Downloading ({counter+1}/{len(words_map)}): {en}...")
    url = f"https://pixabay.com/api/?key={API_KEY}&q={query}&image_type={IMAGE_STYLE}&safesearch=true&per_page=3"
    
    try:
        res = requests.get(url).json()
        if res.get('hits'):
            img_url = res['hits'][0]['webformatURL']
            img_res = requests.get(img_url)
            
            # פתיחת תמונה וכיווץ
            img = Image.open(BytesIO(img_res.content))
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)
            
            # שמירה כ-PNG אופטימלי
            img.save(file_path, "PNG", optimize=True)
            
            print(f"✅ Success: {en}.png")
            counter += 1
        else:
            print(f"❌ No results for {en}")
    except Exception as e:
        print(f"⚠️ Error with {en}: {e}")
    
    time.sleep(0.3)

print(f"\n🎉 הסתיים! כל התמונות מחכות לך לבדיקה בתיקיית TO CHECK.")