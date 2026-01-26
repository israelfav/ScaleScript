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

// Form submission handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    const originalHTML = submitBtn.innerHTML;
    
    // Show loading state with animation
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Your Samples...';
    submitBtn.disabled = true;
    
    // Create a success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Samples Request Sent!</h3>
        <p>I'll create your 3 free viral samples and send them within 24 hours.</p>
    `;
    successMessage.style.cssText = `
        background: linear-gradient(45deg, var(--primary), var(--primary-light));
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        margin-top: 20px;
        animation: fadeInUp 0.5s ease-out;
    `;
    
    // Simulate form submission with animation
    setTimeout(() => {
        // Add success message with animation
        contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
        
        // Animate form submission
        contactForm.style.opacity = '0.5';
        contactForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            contactForm.style.display = 'none';
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 2000);
        }, 500);
        
    }, 1500);
});

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
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

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
    
    // Add typing effect to hero text (optional)
    const heroText = document.querySelector('.hero h1');
    if (heroText && window.innerWidth > 768) {
        const text = heroText.textContent;
        heroText.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
    // Uncomment for typing effect:
    // setTimeout(typeWriter, 1000);
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
        playIcon.style.transform = 'translate(-50%, -50%) scale(1.2)';
        playIcon.style.backgroundColor = 'var(--primary)';
        playIcon.style.color = 'white';
    });
    
    item.addEventListener('mouseleave', () => {
        playIcon.style.transform = 'translate(-50%, -50%) scale(1)';
        playIcon.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        playIcon.style.color = 'var(--primary)';
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
