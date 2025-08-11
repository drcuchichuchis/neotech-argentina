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
    }
};
