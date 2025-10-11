from sentence_transformers import SentenceTransformer, util
import numpy as np
import pickle
import torch

# -----------------------------
# 1. Load saved tag data
# -----------------------------
try:
    with open("family_tag_model.pkl", "rb") as f:
        data = pickle.load(f)
    tags = data["tags"]
    tag_embeddings = data["embeddings"]
    # Convert tag embeddings to torch tensor for cosine similarity
    tag_embeddings = torch.tensor(tag_embeddings)
except FileNotFoundError:
    print("Error: 'family_tag_model.pkl' not found.")
    print("Please run 'prepare_model.py' first to create the model file.")
    exit()

# -----------------------------
# 2. Load the same model used for preparation
# -----------------------------
print("Loading sentence transformer model ('all-MiniLM-L6-v2')...")
model = SentenceTransformer("./all-MiniLM-L6-v2-local")  # Local path to avoid proxy issues

# -----------------------------
# 3. Define the prediction function
# -----------------------------
def predict_tags(story, model, tags, tag_embeddings, top_k=5):
    """
    Given a story text, returns the top_k most relevant tags with their similarity scores.
    """
    story_emb = model.encode(story, normalize_embeddings=True)
    # Ensure story embedding is a torch tensor
    if not isinstance(story_emb, torch.Tensor):
        story_emb = torch.tensor(story_emb)
    
    cos_scores = util.cos_sim(story_emb, tag_embeddings)[0]
    top_results = torch.topk(cos_scores, k=top_k)
    return [(tags[int(idx)], float(score)) for score, idx in zip(top_results.values, top_results.indices)]

# -----------------------------
# 4. Example usage
# -----------------------------
if __name__ == "__main__":
    stories = [
        "I was literally shocked to see her naked",
        "I was sitting at the bank of river with her",
        "After I finished my degree, I packed my bags and moved to a new city for my first real job. It was a huge step."
    ]

    for i, story in enumerate(stories, 1):
        print("-" * 50)
        results = predict_tags(story, model, tags, tag_embeddings, top_k=5)
        print(f"\nStory {i}:", story)
        print("\nTop 5 Predicted Tags:")
        for tag, score in results:
            print(f"- {tag} (Score: {score:.4f})")
    print("-" * 50)
