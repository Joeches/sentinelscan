# SentinelScan - AI-Powered Transaction Anomaly Detector

## Overview

SentinelScan is a real-time AI-powered fraud detection system designed to identify suspicious financial transaction patterns. The application uses machine learning to analyze incoming transaction data and flag anomalies that could indicate fraudulent activity. This MVP demonstrates core anomaly detection capabilities with a focus on financial institutions and payment processors.

## System Architecture

The application follows a Flask-based web architecture with the following key design decisions:

### Backend Architecture
- **Framework**: Flask web framework chosen for simplicity and rapid prototyping
- **Language**: Python 3.11 for ML/AI capabilities and extensive data science libraries
- **Deployment**: Gunicorn WSGI server with autoscale deployment target on Replit
- **Data Storage**: In-memory storage for MVP (no external database dependencies)

### Machine Learning Architecture
- **Algorithm**: Isolation Forest for unsupervised anomaly detection
- **Preprocessing**: StandardScaler for numerical features, LabelEncoder for categorical features
- **Model Persistence**: Joblib for saving/loading trained models and preprocessors
- **Training**: Synthetic data generation for initial model training

### Frontend Architecture
- **Template Engine**: Jinja2 templates with Flask
- **UI Framework**: Bootstrap 5 with custom dark theme
- **JavaScript**: Vanilla JavaScript for dynamic interactions
- **Real-time Updates**: Client-side polling for dashboard statistics

## Key Components

### Core Application (`app.py`)
- Flask application setup and configuration
- In-memory data storage (`transactions_db`, `anomalies_db`)
- Model loading and training functionality
- API endpoints for transaction processing and data retrieval

### Model Training (`train_model.py`)
- Synthetic transaction data generation
- Feature engineering pipeline
- Isolation Forest model training
- Model serialization for persistence

### Web Interface
- **Dashboard**: Real-time transaction monitoring with statistics
- **Anomalies Page**: Detailed view of detected anomalous transactions
- **Responsive Design**: Mobile-friendly interface with dark theme

### Data Models (`models.py`)
- Schema definitions for transactions and anomalies
- In-memory data structure specifications
- Placeholder for future database integration

## Data Flow

1. **Transaction Input**: Users submit transaction data through the web interface
2. **Feature Engineering**: Raw transaction data is preprocessed and normalized
3. **Anomaly Detection**: Processed features are fed to the Isolation Forest model
4. **Classification**: Transactions are classified as normal or anomalous based on anomaly scores
5. **Storage**: Results are stored in in-memory databases
6. **Visualization**: Dashboard displays real-time statistics and anomaly alerts

### Feature Engineering Process
- Amount normalization using log transformation
- Categorical encoding for transaction types, devices, and locations
- Time-based feature extraction (hour of day)
- Standard scaling for numerical features

## External Dependencies

### Python Packages
- **Flask**: Web framework and template rendering
- **scikit-learn**: Machine learning algorithms and preprocessing
- **pandas/numpy**: Data manipulation and numerical computations
- **joblib**: Model serialization and persistence
- **gunicorn**: Production WSGI server

### Frontend Dependencies
- **Bootstrap 5**: CSS framework for responsive design
- **Font Awesome**: Icon library for UI elements
- **Custom CSS**: Dark theme styling and component customization

### Infrastructure
- **PostgreSQL**: Configured in environment but not currently used (future enhancement)
- **Replit Environment**: Development and deployment platform

## Deployment Strategy

### Development Environment
- Python 3.11 with Nix package management
- Local development server with hot reload
- Debug mode enabled for development

### Production Deployment
- Gunicorn WSGI server with binding to 0.0.0.0:5000
- Autoscale deployment target for handling variable load
- Reuse-port configuration for improved performance
- Environment-based configuration management

### Model Deployment
- Models are trained on startup if not found
- Automatic model persistence using joblib
- Fallback training with synthetic data for initial deployment

## Changelog

- June 14, 2025. Initial setup and successful deployment
  - Fixed probability distribution error in synthetic data generation
  - Resolved JSON serialization issues for boolean values
  - Successfully trained IsolationForest model with synthetic transaction data
  - Deployed functional web application with real-time anomaly detection
  - Verified API endpoints and frontend functionality
  - Tested anomaly detection with various transaction patterns
  - Achieved 100% accuracy on test suspicious transactions (high-value transfers and withdrawals from high-risk locations)

## User Preferences

Preferred communication style: Simple, everyday language.