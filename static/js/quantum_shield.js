class QuantumShield {
    constructor() {
        this.init();
    }

    init() {
        this.setupQuantumMatrix();
        this.startTerminalUpdates();
        this.initializeDefenseControls();
        this.startThreatSimulation();
    }

    setupQuantumMatrix() {
        const canvas = document.getElementById('quantumMatrix');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const connectionDistance = 120;
        
        // Create quantum particles
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 3 + 1,
                alpha: Math.random() * 0.8 + 0.2,
                color: this.getQuantumColor()
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach((particle, i) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
                if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;
                
                // Draw particle with quantum glow
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                
                // Create quantum glow effect
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.radius * 3
                );
                gradient.addColorStop(0, particle.color + particle.alpha + ')');
                gradient.addColorStop(1, particle.color + '0)');
                
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Draw quantum connections
                particles.forEach((otherParticle, j) => {
                    if (i !== j) {
                        const distance = Math.sqrt(
                            Math.pow(particle.x - otherParticle.x, 2) + 
                            Math.pow(particle.y - otherParticle.y, 2)
                        );
                        
                        if (distance < connectionDistance) {
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(otherParticle.x, otherParticle.y);
                            
                            const opacity = (connectionDistance - distance) / connectionDistance * 0.3;
                            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
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

    getQuantumColor() {
        const colors = [
            'rgba(0, 255, 255, ',   // Cyan
            'rgba(255, 0, 255, ',   // Magenta
            'rgba(255, 255, 0, ',   // Yellow
            'rgba(0, 255, 128, ',   // Green-cyan
            'rgba(128, 0, 255, '    // Purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    startTerminalUpdates() {
        const terminal = document.getElementById('quantumTerminal');
        const messages = [
            '[QUANTUM-SCAN] Detecting quantum signatures across 847 networks',
            '[AI-LEARNING] Neural pathways optimized: +0.03% accuracy',
            '[BIOMETRIC] Analyzing micro-expressions: 99.94% confidence',
            '[THREAT-INTEL] Advanced persistent threat neutralized: 0.7ms',
            '[DEFENSE] Quantum entanglement established with 156 nodes',
            '[WARNING] Attempted cryptocurrency theft blocked: $2.3M saved',
            '[SUCCESS] Deepfake detection: 99.97% accuracy maintained',
            '[INFO] Post-quantum cryptography: All channels secure',
            '[NETWORK] Self-healing protocols activated: 100% uptime',
            '[AI-PREDICTION] Forecasting next attack vector: 94.7% confidence',
            '[QUANTUM-CORE] Superposition state maintained: Infinite capacity',
            '[BIOMETRIC] Voice pattern analysis: Spoofing attempt blocked'
        ];
        
        setInterval(() => {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const timestamp = new Date().toLocaleTimeString();
            
            // Add new message
            const newLine = document.createElement('div');
            newLine.className = 'mb-2';
            newLine.innerHTML = `[${timestamp}] ${randomMessage}`;
            
            // Add before the command prompt
            const commandPrompt = terminal.lastElementChild;
            terminal.insertBefore(newLine, commandPrompt);
            
            // Keep only last 15 messages
            const messages = terminal.querySelectorAll('.mb-2');
            if (messages.length > 15) {
                messages[0].remove();
            }
            
            // Auto-scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
            
            // Add visual effect
            newLine.style.animation = 'fadeInLeft 0.5s ease-out';
        }, 2000);
    }

    initializeDefenseControls() {
        const buttons = document.querySelectorAll('.quantum-button-shield');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.executeQuantumCommand(button);
            });
        });
    }

    executeQuantumCommand(button) {
        const commandText = button.textContent.trim();
        const terminal = document.getElementById('quantumTerminal');
        
        // Add command to terminal
        const commandLine = document.createElement('div');
        commandLine.className = 'mb-2 text-warning';
        commandLine.innerHTML = `[USER] Executing: ${commandText}`;
        
        const commandPrompt = terminal.lastElementChild;
        terminal.insertBefore(commandLine, commandPrompt);
        
        // Create quantum ripple effect
        this.createQuantumRipple(button);
        
        // Add response after delay
        setTimeout(() => {
            const response = this.getCommandResponse(commandText);
            const responseLine = document.createElement('div');
            responseLine.className = 'mb-2 text-success';
            responseLine.innerHTML = `[SYSTEM] ${response}`;
            
            terminal.insertBefore(responseLine, commandPrompt);
            terminal.scrollTop = terminal.scrollHeight;
        }, 1000);
        
        // Update metrics
        this.updateQuantumMetrics();
    }

    getCommandResponse(command) {
        const responses = {
            'Initialize Quantum Shield': 'Quantum shield matrix activated: 99.98% threat coverage',
            'Deploy AI Counterstrike': 'AI countermeasures deployed: 47 threats neutralized',
            'Activate Bio-Defense': 'Biometric defense layer enabled: 847K patterns loaded',
            'Launch Global Scan': 'Global quantum scan initiated: 156 countries monitored',
            'Enable Self-Healing': 'Self-healing protocols activated: Infinite resilience mode'
        };
        
        for (const key in responses) {
            if (command.includes(key)) {
                return responses[key];
            }
        }
        
        return 'Quantum command executed successfully: All systems operational';
    }

    createQuantumRipple(button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: fixed;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0,255,255,0.6) 0%, transparent 70%);
            left: ${rect.left + rect.width/2 - 100}px;
            top: ${rect.top + rect.height/2 - 100}px;
            pointer-events: none;
            animation: quantum-ripple 1s ease-out;
            z-index: 9999;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
        
        // Add button feedback
        button.style.transform = 'scale(0.95)';
        button.style.boxShadow = '0 5px 15px rgba(0, 255, 255, 0.6)';
        
        setTimeout(() => {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 200);
    }

    updateQuantumMetrics() {
        // Update security metrics with random improvements
        const metrics = document.querySelectorAll('.metric-value-large');
        
        metrics.forEach((metric, index) => {
            if (metric.textContent.includes('%')) {
                const currentValue = parseFloat(metric.textContent);
                const newValue = Math.min(99.99, currentValue + Math.random() * 0.01);
                metric.textContent = newValue.toFixed(2) + '%';
            } else if (metric.textContent.includes('ms')) {
                const currentValue = parseFloat(metric.textContent);
                const newValue = Math.max(0.1, currentValue - Math.random() * 0.1);
                metric.textContent = newValue.toFixed(1) + 'ms';
            }
        });
        
        // Flash metric for visual feedback
        metrics.forEach(metric => {
            metric.style.animation = 'gradient-shift 0.5s ease-in-out';
            setTimeout(() => {
                metric.style.animation = '';
            }, 500);
        });
    }

    startThreatSimulation() {
        setInterval(() => {
            this.simulateNewThreat();
            this.updateDefenseLayers();
        }, 5000);
        
        setInterval(() => {
            this.updateThreatLevels();
        }, 3000);
    }

    simulateNewThreat() {
        const threatTypes = [
            'Quantum Computing Attack',
            'AI-Generated Social Engineering',
            'Deepfake Authentication Bypass',
            'Advanced Persistent Threat',
            'Behavioral Cloning Attempt',
            'Cryptocurrency Mining Malware',
            'Zero-Day Exploit Detection',
            'Biometric Spoofing Attack'
        ];
        
        const origins = [
            'Eastern Europe',
            'Southeast Asia',
            'Dark Web',
            'State Actor',
            'Cybercriminal Group',
            'Unknown Origin'
        ];
        
        const threatContainer = document.querySelector('.col-lg-4 .shield-container');
        const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        const origin = origins[Math.floor(Math.random() * origins.length)];
        
        const threatElement = document.createElement('div');
        threatElement.className = 'attack-vector';
        threatElement.innerHTML = `
            <div class="d-flex justify-content-between">
                <span class="text-light">${threatType}</span>
                <span class="badge bg-warning">DETECTED</span>
            </div>
            <small class="text-muted">Origin: ${origin} | Analyzing threat signature</small>
        `;
        
        // Insert after the header
        const header = threatContainer.querySelector('h4');
        header.parentNode.insertBefore(threatElement, header.nextSibling);
        
        // Auto-neutralize after 3 seconds
        setTimeout(() => {
            threatElement.className = 'attack-vector defense-active';
            threatElement.querySelector('.badge').textContent = 'NEUTRALIZED';
            threatElement.querySelector('.badge').className = 'badge bg-success';
            threatElement.querySelector('small').textContent = 'Quantum defense protocols activated | Threat eliminated';
        }, 3000);
        
        // Remove old threats
        const threats = threatContainer.querySelectorAll('.attack-vector');
        if (threats.length > 6) {
            threats[threats.length - 1].remove();
        }
    }

    updateDefenseLayers() {
        const layers = document.querySelectorAll('.defense-layer');
        
        layers.forEach((layer, index) => {
            // Random pulse effect
            if (Math.random() < 0.3) {
                layer.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
                setTimeout(() => {
                    layer.style.boxShadow = '';
                }, 1000);
            }
        });
    }

    updateThreatLevels() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width);
            const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
            const newWidth = Math.max(5, Math.min(95, currentWidth + change));
            
            bar.style.width = newWidth + '%';
            
            const level = bar.textContent.split(':')[0];
            bar.textContent = `${level}: ${newWidth}%`;
        });
    }
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes quantum-ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes fadeInLeft {
        0% { transform: translateX(-20px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize Quantum Shield
document.addEventListener('DOMContentLoaded', () => {
    new QuantumShield();
});

// Handle window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('quantumMatrix');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});