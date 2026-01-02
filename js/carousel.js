// VilaSEO Carousel JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initLogoCarousels();
  initKolSlider();
});

// Infinite Logo Carousel
function initLogoCarousels() {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');

    if (!track) return;

    // Clone items for infinite scroll
    const items = track.querySelectorAll('.carousel-item');

    if (items.length === 0) return;

    // Clone all items and append to track
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });

    // Calculate and set animation duration based on content width
    const totalWidth = Array.from(items).reduce((acc, item) => {
      return acc + item.offsetWidth + 64; // 64px is the gap
    }, 0);

    // Adjust animation duration based on width (slower for more items)
    const duration = Math.max(20, totalWidth / 50);
    track.style.animationDuration = `${duration}s`;
  });
}

// KOL/Testimonial Slider
function initKolSlider() {
  const sliders = document.querySelectorAll('.kol-slider');

  sliders.forEach(slider => {
    const track = slider.querySelector('.kol-slider-track');
    const slides = slider.querySelectorAll('.kol-slider-slide');
    const dotsContainer = slider.querySelector('.kol-slider-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval;

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `kol-slider-dot${index === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer?.querySelectorAll('.kol-slider-dot');

    function goToSlide(index) {
      // Remove active class from current slide
      slides[currentIndex].classList.remove('active');
      if (dots) dots[currentIndex].classList.remove('active');

      // Update index
      currentIndex = index;

      // Add active class to new slide
      slides[currentIndex].classList.add('active');
      if (dots) dots[currentIndex].classList.add('active');

      // Update track position
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Reset autoplay timer
      resetAutoplay();
    }

    function nextSlide() {
      const next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }

    function prevSlide() {
      const prev = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prev);
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Keyboard navigation when slider is focused
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });

    // Start autoplay
    startAutoplay();

    // Set first slide as active
    if (slides.length > 0) {
      slides[0].classList.add('active');
    }
  });
}

// Utility: Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
