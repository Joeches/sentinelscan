import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, LabelEncoder
import logging

logging.basicConfig(level=logging.INFO)

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic normal transaction data"""
    np.random.seed(42)
    
    # Normal transaction patterns
    data = {
        'amount': np.random.lognormal(mean=4, sigma=1.5, size=n_samples),
        'hour': np.random.choice(
            range(24), 
            size=n_samples, 
            p=[0.02, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.05, 0.06, 0.07, 
               0.08, 0.09, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.03, 
               0.03, 0.03, 0.02, 0.02]
        ),
        'transaction_type': np.random.choice(
            ['purchase', 'transfer', 'withdrawal', 'deposit'], 
            size=n_samples, 
            p=[0.6, 0.2, 0.15, 0.05]
        ),
        'device_info': np.random.choice(
            ['mobile', 'desktop', 'tablet'], 
            size=n_samples, 
            p=[0.7, 0.25, 0.05]
        ),
        'location_country': np.random.choice(
            ['USA', 'UK', 'Canada', 'Germany', 'France'], 
            size=n_samples, 
            p=[0.4, 0.2, 0.15, 0.15, 0.1]
        )
    }
    
    return pd.DataFrame(data)

def engineer_features(df):
    """Engineer features from raw transaction data"""
    features_df = df.copy()
    
    # Log transform amount to handle skewness
    features_df['log_amount'] = np.log1p(features_df['amount'])
    
    # Select relevant features
    feature_columns = ['log_amount', 'hour', 'transaction_type', 'device_info', 'location_country']
    return features_df[feature_columns]

def train_model():
    """Train the IsolationForest model on synthetic data"""
    logging.info("Generating synthetic training data...")
    df = generate_synthetic_data(1000)
    
    logging.info("Engineering features...")
    features_df = engineer_features(df)
    
    # Initialize preprocessors
    scaler = StandardScaler()
    label_encoders = {}
    
    # Handle categorical features
    categorical_features = ['transaction_type', 'device_info', 'location_country']
    for feature in categorical_features:
        le = LabelEncoder()
        features_df[feature] = le.fit_transform(features_df[feature])
        label_encoders[feature] = le
    
    # Scale numerical features
    features_scaled = scaler.fit_transform(features_df)
    
    logging.info("Training IsolationForest model...")
    model = IsolationForest(
        contamination=0.1,  # Expect 10% of data to be anomalous
        random_state=42,
        n_estimators=100,
        max_samples='auto',
        n_jobs=-1
    )
    model.fit(features_scaled)
    
    # Save model and preprocessors
    logging.info("Saving model and preprocessors...")
    joblib.dump(model, 'anomaly_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(label_encoders, 'label_encoders.pkl')
    
    logging.info("Model training completed successfully!")
    
    # Test the model with a sample transaction
    logging.info("Testing model with sample transaction...")
    test_transaction = {
        'amount': 150.75,
        'hour': 14,
        'transaction_type': 'purchase',
        'device_info': 'mobile',
        'location_country': 'USA'
    }
    
    test_df = pd.DataFrame([test_transaction])
    test_features = engineer_features(test_df)
    
    for feature, encoder in label_encoders.items():
        test_features[feature] = encoder.transform(test_features[feature])
    
    test_scaled = scaler.transform(test_features)
    prediction = model.predict(test_scaled)[0]
    score = model.decision_function(test_scaled)[0]
    
    is_anomaly = prediction == -1
    logging.info(f"Test transaction - Is Anomaly: {is_anomaly}, Score: {score}")

if __name__ == '__main__':
    train_model()
