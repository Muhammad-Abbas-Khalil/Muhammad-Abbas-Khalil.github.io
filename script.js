// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.getElementById('typing-text');
const progressBars = document.querySelectorAll('.progress-bar');
const statNumbers = document.querySelectorAll('.stat-number');
const contactForm = document.getElementById('contact-form');

// ===== Typing Animation =====
const roles = ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Creative Thinker'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// ===== Navbar Scroll Effect =====
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== Mobile Menu Toggle =====
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// ===== Close Mobile Menu on Link Click =====
function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// ===== Animate Progress Bars =====
function animateProgressBars() {
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = `${progress}%`;
    });
}

// ===== Animate Stat Numbers =====
function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + '+';
            }
        };

        updateCounter();
    });
}

// ===== Intersection Observer for Animations =====
function createObserver() {
    const options = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, options);

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, options);

    const skillsSection = document.getElementById('skills');
    const aboutSection = document.getElementById('about');

    if (skillsSection) skillsObserver.observe(skillsSection);
    if (aboutSection) statsObserver.observe(aboutSection);
}

// ===== Smooth Scroll for Anchor Links =====
function handleAnchorClick(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            closeMenu();
        }
    }
}

// ===== Contact Form Handler =====
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnContent = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // Success
            submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            form.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        } else {
            // Error from Formspree
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert("Oops! There was a problem submitting your form");
                }
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
            });
        }
    }).catch(error => {
        // Network error
        alert("Oops! There was a problem submitting your form");
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
    });
}

// ===== Add Scroll Reveal Animation =====
function addScrollReveal() {
    const revealElements = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Start typing effect
    setTimeout(typeEffect, 1000);

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', handleAnchorClick));

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Initialize observers and animations
    createObserver();
    addScrollReveal();

    // Initial scroll check
    handleScroll();
});
