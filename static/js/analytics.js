// Enterprise Analytics JavaScript for SentinelScan

class EnterpriseAnalytics {
    constructor() {
        this.fraudTrendChart = null;
        this.precisionRecallChart = null;
        this.patternAnalysisChart = null;
        this.apiPerformanceChart = null;
        this.globalHeatmap = null;
        this.init();
    }

    init() {
        this.initializeCharts();
        this.setupEventListeners();
        this.loadAnalyticsData();
        this.startLiveUpdates();
    }

    setupEventListeners() {
        // Trend period buttons
        document.getElementById('trendDaily').addEventListener('click', () => this.updateTrendPeriod('daily'));
        document.getElementById('trendWeekly').addEventListener('click', () => this.updateTrendPeriod('weekly'));
        document.getElementById('trendMonthly').addEventListener('click', () => this.updateTrendPeriod('monthly'));

        // Export and schedule buttons
        document.getElementById('exportData').addEventListener('click', () => this.exportReport());
        document.getElementById('scheduleReport').addEventListener('click', () => this.scheduleReport());
        document.getElementById('liveDemo').addEventListener('click', () => this.startLiveDemo());
    }

    initializeCharts() {
        this.initializeFraudTrendChart();
        this.initializePrecisionRecallChart();
        this.initializePatternAnalysisChart();
        this.initializeApiPerformanceChart();
        this.initializeGlobalHeatmap();
    }

