import os
import requests
import time
from PIL import Image
from io import BytesIO

# --- הגדרות ---
API_KEY = '55198187-ed108d21348c5cd70a52ac7cc' 
OUTPUT_DIR = r"C:\Users\danen\Documents\GitHub\ALIAS\family-alias\public\words\junior\TO CHECK"
IMAGE_STYLE = "photo" # תמונות אמיתיות בלבד
TARGET_SIZE = (800, 800)
MAX_FILE_SIZE_KB = 50 # יעד הכיווץ שביקשת

# רשימת המילים מהקובץ JUNIOR_EXTENDED (חלק מה-500)
# הסקריפט ירוץ על השמות באנגלית לחיפוש ב-Pixabay
junior_extended_list = [
    "Wolf", "Tiger", "Shark", "Octopus", "Bee", "Owl", "Penguin", "Seal", "Hippopotamus", "Polar Bear",
    "Woodpecker", "Eagle", "Spider", "Crab", "Lobster", "Seahorse", "Squid", "Mongoose", "Ferret", "Beaver",
    "Mole", "Moose", "Zebra", "Giraffe", "Elephant", "Rhinoceros", "Cheetah", "Hyena", "Buffalo", "Llama",
    "Alpaca", "Deer", "Gazelle", "Caracal", "Sloth", "Armadillo", "Anteater", "Platypus", "Sea Urchin", "Coral",
    "Swordfish", "Manta Ray", "Eel", "Hamburger", "French Fries", "Pasta", "Soup", "Salad", "Sandwich",
    "Omelette", "Rice", "Steak", "Roast Chicken", "Taco", "Sushi", "Noodles", "Burrito", "Hot Dog", "Pancake",
    "Waffle", "Croissant", "Bagel", "Muffin", "Chocolate Chip Cookie", "Birthday Cake", "Ice Cream Cone",
    "Popsicle", "Milkshake", "Orange Juice", "Hot Chocolate", "Lemonade", "Tea", "Cereal", "Yogurt", "Honey",
    "Jam", "Peanut Butter", "Popcorn", "Pretzel", "Strawberry", "Watermelon", "Grapes", "Cherry", "Peach",
    "Pear", "Kiwi", "Mango", "Pineapple", "Mountain", "River", "Lake", "Waterfall", "Island", "Cave",
    "Volcano", "Canyon", "Glacier", "Rainforest", "Swamp", "Sunset", "Sunrise", "Rainbow", "Lightning",
    "Thunder", "Tornado", "Earthquake", "Planet", "Moon", "Sun", "Galaxy", "Asteroid", "Meteor", "Comet",
    "Black Hole", "Telescope", "Satellite", "Space Shuttle", "Alien", "Crater", "Pillow", "Blanket",
    "Mattress", "Wardrobe", "Drawer", "Shelf", "Mirror", "Carpet", "Curtain", "Night Lamp", "Alarm Clock",
    "Hanger", "Hairbrush", "Comb", "Towel", "Soap", "Shampoo", "Toothpaste", "Toothbrush", "Toilet",
    "Bathtub", "Shower", "Faucet", "Sink", "Laundry Basket", "Washing Machine", "Clothes Dryer", "Broom",
    "Dustpan", "Squeegee", "Bucket", "Vacuum Cleaner", "Trash Can", "Shirt", "Pants", "Dress", "Skirt",
    "Jacket", "Coat", "Sweater", "Hoodie", "Pyjamas", "Swimsuit", "Socks", "Sneakers", "Sandals", "Flip-flops",
    "Beanie", "Baseball Cap", "Scarf", "Gloves", "Belt", "Tie", "Glasses", "Sunglasses", "Wristwatch",
    "Backpack", "Wallet", "Umbrella", "Teacher", "Doctor", "Nurse", "Dentist", "Veterinarian", "Police Officer",
    "Firefighter", "Pilot", "Flight Attendant", "Chef", "Baker", "Waiter", "Farmer", "Fisherman", "Builder",
    "Carpenter", "Electrician", "Plumber", "Mechanic", "Painter", "Sculptor", "Photographer", "Musician",
    "Singer", "Dancer", "Actor", "Author", "Journalist", "Scientist", "Engineer", "Programmer", "Astronaut",
    "Athlete", "Soccer", "Basketball", "Tennis", "Baseball", "Volleyball", "American Football", "Hockey",
    "Golf", "Swimming", "Running", "Long Jump", "Horseback Riding", "Cycling", "Surfing", "Skateboarding",
    "Roller Skating", "Skiing", "Snowboarding", "Karate", "Judo", "Boxing", "Fencing", "Archery", "Yoga",
    "Ballet", "Playing Piano", "Drawing", "Pottery", "Reading", "Writing", "Stamp Collecting", "Gardening",
    "Cooking", "Baking", "Photography", "Camping", "Fishing", "Mountain Climbing", "House", "Apartment Building",
    "Skyscraper", "School", "Library", "Hospital", "Police Station", "Fire Station", "Post Office", "Bank",
    "Supermarket", "Shopping Mall", "Restaurant", "Cafe", "Movie Theater", "Museum", "Art Gallery", "Zoo",
    "Aquarium", "Amusement Park", "Circus", "Stadium", "Swimming Pool", "Airport", "Train Station", "Harbor",
    "Lighthouse", "Castle", "Palace", "Pyramid", "Temple", "Church", "Mosque", "Synagogue", "Farm", "Barn",
    "Windmill", "Factory", "Car", "Truck", "Bus", "Motorcycle", "Bicycle", "Scooter", "Taxi", "Ambulance",
    "Police Car", "Fire Truck", "Train", "Subway", "Tram", "Airplane", "Helicopter", "Hot Air Balloon",
    "Ship", "Boat", "Yacht", "Submarine", "Ferry", "Tractor", "Bulldozer", "Crane", "Cart", "Sled", "Jeep",
    "Hammer", "Screwdriver", "Pliers", "Wrench", "Saw", "Drill", "Axe", "Shovel", "Rake", "Pruning Shears",
    "Garden Hose", "Lawn Mower", "Ladder", "Flashlight", "Tape Measure", "Compass", "Magnet", "Magnifying Glass",
    "Microscope", "Test Tube", "Scale", "Scissors", "Glue", "Ruler", "Calculator", "Camera", "Laptop",
    "Tablet", "Smartphone", "Headphones", "Dragon", "Unicorn", "Mermaid", "Fairy", "Giant", "Dwarf", "Witch",
    "Wizard", "Ghost", "Monster", "Robot", "Superhero", "Dinosaur", "Mammoth", "Phoenix", "Pegasus", "Piano",
    "Guitar", "Violin", "Drums", "Flute", "Trumpet", "Harp", "Cello", "Saxophone", "Xylophone", "Cymbals",
    "Accordion", "Harmonica", "Synthesizer", "Map", "Globe", "Continent", "Ocean", "Sea", "Jungle",
    "North Pole", "South Pole", "Equator", "Country", "City", "Village", "Capital City", "Happiness",
    "Sadness", "Anger", "Fear", "Surprise", "Love", "Courage", "Friendship", "Peace", "Victory", "Dream",
    "Magic", "Time", "Music", "Art", "Acorn", "Pine Cone", "Seashell", "Feather", "Nest", "Egg", "Seed",
    "Sprout", "Root", "Trunk", "Branch", "Leaf", "Thorn", "Mushroom", "Seaweed", "Icicle", "Snowflake",
    "Snowball", "Puddle", "Mud", "Sand", "Rock", "Pebble", "Dust", "Coin", "Banknote", "Credit Card",
    "Suitcase", "Handbag", "Keys", "Charger", "Remote Control", "Matchstick", "Lighter", "Pin", "Needle",
    "Thread", "Button", "Zipper", "Box", "Tape", "Envelope", "Stamp", "Postcard", "Newspaper", "Magazine",
    "Comic Book", "Diary", "Notebook", "Pencil Case", "Sharpener", "Eraser", "Ink", "Paintbrush", "Palette", "Easel"
]

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def download_and_compress(word):
    query = word.replace(" ", "+")
    url = f"https://pixabay.com/api/?key={API_KEY}&q={query}&image_type={IMAGE_STYLE}&safesearch=true&per_page=3"
    
    try:
        res = requests.get(url).json()
        if res.get('hits'):
            img_url = res['hits'][0]['webformatURL']
            img_res = requests.get(img_url)
            
            img = Image.open(BytesIO(img_res.content))
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            img.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)
            
            # ניקוי שם הקובץ ושמירה כ-webp
            clean_name = word.lower().replace(" ", "_")
            file_path = os.path.join(OUTPUT_DIR, f"{clean_name}.webp")
            
            # מנגנון כיווץ אגרסיבי אם הקובץ מעל 50KB
            quality = 80
            while True:
                img.save(file_path, "WEBP", quality=quality)
                file_size = os.path.getsize(file_path) / 1024 # גודל ב-KB
                
                if file_size <= MAX_FILE_SIZE_KB or quality <= 20:
                    break
                quality -= 10 # הורדת איכות בכל סבב
            
            print(f"✅ {word} -> {file_size:.1f} KB (Quality: {quality})")
            return True
        else:
            print(f"❌ No results for {word}")
            return False
    except Exception as e:
        print(f"⚠️ Error with {word}: {e}")
        return False

# הרצה
print(f"🚀 Starting download of {len(junior_extended_list)} words...")
counter = 0

for word in junior_extended_list:
    success = download_and_compress(word)
    if success:
        counter += 1
    
    # מניעת חסימה מה-API (Pixabay מגביל קריאות לדקה)
    if counter > 0 and counter % 90 == 0:
        print("🕒 Waiting 65s to avoid rate limit...")
        time.sleep(65)
    else:
        time.sleep(0.5)

print(f"\n🎉 Done! Downloaded {counter} images to TO CHECK.")