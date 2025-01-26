import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {CONSTANTS} from "../../../../config/const.config";

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audio: HTMLAudioElement | null = null;
  private diceAudio: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = localStorage.getItem(CONSTANTS.IS_MUSIC_PLAYING);
      if (storedState) {
        this.isMusicPlaying = storedState === 'true';
      }

      this.initializeAudio();
    }
  }
  private initializeAudio() {
    // initialize music audio
    if (!this.audio) {
      this.audio = new Audio('assets/songs/yahtzee.mp3');
      this.audio.loop = true;
      this.audio.load();
    }

    // initialize dice audio when rolling
    if (!this.diceAudio) {
      this.diceAudio = new Audio('assets/songs/dice.mp3');
      this.diceAudio.load();
    }
  }
  toggleMusic(): boolean {
    if (isPlatformBrowser(this.platformId)) {

      if (this.audio?.paused && !this.isMusicPlaying) {
        this.audio.play().catch((err) => console.error('Playback failed:', err));
        this.isMusicPlaying = true;
      } else {
        this.audio?.pause();
        this.isMusicPlaying = false;
      }
      localStorage.setItem(CONSTANTS.IS_MUSIC_PLAYING, this.isMusicPlaying.toString());
      return this.isMusicPlaying;
    }
    return false;
  }

  getMusicState(): boolean {
    return this.isMusicPlaying;
  }

  playSound() {
    if(this.isMusicPlaying) {
      this.audio?.play().catch((err) => console.error('Playback failed:', err));
    }
  }

  playDiceSound() {
    this.diceAudio?.play().catch((err) => console.error('Playback failed:', err));
  }
}
