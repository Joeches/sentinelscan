# This file is intentionally minimal for the MVP
# All data storage is handled in-memory in app.py
# In a production environment, this would contain database models

# Transaction and Anomaly data structures are represented as dictionaries
# Example transaction structure:
TRANSACTION_SCHEMA = {
    'transaction_id': str,
    'user_id': str,
    'amount': float,
    'currency': str,
    'merchant_id': str,
    'transaction_type': str,
    'location_city': str,
    'location_country': str,
    'timestamp': str,
    'device_info': str,
    'is_anomaly': bool,
    'anomaly_score': float,
    'processed_at': str
}
