/* ============================================================
   PHOTO DATA — Edit captions here!
   ============================================================ */
const PHOTOS = [
  { src: 'photos/photo1.jpg', icon: '📷', caption: 'kita photobooth di uragawa, masih kaku, wkww' },
  { src: 'photos/photo2.jpg', icon: '🥤', caption: 'kelaperan, beli kue koin, takut papasan sama rohan -_-' },
  { src: 'photos/photo3.jpg', icon: '📸', caption: 'banyak gaya foto di aeon, setdahh' },
  { src: 'photos/photo4.jpg', icon: '😏', caption: 'udah kaya jinakin orang neeh' },
  { src: 'photos/photo5.jpg', icon: '✨', caption: 'ini bagus sihhh photoboothnyaa' },
  { src: 'photos/photo6.jpg', icon: '😎', caption: 'katanya ini cakep banget fotonya, (siape dulu yang motoin dongg 😎)' },
];

/* ============================================================
   BUILD TICKER GALLERY
   ============================================================ */
function buildTicker() {
  // Row 1: all 6 photos
  // Row 2: reversed order of 6 photos
  const row1 = PHOTOS;
  const row2 = [...PHOTOS].reverse();

  function makeCard(photo, idx) {
    const card = document.createElement('div');
    card.className = 'ticker-card';
    card.onclick = () => openLightbox(idx);

    const photoDiv = document.createElement('div');
    photoDiv.className = 'ticker-photo';

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption;
    img.onerror = () => photoDiv.classList.add('no-img');

    const placeholder = document.createElement('div');
    placeholder.className = 'ticker-placeholder';
    placeholder.textContent = photo.icon || '🌸';

    photoDiv.appendChild(img);
    photoDiv.appendChild(placeholder);

    const cap = document.createElement('div');
    cap.className = 'ticker-caption';
    cap.innerHTML = `<p>${photo.caption}</p><span>✦</span>`;

    card.appendChild(photoDiv);
    card.appendChild(cap);
    return card;
  }

  function populateTrack(trackEl, photos) {
    // Build original set
    const originals = photos.map((p, i) => makeCard(p, PHOTOS.indexOf(p)));
    // Duplicate for seamless loop
    const clones = originals.map(c => c.cloneNode(true));
    // Re-attach click on clones
    clones.forEach((clone, i) => {
      const orig = originals[i];
      clone.onclick = orig.onclick;
    });
    originals.forEach(c => trackEl.appendChild(c));
    clones.forEach(c => trackEl.appendChild(c));
  }

  populateTrack(document.getElementById('tickerTrack1'), row1);
  populateTrack(document.getElementById('tickerTrack2'), row2);
}

/* ============================================================
   FLOATING PETALS
   ============================================================ */
const PETALS = ['🌸', '🌼', '🍂', '🌿', '✨', '🌾', '🪷'];
function spawnPetal() {
  const el = document.createElement('div');
  el.className = 'petal';
  el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (Math.random() * 0.7 + 0.55) + 'rem';
  const dur = Math.random() * 10 + 12;
  const delay = Math.random() * 5;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = delay + 's';
  document.getElementById('petals').appendChild(el);
  setTimeout(() => el.remove(), (dur + delay) * 1000 + 200);
}
for (let i = 0; i < 10; i++) setTimeout(spawnPetal, i * 400);
setInterval(spawnPetal, 1000);

/* ============================================================
   ENVELOPE OPEN
   ============================================================ */
let envelopeOpened = false;
document.body.style.overflow = 'hidden';

window.openEnvelope = function () {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // 1. Open flap
  document.getElementById('envFlap').classList.add('open');
  // 2. Rise letter
  setTimeout(() => document.getElementById('envLetter').classList.add('rise'), 400);
  // 3. Hide intro, show main
  setTimeout(() => {
    document.getElementById('introScreen').classList.add('out');
    const main = document.getElementById('mainContent');
    main.classList.remove('main-hidden');
    main.classList.add('main-visible');
    document.body.style.overflow = '';
    buildTicker();
    splitChars();        // hero title letter animation
    initAOS();
    spawnHeroParticles();
    spawnClosingParticles();
    animateAgeRing();
    initLusionMessage();         // Lusion-style scroll typography for message
    initWishesAnimation();       // Wishes kinetic letters & words
    initClosingMovingLetters();  // Elegant moving letters for closing quote
    // Auto-play music
    const music = document.getElementById('bgMusic');
    music.volume = 0.35;
    music.play().catch(() => { });
  }, 1000);
};

