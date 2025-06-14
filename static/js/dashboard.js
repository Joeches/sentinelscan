// Dashboard JavaScript for SentinelScan

class Dashboard {
    constructor() {
        this.refreshInterval = null;
        this.autoRefreshEnabled = false;
        this.init();
    }

    init() {
        this.loadDashboardStats();
        this.setupEventListeners();
        this.startAutoRefresh();
        this.generateRandomTransactionData();
    }

    setupEventListeners() {
        // Transaction form submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitTransaction();
        });

        // Auto-generate transaction data button
        const generateBtn = document.createElement('button');
        generateBtn.type = 'button';
        generateBtn.className = 'btn btn-outline-primary mt-2';
        generateBtn.innerHTML = '<i class="fas fa-random me-2"></i>Generate Random Data';
        generateBtn.addEventListener('click', () => this.generateRandomTransactionData());
        
        const form = document.getElementById('transactionForm');
        form.appendChild(generateBtn);
    }

    generateRandomTransactionData() {
        const transactionTypes = ['purchase', 'transfer', 'withdrawal', 'deposit'];
        const devices = ['mobile', 'desktop', 'tablet'];
        const countries = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Nigeria', 'India'];
        const currencies = ['USD', 'EUR', 'GBP', 'CAD'];

        // Generate random data
        const randomTransactionId = 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const randomUserId = 'USR_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const randomAmount = (Math.random() * 5000 + 10).toFixed(2);
        const randomMerchantId = 'MER_' + Math.random().toString(36).substr(2, 5).toUpperCase();

        // Fill form fields
        document.getElementById('transactionId').value = randomTransactionId;
        document.getElementById('userId').value = randomUserId;
        document.getElementById('amount').value = randomAmount;
        document.getElementById('currency').value = currencies[Math.floor(Math.random() * currencies.length)];
        document.getElementById('transactionType').value = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        document.getElementById('deviceInfo').value = devices[Math.floor(Math.random() * devices.length)];
        document.getElementById('locationCountry').value = countries[Math.floor(Math.random() * countries.length)];
        document.getElementById('merchantId').value = randomMerchantId;
    }

    async submitTransaction() {
        const form = document.getElementById('transactionForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        submitBtn.disabled = true;

        try {
            const transactionData = {
                transaction_id: document.getElementById('transactionId').value,
                user_id: document.getElementById('userId').value,
                amount: parseFloat(document.getElementById('amount').value),
                currency: document.getElementById('currency').value,
                merchant_id: document.getElementById('merchantId').value || null,
                transaction_type: document.getElementById('transactionType').value,
                location_country: document.getElementById('locationCountry').value,
                device_info: document.getElementById('deviceInfo').value,
                timestamp: new Date().toISOString()
            };

            const response = await fetch('/api/transactions/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            });

            const result = await response.json();

            if (response.ok) {
                this.displayTransactionResult(result);
                this.loadDashboardStats(); // Refresh stats
                this.generateRandomTransactionData(); // Generate new random data for next test
                this.showToast('Transaction processed successfully', 'success');
            } else {
                this.showToast(result.error || 'Error processing transaction', 'error');
            }
        } catch (error) {
            console.error('Error submitting transaction:', error);
            this.showToast('Network error. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    displayTransactionResult(result) {
        const resultDiv = document.getElementById('transactionResult');
        const contentDiv = document.getElementById('resultContent');
        
        const anomalyClass = result.is_anomaly ? 'text-danger' : 'text-success';
        const anomalyIcon = result.is_anomaly ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
        const anomalyText = result.is_anomaly ? 'ANOMALY DETECTED' : 'Normal Transaction';
        
        contentDiv.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <strong>Transaction ID:</strong> ${result.transaction_id}<br>
                    <strong>Amount:</strong> ${result.currency} ${result.amount.toFixed(2)}<br>
                    <strong>Type:</strong> ${result.transaction_type}
                </div>
                <div class="col-md-6">
                    <strong>Status:</strong> 
                    <span class="${anomalyClass}">
                        <i class="${anomalyIcon} me-1"></i>${anomalyText}
                    </span><br>
                    <strong>Anomaly Score:</strong> ${(result.anomaly_score * 100).toFixed(1)}%<br>
                    <strong>Processed:</strong> ${new Date(result.processed_at).toLocaleTimeString()}
                </div>
            </div>
        `;
        
        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth' });

        // If it's an anomaly, add to live feed
        if (result.is_anomaly) {
            this.addToAnomalyFeed(result);
        }
    }

    addToAnomalyFeed(anomaly) {
        const feed = document.getElementById('anomalyFeed');
        
        // Remove "no anomalies" message if present
        if (feed.querySelector('.text-center')) {
            feed.innerHTML = '';
        }

        const anomalyItem = document.createElement('div');
        anomalyItem.className = 'anomaly-item new';
        anomalyItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="text-danger mb-1">
                        <i class="fas fa-exclamation-triangle me-1"></i>
                        ${anomaly.transaction_id}
                    </h6>
                    <small class="text-muted">
                        ${anomaly.currency} ${anomaly.amount.toFixed(2)} • 
                        ${anomaly.transaction_type} • 
                        ${anomaly.location_country}
                    </small>
                </div>
                <div class="text-end">
                    <span class="badge bg-danger">${(anomaly.anomaly_score * 100).toFixed(1)}%</span>
                    <br>
                    <small class="text-muted">${new Date(anomaly.processed_at).toLocaleTimeString()}</small>
                </div>
            </div>
        `;

        // Add to top of feed
        feed.insertBefore(anomalyItem, feed.firstChild);

        // Limit to 10 items
        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }

        // Update anomaly count badge
        const badge = document.getElementById('anomalyCount');
        badge.textContent = feed.children.length;
    }

    async loadDashboardStats() {
        try {
            const response = await fetch('/api/dashboard_stats');
            const stats = await response.json();

            if (response.ok) {
                document.getElementById('totalTransactions').textContent = stats.total_transactions;
                document.getElementById('totalAnomalies').textContent = stats.total_anomalies;
                document.getElementById('anomalyRate').textContent = stats.anomaly_rate + '%';

                // Load recent anomalies into feed
                this.loadRecentAnomalies(stats.recent_anomalies);
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    loadRecentAnomalies(anomalies) {
        const feed = document.getElementById('anomalyFeed');
        
        if (anomalies.length === 0) {
            feed.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-search fa-2x mb-2"></i>
                    <p>No anomalies detected yet</p>
                </div>
            `;
            document.getElementById('anomalyCount').textContent = '0';
            return;
        }

        feed.innerHTML = '';
        anomalies.forEach(anomaly => {
            this.addToAnomalyFeed(anomaly);
        });
    }

    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            this.loadDashboardStats();
        }, 5000); // Refresh every 5 seconds
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toastId = 'toast_' + Date.now();
        
        const bgClass = type === 'success' ? 'bg-success' : 
                       type === 'error' ? 'bg-danger' : 'bg-primary';
        
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast align-items-center text-white ${bgClass} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
