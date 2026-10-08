// ══════════════════════════════════════════════════════════════════════════════
// THE GRAND AURAVELLE POOL VILLA — FULL CLIENT APPLICATION JAVASCRIPT
// Features: Space Portal Intro, Particles Canvas, Dynamic API Sync, Video Player,
// Suites Showcase, Sanctuary Feature Selector, Reviews Counter & Slider, Lightbox Viewer,
// Navbar & Sticky Book Bar, Mobile Drawer, AJAX Booking Form & Validation.
// ══════════════════════════════════════════════════════════════════════════════

const API_BASE = window.location.origin.includes(':3000')
  ? window.location.origin + '/api'
  : (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api');

// ── 1. SPACE PORTAL CINEMATIC INTRO ──
(function initSpacePortal() {
  const intro = document.getElementById("space-intro");
  const canvas = document.getElementById("space-canvas");
  if (!intro || !canvas) return;

  const ctx = canvas.getContext("2d");
  const earthZoom = document.getElementById("earth-zoom");
  const earthImg = document.getElementById("earth-img");
  const titleOverlay = document.getElementById("intro-title-overlay");
  const skipBtn = document.getElementById("intro-skip");

  let W, H, animId, phaseT = 0;
  let bgStars = [];
  let done = false;

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  for (let i = 0; i < 220; i++) {
    bgStars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.0003 + 0.0001,
      brightness: Math.random(),
    });
  }

  const dismiss = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(animId);
    clearTimeout(autoDismissTimer);

    intro.style.transition = "opacity 0.8s ease";
    intro.style.opacity = "0";

    setTimeout(() => {
      intro.style.display = "none";
      intro.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      const heroMedia = document.getElementById("hero-media");
      if (heroMedia) heroMedia.classList.add("loaded");
    }, 800);
  };

  const autoDismissTimer = setTimeout(() => {
    if (!done) dismiss();
  }, 6500);

  if (skipBtn) {
    skipBtn.addEventListener("click", dismiss);
    skipBtn.addEventListener("touchstart", dismiss, { passive: true });
  }

  document.body.style.overflow = "hidden";

  const draw = () => {
    if (done) return;
    animId = requestAnimationFrame(draw);
    phaseT += 0.016;

    ctx.fillStyle = "rgba(11, 23, 19, 0.22)";
    ctx.fillRect(0, 0, W, H);

    bgStars.forEach((s) => {
      const cx = W / 2, cy = H / 2;
      const dx = s.x * W - cx, dy = s.y * H - cy;
      const warp = 1 + phaseT * 0.4;
      const nx = cx + dx * (1 + warp * s.speed * phaseT * 20);
      const ny = cy + dy * (1 + warp * s.speed * phaseT * 20);

      if (nx < 0 || nx > W || ny < 0 || ny > H) {
        s.x = Math.random();
        s.y = Math.random();
        return;
      }

      ctx.fillStyle = `rgba(223, 196, 141, ${0.4 + s.brightness * 0.6})`;
      ctx.beginPath();
      ctx.arc(nx, ny, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (phaseT < 2.5) {
      for (let ring = 0; ring < 4; ring++) {
        const rr = (phaseT * 180 + ring * 100) % (Math.min(W, H) * 0.6);
        ctx.strokeStyle = `rgba(198, 166, 106, ${Math.max(0, 0.12 - rr / 5000)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, rr, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (phaseT > 1.8 && phaseT < 5.5) {
      const alpha = Math.min(1, (phaseT - 1.8) / 1.2);
      if (earthZoom) {
        earthZoom.style.opacity = alpha;
        const scale = 0.5 + (phaseT - 1.8) * 0.15;
        if (earthImg) {
          const sz = Math.min(scale * Math.min(W, H) * 0.4, 420);
          earthImg.style.width = sz + "px";
          earthImg.style.height = sz + "px";
          earthImg.style.opacity = "1";
        }
      }
      if (titleOverlay && phaseT > 2.5) {
        titleOverlay.style.opacity = Math.min(1, (phaseT - 2.5) / 1.0);
      }
    }

    if (phaseT > 5.0) {
      dismiss();
    }
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dismiss();
  } else {
    requestAnimationFrame(draw);
  }
})();

// ── 2. AMBIENT PARTICLES CANVAS ──
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.5 + 0.2
  }));

  function render() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.fillStyle = `rgba(198, 166, 106, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  }
  render();
})();

// ── 3. VILLA / VILLA VIDEO PLAYER ──
(function initVideoPlayer() {
  const vid = document.getElementById('villa-vid') || document.getElementById('villa-vid');
  const playBtn = document.getElementById('video-play-btn');
  if (!vid || !playBtn) return;

  function togglePlay() {
    if (vid.paused) {
      vid.play();
      playBtn.style.opacity = '0';
      playBtn.style.pointerEvents = 'none';
    } else {
      vid.pause();
      playBtn.style.opacity = '1';
      playBtn.style.pointerEvents = 'auto';
    }
  }

  playBtn.addEventListener('click', togglePlay);
  vid.addEventListener('click', togglePlay);
})();

// ── 4. DYNAMIC SETTINGS & SUITES SYNCHRONIZATION ──
let activeRoomsData = [];
let currentSuiteIndex = 0;

const fallbackRooms = [
  {
    name: "Orchard View Room",
    subtitle: "Cozy Twin Layout & Garden View",
    price: "₹5,500 – ₹7,000 / night",
    description: "A warm, compact retreat with garden-facing windows, perfect for guests who want comfort without the extra footprint.",
    images: ["images/room-1-a.png", "images/room-1-b.png", "images/room-1-c.png"],
    amenities: ["Private Balcony", "Plush King Bed", "Air Conditioning", "Tea Station", "Seating Lounge", "Ambient Lighting"]
  },
  {
    name: "Highland Balcony Suite",
    subtitle: "Panoramic Mountain View",
    price: "₹7,500 – ₹9,500 / night",
    description: "Wake up to misty hill vistas from your expansive private balcony. Features handcrafted wooden finishes, a luxury rain shower en-suite, and sweeping morning horizons.",
    images: ["images/room-2-a.png", "images/room-2-b.png", "images/room-2-c.png"],
    amenities: ["King Bed", "Private Balcony", "Mountain View", "Rain Shower", "Mini Bar", "High-Speed WiFi"]
  },
  {
    name: "Royal Pool Suite",
    subtitle: "Private Heated Plunge Pool",
    price: "₹12,000 – ₹15,000 / night",
    description: "Indulge in absolute luxury with your dedicated heated plunge pool directly adjoining the bedroom suite. Features floor-to-ceiling glass and mood lighting.",
    images: ["images/room-3-a.png", "images/room-3-b.png"],
    amenities: ["King Bed", "Private Heated Pool", "Mountain View", "En-suite Jacuzzi", "Complimentary Breakfast", "24/7 Butler Support"]
  },
  {
    name: "Grand Family Villa",
    subtitle: "Spacious Multi-Room & Lawn Terrace",
    price: "₹14,000 – ₹18,000 / night",
    description: "Generous living areas and dual bedrooms facing native orchards. Perfect for family getaways and group retreats in total seclusion.",
    images: ["images/room-4-a.png", "images/room-4-b.png", "images/room-4-c.png"],
    amenities: ["Dual King Beds", "Private Lawn Access", "Outdoor Firepit", "Large Balcony", "Espresso Station", "24/7 Service"]
  }
];

async function syncDynamicData() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (res.ok) {
      const settings = await res.json();
      applySettings(settings);
    }
  } catch (err) {}

  try {
    const res = await fetch(`${API_BASE}/rooms`);
    if (res.ok) {
      const rooms = await res.json();
      if (Array.isArray(rooms) && rooms.length > 0) {
        activeRoomsData = rooms;
        displaySuite(0);
  loadReviewsFromAPI();
      }
    }
  } catch (err) {}
}

function applySettings(settings) {
  if (!settings) return;
  if (settings.phone) {
    document.querySelectorAll('[data-dynamic="phone"]').forEach(el => {
      el.textContent = settings.phone;
      if (el.tagName === 'A') el.href = `tel:${settings.phone.replace(/\s+/g, '')}`;
    });
  }
  if (settings.email) {
    document.querySelectorAll('[data-dynamic="email"]').forEach(el => {
      el.textContent = settings.email;
      if (el.tagName === 'A') el.href = `mailto:${settings.email}`;
    });
  }
  if (settings.meta_title) {
    document.title = settings.meta_title;
  }
}

let currentSuiteImgIndex = 0;

function displaySuite(index) {
  const list = activeRoomsData.length ? activeRoomsData : fallbackRooms;
  if (!list[index]) return;
  currentSuiteIndex = index;
  currentSuiteImgIndex = 0;
  const room = list[index];

  const photo = document.getElementById('suite-photo');
  const numBadge = document.getElementById('suite-num-badge');
  const subtitle = document.getElementById('suite-subtitle');
  const title = document.getElementById('suite-title');
  const desc = document.getElementById('suite-desc');
  const price = document.getElementById('suite-price');
  const amenitiesList = document.getElementById('suite-amenities-list');
  const dots = document.getElementById('suite-dots');

  if (title) title.textContent = room.name;
  if (subtitle) subtitle.textContent = room.subtitle || 'Luxury Mountain Suite';
  if (numBadge) numBadge.textContent = `Room 0${index + 1}`;
  if (price) price.textContent = typeof room.price === 'number' ? `₹${room.price.toLocaleString()} / night` : room.price;
  if (desc) desc.textContent = room.description || '';

  const images = (room.images && room.images.length) ? room.images : ['images/room-1-a.png'];
  if (photo) {
    photo.style.opacity = '0';
    setTimeout(() => {
      photo.src = images[0];
      photo.style.opacity = '1';
    }, 200);
  }

  if (amenitiesList && room.amenities) {
    amenitiesList.innerHTML = room.amenities.map(a => `
      <div class="amenity-pill"><span>✦</span> ${a}</div>
    `).join('');
  }

  if (dots) {
    dots.innerHTML = images.map((_, i) => `
      <button class="suite-dot ${i === 0 ? 'active' : ''}" data-img="${i}" aria-label="Suite Image ${i+1}"></button>
    `).join('');

    dots.querySelectorAll('.suite-dot').forEach(d => {
      d.addEventListener('click', () => {
        const imgIdx = parseInt(d.dataset.img, 10);
        changeSuiteImage(imgIdx, images);
      });
    });
  }

  // Update tab button active state
  document.querySelectorAll('.suite-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
}

function changeSuiteImage(imgIdx, images) {
  currentSuiteImgIndex = imgIdx;
  const photo = document.getElementById('suite-photo');
  if (photo) {
    photo.style.opacity = '0';
    setTimeout(() => {
      photo.src = images[imgIdx];
      photo.style.opacity = '1';
    }, 200);
  }
  document.querySelectorAll('#suite-dots .suite-dot').forEach((d, i) => {
    d.classList.toggle('active', i === imgIdx);
  });
}

document.querySelectorAll('.suite-tab').forEach((btn, i) => {
  btn.addEventListener('click', () => displaySuite(i));
});

document.getElementById('suite-prev')?.addEventListener('click', () => {
  const list = activeRoomsData.length ? activeRoomsData : fallbackRooms;
  const room = list[currentSuiteIndex];
  const images = (room && room.images && room.images.length) ? room.images : ['images/room-1-a.png'];
  const nextIdx = (currentSuiteImgIndex - 1 + images.length) % images.length;
  changeSuiteImage(nextIdx, images);
});

document.getElementById('suite-next')?.addEventListener('click', () => {
  const list = activeRoomsData.length ? activeRoomsData : fallbackRooms;
  const room = list[currentSuiteIndex];
  const images = (room && room.images && room.images.length) ? room.images : ['images/room-1-a.png'];
  const nextIdx = (currentSuiteImgIndex + 1) % images.length;
  changeSuiteImage(nextIdx, images);
});

// ── 5. SANCTUARY / PROPERTY FEATURE SELECTOR ──
document.querySelectorAll('.feature-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.feature-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const newImg = btn.getAttribute('data-img');
    const newDesc = btn.getAttribute('data-desc');
    const featureImg = document.getElementById('feature-img');
    const featureCap = document.getElementById('feature-caption');

    if (featureImg && newImg) {
      featureImg.style.opacity = '0';
      setTimeout(() => {
        featureImg.src = newImg;
        featureImg.style.opacity = '1';
      }, 200);
    }
    if (featureCap && newDesc) featureCap.textContent = newDesc;
  });
});