    initializeFraudTrendChart() {
        const ctx = document.getElementById('fraudTrendChart').getContext('2d');
        
        // Generate realistic fraud trend data
        const last30Days = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const fraudAttempts = Array.from({length: 30}, () => Math.floor(Math.random() * 100 + 50));
        const preventedFraud = fraudAttempts.map(attempts => Math.floor(attempts * (0.85 + Math.random() * 0.1)));
        const savings = preventedFraud.map(prevented => prevented * (1000 + Math.random() * 2000));

        this.fraudTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days,
                datasets: [
                    {
                        label: 'Fraud Attempts Detected',
                        data: fraudAttempts,
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Fraud Prevented',
                        data: preventedFraud,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
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
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    initializePrecisionRecallChart() {
        const ctx = document.getElementById('precisionRecallChart').getContext('2d');
        
        this.precisionRecallChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['True Positives', 'False Positives', 'False Negatives'],
                datasets: [{
                    data: [973, 27, 42],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                    borderColor: '#343a40',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    initializePatternAnalysisChart() {
        const ctx = document.getElementById('patternAnalysisChart').getContext('2d');
        
        this.patternAnalysisChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Amount Anomaly', 'Time Pattern', 'Location Risk', 'Device Fingerprint', 'Velocity Check', 'Behavioral Score'],
                datasets: [
                    {
                        label: 'Current Model',
                        data: [92, 88, 95, 91, 89, 93],
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.2)',
                        pointBackgroundColor: '#007bff'
                    },
                    {
                        label: 'Industry Average',
                        data: [78, 72, 81, 75, 76, 79],
                        borderColor: '#6c757d',
                        backgroundColor: 'rgba(108, 117, 125, 0.1)',
                        pointBackgroundColor: '#6c757d'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#ffffff' }
                    }
                }
            }
        });
    }

    initializeApiPerformanceChart() {
        const ctx = document.getElementById('apiPerformanceChart').getContext('2d');
        
        const last24Hours = Array.from({length: 24}, (_, i) => i + 'h');
        const responseTime = Array.from({length: 24}, () => Math.random() * 20 + 40);
        
        this.apiPerformanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last24Hours,
                datasets: [{
                    label: 'Response Time (ms)',
                    data: responseTime,
                    borderColor: '#17a2b8',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 2
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
                        ticks: { color: '#ffffff', font: { size: 8 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#ffffff', font: { size: 8 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    initializeGlobalHeatmap() {
        const canvas = document.getElementById('globalHeatmap');
        const ctx = canvas.getContext('2d');
        this.drawGlobalHeatmap(ctx);
    }

    drawGlobalHeatmap(ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, 300, 300);
        
        // Draw world map background
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(0, 0, 300, 300);
        
        // Draw continent outlines
        ctx.strokeStyle = '#495057';
        ctx.lineWidth = 1;
        
        // Simplified continent shapes with risk levels
        const regions = [
            { x: 40, y: 80, w: 50, h: 40, risk: 0.3 }, // North America
            { x: 80, y: 130, w: 40, h: 60, risk: 0.6 }, // South America
            { x: 140, y: 70, w: 80, h: 50, risk: 0.8 }, // Europe/Russia
            { x: 180, y: 120, w: 30, h: 45, risk: 0.9 }, // Africa
            { x: 220, y: 90, w: 60, h: 50, risk: 0.4 }, // Asia
            { x: 240, y: 170, w: 40, h: 30, risk: 0.2 }  // Australia
        ];
        
        regions.forEach(region => {
            // Color based on risk level
            const alpha = region.risk;
            ctx.fillStyle = `rgba(220, 53, 69, ${alpha})`;
            ctx.fillRect(region.x, region.y, region.w, region.h);
            ctx.strokeRect(region.x, region.y, region.w, region.h);
        });
        
        // Add risk indicators
        this.addRiskIndicators(ctx, regions);
    }

    addRiskIndicators(ctx, regions) {
        regions.forEach(region => {
            if (region.risk > 0.7) {
                // High risk indicator
                ctx.fillStyle = '#dc3545';
                ctx.beginPath();
                ctx.arc(region.x + region.w/2, region.y + region.h/2, 3, 0, 2 * Math.PI);
                ctx.fill();
                
                // Pulsing effect
                ctx.strokeStyle = '#dc3545';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(region.x + region.w/2, region.y + region.h/2, 8, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
    }

    updateTrendPeriod(period) {
        // Update button states
        document.querySelectorAll('[id^="trend"]').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`trend${period.charAt(0).toUpperCase() + period.slice(1)}`).classList.add('active');
        
        // Update chart data based on period
        let labels, data;
        switch(period) {
            case 'daily':
                labels = Array.from({length: 7}, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    return date.toLocaleDateString('en-US', { weekday: 'short' });
                });
                data = Array.from({length: 7}, () => Math.floor(Math.random() * 100 + 50));
                break;
            case 'weekly':
                labels = Array.from({length: 12}, (_, i) => `Week ${i + 1}`);
                data = Array.from({length: 12}, () => Math.floor(Math.random() * 700 + 300));
                break;
            case 'monthly':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = Array.from({length: 12}, () => Math.floor(Math.random() * 3000 + 1500));
                break;
        }
        
        this.fraudTrendChart.data.labels = labels;
        this.fraudTrendChart.data.datasets[0].data = data;
        this.fraudTrendChart.data.datasets[1].data = data.map(d => Math.floor(d * 0.85));
        this.fraudTrendChart.update();
    }

    loadAnalyticsData() {
        // Simulate loading enterprise analytics data
        this.updateKPIs();
        this.updateComplianceStatus();
    }

    updateKPIs() {
        // Update key performance indicators with realistic values
        const kpis = {
            preventionSavings: '$' + (1.2 + Math.random() * 0.5).toFixed(1) + 'M',
            detectionAccuracy: (98.5 + Math.random() * 1).toFixed(1) + '%',
            falsePositiveRate: (0.5 + Math.random() * 0.5).toFixed(1) + '%',
            responseTime: Math.floor(40 + Math.random() * 20) + 'ms'
        };
        
        Object.keys(kpis).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = kpis[key];
            }
        });
    }

    updateComplianceStatus() {
        // Simulate compliance monitoring updates
        const complianceItems = document.querySelectorAll('.compliance-item .badge');
        complianceItems.forEach(badge => {
            if (Math.random() > 0.9) {
                badge.className = 'badge bg-warning';
                badge.textContent = 'Review Required';
            }
        });
    }

    startLiveUpdates() {
        // Update charts and data every 30 seconds
        setInterval(() => {
            this.updateKPIs();
            this.updateApiPerformanceChart();
        }, 30000);
    }

    updateApiPerformanceChart() {
        // Add new data point and remove oldest
        const newResponseTime = Math.random() * 20 + 40;
        this.apiPerformanceChart.data.datasets[0].data.push(newResponseTime);
        this.apiPerformanceChart.data.datasets[0].data.shift();
        this.apiPerformanceChart.update('none');
    }

    exportReport() {
        // Simulate report export
        this.showToast('Enterprise report exported successfully', 'success');
        
        // Create a simple CSV export simulation
        const csvContent = `Date,Fraud Attempts,Prevented,Savings
${new Date().toLocaleDateString()},75,71,$142000
${new Date(Date.now() - 86400000).toLocaleDateString()},82,78,$156000
${new Date(Date.now() - 172800000).toLocaleDateString()},69,65,$130000`;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sentinelscan-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    scheduleReport() {
        // Simulate report scheduling
        this.showToast('Weekly report scheduled for delivery', 'info');
        
        // Show modal for scheduling options (simplified)
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content bg-dark border-secondary">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-white">Schedule Report</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label text-muted">Frequency</label>
                            <select class="form-select bg-secondary border-secondary text-white">
                                <option>Daily</option>
                                <option selected>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted">Email Recipients</label>
                            <input type="email" class="form-control bg-secondary border-secondary text-white" 
                                   placeholder="admin@company.com">
                        </div>
                    </div>
                    <div class="modal-footer border-secondary">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Schedule</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    startLiveDemo() {
        // Simulate live demo with animated data
        this.showToast('Live demo mode activated', 'info');
        
        let demoInterval = setInterval(() => {
            // Animate fraud detection
            this.simulateRealTimeDetection();
            
            // Update charts with new data
            this.updateChartsForDemo();
        }, 2000);
        
        // Stop demo after 30 seconds
        setTimeout(() => {
            clearInterval(demoInterval);
            this.showToast('Live demo completed', 'success');
        }, 30000);
    }

    simulateRealTimeDetection() {
        // Simulate new transaction detection
        const riskLevel = Math.random();
        const alertLevel = riskLevel > 0.8 ? 'critical' : riskLevel > 0.6 ? 'high' : 'normal';
        
        if (alertLevel !== 'normal') {
            const transaction = {
                id: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                amount: Math.floor(Math.random() * 10000 + 1000),
                risk: riskLevel,
                country: ['Nigeria', 'Russia', 'China', 'Brazil'][Math.floor(Math.random() * 4)]
            };
            
            // Flash the relevant KPI
            this.flashKPI('detectionAccuracy');
        }
    }

    updateChartsForDemo() {
        // Add random data to charts for demo effect
        const newData = Math.floor(Math.random() * 50 + 25);
        
        // Update fraud trend chart
        this.fraudTrendChart.data.datasets[0].data.push(newData);
        this.fraudTrendChart.data.datasets[0].data.shift();
        this.fraudTrendChart.update('none');
    }

    flashKPI(kpiId) {
        const element = document.getElementById(kpiId);
        if (element) {
            element.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || document.body;
        const toastId = 'toast_' + Date.now();
        
        const bgClass = type === 'success' ? 'bg-success' : 
                       type === 'error' ? 'bg-danger' : 'bg-info';
        
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
        
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnterpriseAnalytics();
});