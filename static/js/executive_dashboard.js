class ExecutiveDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.setupNeuralNetwork();
        this.initializeCharts();
        this.startRealTimeUpdates();
        this.setupQuantumEffects();
    }

    setupNeuralNetwork() {
        const canvas = document.getElementById('neuralNetwork');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const nodes = [];
        const connections = [];
        
        // Create neural network nodes
        for (let i = 0; i < 50; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.3
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw nodes
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off edges
                if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
                if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
                
                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${node.alpha})`;
                ctx.fill();
                
                // Draw connections
                nodes.forEach((otherNode, j) => {
                    if (i !== j) {
                        const distance = Math.sqrt(
                            Math.pow(node.x - otherNode.x, 2) + 
                            Math.pow(node.y - otherNode.y, 2)
                        );
                        
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(otherNode.x, otherNode.y);
                            ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * (100 - distance) / 100})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                });
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    initializeCharts() {
        this.initializeThreatPredictionChart();
        this.initializeBiometricsChart();
        this.initializeVelocityChart();
        this.initializeNetworkChart();
        this.initializeGlobalThreatMap();
    }

    initializeThreatPredictionChart() {
        const ctx = document.getElementById('threatPredictionChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Now', '+1h', '+2h', '+3h', '+4h', '+5h'],
                datasets: [{
                    label: 'Threat Probability',
                    data: [15, 25, 45, 78, 94, 67],
                    borderColor: '#ff0040',
                    backgroundColor: 'rgba(255, 0, 64, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff0040',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
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
                        display: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#ffffff' }
                    },
                    y: { 
                        display: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#ffffff' },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    initializeBiometricsChart() {
        const ctx = document.getElementById('biometricsChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Keystroke', 'Mouse', 'Touch', 'Voice', 'Behavioral'],
                datasets: [{
                    label: 'Accuracy',
                    data: [99.96, 98.7, 99.2, 97.8, 99.1],
                    borderColor: '#00ffff',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    pointBackgroundColor: '#00ffff',
                    pointBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#ffffff' },
                        ticks: { color: '#ffffff', display: false }
                    }
                }
            }
        });
    }

    initializeVelocityChart() {
        const ctx = document.getElementById('velocityChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Normal', 'Suspicious', 'Critical'],
                datasets: [{
                    data: [847, 23, 7],
                    backgroundColor: ['#00ff80', '#ffff00', '#ff0040'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#ffffff' }
                    }
                }
            }
        });
    }

    initializeNetworkChart() {
        const ctx = document.getElementById('networkChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Banks', 'Fintech', 'Crypto', 'Retail', 'Gov'],
                datasets: [{
                    label: 'Connected Institutions',
                    data: [234, 189, 156, 178, 90],
                    backgroundColor: [
                        'rgba(0, 255, 255, 0.8)',
                        'rgba(255, 0, 255, 0.8)',
                        'rgba(255, 255, 0, 0.8)',
                        'rgba(0, 255, 128, 0.8)',
                        'rgba(255, 128, 0, 0.8)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 1
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
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#ffffff' }
                    },
                    y: { 
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#ffffff' }
                    }
                }
            }
        });
    }

    initializeGlobalThreatMap() {
        const canvas = document.getElementById('globalThreatMap');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Draw simplified world map
        ctx.fillStyle = '#1a1f3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw continents
        ctx.fillStyle = '#2d3748';
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 1;
        
        // North America
        ctx.beginPath();
        ctx.rect(canvas.width * 0.1, canvas.height * 0.2, canvas.width * 0.25, canvas.height * 0.4);
        ctx.fill();
        ctx.stroke();
        
        // Europe
        ctx.beginPath();
        ctx.rect(canvas.width * 0.4, canvas.height * 0.15, canvas.width * 0.2, canvas.height * 0.3);
        ctx.fill();
        ctx.stroke();
        
        // Asia
        ctx.beginPath();
        ctx.rect(canvas.width * 0.6, canvas.height * 0.1, canvas.width * 0.3, canvas.height * 0.5);
        ctx.fill();
        ctx.stroke();
        
        // Africa
        ctx.beginPath();
        ctx.rect(canvas.width * 0.45, canvas.height * 0.4, canvas.width * 0.15, canvas.height * 0.4);
        ctx.fill();
        ctx.stroke();
        
        // Australia
        ctx.beginPath();
        ctx.rect(canvas.width * 0.7, canvas.height * 0.7, canvas.width * 0.15, canvas.height * 0.15);
        ctx.fill();
        ctx.stroke();
        
        // Add threat indicators
        this.addThreatIndicators(ctx, canvas);
    }

    addThreatIndicators(ctx, canvas) {
        const threats = [
            { x: 0.2, y: 0.3, level: 'critical' },
            { x: 0.45, y: 0.25, level: 'high' },
            { x: 0.7, y: 0.35, level: 'medium' },
            { x: 0.15, y: 0.5, level: 'critical' },
            { x: 0.8, y: 0.2, level: 'high' }
        ];
        
        threats.forEach(threat => {
            const x = threat.x * canvas.width;
            const y = threat.y * canvas.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            
            switch(threat.level) {
                case 'critical':
                    ctx.fillStyle = '#ff0040';
                    ctx.shadowColor = '#ff0040';
                    break;
                case 'high':
                    ctx.fillStyle = '#ff8000';
                    ctx.shadowColor = '#ff8000';
                    break;
                case 'medium':
                    ctx.fillStyle = '#ffff00';
                    ctx.shadowColor = '#ffff00';
                    break;
            }
            
            ctx.shadowBlur = 20;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }

    startRealTimeUpdates() {
        // Update threat metrics every 2 seconds
        setInterval(() => {
            this.updateThreatMetrics();
            this.updateGlobalThreats();
        }, 2000);
        
        // Update AI predictions every 5 seconds
        setInterval(() => {
            this.updateAIPredictions();
        }, 5000);
    }

    updateThreatMetrics() {
        // Simulate real-time threat detection
        const fraudPrevented = document.querySelector('.metric-value');
        if (fraudPrevented) {
            const currentValue = parseInt(fraudPrevented.textContent.replace('$', '').replace('M', ''));
            const newValue = currentValue + Math.random() * 2;
            fraudPrevented.textContent = `$${Math.round(newValue)}M`;
        }
        
        // Update active threats
        const threatsElement = document.querySelectorAll('.metric-value')[2];
        if (threatsElement) {
            const currentThreats = parseInt(threatsElement.textContent);
            const newThreats = Math.max(1, currentThreats + Math.floor(Math.random() * 6 - 3));
            threatsElement.textContent = newThreats;
        }
    }

    updateGlobalThreats() {
        // Add new threat points randomly
        const threatPoints = document.querySelectorAll('.risk-heatpoint');
        threatPoints.forEach(point => {
            if (Math.random() < 0.1) {
                point.style.top = Math.random() * 80 + '%';
                point.style.left = Math.random() * 90 + '%';
            }
        });
    }

    updateAIPredictions() {
        // Simulate AI learning and prediction updates
        const insights = document.querySelectorAll('.ai-insights small');
        insights.forEach(insight => {
            if (Math.random() < 0.3) {
                insight.style.animation = 'pulse-risk 1s ease-in-out';
                setTimeout(() => {
                    insight.style.animation = '';
                }, 1000);
            }
        });
    }

    setupQuantumEffects() {
        // Add quantum button effects
        document.querySelectorAll('.quantum-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Create quantum ripple effect
                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.width = '100px';
                ripple.style.height = '100px';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'radial-gradient(circle, rgba(0,255,255,0.6) 0%, transparent 70%)';
                ripple.style.left = e.clientX - 50 + 'px';
                ripple.style.top = e.clientY - 50 + 'px';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'quantum-ripple 0.6s ease-out';
                ripple.style.zIndex = '9999';
                
                document.body.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Show quantum action feedback
                this.showQuantumFeedback(button.textContent);
            });
        });
        
        // Add quantum ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes quantum-ripple {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(3); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    showQuantumFeedback(action) {
        const feedback = document.createElement('div');
        feedback.className = 'quantum-feedback';
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, rgba(0,255,255,0.9), rgba(255,0,255,0.9));
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0,255,255,0.3);
        `;
        
        feedback.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${action} - Quantum Command Executed
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
}

// Initialize Executive Dashboard
document.addEventListener('DOMContentLoaded', () => {
    new ExecutiveDashboard();
});

// Handle window resize for neural network
window.addEventListener('resize', () => {
    const canvas = document.getElementById('neuralNetwork');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});