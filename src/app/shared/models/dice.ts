export class Dice {
  value: number;
  isHeld: boolean;
  images: string[];

  constructor() {
    this.images = [
      "die-1.svg",
      "die-2.svg",
      "die-3.svg",
      "die-4.svg",
      "die-5.svg",
      "die-6.svg",
    ];
    this.value = this.roll();
    this.isHeld = false;
  }

  roll(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  getImage(): string {
    return this.images[this.value - 1];
  }
}
