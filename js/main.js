// VilaSEO Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initSmoothScroll();
  initFormValidation();
  initScrollAnimations();
});

// Navigation
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const body = document.body;

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      body.classList.toggle('nav-open');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) {
        body.classList.remove('nav-open');
      }
    });
  }
}

// Header scroll effect
function initScrollEffects() {
  const header = document.querySelector('.header');

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Form validation
function initFormValidation() {
  const forms = document.querySelectorAll('.contact-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const message = formData.get('message')?.trim();

      // Clear previous errors
      form.querySelectorAll('.form-error').forEach(el => el.remove());
      form.querySelectorAll('.form-input, .form-textarea').forEach(el => {
        el.style.borderColor = '';
      });

      let isValid = true;

      // Validate name
      if (!name) {
        showError(form.querySelector('[name="name"]'), 'Please enter your name');
        isValid = false;
      }

      // Validate email
      if (!email) {
        showError(form.querySelector('[name="email"]'), 'Please enter your email');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError(form.querySelector('[name="email"]'), 'Please enter a valid email');
        isValid = false;
      }

      // Validate message
      if (!message) {
        showError(form.querySelector('[name="message"]'), 'Please enter a message');
        isValid = false;
      }

      if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Thank you! We\'ll be in touch soon.';

        form.style.display = 'none';
        form.parentNode.insertBefore(successMsg, form.nextSibling);

        // In production, you would submit to a server here
        console.log('Form submitted:', { name, email, message });
      }
    });
  });
}

function showError(input, message) {
  if (!input) return;

  input.style.borderColor = '#dc2626';

  const error = document.createElement('span');
  error.className = 'form-error';
  error.textContent = message;

  input.parentNode.appendChild(error);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in');

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// Utility: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
