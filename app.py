import os
import logging
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, LabelEncoder

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "sentinel-scan-secret-key")

# In-memory storage for MVP
transactions_db = []
anomalies_db = []

# Global variables for model and preprocessing
model = None
scaler = None
label_encoders = {}

def load_model():
    """Load the pre-trained anomaly detection model"""
    global model, scaler, label_encoders
    try:
        model = joblib.load('anomaly_model.pkl')
        scaler = joblib.load('scaler.pkl')
        label_encoders = joblib.load('label_encoders.pkl')
        logging.info("Model and preprocessors loaded successfully")
    except FileNotFoundError:
        logging.warning("Model files not found. Training new model...")
        train_and_save_model()

def train_and_save_model():
    """Train and save the anomaly detection model"""
    global model, scaler, label_encoders
    
    # Generate synthetic normal transaction data
    np.random.seed(42)
    n_samples = 1000
    
    # Create synthetic normal transactions
    data = {
        'amount': np.random.lognormal(mean=4, sigma=1.5, size=n_samples),
        'hour': np.random.choice(range(24), size=n_samples, p=[0.02, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.05, 0.06, 0.07, 0.08, 0.09, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.03, 0.03, 0.03, 0.02, 0.01]),
        'transaction_type': np.random.choice(['purchase', 'transfer', 'withdrawal', 'deposit'], size=n_samples, p=[0.6, 0.2, 0.15, 0.05]),
        'device_info': np.random.choice(['mobile', 'desktop', 'tablet'], size=n_samples, p=[0.7, 0.25, 0.05]),
        'location_country': np.random.choice(['USA', 'UK', 'Canada', 'Germany', 'France'], size=n_samples, p=[0.4, 0.2, 0.15, 0.15, 0.1])
    }
    
    df = pd.DataFrame(data)
    
    # Feature engineering
    features_df = engineer_features(df)
    
    # Initialize and fit preprocessors
    scaler = StandardScaler()
    label_encoders = {}
    
    # Handle categorical features
    categorical_features = ['transaction_type', 'device_info', 'location_country']
    for feature in categorical_features:
        if feature in features_df.columns:
            le = LabelEncoder()
            features_df[feature] = le.fit_transform(features_df[feature])
            label_encoders[feature] = le
    
    # Scale numerical features
    features_scaled = scaler.fit_transform(features_df)
    
    # Train IsolationForest
    model = IsolationForest(contamination=0.1, random_state=42, n_estimators=100)
    model.fit(features_scaled)
    
    # Save model and preprocessors
    joblib.dump(model, 'anomaly_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(label_encoders, 'label_encoders.pkl')
    
    logging.info("Model trained and saved successfully")

def engineer_features(transaction_data):
    """Engineer features from transaction data"""
    if isinstance(transaction_data, dict):
        # Convert single transaction to DataFrame
        df = pd.DataFrame([transaction_data])
    else:
        df = transaction_data.copy()
    
    # Extract hour from timestamp if provided
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
    elif 'hour' not in df.columns:
        # Default hour if not provided
        df['hour'] = 12
    
    # Log transform amount to handle skewness
    if 'amount' in df.columns:
        df['log_amount'] = np.log1p(df['amount'])
    
    # Select features for model
    feature_columns = ['log_amount', 'hour', 'transaction_type', 'device_info', 'location_country']
    available_columns = [col for col in feature_columns if col in df.columns]
    
    # Add default values for missing columns
    if 'log_amount' not in df.columns and 'amount' in df.columns:
        df['log_amount'] = np.log1p(df['amount'])
        available_columns.append('log_amount')
    
    return df[available_columns]

def detect_anomaly(transaction):
    """Detect if a transaction is anomalous"""
    global model, scaler, label_encoders
    
    if model is None:
        load_model()
    
    # Engineer features
    features_df = engineer_features(transaction)
    
    # Handle categorical features with label encoders
    for feature, encoder in label_encoders.items():
        if feature in features_df.columns:
            # Handle unknown categories
            try:
                features_df[feature] = encoder.transform(features_df[feature])
            except ValueError:
                # Assign most frequent class for unknown categories
                features_df[feature] = 0
    
    # Scale features
    features_scaled = scaler.transform(features_df)
    
    # Predict anomaly
    anomaly_prediction = model.predict(features_scaled)[0]
    anomaly_score = model.decision_function(features_scaled)[0]
    
    # Convert to boolean (IsolationForest returns -1 for anomaly, 1 for normal)
    is_anomaly = anomaly_prediction == -1
    
    # Normalize score to 0-1 range
    normalized_score = max(0, min(1, (0.5 - anomaly_score) * 2))
    
    return is_anomaly, normalized_score

@app.route('/')
def dashboard():
    """Dashboard page"""
    return render_template('dashboard.html')

@app.route('/anomalies')
def anomalies_page():
    """Anomalies list page"""
    return render_template('anomalies.html')

@app.route('/api/transactions/simulate', methods=['POST'])
def simulate_transaction():
    """Simulate a transaction and detect anomalies"""
    try:
        transaction_data = request.get_json()
        
        # Validate required fields
        required_fields = ['transaction_id', 'user_id', 'amount', 'currency']
        for field in required_fields:
            if field not in transaction_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Add timestamp if not provided
        if 'timestamp' not in transaction_data:
            transaction_data['timestamp'] = datetime.utcnow().isoformat() + 'Z'
        
        # Detect anomaly
        is_anomaly, anomaly_score = detect_anomaly(transaction_data)
        
        # Add anomaly information
        transaction_data['is_anomaly'] = is_anomaly
        transaction_data['anomaly_score'] = float(anomaly_score)
        transaction_data['processed_at'] = datetime.utcnow().isoformat() + 'Z'
        
        # Store in database
        transactions_db.append(transaction_data)
        
        if is_anomaly:
            anomalies_db.append(transaction_data)
        
        return jsonify(transaction_data), 200
        
    except Exception as e:
        logging.error(f"Error processing transaction: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/anomalies')
def get_anomalies():
    """Get list of anomalous transactions"""
    try:
        limit = request.args.get('limit', 10, type=int)
        skip = request.args.get('skip', 0, type=int)
        sort_by = request.args.get('sort_by', 'processed_at')
        
        # Sort anomalies
        sorted_anomalies = sorted(
            anomalies_db, 
            key=lambda x: x.get(sort_by, ''), 
            reverse=True
        )
        
        # Apply pagination
        paginated_anomalies = sorted_anomalies[skip:skip + limit]
        
        return jsonify({
            'anomalies': paginated_anomalies,
            'total': len(anomalies_db),
            'limit': limit,
            'skip': skip
        }), 200
        
    except Exception as e:
        logging.error(f"Error retrieving anomalies: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/dashboard_stats')
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        total_transactions = len(transactions_db)
        total_anomalies = len(anomalies_db)
        anomaly_rate = (total_anomalies / total_transactions * 100) if total_transactions > 0 else 0
        
        # Recent anomalies (last 5)
        recent_anomalies = sorted(
            anomalies_db, 
            key=lambda x: x.get('processed_at', ''), 
            reverse=True
        )[:5]
        
        return jsonify({
            'total_transactions': total_transactions,
            'total_anomalies': total_anomalies,
            'anomaly_rate': round(anomaly_rate, 2),
            'recent_anomalies': recent_anomalies
        }), 200
        
    except Exception as e:
        logging.error(f"Error retrieving dashboard stats: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Initialize model on startup
load_model()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