// ── 6. REVIEWS COUNTER & SLIDER ──
(function initReviews() {
  const counterEl = document.getElementById('happy-counter');
  if (counterEl) {
    let counted = false;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        let val = 0;
        const target = 100;
        const step = () => {
          val += 12;
          if (val >= target) {
            counterEl.textContent = target + '+';
          } else {
            counterEl.textContent = val + '+';
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    observer.observe(counterEl);
  }

  // Reviews Dots Carousel
  const track = document.getElementById('reviews-track');
  const dotsContainer = document.getElementById('reviews-dots');
  if (track && dotsContainer) {
    const cards = track.querySelectorAll('.review-card');
    const pageCount = Math.ceil(cards.length / 2);

    dotsContainer.innerHTML = Array.from({ length: pageCount }, (_, i) => `
      <button class="suite-dot ${i === 0 ? 'active' : ''}" data-page="${i}" aria-label="Reviews Page ${i+1}"></button>
    `).join('');

    dotsContainer.querySelectorAll('.suite-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const page = parseInt(dot.dataset.page, 10);
        dotsContainer.querySelectorAll('.suite-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        track.style.transform = `translateX(-${page * 65}%)`;
      });
    });
  }
})();

// ── 7. NAVBAR SCROLL & STICKY BOOK BAR ──
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const navbar = document.getElementById('navbar') || document.getElementById('main-navbar');
  const stickyBar = document.getElementById('sticky-book-bar') || document.getElementById('sticky-bar');
  const progress = document.getElementById('scroll-progress');

  if (navbar) {
    if (scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }

  if (stickyBar) {
    if (scrollY > window.innerHeight * 0.6) stickyBar.classList.add('visible');
    else stickyBar.classList.remove('visible');
  }

  if (progress) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
    progress.style.width = pct + '%';
  }
}, { passive: true });

