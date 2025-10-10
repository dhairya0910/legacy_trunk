from sentence_transformers import SentenceTransformer, util
import numpy as np
import pickle

# -----------------------------
# 1. Load saved tag data
# -----------------------------
try:
    with open("family_tag_model.pkl", "rb") as f:
        data = pickle.load(f)
    tags = data["tags"]
    tag_embeddings = data["embeddings"]
except FileNotFoundError:
    print("Error: 'family_tag_model.pkl' not found.")
    print("Please run 'prepare_model.py' first to create the model file.")
    exit()

# -----------------------------
# 2. Load the same model used for preparation
# -----------------------------
print("Loading sentence transformer model ('all-mpnet-base-v2')...")
model = SentenceTransformer("all-mpnet-base-v2")

# -----------------------------
# 3. Define the prediction function
# -----------------------------
# Changed the default top_k value from 3 to 5
def predict_tags(story, model, tags, tag_embeddings, top_k=5):
    """
    Given a story text, returns the top_k most relevant tags with their similarity scores.
    """
    story_emb = model.encode(story, normalize_embeddings=True)
    cos_scores = util.cos_sim(story_emb, tag_embeddings)[0]
    top_results = cos_scores.topk(top_k)
    return [(tags[idx], float(score)) for score, idx in zip(top_results.values, top_results.indices)]

# -----------------------------
# 4. Example usage
# -----------------------------
if __name__ == "__main__":
    story1 = "I was literally shocked to see her nacked"
    story2 = "I was sitting at the bank of river with her"
    story3 = "After I finished my degree, I packed my bags and moved to a new city for my first real job. It was a huge step."

    print("-" * 50)
    # Changed top_k from 3 to 5
    results1 = predict_tags(story1, model, tags, tag_embeddings, top_k=5)
    print("\nStory:", story1)
    print("\nTop 5 Predicted Tags:")
    for tag, score in results1:
        print(f"- {tag} (Score: {score:.4f})")
    
    print("-" * 50)
    # Changed top_k from 3 to 5
    results2 = predict_tags(story2, model, tags, tag_embeddings, top_k=5)
    print("\nStory:", story2)
    print("\nTop 5 Predicted Tags:")
    for tag, score in results2:
        print(f"- {tag} (Score: {score:.4f})")

    print("-" * 50)
    # Changed top_k from 3 to 5
    results3 = predict_tags(story3, model, tags, tag_embeddings, top_k=5)
    print("\nStory:", story3)
    print("\nTop 5 Predicted Tags:")
    for tag, score in results3:
        print(f"- {tag} (Score: {score:.4f})")
    print("-" * 50)