/* ============================================================
   SCROLL ANIMATION (AOS)
   ============================================================ */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
  // Trigger hero elements immediately
  document.querySelectorAll('.hero [data-aos]').forEach((el, i) => {
    setTimeout(() => el.classList.add('aos-animate'), 300 + i * 120);
  });
}

/* ============================================================
   AGE RING ANIMATION
   ============================================================ */
function animateAgeRing() {
  setTimeout(() => document.querySelector('.ring-fill').classList.add('animate'), 600);
}

/* ============================================================
   SPLIT CHARS — hero title letter-by-letter
   ============================================================ */
function splitChars() {
  const lines = [
    { el: document.getElementById('heroLine1'), baseDelay: 450 },
    { el: document.getElementById('heroLine2'), baseDelay: 900 },
  ];

  lines.forEach(({ el, baseDelay }) => {
    if (!el) return;
    const text = el.textContent.trim();
    el.textContent = '';

    // Split into words so responsive wrapping never breaks in the middle of a word
    const words = text.split(/\s+/);
    let charIdx = 0;

    words.forEach((word, wIdx) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'word-wrap';

      [...word].forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        wordWrap.appendChild(span);

        // Stagger each char
        const delay = baseDelay + charIdx * 38;
        setTimeout(() => span.classList.add('visible'), delay);
        charIdx++;
      });

      el.appendChild(wordWrap);

      // Add clean space between words
      if (wIdx < words.length - 1) {
        const space = document.createElement('span');
        space.className = 'char-space';
        space.innerHTML = '&nbsp;';
        el.appendChild(space);
      }
    });
  });
}

/* ============================================================
   LUSION-STYLE SCROLL TYPOGRAPHY (Message Section)
   ============================================================ */
function initLusionMessage() {
  const card = document.getElementById('msgCard');
  if (!card) return;

  const pMain = document.getElementById('msgMain');
  const pSub = document.getElementById('msgSub');

  if (pMain) processLusionParagraph(pMain);
  if (pSub) processLusionParagraph(pSub);

  function processLusionParagraph(pEl) {
    const rawHTML = pEl.innerHTML;
    const lines = rawHTML.split(/<br\s*\/?>/gi);
    pEl.innerHTML = '';

    lines.forEach((lineHTML) => {
      const lineSpan = document.createElement('span');
      lineSpan.className = 'lusion-line';

      const temp = document.createElement('div');
      temp.innerHTML = lineHTML.trim();

      function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/\s+/).filter(Boolean);
          words.forEach((w) => {
            const span = document.createElement('span');
            span.className = 'lusion-word';
            if (w === '🤍') span.classList.add('lusion-heart');
            span.textContent = w;
            lineSpan.appendChild(span);
            lineSpan.appendChild(document.createTextNode(' '));
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          const words = node.textContent.split(/\s+/).filter(Boolean);
          words.forEach((w) => {
            const span = document.createElement('span');
            span.className = 'lusion-word';
            if (tag === 'strong' || node.classList.contains('highlight')) {
              span.classList.add('highlight');
            }
            if (tag === 'em') {
              span.classList.add('accent');
            }
            if (w === '🤍') span.classList.add('lusion-heart');
            span.textContent = w;
            lineSpan.appendChild(span);
            lineSpan.appendChild(document.createTextNode(' '));
          });
        }
      }

      temp.childNodes.forEach(walk);
      pEl.appendChild(lineSpan);
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateLusionWords();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateLusionWords() {
    const words = card.querySelectorAll('.lusion-word');
    if (!words.length) return;

    const rect = card.getBoundingClientRect();
    const vh = window.innerHeight;

    // Start scrub at 88% viewport, complete at 24% viewport
    const startY = vh * 0.88;
    const endY = vh * 0.24;

    const rawProgress = (startY - rect.top) / (startY - endY);
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    const total = words.length;
    const activeCount = Math.floor(progress * (total + 2));

    words.forEach((word, idx) => {
      if (idx < activeCount) {
        word.classList.add('active');
      } else {
        word.classList.remove('active'); // Reverses / 'back' when scrolling up!
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateLusionWords();
}

/* ============================================================
   WISHES KINETIC ANIMATION (Letter & Word scroll moving)
   ============================================================ */
function initWishesAnimation() {
  const section = document.getElementById('wishes');
  if (!section) return;

  const items = section.querySelectorAll('.wish-item');
  if (!items.length) return;

  items.forEach((item) => {
    const title = item.querySelector('.wish-title') || item.querySelector('h3');
    const desc = item.querySelector('.wish-desc') || item.querySelector('p');

    // Split title into kinetic characters
    if (title) {
      const text = title.textContent.trim();
      title.innerHTML = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = ch === ' ' ? 'wish-char wish-space' : 'wish-char';
        if (ch === ' ') span.innerHTML = '&nbsp;';
        else span.textContent = ch;
        span.style.setProperty('--char-delay', (i * 22) + 'ms');
        title.appendChild(span);
      });
    }

    // Split desc into kinetic words
    if (desc) {
      const text = desc.textContent.trim();
      desc.innerHTML = '';
      const words = text.split(/\s+/).filter(Boolean);
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'wish-word';
        span.textContent = word;
        span.style.setProperty('--word-delay', (60 + i * 28) + 'ms');
        desc.appendChild(span);
        desc.appendChild(document.createTextNode(' '));
      });
    }
  });

  let ticking = false;
  function onScrollWishes() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateWishes();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateWishes() {
    const vh = window.innerHeight;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const inView = rect.top < vh * 0.88 && rect.bottom > vh * 0.08;
      if (inView) {
        item.classList.add('wish-active');
      } else {
        item.classList.remove('wish-active'); // Reverses / 'back' when scrolling up!
      }
    });
  }

  window.addEventListener('scroll', onScrollWishes, { passive: true });
  window.addEventListener('resize', onScrollWishes, { passive: true });
  updateWishes();
}

