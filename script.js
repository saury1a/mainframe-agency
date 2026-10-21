document.addEventListener('DOMContentLoaded', () => {
    // Video Scrubbing setup
    const video = document.getElementById('bg-video');
    const sensitivity = 0.8;
    let isSeeking = false;
    let queuedTime = null;
    let duration = 0;

    video.addEventListener('loadedmetadata', () => {
        duration = video.duration;
    });

    // Handle video load error gracefully
    video.addEventListener('error', () => {
        console.warn('Background video failed to load, falling back to cinematic dark aesthetic.');
        const container = document.querySelector('.bg-video-container');
        if (container) container.style.display = 'none';
    });

    function updateVideoTime(targetTime) {
        if (!duration || isNaN(duration)) return;
        
        const clampedTime = Math.max(0, Math.min(targetTime, duration));
        
        if (isSeeking) {
            queuedTime = clampedTime;
            return;
        }

        isSeeking = true;
        video.currentTime = clampedTime;
        
        const seekHandler = () => {
            isSeeking = false;
            video.removeEventListener('seeked', seekHandler);
            if (queuedTime !== null && queuedTime !== clampedTime) {
                const nextTime = queuedTime;
                queuedTime = null;
                updateVideoTime(nextTime);
            }
        };
        video.addEventListener('seeked', seekHandler);
    }

    window.addEventListener('mousemove', (e) => {
        if (!duration) return;
        const mouseX = e.clientX;
        const windowWidth = window.innerWidth;
        const ratio = mouseX / windowWidth;
        
        const targetTime = duration * ratio * sensitivity;
        updateVideoTime(targetTime);
    });

    // Navbar hide/show on scroll
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.pageYOffset;
    const scrollDelta = 15;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        
        if (Math.abs(currentScrollY - lastScrollY) > scrollDelta) {
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                // Scrolling Down
                navbar.classList.add('navbar-hidden');
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                const hamburger = document.getElementById('hamburger-btn');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    hamburger.classList.remove('active');
                }
            } else {
                // Scrolling Up
                navbar.classList.remove('navbar-hidden');
            }
            lastScrollY = currentScrollY;
        }
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    }

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking outside
    window.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // Typewriter Hook / Logic with 38ms per char and 600ms delay
    const typewriterTextEl = document.getElementById('typewriter-text');
    const cursorEl = document.getElementById('cursor');
    const targetString = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
    
    const charSpeed = 38;
    const startDelay = 600;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        typewriterTextEl.textContent = targetString;
        cursorEl.style.display = 'none';
    } else {
        let charIndex = 0;
        let timer = null;

        const startTimeout = setTimeout(() => {
            timer = setInterval(() => {
                if (charIndex < targetString.length) {
                    typewriterTextEl.textContent += targetString.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(timer);
                }
            }, charSpeed);
        }, startDelay);

        window.addEventListener('beforeunload', () => {
            clearTimeout(startTimeout);
            if (timer) clearInterval(timer);
        });
    }

    // Contact Form submission handler
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.classList.add('hidden');
            formSuccess.classList.remove('hidden');
        });
    }
});
