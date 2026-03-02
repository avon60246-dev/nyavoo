/* ===========================
   LOADER
=========================== */
window.addEventListener('load', () => {
  const progress = document.getElementById('loaderProgress');
  const loader = document.getElementById('loader');
  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHomeAnimations();
      }, 400);
    }
    progress.style.width = pct + '%';
  }, 80);
});
document.body.style.overflow = 'hidden';

function triggerHomeAnimations() {
  startTypewriter();
}

/* ===========================
   CUSTOM CURSOR
=========================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover effects on interactive elements
document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card, .social-icon').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    cursor.style.background = 'var(--accent3)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    follower.style.borderColor = 'var(--accent3)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--accent)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.borderColor = 'var(--accent2)';
  });
});

/* ===========================
   NAVBAR
=========================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  toggleBackTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when clicking a nav link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('.section');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) link.classList.add('active');
  });
}

/* ===========================
   TYPEWRITER
=========================== */
const words = ['Informatique', 'Web Development', 'Frontend Design', 'React Developer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  type();
}

function type() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const current = words[wordIndex];
  if (!isDeleting) {
    el.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      setTimeout(() => { isDeleting = true; type(); }, 1800);
      return;
    }
  } else {
    el.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(type, isDeleting ? 60 : 100);
}

/* ===========================
   SCROLL REVEAL
=========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Animate skill bars
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          fill.style.width = fill.dataset.width + '%';
        }
        // Animate count numbers
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(num => animateCount(num));
      }, i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.1 + 's';
  revealObserver.observe(el);
});

/* ===========================
   COUNT ANIMATION
=========================== */
function animateCount(el) {
  const target = parseInt(el.dataset.count);
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 40);
}

/* ===========================
   SKILL BARS OBSERVER
=========================== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        setTimeout(() => {
          fill.style.width = fill.dataset.width + '%';
        }, 300);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ===========================
   CONTACT FORM
=========================== */
function sendMessage() {
  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const subject = document.getElementById('subjectInput').value.trim();
  const msg = document.getElementById('msgInput').value.trim();

  if (!name || !email || !subject || !msg) {
    shakeForm();
    return;
  }

  const btn = document.getElementById('sendBtn');
  btn.innerHTML = '<span>Envoi en cours...</span><i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('nameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('subjectInput').value = '';
    document.getElementById('msgInput').value = '';

    btn.innerHTML = '<span>Envoyer le message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled = false;

    const success = document.getElementById('formSuccess');
    success.style.display = 'flex';
    success.style.animation = 'fadeInUp 0.5s ease';
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }, 1800);
}

function shakeForm() {
  const form = document.querySelector('.contact-form');
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => { form.style.animation = ''; }, 500);
}

// Add shake keyframe dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(styleSheet);

/* ===========================
   BACK TO TOP
=========================== */
function toggleBackTop() {
  const btn = document.getElementById('backTop');
  if (window.scrollY > 500) btn.classList.add('visible');
  else btn.classList.remove('visible');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===========================
   SMOOTH ANCHOR SCROLLING
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===========================
   PARALLAX ON HOME SHAPES
=========================== */
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, i) => {
    const factor = (i + 1) * 0.5;
    shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ===========================
   NAVBAR HIDE ON SCROLL DOWN
=========================== */
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = current;
});
navbar.style.transition = 'transform 0.35s ease, background 0.4s, box-shadow 0.4s, padding 0.4s';
