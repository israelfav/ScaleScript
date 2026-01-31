// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Video modal functionality
const videoItems = document.querySelectorAll('.video-item');
const videoModal = document.getElementById('videoModal');
const closeModal = document.getElementById('closeModal');
const youtubeVideo = document.getElementById('youtubeVideo');

// Enhanced video click with animation
videoItems.forEach(item => {
    item.addEventListener('click', () => {
        const videoId = item.getAttribute('data-video-id');
        
        // Add click animation to video item
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = 'translateY(-10px)';
        }, 150);
        
        // Load and show YouTube video
        youtubeVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add fade-in animation to modal
        setTimeout(() => {
            videoModal.style.opacity = '1';
        }, 10);
    });
});

// Close modal with animation
function closeVideoModal() {
    videoModal.style.opacity = '0';
    setTimeout(() => {
        videoModal.classList.remove('active');
        youtubeVideo.src = '';
        document.body.style.overflow = 'auto';
    }, 300);
}

closeModal.addEventListener('click', closeVideoModal);

// Close modal when clicking outside
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
    }
});

// Formspree Configuration
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwkjpzek"; // Your Formspree endpoint

// Form elements
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Set form action dynamically
if (contactForm) {
    contactForm.action = FORMSPREE_ENDPOINT;
    
    // Update reply-to field when email changes
    const emailInput = document.getElementById('email');
    const replyToField = document.getElementById('replyTo');
    
    if (emailInput && replyToField) {
        emailInput.addEventListener('input', function() {
            replyToField.value = this.value;
        });
    }
}

// Form validation before submission
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const niche = document.getElementById('niche');
    
    if (!name || !email || !niche) return false;
    
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const nicheValue = niche.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Reset error states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    let isValid = true;
    
    if (!nameValue) {
        name.parentElement.classList.add('error');
        isValid = false;
    }
    
    if (!emailValue) {
        email.parentElement.classList.add('error');
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        email.parentElement.classList.add('error');
        isValid = false;
    }
    
    if (!nicheValue) {
        niche.parentElement.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// Form submission handling
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
            return;
        }
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        const formData = new FormData(contactForm);
        
        // Show loading state with animation
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Request...';
        submitBtn.disabled = true;
        
        try {
            // Send to Formspree
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message with animation
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.style.opacity = '0';
                    successMessage.style.transform = 'translateY(20px)';
                }
                
                // Hide form with animation
                contactForm.style.opacity = '0.5';
                contactForm.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    
                    // Animate success message in
                    setTimeout(() => {
                        if (successMessage) {
                            successMessage.style.opacity = '1';
                            successMessage.style.transform = 'translateY(0)';
                            
                            // Scroll to success message
                            successMessage.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }
                        
                        // Reset form
                        contactForm.reset();
                        
                        // Reset button after delay
                        setTimeout(() => {
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                        }, 2000);
                        
                    }, 300);
                }, 500);
                
            } else {
                // Handle Formspree error
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed');
            }
            
        } catch (error) {
            // Show error message
            alert(`Oops! Something went wrong: ${error.message}\n\nPlease try again or email me directly.`);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            console.error('Form submission error:', error);
        }
    });
}

// Smooth scrolling for anchor links with animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Add bounce animation to clicked link
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Fix mobile menu position
function updateMobileMenuPosition() {
    if (window.innerWidth <= 768) {
        const headerHeight = header.offsetHeight;
        navLinks.style.top = headerHeight + 'px';
    }
}

window.addEventListener('load', updateMobileMenuPosition);
window.addEventListener('resize', updateMobileMenuPosition);

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add staggered animation
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }, entry.target.dataset.delay || 0);
        }
    });
}, observerOptions);

