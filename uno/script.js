// ============================================================
//  💗 Girlfriend's Day Interactive Script & Surprise Heart Fountain 💗
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Initialize Lenis Smooth Scroll ---
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }


  // --- 1. Background Generators (Stars & Falling Hearts) ---
  function initBackground() {
    const starsContainer = document.getElementById('stars-container');
    const heartsContainer = document.getElementById('hearts-container');

    if (!starsContainer || !heartsContainer) return;

    // Generate 46 Twinkling Stars
    const starCount = 46;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('span');
      star.className = 'animate-twinkle absolute rounded-full bg-white';
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = 1 + Math.random() * 2.4;
      const dur = 2 + Math.random() * 3.5;
      const delay = Math.random() * 4;

      star.style.cssText = `
        top: ${top}%;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        box-shadow: 0 0 6px rgba(255,255,255,0.9);
        --tw: ${dur}s;
        animation-delay: ${delay}s;
      `;
      starsContainer.appendChild(star);
    }

    // Generate 22 Falling Hearts
    const heartColors = ["#ff6b9d", "#ff8fb3", "#ffb3cc", "#ff4b72", "#e79fc4"];
    const heartCount = 22;

    for (let i = 0; i < heartCount; i++) {
      const heartWrapper = document.createElement('span');
      heartWrapper.className = 'animate-fall absolute top-0';
      const left = Math.random() * 100;
      const size = 12 + Math.random() * 22;
      const dur = 9 + Math.random() * 11;
      const delay = -Math.random() * 18;
      const drift = (Math.random() - 0.5) * 160;
      const color = heartColors[Math.floor(Math.random() * heartColors.length)];
      const opacity = 0.35 + Math.random() * 0.45;

      heartWrapper.style.cssText = `
        left: ${left}%;
        opacity: ${opacity};
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        --drift: ${drift}px;
      `;

      heartWrapper.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
          <path d="M12 21s-6.7-4.35-9.33-8.09C.9 10.24 1.5 6.9 4.2 5.6c2-1 4.2-.3 5.3 1.3L12 9l2.5-2.1c1.1-1.6 3.3-2.3 5.3-1.3 2.7 1.3 3.3 4.64 1.53 7.31C18.7 16.65 12 21 12 21z"/>
        </svg>
      `;
      heartsContainer.appendChild(heartWrapper);
    }
  }

  initBackground();


  // --- 2. Music Player & Audio Controls ---
  const audio = document.getElementById('bg-music');
  const floatingMusicBtn = document.getElementById('music-toggle-btn');
  const cardPlayBtn = document.getElementById('card-play-btn');
  const vinylDisc = document.getElementById('vinyl-disc');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const floatVolOn = document.getElementById('float-vol-on');
  const floatVolOff = document.getElementById('float-vol-off');
  const progressBar = document.getElementById('music-progress');
  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');

  let isPlaying = false;

  function togglePlay() {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }

  function updatePlayState(playing) {
    isPlaying = playing;
    if (playing) {
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (floatVolOn) floatVolOn.classList.remove('hidden');
      if (floatVolOff) floatVolOff.classList.add('hidden');
      if (vinylDisc) vinylDisc.classList.add('spin-vinyl');
    } else {
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (floatVolOn) floatVolOn.classList.add('hidden');
      if (floatVolOff) floatVolOff.classList.remove('hidden');
      if (vinylDisc) vinylDisc.classList.remove('spin-vinyl');
    }
  }

  if (floatingMusicBtn) floatingMusicBtn.addEventListener('click', togglePlay);
  if (cardPlayBtn) cardPlayBtn.addEventListener('click', togglePlay);

  if (audio) {
    audio.addEventListener('play', () => updatePlayState(true));
    audio.addEventListener('pause', () => updatePlayState(false));

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (totalDurationEl) totalDurationEl.textContent = formatTime(audio.duration);
      }
    });
  }

  const progressTrack = document.getElementById('progress-track');
  if (progressTrack && audio) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      audio.currentTime = pct * audio.duration;
    });
  }

  function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }


  // --- 3. Relationship Days Counter ---
  // Start Date: 16 May 2026
  const startDate = new Date(2026, 4, 16, 0, 0, 0);

  function updateCounter() {
    const now = new Date();
    const diff = Math.max(0, now - startDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minsEl) minsEl.textContent = minutes;
    if (secsEl) secsEl.textContent = seconds;
  }

  setInterval(updateCounter, 1000);
  updateCounter();


  // --- 4. Helper: Fire Heart Confetti ---
  function fireHearts(opts = {}) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: opts.particleCount || 35,
        spread: opts.spread || 75,
        origin: opts.origin || { y: 0.6 },
        colors: ['#ff6b9d', '#ff4b72', '#ffb3cc', '#e79fc4', '#ffffff'],
        scalar: 1.25,
        ...opts
      });
    }
  }


  // --- 5. Smooth Envelope Opening & Entrance ---
  const introScreen = document.getElementById('intro-screen');
  const mainContent = document.getElementById('main-content');
  const envelopeBtn = document.getElementById('envelope-btn');
  const tapBeginBtn = document.getElementById('tap-to-begin-btn');
  let hasOpened = false;

  function openEnvelopeAndEnter() {
    if (hasOpened) return;
    hasOpened = true;

    if (envelopeBtn) envelopeBtn.classList.add('envelope-open');

    fireHearts({ origin: { y: 0.45 }, particleCount: 50 });

    if (audio && !isPlaying) {
      audio.play().catch(() => {});
    }

    setTimeout(() => {
      if (introScreen) introScreen.classList.add('hide-intro');
      if (mainContent) mainContent.classList.add('show-main');

      setTimeout(() => {
        if (introScreen) introScreen.style.display = 'none';
        if (lenis) {
          lenis.scrollTo('#main-hero', { duration: 1.5 });
        } else {
          const hero = document.getElementById('main-hero');
          if (hero) hero.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);

    }, 600);
  }

  if (introScreen) {
    introScreen.addEventListener('click', (e) => {
      openEnvelopeAndEnter();
    });
  }
  if (envelopeBtn) envelopeBtn.addEventListener('click', openEnvelopeAndEnter);
  if (tapBeginBtn) tapBeginBtn.addEventListener('click', openEnvelopeAndEnter);


  // --- 6. Interactive "Do you love me?" Question ---
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const questionContainer = document.getElementById('question-actions');
  const answerResult = document.getElementById('answer-result');

  let yesScale = 1;

  function dodgeNo() {
    if (!noBtn) return;
    yesScale = Math.min(yesScale + 0.28, 2.5);
    if (yesBtn) yesBtn.style.transform = `scale(${yesScale})`;

    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 120;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
  }

  if (noBtn) {
    noBtn.addEventListener('mouseenter', dodgeNo);
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeNo();
    });
  }

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      fireHearts({ origin: { y: 0.6 } });
      setTimeout(() => fireHearts({ angle: 60, origin: { x: 0, y: 0.7 } }), 200);
      setTimeout(() => fireHearts({ angle: 120, origin: { x: 1, y: 0.7 } }), 350);

      if (questionContainer) questionContainer.classList.add('hidden');
      if (answerResult) answerResult.classList.remove('hidden');
    });
  }


  // --- 7. Surprise Heart Fountain & Card Reveal (EXACT MATCH TO SCREENSHOT) ---
  const surpriseBtn = document.getElementById('surprise-btn');
  const surpriseCardWrapper = document.getElementById('surprise-card-wrapper');
  const surpriseResult = document.getElementById('surprise-result');
  const surpriseHeartsBg = document.getElementById('surprise-hearts-bg');

  if (surpriseBtn && surpriseCardWrapper && surpriseResult) {
    surpriseBtn.addEventListener('click', () => {
      fireHearts({ origin: { y: 0.55 }, particleCount: 45 });
      
      surpriseBtn.classList.add('hidden');
      surpriseCardWrapper.classList.remove('hidden');

      setTimeout(() => {
        surpriseResult.classList.remove('opacity-0', 'scale-95');
        surpriseResult.classList.add('opacity-100', 'scale-100');
      }, 50);

      // Trigger continuous rising background hearts fountain
      spawnSurpriseHeartsFountain(surpriseHeartsBg);
    });
  }

  function spawnSurpriseHeartsFountain(container) {
    if (!container) return;
    const heartColors = ["#ff6b9d", "#ff4b72", "#ffb3cc", "#e79fc4", "#ff8fb3"];
    
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.className = 'absolute pointer-events-none animate-surprise-heart';
        const size = 16 + Math.random() * 26;
        const left = 5 + Math.random() * 90;
        const color = heartColors[Math.floor(Math.random() * heartColors.length)];
        const drift = (Math.random() - 0.5) * 180;
        const duration = 1.8 + Math.random() * 1.6;

        heart.style.cssText = `
          left: ${left}%;
          bottom: 10px;
          --drift: ${drift}px;
          animation-duration: ${duration}s;
          z-index: -1;
        `;
        heart.innerHTML = `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 21s-6.7-4.35-9.33-8.09C.9 10.24 1.5 6.9 4.2 5.6c2-1 4.2-.3 5.3 1.3L12 9l2.5-2.1c1.1-1.6 3.3-2.3 5.3-1.3 2.7 1.3 3.3 4.64 1.53 7.31C18.7 16.65 12 21 12 21z"/>
          </svg>
        `;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
      }, i * 70);
    }
  }


  // --- 8. Typewriter Love Letter ---
  const letterParagraphs = [
    "Happy girlfriend's day my kiddo 🫶🏻",
    "Ohh from where should i start, it feels like the heaven blessed me with it's prettiest angel, I can't have enough of you and i can't thank god enough everyday that he sent you into my life 💕",
    "I should proudly say this, i am a fool if i say my exes are once my girlfriend. No they were, they were just people that came into my life to give me lessons, or were preparing me to make me perfect, perfect so i could take care of you, so i could feel the happiest with you 💋",
    "I love you so much that it wants me to wake up in the morning, ask you to be my girlfriend, kneel down in the afternoon to propose you, and marry you in the evening light where i could see the most beautiful women standing by my side in a beautiful pink dress 🧿🥹",
    "Thankyou for always supporting me bachche, thankyou for always being there, thankyou for holding my hand, thankyou for your hugs and kisses, and thankyou for the beautiful memories i made with you, and going to make in the future 🩵",
    "Kuch bhi hojaye door mt jana uno, tera piyuu tere liye kuch bhi krega, dunia se ladd lega, jadhu pocha kar lega, achcha achcha khana banake khilayega, tere mummy papa didu jiju or chotu doggies ko bhi khush rkhega, tujhe kbhi kisi bhi point pe regret hone dega nahi or bohot sara pyar kregaaaa 💋"
  ];

  const fullText = letterParagraphs.join("\n\n");
  const letterContent = document.getElementById('letter-content');
  const skipBtn = document.getElementById('skip-typewriter');
  const letterSection = document.getElementById('letter-section');

  let typeIndex = 0;
  let typingTimer = null;
  let isTyped = false;

  function startTyping() {
    if (isTyped) return;
    if (typingTimer) clearInterval(typingTimer);

    typingTimer = setInterval(() => {
      typeIndex += 2;
      if (letterContent) {
        letterContent.textContent = fullText.slice(0, typeIndex);
      }
      if (typeIndex >= fullText.length) {
        clearInterval(typingTimer);
        isTyped = true;
        if (skipBtn) skipBtn.classList.add('hidden');
      }
    }, 22);
  }

  function skipTyping() {
    if (typingTimer) clearInterval(typingTimer);
    isTyped = true;
    if (letterContent) letterContent.textContent = fullText;
    if (skipBtn) skipBtn.classList.add('hidden');
  }

  if (skipBtn) skipBtn.addEventListener('click', skipTyping);

  if ('IntersectionObserver' in window && letterSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(letterSection);
  } else {
    startTyping();
  }


  // --- 9. Closing Section Heart Shower ---
  const closingSection = document.getElementById('closing-section');
  const oneMoreBtn = document.getElementById('one-more-heart');

  let closingFired = false;
  if ('IntersectionObserver' in window && closingSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !closingFired) {
          closingFired = true;
          let end = Date.now() + 1600;
          let frame = () => {
            fireHearts({ particleCount: 8, origin: { x: Math.random(), y: 0.9 }, startVelocity: 50, spread: 90 });
            if (Date.now() < end) requestAnimationFrame(frame);
          };
          frame();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(closingSection);
  }

  if (oneMoreBtn) {
    oneMoreBtn.addEventListener('click', () => {
      fireHearts({ particleCount: 60, spread: 120, origin: { y: 0.6 } });
    });
  }

});
