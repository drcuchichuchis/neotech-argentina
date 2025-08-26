// Script for Bento Grid Landing Page
// Neo-tech Argentina - Modern IT Solutions

// Configuration
const CONFIG = {
    whatsapp: {
        number: '541169276629',
        message: 'Hola! Me interesa conocer más sobre los servicios de Neo-tech Argentina.'
    },
    animation: {
        duration: 1000,
        easing: 'ease-out'
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeForm();
    initializeOrbitAnimation();
    initializeParallax();
    initializeGlowEffects();
    initializeServiceCards();
    initializeCounters();
});

// Smooth scroll navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.floating-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Orbit animation for hero section
function initializeOrbitAnimation() {
    const planets = document.querySelectorAll('.planet');
    
    planets.forEach((planet, index) => {
        const radius = 150 + (index * 50);
        const speed = 0.5 + (index * 0.2);
        let angle = index * (Math.PI / 3);
        
        function animate() {
            angle += speed * 0.01;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            planet.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(animate);
        }
        
        animate();
    });
}

// Form handling
function initializeForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.querySelector('.form-message');
    
    if (form) {
        // Floating labels
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!data.name || !data.email || !data.message) {
                showMessage('error', 'Por favor complete todos los campos requeridos.');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('error', 'Por favor ingrese un email válido.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            // Send to WhatsApp
            setTimeout(() => {
                const whatsappMessage = `
*Nuevo contacto desde la web*
*Nombre:* ${data.name}
*Email:* ${data.email}
*Teléfono:* ${data.phone || 'No especificado'}
*Servicio:* ${data.service || 'No especificado'}
*Mensaje:* ${data.message}
                `.trim();
                
                const whatsappUrl = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(whatsappUrl, '_blank');
                
                // Reset form
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
                showMessage('success', '¡Mensaje enviado! Nos contactaremos pronto.');
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }
    
    function showMessage(type, text) {
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = text;
        formMessage.style.display = 'block';
    }
}

// Parallax scrolling effect
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Glow effects on mouse move
function initializeGlowEffects() {
    const glowCards = document.querySelectorAll('.bento-card');
    
    glowCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Service cards hover effects
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const icon = card.querySelector('.service-icon');
        
        card.addEventListener('mouseenter', function() {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Animated counters for stats
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        if (counter.dataset.suffix) {
                            counter.textContent += counter.dataset.suffix;
                        }
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize animations on scroll
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.bento-card, .fade-in');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => observer.observe(element));
}

// WhatsApp bubble functionality
document.addEventListener('DOMContentLoaded', function() {
    const whatsappBubble = document.querySelector('.whatsapp-bubble');
    
    if (whatsappBubble) {
        whatsappBubble.addEventListener('click', function(e) {
            e.preventDefault();
            const url = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(CONFIG.whatsapp.message)}`;
            window.open(url, '_blank');
        });
    }
});

// Pricing cards interaction
document.addEventListener('DOMContentLoaded', function() {
    const priceButtons = document.querySelectorAll('.price-btn');
    
    priceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.closest('.price-box').querySelector('h3').textContent;
            const message = `Hola! Me interesa el ${plan} de Neo-tech Argentina.`;
            const url = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    });
});

// Mobile menu toggle (if needed)
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.display = 'none';
    
    const header = document.querySelector('.header-glass');
    const nav = document.querySelector('.mini-nav');
    
    // Check if mobile
    function checkMobile() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            if (nav) nav.classList.add('mobile-hidden');
        } else {
            mobileMenuBtn.style.display = 'none';
            if (nav) nav.classList.remove('mobile-hidden');
        }
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        if (nav) {
            nav.classList.toggle('mobile-hidden');
            nav.classList.toggle('mobile-visible');
        }
    });
    
    if (header) {
        header.appendChild(mobileMenuBtn);
    }
});

// Background gradient animation
document.addEventListener('DOMContentLoaded', function() {
    const gradientBg = document.querySelector('.gradient-bg');
    
    if (gradientBg) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 100;
            mouseY = (e.clientY / window.innerHeight) * 100;
        });
        
        function animate() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            
            gradientBg.style.background = `
                radial-gradient(circle at ${currentX}% ${currentY}%, 
                    rgba(245, 158, 11, 0.1) 0%, 
                    transparent 50%),
                radial-gradient(circle at ${100 - currentX}% ${100 - currentY}%, 
                    rgba(139, 92, 246, 0.1) 0%, 
                    transparent 50%),
                var(--bg-dark)
            `;
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
});

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Update navigation active state
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', debouncedScroll);

// SEO Dashboard Functions
function initializeSEODashboard() {
    updateSEOMetrics();
    startLiveUpdates();
    animateMetrics();
}

function updateSEOMetrics() {
    // Simulate real-time data updates
    const metrics = {
        seoScore: { current: 88.6, change: 3.1 },
        organicTraffic: { current: 2847, change: 70 },
        keywordsRanking: { current: 156, change: 12 },
        ctrRate: { current: 4.55, change: 0.73 }
    };
    
    // Update metric values with animation
    Object.keys(metrics).forEach(key => {
        const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (element) {
            animateValue(element, metrics[key].current);
        }
    });
}

function animateValue(element, targetValue) {
    const startValue = parseFloat(element.textContent) || 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (targetValue - startValue) * easeOutCubic(progress);
        
        if (element.id === 'ctr-rate') {
            element.textContent = currentValue.toFixed(2) + '%';
        } else {
            element.textContent = Math.round(currentValue).toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function startLiveUpdates() {
    const liveFeed = document.getElementById('seo-live-feed');
    if (!liveFeed) return;
    
    const updates = [
        'Keyword "soporte técnico argentina" subió 3 posiciones',
        'Nuevo backlink de alta autoridad detectado',
        'Velocidad de carga mejoró 15% en mobile',
        'CTR aumentó 0.8% en búsquedas locales',
        'Meta description optimizada para 5 páginas',
        'Schema markup implementado correctamente',
        'Core Web Vitals mejorados significativamente'
    ];
    
    let updateIndex = 0;
    
    setInterval(() => {
        addLiveUpdate(updates[updateIndex % updates.length]);
        updateIndex++;
    }, 15000); // New update every 15 seconds
}

function addLiveUpdate(message) {
    const liveFeed = document.getElementById('seo-live-feed');
    if (!liveFeed) return;
    
    const updateItem = document.createElement('div');
    updateItem.className = 'live-update-item';
    updateItem.style.opacity = '0';
    updateItem.style.transform = 'translateY(10px)';
    
    const now = new Date();
    const timeText = 'Hace ' + Math.floor(Math.random() * 5 + 1) + ' min';
    
    updateItem.innerHTML = `
        <span class="update-time">${timeText}</span>
        <span class="update-text">${message}</span>
    `;
    
    // Remove oldest update if more than 3
    const existingUpdates = liveFeed.querySelectorAll('.live-update-item');
    if (existingUpdates.length >= 3) {
        existingUpdates[existingUpdates.length - 1].remove();
    }
    
    // Insert new update at the top
    const header = liveFeed.querySelector('.live-update-header');
    liveFeed.insertBefore(updateItem, header.nextSibling);
    
    // Animate in
    requestAnimationFrame(() => {
        updateItem.style.transition = 'all 0.3s ease';
        updateItem.style.opacity = '1';
        updateItem.style.transform = 'translateY(0)';
    });
}

function animateMetrics() {
    const metricItems = document.querySelectorAll('.metric-item');
    
    metricItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function showSEOReport() {
    // Create modal or redirect to detailed report
    const reportData = {
        timestamp: new Date().toLocaleString('es-AR'),
        metrics: {
            seoScore: 88.6,
            organicTraffic: 2847,
            keywordsRanking: 156,
            ctrRate: 4.55
        },
        improvements: [
            'Meta tags optimizados en 15 páginas',
            'Velocidad de carga mejorada 25%',
            'Schema markup implementado',
            'Core Web Vitals optimizados'
        ]
    };
    
    alert(`📊 Reporte SEO Generado\n\nFecha: ${reportData.timestamp}\n\nMétricas Principales:\n• SEO Score: ${reportData.metrics.seoScore}\n• Tráfico Orgánico: ${reportData.metrics.organicTraffic}\n• Keywords Top 10: ${reportData.metrics.keywordsRanking}\n• CTR Promedio: ${reportData.metrics.ctrRate}%\n\nMejoras Implementadas:\n${reportData.improvements.map(item => '• ' + item).join('\n')}`);
}

// Initialize SEO Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add small delay to ensure all elements are rendered
    setTimeout(initializeSEODashboard, 500);
    setTimeout(initializeRankingTracker, 600);
    setTimeout(initializePerformanceIndicators, 700);
});

// Performance Indicators Functions
function initializePerformanceIndicators() {
    updatePerformanceMetrics();
    startPerformanceUpdates();
    animatePerformanceMetrics();
}

function updatePerformanceMetrics() {
    const metrics = {
        pageSpeed: Math.floor(Math.random() * 10) + 90,
        seoScore: Math.floor(Math.random() * 5) + 95,
        performance: Math.floor(Math.random() * 15) + 85,
        accessibility: Math.floor(Math.random() * 5) + 95,
        loadTime: (Math.random() * 0.8 + 0.8).toFixed(1)
    };
    
    // Update metric values with animation
     const pageSpeedEl = document.getElementById('page-speed');
     const seoScoreEl = document.getElementById('seo-score');
     const performanceEl = document.getElementById('performance-score');
     const accessibilityEl = document.getElementById('accessibility-score');
     
     if (pageSpeedEl) {
         const currentValue = parseInt(pageSpeedEl.textContent) || 95;
         animateValue('page-speed', currentValue, metrics.pageSpeed, 1000);
     }
     if (seoScoreEl) {
         const currentValue = parseInt(seoScoreEl.textContent) || 98;
         animateValue('seo-score', currentValue, metrics.seoScore, 1000);
     }
     if (performanceEl) {
         const currentValue = parseInt(performanceEl.textContent) || 92;
         animateValue('performance-score', currentValue, metrics.performance, 1000);
     }
     if (accessibilityEl) {
         const currentValue = parseInt(accessibilityEl.textContent) || 100;
         animateValue('accessibility-score', currentValue, metrics.accessibility, 1000);
     }
    
    // Update load time
    setTimeout(() => {
        const loadTimeEl = document.getElementById('load-time');
        if (loadTimeEl) loadTimeEl.textContent = metrics.loadTime + 's';
    }, 500);
    
    // Update trends
    updatePerformanceTrends();
    
    // Update last optimization time
    updateLastOptimization();
}

function updatePerformanceTrends() {
    const trends = document.querySelectorAll('.performance-metric .metric-trend');
    trends.forEach(trend => {
        const change = Math.floor(Math.random() * 10) - 3; // -3 to +6
        const absChange = Math.abs(change);
        
        if (change > 0) {
            trend.className = 'metric-trend positive';
            trend.textContent = `+${absChange} pts`;
        } else if (change < 0) {
            trend.className = 'metric-trend negative';
            trend.textContent = `-${absChange} pts`;
        } else {
            trend.className = 'metric-trend neutral';
            trend.textContent = '0 pts';
        }
    });
}

function updateLastOptimization() {
    const now = new Date();
    const minutes = Math.floor(Math.random() * 10) + 1;
    const timeText = minutes === 1 ? 'Hace 1 min' : `Hace ${minutes} min`;
    
    setTimeout(() => {
        const lastOptEl = document.getElementById('last-optimization');
        if (lastOptEl) lastOptEl.textContent = timeText;
    }, 800);
}

function startPerformanceUpdates() {
    // Update metrics every 30 seconds
    setInterval(() => {
        updatePerformanceMetrics();
    }, 30000);
    
    // Update status indicator
    const statusDot = document.querySelector('.performance-status .status-dot');
    if (statusDot) {
        setInterval(() => {
            statusDot.style.opacity = '0.3';
            setTimeout(() => {
                statusDot.style.opacity = '1';
            }, 200);
        }, 3000);
    }
}

function animatePerformanceMetrics() {
    const metrics = document.querySelectorAll('.performance-metric');
    metrics.forEach((metric, index) => {
        metric.style.opacity = '0';
        metric.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            metric.style.transition = 'all 0.6s ease';
            metric.style.opacity = '1';
            metric.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function togglePerformanceIndicators() {
    const indicators = document.querySelector('.performance-indicators');
    if (indicators) {
        indicators.style.display = indicators.style.display === 'none' ? 'block' : 'none';
    }
}

// Export for external use if needed
window.NeoTech = {
    config: CONFIG,
    showContactForm: () => {
        const contactSection = document.querySelector('#contacto');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    },
    sendWhatsApp: (message) => {
        const url = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message || CONFIG.whatsapp.message)}`;
        window.open(url, '_blank');
    },
    showSEOReport: showSEOReport,
    updateSEOMetrics: updateSEOMetrics,
    refreshRankings: refreshRankings,
    initializeRankingTracker: initializeRankingTracker,
    initializePerformanceIndicators: initializePerformanceIndicators,
    updatePerformanceMetrics: updatePerformanceMetrics,
    togglePerformanceIndicators: togglePerformanceIndicators
};

// Initialize ranking tracker
function initializeRankingTracker() {
    setupRankingControls();
    startRankingUpdates();
    animateRankingStats();
}

// Setup ranking period controls
function setupRankingControls() {
    const buttons = document.querySelectorAll('.ranking-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateRankingData(this.dataset.period);
        });
    });
}

// Update ranking data based on period
function updateRankingData(period) {
    const data = {
        today: {
            gained: 23,
            topTen: 156,
            improvements: 89,
            keywords: [
                { text: 'soporte técnico argentina', volume: '2.1K', position: 3, change: 5 },
                { text: 'desarrollo web argentina', volume: '1.8K', position: 7, change: 3 },
                { text: 'call center en la nube', volume: '950', position: 5, change: 2 },
                { text: 'transformación digital empresarial', volume: '1.3K', position: 4, change: 7 },
                { text: 'automatización inteligente', volume: '720', position: 6, change: 4 }
            ]
        },
        week: {
            gained: 87,
            topTen: 142,
            improvements: 76,
            keywords: [
                { text: 'soporte técnico argentina', volume: '2.1K', position: 3, change: 12 },
                { text: 'desarrollo web argentina', volume: '1.8K', position: 7, change: 8 },
                { text: 'call center en la nube', volume: '950', position: 5, change: 15 },
                { text: 'transformación digital empresarial', volume: '1.3K', position: 4, change: 18 },
                { text: 'automatización inteligente', volume: '720', position: 6, change: 11 }
            ]
        },
        month: {
            gained: 234,
            topTen: 178,
            improvements: 82,
            keywords: [
                { text: 'soporte técnico argentina', volume: '2.1K', position: 3, change: 25 },
                { text: 'desarrollo web argentina', volume: '1.8K', position: 7, change: 19 },
                { text: 'call center en la nube', volume: '950', position: 5, change: 32 },
                { text: 'transformación digital empresarial', volume: '1.3K', position: 4, change: 28 },
                { text: 'automatización inteligente', volume: '720', position: 6, change: 22 }
            ]
        }
    };
    
    const currentData = data[period];
    
    // Update summary stats
    const stats = document.querySelectorAll('.ranking-stat .stat-number');
    if (stats.length >= 3) {
        animateValue(stats[0], parseInt(stats[0].textContent.replace('+', '')), currentData.gained, 1000, '+');
        animateValue(stats[1], parseInt(stats[1].textContent), currentData.topTen, 1000);
        animateValue(stats[2], parseInt(stats[2].textContent.replace('%', '')), currentData.improvements, 1000, '', '%');
    }
    
    // Update keywords list
    updateKeywordsList(currentData.keywords);
}

// Update keywords list
function updateKeywordsList(keywords) {
    const container = document.getElementById('keywords-tracker');
    if (!container) return;
    
    container.innerHTML = '';
    
    keywords.forEach((keyword, index) => {
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'keyword-item';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            item.innerHTML = `
                <div class="keyword-info">
                    <span class="keyword-text">${keyword.text}</span>
                    <span class="keyword-volume">${keyword.volume} búsquedas/mes</span>
                </div>
                <div class="position-change">
                    <span class="current-position">${keyword.position}</span>
                    <div class="position-arrow up">↗ +${keyword.change}</div>
                </div>
            `;
            
            container.appendChild(item);
            
            // Animate in
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

// Start ranking updates simulation
function startRankingUpdates() {
    setInterval(() => {
        // Simulate random position changes
        const items = document.querySelectorAll('.keyword-item');
        if (items.length > 0) {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            const arrow = randomItem.querySelector('.position-arrow');
            if (arrow) {
                // Flash effect to show update
                arrow.style.background = 'rgba(0, 212, 255, 0.3)';
                setTimeout(() => {
                    arrow.style.background = 'rgba(74, 222, 128, 0.1)';
                }, 1000);
            }
        }
    }, 15000); // Update every 15 seconds
}

// Animate ranking stats on load
function animateRankingStats() {
    const stats = document.querySelectorAll('.ranking-stat');
    stats.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(30px)';
            stat.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, 50);
        }, index * 200);
    });
}

// Refresh rankings function
function refreshRankings() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = '🔄 Actualizando...';
    button.disabled = true;
    
    // Simulate refresh
    setTimeout(() => {
        const activeBtn = document.querySelector('.ranking-btn.active');
        if (activeBtn) {
            updateRankingData(activeBtn.dataset.period);
        }
        
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        message.textContent = '✅ Rankings actualizados exitosamente';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }, 2000);
}
