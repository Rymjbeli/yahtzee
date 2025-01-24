import {shuffleArray} from "./shuffleArray";
import {Position} from "../interfaces/position";

export function generateRandomDicePositions(): Position[] {
  const availablePositions: Position[] = [
    { top: '10%', left: '10%', transform: '' },
    { top: '0%', left: '40%', transform: '' },
    { top: '5%', left: '70%', transform: '' },
    { top: '25%', left: '30%', transform: '' },
    { top: '60%', left: '50%', transform: '' },
    { top: '40%', left: '75%', transform: '' },
    { top: '65%', left: '15%', transform: '' },
    { top: '70%', left: '80%', transform: '' },
    { top: '25%', left: '55%', transform: '' },
    { top: '55%', left: '35%', transform: '' },
  ];

  // Shuffle available positions to randomize the order
  const shuffledPositions = shuffleArray([...availablePositions]);

  // Pick the first 5 unique positions
  return shuffledPositions.slice(0, 5).map(randomPosition => {
    const randomRotation = Math.floor(Math.random() * 31) - 15; // Random rotation between -15deg and +15deg
    return {
      ...randomPosition,
      transform: `rotate(${randomRotation}deg)`,
    };
  });
}
