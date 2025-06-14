// Dashboard JavaScript for SentinelScan

class Dashboard {
    constructor() {
        this.refreshInterval = null;
        this.autoRefreshEnabled = false;
        this.riskDistributionChart = null;
        this.riskTimelineChart = null;
        this.hourlyRiskChart = null;
        this.volumeRiskChart = null;
        this.riskForecastChart = null;
        this.riskMeter = null;
        this.transactionData = [];
        this.alertSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGMcBjuT2v'); // Subtle alert sound
        this.alertsEnabled = true;
        this.criticalThreshold = 0.8;
        this.highThreshold = 0.6;
        this.init();
    }

    init() {
        this.loadDashboardStats();
        this.setupEventListeners();
        this.initializeCharts();
        this.initializeAdvancedFeatures();
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

        // Chart view switchers
        document.getElementById('chartView1').addEventListener('click', () => this.switchChartView(1));
        document.getElementById('chartView2').addEventListener('click', () => this.switchChartView(2));
        document.getElementById('chartView3').addEventListener('click', () => this.switchChartView(3));

        // Threshold controls
        document.getElementById('criticalThreshold').addEventListener('input', (e) => {
            this.criticalThreshold = parseFloat(e.target.value);
            document.getElementById('criticalValue').textContent = Math.round(this.criticalThreshold * 100) + '%';
        });

        document.getElementById('highThreshold').addEventListener('input', (e) => {
            this.highThreshold = parseFloat(e.target.value);
            document.getElementById('highValue').textContent = Math.round(this.highThreshold * 100) + '%';
        });

        // Alert toggle
        document.getElementById('alertToggle').addEventListener('change', (e) => {
            this.alertsEnabled = e.target.checked;
        });
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
        
        // Check for alerts
        this.checkAndTriggerAlert(result);
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

    initializeAdvancedFeatures() {
        this.initializeRiskForecast();
        this.initializeHourlyRiskChart();
        this.initializeVolumeRiskChart();
        this.initializeGeographicMap();
        this.updateModelConfidence();
        this.updateRiskVelocity();
    }

    initializeRiskForecast() {
        const ctx = document.getElementById('riskForecastChart').getContext('2d');
        this.riskForecastChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Now', '+15m', '+30m', '+45m', '+60m'],
                datasets: [{
                    label: 'Predicted Risk',
                    data: [0.3, 0.35, 0.4, 0.38, 0.42],
                    borderColor: '#17a2b8',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: '#ffffff', font: { size: 10 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: { 
                            color: '#ffffff',
                            font: { size: 10 },
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

    initializeHourlyRiskChart() {
        const ctx = document.getElementById('hourlyRiskChart').getContext('2d');
        const hours = Array.from({length: 24}, (_, i) => i + 'h');
        const riskData = hours.map(() => Math.random() * 0.6 + 0.2);
        
        this.hourlyRiskChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Hourly Risk Pattern',
                    data: riskData,
                    backgroundColor: riskData.map(val => 
                        val > 0.7 ? '#dc3545' : 
                        val > 0.5 ? '#ffc107' : '#28a745'
                    ),
                    borderColor: '#343a40',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '24-Hour Risk Pattern Analysis',
                        color: '#ffffff'
                    },
                    legend: { labels: { color: '#ffffff' } }
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

    initializeVolumeRiskChart() {
        const ctx = document.getElementById('volumeRiskCorrelationChart').getContext('2d');
        
        this.volumeRiskChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Volume vs Risk Correlation',
                    data: [],
                    backgroundColor: 'rgba(0, 123, 255, 0.6)',
                    borderColor: '#007bff',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Transaction Volume vs Risk Score',
                        color: '#ffffff'
                    },
                    legend: { labels: { color: '#ffffff' } }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Transaction Amount ($)',
                            color: '#ffffff'
                        },
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Risk Score',
                            color: '#ffffff'
                        },
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

    initializeGeographicMap() {
        const canvas = document.getElementById('worldMap');
        const ctx = canvas.getContext('2d');
        this.drawWorldMap(ctx);
    }

    drawWorldMap(ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, 300, 250);
        
        // Draw simplified world map outline
        ctx.strokeStyle = '#495057';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#2d3436';
        
        // Simplified continent shapes
        const continents = [
            {x: 50, y: 80, w: 40, h: 30}, // North America
            {x: 100, y: 100, w: 30, h: 50}, // South America
            {x: 150, y: 70, w: 60, h: 40}, // Europe/Asia
            {x: 200, y: 110, w: 25, h: 35}, // Africa
            {x: 230, y: 150, w: 40, h: 25} // Australia
        ];
        
        continents.forEach(continent => {
            ctx.fillRect(continent.x, continent.y, continent.w, continent.h);
            ctx.strokeRect(continent.x, continent.y, continent.w, continent.h);
        });
        
        // Add risk points
        this.updateGeoRiskPoints();
    }

    updateGeoRiskPoints() {
        const mapContainer = document.getElementById('geoRiskMap');
        // Clear existing points
        const existingPoints = mapContainer.querySelectorAll('.geo-risk-point');
        existingPoints.forEach(point => point.remove());
        
        // Sample risk locations based on transaction data
        const riskLocations = [
            {x: 60, y: 90, risk: 'high'},   // USA high risk
            {x: 170, y: 85, risk: 'medium'}, // Europe medium risk
            {x: 210, y: 120, risk: 'high'},  // Africa high risk
            {x: 250, y: 100, risk: 'low'},   // Asia low risk
        ];
        
        riskLocations.forEach(location => {
            const point = document.createElement('div');
            point.className = `geo-risk-point geo-risk-${location.risk}`;
            point.style.left = location.x + 'px';
            point.style.top = location.y + 'px';
            mapContainer.appendChild(point);
        });
    }

    switchChartView(viewNumber) {
        // Hide all chart containers
        for (let i = 1; i <= 3; i++) {
            document.getElementById(`chartContainer${i}`).style.display = 'none';
            document.getElementById(`chartView${i}`).classList.remove('active');
        }
        
        // Show selected container
        document.getElementById(`chartContainer${viewNumber}`).style.display = 'block';
        document.getElementById(`chartView${viewNumber}`).classList.add('active');
        
        // Update charts based on current data
        if (viewNumber === 3 && this.transactionData.length > 0) {
            this.updateVolumeRiskCorrelation();
        }
    }

    updateVolumeRiskCorrelation() {
        const data = this.transactionData.map(transaction => ({
            x: transaction.amount,
            y: transaction.anomaly_score
        }));
        
        this.volumeRiskChart.data.datasets[0].data = data;
        this.volumeRiskChart.update();
    }

    updateModelConfidence() {
        // Simulate model confidence based on transaction volume
        const confidence = Math.min(95, 85 + this.transactionData.length * 2);
        document.getElementById('modelConfidence').style.width = confidence + '%';
        document.getElementById('confidenceText').textContent = confidence.toFixed(1) + '% Accurate';
        
        if (confidence > 90) {
            document.getElementById('modelConfidence').className = 'progress-bar bg-success';
            document.getElementById('confidenceText').className = 'text-success';
        } else if (confidence > 80) {
            document.getElementById('modelConfidence').className = 'progress-bar bg-warning';
            document.getElementById('confidenceText').className = 'text-warning';
        } else {
            document.getElementById('modelConfidence').className = 'progress-bar bg-danger';
            document.getElementById('confidenceText').className = 'text-danger';
        }
    }

    updateRiskVelocity() {
        if (this.transactionData.length < 2) return;
        
        // Calculate risk velocity (change over time)
        const recent = this.transactionData.slice(-5);
        const older = this.transactionData.slice(-10, -5);
        
        if (older.length === 0) return;
        
        const recentAvg = recent.reduce((sum, t) => sum + t.anomaly_score, 0) / recent.length;
        const olderAvg = older.reduce((sum, t) => sum + t.anomaly_score, 0) / older.length;
        
        const velocity = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        const icon = document.getElementById('riskVelocityIcon');
        const text = document.getElementById('riskVelocityText');
        
        if (velocity > 0) {
            icon.className = 'fas fa-arrow-up text-danger me-2';
            text.className = 'text-danger';
            text.textContent = `+${velocity.toFixed(1)}% (Last Hour)`;
        } else {
            icon.className = 'fas fa-arrow-down text-success me-2';
            text.className = 'text-success';
            text.textContent = `${velocity.toFixed(1)}% (Last Hour)`;
        }
    }

    checkAndTriggerAlert(transaction) {
        if (!this.alertsEnabled) return;
        
        const score = transaction.anomaly_score;
        let alertLevel = null;
        
        if (score >= this.criticalThreshold) {
            alertLevel = 'critical';
        } else if (score >= this.highThreshold) {
            alertLevel = 'high';
        }
        
        if (alertLevel) {
            this.addAlert(transaction, alertLevel);
            if (this.alertsEnabled) {
                this.alertSound.play().catch(() => {}); // Ignore audio errors
            }
        }
    }

    addAlert(transaction, level) {
        const alertFeed = document.getElementById('alertFeed');
        
        // Remove "monitoring" message if present
        if (alertFeed.querySelector('.text-center')) {
            alertFeed.innerHTML = '';
        }
        
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${level}`;
        
        const levelText = level === 'critical' ? 'CRITICAL' : 'HIGH RISK';
        const levelIcon = level === 'critical' ? 'fas fa-exclamation-triangle' : 'fas fa-exclamation-circle';
        const levelColor = level === 'critical' ? 'text-danger' : 'text-warning';
        
        alertItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="${levelColor} mb-1">
                        <i class="${levelIcon} me-1"></i>
                        ${levelText} ALERT
                    </h6>
                    <small class="text-muted">
                        ${transaction.transaction_id} • ${transaction.currency} ${transaction.amount.toFixed(2)}
                        <br>
                        ${transaction.location_country} • ${transaction.transaction_type}
                    </small>
                </div>
                <div class="text-end">
                    <span class="badge ${level === 'critical' ? 'bg-danger' : 'bg-warning'}">
                        ${(transaction.anomaly_score * 100).toFixed(1)}%
                    </span>
                    <br>
                    <small class="text-muted">${new Date().toLocaleTimeString()}</small>
                </div>
            </div>
        `;
        
        alertFeed.insertBefore(alertItem, alertFeed.firstChild);
        
        // Limit to 10 alerts
        while (alertFeed.children.length > 10) {
            alertFeed.removeChild(alertFeed.lastChild);
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
