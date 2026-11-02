/**
 * LUXURY ENGAGEMENT INVITATION — CINEMATIC GSAP SCRIPT
 * Ibrahim & Alaa Engagement Invitation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // CONFIGURATION & STATE
  // ==========================================
  const CONFIG = {
    startFrame: 1,
    endFrame: 121,
    framePath: (index) => `new_frames/frame_${String(index).padStart(4, '0')}.jpg`,
    fps: 24,
    totalFrames: 121, // 1 to 121
    eventDate: new Date('2026-11-11T19:00:00+02:00'),
    whatsappPhone: '201055602438', // Host WhatsApp number
    groomName: 'اسم العريس',
    brideName: 'اسم العروسة',
  };

  const state = {
    isStarted: false,
    imagesLoaded: 0,
    frames: [],
    currentFrameIndex: 0,
    isPlayingAudio: false,
  };

  // DOM Elements
  const introScreen = document.getElementById('intro-screen');
  const introLoader = document.getElementById('intro-loader');
  const introAction = document.getElementById('intro-action');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  const loaderStatus = document.getElementById('loader-status');
  const openBtn = document.getElementById('open-invitation-btn');
  const introCanvas = document.getElementById('intro-canvas');
  const particlesCanvas = document.getElementById('particles-canvas');
  const cinematicFlash = document.getElementById('cinematic-flash');
  const mainInvitation = document.getElementById('main-invitation');
  const petalsCanvas = document.getElementById('petals-canvas');
  const bgAudio = document.getElementById('bg-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');

  const introCtx = introCanvas.getContext('2d');
  const particlesCtx = particlesCanvas.getContext('2d');
  const petalsCtx = petalsCanvas.getContext('2d');

  // ==========================================
  // 1. PARTICLES BACKGROUND (INTRO SCREEN)
  // ==========================================
  let particlesAnimationId;
  const particles = [];
  const PARTICLE_COUNT = 55;

  function initParticles() {
    resizeCanvas(particlesCanvas);
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * particlesCanvas.width,
        y: Math.random() * particlesCanvas.height,
        radius: Math.random() * 2 + 0.8,
        speedY: -Math.random() * 0.4 - 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.3 ? '#dfb15b' : '#fff3c4',
      });
    }
  }

  function renderParticles() {
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    for (let p of particles) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

      if (p.y < 0) p.y = particlesCanvas.height;
      if (p.x < 0) p.x = particlesCanvas.width;
      if (p.x > particlesCanvas.width) p.x = 0;

      particlesCtx.beginPath();
      particlesCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      particlesCtx.fillStyle = p.color;
      particlesCtx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));
      particlesCtx.shadowBlur = 8;
      particlesCtx.shadowColor = '#dfb15b';
      particlesCtx.fill();
    }
    particlesCtx.globalAlpha = 1;
    particlesAnimationId = requestAnimationFrame(renderParticles);
  }

  // ==========================================
  // 2. CANVAS SIZING & FRAME DRAWING
  // ==========================================
  function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = (rect.width || window.innerWidth) * dpr;
    canvas.height = (rect.height || window.innerHeight) * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }

  function resizeAllCanvases() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    [introCanvas, particlesCanvas, petalsCanvas].forEach((c) => {
      if (c) {
        c.width = w * dpr;
        c.height = h * dpr;
        c.style.width = `${w}px`;
        c.style.height = `${h}px`;
      }
    });

    renderCurrentFrame();
  }

  window.addEventListener('resize', resizeAllCanvases);

  function renderCurrentFrame() {
    if (!state.frames[state.currentFrameIndex]) return;
    const img = state.frames[state.currentFrameIndex];
    if (!img.complete || img.naturalWidth === 0) return;

    const canvasW = introCanvas.width;
    const canvasH = introCanvas.height;
    introCtx.clearRect(0, 0, canvasW, canvasH);

    // Frame aspect ratio preservation
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;
    const canvasAspect = canvasW / canvasH;

    let drawW, drawH, drawX, drawY;
    const nudgeLeft = 5 * (window.devicePixelRatio || 1);

    // Responsive scaling: make envelope take at least 3/4 (75% to 85%) of the screen!
    if (window.innerWidth < 768 || canvasH > canvasW) {
      // Mobile portrait: scale envelope width to fill ~94% of screen width (and ~75% of upper viewport)
      const targetEnvelopeWidth = canvasW * 0.94;
      const scale = targetEnvelopeWidth / 514;

      drawW = imgW * scale;
      drawH = imgH * scale;
      drawX = (canvasW - drawW) / 2 - nudgeLeft;

      // Position the top of the envelope comfortably below status bar
      const topPadding = Math.max(16 * (window.devicePixelRatio || 1), canvasH * 0.035);
      drawY = topPadding - (100 * scale);
    } else {
      // Desktop / Landscape / Tablet: frame/envelope takes at least 3/4 (75%+) of screen width/height
      const scaleByH = (canvasH * 0.88) / 750;
      const scaleByW = (canvasW * 0.75) / 960;
      // Cap at 94% of screen height so top and bottom never get clipped
      const maxAllowedScale = (canvasH * 0.94) / 750;
      const scale = Math.min(Math.max(scaleByH, scaleByW), maxAllowedScale);

      drawW = imgW * scale;
      drawH = imgH * scale;
      drawX = (canvasW - drawW) / 2 - nudgeLeft;

      // Center the visible envelope (y: 100 to 850 in frame) vertically on the screen
      const envelopeTopInFrame = 100 * scale;
      const envelopeHeight = 750 * scale;
      drawY = (canvasH - envelopeHeight) / 2 - envelopeTopInFrame;
    }

    // Soft subtle radial vignette glow behind envelope
    const radialGlow = introCtx.createRadialGradient(
      drawX + drawW / 2,
      drawY + drawH / 2,
      drawW * 0.1,
      drawX + drawW / 2,
      drawY + drawH / 2,
      drawW * 0.65
    );
    radialGlow.addColorStop(0, 'rgba(84, 13, 30, 0.45)');
    radialGlow.addColorStop(0.7, 'rgba(37, 6, 13, 0.2)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    introCtx.fillStyle = radialGlow;
    introCtx.fillRect(0, 0, canvasW, canvasH);

    // Draw frame
    introCtx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // ==========================================
  // 3. FRAME PRELOADING
  // ==========================================
  function preloadFrames() {
    const total = CONFIG.totalFrames;
    let loadedCount = 0;

    for (let i = 0; i < total; i++) {
      const frameNum = CONFIG.startFrame + i;
      const img = new Image();
      img.src = CONFIG.framePath(frameNum);

      img.onload = () => {
        loadedCount++;
        state.imagesLoaded = loadedCount;
        const percent = Math.min(100, Math.round((loadedCount / total) * 100));
        
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressPercent) progressPercent.innerText = `${percent}%`;

        // Render the very first frame as soon as it's ready
        if (i === 0) {
          renderCurrentFrame();
        }

        if (loadedCount === total) {
          onAllFramesLoaded();
        }
      };

      img.onerror = () => {
        // Fallback for missing frames so progress doesn't stall
        loadedCount++;
        if (loadedCount === total) {
          onAllFramesLoaded();
        }
      };

      state.frames.push(img);
    }
  }

  function onAllFramesLoaded() {
    if (loaderStatus) loaderStatus.innerText = 'الدعوة جاهزة لاستقبالكم ✨';

    // Fade out loader and reveal luxury button with GSAP
    gsap.to(introLoader, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        introLoader.classList.add('hidden');
        introAction.classList.remove('hidden');
        gsap.fromTo(
          introAction,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' }
        );
      },
    });
  }

  // ==========================================
  // 4. USER INTERACTION & AUDIO
  // ==========================================
  openBtn.addEventListener('click', startCinematicExperience);

  function startCinematicExperience() {
    if (state.isStarted) return;
    state.isStarted = true;
    openBtn.disabled = true;

    // Start background audio on user interaction
    playAudio();

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      executeInstantTransition();
      return;
    }

    // Run Coordinated GSAP Timeline
    executeCinematicTimeline();
  }

  function playAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.isPlayingAudio = true;
          // Smooth audio volume fade in
          gsap.to(bgAudio, { volume: 0.75, duration: 2.0 });
          audioToggleBtn.classList.remove('hidden', 'muted');
        })
        .catch((err) => {
          console.warn('Audio autoplay blocked or unsupported:', err);
          state.isPlayingAudio = false;
        });
    }
  }

  // Audio Toggle Button
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (!bgAudio) return;
      if (bgAudio.paused) {
        bgAudio.play();
        audioToggleBtn.classList.remove('muted');
        state.isPlayingAudio = true;
      } else {
        bgAudio.pause();
        audioToggleBtn.classList.add('muted');
        state.isPlayingAudio = false;
      }
    });
  }

  // ==========================================
  // 5. GSAP CINEMATIC TIMELINE COORDINATION
  // ==========================================
  function executeCinematicTimeline() {
    const tl = gsap.timeline();

    // Step 1: Smoothly fade out the button and intro UI overlay
    tl.to(introAction, {
      opacity: 0,
      scale: 0.9,
      y: 15,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => {
        introAction.classList.add('hidden');
      },
    });

    // Step 2: Scrub frame sequence smoothly at 24 FPS (121 frames -> 5.04 seconds)
    const seq = { frame: 0 };
    tl.to(seq, {
      frame: CONFIG.totalFrames - 1,
      duration: 5.04,
      ease: 'power1.inOut',
      onUpdate: () => {
        const nextIndex = Math.round(seq.frame);
        if (nextIndex !== state.currentFrameIndex) {
          state.currentFrameIndex = nextIndex;
          renderCurrentFrame();
        }
      },
    }, '-=0.1');

    // Step 3: Golden-white flash begins as envelope blooms (~at frame 95 / 3.4s)
    tl.to(cinematicFlash, {
      opacity: 1,
      duration: 0.85,
      ease: 'power2.in',
    }, '-=0.85');

    // Step 4: Climax transition at flash peak: Hide intro screen, reveal main invitation
    tl.call(() => {
      cancelAnimationFrame(particlesAnimationId);
      introScreen.classList.add('fade-out');
      mainInvitation.classList.add('visible');
      initPetals();
      renderPetals();
    });

    // Step 5: Golden flash gently dissolves to reveal invitation
    tl.to(cinematicFlash, {
      opacity: 0,
      duration: 1.25,
      ease: 'power2.out',
      onComplete: () => {
        introScreen.style.display = 'none';
      },
    });

    // Step 6: Coordinated elegant entrance of invitation hero elements
    tl.from('.monogram-badge', {
      scale: 0.4,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }, '-=0.8')
    .from('.hero-sub-title, .basmalah-text', {
      y: -20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.7,
      ease: 'power2.out',
    }, '-=0.6')
    .from('.names-wrapper', {
      scale: 0.85,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
    }, '-=0.5')
    .from('.invitation-verse', {
      y: 15,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    }, '-=0.5')
    .from('.date-time-badges .info-pill', {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4')
    .from('.scroll-indicator', {
      opacity: 0,
      y: 10,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.2');
  }

  function executeInstantTransition() {
    cancelAnimationFrame(particlesAnimationId);
    introScreen.style.display = 'none';
    mainInvitation.classList.add('visible');
    initPetals();
    renderPetals();
  }

  // ==========================================
  // 6. FALLING PETALS CANVAS (HERO SCENE)
  // ==========================================
  let petalsAnimationId;
  const petals = [];
  const PETAL_COUNT = 24;

  function initPetals() {
    resizeCanvas(petalsCanvas);
    petals.length = 0;
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * petalsCanvas.width,
        y: Math.random() * -petalsCanvas.height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 1.2 + 0.8,
        speedX: Math.sin(Math.random() * Math.PI) * 1.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: Math.random() > 0.4 ? '#8b1c38' : '#580c1d',
        opacity: Math.random() * 0.6 + 0.4,
      });
    }
  }

  function renderPetals() {
    petalsCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);
    for (let p of petals) {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.005) * 0.8;
      p.rotation += p.rotSpeed;

      if (p.y > petalsCanvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * petalsCanvas.width;
      }

      petalsCtx.save();
      petalsCtx.translate(p.x, p.y);
      petalsCtx.rotate(p.rotation);
      petalsCtx.beginPath();
      petalsCtx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      petalsCtx.fillStyle = p.color;
      petalsCtx.globalAlpha = p.opacity;
      petalsCtx.shadowBlur = 6;
      petalsCtx.shadowColor = 'rgba(20, 2, 5, 0.4)';
      petalsCtx.fill();
      petalsCtx.restore();
    }
    petalsAnimationId = requestAnimationFrame(renderPetals);
  }

  // ==========================================
  // 7. COUNTDOWN TIMER
  // ==========================================
  function updateCountdown() {
    const now = new Date();
    const diff = CONFIG.eventDate - now;

    if (diff <= 0) {
      document.getElementById('days-count').innerText = '00';
      document.getElementById('hours-count').innerText = '00';
      document.getElementById('minutes-count').innerText = '00';
      document.getElementById('seconds-count').innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days-count').innerText = String(days).padStart(2, '0');
    document.getElementById('hours-count').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes-count').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds-count').innerText = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================
  // 8. ADD TO CALENDAR (.ICS FILE)
  // ==========================================
  const calendarBtn = document.getElementById('add-to-calendar-btn');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      const title = 'حفل خطوبة اسم العريس & اسم العروسة';
      const description = 'يتشرف العروسان بدعوتكم لحضور حفل خطوبتهم المباركة';
      const location = 'قاعة كريستال، الرأس السوداء، الإسكندرية';
      const start = '20261111T190000';
      const end = '20261111T233000';

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Engagement Invitation//AR',
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'seif-habiba-engagement.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ==========================================
  // 9. RSVP FORM & WHATSAPP INTEGRATION
  // ==========================================
  const rsvpForm = document.getElementById('rsvp-form');
  const radioCards = document.querySelectorAll('.radio-card');
  const guestsCountGroup = document.getElementById('guests-count-group');

  radioCards.forEach((card) => {
    card.addEventListener('click', () => {
      radioCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      const input = card.querySelector('input');
      input.checked = true;

      if (input.value === 'declined') {
        guestsCountGroup.style.display = 'none';
      } else {
        guestsCountGroup.style.display = 'flex';
      }
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guest-name').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked').value;
      const guests = attendance === 'attending' ? document.getElementById('guests-count').value : '0';
      const message = document.getElementById('guest-message').value.trim();

      const attendanceText = attendance === 'attending' ? '✅ بكل سرور سأحضر الحفل' : '🤍 أعتذر عن الحضور لظروف خاصة';
      let waText = `*تأكيد حضور حفل خطوبة اسم العريس واسم العروسة 💍✨*\n\n`;
      waText += `*الاسم:* ${name}\n`;
      waText += `*حالة الحضور:* ${attendanceText}\n`;
      if (attendance === 'attending') {
        waText += `*عدد المرافقين:* ${guests}\n`;
      }
      if (message) {
        waText += `*رسالة التهنئة:* ${message}\n`;
      }
      waText += `\nمع خالص الحب والتقدير 🌹`;

      // Trigger Confetti Celebration
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#dfb15b', '#ffffff', '#8e1c38', '#f3e3a9'],
        });
      }

      // Add to live Wishes Wall in real-time
      if (message) {
        addWish(name, message);
      }

      // WhatsApp URL: official wa.me universal deep link
      const phone = '201055602438';
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;

      // Update the direct link button
      const directLink = document.getElementById('rsvp-whatsapp-direct-link');
      if (directLink) {
        directLink.href = waUrl;
      }

      // Show Success Message Block
      document.getElementById('rsvp-success').classList.remove('hidden');

      // Immediate direct redirect so mobile Safari & Chrome never block it
      window.location.href = waUrl;
    });
  }

  // ==========================================
  // 10. SHARE INVITATION LINK
  // ==========================================
  const shareBtn = document.getElementById('share-invitation-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'دعوة خطوبة | اسم العريس & اسم العروسة',
          text: 'يسعدنا ويشرفنا دعوتكم لحضور حفل خطوبتنا المباركة 💍✨',
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('تم نسخ رابط الدعوة بنجاح!');
        });
      }
    });
  }

  // ==========================================
  // 11. SCROLL REVEAL ANIMATIONS (SMOOTH GLIDE IN / OUT)
  // ==========================================
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          // If user scrolls past or back up, smoothly re-arm the reveal
          if (entry.boundingClientRect.top > 0) {
            entry.target.classList.remove('revealed');
          }
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  }

  // ==========================================
  // 12. LIVE REAL-TIME WISHES & BLESSINGS
  // ==========================================
  const WISHES_STORAGE_KEY = 'wedding_wishes_seif_habiba';
  const wishesContainer = document.getElementById('wishes-container');
  const wishesCountEl = document.getElementById('live-wishes-count');
  const directWishForm = document.getElementById('direct-wish-form');
  const syncChannel = window.BroadcastChannel ? new BroadcastChannel('wedding_wishes_sync') : null;

  const defaultWishes = [
    {
      id: 'default-1',
      author: 'عائلة العريس والعروس',
      text: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير وسعادة دائمة يا أحلى عرسان في الدنيا! 💍❤️',
      timestamp: Date.now() - 1000 * 60 * 3
    },
    {
      id: 'default-2',
      author: 'الأصدقاء والأحباب',
      text: 'ألف ألف مبروك للعروسين، جعل الله كل أيامكم فرح وهنا ومحبة لا تنتهي. 🌹✨',
      timestamp: Date.now() - 1000 * 60 * 18
    },
    {
      id: 'default-4',
      author: 'شلة الصحاب الجدعان',
      text: 'مبروك لأحلى عريس وأحلى عروسة، جاهزين نولع الفرح ونفرح بيكم للصبح! 🔥💃',
      timestamp: Date.now() - 1000 * 60 * 60
    }
  ];

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem(WISHES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any previous default-3 entry
          return parsed.filter(w => w.id !== 'default-3' && w.author !== 'م. كريم والأسرة');
        }
      }
    } catch (e) {}
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {}
  }

  function formatRelativeArabicTime(timestamp) {
    const now = Date.now();
    const diffSec = Math.floor((now - timestamp) / 1000);
    if (diffSec < 45) return 'الآن ✨';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin === 1) return 'منذ دقيقة';
    if (diffMin === 2) return 'منذ دقيقتين';
    if (diffMin < 11) return `منذ ${diffMin} دقائق`;
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours === 1) return 'منذ ساعة';
    if (diffHours === 2) return 'منذ ساعتين';
    if (diffHours < 11) return `منذ ${diffHours} ساعات`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return 'اليوم';
  }

  function renderWishes(wishesList) {
    if (!wishesContainer) return;
    wishesContainer.innerHTML = '';
    wishesList.forEach((wish) => {
      const wishDiv = document.createElement('div');
      wishDiv.className = 'wish-item';
      wishDiv.setAttribute('data-timestamp', wish.timestamp);
      wishDiv.innerHTML = `
        <div class="wish-author">${wish.author}</div>
        <p class="wish-text">${wish.text}</p>
        <span class="wish-time">${formatRelativeArabicTime(wish.timestamp)}</span>
      `;
      wishesContainer.appendChild(wishDiv);
    });
    if (wishesCountEl) {
      wishesCountEl.textContent = `دفتر التهاني مباشر الآن • ${wishesList.length} تهنئة ✨`;
    }
  }

  function updateAllTimestamps() {
    if (!wishesContainer) return;
    const items = wishesContainer.querySelectorAll('.wish-item');
    items.forEach((item) => {
      const ts = parseInt(item.getAttribute('data-timestamp'), 10);
      if (ts) {
        const timeEl = item.querySelector('.wish-time');
        if (timeEl) timeEl.textContent = formatRelativeArabicTime(ts);
      }
    });
  }

  function addWish(author, text) {
    const newWish = {
      id: 'wish-' + Date.now(),
      author: author.trim(),
      text: text.trim(),
      timestamp: Date.now()
    };
    const current = getStoredWishes();
    current.unshift(newWish);
    saveWishes(current);
    renderWishes(current);

    const firstItem = wishesContainer.querySelector('.wish-item');
    if (firstItem) firstItem.classList.add('just-added');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.7 },
        colors: ['#dfb15b', '#ffffff', '#8e1c38', '#f3e3a9']
      });
    }

    if (syncChannel) syncChannel.postMessage({ type: 'NEW_WISH', wish: newWish });
  }

  // Direct Wish Form Submission
  if (directWishForm) {
    directWishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('direct-wish-name');
      const textInput = document.getElementById('direct-wish-text');
      if (nameInput.value.trim() && textInput.value.trim()) {
        addWish(nameInput.value, textInput.value);
        textInput.value = '';
      }
    });
  }

  // Cross-Tab Real-time Sync
  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_WISH') {
        renderWishes(getStoredWishes());
      }
    };
  }
  window.addEventListener('storage', (e) => {
    if (e.key === WISHES_STORAGE_KEY) {
      renderWishes(getStoredWishes());
    }
  });

  // Initial Render & Timer for Dynamic Timestamps
  renderWishes(getStoredWishes());
  setInterval(updateAllTimestamps, 20000);

  // ==========================================
  // INITIALIZE EXPERIENCE
  // ==========================================
  resizeAllCanvases();
  initParticles();
  renderParticles();
  preloadFrames();
  initScrollReveals();
});
