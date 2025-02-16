export class Dice {
  value: number;
  isHeld: boolean;
  private static images: string[] = [
    "die-1.svg",
    "die-2.svg",
    "die-3.svg",
    "die-4.svg",
    "die-5.svg",
    "die-6.svg",
  ];

  constructor() {
    this.value = this.roll();
    this.isHeld = true;
  }

  roll(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  getImage(): string {
    return Dice.images[this.value - 1];
  }
}
