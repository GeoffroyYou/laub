// This is a manifest file that'll be compiled into application.js.
//= require rails-ujs
//= require turbolinks
//= require_tree .

// ========================================
// LAUB CAFE · ELEGANT INTERACTIONS
// ========================================

document.addEventListener('DOMContentLoaded', function() {

  // ========================================
  // MOBILE MENU
  // ========================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const nav = document.getElementById('nav');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      navMenu.classList.toggle('show');

      // Toggle icon
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }

      // Prevent body scroll when menu is open
      if (navMenu.classList.contains('show')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';

        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';

        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }

  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        // Get header height for offset
        const headerHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // ACTIVE NAVIGATION HIGHLIGHT
  // ========================================
  function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const scrollPosition = window.scrollY + 150;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          const linkHref = link.getAttribute('href');
          if (linkHref === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink);

  // ========================================
  // GALLERY LIGHTBOX
  // ========================================
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (!img) return;

      const imgSrc = img.src;
      const imgAlt = img.alt;

      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('aria-label', 'Image preview');
      lightbox.setAttribute('role', 'dialog');

      const lightboxContent = document.createElement('div');
      lightboxContent.className = 'lightbox-content';

      const lightboxImg = document.createElement('img');
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;

      const closeBtn = document.createElement('button');
      closeBtn.className = 'lightbox-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close preview');

      lightboxContent.appendChild(lightboxImg);
      lightboxContent.appendChild(closeBtn);
      lightbox.appendChild(lightboxContent);
      document.body.appendChild(lightbox);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Trigger animation
      setTimeout(function() {
        lightbox.classList.add('show');
      }, 10);

      // Close functions
      function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';

        setTimeout(function() {
          if (lightbox.parentNode) {
            lightbox.remove();
          }
        }, 300);
      }

      closeBtn.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      // Close on escape key
      function escapeHandler(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', escapeHandler);
        }
      }

      document.addEventListener('keydown', escapeHandler);
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // ========================================
  // FORM HANDLING
  // ========================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const name = this.querySelector('input[type="text"]').value.trim();
      const email = this.querySelector('input[type="email"]').value.trim();
      const message = this.querySelector('textarea').value.trim();

      // Simple validation
      if (!name || !email || !message) {
        showFormMessage(this, 'Please fill in all fields', 'error');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        showFormMessage(this, 'Please enter a valid email', 'error');
        return;
      }

      // Show success message
      showFormMessage(this, 'Thank you! We\'ll reply soon.', 'success');
      this.reset();

      // Here you would normally send to server
      console.log('Form submitted:', { name, email, message });
    });
  }

  // Helper function for form messages
  function showFormMessage(form, text, type) {
    // Remove existing message
    const oldMessage = document.querySelector('.form-message');
    if (oldMessage) oldMessage.remove();

    // Create message
    const message = document.createElement('div');
    message.className = `form-message form-message-${type}`;
    message.textContent = text;

    // Add to form
    form.appendChild(message);

    // Remove after 3 seconds
    setTimeout(function() {
      message.style.opacity = '0';
      setTimeout(function() {
        message.remove();
      }, 300);
    }, 3000);
  }

  // ========================================
  // RESIZE HANDLER
  // ========================================
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
      if (navMenu) {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';

        const icon = menuToggle?.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    }
  });
});

// ========================================
// ADD LIGHTBOX CSS
// ========================================
const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
  }

  .lightbox.show {
    opacity: 1;
  }

  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
  }

  .lightbox img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  .lightbox-close {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 40px;
    height: 40px;
    background: var(--clay);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
  }

  .lightbox-close:hover {
    background: var(--clay-deep);
    transform: rotate(90deg);
  }

  .form-message {
    margin-top: 20px;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
    animation: fadeIn 0.3s ease;
  }

  .form-message-success {
    background: #e8f0e3;
    color: #1d3b2a;
    border: 1px solid #1d3b2a;
  }

  .form-message-error {
    background: #fff1f0;
    color: #bc6c4b;
    border: 1px solid #bc6c4b;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(lightboxStyle);
