import './style.css'

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 4000);
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');
  const bookingForm = document.getElementById('booking-form');
  const formMessage = document.getElementById('form-message');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }

      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (currentScroll > lastScroll && currentScroll > 500) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.service-card, .package-card, .gallery-item, .info-card');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px'
  });

  document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitButton = bookingForm.querySelector('.submit-button');
    const originalText = submitButton.querySelector('span').textContent;
    submitButton.querySelector('span').textContent = 'Processing...';
    submitButton.disabled = true;

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);

    if (selectedDate < today) {
      showMessage('Please select a future date for your appointment.', 'error');
      submitButton.querySelector('span').textContent = originalText;
      submitButton.disabled = false;
      return;
    }

    if (!name || !email || !phone || !date || !service) {
      showMessage('Please fill in all required fields.', 'error');
      submitButton.querySelector('span').textContent = originalText;
      submitButton.disabled = false;
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      submitButton.querySelector('span').textContent = originalText;
      submitButton.disabled = false;
      return;
    }

    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      showMessage('Please enter a valid phone number.', 'error');
      submitButton.querySelector('span').textContent = originalText;
      submitButton.disabled = false;
      return;
    }

    setTimeout(() => {
      console.log('Booking Request:', {
        name,
        email,
        phone,
        date,
        service,
        message
      });

      showMessage('Thank you! Your booking request has been received. We will contact you shortly to confirm your appointment.', 'success');
      bookingForm.reset();
      submitButton.querySelector('span').textContent = originalText;
      submitButton.disabled = false;

      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 10000);
    }, 1500);
  });

  function showMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const packageButtons = document.querySelectorAll('.package-button');
  packageButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const packageCard = button.closest('.package-card');
      const packageName = packageCard.querySelector('h3').textContent;
      const contactSection = document.getElementById('contact');
      const offsetTop = contactSection.offsetTop - 80;

      packageCard.style.transform = 'scale(0.95)';
      setTimeout(() => {
        packageCard.style.transform = '';
      }, 200);

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      setTimeout(() => {
        const serviceSelect = document.getElementById('service');
        const serviceName = packageName.toLowerCase().replace(' package', '').replace(' retreat', '').replace(' indulgence', '');

        for (let option of serviceSelect.options) {
          if (option.value.includes(serviceName) || option.text.toLowerCase().includes(serviceName)) {
            serviceSelect.value = option.value;
            serviceSelect.style.transform = 'scale(1.02)';
            serviceSelect.focus();
            setTimeout(() => {
              serviceSelect.style.transform = '';
            }, 300);
            break;
          }
        }
      }, 1000);
    });
  });

  const newsletterForm = document.querySelector('.newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const button = newsletterForm.querySelector('button');
    const email = emailInput.value;

    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const originalText = button.textContent;
      button.textContent = 'Subscribed!';
      button.style.background = '#4caf50';

      setTimeout(() => {
        emailInput.value = '';
        button.textContent = originalText;
        button.style.background = '';
      }, 3000);
    } else {
      button.textContent = 'Invalid Email';
      button.style.background = '#f44336';
      setTimeout(() => {
        button.textContent = 'Subscribe';
        button.style.background = '';
      }, 2000);
    }
  });

  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;

    item.addEventListener('click', () => {
      item.style.transform = 'scale(0.95)';
      setTimeout(() => {
        item.style.transform = '';
      }, 200);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.05)';
    });

    ctaButton.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  }

  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  const parallaxElements = document.querySelectorAll('.about-image, .hero');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((el, index) => {
      const speed = index === 0 ? 0.5 : 0.3;
      const yPos = -(scrolled * speed);
      if (el.classList.contains('hero')) {
        el.style.backgroundPositionY = `${50 + (scrolled * 0.3)}%`;
      }
    });
  });

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '';
    });
  });

  let ticking = false;
  let scrollPosition = 0;

  window.addEventListener('scroll', () => {
    scrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax(scrollPosition);
        ticking = false;
      });

      ticking = true;
    }
  });

  function updateParallax(scrollPos) {
    const heroElement = document.querySelector('.hero');
    if (heroElement && scrollPos < window.innerHeight) {
      heroElement.style.backgroundPositionY = `${scrollPos * 0.5}px`;
    }
  }

  const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function() {
      this.parentElement.style.transform = '';
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  const infoCards = document.querySelectorAll('.info-card');
  infoCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '5';
    });

    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '';
    });
  });
});
