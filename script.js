// script.js - Optimized Version
'use strict';

// Configuration
const CONFIG = {
    FORMSPREE_ENDPOINT: "https://formspree.io/f/mwkjpzek",
    HEADER_SCROLL_THRESHOLD: 50,
    ANIMATION_DELAY_INCREMENT: 100,
    MOBILE_BREAKPOINT: 768,
    BACK_TO_TOP_THRESHOLD: 500
};

// DOM Elements
const elements = {
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navLinks: document.getElementById('navLinks'),
    header: document.getElementById('header'),
    contactForm: document.getElementById('contactForm'),
    successMessage: document.getElementById('successMessage'),
    videoModal: document.getElementById('videoModal'),
    closeModal: document.getElementById('closeModal'),
    youtubeVideo: document.getElementById('youtubeVideo'),
    videoItems: document.querySelectorAll('.video-item'),
    backToTop: null // Will be created dynamically
};

// State
const state = {
    isMobileMenuOpen: false,
    activeVideoId: null,
    isFormSubmitting: false
};

// Mobile Menu
function initMobileMenu() {
    if (!elements.mobileMenuBtn || !elements.navLinks) return;
    
    elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Update position on resize
    window.addEventListener('resize', updateMobileMenuPosition);
    updateMobileMenuPosition();
}

function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    elements.navLinks.classList.toggle('active', state.isMobileMenuOpen);
    
    const icon = state.isMobileMenuOpen ? 'times' : 'bars';
    elements.mobileMenuBtn.innerHTML = `<i class="fas fa-${icon}"></i>`;
}

function closeMobileMenu() {
    state.isMobileMenuOpen = false;
    elements.navLinks.classList.remove('active');
    elements.mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}

function updateMobileMenuPosition() {
    if (window.innerWidth <= CONFIG.MOBILE_BREAKPOINT && elements.header && elements.navLinks) {
        const headerHeight = elements.header.offsetHeight;
        elements.navLinks.style.top = `${headerHeight}px`;
    }
}

// Header Scroll Effect
function initHeaderScroll() {
    if (!elements.header) return;
    
    window.addEventListener('scroll', () => {
        const shouldAddClass = window.scrollY > CONFIG.HEADER_SCROLL_THRESHOLD;
        elements.header.classList.toggle('scrolled', shouldAddClass);
    });
}

// Video Modal
function initVideoModal() {
    if (!elements.videoItems.length || !elements.videoModal || !elements.youtubeVideo) return;
    
    elements.videoItems.forEach(item => {
        item.addEventListener('click', () => openVideoModal(item));
    });
    
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeVideoModal);
    }
    
    elements.videoModal.addEventListener('click', (e) => {
        if (e.target === elements.videoModal) {
            closeVideoModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}

function openVideoModal(videoItem) {
    const videoId = videoItem.getAttribute('data-video-id');
    if (!videoId) return;
    
    // Click animation
    videoItem.style.transform = 'scale(0.95)';
    setTimeout(() => {
        videoItem.style.transform = 'translateY(-10px)';
    }, 150);
    
    // Load video
    elements.youtubeVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    state.activeVideoId = videoId;
    
    // Show modal
    elements.videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        elements.videoModal.style.opacity = '1';
    }, 10);
}

function closeVideoModal() {
    elements.videoModal.style.opacity = '0';
    
    setTimeout(() => {
        elements.videoModal.classList.remove('active');
        if (elements.youtubeVideo) {
            elements.youtubeVideo.src = '';
        }
        document.body.style.overflow = 'auto';
        state.activeVideoId = null;
    }, 300);
}

// Form Handling
function initContactForm() {
    if (!elements.contactForm) return;
    
    // Set form action
    elements.contactForm.action = CONFIG.FORMSPREE_ENDPOINT;
    
    // Initialize reply-to field
    const emailInput = document.getElementById('email');
    const replyToField = document.getElementById('replyTo');
    
    if (emailInput && replyToField) {
        emailInput.addEventListener('input', () => {
            replyToField.value = emailInput.value;
        });
    }
    
    // Form submission
    elements.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Form validation
    initFormValidation();
    
    // Plan selection
    initPlanSelection();
}

