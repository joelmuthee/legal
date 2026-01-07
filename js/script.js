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
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
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
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // Also observe stats specifically if they aren't inside a fade-in-section
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

});
