from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import util, SentenceTransformer
import numpy as np
import pickle
import torch

import os

os.environ["HTTP_PROXY"] = "http://edcguest:edcguest@172.31.100.25:3128"
os.environ["HTTPS_PROXY"] = "http://edcguest:edcguest@172.31.100.25:3128"

# --- FastAPI app ---
app = FastAPI()

# ✅ CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request/Response Models ---
class StoryRequest(BaseModel):
    title: str
    description: str = ""
    top_k: int = 3

class TagResponse(BaseModel):
    tag: str
    score: float

# --- Load tag model (384-dim embeddings) ---
with open("family_tag_model.pkl", "rb") as f:
    data = pickle.load(f)

tags = data["tags"]
tag_embeddings = np.array(data["embeddings"], dtype=np.float32)

# Convert to torch tensor and normalize once at startup
tag_embeddings_norm = torch.tensor(tag_embeddings)
tag_embeddings_norm = tag_embeddings_norm / torch.norm(tag_embeddings_norm, dim=1, keepdim=True)

# --- Load local MiniLM-L6 model ---
model = SentenceTransformer("./all-MiniLM-L6-v2-local")

# --- Root endpoint ---
@app.get("/")
async def root():
    return {"message": "Server is running"}

# --- Predict tags endpoint ---
@app.post("/predict-tags/", response_model=list[TagResponse])
async def predict_tags_api(request: StoryRequest):
    global model, tags, tag_embeddings_norm

    if model is None or not tags or tag_embeddings_norm is None or len(tag_embeddings_norm) == 0:
        raise HTTPException(status_code=500, detail="Model or data not loaded properly.")

    # Combine title + description
    text = f"{request.title}. {request.description}"
    text_emb = model.encode(text, normalize_embeddings=True)
    text_emb = torch.tensor(text_emb, dtype=torch.float32).unsqueeze(0)  # shape: (1, 384)

    # Compute cosine similarity
    cos_scores = util.cos_sim(text_emb, tag_embeddings_norm)[0]

    top_k = min(request.top_k, len(tags))
    top_results = torch.topk(cos_scores, k=top_k)

    results = []
    tag_keys = tags
    for score, idx in zip(top_results.values, top_results.indices):
        results.append({"tag": tag_keys[int(idx)], "score": float(score)})

    return results
