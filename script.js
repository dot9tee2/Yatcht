// ===== PRELOADER FUNCTIONALITY =====
class PreloaderManager {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressBar = document.querySelector('.preloader__progress-bar');
        this.isLoaded = false;
        this.minDisplayTime = 5000; // Minimum 5 seconds to see full animation
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        if (!this.preloader) return;
        
        // Ensure preloader is visible initially
        this.preloader.style.display = 'flex';
        
        // Start GSAP animations
        this.startGSAPAnimation();
        
        // Start progress simulation
        this.simulateProgress();
        
        // Hide preloader when page is fully loaded
        if (document.readyState === 'complete') {
            this.handlePageLoad();
        } else {
            window.addEventListener('load', () => this.handlePageLoad());
        }
        
        // Fallback: hide preloader after maximum time
        setTimeout(() => {
            if (!this.isLoaded) {
                this.hidePreloader();
            }
        }, 10000);
    }
    
    startGSAPAnimation() {
        if (typeof gsap === 'undefined') return;
        
        // Get the new SVG elements
        this.burjContainer = document.querySelector('.burj-container');
        this.yachtContainer = document.querySelector('.yacht-container');
        this.sunsetContainer = document.querySelector('.sunset-container');
        
        if (!this.burjContainer || !this.yachtContainer || !this.sunsetContainer) return;
        
        // Create GSAP timeline
        const tl = gsap.timeline({ repeat: -1 });
        
        // Initial state - all hidden
        gsap.set([this.burjContainer, this.yachtContainer, this.sunsetContainer], { 
            opacity: 0, 
            scale: 0.3, 
            rotation: -180 
        });
        
        // 1. Burj Al Arab appears first
        tl.to(this.burjContainer, {
            duration: 1,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "elastic.out(1, 0.6)"
        })
        
        // 2. Burj floating animation
        .to(this.burjContainer, {
            duration: 1.5,
            y: -10,
            scale: 1.05,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1
        }, 1.2)
        
        // 3. Transition to yacht - Burj fades out, yacht fades in
        .to(this.burjContainer, {
            duration: 0.6,
            opacity: 0,
            scale: 0.8,
            rotation: 45,
            ease: "power2.in"
        }, 3)
        .to(this.yachtContainer, {
            duration: 1,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "back.out(1.7)"
        }, 3.2)
        
        // 4. Yacht sailing animation
        .to(this.yachtContainer, {
            duration: 2,
            x: 15,
            rotation: 5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1
        }, 4)
        
        // 5. Transition to sunset - yacht fades out, sunset fades in
        .to(this.yachtContainer, {
            duration: 0.6,
            opacity: 0,
            scale: 0.8,
            rotation: -30,
            x: 0,
            ease: "power2.in"
        }, 6.5)
        .to(this.sunsetContainer, {
            duration: 1,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "elastic.out(1, 0.4)"
        }, 6.7)
        
        // 6. Sunset glow and pulse animation
        .to(this.sunsetContainer, {
            duration: 0.8,
            scale: 1.15,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 2
        }, 7.5)
        
        // 7. Continuous rotation for sun rays
        .to(this.sunsetContainer, {
            duration: 1.5,
            rotation: 360,
            ease: "none"
        }, 8)
        
        // 8. Reset cycle - sunset fades out, back to Burj
        .to(this.sunsetContainer, {
            duration: 0.8,
            opacity: 0,
            scale: 0.5,
            rotation: 720,
            ease: "power2.in"
        }, 10)
        .to(this.burjContainer, {
            duration: 1,
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            ease: "bounce.out"
        }, 10.5);
    }
    
    simulateProgress() {
        if (!this.progressBar) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 95) {
                progress = 95;
                clearInterval(interval);
            }
            this.updateProgress(progress);
        }, 200);
    }
    
    updateProgress(percentage) {
        if (this.progressBar) {
            this.progressBar.style.width = `${Math.min(percentage, 100)}%`;
        }
    }
    
    handlePageLoad() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
        
        // Complete progress bar
        this.updateProgress(100);
        
        // Wait for minimum display time before hiding
        setTimeout(() => {
            this.hidePreloader();
        }, remainingTime);
    }
    
    hidePreloader() {
        if (this.isLoaded || !this.preloader) return;
        
        this.isLoaded = true;
        
        // Add fade out animation
        this.preloader.classList.add('hidden');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (this.preloader && this.preloader.parentNode) {
                this.preloader.style.display = 'none';
            }
        }, 1000);
        
        // Trigger any post-load animations
        this.triggerPostLoadAnimations();
    }
    
    triggerPostLoadAnimations() {

        
        // Initialize stats counter
        setTimeout(() => {
            new StatsCounter();
        }, 1500);
        
        // Trigger scroll animations for visible elements
        const visibleElements = document.querySelectorAll('.fade-in');
        visibleElements.forEach((el, index) => {
            if (this.isInViewport(el)) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100);
            }
        });
    }
    
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize preloader immediately
const preloaderManager = new PreloaderManager();

