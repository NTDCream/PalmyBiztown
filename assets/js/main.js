/* ============================================
   PALMY BIZTOWN – MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ HEADER SCROLL ============
    const header = document.getElementById('header');
    const handleHeaderScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ============ ACTIVE NAV LINK ============
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');

    const updateActiveLink = () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ============ MOBILE MENU ============
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('open');
        document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.header__link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ============ COUNT UP ANIMATION ============
    const countElements = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    countElements.forEach(el => countObserver.observe(el));

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-quart)
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(eased * target);
            
            el.textContent = current.toLocaleString('vi-VN');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // ============ AOS (Animate On Scroll) ============
    const aosElements = document.querySelectorAll('[data-aos]');
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    aosElements.forEach(el => aosObserver.observe(el));

    // ============ MASTERPLAN TABS ============
    const tabs = document.querySelectorAll('.masterplan__tab');
    const panels = document.querySelectorAll('.masterplan__panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class
            tabs.forEach(t => t.classList.remove('masterplan__tab--active'));
            panels.forEach(p => p.classList.remove('masterplan__panel--active'));

            // Add active class
            tab.classList.add('masterplan__tab--active');
            document.getElementById(`panel-${targetTab}`).classList.add('masterplan__panel--active');
        });
    });

    // ============ GALLERY LIGHTBOX ============
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentGalleryIndex = 0;

    const galleryImages = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt,
        caption: item.querySelector('.gallery__item-overlay span')?.textContent || ''
    }));

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentGalleryIndex = index;
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        lightboxImg.src = galleryImages[index].src;
        lightboxImg.alt = galleryImages[index].alt;
        lightboxCaption.textContent = galleryImages[index].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentGalleryIndex);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        openLightbox(currentGalleryIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(currentGalleryIndex);
        }
        if (e.key === 'ArrowRight') {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
            openLightbox(currentGalleryIndex);
        }
    });

    // ============ BACK TO TOP ============
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============ CONTACT FORM ============
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value
        };

        // Validate
        if (!formData.name || !formData.phone) {
            showNotification('Vui lòng điền đầy đủ họ tên và số điện thoại.', 'error');
            return;
        }

        // Simulate form submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Đang gửi...</span><i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
            showNotification('Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.', 'success');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Gửi Thông Tin</span><i class="fas fa-arrow-right"></i>';
        }, 1500);
    });

    // ============ NOTIFICATION ============
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            borderRadius: '12px',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.92rem',
            fontWeight: '500',
            color: '#fff',
            background: type === 'success' 
                ? 'linear-gradient(135deg, #27ae60, #219a52)' 
                : 'linear-gradient(135deg, #e74c3c, #c0392b)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            transform: 'translateX(120%)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            maxWidth: '380px'
        });

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // ============ PARALLAX EFFECT (subtle) ============
    const heroContent = document.querySelector('.hero__content');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        }
    }, { passive: true });

});
