import React, { useState } from 'react';
import { MemeConfig, AspectRatioType, FontStyleType, PRESET_MEMES } from '../types/meme';
import { sound } from '../utils/audio';
import {
  Download,
  Copy,
  Volume2,
  VolumeX,
  Flame,
  Sparkles,
  Type,
  Coffee,
  Award,
  Dice5,
  Rocket,
  Palette,
  Check,
  Maximize2,
  Sliders,
  ShieldAlert,
} from 'lucide-react';

interface MemeControlsProps {
  config: MemeConfig;
  onChange: (updater: (prev: MemeConfig) => MemeConfig) => void;
  onDeploy: () => void;
  onDownload: () => void;
  onCopyImage: () => void;
  onOpenCertificate: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isCopied: boolean;
}

const DEV_EXCUSES_TOP = [
  'Welcome to @workson.my.machine',
  'It compiled on localhost:3000',
  'Works fine in Docker on my Mac',
  'Pushed directly to main at 4:59 PM',
  'All 1 unit tests passed locally',
  'Root cause: Not my code',
  'Local coverage: 100%',
  'git push origin main --force',
  'My MacBook M3 is faster than AWS',
  'Did you try restarting Kubernetes?',
];

const DEV_EXCUSES_BOTTOM = [
  "Where if it builds locally, it's ready for production.",
  "Why won't the cloud just trust my localhost?",
  "Then we'll just ship my laptop to the customer.",
  "Have a peaceful and restful weekend, DevOps team.",
  "Production is just someone else's burning server.",
  "The bug is not reproducible outside of reality.",
  "Kubernetes is clearly having an emotional day.",
  "It is technically not down if you do not check DataDog.",
  "Sipping coffee while AWS us-east-1 vaporizes.",
  "Works on my machine, closing ticket as WONTFIX.",
];

const HOODIE_COLORS = [
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Charcoal Black', value: '#334155' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Emerald Green', value: '#059669' },
  { name: 'Purple Cyber', value: '#7c3aed' },
  { name: 'Amber Orange', value: '#d97706' },
];

