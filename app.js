document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvasEl = document.getElementById('treeCanvas');
  const posterContainer = document.getElementById('posterContainer');
  const gridViewContainer = document.getElementById('gridViewContainer');

  // Main Modal Elements
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCard = document.getElementById('modalCard');
  const modalBadge = document.getElementById('modalBadge');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalReadMode = document.getElementById('modalReadMode');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');
  const modalCounter = document.getElementById('modalCounter');

  // Tooltip Elements
  const tooltipEl = document.getElementById('pixelTooltip');
  const tooltipTitle = document.getElementById('tooltipTitle');
  const tooltipBadge = document.getElementById('tooltipBadge');

  // Control Toolbar Elements
  const searchInput = document.getElementById('searchInput');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const crtToggleBtn = document.getElementById('crtToggleBtn');
  const viewToggleBtn = document.getElementById('viewToggleBtn');
  const crtOverlay = document.getElementById('crtOverlay');
  const currentMusicTitleEl = document.getElementById('currentMusicTitle');
  const adventureIntro = document.getElementById('adventureIntro');
  const startAdventureBtn = document.getElementById('startAdventureBtn');

  let activeNodeIndex = 0;
  let isGridView = false;
  let isAudioReady = false;
  let marqueeUpdateFrame = 0;

  function syncAudioLabels() {
    if (!musicToggleBtn) return;
    musicToggleBtn.textContent = pixelAudio.musicMuted ? 'MUSICA OFF' : 'MUSICA ON';
    musicToggleBtn.setAttribute('aria-label', pixelAudio.musicMuted ? 'Riattiva la musica' : 'Disattiva la musica');

    if (sfxToggleBtn) {
      sfxToggleBtn.textContent = pixelAudio.sfxMuted ? 'SUONI OFF' : 'SUONI ON';
      sfxToggleBtn.setAttribute('aria-label', pixelAudio.sfxMuted ? 'Riattiva gli effetti sonori' : 'Disattiva gli effetti sonori');
    }
  }

  function updateMusicMarquee(name) {
    if (!currentMusicTitleEl) return;

    const title = String(name || 'Traccia sconosciuta');
    const track = currentMusicTitleEl.querySelector('.music-title-track');
    const copy = currentMusicTitleEl.querySelector('.music-title-copy');
    if (!track || !copy) return;

    copy.textContent = title;
    track.classList.remove('is-moving');
    track.querySelectorAll('[data-marquee-copy]').forEach((duplicate) => duplicate.remove());
    currentMusicTitleEl.setAttribute('aria-label', title);

    cancelAnimationFrame(marqueeUpdateFrame);
    marqueeUpdateFrame = requestAnimationFrame(() => {
      marqueeUpdateFrame = 0;
      const titleWidth = copy.getBoundingClientRect().width;
      const viewportWidth = currentMusicTitleEl.clientWidth;
      if (titleWidth <= viewportWidth) return;

      const duplicate = copy.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.dataset.marqueeCopy = 'true';
      track.appendChild(duplicate);
      track.style.setProperty('--marquee-duration', `${Math.max(8, titleWidth / 32)}s`);
      track.classList.add('is-moving');
    });
  }

  function startExperience() {
    if (isAudioReady) return;
    isAudioReady = true;
    pixelAudio.resumeAudio();
    pixelAudio.startBGMWithFade(1800);
  }

  document.addEventListener('pointerdown', startExperience, { once: true });
  document.addEventListener('keydown', startExperience, { once: true });

  pixelAudio.onTrackChange = (name) => {
    updateMusicMarquee(name);
  };

  if (startAdventureBtn) {
    startAdventureBtn.addEventListener('click', () => {
      startExperience();
      if (adventureIntro) {
        adventureIntro.classList.add('is-leaving');
        const removeIntro = (event) => {
          if (event.target !== adventureIntro || event.propertyName !== 'opacity') return;
          adventureIntro.removeEventListener('transitionend', removeIntro);
          adventureIntro.remove();
        };
        adventureIntro.addEventListener('transitionend', removeIntro);
        window.setTimeout(() => {
          if (adventureIntro && adventureIntro.parentNode) {
            adventureIntro.remove();
          }
        }, 550);
      }
    });
  }

  pixelAudio.musicFolder = 'Music';
  pixelAudio.sfxFolder = 'Sfx';

  const canvasEngine = new PixelTreeCanvas(canvasEl, NODE_ITEMS, RISK_SECTIONS, NODE_LINKS);
  canvasEngine.setDefaultBackgroundImage('assets/default-roots-bg.jpg');

  try {
    const savedBg = localStorage.getItem('pixel_poster_bg_image');
    if (savedBg) {
      canvasEngine.setBackgroundImage(savedBg);
    }
  } catch (error) {}

  canvasEngine.onNodeHoverCallback = (node) => {
    if (node) {
      pixelAudio.playHover();
      tooltipTitle.textContent = node.title;
      const sec = RISK_SECTIONS.find((s) => s.id === node.tier);
      tooltipBadge.textContent = sec ? sec.badge : '';
      tooltipBadge.style.color = sec ? sec.color : '#ffffff';
      tooltipEl.style.borderColor = sec ? sec.color : '#00ff9d';
      tooltipEl.classList.add('visible');
    } else {
      tooltipEl.classList.remove('visible');
    }
  };

  window.addEventListener('mousemove', (event) => {
    if (tooltipEl.classList.contains('visible')) {
      tooltipEl.style.left = `${event.clientX + 16}px`;
      tooltipEl.style.top = `${event.clientY + 16}px`;
    }
  });

  canvasEngine.onNodeClickCallback = (node) => {
    if (!node) return;
    if (node.type === 'sfx' && node.sfxFile) {
      pixelAudio.playSfx(node.sfxFile);
      return;
    }
    openModal(node);
  };

  function openModal(node) {
    if (!node) return;
    const index = NODE_ITEMS.findIndex((item) => item.id === node.id);
    if (index !== -1) {
      activeNodeIndex = index;
    }

    const sec = RISK_SECTIONS.find((s) => s.id === node.tier);
    pixelAudio.playNodeClick(node.tier);

    modalCard.className = `pixel-modal-card tier-${node.tier}`;
    const accentColor = node.customColor || (sec ? sec.color : '#00ff9d');
    modalCard.style.borderColor = accentColor;
    modalPrevBtn.style.color = accentColor;
    modalPrevBtn.style.borderColor = accentColor;
    modalNextBtn.style.color = accentColor;
    modalNextBtn.style.borderColor = accentColor;
    modalBadge.textContent = sec ? sec.badge : node.tier.toUpperCase();
    modalBadge.style.color = accentColor;
    modalBadge.style.borderColor = accentColor;
    modalTitle.textContent = node.title;
    modalContent.textContent = node.content;
    modalContent.style.borderLeftColor = accentColor;
    modalCounter.textContent = `${activeNodeIndex + 1} / ${NODE_ITEMS.length}`;
    modalBackdrop.classList.add('active');
  }

  function closeModal() {
    pixelAudio.playModalClose();
    modalBackdrop.classList.remove('active');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    const typing = document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (event.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
    if ((event.key === 'ArrowRight' || event.key === 'PageDown') && !typing && NODE_ITEMS.length > 0) {
      activeNodeIndex = (activeNodeIndex + 1) % NODE_ITEMS.length;
      openModal(NODE_ITEMS[activeNodeIndex]);
    }
    if ((event.key === 'ArrowLeft' || event.key === 'PageUp') && !typing && NODE_ITEMS.length > 0) {
      activeNodeIndex = (activeNodeIndex - 1 + NODE_ITEMS.length) % NODE_ITEMS.length;
      openModal(NODE_ITEMS[activeNodeIndex]);
    }
  });

  modalPrevBtn.addEventListener('click', () => {
    if (!NODE_ITEMS.length) return;
    activeNodeIndex = (activeNodeIndex - 1 + NODE_ITEMS.length) % NODE_ITEMS.length;
    openModal(NODE_ITEMS[activeNodeIndex]);
  });

  modalNextBtn.addEventListener('click', () => {
    if (!NODE_ITEMS.length) return;
    activeNodeIndex = (activeNodeIndex + 1) % NODE_ITEMS.length;
    openModal(NODE_ITEMS[activeNodeIndex]);
  });

  document.querySelectorAll('[data-jump]').forEach((btn) => {
    btn.addEventListener('click', () => {
      pixelAudio.playHover();
      const targetY = Number.parseInt(btn.getAttribute('data-jump'), 10);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((part) => part + part).join('') : clean;
    const value = Number.parseInt(full, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  function lerpColor(fromHex, toHex, t) {
    const from = hexToRgb(fromHex);
    const to = hexToRgb(toHex);
    const u = Math.min(1, Math.max(0, t));
    const r = Math.round(from.r + (to.r - from.r) * u);
    const g = Math.round(from.g + (to.g - from.g) * u);
    const blue = Math.round(from.b + (to.b - from.b) * u);
    return `rgb(${r}, ${g}, ${blue})`;
  }

  function updateHotbarAccent() {
    const header = document.querySelector('.pixel-header');
    if (!header) return;

    const low = '#00ff9d';
    const mid = '#ffb700';
    const high = '#ff2a6d';
    let accent = low;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const lowEnd = RISK_DIVIDERS.dividerY1 || 1100;
    const highEnd = RISK_DIVIDERS.dividerY2 || 1900;

    if (scrollY <= lowEnd) {
      const t = lowEnd === 0 ? 0 : scrollY / lowEnd;
      accent = lerpColor(low, mid, t);
    } else if (scrollY <= highEnd) {
      const span = highEnd - lowEnd || 1;
      const t = (scrollY - lowEnd) / span;
      accent = lerpColor(mid, high, t);
    } else {
      accent = high;
    }

    document.documentElement.style.setProperty('--header-accent', accent);
    header.style.setProperty('--header-accent', accent);
    header.style.borderBottomColor = accent;
    header.style.boxShadow = `0 4px 20px ${accent}33`;
    header.style.color = accent;
  }

  function renderGridView(query = '') {
    gridViewContainer.innerHTML = '';

    RISK_SECTIONS.forEach((section) => {
      const sectionNodes = NODE_ITEMS.filter((node) => node.tier === section.id && (
        query === '' ||
        node.title.toLowerCase().includes(query.toLowerCase()) ||
        node.content.toLowerCase().includes(query.toLowerCase())
      ));

      if (sectionNodes.length === 0 && query !== '') return;

      const sectionEl = document.createElement('div');
      sectionEl.className = 'grid-tier-section';
      sectionEl.innerHTML = `
        <div class="grid-tier-header" style="color: ${section.color}; border-color: ${section.borderColor};">
          <div>${section.title} (${section.badge})</div>
          <div style="font-size: 11px; opacity: 0.8; font-family: var(--font-pixel);">${section.subtitle}</div>
          <div class="grid-tier-intro">${section.introContent}</div>
        </div>
        <div class="grid-cards-wrapper"></div>
      `;

      const wrapper = sectionEl.querySelector('.grid-cards-wrapper');
      sectionNodes.forEach((node) => {
        const card = document.createElement('div');
        card.className = `grid-pixel-card tier-${node.tier}`;
        const titleColor = node.customColor || section.color;
        card.innerHTML = `
          <div class="grid-card-title" style="color: ${titleColor};">${node.isSpecial ? '⭐ ' : ''}${node.title}</div>
          <div class="grid-card-snippet">${node.content.substring(0, 110)}...</div>
        `;

        if (node.customColor) {
          card.style.borderColor = node.customColor;
          card.style.boxShadow = `6px 6px 0px rgba(${parseInt(node.customColor.slice(1,3),16)}, ${parseInt(node.customColor.slice(3,5),16)}, ${parseInt(node.customColor.slice(5,7),16)}, 0.25)`;
        }

        card.addEventListener('click', () => openModal(node));
        card.addEventListener('mouseenter', () => pixelAudio.playHover());
        wrapper.appendChild(card);
      });

      gridViewContainer.appendChild(sectionEl);
    });
  }

  searchInput.addEventListener('input', (event) => {
    const value = event.target.value.trim();
    if (isGridView) {
      renderGridView(value);
    }
  });

  document.getElementById('prevMusicBtn').addEventListener('click', () => {
    pixelAudio.playHover();
    pixelAudio.prevBGM();
  });

  document.getElementById('nextMusicBtn').addEventListener('click', () => {
    pixelAudio.playHover();
    pixelAudio.nextBGM();
  });

  musicToggleBtn.addEventListener('click', () => {
    pixelAudio.toggleMusic();
    syncAudioLabels();
  });

  sfxToggleBtn.addEventListener('click', () => {
    pixelAudio.toggleSfx();
    syncAudioLabels();
  });

  crtToggleBtn.addEventListener('click', () => {
    pixelAudio.playHover();
    crtOverlay.classList.toggle('disabled');
    crtToggleBtn.textContent = crtOverlay.classList.contains('disabled') ? 'CRT OFF' : 'CRT ON';
  });

  viewToggleBtn.addEventListener('click', () => {
    pixelAudio.playHover();
    isGridView = !isGridView;

    if (isGridView) {
      posterContainer.style.display = 'none';
      gridViewContainer.classList.add('active');
      viewToggleBtn.textContent = 'POSTER';
      renderGridView();
    } else {
      posterContainer.style.display = 'block';
      gridViewContainer.classList.remove('active');
      viewToggleBtn.textContent = 'GRIGLIA';
    }
  });

  syncAudioLabels();
  updateMusicMarquee(currentMusicTitleEl ? currentMusicTitleEl.getAttribute('aria-label') : '');
  updateHotbarAccent();
  window.addEventListener('scroll', updateHotbarAccent, { passive: true });
  window.addEventListener('resize', updateHotbarAccent);
  window.addEventListener('resize', () => {
    if (currentMusicTitleEl) updateMusicMarquee(currentMusicTitleEl.getAttribute('aria-label'));
  });
});