function validateForm() {
    const requiredFields = ['name', 'email', 'niche'];
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    // Validate required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        const value = field.value.trim();
        
        if (!value) {
            field.parentElement.classList.add('error');
            isValid = false;
            return;
        }
        
        // Email validation
        if (fieldId === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.parentElement.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (state.isFormSubmitting) return;
    
    // Validate
    if (!validateForm()) {
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
        return;
    }
    
    state.isFormSubmitting = true;
    const submitBtn = elements.contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Request...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(elements.contactForm);
        const response = await fetch(CONFIG.FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        if (response.ok) {
            showSuccessMessage();
            elements.contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorFallback();
    } finally {
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        state.isFormSubmitting = false;
    }
}

function showSuccessMessage() {
    if (!elements.successMessage) return;
    
    // Get contact preference
    const contactMethod = document.getElementById('preferred_contact')?.value || 'email';
    let message = "We'll email your customized proposal within 6 hours.";
    
    switch(contactMethod) {
        case 'whatsapp':
            message = "We'll WhatsApp you the proposal within 6 hours.";
            break;
        case 'telegram':
            message = "We'll Telegram you the proposal within 6 hours.";
            break;
        case 'signal':
            message = "We'll Signal you the proposal within 6 hours.";
            break;
    }
    
    // Update and show success message
    elements.successMessage.querySelector('p').textContent = message;
    
    // Hide form
    elements.contactForm.style.opacity = '0.5';
    elements.contactForm.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        elements.contactForm.style.display = 'none';
        
        setTimeout(() => {
            elements.successMessage.style.display = 'block';
            elements.successMessage.style.opacity = '0';
            elements.successMessage.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                elements.successMessage.style.opacity = '1';
                elements.successMessage.style.transform = 'translateY(0)';
                elements.successMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            });
        }, 300);
    }, 500);
}

function showErrorFallback() {
    const fallbackMessage = `Oops! Something went wrong.\n\nPlease email us directly at: hello@scalescript.co\n\nOr book a quick slot:\nhttps://calendly.com/scalescript/15min`;
    alert(fallbackMessage);
}

function initFormValidation() {
    const emailInput = document.getElementById('email');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.parentElement.classList.add('error');
            } else {
                this.parentElement.classList.remove('error');
            }
        });
    }
    
    // Form input focus animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Plan Selection
function initPlanSelection() {
    const planButtons = document.querySelectorAll('.plan-cta, .custom-cta');
    const planSelect = document.getElementById('interested_in');
    const selectedPlanInput = document.getElementById('selectedPlan');
    
    if (!planButtons.length) return;
    
    planButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.tagName === 'A') {
                e.preventDefault();
            }
            
            const planName = getPlanNameFromButton(button);
            
            // Update form fields
            if (planSelect) {
                planSelect.value = planName.toLowerCase();
                updateSelectLabel(planSelect);
            }
            
            if (selectedPlanInput) {
                selectedPlanInput.value = planName;
            }
            
            // Update message field
            updateMessageFieldWithPlan(planName);
            
            // Scroll to contact form
            scrollToContactForm();
        });
    });
    
    // Update when select changes
    if (planSelect && selectedPlanInput) {
        planSelect.addEventListener('change', function() {
            const selectedText = this.options[this.selectedIndex].text;
            const planName = selectedText.split('(')[0].trim();
            selectedPlanInput.value = planName;
        });
    }
}

function getPlanNameFromButton(button) {
    const planData = button.getAttribute('data-plan');
    if (planData) return planData;
    
    const text = button.textContent.trim();
    const planMap = {
        'Get Started': 'Starter',
        'Choose Growth': 'Growth',
        'Go Big': 'Scale',
        'Request Custom Quote': 'Custom'
    };
    
    return planMap[text] || 'Starter';
}

function updateSelectLabel(select) {
    const label = select.parentElement.querySelector('label');
    if (label) {
        label.style.color = 'var(--primary)';
        label.style.fontWeight = '600';
    }
}