export const MemeControls: React.FC<MemeControlsProps> = ({
  config,
  onChange,
  onDeploy,
  onDownload,
  onCopyImage,
  onOpenCertificate,
  soundEnabled,
  onToggleSound,
  isCopied,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'chaos' | 'style'>('text');

  const handleRandomize = () => {
    sound.playGlitch();
    const randomTop = DEV_EXCUSES_TOP[Math.floor(Math.random() * DEV_EXCUSES_TOP.length)];
    const randomBottom = DEV_EXCUSES_BOTTOM[Math.floor(Math.random() * DEV_EXCUSES_BOTTOM.length)];
    const randomDisaster = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const randomHoodie = HOODIE_COLORS[Math.floor(Math.random() * HOODIE_COLORS.length)].value;
    const randomMug = ['IT WORKS', 'PROD 🔥', 'M3 MAX', '404 NO', 'ZEN', 'WONTFIX'][Math.floor(Math.random() * 6)];

    onChange((prev) => ({
      ...prev,
      topText: randomTop,
      bottomText: randomBottom,
      disasterLevel: randomDisaster,
      hoodieColor: randomHoodie,
      mugText: randomMug,
    }));
  };

  const setPreset = (preset: typeof PRESET_MEMES[0]) => {
    sound.playSuccessDing();
    onChange((prev) => ({
      ...prev,
      topText: preset.top,
      bottomText: preset.bottom,
      disasterLevel: preset.level,
      mugText: preset.mug,
    }));
  };

  const disasterLabels = [
    'Level 1: Minor Warning in Dev',
    'Level 2: Docker Restart Loop',
    'Level 3: DNS Panic Attack',
    'Level 4: Exploding Server Rack',
    'Level 5: Friday 5PM Meltdown',
  ];

  return (
    <div className="flex flex-col gap-5 w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      {/* Primary Actions: Deploy to Prod & Export Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Chaos Deploy Button */}
          <button
            onClick={onDeploy}
            className="group relative px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition active:scale-95"
            title="Deploy directly to production (at your own risk)"
          >
            <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Deploy to Prod 🚀</span>
          </button>

          {/* Random Excuse generator */}
          <button
            onClick={handleRandomize}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 border border-slate-700"
            title="Randomize dev excuses & captions"
          >
            <Dice5 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Randomize</span>
          </button>
        </div>

        {/* Right side tools: Download, Copy, Certificate, Audio */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className={`p-2.5 rounded-xl border transition ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCertificate}
            className="px-3 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            title="View & Print Official Certificate of Immunity"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Certificate</span>
          </button>

          <button
            onClick={onCopyImage}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 border border-slate-700"
            title="Copy meme image to clipboard"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={onDownload}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 active:scale-95"
            title="Download high-resolution PNG"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'text'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Captions & Typography</span>
        </button>

        <button
          onClick={() => setActiveTab('chaos')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'chaos'
              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Server Chaos & Flames</span>
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'style'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Coffee className="w-3.5 h-3.5 text-cyan-400" />
          <span>Character & Aspect Ratio</span>
        </button>
      </div>

      {/* TAB 1: CAPTIONS & PRESETS */}
      {activeTab === 'text' && (
        <div className="space-y-4 animate-fade-in">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Caption Presets & Scenarios:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_MEMES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPreset(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                    config.topText === preset.top
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750 hover:border-slate-600'
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Top Text Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Top Caption</label>
              <button
                onClick={() => onChange((prev) => ({ ...prev, topText: 'Welcome to @workson.my.machine' }))}
                className="text-[10px] text-amber-400 hover:underline"
              >
                Reset to Prompt Default
              </button>
            </div>
            <input
              type="text"
              value={config.topText}
              onChange={(e) => onChange((prev) => ({ ...prev, topText: e.target.value }))}
              placeholder="e.g. Welcome to @workson.my.machine"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Bottom Text Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Bottom Caption</label>
              <button
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    bottomText: "Where if it builds locally, it's ready for production.",
                  }))
                }
                className="text-[10px] text-amber-400 hover:underline"
              >
                Reset to Prompt Default
              </button>
            </div>
            <input
              type="text"
              value={config.bottomText}
              onChange={(e) => onChange((prev) => ({ ...prev, bottomText: e.target.value }))}
              placeholder="e.g. Where if it builds locally, it's ready for production."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Typography Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Font Style</label>
              <select
                value={config.fontStyle}
                onChange={(e) => onChange((prev) => ({ ...prev, fontStyle: e.target.value as FontStyleType }))}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="anton">Anton (Pixar Cinematic)</option>
                <option value="impact">Impact (Classic Meme)</option>
                <option value="bebas">Bebas Neue (Bold Tall)</option>
                <option value="fira">Fira Code (Hacker Terminal)</option>
                <option value="inter">Inter (Modern Sans)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Text Size Scale</span>
                <span>{config.fontSize.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.05"
                value={config.fontSize}
                onChange={(e) => onChange((prev) => ({ ...prev, fontSize: parseFloat(e.target.value) }))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Text Color</label>
                <input
                  type="color"
                  value={config.textColor}
                  onChange={(e) => onChange((prev) => ({ ...prev, textColor: e.target.value }))}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Outline Color</label>
                <input
                  type="color"
                  value={config.strokeColor}
                  onChange={(e) => onChange((prev) => ({ ...prev, strokeColor: e.target.value }))}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Gold Seal Badge Toggle */}
          <div className="pt-2 flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  "Certified Works On My Machine" Gold Seal
                </span>
                <span className="text-[11px] text-slate-400">
                  Adds the official QA verification stamp in the corner
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.showBadge}
                onChange={(e) => onChange((prev) => ({ ...prev, showBadge: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      )}

      {/* TAB 2: CHAOS & DISASTER LEVEL */}
      {activeTab === 'chaos' && (
        <div className="space-y-4 animate-fade-in">
          {/* Disaster Level Slider */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                <span className="text-sm font-bold text-slate-200">Server Destruction Level</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 font-mono">
                {disasterLabels[config.disasterLevel - 1]}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={config.disasterLevel}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                sound.playExplosion(val * 0.25);
                onChange((prev) => ({ ...prev, disasterLevel: val }));
              }}
              className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1: Quiet Warning</span>
              <span>3: DNS Fire</span>
              <span>5: Complete Datacenter Meltdown 🔥</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Alarm Strobe Speed */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Emergency Siren Strobe</span>
                <span className="font-mono text-amber-400">{config.strobeSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={config.strobeSpeed}
                onChange={(e) => onChange((prev) => ({ ...prev, strobeSpeed: parseFloat(e.target.value) }))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Coffee Mug Label */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Giant Coffee Mug Label</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={12}
                  value={config.mugText}
                  onChange={(e) => onChange((prev) => ({ ...prev, mugText: e.target.value }))}
                  placeholder="e.g. IT WORKS"
                  className="w-full px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => sound.playCoffeeSlurp()}
                  className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30 shrink-0"
                >
                  Sip ☕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHARACTER & ASPECT RATIO */}
      {activeTab === 'style' && (
        <div className="space-y-4 animate-fade-in">
          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Canvas Aspect Ratio & Layout:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '4:3 Classic Meme', val: '4:3' },
                { label: '1:1 Square (Insta/Feed)', val: '1:1' },
                { label: '16:9 Banner / Desktop', val: '16:9' },
                { label: '9:16 Story / TikTok', val: '9:16' },
              ].map((ratio) => (
                <button
                  key={ratio.val}
                  onClick={() => onChange((prev) => ({ ...prev, aspectRatio: ratio.val as AspectRatioType }))}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    config.aspectRatio === ratio.val
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hoodie Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Developer Hoodie Color:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {HOODIE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onChange((prev) => ({ ...prev, hoodieColor: color.value }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition ${
                    config.hoodieColor === color.value
                      ? 'border-white bg-slate-800 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block border border-white/20"
                    style={{ backgroundColor: color.value }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desk Props Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🦆</span>
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  Desk Rubber Ducky (With Dev Glasses)
                </span>
                <span className="text-[11px] text-slate-400">
                  Essential rubber duck debugging companion on the desk
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.showDuck}
                onChange={(e) => onChange((prev) => ({ ...prev, showDuck: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
