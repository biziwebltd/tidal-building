// Tidal Building Services - Main JavaScript File
// This file handles all interactive functionality for the static HTML website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mobile menu functionality
    initMobileMenu();
    
    // Contact form handling
    initContactForms();
    
    // FAQ functionality
    initFAQ();
    
    // Portfolio filtering
    initPortfolioFilter();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Active navigation highlighting
    initNavigationHighlighting();
});

/**
 * Mobile Menu Toggle Functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    let isMenuOpen = false;

    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        }
        
        // Reinitialize icons after content change
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Close mobile menu when clicking on links
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
}

/**
 * Contact Form Handling
 */
function initContactForms() {
    const contactForms = document.querySelectorAll('#contact-form, .contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', handleFormSubmission);
    });
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let missingFields = [];
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            missingFields.push(field.name);
            field.classList.add('border-red-500');
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && !isValidEmail(emailField.value)) {
        showNotification('Please enter a valid email address.', 'error');
        emailField.classList.add('border-red-500');
        return;
    }
    
    // Consent validation (if present)
    const consentField = form.querySelector('#consent');
    if (consentField && !consentField.checked) {
        showNotification('Please accept the consent to proceed.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Track form submission (optional - add analytics)
        trackEvent('form_submission', {
            form_name: form.id || 'contact_form',
            service: data.service || 'general_inquiry'
        });
        
    }, 1500);
}

/**
 * FAQ Accordion Functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question?.querySelector('i');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isOpen = !answer.classList.contains('hidden');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    
                    if (otherAnswer) otherAnswer.classList.add('hidden');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current FAQ
            if (isOpen) {
                answer.classList.add('hidden');
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                answer.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

/**
 * Portfolio Filter Functionality
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Navigation Active State Highlighting
 */
function initNavigationHighlighting() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a, .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '/' && href === 'index.html') ||
            (currentPage.includes(href.replace('.html', '')))) {
            
            link.classList.add('active');
            
            // Add active styling if not already present
            if (!link.classList.contains('text-white') && !link.classList.contains('bg-white/10')) {
                link.classList.add('text-white', 'bg-white/10');
            }
        }
    });
}

/**
 * Utility Functions
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Set notification type styling
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-blue-500', 'text-white');
    }
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
                ${type === 'success' ? '<i data-lucide="check-circle" class="w-5 h-5"></i>' : 
                  type === 'error' ? '<i data-lucide="x-circle" class="w-5 h-5"></i>' : 
                  '<i data-lucide="info" class="w-5 h-5"></i>'}
            </div>
            <p class="text-sm font-medium">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Initialize icons for notification
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function trackEvent(eventName, properties = {}) {
    // Optional: Add analytics tracking here
    // Example: Google Analytics, Mixpanel, etc.
    console.log('Event tracked:', eventName, properties);
    
    // Google Analytics 4 example (uncomment and configure if needed):
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, properties);
    // }
}

/**
 * Performance Optimizations
 */

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images with data-src exist
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

/**
 * CSS Animation Utilities
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
    
    .animate-slide-in {
        animation: slideIn 0.6s ease-out forwards;
    }
    
    .border-red-500 {
        border-color: #ef4444 !important;
    }
    
    .bg-green-500 {
        background-color: #10b981;
    }
    
    .bg-red-500 {
        background-color: #ef4444;
    }
    
    .bg-blue-500 {
        background-color: #3b82f6;
    }
`;

document.head.appendChild(style);