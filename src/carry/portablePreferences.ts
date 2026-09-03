export const PORTABLE_PREFERENCES = {
  interface: {
    reducedMotion: true,
    autoplay: "off",
    targetSize: "large",
    readingDensity: "compact",
  },
  privacy: {
    location: "approximate_only",
    marketing: "off",
    historyRetention: "minimal",
  },
  pricing: {
    showAllInPrices: true,
  },
  food: {
    dietary: "vegetarian",
    peanutWarnings: true,
  },
} as const;

