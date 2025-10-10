from sentence_transformers import SentenceTransformer
import pickle

# 1. Define ENHANCED category tags with keywords and examples
tags = {
    "childhood": """
        Stories about childhood memories, early years, and growing up.
        Keywords: school days, family playtime, innocence, carefree, first friend, scraped knees.
        Example: 'We used to build forts in the living room with blankets and chairs.'
        Example: 'I'll never forget the thrill of learning to ride my bike without training wheels.'
    """,
    "wedding": """
        Stories about weddings, marriage ceremonies, and lifelong commitments.
        Keywords: bride, groom, vows, rings, altar, reception, honeymoon, anniversary, tying the knot, walking down the aisle.
        Example: 'My parents' wedding photo is my most cherished possession.'
        Example: 'He proposed during a surprise trip to Paris.'
    """,
    "migration": """
        Experiences of moving to a new home, city, or country.
        Keywords: adapting, new culture, fresh start, immigration, relocating, settling in.
        Example: 'Leaving my hometown was difficult, but it led to incredible opportunities.'
    """,
    "tradition": """
        Cultural and family rituals, generational customs, and ancestral heritage.
        Keywords: rituals, customs, religious ceremonies, values, holidays, family recipes.
        Example: 'Every year, our family gathers to make tamales for Christmas.'
    """,
    "celebration": """
        Festivals, birthdays, parties, cultural events, and shared happiness.
        Keywords: joy, laughter, family gatherings, party, anniversary, festival.
        Example: 'The whole neighborhood came out for the annual summer block party.'
    """,
    "milestone": """
        Significant life events, major achievements, and personal turning points.
        Keywords: graduation, first job, promotion, retirement, new home, first car, becoming a parent.
        Example: 'I felt so proud the day I graduated from university.'
        Example: 'Buying my first house was a huge milestone for me.'
    """,
    "travel": """
        Journeys, adventures, vacations, and discovering new places.
        Keywords: family trips, road trip, vacation, exploration, sightseeing, airport, passport, souvenir.
        Example: 'Our family drove across the country in an old station wagon one summer.'
        Example: 'Seeing the Grand Canyon for the first time left me speechless.'
    """,
    "family bond": """
        Stories about the connections and relationships within a family.
        Keywords: love, support, siblings, parents, togetherness, unity, challenges, understanding.
        Example: 'My brother and I didn't always get along, but he was there for me when it mattered most.'
    """,
    "loss and grief": """
        Experiences of losing a loved one, remembrance, and the process of healing.
        Keywords: mourning, bereavement, sadness, memory, coping, saying goodbye, emotional pain.
        Example: 'It took a long time to come to terms with my grandfather's passing.'
    """,
    "education": """
        Memories from school, college, or learning a new skill.
        Keywords: teachers, learning, study, exams, university, classmates, homework, discovery.
        Example: 'My favorite teacher, Mrs. Davis, is the reason I became a writer.'
    """,
    "career": """
        Professional life, workplace experiences, ambitions, and achievements.
        Keywords: job, work, colleagues, success, failure, lessons learned, interview.
        Example: 'My first job taught me the importance of hard work and perseverance.'
    """,
    "health and wellness": """
        Stories about physical or mental health, challenges, and recovery.
        Keywords: illness, healing, fitness, wellbeing, hospital, doctor, mental health, resilience.
        Example: 'Running the marathon was the culmination of a year-long health journey.'
    """,
    "friendship": """
        Stories about friends, camaraderie, and the bonds of companionship.
        Keywords: best friend, loyalty, laughter, support system, shared secrets, making memories.
        Example: 'We stayed up all night talking and laughing, just like we did in college.'
    """,
    "romance": """
        Tales of love, dating, relationships, and partnership.
        Keywords: first date, love, heartbreak, partner, soulmate, proposal, relationship.
        Example: 'We met by chance in a coffee shop and have been inseparable ever since.'
    """,
    "pets": """
        Heartwarming or funny stories about animal companions.
        Keywords: dog, cat, animal, furry friend, unconditional love, rescue, companionship.
        Example: 'My dog, Buddy, was the most loyal friend I ever had.'
    """,
    "sports": """
        Experiences related to athletic activities, teams, and competition.
        Keywords: team, victory, defeat, game, practice, coach, competition, championship.
        Example: 'Scoring the winning goal in the final seconds was a feeling I'll never forget.'
    """,
    "music": """
        Stories involving songs, instruments, concerts, or the love of music.
        Keywords: concert, song, band, instrument, performance, melody, lyrics, dancing.
        Example: 'That one song always takes me back to the summer of my senior year.'
    """,
    "food and recipe": """
        Memories centered around cooking, eating, or a special family dish.
        Keywords: cooking, baking, family recipe, meal, taste, kitchen, secret ingredient.
        Example: 'Grandma's apple pie recipe has been passed down through generations.'
    """,
    "nature": """
        Experiences in the great outdoors and connections with the natural world.
        Keywords: hiking, camping, mountains, ocean, forest, wildlife, stargazing, scenery.
        Example: 'Sitting by the lake at sunrise, I felt a profound sense of peace.'
    """,
    "hobbies and crafts": """
        Stories about personal interests, creativity, and pastimes.
        Keywords: passion, creativity, making, painting, writing, gardening, collecting, DIY project.
        Example: 'I spent countless hours in the garage, carefully building that model ship.'
    """,
    "overcoming adversity": """
        Tales of facing challenges, showing resilience, and personal strength.
        Keywords: struggle, resilience, perseverance, strength, challenge, obstacle, triumph.
        Example: 'Despite failing twice, I was determined to pass the exam, and finally, I did.'
    """,
    "advice and wisdom": """
        Life lessons, guidance received from others, or personal reflections.
        Keywords: lesson learned, wisdom, guidance, mentor, reflection, moral of the story.
        Example: 'My father always told me to measure twice and cut once, a lesson that applies to more than just carpentry.'
    """,
    "war and conflict": """
        Experiences related to military service, conflict, and its impact.
        Keywords: soldier, veteran, bravery, survival, peace, sacrifice, historical event.
        Example: 'He rarely spoke of his time in the war, but his medals told a story of courage.'
    """,
    "humor and jokes": """
        Funny anecdotes, pranks, and lighthearted moments.
        Keywords: funny, hilarious, prank, joke, laughter, silly, embarrassing moment.
        Example: 'That time we tried to bake a cake without a recipe was a complete, hilarious disaster.'
    """,
    "spiritual journey": """
        Stories of faith, belief, self-discovery, and personal philosophy.
        Keywords: faith, belief, discovery, meditation, religion, purpose, enlightenment.
        Example: 'Traveling through the mountains was as much a spiritual journey as a physical one.'
    """,
    "financial story": """
        Experiences related to money, hardship, success, or business.
        Keywords: budget, savings, debt, investment, first paycheck, business, entrepreneurship.
        Example: 'Saving up for that first car taught me the real value of a dollar.'
    """,
    "volunteering and community": """
        Stories about giving back, community service, and helping others.
        Keywords: helping, charity, community, service, giving back, making a difference.
        Example: 'Working at the local soup kitchen was a humbling and rewarding experience.'
    """,
    "home and neighborhood": """
        Memories tied to a specific house, street, or community.
        Keywords: hometown, neighbor, backyard, front porch, sense of place, community spirit.
        Example: 'We knew everyone on our street, and summer evenings were spent on front porches.'
    """,
    "accident and recovery": """
        Stories about unexpected incidents, injuries, and the path to healing.
        Keywords: injury, recovery, healing, close call, emergency, resilience, getting back up.
        Example: 'Breaking my leg was tough, but the recovery process taught me a lot about patience.'
    """,
    "first time experience": """
        Memories of doing something for the very first time.
        Keywords: first kiss, first flight, driving a car, first love, new experience, novelty.
        Example: 'I'll never forget the mix of fear and excitement I felt during my first time on a plane.'
    """,

    "dreams and aspirations": """
        Stories about ambitions, goals, and dreams for the future.
        Keywords: ambition, dream, goal, hope, future, planning, aspiration, life plan.
        Example: 'As a child, I dreamed of becoming an astronaut and exploring the stars.'
    """,
    "regret and reflection": """
        Looking back on past decisions, mistakes, and what could have been.
        Keywords: if only, looking back, mistake, lesson, hindsight, past self, reflection.
        Example: 'I often reflect on that decision and wonder how things might have been different.'
    """,
    "secrets and surprises": """
        Tales of hidden truths, surprise parties, unexpected news, or revelations.
        Keywords: secret, surprise, revelation, unexpected, confession, hidden, shock.
        Example: 'The surprise party was a complete success; he had absolutely no idea.'
    """,
    "protest and activism": """
        Experiences related to standing up for a cause, social change, or activism.
        Keywords: march, rally, social justice, cause, belief, making a stand, activism.
        Example: 'Participating in that march was the first time I felt my voice truly mattered.'
    """,
    "technology and change": """
        Stories about how technology has evolved and impacted life over time.
        Keywords: innovation, internet, first computer, smartphone, social media, progress, nostalgia.
        Example: 'I remember when we got our first personal computer; it felt like the future had arrived.'
    """
}


# 2. Load a more powerful model
print("Loading sentence transformer model ('all-mpnet-base-v2')...")
model = SentenceTransformer("all-mpnet-base-v2")


# 3. Encode tag descriptions
print("Encoding tag embeddings...")
tag_texts = list(tags.values())
tag_names = list(tags.keys())
# The normalize_embeddings=True flag prepares the vectors for efficient cosine similarity
tag_embeddings = model.encode(tag_texts, show_progress_bar=True, normalize_embeddings=True)


# 4. Save to pkl file
model_data = {
    "tags": tag_names,
    "embeddings": tag_embeddings
}

with open("family_tag_model.pkl", "wb") as f:
    pickle.dump(model_data, f)

print("✅ Model data saved successfully as 'family_tag_model.pkl'")