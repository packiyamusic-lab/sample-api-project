from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load model on startup (SAFE WAY)
@app.on_event("startup")
def load_model():
    global model, scaler
    print("Loading model...")
    model = joblib.load("model.joblib")
    scaler = joblib.load("scaler.joblib")
    print("Model loaded successfully")

@app.post("/predict/")
def predict(features: str = Form(...)):
    try:
        values = list(map(float, features.split(",")))
        values = np.array(values).reshape(1, -1)

        scaled_features = scaler.transform(values)
        prediction = model.predict(scaled_features)

        return {"prediction": int(prediction[0])}

    except Exception as e:
        return {"error": str(e)}
import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=10000)