// Global Variables
let scene, camera, renderer, particles;
let typewriterIndex = 0;
let typewriterTextIndex = 0;
let isDeleting = false;
let typewriterSpeed = 100;

const typewriterTexts = [
    "Full-Stack Developer",
    "Creative Problem Solver",
    "Technology Enthusiast"
];

// Document Ready
$(document).ready(function() {
    // Initialize all components
    initLoader();
    initCustomCursor();
    initNavigation();
    initTypewriter();
    initThreeBackground();
    initParticleBackground();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initSmoothScrolling();
    
    // Hide loader after 1 second
    setTimeout(() => {
        hideLoader();
    }, 1000);
});

// Loader Functions
function initLoader() {
    const loadingScreen = $('#loading-screen');
    loadingScreen.show();
}

function hideLoader() {
    const loadingScreen = $('#loading-screen');
    loadingScreen.fadeOut(500, function() {
        $(this).hide();
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = $('#custom-cursor');
    
    $(document).mousemove(function(e) {
        cursor.css({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        });
    });
    
    // Hide cursor on touch devices
    if ('ontouchstart' in window) {
        cursor.hide();
        $('body').css('cursor', 'auto');
    }
}

// Navigation
function initNavigation() {
    const mobileMenuBtn = $('#mobile-menu-btn');
    const mobileNav = $('#mobile-nav');
    const navLinks = $('.nav-link, .mobile-nav-link');
    
    // Mobile menu toggle
    mobileMenuBtn.click(function() {
        mobileNav.toggleClass('active');
        $(this).toggleClass('active');
    });
    
    // Close mobile menu when clicking on links
    $('.mobile-nav-link').click(function() {
        mobileNav.removeClass('active');
        mobileMenuBtn.removeClass('active');
    });
    
    // Highlight active navigation link
    $(window).scroll(function() {
        const scrollPos = $(window).scrollTop();
        
        navLinks.each(function() {
            const link = $(this);
            const section = $(link.attr('href'));
            
            if (section.length && 
                section.offset().top <= scrollPos + 100 && 
                section.offset().top + section.outerHeight() > scrollPos + 100) {
                navLinks.removeClass('active');
                link.addClass('active');
            }
        });
    });
}

// Typewriter Effect
function initTypewriter() {
    startTypewriter();
}

function startTypewriter() {
    const typewriterElement = $('#typewriter-text');
    const currentText = typewriterTexts[typewriterIndex];
    
    if (isDeleting) {
        typewriterElement.text(currentText.substring(0, typewriterTextIndex - 1));
        typewriterTextIndex--;
        
        if (typewriterTextIndex === 0) {
            isDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
            setTimeout(startTypewriter, 500);
            return;
        }
        setTimeout(startTypewriter, 50);
    } else {
        typewriterElement.text(currentText.substring(0, typewriterTextIndex + 1));
        typewriterTextIndex++;
        
        if (typewriterTextIndex === currentText.length) {
            setTimeout(() => {
                isDeleting = true;
                startTypewriter();
            }, 2000);
            return;
        }
        setTimeout(startTypewriter, typewriterSpeed);
    }
}

// Three.js Background
function initThreeBackground() {
    const container = document.getElementById('three-background');
    if (!container || !window.THREE) return;
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    for (let i = 0; i < 1000; i++) {
        vertices.push(
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000
        );
        colors.push(0, Math.random(), 1);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    camera.position.z = 300;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    $(window).resize(function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Particle Background
function initParticleBackground() {
    const container = $('#particle-background');
    const particleCount = 50;
    
    // Clear existing particles
    container.empty();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = $('<div class="particle"></div>');
        
        particle.css({
            width: Math.random() * 4 + 1 + 'px',
            height: Math.random() * 4 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 6 + 's',
            animationDuration: (Math.random() * 10 + 5) + 's'
        });
        
        container.append(particle);
    }
    
    // Parallax effect
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        const speed = 0.5;
        container.css('transform', `translateY(${scrolled * speed}px)`);
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = $(entry.target);
                
                if (element.hasClass('about-text')) {
                    element.addClass('slide-in-left');
                }
                if (element.hasClass('about-image')) {
                    element.addClass('slide-in-right');
                }
                if (element.hasClass('feature-card')) {
                    element.addClass('fade-in');
                }
                if (element.hasClass('skill-category')) {
                    element.addClass('slide-in-left');
                }
                if (element.hasClass('project-card')) {
                    element.addClass('fade-in');
                }
                if (element.hasClass('contact-info')) {
                    element.addClass('slide-in-left');
                }
                if (element.hasClass('contact-form-container')) {
                    element.addClass('slide-in-right');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    $('.about-text, .about-image, .feature-card, .skill-category, .project-card, .contact-info, .contact-form-container').each(function() {
        observer.observe(this);
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillsSection = $('#skills')[0];
    
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $('.skill-progress').each(function() {
                    const progress = $(this);
                    const width = progress.data('width');
                    
                    setTimeout(() => {
                        progress.css('width', width + '%');
                    }, 500);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

// Contact Form
function initContactForm() {
    const form = $('#contact-form');
    
    form.submit(function(e) {
        e.preventDefault();
        
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.text('Sending...').prop('disabled', true);
        
        // Send form data via AJAX
        $.ajax({
            url: 'contact.php',
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    form[0].reset();
                } else {
                    showNotification(response.message || 'Failed to send message. Please try again.', 'error');
                }
            },
            error: function() {
                showNotification('Failed to send message. Please try again later.', 'error');
            },
            complete: function() {
                submitBtn.text(originalText).prop('disabled', false);
            }
        });
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    $('.notification').remove();
    
    const notification = $(`
        <div class="notification notification-${type}">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `);
    
    $('body').append(notification);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 5000);
    
    // Close button
    notification.find('.notification-close').click(function() {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    });
}

// Window Events
$(window).scroll(function() {
    const scrollTop = $(window).scrollTop();
    const nav = $('.nav-container');
    
    // Add background to navigation on scroll
    if (scrollTop > 50) {
        nav.addClass('scrolled');
    } else {
        nav.removeClass('scrolled');
    }
});

// Resize Events
$(window).resize(function() {
    // Close mobile menu on resize
    $('#mobile-nav').removeClass('active');
    $('#mobile-menu-btn').removeClass('active');
});

// Performance Optimization
$(window).on('load', function() {
    // Preload critical images
    const criticalImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=600'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Add notification styles to CSS dynamically
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10001;
    min-width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slideInRight 0.3s ease-out;
}

.notification-success {
    background: linear-gradient(135deg, #10b981, #047857);
}

.notification-error {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

.notification-info {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    margin-left: 16px;
    opacity: 0.8;
    transition: opacity 0.2s ease;
}

.notification-close:hover {
    opacity: 1;
}

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

// .nav-container.scrolled {
//     background: rgba(10, 10, 15, 0.95);
//     backdrop-filter: blur(20px);
// }

@media (max-width: 768px) {
    .notification {
        left: 20px;
        right: 20px;
        min-width: auto;
    }
}
</style>
`;

$(document).ready(function() {
    $('head').append(notificationStyles);
});