/* ============================================================
   ELEGANT KINETIC MOVING CHARS (Closing Quote)
   ============================================================ */
function initClosingMovingLetters() {
  const quoteEl = document.getElementById('closingQuote');
  if (!quoteEl) return;

  const rawHTML = quoteEl.innerHTML;
  const lines = rawHTML.split(/<br\s*\/?>/gi);
  quoteEl.innerHTML = '';

  let charCount = 0;

  lines.forEach((lineText, lineIdx) => {
    const lineSpan = document.createElement('span');
    lineSpan.className = 'cq-line';

    const cleanLine = lineText.replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ').trim();
    const words = cleanLine.split(/\s+/).filter(Boolean);

    words.forEach((word, wIdx) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'cq-word-wrap';

      [...word].forEach((ch) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'cq-char';
        charSpan.textContent = ch;
        charSpan.dataset.charIdx = charCount++;
        wordWrap.appendChild(charSpan);
      });

      lineSpan.appendChild(wordWrap);

      if (wIdx < words.length - 1) {
        const space = document.createElement('span');
        space.className = 'cq-space';
        space.innerHTML = '&nbsp;';
        lineSpan.appendChild(space);
      }
    });

    quoteEl.appendChild(lineSpan);

    if (lineIdx < lines.length - 1) {
      quoteEl.appendChild(document.createElement('br'));
    }
  });

  const chars = quoteEl.querySelectorAll('.cq-char');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        chars.forEach((c) => {
          const idx = parseInt(c.dataset.charIdx, 10) || 0;
          setTimeout(() => c.classList.add('visible'), 200 + idx * 22);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(quoteEl);

  // Subtle scroll parallax float
  window.addEventListener('scroll', () => {
    const rect = quoteEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (rect.top - window.innerHeight * 0.5) * 0.04;
      quoteEl.style.transform = `translateY(${offset}px)`;
    }
  }, { passive: true });
}

/* ============================================================
   PARALLAX HERO
   ============================================================ */
window.addEventListener('scroll', () => {
  const bg = document.querySelector('.hero-bg-img');
  if (bg) bg.style.transform = 'translateY(' + window.scrollY * 0.32 + 'px)';
}, { passive: true });

/* ============================================================
   HERO PARTICLES
   ============================================================ */
function spawnHeroParticles() {
  const container = document.getElementById('heroParticles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
    const dur = Math.random() * 6 + 6;
    const delay = Math.random() * 8;
    p.style.animationDuration = dur + 's';
    p.style.animationDelay = delay + 's';
    container.appendChild(p);
  }
}

/* ============================================================
   CLOSING PARTICLES
   ============================================================ */
function spawnClosingParticles() {
  const container = document.getElementById('closingParticles');
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'cp';
    const size = Math.random() * 80 + 30;
    p.style.width = p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    const dur = Math.random() * 6 + 5;
    const delay = Math.random() * 4;
    p.style.animationDuration = dur + 's';
    p.style.animationDelay = '-' + delay + 's';
    container.appendChild(p);
  }
}

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
let musicPlaying = false;
const musicBtn = document.getElementById('musicBtn');

