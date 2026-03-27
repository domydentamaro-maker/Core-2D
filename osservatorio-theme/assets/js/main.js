/**
 * Osservatorio — Main JavaScript
 * v2.0.0
 */

(function () {
  'use strict';

  /* ── Mobile Navigation Toggle ─────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Chiudi menu quando si clicca un link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Sticky Header con sfondo al scroll ────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener(
      'scroll',
      function () {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
          header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
          header.style.boxShadow = 'none';
        }
        lastScroll = currentScroll;
      },
      { passive: true }
    );
  }

  /* ── Smooth Scroll per ancore interne ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Animazioni fade-in al scroll ──────────────────────── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.post-card').forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
  }
})();
