/**
 * Audio synthesis & heavy vibration utility for loud restaurant partner alerts
 * Powered by Web Audio API with boosted gain, multi-pulse sirens, and intense haptics.
 */

export type RingtoneType = 'chime' | 'loud_urgent' | 'scooter_horn' | 'marimba';
export type VoiceAnnouncementLang = 'hi' | 'en' | 'hinglish';

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public selectedRingtone: RingtoneType = 'loud_urgent';
  public volume: number = 1.0; // Maximum loudness
  public voiceEnabled: boolean = true;
  public voiceLang: VoiceAnnouncementLang = 'hinglish';
  private persistentAlarmInterval: number | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Play heavy loud notification sound with intense multi-stage haptic vibration
   */
  public playNewOrderSound(ringtoneOverride?: RingtoneType) {
    if (!this.enabled) return;
    const tone = ringtoneOverride || this.selectedRingtone;

    // Trigger Heavy Multi-Pulse Vibration for Android/iOS devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        // Strong repeating vibration pattern: [vibrate, pause, vibrate, pause, vibrate...]
        navigator.vibrate([400, 120, 500, 150, 600, 150, 800, 200, 1000]);
      } catch {}
    }

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const vol = this.volume;

      // Master Compressor & Limiter to prevent clipping while maximizing loudness
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-12, now);
      compressor.knee.setValueAtTime(40, now);
      compressor.ratio.setValueAtTime(12, now);
      compressor.attack.setValueAtTime(0.003, now);
      compressor.release.setValueAtTime(0.25, now);
      compressor.connect(ctx.destination);

      if (tone === 'loud_urgent') {
        // High-decibel kitchen alarm (Triple siren burst with harmonics)
        const burstTimes = [0, 0.22, 0.44, 0.7, 0.92, 1.14];
        burstTimes.forEach((offset, idx) => {
          const t = now + offset;

          // Main Carrier
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(880, t); // A5
          osc.frequency.exponentialRampToValueAtTime(1320, t + 0.12); // E6

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.85 * vol, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

          osc.connect(gain);
          gain.connect(compressor);
          osc.start(t);
          osc.stop(t + 0.21);

          // Sub Harmonic layer for heavy punch
          const subOsc = ctx.createOscillator();
          const subGain = ctx.createGain();
          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(440, t);
          subGain.gain.setValueAtTime(0, t);
          subGain.gain.linearRampToValueAtTime(0.5 * vol, t + 0.02);
          subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

          subOsc.connect(subGain);
          subGain.connect(compressor);
          subOsc.start(t);
          subOsc.stop(t + 0.21);
        });
      } else if (tone === 'scooter_horn') {
        // Loud double scooter horn
        const hornTimes = [0, 0.18, 0.45, 0.63];
        hornTimes.forEach((offset) => {
          const t = now + offset;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sawtooth';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(466.16, t); // Bb4
          osc2.frequency.setValueAtTime(587.33, t); // D5

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.7 * vol, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(compressor);
          osc1.start(t);
          osc2.start(t);
          osc1.stop(t + 0.16);
          osc2.stop(t + 0.16);
        });
      } else {
        // Classic loud chime with reverb sustain
        const chimeChords = [
          { f: 587.33, t: now },
          { f: 739.99, t: now + 0.08 },
          { f: 880.0, t: now + 0.16 },
          { f: 1174.66, t: now + 0.28 },
          { f: 1479.98, t: now + 0.42 },
        ];

        chimeChords.forEach(({ f, t }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.8 * vol, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

          osc.connect(gain);
          gain.connect(compressor);
          osc.start(t);
          osc.stop(t + 0.56);
        });
      }
    } catch {}
  }

  /**
   * Start persistent ringing loop until merchant accepts order
   */
  public startPersistentAlarm() {
    this.stopPersistentAlarm();
    this.playNewOrderSound();
    this.persistentAlarmInterval = window.setInterval(() => {
      this.playNewOrderSound();
    }, 2800);
  }

  public stopPersistentAlarm() {
    if (this.persistentAlarmInterval) {
      clearInterval(this.persistentAlarmInterval);
      this.persistentAlarmInterval = null;
    }
  }

  /**
   * Ultra-Clear Natural Voice Speech Announcement in Kitchen
   * (Crisp, loud pronunciation in Hindi / Hinglish / English)
   */
  public announceOrderSpeech(orderId: string, itemsSummary: string, grandTotal?: number) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech

      let spokenText = '';
      if (this.voiceLang === 'hinglish') {
        spokenText = `SachBite par naya order aaya hai! Items hain: ${itemsSummary}. Total amount ${grandTotal || ''} rupaye. Kripya jaldi banayein!`;
      } else if (this.voiceLang === 'hi') {
        spokenText = `सचबाइट पर नया ऑर्डर आया है! व्यंजन हैं: ${itemsSummary}। कुल राशि ${grandTotal || ''} रुपये।`;
      } else {
        spokenText = `New order received on SachBite! Dishes to prepare: ${itemsSummary}. Grand total ${grandTotal || ''} rupees.`;
      }

      const speak = () => {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.rate = 0.95; // Slightly measured rate for crystal-clear clarity
        utterance.pitch = 1.05; // Slightly brighter pitch to cut through kitchen ambient noise
        utterance.volume = 1.0; // Maximum clarity volume

        const voices = window.speechSynthesis.getVoices();
        if (this.voiceLang === 'hi') {
          const hindiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.lang.includes('IN'));
          if (hindiVoice) utterance.voice = hindiVoice;
        } else if (this.voiceLang === 'hinglish') {
          const indianEngVoice = voices.find((v) => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india') || v.lang.startsWith('hi'));
          if (indianEngVoice) utterance.voice = indianEngVoice;
        } else {
          const engVoice = voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB'));
          if (engVoice) utterance.voice = engVoice;
        }

        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        speak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          speak();
        };
      }
    } catch {}
  }

  public playSuccessSound() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.5, now + 0.24);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4 * this.volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 40, 80]);
      }
    } catch {}
  }

  public playTapSound() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    } catch {}
  }
}

export const sounds = new SoundEffects();
