class InvestorPresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 6;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.initializeCharts();
        this.setupKeyboardNavigation();
        this.startAnimations();
    }

    setupNavigation() {
        const navDots = document.querySelectorAll('.nav-dot');
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                this.nextSlide();
            } else if (e.key === 'ArrowLeft') {
                this.previousSlide();
            }
        });
    }

    goToSlide(slideNumber) {
        this.currentSlide = slideNumber;
        
        // Update navigation dots
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === slideNumber);
        });
        
        // Scroll to slide
        const targetSlide = document.getElementById(`slide-${slideNumber}`);
        targetSlide.scrollIntoView({ behavior: 'smooth' });
        
        // Trigger slide-specific animations
        this.triggerSlideAnimations(slideNumber);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    initializeCharts() {
        this.initializeMarketChart();
        this.initializeRevenueChart();
        this.initializeClientChart();
    }

    initializeMarketChart() {
        const ctx = document.getElementById('marketChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
                datasets: [{
                    label: 'Market Size (Billions)',
                    data: [28.1, 34.2, 41.8, 51.2, 62.8, 72.4, 85.4],
                    backgroundColor: 'rgba(0, 255, 255, 0.8)',
                    borderColor: '#00ffff',
                    borderWidth: 2
                }]
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

    initializeRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                datasets: [{
                    label: 'Revenue (Millions)',
                    data: [5, 25, 100, 250, 500],
                    borderColor: '#00ff80',
                    backgroundColor: 'rgba(0, 255, 128, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00ff80',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
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

    initializeClientChart() {
        const ctx = document.getElementById('clientChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Tier 1 Banks', 'Tier 2 Institutions', 'Tier 3 Enterprise', 'Fintech'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        'rgba(0, 255, 255, 0.8)',
                        'rgba(255, 255, 0, 0.8)',
                        'rgba(255, 0, 255, 0.8)',
                        'rgba(0, 255, 128, 0.8)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
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

    startAnimations() {
        // Animate metric boxes on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.8s ease-out';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.metric-box').forEach(box => {
            observer.observe(box);
        });
    }

    triggerSlideAnimations(slideNumber) {
        switch(slideNumber) {
            case 0:
                this.animateTitle();
                break;
            case 3:
                this.animateCounters();
                break;
            case 4:
                this.animateAcquisitionOffers();
                break;
        }
    }

    animateTitle() {
        const title = document.querySelector('.hero-title');
        title.style.animation = 'none';
        setTimeout(() => {
            title.style.animation = 'fadeInScale 1.5s ease-out';
        }, 100);
    }

    animateCounters() {
        this.animateCounter('revenue-counter', 0, 100, '$', 'M', 2000);
        this.animateCounter('clients-counter', 0, 150, '', '', 2500);
        this.animateCounter('saved-counter', 0, 2.5, '$', 'B', 3000);
        this.animateCounter('margin-counter', 0, 87, '', '%', 2200);
    }

    animateCounter(id, start, end, prefix = '', suffix = '', duration = 2000) {
        const element = document.getElementById(id);
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOut;
            
            if (suffix === 'B') {
                element.textContent = `${prefix}${current.toFixed(1)}${suffix}`;
            } else if (suffix === '%') {
                element.textContent = `${Math.round(current)}${suffix}`;
            } else {
                element.textContent = `${prefix}${Math.round(current)}${suffix}`;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }

    animateAcquisitionOffers() {
        const offers = document.querySelectorAll('#slide-4 .metric-box');
        offers.forEach((offer, index) => {
            setTimeout(() => {
                offer.style.animation = 'bounceIn 0.8s ease-out';
            }, index * 200);
        });
    }
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        0% { transform: translateY(50px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fadeInScale {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .slide {
        scroll-snap-align: start;
    }
    
    html {
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
    }
`;
document.head.appendChild(style);

// Initialize presentation
document.addEventListener('DOMContentLoaded', () => {
    new InvestorPresentation();
});

// Handle presentation mode
document.addEventListener('keydown', (e) => {
    if (e.key === 'F5' || (e.key === 'F11')) {
        e.preventDefault();
        document.documentElement.requestFullscreen();
    }
});