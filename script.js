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
    initAOS();
    spawnHeroParticles();
    spawnClosingParticles();
    animateAgeRing();
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
