# src/python/predict.py
import sys
import json
import joblib
import pandas as pd
from pathlib import Path
import subprocess

def load_model():
    model_path = Path(__file__).parent / "model" / "election_model.joblib"
    return joblib.load(model_path)

def predict(input_json):
    
    try:

        uninstall = subprocess.run(
            [sys.executable, '-m', 'pip', 'uninstall', 'numpy'],
            capture_output=True,
            text=True
        )
        install_output = subprocess.run(
            [sys.executable, '-m', 'pip', 'install', 'numpy', 'scikit-learn', 'scipy'],
            capture_output=True,
            text=True
        )
        # Parse input data
        data = json.loads(input_json)
        
        # Convert to DataFrame
        input_df = pd.DataFrame([data])
        
        # Load model
        model = load_model()
        
        # Make prediction
        prediction = bool(model.predict(input_df)[0])
        probabilities = model.predict_proba(input_df)[0].tolist()
        
        # Prepare response
        result = {      
            "prediction": prediction,
            "win_probability": probabilities[1],
            "lose_probability": probabilities[0],
            "error": None
        }
        
        return json.dumps(result)
        
    except Exception as e:
        return json.dumps({
            "input": input_json,
            "install": install_output.stdout,
            "uninstall": uninstall.stdout,
            "prediction": None,
            "win_probability": None,
            "lose_probability": None,
            "error": str(e)
        })

if __name__ == "__main__":
    # Read input from arguments
    input_json = sys.argv[1]
    # Print prediction to stdout
    print(predict(input_json))