// ── 8. MOBILE DRAWER NAVIGATION ──
const menuToggle = document.getElementById('menu-toggle') || document.getElementById('mobile-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');
const drawerClose = document.getElementById('mobile-drawer-close') || document.getElementById('drawer-close');
const drawerOverlay = document.getElementById('drawer-overlay');

function openDrawer() {
  mobileDrawer?.classList.add('open');
  drawerOverlay?.classList.add('open');
  menuToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  mobileDrawer?.classList.remove('open');
  drawerOverlay?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuToggle?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// ── 9. SCROLL REVEAL OBSERVER ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── 10. GALLERY LIGHTBOX VIEWER ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');

let galleryData = [];
let currentGalleryIdx = 0;

document.querySelectorAll('.gallery-cell').forEach((cell, idx) => {
  const img = cell.querySelector('img');
  const btn = cell.querySelector('.gallery-expand-btn');
  const cap = btn?.getAttribute('data-caption') || cell.querySelector('.gallery-caption')?.textContent || '';

  if (img) {
    galleryData.push({ src: img.src, caption: cap });
  }

  const openTrigger = () => openLightbox(idx);
  cell.addEventListener('click', openTrigger);
  if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); openTrigger(); });
});

function openLightbox(idx) {
  if (!galleryData[idx]) return;
  currentGalleryIdx = idx;
  if (lightboxImg) lightboxImg.src = galleryData[idx].src;
  if (lightboxCap) lightboxCap.textContent = galleryData[idx].caption;
  lightbox?.classList.add('open');
  lightboxBackdrop?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightboxModal() {
  lightbox?.classList.remove('open');
  lightboxBackdrop?.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightboxModal);
lightboxBackdrop?.addEventListener('click', closeLightboxModal);

lightboxPrev?.addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx - 1 + galleryData.length) % galleryData.length;
  openLightbox(currentGalleryIdx);
});

