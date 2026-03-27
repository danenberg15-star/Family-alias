import os
import requests
import time

# --- הגדרות ---
API_KEY = '55198187-ed108d21348c5cd70a52ac7cc' 
OUTPUT_DIR = "public/words/kids"
IMAGE_STYLE = "photo" 

# רשימת 100 מילים מדויקת לקבוצת KIDS (גילאי 3-6)
words_map = {
    # חיות (1-40)
    "dog": "dog", "cat": "cat", "elephant": "elephant", "lion": "lion", 
    "tiger": "tiger", "monkey": "monkey", "giraffe": "giraffe", "zebra": "zebra",
    "cow": "cow", "horse": "horse", "sheep": "sheep", "pig": "pig",
    "chicken": "chicken", "duck": "duck", "bird": "bird", "fish": "goldfish",
    "rabbit": "rabbit", "turtle": "turtle", "frog": "frog", "snake": "snake",
    "butterfly": "butterfly", "bee": "bee", "ant": "ant", "spider": "spider",
    "bear": "teddy bear", "penguin": "penguin", "dolphin": "dolphin", "whale": "whale",
    "shark": "shark", "owl": "owl", "mouse": "mouse animal", "camel": "camel",
    "hippopotamus": "hippo", "kangaroo": "kangaroo", "crocodile": "crocodile",
    "deer": "deer", "squirrel": "squirrel", "crab": "crab", "octopus": "octopus", "snail": "snail",

    # פירות וירקות (41-70)
    "apple": "red apple", "banana": "banana", "orange": "orange fruit", 
    "strawberry": "strawberry", "grapes": "grapes", "watermelon": "watermelon",
    "pineapple": "pineapple", "lemon": "lemon", "carrot": "carrot",
    "tomato": "tomato", "cucumber": "cucumber", "corn": "corn",
    "potato": "potato", "broccoli": "broccoli", "egg": "egg",
    "milk": "milk glass", "bread": "bread", "cheese": "cheese",
    "pear": "pear", "cherry": "cherry", "peach": "peach", "mango": "mango",
    "avocado": "avocado", "onion": "onion", "garlic": "garlic", "pepper": "bell pepper",
    "mushroom": "mushroom", "cookie": "cookie", "ice_cream": "ice cream", "pizza": "pizza slice",

    # חפצים, בית וטבע (71-100)
    "chair": "chair", "table": "table", "bed": "bed", "door": "door",
    "window": "window", "house": "house", "car": "car", "truck": "toy truck",
    "ball": "colorful ball", "doll": "doll", "train": "toy train", "plane": "airplane",
    "bicycle": "kids bicycle", "sun": "sun", "moon": "moon", "star": "star",
    "flower": "flower", "tree": "tree", "grass": "green grass", "rain": "rain",
    "cloud": "cloud", "umbrella": "umbrella", "hat": "hat", "shoes": "shoes",
    "shirt": "shirt", "pants": "pants", "socks": "socks", "spoon": "spoon",
    "fork": "fork", "cup": "cup"
}

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

counter = 0
for en, query in words_map.items():
    file_path = os.path.join(OUTPUT_DIR, f"{en}.png")
    
    if os.path.exists(file_path):
        continue

    # הגבלת Pixabay (מכסה של 100 לדקה)
    if counter > 0 and counter % 90 == 0:
        print("⏳ הגענו ל-90 תמונות. מחכים דקה למניעת חסימה...")
        time.sleep(65)

    print(f"🔎 Downloading ({counter+1}/100): {en}...")
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

print(f"\n🎉 הסתיים! הורדו {counter} תמונות לתיקיית kids.")