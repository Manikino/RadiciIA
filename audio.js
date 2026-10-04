class PixelSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicMuted = false;
    this.sfxMuted = false;
    this.musicVolume = 1;
    this.sfxVolume = 1;
    this.sfxGain = null;
    this.initialized = false;

    // BGM System
    this.bgm = null;
    this.playlist = [];
    this.currentTrackIndex = -1;
    this.bgmFiles = [
      'Along The Broken Path.mp3',
      'Barba Non Facit Gnomus.mp3',
      'Cavernum Cogitationum.mp3',
      'Eldrij Highroad.mp3',
      'Emerald and Gold.mp3',
      'End Of The Hunt.mp3',
      'In The Fading Spring.mp3',
      'The Academic City.mp3'
    ];
    this.onTrackChange = null;
    this.musicFolder = 'Music';
    this.sfxFolder = 'Sfx';
    this.activeSfx = [];
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.sfxVolume;
        this.sfxGain.connect(this.ctx.destination);
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  async resumeAudio() {
    this.init();
    if (!this.ctx) return false;

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return this.ctx.state === 'running';
    } catch (error) {
      console.warn('Audio resume failed:', error);
      return false;
    }
  }

  toggleMusic() {
    this.musicMuted = !this.musicMuted;
    this.muted = this.musicMuted && this.sfxMuted;

    if (this.bgm) {
      this.bgm.muted = this.musicMuted;
      if (this.musicMuted) {
        this.bgm.pause();
      } else {
        this.ensureContext();
        this.bgm.play().catch(() => {});
      }
    } else if (!this.musicMuted && this.playlist.length) {
      this.playBGM(this.currentTrackIndex >= 0 ? this.currentTrackIndex : Math.floor(Math.random() * this.playlist.length), 250);
    }

    return this.musicMuted;
  }

  toggleSfx() {
    this.sfxMuted = !this.sfxMuted;
    this.muted = this.musicMuted && this.sfxMuted;

    this.activeSfx.forEach((sfx) => {
      if (sfx) {
        sfx.muted = this.sfxMuted;
      }
    });

    return this.sfxMuted;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, Number(volume)));
    if (this.bgm) this.bgm.volume = this.musicVolume;
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, Number(volume)));
    if (this.sfxGain) this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    this.activeSfx.forEach((sfx) => {
      if (sfx) sfx.volume = 0.9 * this.sfxVolume;
    });
  }

  toggleMute() {
    this.musicMuted = !this.musicMuted;
    this.sfxMuted = !this.sfxMuted;
    this.muted = this.musicMuted && this.sfxMuted;

    if (this.bgm) {
      this.bgm.muted = this.musicMuted;
      if (this.musicMuted) {
        this.bgm.pause();
      } else {
        this.ensureContext();
        this.bgm.play().catch(() => {});
      }
    } else if (!this.musicMuted && this.playlist.length) {
      this.playBGM(this.currentTrackIndex >= 0 ? this.currentTrackIndex : Math.floor(Math.random() * this.playlist.length), 250);
    }

    this.activeSfx.forEach((sfx) => {
      if (sfx) {
        sfx.muted = this.sfxMuted;
      }
    });

    return this.muted;
  }

  normalizeAudioFileList(files, fallback = []) {
    const validExt = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.webm'];
    const found = [];
    const seen = new Set();
    const candidates = Array.isArray(files) ? files : fallback;

    candidates.forEach((filename) => {
      if (!filename || typeof filename !== 'string') return;
      const file = filename.trim();
      const normalized = file.replace(/^\//, '').replace(/\\/g, '/');
      const lower = normalized.toLowerCase();
      const extensionOk = validExt.some(ext => lower.endsWith(ext));
      if (!extensionOk || seen.has(normalized.toLowerCase())) return;
      found.push(normalized.split('/').pop());
      seen.add(normalized.toLowerCase());
    });
    return found;
  }

  async discoverAudioFiles(directory, fallbackFiles = []) {
    const fallback = this.normalizeAudioFileList(fallbackFiles, []);
    if (window.location.protocol === 'file:') return fallback;

    try {
      const response = await fetch(directory, { cache: 'no-store' });
      if (!response.ok) return fallback;
      const html = await response.text();
      const matches = [...html.matchAll(/href=["']([^"']+\.(?:mp3|wav|ogg|flac|m4a|aac|webm))["']/gi)];
      const files = matches
        .map((match) => decodeURIComponent(match[1].split('/').pop()))
        .filter(Boolean);
      const discovered = this.normalizeAudioFileList(files, fallback);
      return discovered.length ? discovered : fallback;
    } catch (error) {
      return fallback;
    }
  }

  async loadMusicFiles() {
    const discovered = await this.discoverAudioFiles(this.musicFolder, this.bgmFiles);
    if (discovered.length) {
      this.bgmFiles = discovered;
    }

    if (this.bgmFiles.length && this.currentTrackIndex === -1 && !this.bgm) {
      this.shufflePlaylist();
    }
    return this.bgmFiles;
  }

  startBGMWithFade(durationMs = 1800) {
    if (!this.bgmFiles.length) return null;
    return this.playBGM(null, durationMs);
  }

  buildShuffledPlaylist(avoidFile = null) {
    const tracks = [...this.bgmFiles];
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }

    if (tracks.length > 1 && avoidFile && tracks[0] === avoidFile) {
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i] !== avoidFile) {
          [tracks[0], tracks[i]] = [tracks[i], tracks[0]];
          break;
        }
      }
    }

    return tracks;
  }

  shufflePlaylist() {
    this.playlist = this.buildShuffledPlaylist(this.playlist[this.currentTrackIndex] || null);
    if (this.playlist.length > 0 && this.currentTrackIndex !== -1 && this.playlist[0] === this.playlist[this.currentTrackIndex]) {
      this.playlist = this.buildShuffledPlaylist(this.playlist[this.currentTrackIndex]);
    }
  }

  formatSongName(filename) {
    if (!filename) return 'Traccia sconosciuta';
    const cleaned = filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) return 'Traccia sconosciuta';

    return cleaned
      .split(' ')
      .map((word) => {
        const lower = word.toLowerCase();
        if (lower === 'ai' || lower === 'llm' || lower === 'id') return lower.toUpperCase();
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  playBGM(index = null, fadeInMs = 0) {
    if (!this.bgmFiles || this.bgmFiles.length === 0) return null;

    if (this.playlist.length === 0) {
      this.playlist = this.buildShuffledPlaylist();
    }

    let nextIndex;
    if (index !== null && index >= 0 && index < this.playlist.length) {
      nextIndex = index;
    } else if (this.currentTrackIndex === -1) {
      nextIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      const nextPos = this.currentTrackIndex + 1;
      if (nextPos < this.playlist.length) {
        nextIndex = nextPos;
      } else {
        const previous = this.playlist[this.currentTrackIndex];
        this.playlist = this.buildShuffledPlaylist(previous);
        nextIndex = 0;
      }
    }

    const trackFile = this.playlist[nextIndex];
    if (!trackFile) return null;

    if (this.bgm) {
      this.bgm.pause();
      this.bgm.onended = null;
      this.bgm = null;
    }

    this.currentTrackIndex = nextIndex;
    const audioUrl = encodeURI(`${this.musicFolder}/${trackFile}`);
    this.bgm = new Audio(audioUrl);
    this.bgm.loop = false;
    this.bgm.muted = this.musicMuted;
    this.bgm.volume = fadeInMs > 0 ? 0 : this.musicVolume;
    this.bgm.onended = () => this.playBGM();

    const audio = this.bgm;
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.then(() => {
        if (fadeInMs <= 0) return;
        const startedAt = performance.now();
        const fadeFrame = (now) => {
          if (audio !== this.bgm) return;
          const progress = Math.min((now - startedAt) / fadeInMs, 1);
          audio.volume = progress * this.musicVolume;
          if (progress < 1) requestAnimationFrame(fadeFrame);
        };
        requestAnimationFrame(fadeFrame);
      }).catch((error) => console.warn('BGM Autoplay blocked:', error));
    }

    const songName = this.formatSongName(trackFile);
    if (this.onTrackChange) {
      this.onTrackChange(songName);
    }

    return songName;
  }

  prevBGM() {
    if (!this.playlist.length) return null;
    const index = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    return this.playBGM(index);
  }

  nextBGM() {
    if (!this.playlist.length) return null;
    const index = (this.currentTrackIndex + 1) % this.playlist.length;
    return this.playBGM(index);
  }

  getCurrentSongName() {
    if (this.currentTrackIndex === -1 || !this.playlist[this.currentTrackIndex]) return 'Nessuna traccia';
    return this.formatSongName(this.playlist[this.currentTrackIndex]);
  }

  // --- SFX Management ---

  playSfx(filename) {
    if (this.sfxMuted || !filename) return null;
    const safeName = String(filename).trim();
    if (!safeName) return null;

    this.ensureContext();
    const sfx = new Audio(encodeURI(`${this.sfxFolder}/${safeName}`));
    sfx.volume = 0.9 * this.sfxVolume;
    sfx.muted = this.sfxMuted;
    sfx.play().catch((error) => console.warn('SFX Playback failed:', error));
    this.activeSfx.push(sfx);
    sfx.onended = () => {
      this.activeSfx = this.activeSfx.filter((track) => track !== sfx);
    };
    return sfx;
  }

  playHover() {
    if (this.sfxMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playNodeClick(tier = 'low') {
    if (this.sfxMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      let notes = [523.25, 659.25, 783.99, 1046.50];
      let oscType = 'square';

      if (tier === 'high') {
        notes = [440.00, 554.37, 659.25, 880.00];
        oscType = 'triangle';
      } else if (tier === 'unacceptable') {
        notes = [311.13, 370.00, 440.00, 220.00];
        oscType = 'sawtooth';
      }

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = oscType;
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.42, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.1);
      });
    } catch (e) {}
  }

  playModalClose() {
    if (this.sfxMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

      gain.gain.setValueAtTime(0.36, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }
}

const pixelAudio = new PixelSoundEngine();
