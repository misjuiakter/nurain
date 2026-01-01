(function () {
  'use strict';

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  // Footer year
  var yearEl = qs('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth scrolling + close navbar on mobile
  qsa('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = qs(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // collapse navbar if open
      var nav = qs('#mainNav');
      if (nav && nav.classList.contains('show') && window.bootstrap && window.bootstrap.Collapse) {
        var instance = window.bootstrap.Collapse.getInstance(nav) || new window.bootstrap.Collapse(nav, { toggle: false });
        instance.hide();
      }
    });
  });

  // Button glow follow (subtle)
  function attachGlow(btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      btn.style.setProperty('--mx', x + 'px');
      btn.style.setProperty('--my', y + 'px');
    });
  }
  qsa('.btn-gradient, .btn-outline-glow').forEach(attachGlow);

  // Counters
  function animateCounter(el) {
    var target = Number(el.getAttribute('data-target') || '0');
    var duration = 1200;
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var t = Math.min(1, (ts - startTime) / duration);
      var val = Math.floor(start + (target - start) * (0.1 + 0.9 * easeOutCubic(t)));
      el.textContent = String(val);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }

    requestAnimationFrame(step);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Progress bars
  function fillProgress(bar) {
    var pct = bar.getAttribute('data-progress');
    if (!pct) return;
    bar.style.width = pct + '%';
  }

  // Intersection observer triggers
  var counterEls = qsa('[data-counter]');
  var progressEls = qsa('.progress-bar[data-progress]');

  var seenCounters = new WeakSet();
  var seenProgress = new WeakSet();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          if (entry.target && entry.target.hasAttribute('data-counter')) {
            if (!seenCounters.has(entry.target)) {
              seenCounters.add(entry.target);
              animateCounter(entry.target);
            }
          }

          if (entry.target && entry.target.classList.contains('progress-bar')) {
            if (!seenProgress.has(entry.target)) {
              seenProgress.add(entry.target);
              fillProgress(entry.target);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    counterEls.forEach(function (el) {
      io.observe(el);
    });

    progressEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    // Fallback: run immediately
    counterEls.forEach(animateCounter);
    progressEls.forEach(fillProgress);
  }

  // Testimonials slider
  var testimonials = [
    {
      quote: '“Pixel-perfect design, fast delivery, and clean code. The site feels premium and performs great.”',
      name: 'Maya Chen',
      role: 'Product Manager, Northwave'
    },
    {
      quote: '“The UI is sleek and the animations are subtle but powerful. Communication was excellent.”',
      name: 'Jordan Blake',
      role: 'Founder, Studio Byte'
    },
    {
      quote: '“Our conversion rate improved immediately after launch. The performance score is outstanding.”',
      name: 'Elena Park',
      role: 'Marketing Lead, Brightlane'
    }
  ];

  var tQuote = qs('#testimonialQuote');
  var tName = qs('#testimonialName');
  var tRole = qs('#testimonialRole');
  var dotsWrap = qs('#testimonialDots');

  var idx = 0;
  var timer = null;

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    testimonials.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot' + (i === idx ? ' active' : '');
      b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      b.addEventListener('click', function () {
        setIndex(i);
        restart();
      });
      dotsWrap.appendChild(b);
    });
  }

  function setIndex(i) {
    idx = i;
    var t = testimonials[idx];
    if (tQuote) tQuote.textContent = t.quote;
    if (tName) tName.textContent = t.name;
    if (tRole) tRole.textContent = t.role;

    // update dots
    if (dotsWrap) {
      qsa('.dot', dotsWrap).forEach(function (d, di) {
        d.classList.toggle('active', di === idx);
      });
    }
  }

  function next() {
    var ni = (idx + 1) % testimonials.length;
    setIndex(ni);
  }

  function restart() {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(next, 4500);
  }

  if (tQuote && tName && tRole && dotsWrap) {
    renderDots();
    setIndex(0);
    restart();
  }

  // Contact form (demo only)
  var form = qs('#contactForm');
  var formNote = qs('#formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (formNote) formNote.textContent = 'Message queued (demo). Connect this form to your backend/email service.';
      form.reset();
    });
  }
})();
