import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Terminal, Flame, AlertTriangle, CheckCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface ProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployBlast: () => void;
}

interface LogEntry {
  type: 'info' | 'success' | 'warn' | 'error' | 'fatal';
  text: string;
}

export const ProductionModal: React.FC<ProductionModalProps> = ({
  isOpen,
  onClose,
  onDeployBlast,
}) => {
  const [phase, setPhase] = useState<'deploying' | 'exploded' | 'done'>('deploying');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const logSequence: { delay: number; log: LogEntry; soundAction?: () => void }[] = [
    { delay: 300, log: { type: 'info', text: '$ git push origin main --force --no-verify' } },
    { delay: 800, log: { type: 'info', text: 'Running pre-flight checks on localhost...' } },
    { delay: 1400, log: { type: 'success', text: '✓ 1 test passed (expect(true).toBe(true)) in 4ms' }, soundAction: () => sound.playSuccessDing() },
    { delay: 2000, log: { type: 'info', text: 'Connecting to AWS us-east-1 production Kubernetes cluster...' } },
    { delay: 2700, log: { type: 'warn', text: '⚠ Warning: 84 undocumented environment variables missing in Prod' } },
    { delay: 3400, log: { type: 'info', text: 'Applying database migrations directly on live RDS PostgreSQL...' } },
    { delay: 4100, log: { type: 'error', text: '✖ ERROR: Table "users" already dropped by concurrent migration' }, soundAction: () => sound.playGlitch() },
    { delay: 4800, log: { type: 'error', text: '✖ Pod "auth-service-7f99b" crashed with OOMKilled (exit 137)' } },
    { delay: 5400, log: { type: 'warn', text: '🚨 Server rack rack-04 temperature: 840°C and rising rapidly!' }, soundAction: () => sound.playSiren() },
    { delay: 6200, log: { type: 'fatal', text: '💥 CRITICAL: Catastrophic hardware failure in Data Center 2' }, soundAction: () => {
      sound.playExplosion(1.5);
      onDeployBlast();
      // Throw fiery red and orange confetti for the explosion
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f97316', '#facc15', '#000000'],
      });
    }},
    { delay: 7000, log: { type: 'info', text: 'Developer status: Relaxed, feet on desk, drinking fresh coffee.' } },
    { delay: 7600, log: { type: 'success', text: 'Verified: STILL WORKS ON MY MACHINE! ☕' }, soundAction: () => sound.playCoffeeSlurp() },
  ];

  useEffect(() => {
    if (!isOpen) {
      setLogs([]);
      setPhase('deploying');
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];
    setLogs([]);
    setPhase('deploying');

    logSequence.forEach(({ delay, log, soundAction }) => {
      const t = setTimeout(() => {
        setLogs((prev) => [...prev, log]);
        if (soundAction) soundAction();
        if (log.type === 'fatal') {
          setPhase('exploded');
        }
      }, delay);
      timeouts.push(t);
    });

    const finalT = setTimeout(() => {
      setPhase('done');
    }, 8500);
    timeouts.push(finalT);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            <span className="ml-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              deploy-to-prod.sh — production pipeline
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target:</span>
            <span className="text-emerald-400 font-bold">k8s-prod-cluster-us-east-1</span>
          </div>
          <div className="flex items-center gap-2">
            {phase === 'deploying' && (
              <span className="flex items-center gap-1.5 text-amber-400 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Deploying directly to main...
              </span>
            )}
            {phase === 'exploded' && (
              <span className="flex items-center gap-1.5 text-red-400 font-bold animate-bounce">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> SERVER RACK EXPLODING
              </span>
            )}
            {phase === 'done' && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="w-3.5 h-3.5" /> 100% Works on My Machine
              </span>
            )}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="p-4 overflow-y-auto font-mono text-xs sm:text-sm space-y-2 bg-slate-950/95 flex-1 select-text">
          {logs.map((log, index) => {
            let color = 'text-slate-300';
            let icon = '>';
            if (log.type === 'success') {
              color = 'text-emerald-400 font-semibold';
              icon = '✓';
            } else if (log.type === 'warn') {
              color = 'text-amber-400 font-semibold';
              icon = '⚠';
            } else if (log.type === 'error') {
              color = 'text-rose-400 font-bold';
              icon = '✖';
            } else if (log.type === 'fatal') {
              color = 'text-red-500 bg-red-950/40 p-1.5 rounded border border-red-800/80 font-black';
              icon = '💥';
            }

            return (
              <div key={index} className={`flex items-start gap-2 ${color} animate-fade-in`}>
                <span className="opacity-70 select-none">{icon}</span>
                <span className="leading-relaxed">{log.text}</span>
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Bottom verdict card */}
        {phase === 'done' && (
          <div className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-t border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                ☕
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300">Official Verdict: Not My Problem</h4>
                <p className="text-xs text-slate-400">The build passed on localhost:3000. Recommend shipping your laptop to prod.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
            >
              Resume Sipping Coffee
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