// Observe elements for scroll animations with staggered delays
document.querySelectorAll('.section-title, .video-item, .package-card, .confidence-guarantee').forEach((el, index) => {
    el.dataset.delay = index * 100; // Stagger animation
    observer.observe(el);
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Animate guarantee badge continuously
const guaranteeBadge = document.querySelector('.guarantee-badge');
if (guaranteeBadge) {
    setInterval(() => {
        guaranteeBadge.style.transform = 'scale(1.05)';
        setTimeout(() => {
            guaranteeBadge.style.transform = 'scale(1)';
        }, 500);
    }, 3000);
}

// Feature list item hover animations
const featureItems = document.querySelectorAll('.features-list li');
featureItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(10px)';
        item.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
    });
});

// Form input focus animations
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Email input validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.style.borderColor = '#EF4444';
            this.parentElement.classList.add('error');
        } else {
            this.style.borderColor = '';
            this.parentElement.classList.remove('error');
        }
    });
}

// Initialize animations on load
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class for initial animations
    document.body.classList.add('loaded');
    
    // Animate logo on load
    const logo = document.querySelector('.logo');
    if (logo) {
        setTimeout(() => {
            logo.style.transform = 'rotate(-5deg)';
            setTimeout(() => {
                logo.style.transform = 'rotate(0)';
            }, 300);
        }, 500);
    }
    
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Social icon hover effects
const socialIcons = document.querySelectorAll('.social-icons a, .footer-social a');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'translateY(-5px) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translateY(0) rotate(0)';
    });
});

// Video item hover enhancements
videoItems.forEach(item => {
    const playIcon = item.querySelector('.play-icon');
    
    item.addEventListener('mouseenter', () => {
        if (playIcon) {
            playIcon.style.transform = 'translate(-50%, -50%) scale(1.2)';
            playIcon.style.backgroundColor = 'var(--primary)';
            playIcon.style.color = 'white';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        if (playIcon) {
            playIcon.style.transform = 'translate(-50%, -50%) scale(1)';
            playIcon.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            playIcon.style.color = 'var(--primary)';
        }
    });
});

// Page load animations
window.addEventListener('load', () => {
    // Animate hero elements sequentially
    const heroElements = document.querySelectorAll('.hero .tagline, .hero h1, .hero p, .confidence-guarantee, .cta-button, .guarantee-badge');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
});

// Form field auto-focus for better UX
const nameInput = document.getElementById('name');
if (nameInput) {
    nameInput.focus();
}

// Add keyboard navigation for form
if (contactForm) {
    contactForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault();
            const formElements = Array.from(this.elements);
            const currentIndex = formElements.indexOf(e.target);
            const nextElement = formElements[currentIndex + 1];
            
            if (nextElement) {
                nextElement.focus();
            }
        }
    });
}

// Initialize tooltips for form fields
const formGroups = document.querySelectorAll('.form-group');
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea, select');
    const label = group.querySelector('label');
    
    if (input && label) {
        input.addEventListener('focus', () => {
            label.style.color = 'var(--primary)';
            label.style.fontWeight = '600';
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                label.style.color = 'var(--gray)';
                label.style.fontWeight = '400';
            }
        });
    }
});

// Debounce function for resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateMobileMenuPosition();
    }, 250);
});

// Touch device detection
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

// Adjust animations for touch devices
if (isTouchDevice()) {
    document.body.classList.add('touch-device');
    
    // Remove hover effects on touch devices
    const hoverElements = document.querySelectorAll('.video-item, .service-card, .social-icons a');
    hoverElements.forEach(el => {
        el.classList.add('no-hover');
    });
}

// Add loading state for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.transition = 'opacity 0.3s ease';
    });
    
    // Set initial opacity for smooth loading
    img.style.opacity = '0';
});