// ===== ANIMATED STATISTICS COUNTER =====
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.hero__stat-number');
        this.animated = false;
        this.init();
    }
    
    init() {
        if (!this.stats.length) return;
        
        // Start animation immediately since hero is visible on load
        this.animateStats();
        
        // Also trigger on scroll for additional viewings
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        this.stats.forEach(stat => observer.observe(stat));
    }
    
    animateStats() {
        if (this.animated) return;
        this.animated = true;
        
        this.stats.forEach((stat, index) => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000 + (index * 200); // Stagger animations
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuint = 1 - Math.pow(1 - progress, 5);
                const current = Math.floor(target * easeOutQuint);
                
                stat.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    stat.textContent = target;
                }
            };
            
            // Start animation with delay
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, index * 300);
        });
    }
}

// ===== MULTI-STEP FORM FUNCTIONALITY =====
class MultiStepForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.steps = document.querySelectorAll('.form__step');
        this.stepDots = document.querySelectorAll('.form__step-dot');
        this.prevBtn = document.querySelector('.form__prev');
        this.nextBtn = document.querySelector('.form__next');
        this.submitBtn = document.querySelector('.form__submit');
        this.progressBar = document.querySelector('.contact__form-progress-bar');
        this.currentStep = 0;
        this.totalSteps = this.steps.length;
        
        this.init();
    }
    
    init() {
        if (!this.form || !this.steps.length) return;
        
        this.bindEvents();
        this.updateProgress();
        this.updateButtons();
    }
    
    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.prevStep());
        this.nextBtn?.addEventListener('click', () => this.nextStep());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Step dot navigation
        this.stepDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToStep(index));
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('.form__input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateCurrentStep());
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }
    
    nextStep() {
        if (!this.validateCurrentStep()) return;
        
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }
    
    goToStep(stepIndex) {
        // Only allow going to previous steps or current step
        if (stepIndex <= this.currentStep) {
            this.currentStep = stepIndex;
            this.showStep(this.currentStep);
        }
    }
    
    showStep(stepIndex) {
        // Hide all steps
        this.steps.forEach(step => {
            step.classList.remove('form__step--active');
        });
        
        // Show current step
        this.steps[stepIndex].classList.add('form__step--active');
        
        // Update progress and buttons
        this.updateProgress();
        this.updateButtons();
        this.updateStepDots();
        
        // Focus first input in step
        const firstInput = this.steps[stepIndex].querySelector('.form__input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
    
    updateProgress() {
        const progress = ((this.currentStep + 1) / this.totalSteps) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }
    
    updateButtons() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentStep === 0;
        }
        
        // Next/Submit button visibility
        const isLastStep = this.currentStep === this.totalSteps - 1;
        
        if (this.nextBtn) {
            this.nextBtn.style.display = isLastStep ? 'none' : 'flex';
        }
        
        if (this.submitBtn) {
            this.submitBtn.style.display = isLastStep ? 'flex' : 'none';
        }
    }
    
    updateStepDots() {
        this.stepDots.forEach((dot, index) => {
            dot.classList.toggle('form__step-dot--active', index <= this.currentStep);
        });
    }
    
    validateCurrentStep() {
        const currentStepElement = this.steps[this.currentStep];
        const inputs = currentStepElement.querySelectorAll('.form__input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        
        // Clear previous errors
        this.clearErrors(input);
        
        // Required field validation
        if (input.hasAttribute('required') && !value) {
            this.showError(input, 'This field is required');
            isValid = false;
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    showError(input, message) {
        input.style.borderColor = '#e74c3c';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: slideInDown 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    clearErrors(input) {
        input.style.borderColor = '#e9ecef';
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) return;
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        this.showSuccess();
        
        // Reset form after delay
        setTimeout(() => {
            this.form.reset();
            this.currentStep = 0;
            this.showStep(0);
        }, 2000);
    }
    
    showSuccess() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Thank you! We'll get back to you within 30 minutes.</span>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#27ae60',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 5px 25px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '350px'
        });
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// ===== AOS-LIKE SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        this.createObserver();
        this.observeElements();
    }
    
    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.aos || 'fade-up';
                    const delay = element.dataset.aosDelay || 0;
                    
                    setTimeout(() => {
                        element.classList.add('aos-animate');
                    }, parseInt(delay));
                    
                    this.observer.unobserve(element);
                }
            });
        }, options);
    }
    
    observeElements() {
        const elements = document.querySelectorAll('[data-aos]');
        elements.forEach(el => {
            el.classList.add('aos-init');
            this.observer.observe(el);
        });
    }
}



// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const targetPosition = target.offsetTop;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ENHANCED FLEET SECTION =====
class FleetEnhancements {
    constructor() {
        this.cards = document.querySelectorAll('.fleet__card');
        this.init();
    }
    
    init() {
        if (!this.cards.length) return;
        
        this.addHoverEffects();
        this.addClickEffects();
    }
    
