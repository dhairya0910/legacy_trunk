from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import util
import numpy as np
import pickle
import os

# os.environ["HTTP_PROXY"] = "http://edcguest:edcguest@172.31.100.25:3128"
# os.environ["HTTPS_PROXY"] = "http://edcguest:edcguest@172.31.100.25:3128"
app = FastAPI()

class StoryRequest(BaseModel):
    title: str
    description: str = ""
    top_k: int = 3

class TagResponse(BaseModel):
    tag: str
    score: float

# --- Load model ---
with open("family_tag_model.pkl", "rb") as f:
    data = pickle.load(f)

tags = data["tags"]
tag_embeddings = np.array(data["embeddings"])

from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")

@app.post("/predict-tags/", response_model=list[TagResponse])
async def predict_tags_api(request: StoryRequest):
    global model, tags, tag_embeddings

    if model is None or not tags or tag_embeddings is None or len(tag_embeddings) == 0:
        raise HTTPException(status_code=500, detail="Model or data not loaded properly.")

    # Combine title + description
    text = f"{request.title}. {request.description}"
    text_emb = model.encode(text, normalize_embeddings=True)
    tag_embeddings_norm = tag_embeddings / np.linalg.norm(tag_embeddings, axis=1, keepdims=True)

    cos_scores = util.cos_sim(text_emb, tag_embeddings_norm)[0]
    top_k = min(request.top_k, len(tags))
    top_results = cos_scores.topk(top_k)

    # ✅ Return list of TagResponse objects
    results = []
    tag_keys = list(tags.keys())
    for score, idx in zip(top_results.values, top_results.indices):
        results.append({"tag": tag_keys[int(idx)], "score": float(score)})

    return results