// Back to top button functionality
const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
backToTop.className = 'back-to-top';
backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
`;

document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.style.opacity = '1';
        backToTop.style.transform = 'translateY(0)';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.transform = 'translateY(20px)';
    }
});

// Add keyboard shortcut for contact form (Ctrl/Cmd + Enter)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.form && focusedElement.form.id === 'contactForm') {
            const submitBtn = focusedElement.form.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }
});

// Initialize service worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// Analytics tracking for form submissions
function trackFormSubmission(type) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            'event_category': 'form_submission',
            'event_label': type
        });
    }
    
    // Log to console for debugging
    console.log(`Form submitted: ${type}`);
}

// Update form submission to track
if (contactForm) {
    const originalSubmit = contactForm.onsubmit;
    contactForm.onsubmit = function(e) {
        const niche = document.getElementById('niche')?.value || 'unknown';
        trackFormSubmission(niche);
        if (originalSubmit) originalSubmit.call(this, e);
    };
}

// Initialize all interactive elements
function initializeAll() {
    console.log('ScaleScript Portfolio Initialized');
    
    // Check Formspree endpoint
    console.log('Formspree Endpoint:', FORMSPREE_ENDPOINT);
    
    // Verify form elements exist
    if (!contactForm) {
        console.warn('Contact form not found!');
    }
    
    if (!successMessage) {
        console.warn('Success message element not found!');
    }
    
    // Add form ID to console for debugging
    const formId = FORMSPREE_ENDPOINT.split('/').pop();
    console.log('Using Formspree Form ID:', formId);
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

// Plan Selection Functionality - UPDATED
function initializePlanSelection() {
    const planButtons = document.querySelectorAll('.plan-cta, .custom-cta');
    const contactForm = document.getElementById('contactForm');
    const planSelect = document.getElementById('interested_in');
    const selectedPlanInput = document.getElementById('selectedPlan');
    
    planButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.tagName === 'A') {
                e.preventDefault();
            }
            
            // Get plan name from data attribute or text
            let planName = button.getAttribute('data-plan') || 
                          button.textContent.replace('Get Started', 'Starter')
                                            .replace('Choose Growth', 'Growth')
                                            .replace('Go Big', 'Scale')
                                            .replace('Request Custom Quote', 'Custom')
                                            .trim();
            
            // Set plan in select and hidden input
            if (planSelect) {
                const optionValue = planName.toLowerCase();
                planSelect.value = optionValue;
                
                // Update the label to show selected
                const label = planSelect.parentElement.querySelector('label');
                if (label) {
                    label.style.color = 'var(--primary)';
                    label.style.fontWeight = '600';
                }
            }
            
            if (selectedPlanInput) {
                selectedPlanInput.value = planName;
            }
            
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
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
                    
                    // Update message field with selected plan
                    const messageField = document.getElementById('message');
                    if (messageField) {
                        const currentMessage = messageField.value.trim();
                        if (!currentMessage.includes(planName)) {
                            const planText = planName === 'Custom' ? 
                                'Custom package (60+ shorts/month)' : 
                                `${planName} plan`;
                            messageField.value = currentMessage ? 
                                `${currentMessage}\n\nInterested in: ${planText}` : 
                                `Interested in: ${planText}`;
                        }
                    }
                }, 500);
            }
        });
    });
    
    // Update plan when select changes
    if (planSelect && selectedPlanInput) {
        planSelect.addEventListener('change', function() {
            const selectedText = this.options[this.selectedIndex].text;
            const planName = selectedText.split('(')[0].trim();
            selectedPlanInput.value = planName;
        });
    }
}

// Remove any free samples references from form submission
// Update the form submission success message
if (contactForm) {
    const originalSubmit = contactForm.onsubmit;
    contactForm.onsubmit = function(e) {
        // Remove any free samples logic
        if (originalSubmit) originalSubmit.call(this, e);
    };
}

// Update success message text in form submission handler
// Find the success message update in the existing code and change:
// From: "I'll create your 3 free viral samples..."
// To: "We'll schedule a 15-minute strategy call..."

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initializePlanSelection();
    
    // Update any text that might still reference free samples
    const freeSamplesElements = document.querySelectorAll('*');
    freeSamplesElements.forEach(el => {
        if (el.textContent && el.textContent.toLowerCase().includes('free sample')) {
            console.log('Found free samples reference:', el);
            // You might want to manually review and update these
        }
    });
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.textContent.includes('Get Samples')) {
            link.textContent = 'Get Started';
        }
    });
});
