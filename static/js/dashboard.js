// Dashboard JavaScript for SentinelScan

class Dashboard {
    constructor() {
        this.refreshInterval = null;
        this.autoRefreshEnabled = false;
        this.riskDistributionChart = null;
        this.riskTimelineChart = null;
        this.riskMeter = null;
        this.transactionData = [];
        this.init();
    }

    init() {
        this.loadDashboardStats();
        this.setupEventListeners();
        this.initializeCharts();
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

        // Update transaction data and visualizations
        this.transactionData.push(result);
        this.updateRiskVisualizations(this.transactionData);
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
                
                // Load all transactions for visualizations
                await this.loadTransactionData();
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async loadTransactionData() {
        try {
            const response = await fetch('/api/transactions?limit=50');
            const data = await response.json();

            if (response.ok) {
                this.transactionData = data.transactions;
                this.updateRiskVisualizations(this.transactionData);
            }
        } catch (error) {
            console.error('Error loading transaction data:', error);
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

    initializeCharts() {
        this.initializeRiskDistributionChart();
        this.initializeRiskTimelineChart();
        this.initializeRiskMeter();
    }

    initializeRiskDistributionChart() {
        const ctx = document.getElementById('riskDistributionChart').getContext('2d');
        this.riskDistributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        '#28a745',  // Low - Green
                        '#ffc107',  // Medium - Yellow
                        '#dc3545',  // High - Red
                        '#8b0000'   // Critical - Dark Red
                    ],
                    borderColor: '#343a40',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Risk Distribution',
                        color: '#ffffff',
                        font: { size: 14 }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    initializeRiskTimelineChart() {
        const ctx = document.getElementById('riskTimelineChart').getContext('2d');
        this.riskTimelineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Average Risk Score',
                    data: [],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Risk Trend Over Time',
                        color: '#ffffff',
                        font: { size: 14 }
                    },
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: { 
                            color: '#ffffff',
                            callback: function(value) {
                                return (value * 100).toFixed(0) + '%';
                            }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    initializeRiskMeter() {
        const canvas = document.getElementById('riskMeter');
        const ctx = canvas.getContext('2d');
        this.drawRiskMeter(ctx, 0);
    }

    drawRiskMeter(ctx, riskValue) {
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        // Clear canvas
        ctx.clearRect(0, 0, 200, 200);
        
        // Draw background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#343a40';
        ctx.stroke();
        
        // Risk level colors and positions
        const riskLevels = [
            { color: '#28a745', start: 0, end: 0.25 },      // Low
            { color: '#ffc107', start: 0.25, end: 0.5 },   // Medium
            { color: '#dc3545', start: 0.5, end: 0.75 },   // High
            { color: '#8b0000', start: 0.75, end: 1 }      // Critical
        ];
        
        // Draw colored segments
        riskLevels.forEach(level => {
            ctx.beginPath();
            const startAngle = Math.PI + (level.start * Math.PI);
            const endAngle = Math.PI + (level.end * Math.PI);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 15;
            ctx.strokeStyle = level.color;
            ctx.stroke();
        });
        
        // Draw needle
        const needleAngle = Math.PI + (riskValue * Math.PI);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const needleX = centerX + (radius - 20) * Math.cos(needleAngle);
        const needleY = centerY + (radius - 20) * Math.sin(needleAngle);
        ctx.lineTo(needleX, needleY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }

    updateRiskVisualizations(transactions) {
        this.updateRiskDistribution(transactions);
        this.updateRiskTimeline(transactions);
        this.updateRiskMeter(transactions);
    }

    updateRiskDistribution(transactions) {
        const distribution = [0, 0, 0, 0]; // Low, Medium, High, Critical
        
        transactions.forEach(transaction => {
            const score = transaction.anomaly_score;
            if (score < 0.25) distribution[0]++;
            else if (score < 0.5) distribution[1]++;
            else if (score < 0.75) distribution[2]++;
            else distribution[3]++;
        });
        
        this.riskDistributionChart.data.datasets[0].data = distribution;
        this.riskDistributionChart.update();
    }

    updateRiskTimeline(transactions) {
        const timeGroups = {};
        
        transactions.forEach(transaction => {
            const time = new Date(transaction.processed_at);
            const timeKey = time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            if (!timeGroups[timeKey]) {
                timeGroups[timeKey] = [];
            }
            timeGroups[timeKey].push(transaction.anomaly_score);
        });
        
        const labels = Object.keys(timeGroups).slice(-10);
        const data = labels.map(time => {
            const scores = timeGroups[time];
            return scores.reduce((sum, score) => sum + score, 0) / scores.length;
        });
        
        this.riskTimelineChart.data.labels = labels;
        this.riskTimelineChart.data.datasets[0].data = data;
        this.riskTimelineChart.update();
    }

    updateRiskMeter(transactions) {
        if (transactions.length === 0) {
            this.drawRiskMeter(document.getElementById('riskMeter').getContext('2d'), 0);
            this.updateRiskLevelText(0);
            return;
        }
        
        const avgRisk = transactions.reduce((sum, t) => sum + t.anomaly_score, 0) / transactions.length;
        this.drawRiskMeter(document.getElementById('riskMeter').getContext('2d'), avgRisk);
        this.updateRiskLevelText(avgRisk);
    }

    updateRiskLevelText(riskValue) {
        const riskLevelElement = document.getElementById('riskLevelText');
        
        if (riskValue < 0.25) {
            riskLevelElement.textContent = 'LOW';
            riskLevelElement.className = 'risk-level-low';
        } else if (riskValue < 0.5) {
            riskLevelElement.textContent = 'MEDIUM';
            riskLevelElement.className = 'risk-level-medium';
        } else if (riskValue < 0.75) {
            riskLevelElement.textContent = 'HIGH';
            riskLevelElement.className = 'risk-level-high';
        } else {
            riskLevelElement.textContent = 'CRITICAL';
            riskLevelElement.className = 'risk-level-critical';
        }
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
