/* =========================================================
   MOUNIR DIGITAL — Interactions & animations
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('header');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active link highlight on scroll ---------- */
  var navLinks = document.querySelectorAll('.nav-link, .mbn-link');
  var sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    var pos = window.scrollY + 120;
    var current = 'accueil';
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (isNaN(target)) return;
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Portfolio filter ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      projectCards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.classList.toggle('hide', !show);
        if (show) {
          card.classList.add('in');
          card.style.animation = 'none';
          void card.offsetHeight;
          card.style.animation = 'cardIn .5s var(--ease) both';
        }
      });
    });
  });

  /* ---------- Contact form submit ---------- */
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');

  function setInvalid(input) {
    input.style.borderColor = '#ef4444';
  }
  function resetInvalid(input) {
    input.style.borderColor = '';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');

      [name, email, message].forEach(resetInvalid);

      if (!name.value.trim()) { setInvalid(name); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setInvalid(email); valid = false; }
      if (!message.value.trim()) { setInvalid(message); valid = false; }

      if (!valid) return;

      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
        setTimeout(function () { success.classList.remove('show'); }, 6000);
      }
    });

    [document.getElementById('name'),
     document.getElementById('email'),
     document.getElementById('message')].forEach(function (el) {
      if (el) el.addEventListener('input', function () { resetInvalid(el); });
    });
  }
/* ---------- Mobile bottom navigation active state ---------- */
  var bottomNav = document.getElementById('mobile-bottom-nav');
  if (bottomNav) {
    var bottomLinks = bottomNav.querySelectorAll('.mbn-link');
    bottomLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        bottomLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      });
    });
  }
})();
