from sentence_transformers import SentenceTransformer
import pickle

# 1. Define ENHANCED category tags with keywords and examples
tags = {
    "childhood": "Stories about childhood memories, early years, and growing up.",
    "wedding": "Stories about weddings, marriage ceremonies, and lifelong commitments.",
    "migration": "Experiences of moving to a new home, city, or country.",
    "tradition": "Cultural and family rituals, generational customs, and ancestral heritage.",
    "celebration": "Festivals, birthdays, parties, cultural events, and shared happiness.",
    "milestone": "Significant life events, major achievements, and personal turning points.",
    "travel": "Journeys, adventures, vacations, and discovering new places.",
    "family bond": "Stories about the connections and relationships within a family.",
    "loss and grief": "Experiences of losing a loved one, remembrance, and the process of healing.",
    "education": "Memories from school, college, or learning a new skill.",
    "career": "Professional life, workplace experiences, ambitions, and achievements.",
    "health and wellness": "Stories about physical or mental health, challenges, and recovery.",
    "friendship": "Stories about friends, camaraderie, and the bonds of companionship.",
    "romance": "Tales of love, dating, relationships, and partnership.",
    "pets": "Heartwarming or funny stories about animal companions.",
    "sports": "Experiences related to athletic activities, teams, and competition.",
    "music": "Stories involving songs, instruments, concerts, or the love of music.",
    "food and recipe": "Memories centered around cooking, eating, or a special family dish.",
    "nature": "Experiences in the great outdoors and connections with the natural world.",
    "hobbies and crafts": "Stories about personal interests, creativity, and pastimes.",
    "overcoming adversity": "Tales of facing challenges, showing resilience, and personal strength.",
    "advice and wisdom": "Life lessons, guidance received from others, or personal reflections.",
    "war and conflict": "Experiences related to military service, conflict, and its impact.",
    "humor and jokes": "Funny anecdotes, pranks, and lighthearted moments.",
    "spiritual journey": "Stories of faith, belief, self-discovery, and personal philosophy.",
    "financial story": "Experiences related to money, hardship, success, or business.",
    "volunteering and community": "Stories about giving back, community service, and helping others.",
    "home and neighborhood": "Memories tied to a specific house, street, or community.",
    "accident and recovery": "Stories about unexpected incidents, injuries, and the path to healing.",
    "first time experience": "Memories of doing something for the very first time.",
    "dreams and aspirations": "Stories about ambitions, goals, and dreams for the future.",
    "regret and reflection": "Looking back on past decisions, mistakes, and what could have been.",
    "secrets and surprises": "Tales of hidden truths, surprise parties, unexpected news, or revelations.",
    "protest and activism": "Experiences related to standing up for a cause, social change, or activism.",
    "technology and change": "Stories about how technology has evolved and impacted life over time."
}

# 2. Load MiniLM-L6 model (384-dim)
print("Loading sentence transformer model ('all-MiniLM-L6-v2')...")
model = SentenceTransformer("./all-MiniLM-L6-v2-local")  # Local path to avoid proxy issues

# 3. Encode tag descriptions
print("Encoding tag embeddings...")
tag_texts = list(tags.values())
tag_names = list(tags.keys())

tag_embeddings = model.encode(tag_texts, show_progress_bar=True, normalize_embeddings=True)

# 4. Save to pkl file
model_data = {
    "tags": tag_names,
    "embeddings": tag_embeddings
}

with open("family_tag_model.pkl", "wb") as f:
    pickle.dump(model_data, f)

print("✅ Model data saved successfully as 'family_tag_model.pkl'")
