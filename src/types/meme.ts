export type AspectRatioType = '4:3' | '1:1' | '16:9' | '9:16';

export type FontStyleType = 'impact' | 'anton' | 'bebas' | 'fira' | 'inter';

export type DeveloperMood = 'zen' | 'smug' | 'sipping' | 'laughing';

export interface MemeConfig {
  topText: string;
  bottomText: string;
  fontStyle: FontStyleType;
  fontSize: number; // base scale 1.0 to 2.5
  textColor: string;
  strokeColor: string;
  showBadge: boolean;
  badgeType: 'gold' | 'hologram' | 'danger';
  disasterLevel: number; // 1 to 5
  hoodieColor: string;
  mugText: string;
  showDuck: boolean;
  aspectRatio: AspectRatioType;
  matrixRainSpeed: number;
  particlesCount: number;
  isDeploying: boolean;
  strobeSpeed: number;
}

export const PRESET_MEMES = [
  {
    title: 'The Official Brief',
    top: 'Welcome to @workson.my.machine',
    bottom: "Where if it builds locally, it's ready for production.",
    level: 4,
    mug: 'IT WORKS',
  },
  {
    title: 'Docker Disappointment',
    top: 'Works in Docker on my MacBook M3',
    bottom: "Why won't Kubernetes just believe me?",
    level: 5,
    mug: 'M3 MAX',
  },
  {
    title: 'Friday Deploy',
    top: 'Pushed direct to main at 4:59 PM',
    bottom: 'Have a great weekend everyone!',
    level: 5,
    mug: 'PROD 🔥',
  },
  {
    title: 'Client Solution',
    top: 'Works on my machine',
    bottom: "Then we'll just ship your machine to the client.",
    level: 3,
    mug: 'SHIP IT',
  },
  {
    title: 'Localhost Confidence',
    top: 'Tests passed on localhost:3000',
    bottom: 'The cloud is just someone else\'s burning computer.',
    level: 4,
    mug: '404 NO',
  },
  {
    title: 'Git Blame Roulette',
    top: 'git commit -m "minor fix"',
    bottom: 'Root cause: entire infrastructure erased.',
    level: 5,
    mug: 'FORCE PUSH',
  },
];