function updateMessageFieldWithPlan(planName) {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    const currentMessage = messageField.value.trim();
    if (currentMessage.includes(planName)) return;
    
    const planText = planName === 'Custom' ? 
        'Custom package (60+ shorts/month)' : 
        `${planName} plan`;
    
    const newMessage = currentMessage ? 
        `${currentMessage}\n\nInterested in: ${planText}` : 
        `Interested in: ${planText}`;
    
    messageField.value = newMessage;
}

function scrollToContactForm() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    
    contactSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    // Focus on name field after scroll
    setTimeout(() => {
        const nameField = document.getElementById('name');
        if (nameField) {
            nameField.focus();
        }
    }, 500);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                }, entry.target.dataset.delay || 0);
            }
        });
    }, observerOptions);
    
    // Observe elements with staggered delays
    document.querySelectorAll('.section-title, .video-item, .pricing-card, .testimonial-card, .confidence-guarantee').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.dataset.delay = index * CONFIG.ANIMATION_DELAY_INCREMENT;
        observer.observe(el);
    });
}

// Back to Top Button
function initBackToTop() {
    elements.backToTop = document.createElement('button');
    elements.backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    elements.backToTop.className = 'back-to-top';
    
    // Style is handled in CSS, but set basic inline styles
    elements.backToTop.style.cssText = `
        opacity: 0;
        transform: translateY(20px);
        pointer-events: none;
    `;
    
    document.body.appendChild(elements.backToTop);
    
    // Click event
    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Scroll event
    window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > CONFIG.BACK_TO_TOP_THRESHOLD;
        
        elements.backToTop.style.opacity = shouldShow ? '1' : '0';
        elements.backToTop.style.transform = shouldShow ? 'translateY(0)' : 'translateY(20px)';
        elements.backToTop.style.pointerEvents = shouldShow ? 'auto' : 'none';
    });
}

// Parallax Effect
function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// Guarantee Badge Animation
function initGuaranteeBadge() {
    const guaranteeBadge = document.querySelector('.guarantee-badge');
    if (!guaranteeBadge) return;
    
    setInterval(() => {
        guaranteeBadge.style.transform = 'scale(1.05)';
        setTimeout(() => {
            guaranteeBadge.style.transform = 'scale(1)';
        }, 500);
    }, 3000);
}

// Touch Device Detection
function initTouchDeviceSupport() {
    const isTouchDevice = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) || 
                         (navigator.msMaxTouchPoints > 0);
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // Remove hover effects on touch devices
        document.querySelectorAll('.video-item, .social-icons a').forEach(el => {
            el.classList.add('no-hover');
        });
    }
}

// Initialize Everything
function initialize() {
    console.log('ScaleScript Initializing...');
    
    // Initialize all modules
    initMobileMenu();
    initHeaderScroll();
    initVideoModal();
    initContactForm();
    initSmoothScrolling();
    initScrollAnimations();
    initBackToTop();
    initParallax();
    initGuaranteeBadge();
    initTouchDeviceSupport();
    
    // Initial animations
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('loaded');
        
        // Animate logo
        const logo = document.querySelector('.logo');
        if (logo) {
            setTimeout(() => {
                logo.style.transform = 'rotate(-5deg)';
                setTimeout(() => {
                    logo.style.transform = 'rotate(0)';
                }, 300);
            }, 500);
        }
        
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero .tagline, .hero h1, .hero p, .confidence-guarantee, .cta-button, .guarantee-badge');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    });
    
    console.log('ScaleScript Initialized Successfully');
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Export for debugging (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        elements,
        state,
        initialize
    };
}

// Add promo video functionality
const promoVideo = document.querySelector('.promo-video');
if (promoVideo) {
    promoVideo.addEventListener('click', () => {
        const videoId = promoVideo.getAttribute('data-video-id');
        
        // Add click animation
        promoVideo.style.transform = 'scale(0.95)';
        setTimeout(() => {
            promoVideo.style.transform = 'translateY(-10px)';
        }, 150);
        
        // Load and show YouTube video
        youtubeVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            videoModal.style.opacity = '1';
        }, 10);
    });
}

// Update existing video items with new IDs
function updateVideoItems() {
    const videoItems = document.querySelectorAll('.video-item');
    
    // You can add specific logic here if needed
    videoItems.forEach((item, index) => {
        // Add index-based animations
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Call on load
document.addEventListener('DOMContentLoaded', updateVideoItems);
