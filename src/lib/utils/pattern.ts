export interface Pattern {
  color: string;
  top: string;
  left: string;
  size: string;
  rotation: string;
}

export interface SavedPattern {
  shapes: Pattern[];
  backgroundColor: string;
}

export const generateNeoBrutalistPattern = (title: string) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#FFD93D",
  ];
  const bgColors = [
    "#FFE5E5",
    "#E8F6F6",
    "#E5F0F5",
    "#EDF4F0",
    "#FFF9E6",
    "#FFF5CC",
  ];

  const hash = title.split("").reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  const getSeededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const shapes = Array.from({ length: 5 }, (_, index) => {
    const seedBase = Math.abs(hash + index);
    return {
      color: colors[Math.floor(getSeededRandom(seedBase) * colors.length)],
      top: `${getSeededRandom(seedBase + 1) * 100}%`,
      left: `${getSeededRandom(seedBase + 2) * 100}%`,
      size: `${30 + getSeededRandom(seedBase + 3) * 70}px`,
      rotation: `${getSeededRandom(seedBase + 4) * 360}deg`,
    };
  });

  return {
    shapes,
    backgroundColor: bgColors[Math.abs(hash) % bgColors.length],
  };
};