    addHoverEffects() {
        this.cards.forEach(card => {
            const overlay = card.querySelector('.fleet__image-overlay');
            
            card.addEventListener('mouseenter', () => {
                if (overlay) {
                    overlay.style.opacity = '1';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (overlay) {
                    overlay.style.opacity = '0';
                }
            });
        });
    }
    
    addClickEffects() {
        this.cards.forEach(card => {
            const quickView = card.querySelector('.fleet__quick-view');
            
            quickView?.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Add a zoom effect
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
                
                // Could open a modal or navigate to details page
                console.log('Quick view clicked for:', card.querySelector('.fleet__name').textContent);
            });
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}



// ===== LOADING ANIMATIONS =====
function initLoadingAnimations() {
    // Animate hero content on load
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }
}

// ===== ADDITIONAL SMOOTH INTERACTIONS =====
function initHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== PARALLAX EFFECT =====
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.backgroundPosition = `center ${rate}px`;
    }, 16));
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    new MultiStepForm();
    new ScrollAnimations();
    new FleetEnhancements();
    initLoadingAnimations();
    initHoverEffects();
    initParallaxEffect();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* AOS Animation Styles */
        .aos-init {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .aos-animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        [data-aos="fade-right"].aos-init {
            transform: translateX(-30px);
        }
        
        [data-aos="fade-left"].aos-init {
            transform: translateX(30px);
        }
        
        [data-aos="fade-right"].aos-animate,
        [data-aos="fade-left"].aos-animate {
            transform: translateX(0);
        }
    `;
    document.head.appendChild(style);
});

// ===== UTILITY FUNCTIONS =====
// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format phone number for WhatsApp
function formatPhoneForWhatsApp(phone) {
    return phone.replace(/[^\d]/g, '');
}

// ===== LAZY LOADING FOR IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Graceful degradation - ensure basic functionality still works
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    // Add keyboard navigation for form steps
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.classList.contains('form__step-dot')) {
            e.target.click();
        }
    });
    

}

document.addEventListener('DOMContentLoaded', initAccessibility);

// ===== NAVBAR FUNCTIONALITY =====
class NavbarManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navbarToggle = document.getElementById('navbar-toggle');
        this.navbarMenu = document.getElementById('navbar-menu');
        this.navbarLinks = document.querySelectorAll('.navbar__link');
        
        this.lastScrollTop = 0;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.navbar) return;
        
        // Show navbar initially
        setTimeout(() => {
            this.navbar.classList.add('navbar--visible');
        }, 100);
        
        // Bind events
        this.bindEvents();
        
        // Set initial active link
        this.updateActiveLink();
    }
    
    bindEvents() {
        // Scroll events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16)); // ~60fps
        
        // Mobile menu toggle
        if (this.navbarToggle) {
            this.navbarToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Navigation links click events
        this.navbarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleLinkClick(e, link);
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (currentScrollTop > 50) {
            this.navbar.classList.add('navbar--scrolled');
        } else {
            this.navbar.classList.remove('navbar--scrolled');
        }
        
        // Hide/show navbar based on scroll direction
        if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
            // Scrolling down
            this.navbar.classList.remove('navbar--visible');
        } else {
            // Scrolling up
            this.navbar.classList.add('navbar--visible');
        }
        
        this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        
        // Update active link based on scroll position
        this.updateActiveLink();
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 150; // Offset for navbar height
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active link
        this.navbarLinks.forEach(link => {
            link.classList.remove('navbar__link--active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSection}` || (currentSection === '' && href === '#home')) {
                link.classList.add('navbar__link--active');
            }
        });
    }
    
    handleLinkClick(e, link) {
        const href = link.getAttribute('href');
        
        // Only handle internal links
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            if (targetSection) {
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Smooth scroll to section
                const navbarHeight = this.navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link immediately
                this.navbarLinks.forEach(navLink => {
                    navLink.classList.remove('navbar__link--active');
                });
                link.classList.add('navbar__link--active');
            }
        }
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        this.navbarMenu.classList.add('navbar__menu--active');
        this.navbarToggle.classList.add('navbar__toggle--active');
        document.body.style.overflow = 'hidden';
        
        // Add animation delay to menu items
        const menuItems = this.navbarMenu.querySelectorAll('.navbar__item');
        menuItems.forEach((item, index) => {
            item.style.animation = `slideInRight 0.3s ease-out ${index * 0.1}s both`;
        });
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navbarMenu.classList.remove('navbar__menu--active');
        this.navbarToggle.classList.remove('navbar__toggle--active');
        document.body.style.overflow = '';
        
        // Remove animation
        const menuItems = this.navbarMenu.querySelectorAll('.navbar__item');
        menuItems.forEach(item => {
            item.style.animation = '';
        });
    }
    
    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Add CSS animation for mobile menu items
const menuAnimationCSS = `
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = menuAnimationCSS;
document.head.appendChild(style);

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavbarManager();
}); 