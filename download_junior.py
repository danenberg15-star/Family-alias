import os
import requests
import time

# --- הגדרות ---
API_KEY = '55198187-ed108d21348c5cd70a52ac7cc' 
OUTPUT_DIR = "public/words/junior"
IMAGE_STYLE = "photo" 

# רשימה מורחבת מאוד (מכוונת ל-250 מילים)
words_map = {
    # טכנולוגיה (1-40)
    "laptop": "laptop computer", "keyboard": "computer keyboard", "mouse": "computer mouse",
    "screen": "monitor screen", "printer": "office printer", "speaker": "audio speaker",
    "camera": "digital camera", "microphone": "microphone", "tablet": "tablet computer",
    "headphones": "headphones", "charger": "phone charger", "flashlight": "flashlight",
    "fridge": "refrigerator", "freezer": "freezer", "dishwasher": "dishwasher",
    "microwave": "microwave oven", "toaster": "toaster", "kettle": "electric kettle",
    "fan": "electric fan", "air_conditioner": "air conditioner", "washing_machine": "washing machine",
    "dryer": "clothes dryer", "iron": "clothes iron", "vacuum_cleaner": "vacuum cleaner",
    "drill": "power drill", "screwdriver": "screwdriver", "battery": "aa battery",
    "light_bulb": "light bulb", "switch": "light switch", "socket": "electric socket",
    "cable": "usb cable", "robot": "humanoid robot", "modem": "internet router",
    "remote_control": "tv remote", "usb_drive": "usb flash drive", "projector": "video projector",

    # בית ספר (41-90)
    "backpack": "school backpack", "pencil_case": "pencil case", "notebook": "notebook",
    "textbook": "school book", "calculator": "calculator", "ruler": "ruler",
    "sharpener": "pencil sharpener", "eraser": "eraser", "highlighter": "marker pen",
    "scissors": "scissors", "stapler": "stapler", "hole_puncher": "hole punch",
    "glue_stick": "glue stick", "board": "classroom board", "chalk": "chalk",
    "library": "library shelves", "laboratory": "science lab", "test": "exam paper",
    "homework": "studying", "recess": "playground", "principal": "school principal",
    "certificate": "diploma", "desk": "school desk", "globe": "world globe",
    "microscope": "microscope", "telescope": "telescope", "map": "world map",
    "dictionary": "dictionary book", "compass": "geometry compass", "paint_brush": "paint brush",

    # ספורט (91-140)
    "basketball": "basketball ball", "soccer": "soccer ball", "volleyball": "volleyball",
    "tennis": "tennis ball", "racket": "tennis racket", "net": "sports net",
    "goal": "soccer goal", "whistle": "referee whistle", "helmet": "safety helmet",
    "rollerblades": "roller skates", "skateboard": "skateboard", "scooter": "kick scooter",
    "bicycle": "bicycle", "swimming_pool": "swimming pool", "goggles": "swimming goggles",
    "medal": "gold medal", "trophy": "winning trophy", "tent": "camping tent",
    "sleeping_bag": "sleeping bag", "running_shoes": "running sneakers", "dumbbell": "dumbbell",
    "yoga_mat": "yoga mat", "surfboard": "surfboard", "skis": "snow skis",
    "baseball_bat": "baseball bat", "golf_club": "golf club", "stadium": "sports stadium",

    # מקצועות (141-180)
    "doctor": "medical doctor", "nurse": "nurse", "police_officer": "police officer",
    "firefighter": "firefighter", "pilot": "airplane pilot", "astronaut": "astronaut",
    "chef": "chef cooking", "waiter": "waiter", "scientist": "scientist", "vet": "veterinarian",
    "dentist": "dentist", "architect": "architect", "carpenter": "carpenter",
    "plumber": "plumber", "artist": "artist painting", "musician": "musician playing",
    "farmer": "farmer", "soldier": "soldier", "mechanic": "car mechanic",

    # טבע ונוף (181-220)
    "desert": "desert dunes", "forest": "forest trees", "ocean": "ocean waves",
    "island": "tropical island", "volcano": "volcano", "waterfall": "waterfall",
    "cave": "dark cave", "diamond": "diamond gemstone", "mountain": "snowy mountain",
    "river": "river water", "lake": "blue lake", "jungle": "green jungle",
    "canyon": "grand canyon", "glacier": "ice glacier", "rainbow": "rainbow sky",
    "lightning": "lightning strike", "planet": "planet mars", "galaxy": "galaxy stars",

    # חפצים וכללי (221-250)
    "umbrella": "umbrella", "sunglasses": "sunglasses", "suitcase": "travel suitcase",
    "wallet": "leather wallet", "compass": "navigation compass", "envelope": "mail envelope",
    "stamp": "postage stamp", "money": "money bills", "ladder": "step ladder",
    "hammer": "hammer", "nail": "iron nail", "bridge": "suspension bridge",
    "clock": "wall clock", "watch": "wrist watch", "mirror": "wall mirror",
    "comb": "hair comb", "toothbrush": "toothbrush", "toothpaste": "toothpaste",
    "soap": "soap bar", "shampoo": "shampoo bottle", "towel": "bath towel",
    "pajamas": "pajamas", "elevator": "elevator door", "stairs": "stairs",
    "traffic_light": "traffic light", "bridge": "bridge", "tunnel": "road tunnel"
}

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

counter = 0
for en, query in words_map.items():
    file_path = os.path.join(OUTPUT_DIR, f"{en}.png")
    if os.path.exists(file_path):
        continue

    if counter > 0 and counter % 90 == 0:
        print("⏳ הגענו למכסה. מחכים 65 שניות...")
        time.sleep(65)

    print(f"🔎 Downloading ({counter+1}/{len(words_map)}): {en}...")
    url = f"https://pixabay.com/api/?key={API_KEY}&q={query}&image_type={IMAGE_STYLE}&safesearch=true&per_page=3"
    
    try:
        res = requests.get(url).json()
        if res.get('hits'):
            img_url = res['hits'][0]['webformatURL']
            img_data = requests.get(img_url).content
            with open(file_path, 'wb') as f:
                f.write(img_data)
            print(f"✅ Success")
            counter += 1
        else:
            print(f"❌ No results for {en}")
    except Exception as e:
        print(f"⚠️ Error with {en}: {e}")
    
    time.sleep(0.3)

print(f"\n🎉 הסתיים! הורדו {counter} תמונות חדשות.")