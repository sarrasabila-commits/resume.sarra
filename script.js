// script.js — Scroll reveal, progress bar animation, portfolio lightbox, form handling
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.style.display = expanded ? '' : 'flex';
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // IntersectionObserver for reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Optional delay from data attribute
        const delay = parseInt(el.dataset.revealDelay || el.dataset.revealDelay === '0' ? el.dataset.revealDelay : el.getAttribute('data-reveal-delay') || 0, 10) || 0;
        setTimeout(() => el.classList.add('revealed'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Animate progress bars when skills section is visible
  const skillBars = document.querySelectorAll('.progress-bar');
  const skillsSection = document.querySelector('#skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach((bar, i) => {
            const level = parseInt(bar.dataset.level, 10) || 0;
            // Slight stagger
            setTimeout(() => {
              bar.style.width = `${level}%`;
              bar.setAttribute('aria-valuenow', level);
            }, i * 120);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    skillsObserver.observe(skillsSection);
  }

  // Portfolio lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(src, alt = '') {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-item').forEach(item => {
    const img = item.querySelector('img');
    item.addEventListener('click', () => openLightbox(img.dataset.full || img.src, img.alt || 'Preview'));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img.dataset.full || img.src, img.alt || 'Preview'); } });
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // Simple contact form handling (prevent real submit)
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name')?.toString().trim();
      const email = data.get('email')?.toString().trim();
      const message = data.get('message')?.toString().trim();
      if (!name || !email || !message) {
        formStatus.textContent = 'Mohon lengkapi semua field.';
        formStatus.style.color = 'crimson';
        return;
      }
      // Simulate sending...
      formStatus.textContent = 'Mengirim pesan...';
      formStatus.style.color = 'var(--muted)';
      setTimeout(() => {
        formStatus.textContent = 'Terima kasih — pesan berhasil dikirim (simulasi).';
        formStatus.style.color = 'green';
        form.reset();
      }, 900);
    });
  }

  // Accessibility: skip reveal if user prefers reduced motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    document.querySelectorAll('.progress-bar').forEach(bar => {
      bar.style.transition = 'none';
      bar.style.width = bar.dataset.level + '%';
    });
  }
});