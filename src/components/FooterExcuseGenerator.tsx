import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Dice5, Copy, Check, Sparkles, MessageSquareQuote, ArrowUpRight } from 'lucide-react';

export interface DevExcuse {
  category: string;
  excuse: string;
  tagColor: string;
}

export const DEV_FAILURES_EXCUSES: DevExcuse[] = [
  {
    category: 'DNS & Networking',
    excuse: 'It’s always DNS. Even when it’s definitely not DNS, it turns out to be DNS.',
    tagColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
  },
  {
    category: 'Kubernetes',
    excuse: 'The cluster pods sensed weakness and scheduled a collective protest on a Friday at 4:59 PM.',
    tagColor: 'text-blue-400 bg-blue-950/60 border-blue-800/60',
  },
  {
    category: 'Docker',
    excuse: 'Docker cached a layer from 2021 that still contained my hopes, dreams, and hardcoded localhost IPs.',
    tagColor: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
  },
  {
    category: 'AWS Infrastructure',
    excuse: 'AWS us-east-1 is just having an emotional afternoon. It worked flawlessly on my MacBook Pro M3.',
    tagColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
  },
  {
    category: 'Astrophysics',
    excuse: 'Solar flares caused bit-flips in memory. Cosmic radiation is unfortunately outside my sprint SLA.',
    tagColor: 'text-purple-400 bg-purple-950/60 border-purple-800/60',
  },
  {
    category: 'Database',
    excuse: 'The staging database was SQLite; nobody warned me production had more than 3 rows of data.',
    tagColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
  },
  {
    category: 'YAML Syntax',
    excuse: 'A rogue invisible space in `deployment.yaml` line 348 invalidated the laws of cloud computing.',
    tagColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
  },
  {
    category: 'AI & Automation',
    excuse: 'The AI assistant hallucinated an optimized drop-table statement and deemed production redundant.',
    tagColor: 'text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-800/60',
  },
  {
    category: 'Timezones',
    excuse: 'The cron job evaluated leap seconds in Samoa and decided today is actually yesterday.',
    tagColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60',
  },
  {
    category: 'User Behavior',
    excuse: 'The system was 100% bug-free until actual users showed up and clicked things out of order.',
    tagColor: 'text-yellow-400 bg-yellow-950/60 border-yellow-800/60',
  },
  {
    category: 'Git Blame',
    excuse: 'That was written by a developer who left the company 4 hours ago and left no documentation.',
    tagColor: 'text-orange-400 bg-orange-950/60 border-orange-800/60',
  },
  {
    category: 'Microservices',
    excuse: 'Service A timed out waiting for Service B, which was waiting for Service A to confirm receipt of the timeout.',
    tagColor: 'text-teal-400 bg-teal-950/60 border-teal-800/60',
  },
  {
    category: 'Caching',
    excuse: 'There are only two hard things in Computer Science: cache invalidation, and explaining this outage to the CEO.',
    tagColor: 'text-red-400 bg-red-950/60 border-red-800/60',
  },
  {
    category: 'Hardware',
    excuse: 'The server fan was spinning clockwise when the kernel expected counter-clockwise cooling air.',
    tagColor: 'text-pink-400 bg-pink-950/60 border-pink-800/60',
  },
  {
    category: 'Release Protocol',
    excuse: 'The deploy script succeeded with exit code 0. Therefore, the burning servers are an optical illusion.',
    tagColor: 'text-lime-400 bg-lime-950/60 border-lime-800/60',
  },
];

interface FooterExcuseGeneratorProps {
  onApplyToMeme?: (excuseText: string) => void;
  onShowToast: (msg: string) => void;
}

export const FooterExcuseGenerator: React.FC<FooterExcuseGeneratorProps> = ({
  onApplyToMeme,
  onShowToast,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentExcuse = DEV_FAILURES_EXCUSES[currentIndex];

  const handleNextExcuse = () => {
    sound.playGlitch();
    setIsAnimating(true);
    setTimeout(() => {
      let nextIdx = Math.floor(Math.random() * DEV_FAILURES_EXCUSES.length);
      if (nextIdx === currentIndex) {
        nextIdx = (currentIndex + 1) % DEV_FAILURES_EXCUSES.length;
      }
      setCurrentIndex(nextIdx);
      setIsAnimating(false);
    }, 150);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`[Prod Failure Excuse - ${currentExcuse.category}] "${currentExcuse.excuse}"`);
    sound.playSuccessDing();
    setCopied(true);
    onShowToast('📋 Excuse copied for Slack/incident channels!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplyToMeme) {
      sound.playCoffeeSlurp();
      onApplyToMeme(currentExcuse.excuse);
      onShowToast('✨ Applied excuse to meme bottom caption!');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Header bar of Excuse Generator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Random Dev Excuse Generator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                P1 Incident Defense Shield
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Need to explain a sudden production meltdown? Click to generate bulletproof engineering justifications.
            </p>
          </div>
        </div>

        {/* Action Button to generate new excuse */}
        <button
          onClick={handleNextExcuse}
          className="group px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
        >
          <Dice5 className={`w-4 h-4 transition-transform duration-300 ${isAnimating ? 'rotate-180 scale-125' : 'group-hover:rotate-45'}`} />
          <span>Generate New Excuse</span>
        </button>
      </div>

      {/* Main Excuse Quote Card */}
      <div className={`mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 ${isAnimating ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${currentExcuse.tagColor}`}>
              {currentExcuse.category}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Excuse #{currentIndex + 1} of {DEV_FAILURES_EXCUSES.length}
            </span>
          </div>

          <p className="text-sm sm:text-base font-medium text-slate-200 leading-snug font-sans italic">
            "{currentExcuse.excuse}"
          </p>
        </div>

        {/* Buttons to Copy or Apply directly into the Meme */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition active:scale-95"
            title="Copy excuse to clipboard for Slack or Jira"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onApplyToMeme && (
            <button
              onClick={handleApply}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-500/40 transition active:scale-95"
              title="Set this excuse as the bottom text in the meme canvas"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Use in Meme</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
