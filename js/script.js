document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').classList.remove('fa-times');
            mobileToggle.querySelector('i').classList.add('fa-bars');
        }
    });

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll Animations (Fade Up)
    // Scroll Animations (Bidirectional)
    const observerOptions = {
        threshold: 0.1, // Trigger slightly earlier
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine 'scroll direction' relative to element
                // If element is below viewport (positive top), we are scrolling down to it -> Fade Up
                // If element is above viewport (negative/zero top), we are scrolling up to it -> Fade Down
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.add('fade-in-up');
                    entry.target.classList.remove('fade-in-down');
                } else {
                    entry.target.classList.add('fade-in-down');
                    entry.target.classList.remove('fade-in-up');
                }

                entry.target.classList.add('is-visible');

                // Trigger counter if it's a stat item
                if (entry.target.classList.contains('stat-item') || entry.target.closest('.stat-item')) {
                    // Ensure counters run only once
                    const statNumber = entry.target.querySelector('.stat-number') || entry.target;
                    if (statNumber.classList.contains('stat-number') && !statNumber.dataset.counted) {
                        animateValue(statNumber);
                        statNumber.dataset.counted = "true";
                    }
                }
            } else {
                // Reset animations when out of view (Bidirectional effect)
                entry.target.classList.remove('fade-in-up', 'fade-in-down', 'is-visible');
            }
        });
    }, observerOptions);

    // Observer all elements with .scroll-animate or legacy .fade-in-section
    document.querySelectorAll('.scroll-animate, .fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // Also observe stats specifically if they aren't inside a section
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });


    // Number Counter Animation
    function animateValue(obj) {
        const target = parseInt(obj.getAttribute("data-target"));
        const suffix = obj.getAttribute("data-suffix") || "";
        const duration = 2000; // 2 seconds
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Easing function (easeOutQuad)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            obj.innerHTML = Math.floor(easeProgress * target) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = target + suffix;
            }
        };

        window.requestAnimationFrame(step);
    }


    // Highlight Practice Area from Hash
    function checkHashAndHighlight() {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1); // Remove '#'
            const targetCard = document.getElementById(hash);

            if (targetCard) {
                // Scroll to element
                targetCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Add highlight class
                targetCard.classList.add('highlight-card');

                // Remove class after animation (3 cycles * 2s = 6s, but let's do 4s)
                setTimeout(() => {
                    targetCard.classList.remove('highlight-card');
                }, 4000);
            }
        }
    }


    // Close Mobile Menu when a link is clicked
    const menuLinks = document.querySelectorAll('.nav-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check if it's a real link (not the dropdown toggle)
            if (link.getAttribute('href') !== 'javascript:void(0)' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileToggle) {
                    const icon = mobileToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Check on load
    checkHashAndHighlight();

    // Check on hash change (if user clicks another link while on the page)
    window.addEventListener('hashchange', checkHashAndHighlight);

});