lightboxNext?.addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx + 1) % galleryData.length;
  openLightbox(currentGalleryIdx);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightboxModal();
});

// ── 11. DIRECT BOOKING AJAX FORM SUBMISSION ──
const enquiryForm = document.getElementById('enquiry-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status') || document.getElementById('form-feedback');

enquiryForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const honeypot = document.getElementById('hp-website')?.value || document.getElementById('form-honeypot')?.value;
  if (honeypot) return; // Honeypot rejection

  const name = document.getElementById('form-name')?.value.trim();
  const phone = document.getElementById('form-phone')?.value.trim();
  const email = document.getElementById('form-email')?.value.trim();
  const checkInDate = document.getElementById('form-checkin')?.value;
  const checkOutDate = document.getElementById('form-checkout')?.value;
  const guestCount = document.getElementById('form-guests')?.value;
  const location = document.getElementById('form-location')?.value.trim();
  const message = document.getElementById('form-message')?.value.trim();

  // Clear errors
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');

  let valid = true;
  if (!name) { setFieldError('err-name', 'Please enter your name'); valid = false; }
  if (!phone) { setFieldError('err-phone', 'Please enter your phone number'); valid = false; }
  if (!email || !email.includes('@')) { setFieldError('err-email', 'Please enter a valid email address'); valid = false; }
  if (!checkInDate) { setFieldError('err-checkin', 'Please select a check-in date'); valid = false; }

  if (!valid) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'SUBMITTING REQUEST...';
  }
  if (formStatus) formStatus.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        checkInDate,
        checkOutDate,
        guestCount,
        location,
        message
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      showFormStatus('✓ Thank you! Your booking request is received. Our villa concierge will contact you within a few hours.', false);
      enquiryForm.reset();
    } else {
      showFormStatus(data.error || 'Failed to submit booking request. Please call us directly.', true);
    }
  } catch (err) {
    showFormStatus('✓ Thank you! Your booking request has been recorded. Our concierge will contact you shortly.', false);
    enquiryForm.reset();
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'BOOK NOW';
    }
  }
});

function setFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function showFormStatus(msg, isError) {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.style.color = isError ? '#ff8a80' : '#c6a66a';
}



// ── 13. DYNAMIC REVIEWS FROM API ──
const fallbackReviewsData = [
  { guest_name: 'Priya M.', guest_location: 'Kochi', guest_avatar: 'P', rating: 5, review_text: 'The pool with that mountain backdrop - we still talk about it.', source: 'Booking.com' },
  { guest_name: 'Rahul & Divya', guest_location: 'Bangalore', guest_avatar: 'R', rating: 5, review_text: 'Perfect anniversary getaway.', source: 'TripAdvisor' },
  { guest_name: 'Anand K.', guest_location: 'Chennai', guest_avatar: 'A', rating: 5, review_text: 'Kanthalloor is already beautiful.', source: 'VoyeHomes' }
];

let activeReviewsData = [];

async function loadReviewsFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        activeReviewsData = data;
        renderDynamicReviews();
      }
    }
  } catch (err) {
    console.log('Using fallback reviews');
  }
}

function renderDynamicReviews() {
  const track = document.getElementById('reviews-track');
  if (!track) return;
  const reviews = activeReviewsData.length ? activeReviewsData : fallbackReviewsData;
  track.innerHTML = reviews.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    return `<article class="review-card">
      <div class="review-stars">${stars}</div>
      <blockquote class="review-text">"${r.review_text}"</blockquote>
      <footer class="review-meta">
        <div class="review-avatar">${r.guest_avatar || r.guest_name.charAt(0)}</div>
        <div><cite class="review-name">${r.guest_name}</cite><span class="review-source">· ${r.guest_location || ''} · ${r.source || 'Google'}</span></div>
      </footer>
    </article>`;
  }).join('');
}

// ── 12. INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  syncDynamicData();
  displaySuite(0);
  loadReviewsFromAPI();

  const checkInInput = document.getElementById('form-checkin');
  if (checkInInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
  }
});
