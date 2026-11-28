/* ==========================================================
   AAGAM LODARIA - PORTFOLIO WEBSITE
   Hyperspace Transitions, Neural Canvas, Audio Synth, 3D Tilt,
   Cyber Terminal CLI & Multi-Theme Engine
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let countersAnimated = false;
  const statNumbers = document.querySelectorAll('.hero-stat-number');

  // ==========================================
  // 1. NATIVE WEB AUDIO API SYNTHESIZER
  // (Zero external audio files needed!)
  // ==========================================
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playHoverBlip() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  function playClickLaser() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } catch (e) {}
  }

  function playWarpWhoosh() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    } catch (e) {}
  }

  function playTerminalBeep() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
  }

  function toggleSound() {
    initAudio();
    soundEnabled = !soundEnabled;
    updateSoundUI();
    if (soundEnabled) {
      playClickLaser();
    }
  }

  // ==========================================
  // 15. DYNAMIC INTERACTIVE SKILLS (TAB SWITCHING, SEARCH & MODAL)
  // ==========================================
  const skillFilterBar = document.getElementById('skillFilterBar');
  const skillCategories = document.querySelectorAll('.skill-category');
  const skillSearchInput = document.getElementById('skillSearchInput');
  const skillSearchClear = document.getElementById('skillSearchClear');
  const skillsNoResults = document.getElementById('skillsNoResults');
  const resetSkillSearchBtn = document.getElementById('resetSkillSearchBtn');

  let activeCategory = 'languages';

  function showSkillCategory(catName) {
    activeCategory = catName;

    // Update buttons
    if (skillFilterBar) {
      const filterBtns = skillFilterBar.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        const matches = btn.getAttribute('data-category') === catName;
        btn.classList.toggle('active', matches);
      });
    }

    // Toggle categories so only the active one is shown
    skillCategories.forEach(card => {
      const category = card.getAttribute('data-category');
      if (category === catName) {
        card.style.display = 'flex';
        card.classList.add('revealed');
        card.style.animation = 'fade-in-up 0.35s ease forwards';
        const items = card.querySelectorAll('.skill-interactive-item');
        items.forEach(it => it.style.display = 'block');
      } else {
        card.style.display = 'none';
      }
    });

    if (skillsNoResults) skillsNoResults.style.display = 'none';
  }

  function applySkillSearch() {
    const query = skillSearchInput ? skillSearchInput.value.trim().toLowerCase() : '';
    let totalVisible = 0;

    if (!query) {
      showSkillCategory(activeCategory);
      return;
    }

    skillCategories.forEach(card => {
      const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const items = card.querySelectorAll('.skill-interactive-item');
      let cardHasMatch = false;

      items.forEach(it => {
        const name = ((it.getAttribute('data-name') || '') + ' ' + it.querySelector('.skill-item-name').textContent).toLowerCase();
        const desc = (it.querySelector('.skill-item-desc') ? it.querySelector('.skill-item-desc').textContent : '').toLowerCase();
        if (name.includes(query) || desc.includes(query) || cardTitle.includes(query)) {
          it.style.display = 'block';
          cardHasMatch = true;
          totalVisible++;
        } else {
          it.style.display = 'none';
        }
      });

      if (cardHasMatch) {
        card.style.display = 'flex';
        card.classList.add('revealed');
      } else {
        card.style.display = 'none';
      }
    });

    if (skillsNoResults) {
      skillsNoResults.style.display = totalVisible === 0 ? 'block' : 'none';
    }
  }

  // Filter Buttons Click (Tab switching)
  if (skillFilterBar) {
    const filterBtns = skillFilterBar.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playClickLaser();
        const cat = btn.getAttribute('data-category');
        if (skillSearchInput && skillSearchInput.value) {
          skillSearchInput.value = '';
          if (skillSearchClear) skillSearchClear.style.display = 'none';
        }
        if (cat) {
          showSkillCategory(cat);
        }
      });
    });
  }

  // Search Input Handler
  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', () => {
      if (skillSearchClear) {
        skillSearchClear.style.display = skillSearchInput.value ? 'flex' : 'none';
      }
      applySkillSearch();
    });

    if (skillSearchClear) {
      skillSearchClear.addEventListener('click', () => {
        playClickLaser();
        skillSearchInput.value = '';
        skillSearchClear.style.display = 'none';
        showSkillCategory(activeCategory);
        skillSearchInput.focus();
      });
    }

    if (resetSkillSearchBtn) {
      resetSkillSearchBtn.addEventListener('click', () => {
        playClickLaser();
        skillSearchInput.value = '';
        if (skillSearchClear) skillSearchClear.style.display = 'none';
        showSkillCategory('languages');
      });
    }
  }

  const introSoundToggle = document.getElementById('introSoundToggle');
  const introSoundText = document.getElementById('introSoundText');
  const navSoundBtn = document.getElementById('navSoundBtn');
  const dockSoundBtn = document.getElementById('dockSoundBtn');

  function updateSoundUI() {
    const text = soundEnabled ? 'SFX: ON' : 'SFX: OFF';
    if (introSoundText) introSoundText.textContent = text;
    if (introSoundToggle) introSoundToggle.classList.toggle('active', soundEnabled);
    if (navSoundBtn) navSoundBtn.classList.toggle('active', soundEnabled);
    if (dockSoundBtn) {
      dockSoundBtn.classList.toggle('active', soundEnabled);
      dockSoundBtn.querySelector('.dock-icon').textContent = soundEnabled ? '🔊' : '🔇';
    }
  }

  if (introSoundToggle) introSoundToggle.addEventListener('click', toggleSound);
  if (navSoundBtn) navSoundBtn.addEventListener('click', toggleSound);
  if (dockSoundBtn) dockSoundBtn.addEventListener('click', toggleSound);


  // ==========================================
  // 2. INTERACTIVE BACKGROUND NEURAL CANVAS
  // ==========================================
  const neuroCanvas = document.getElementById('neuroCanvas');
  const ctx = neuroCanvas ? neuroCanvas.getContext('2d') : null;
  let width = neuroCanvas ? (neuroCanvas.width = window.innerWidth) : window.innerWidth;
  let height = neuroCanvas ? (neuroCanvas.height = window.innerHeight) : window.innerHeight;

  let mouse = { x: width / 2, y: height / 2, moved: false };
  let warpSpeed = false;
  let particles = [];
  const PARTICLE_COUNT = Math.min(42, Math.floor((width * height) / 26000));

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    if (neuroCanvas) {
      neuroCanvas.width = width;
      neuroCanvas.height = height;
    }
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.6 + 0.2;
    }
    update() {
      if (warpSpeed) {
        // Hyperspace radial streak
        const dx = this.x - width / 2;
        const dy = this.y - height / 2;
        this.x += dx * 0.08;
        this.y += dy * 0.08;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.x = width / 2 + (Math.random() - 0.5) * 80;
          this.y = height / 2 + (Math.random() - 0.5) * 80;
        }
      } else {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on borders
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Repel from cursor
        if (mouse.moved) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0 && dist < 120) {
            const force = (120 - dist) / 120;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }
      }
    }
    draw() {
      if (!ctx) return;
      ctx.beginPath();
      if (warpSpeed) {
        // Draw star trail
        const dx = (this.x - width / 2) * 0.15;
        const dy = (this.y - height / 2) * 0.15;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - dx, this.y - dy);
        ctx.strokeStyle = `rgba(139, 92, 246, ${this.alpha * 1.5})`;
        ctx.lineWidth = this.radius * 1.2;
        ctx.stroke();
      } else {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${this.alpha})`;
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function renderNeuro() {
    if (!ctx) return;
    if (document.hidden) { requestAnimationFrame(renderNeuro); return; }
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    if (!warpSpeed) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(renderNeuro);
  }
  if (neuroCanvas && ctx && !matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) renderNeuro();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = true;
  });


  // ==========================================
  // 3. DYNAMIC FLUID MAGNETIC CURSOR
  // ==========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let curX = -100, curY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    curX = e.clientX;
    curY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${curX}px`;
      cursorDot.style.top = `${curY}px`;
    }
  });

  function renderCursorRing() {
    ringX += (curX - ringX) * 0.16;
    ringY += (curY - ringY) * 0.16;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursorRing);
  }
  if (matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) renderCursorRing();

  // Hover detection for magnetic cursor
  const interactiveElements = document.querySelectorAll(
    'a, button, .project-card, .skill-tag, .orbit-badge, .nav-logo, .hero-photo'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.classList.add('hover-active');
      playHoverBlip();
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.classList.remove('hover-active');
    });
  });

  // Click shockwave ripple
  window.addEventListener('click', (e) => {
    playClickLaser();
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });


  // ==========================================
  // 4. HYPERSPACE CYBER-GATE INTRO SEQUENCER
  // ==========================================
  const introScreen = document.getElementById('introScreen');
  const introTextWrapper = document.getElementById('introTextWrapper');
  const introLetters = document.querySelectorAll('.intro-letter');
  const introLineTop = document.getElementById('introLineTop');
  const introLineBottom = document.getElementById('introLineBottom');
  const introSubtitle = document.getElementById('introSubtitle');
  const introLoaderFill = document.getElementById('introLoaderFill');
  const introPhotoWrapper = document.getElementById('introPhotoWrapper');
  const introPhoto = document.getElementById('introPhoto');
  const introBioTag = document.getElementById('introBioTag');
  const introPhotoName = document.getElementById('introPhotoName');
  const introPhotoRole = document.getElementById('introPhotoRole');
  const introShockwave = document.getElementById('introShockwave');
  const introSkip = document.getElementById('introSkip');
  const introFps = document.getElementById('introFps');

  const replayRequested = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Real-time FPS ticker for the cyber HUD
  let lastFrameTime = performance.now();
  let frameCount = 0;
  function updateFps() {
    frameCount++;
    const now = performance.now();
    if (now - lastFrameTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
      if (introFps) introFps.textContent = fps;
      frameCount = 0;
      lastFrameTime = now;
    }
    if (introScreen && introScreen.style.display !== 'none' && !introScreen.classList.contains('phase-exit')) {
      requestAnimationFrame(updateFps);
    }
  }
  // FPS ticker starts only during replay.

  // Scrambler text decoding effect
  function scrambleText(element, finalText, duration = 1200) {
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*!<>~';
    const startTime = performance.now();

    function update() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const settledCount = Math.floor(progress * finalText.length);

      let output = '';
      for (let i = 0; i < finalText.length; i++) {
        if (i < settledCount) {
          output += finalText[i];
        } else if (finalText[i] === ' ') {
          output += ' ';
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.textContent = output;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  let introTimeouts = [];

  function startIntroSequence() {
    // Stage 1: Reveal "PORTFOLIO" with 3D chromatic assembly
    introLetters.forEach((letter, idx) => {
      const t = setTimeout(() => {
        letter.classList.add('animate');
        playTerminalBeep();
      }, 80 + idx * 45);
      introTimeouts.push(t);
    });

    // Expand neon accent lines
    introTimeouts.push(setTimeout(() => {
      if (introLineTop) introLineTop.classList.add('visible');
      if (introLineBottom) introLineBottom.classList.add('visible');
    }, 400));

    // Scramble decode subtitle
    introTimeouts.push(setTimeout(() => {
      if (introSubtitle) {
        introSubtitle.classList.add('visible');
        scrambleText(introSubtitle, 'AAGAM LODARIA', 1000);
      }
    }, 480));

    // Fill loading meter
    introTimeouts.push(setTimeout(() => {
      if (introLoaderFill) introLoaderFill.style.width = '100%';
    }, 500));

    // Stage 2: Hyperspace zoom-through -> Photo Holo-Deck Portal
    introTimeouts.push(setTimeout(() => {
      if (introTextWrapper) introTextWrapper.classList.add('fade-out');
      warpSpeed = true; // Particles streak into hyperspace!
      playWarpWhoosh();
    }, 1050));

    introTimeouts.push(setTimeout(() => {
      if (introPhotoWrapper) introPhotoWrapper.classList.add('visible');
      if (introPhoto) introPhoto.classList.add('visible');
    }, 1300));

    introTimeouts.push(setTimeout(() => {
      if (introBioTag) introBioTag.classList.add('visible');
      if (introPhotoName) introPhotoName.classList.add('visible');
      if (introPhotoRole) introPhotoRole.classList.add('visible');
    }, 1550));

    // Stage 3: Dimensional Shockwave Breach into Main Site
    introTimeouts.push(setTimeout(() => {
      exitIntro();
    }, 2300));
  }

  function exitIntro() {
    // Clear any queued sequence steps
    introTimeouts.forEach(clearTimeout);
    introTimeouts = [];

    warpSpeed = false; // Return particles to ambient neural constellation
    if (introShockwave) introShockwave.classList.add('trigger');
    playWarpWhoosh();

    if (introScreen) {
      introScreen.classList.add('phase-exit');
      setTimeout(() => {
        introScreen.style.display = 'none';
        document.body.classList.remove('intro-active');
        animateCounters();
      }, 350);
    }
  }

  if (introSkip) introSkip.addEventListener('click', exitIntro);

  // Start sequence if on home page
  if (introScreen) {
    if (replayRequested) { document.body.classList.add('intro-active'); introScreen.style.display = 'flex'; requestAnimationFrame(updateFps); startIntroSequence(); } else { animateCounters(); }
  } else {
    animateCounters();
  }

  // Replay Intro Button in Dock
  const dockReplayBtn = document.getElementById('dockReplayBtn');
  if (dockReplayBtn) {
    dockReplayBtn.addEventListener('click', () => {
      if (!introScreen) {
        window.location.href = 'index.html?replay=1';
        return;
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.body.classList.add('intro-active');

      introScreen.style.display = 'flex';
      introScreen.classList.remove('phase-exit');
      if (introShockwave) introShockwave.classList.remove('trigger');

      if (introTextWrapper) introTextWrapper.classList.remove('fade-out');
      introLetters.forEach(l => l.classList.remove('animate'));
      if (introLineTop) introLineTop.classList.remove('visible');
      if (introLineBottom) introLineBottom.classList.remove('visible');
      if (introSubtitle) introSubtitle.classList.remove('visible');
      if (introLoaderFill) introLoaderFill.style.width = '0%';
      if (introPhotoWrapper) introPhotoWrapper.classList.remove('visible');
      if (introPhoto) introPhoto.classList.remove('visible');
      if (introBioTag) introBioTag.classList.remove('visible');
      if (introPhotoName) introPhotoName.classList.remove('visible');
      if (introPhotoRole) introPhotoRole.classList.remove('visible');

      requestAnimationFrame(updateFps);
      startIntroSequence();
    });
  }


  // ==========================================
  // 5. HERO TYPING EFFECT
  // ==========================================
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Software Engineer',
    'Full Stack Developer',
    'Data Analyst',
    'Creative Problem Solver',
    'Curious Technologist'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typedTextEl) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 350;
    }

    setTimeout(typeEffect, typingSpeed);
  }
  typeEffect();


  // ==========================================
  // 6. 3D SPOTLIGHT REFLECTION & TILT ON CARDS
  // ==========================================
  const tiltCards = document.querySelectorAll('.portal-card, .skill-category, .about-detail-item, .project-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for mouse spotlight beam
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D perspective rotation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });


  // ==========================================
  // 7. HERO ORBITING BADGES 3D PARALLAX
  // ==========================================
  const heroPhotoWrapper = document.getElementById('heroPhotoWrapper');
  const orbitBadges = document.querySelectorAll('.orbit-badge');

  if (heroPhotoWrapper) {
    document.addEventListener('mousemove', (e) => {
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

      orbitBadges.forEach(badge => {
        const factor = parseFloat(badge.getAttribute('data-parallax') || 20);
        badge.style.transform = `translate(${xNorm * factor}px, ${yNorm * factor}px)`;
      });
    });
  }


  // ==========================================
  // 8. STATS COUNTER ANIMATION
  // ==========================================



  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count') || '0', 10);
      const duration = 2000;
      const start = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        stat.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }


  // ==========================================
  // 9. NAVBAR & SCROLL PROGRESS
  // ==========================================
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');

  // Multi-page aware active link highlighter
  function setActiveNavLink() {
    let currentFile = window.location.pathname.split('/').pop().split('?')[0].split('#')[0];
    if (!currentFile || currentFile === '' || currentFile === '/') {
      currentFile = 'index.html';
    }

    const allLinks = document.querySelectorAll('.nav-link, .nav-dropdown-link');
    let dropdownChildActive = false;

    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetFile = href.split('/').pop().split('?')[0].split('#')[0];
      if (targetFile === currentFile) {
        link.classList.add('active');
        if (link.classList.contains('nav-dropdown-link')) {
          dropdownChildActive = true;
        }
      } else if (!href.startsWith('#')) {
        link.classList.remove('active');
      }
    });

    const dropBtn = document.querySelector('.nav-dropdown-btn');
    if (dropBtn) {
      if (dropdownChildActive) {
        dropBtn.classList.add('active');
      } else {
        dropBtn.classList.remove('active');
      }
    }
  }
  setActiveNavLink();

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }

    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = `${scrollPercent}%`;
    }
  }, { passive: true });

  // Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMobileNav() {
    if (navToggle) { navToggle.classList.toggle('active'); navToggle.setAttribute('aria-expanded', String(navToggle.classList.contains('active'))); }
    if (navLinks) navLinks.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('active');
  }

  if (navToggle) { navToggle.addEventListener('click', toggleMobileNav); navToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMobileNav(); } }); }
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && navLinks?.classList.contains('active')) { toggleMobileNav(); navToggle?.focus(); } });
  if (navOverlay) navOverlay.addEventListener('click', toggleMobileNav);
  document.querySelectorAll('.nav-link, .nav-dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('active')) toggleMobileNav();
    });
  });

  // Smooth anchor scrolling for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === '') return;
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      } catch (err) {}
    });
  });

  // Scroll reveal — force reveal immediately for all elements (guarantees visibility on all pages)
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    el.classList.add('revealed');
  });

  // Also observe for staggered animation on scroll if desired
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }


  // ==========================================
  // 10. MULTI-THEME NEBULA SWITCHER
  // ==========================================
  const dockThemeBtn = document.getElementById('dockThemeBtn');
  const themeDropdown = document.getElementById('themeDropdown');
  const dockThemeLabel = document.getElementById('dockThemeLabel');
  const themeOpts = document.querySelectorAll('.theme-opt');

  const themes = ['violet', 'cyan', 'matrix', 'blaze'];
  const themeNames = {
    violet: 'Violet',
    cyan: 'Cyan',
    matrix: 'Matrix',
    blaze: 'Blaze'
  };

  function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (dockThemeLabel) dockThemeLabel.textContent = themeNames[theme] || 'Theme';
    themeOpts.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
    });
    try { localStorage.setItem('aagam_theme', theme); } catch (e) {}
    playClickLaser();
  }

  if (dockThemeBtn && themeDropdown) {
    dockThemeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      themeDropdown.classList.remove('open');
    });
  }

  themeOpts.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const selected = opt.getAttribute('data-theme');
      setTheme(selected);
      if (themeDropdown) themeDropdown.classList.remove('open');
    });
  });

  // Restore saved theme
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('aagam_theme'); } catch (e) {}
  if (savedTheme && themes.includes(savedTheme)) {
    setTheme(savedTheme);
  }


  // ==========================================
  // 11. MATRIX CODE RAIN (Easter Egg Engine)
  // ==========================================
  const matrixCanvas = document.getElementById('matrixCanvas');
  const mCtx = matrixCanvas ? matrixCanvas.getContext('2d') : null;
  let matrixActive = false;
  let matrixInterval = null;

  function toggleMatrixRain(forceState) {
    matrixActive = forceState !== undefined ? forceState : !matrixActive;
    if (matrixCanvas) {
      matrixCanvas.classList.toggle('active', matrixActive);
    }
    if (matrixActive) {
      startMatrixRain();
    } else {
      clearInterval(matrixInterval);
    }
  }

  function startMatrixRain() {
    if (!matrixCanvas || !mCtx) return;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
    const fontSize = 16;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);

    clearInterval(matrixInterval);
    matrixInterval = setInterval(() => {
      mCtx.fillStyle = 'rgba(3, 8, 4, 0.08)';
      mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      mCtx.fillStyle = '#34d399';
      mCtx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        mCtx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);
  }


  // ==========================================
  // 12. INTERACTIVE CYBER TERMINAL (CLI)
  // ==========================================
  const terminalModal = document.getElementById('terminalModal');
  const dockTerminalBtn = document.getElementById('dockTerminalBtn');
  const termCloseBtn = document.getElementById('termCloseBtn');
  const termInput = document.getElementById('termInput');
  const termHistory = document.getElementById('termHistory');

  function openTerminal() {
    if (terminalModal) {
      terminalModal.classList.add('open');
      playClickLaser();
      if (termInput) setTimeout(() => termInput.focus(), 100);
    }
  }

  function closeTerminal() {
    if (terminalModal) {
      terminalModal.classList.remove('open');
      playClickLaser();
    }
  }

  if (dockTerminalBtn) dockTerminalBtn.addEventListener('click', openTerminal);
  if (termCloseBtn) termCloseBtn.addEventListener('click', closeTerminal);

  if (terminalModal) {
    terminalModal.addEventListener('click', (e) => {
      if (e.target === terminalModal) closeTerminal();
    });
  }

  // CLI Command processor
  const cliCommands = {
    help: () => [
      '⚡ AVAILABLE SYSTEM COMMANDS:',
      '  about         - View personal bio & philosophy',
      '  skills        - Inspect verified tech stack & skill meters',
      '  projects      - Inspect featured projects (CodeBot v3)',
      '  resume        - View interactive Curriculum Vitae',
      '  contact       - Display direct email & LinkedIn credentials',
      '  goto <page>   - Navigate to page (about, skills, projects, resume, contact, home)',
      '  theme <val>   - Shift theme (violet | cyan | matrix | blaze)',
      '  matrix        - Toggle holographic digital code rain',
      '  sfx           - Toggle native audio synthesis',
      '  clear         - Clear terminal window',
      '  exit          - Close terminal'
    ],
    about: () => [
      '✦ IDENTITY: Aagam Lodaria',
      '✦ ROLES: Software Engineer · Full Stack Developer',
      '✦ BIO: Passionate about technology, scalable systems, and building digital experiences that provide real value.',
      '✦ PHILOSOPHY: "Stay curious, keep building, and never stop growing."',
      '  (Type "goto about" to open full page)'
    ],
    skills: () => [
      '⚡ CORE TECH ARSENAL:',
      '  [LANGUAGES]    C, C++, Java, Python, JavaScript (ES6+)',
      '  [FRONTEND]     HTML5, CSS3, Modern UI, React Patterns',
      '  [DATA & DB]    SQL, MySQL, DBMS, Data Modeling',
      '  [CS CORE]      DSA, OOP, Operating Systems, Computer Networks',
      '  [TOOLS]        Git, GitHub, Linux CLI, VS Code',
      '  (Type "goto skills" to open full interactive page)'
    ],
    projects: () => [
      '🤖 FEATURED PROJECT: CodeBot v3',
      '  - Native AI Coding Assistant & Static Security Engine',
      '  - Dual-Tier Inference (Deterministic Regex + Local Llama 3.2:3b LLM)',
      '  - Static CWE Security Audit Scanner (CWE-798, CWE-95, CWE-89, etc.)',
      '  - Full Stack React 19 / Next.js / TypeScript / JWT Session Auth',
      '  (Type "goto projects" to open full project page)'
    ],
    journey: () => [
      '🤖 Professional experience: Zewel Works, Korakendra and Strange Productions.',
      '  (Open the Experience page from navigation)'
    ],
    resume: () => [
      '📄 CURRICULUM VITAE:',
      '  - Full Engineering Profile & Credentials',
      '  - Academic Background & Technical Skills',
      '  (Type "goto resume" to open full CV)'
    ],
    contact: () => [
      '📬 DIRECT CONTACT CHANNELS:',
      '  Email:    aagam7854@gmail.com',
      '  LinkedIn: https://www.linkedin.com/in/aagam-lodaria-b747863a8',
      '  Status:   Open to Software Engineer & Developer Opportunities',
      '  (Type "goto contact" to open contact console)'
    ],
    matrix: () => {
      toggleMatrixRain();
      return [`[SYSTEM] Matrix code rain: ${matrixActive ? 'ACTIVATED' : 'DEACTIVATED'}`];
    },
    sfx: () => {
      toggleSound();
      return [`[SYSTEM] Sci-Fi audio synthesis: ${soundEnabled ? 'ENABLED' : 'DISABLED'}`];
    },
    clear: () => {
      if (termHistory) termHistory.innerHTML = '';
      return [];
    },
    exit: () => {
      closeTerminal();
      return ['Closing session...'];
    }
  };

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawInput = termInput.value.trim();
        if (!rawInput) return;

        playTerminalBeep();

        // Echo command
        const cmdLine = document.createElement('div');
        cmdLine.className = 'term-output-line cmd';
        cmdLine.textContent = `aagam@dev:~$ ${rawInput}`;
        termHistory.appendChild(cmdLine);

        const parts = rawInput.split(' ');
        const mainCmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : null;

        if ((mainCmd === 'goto' || mainCmd === 'cd') && arg) {
          const pageMap = {
            'home': 'index.html',
            'index': 'index.html',
            'about': 'about.html',
            'skills': 'skills.html',
            'projects': 'projects.html',
            'project': 'projects.html',
            'codebot': 'projects.html',
            'experience': 'experience.html',
            'journey': 'experience.html',
            'resume': 'resume.html',
            'cv': 'resume.html',
            'contact': 'contact.html'
          };

          if (pageMap[arg]) {
            const res = document.createElement('div');
            res.className = 'term-output-line success';
            res.textContent = `[NAVIGATING] Routing to ${pageMap[arg]}...`;
            termHistory.appendChild(res);
            window.location.href = pageMap[arg];
          } else {
            const res = document.createElement('div');
            res.className = 'term-output-line error';
            res.textContent = `Unknown destination "${arg}". Available: ${Object.keys(pageMap).join(', ')}`;
            termHistory.appendChild(res);
          }
        } else if (mainCmd === 'theme' && arg) {
          if (themes.includes(arg)) {
            setTheme(arg);
            const res = document.createElement('div');
            res.className = 'term-output-line success';
            res.textContent = `[THEME] Switched to ${themeNames[arg]} Nebula.`;
            termHistory.appendChild(res);
          } else {
            const res = document.createElement('div');
            res.className = 'term-output-line error';
            res.textContent = `Unknown theme "${arg}". Valid options: ${themes.join(', ')}`;
            termHistory.appendChild(res);
          }
        } else if (cliCommands[mainCmd]) {
          const lines = cliCommands[mainCmd]();
          lines.forEach(text => {
            const outLine = document.createElement('div');
            outLine.className = 'term-output-line';
            outLine.textContent = text;
            termHistory.appendChild(outLine);
          });
        } else {
          const errLine = document.createElement('div');
          errLine.className = 'term-output-line error';
          errLine.textContent = `command not found: "${mainCmd}". Type "help" for a list of commands.`;
          termHistory.appendChild(errLine);
        }

        termInput.value = '';
        const body = document.getElementById('terminalBody');
        if (body) body.scrollTop = body.scrollHeight;
      }
    });
  }


  // ==========================================
  // 13. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formSubmit = document.getElementById('formSubmit');

  if (contactForm && formSubmit) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playClickLaser();

      const data = new FormData(contactForm);
      const subject = data.get('subject') || 'Portfolio enquiry';
      const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
      window.location.href = `mailto:aagam7854@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      formSubmit.textContent = 'Open email draft';

    });
  }


  // ==========================================
  // 14. 1-CLICK COPY EMAIL TO CLIPBOARD
  // ==========================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'aagam7854@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        playClickLaser();
        const origText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<span>✓ Copied!</span>';
        copyEmailBtn.style.borderColor = '#10b981';
        copyEmailBtn.style.color = '#34d399';

        setTimeout(() => {
          copyEmailBtn.innerHTML = origText;
          copyEmailBtn.style.borderColor = '';
          copyEmailBtn.style.color = '';
        }, 2500);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }


  // Interactive Skill Spotlight Modal
  const skillModalBackdrop = document.getElementById('skillModalBackdrop');
  const skillModalClose = document.getElementById('skillModalClose');
  const skillModalDismissBtn = document.getElementById('skillModalDismissBtn');
  const skillModalTitle = document.getElementById('skillModalTitle');
  const skillModalMeta = document.getElementById('skillModalMeta');
  const skillModalBar = document.getElementById('skillModalBar');
  const skillModalDesc = document.getElementById('skillModalDesc');

  function openSkillModal(item) {
    const name = item.getAttribute('data-name') || 'Technology';
    const level = item.getAttribute('data-level') || 'Proficient';
    const pct = item.getAttribute('data-pct') || '85';
    const desc = item.getAttribute('data-desc') || 'Deep theoretical grounding and practical application experience in software engineering.';

    if (skillModalTitle) skillModalTitle.textContent = name;
    if (skillModalMeta) skillModalMeta.textContent = `${pct}% · ${level} Level`;
    if (skillModalBar) skillModalBar.style.width = `${pct}%`;
    if (skillModalDesc) skillModalDesc.textContent = desc;

    if (skillModalBackdrop) {
      skillModalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      playWarpWhoosh();
    }
  }

  function closeSkillModal() {
    if (skillModalBackdrop) {
      skillModalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
      playClickLaser();
    }
  }

  document.querySelectorAll('.skill-interactive-item').forEach(item => {
    item.addEventListener('click', () => openSkillModal(item));
  });

  if (skillModalClose) skillModalClose.addEventListener('click', closeSkillModal);
  if (skillModalDismissBtn) skillModalDismissBtn.addEventListener('click', closeSkillModal);
  if (skillModalBackdrop) {
    skillModalBackdrop.addEventListener('click', (e) => {
      if (e.target === skillModalBackdrop) closeSkillModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skillModalBackdrop && skillModalBackdrop.classList.contains('active')) {
      closeSkillModal();
    }
  });


  // ==========================================
  // 16. SYNTH PAD EXPERIMENT (lab.html)
  // ==========================================
  const synthPadBtns = document.querySelectorAll('.synth-pad-btn');
  synthPadBtns.forEach(pad => {
    pad.addEventListener('click', () => {
      initAudio();
      if (!audioCtx) return;

      const freq = parseFloat(pad.getAttribute('data-freq') || '440');
      const waveType = pad.getAttribute('data-type') || 'sine';

      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);

        pad.style.transform = 'scale(0.96)';
        setTimeout(() => pad.style.transform = '', 150);
      } catch (e) {}
    });
  });


  // ==========================================
  // 17. PLAYABLE ARCADE MINI-GAME (Quantum Pulse)
  // ==========================================
  const gameCanvas = document.getElementById('gameCanvas');
  const gameOverlay = document.getElementById('gameOverlay');
  const gameOverlayTitle = document.getElementById('gameOverlayTitle');
  const gameOverlayDesc = document.getElementById('gameOverlayDesc');
  const gameStartBtn = document.getElementById('gameStartBtn');
  const gameScoreEl = document.getElementById('gameScore');
  const gameHighScoreEl = document.getElementById('gameHighScore');

  if (gameCanvas) {
    const gCtx = gameCanvas.getContext('2d');
    let gWidth = (gameCanvas.width = gameCanvas.offsetWidth || 800);
    let gHeight = (gameCanvas.height = 440);

    window.addEventListener('resize', () => {
      if (gameCanvas.offsetWidth) {
        gWidth = gameCanvas.width = gameCanvas.offsetWidth;
      }
    });

    let gameActive = false;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('aagam_game_highscore') || '0', 10);
    if (gameHighScoreEl) gameHighScoreEl.textContent = highScore;

    // Player Ship
    const player = {
      x: gWidth / 2,
      y: gHeight - 45,
      radius: 16,
      targetX: gWidth / 2
    };

    let enemies = [];
    let items = [];
    let sparks = [];
    let enemySpawnCounter = 0;

    gameCanvas.addEventListener('mousemove', (e) => {
      const rect = gameCanvas.getBoundingClientRect();
      player.targetX = e.clientX - rect.left;
    });

    function spawnEnemy() {
      const size = Math.random() * 20 + 12;
      enemies.push({
        x: Math.random() * (gWidth - size * 2) + size,
        y: -size,
        radius: size,
        speed: Math.random() * 2.5 + 2 + (score * 0.05),
        color: '#ef4444'
      });
    }

    function spawnItem() {
      items.push({
        x: Math.random() * (gWidth - 40) + 20,
        y: -15,
        radius: 10,
        speed: 2.2,
        color: '#10b981'
      });
    }

    function createSparks(x, y, color) {
      for (let i = 0; i < 16; i++) {
        sparks.push({
          x, y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          alpha: 1,
          color
        });
      }
    }

    function startArcadeGame() {
      initAudio();
      playWarpWhoosh();
      score = 0;
      enemies = [];
      items = [];
      sparks = [];
      enemySpawnCounter = 0;
      if (gameScoreEl) gameScoreEl.textContent = '0';
      if (gameOverlay) gameOverlay.classList.add('hidden');
      gameActive = true;
      requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      gameActive = false;
      playClickLaser();
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('aagam_game_highscore', highScore);
        if (gameHighScoreEl) gameHighScoreEl.textContent = highScore;
      }
      if (gameOverlayTitle) gameOverlayTitle.textContent = 'MISSION TERMINATED';
      if (gameOverlayDesc) gameOverlayDesc.innerHTML = `Final Score: <strong style="color:var(--accent-cyan);">${score}</strong> · Best: ${highScore}`;
      if (gameStartBtn) gameStartBtn.textContent = '↻ REBOOT MISSION';
      if (gameOverlay) gameOverlay.classList.remove('hidden');
    }

    function gameLoop() {
      if (!gameActive) return;

      gCtx.fillStyle = 'rgba(3, 3, 10, 0.28)';
      gCtx.fillRect(0, 0, gWidth, gHeight);

      // Smooth player movement
      player.x += (player.targetX - player.x) * 0.2;
      // Clamp bounds
      if (player.x < player.radius) player.x = player.radius;
      if (player.x > gWidth - player.radius) player.x = gWidth - player.radius;

      // Draw player ship
      gCtx.save();
      gCtx.translate(player.x, player.y);
      gCtx.beginPath();
      gCtx.moveTo(0, -player.radius - 4);
      gCtx.lineTo(-player.radius, player.radius);
      gCtx.lineTo(player.radius, player.radius);
      gCtx.closePath();
      gCtx.fillStyle = '#06b6d4';
      gCtx.shadowColor = '#06b6d4';
      gCtx.shadowBlur = 15;
      gCtx.fill();
      gCtx.restore();

      // Spawn obstacles
      enemySpawnCounter++;
      if (enemySpawnCounter % 45 === 0) spawnEnemy();
      if (enemySpawnCounter % 140 === 0) spawnItem();

      // Update & draw enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += e.speed;

        gCtx.beginPath();
        gCtx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        gCtx.fillStyle = e.color;
        gCtx.shadowColor = '#ef4444';
        gCtx.shadowBlur = 12;
        gCtx.fill();

        // Check collision with player
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < e.radius + player.radius) {
          createSparks(player.x, player.y, '#ef4444');
          gameOver();
          return;
        }

        // Passed screen
        if (e.y > gHeight + e.radius) {
          enemies.splice(i, 1);
          score += 5;
          if (gameScoreEl) gameScoreEl.textContent = score;
        }
      }

      // Update & draw energy items
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed;

        gCtx.beginPath();
        gCtx.arc(it.x, it.y, it.radius, 0, Math.PI * 2);
        gCtx.fillStyle = it.color;
        gCtx.shadowColor = '#10b981';
        gCtx.shadowBlur = 15;
        gCtx.fill();

        // Check collection
        const dx = it.x - player.x;
        const dy = it.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < it.radius + player.radius) {
          createSparks(it.x, it.y, '#34d399');
          items.splice(i, 1);
          score += 25;
          playHoverBlip();
          if (gameScoreEl) gameScoreEl.textContent = score;
          continue;
        }

        if (it.y > gHeight + it.radius) {
          items.splice(i, 1);
        }
      }

      // Update & draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.04;

        if (sp.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        gCtx.fillStyle = sp.color;
        gCtx.globalAlpha = sp.alpha;
        gCtx.beginPath();
        gCtx.arc(sp.x, sp.y, 2.5, 0, Math.PI * 2);
        gCtx.fill();
        gCtx.globalAlpha = 1;
      }

      requestAnimationFrame(gameLoop);
    }

    if (gameStartBtn) {
      gameStartBtn.addEventListener('click', startArcadeGame);
    }
  }

});