window.toggleMusic = function () {
  const music = document.getElementById('bgMusic');
  if (musicPlaying) {
    music.pause();
    musicBtn.classList.add('muted');
  } else {
    music.volume = 0.35;
    music.play().catch(() => { });
    musicBtn.classList.remove('muted');
  }
  musicPlaying = !musicPlaying;
};

document.getElementById('bgMusic').addEventListener('play', () => {
  musicPlaying = true;
  musicBtn.classList.remove('muted');
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
let currentPhoto = 0;

window.openLightbox = function (idx) {
  currentPhoto = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
};

window.navLightbox = function (dir) {
  currentPhoto = (currentPhoto + dir + PHOTOS.length) % PHOTOS.length;
  updateLightbox();
};

function updateLightbox() {
  const ph = PHOTOS[currentPhoto];
  const img = document.getElementById('lbImg');
  img.style.opacity = '0';
  img.src = ph.src;
  img.onload = () => { img.style.transition = 'opacity 0.3s ease'; img.style.opacity = '1'; };
  img.onerror = () => { img.style.opacity = '1'; };
  document.getElementById('lbCaption').textContent = ph.caption;
}

// Swipe support for lightbox
let lbStartX = 0;
document.getElementById('lightbox').addEventListener('touchstart', e => { lbStartX = e.touches[0].clientX; });
document.getElementById('lightbox').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - lbStartX;
  if (Math.abs(dx) > 50) navLightbox(dx < 0 ? 1 : -1);
});

// Keyboard nav
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowRight') navLightbox(1);
  if (e.key === 'ArrowLeft') navLightbox(-1);
  if (e.key === 'Escape') closeLightbox();
});

/* ============================================================
   CONFETTI
   ============================================================ */
const CONFETTI_COLORS = ['#c9a96e', '#e8d5b0', '#8b6f5a', '#d4c4b0', '#fff9f4', '#b89a82', '#f5deb3', '#a07050'];
window.celebrate = function () {
  const btn = document.getElementById('celebrateBtn');
  btn.querySelector('.btn-text').textContent = '🎉 Happy Birthday, Putri!';
  setTimeout(() => { btn.querySelector('.btn-text').textContent = '🎉 Klik buat ngerayain !'; }, 4000);

  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-p';
      const size = Math.random() * 10 + 5;
      p.style.left = Math.random() * 100 + 'vw';
      p.style.width = size + 'px';
      p.style.height = size + (Math.random() > 0.5 ? 'px' : (size * 2.2) + 'px');
      p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      const dur = Math.random() * 2.5 + 2;
      p.style.animationDuration = dur + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 100);
    }, i * 18);
  }
};

/* ============================================================
   EASTER EGG — IT / PIXEL PAGE
   ============================================================ */
const IT_LINES = [
  { text: '$ hello!', cls: '', delay: 0 },
  { text: '> maaf agak kaku, jadi aku coba bikin ini~', cls: 'white', delay: 400 },
  { text: '', cls: '', delay: 900 },
  { text: '$ cat ucapan.txt', cls: '', delay: 1300 },
  { text: '> "Selamat ulang tahun, Putri~~"', cls: 'gold', delay: 1800 },
  { text: '> "Semoga sehat, bahagia, dan semua jalannya dimudahkan"', cls: 'gold', delay: 2200 },
  { text: '', cls: '', delay: 2700 },
  { text: '$ ./deploy_birthday --target=putri --mode=birthday', cls: '', delay: 3100 },
  { text: '  Installing feelings...  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 100%', cls: 'dim', delay: 3600 },
  { text: '  Compiling sincerity...  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 100%', cls: 'dim', delay: 4000 },
  { text: '  Bundling warmth...      [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 100%', cls: 'dim', delay: 4400 },
  { text: '', cls: '', delay: 4900 },
  { text: '\u2713  Build successful.', cls: 'pink', delay: 5300 },
  { text: '\u2713  Deployed to: putri-angry.on.every.move.i.made', cls: 'pink', delay: 5700 },
  { text: '', cls: '', delay: 6200 },
  { text: '# ps: dibuat malam sebelum ulang tahun hehe. \ud83c\udf38', cls: 'comment', delay: 6600 },
];

let itTyped = false;
window.goToItPage = function () {
  document.getElementById('itPage').classList.add('open');
  if (!itTyped) { itTyped = true; typeItLines(); }
};
window.closeItPage = function () {
  document.getElementById('itPage').classList.remove('open');
};

function typeItLines() {
  const body = document.getElementById('itBody');
  IT_LINES.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = cls;
      line.textContent = text || '\u00a0';
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
    }, delay);
  });
}

// Smooth scroll for anchor
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});
