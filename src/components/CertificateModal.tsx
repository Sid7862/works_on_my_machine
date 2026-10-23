import React, { useState, useRef } from 'react';
import { X, Award, Printer, Download, Check, Laptop } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [developerName, setDeveloperName] = useState('Senior Fullstack Engineer');
  const [machineSpecs, setMachineSpecs] = useState('MacBook Pro M3 Max (128GB RAM, Localhost:3000)');
  const [dateString, setDateString] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const certRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 my-auto text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Official "Works On My Machine" Certificate</h3>
              <p className="text-xs text-slate-400">Legal proof that any failure in production is purely the cloud's fault.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Developer Name / Title</label>
            <input
              type="text"
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. Satoshi Nakamoto"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Certified Machine Environment</label>
            <input
              type="text"
              value={machineSpecs}
              onChange={(e) => setMachineSpecs(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. MacBook Pro M3 Max"
            />
          </div>
        </div>

        {/* The Printable Certificate */}
        <div
          ref={certRef}
          className="relative bg-gradient-to-br from-amber-50 via-amber-100/90 to-amber-50 text-slate-900 p-8 sm:p-12 rounded-xl border-8 border-double border-amber-700/60 shadow-2xl overflow-hidden font-serif select-none"
        >
          {/* Subtle watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
            <span className="text-[120px] font-black tracking-widest text-slate-950 rotate-[-25deg]">
              VERIFIED
            </span>
          </div>

          {/* Certificate Header */}
          <div className="text-center relative z-10 space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-bold text-amber-800">
              Department of Local Host Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-slate-950 border-b-2 border-amber-900/30 pb-2 inline-block">
              CERTIFICATE OF OPERATIONAL IMMUNITY
            </h2>
            <p className="text-xs italic text-slate-700 pt-1">
              Pursuant to the Universal Doctrine of "Works on My Machine" (RFC 1337-PROD)
            </p>
          </div>

          {/* Certificate Body */}
          <div className="my-6 text-center space-y-4 relative z-10">
            <p className="text-sm text-slate-800 font-sans">
              This hereby certifies that the software engineered by:
            </p>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-950 border-b border-dashed border-amber-900/50 pb-1 mx-auto max-w-md">
              {developerName || 'Anonymous Hero'}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 max-w-lg mx-auto leading-relaxed">
              Has compiled, executed, and completed all tests with <strong>100% success</strong> on the local host machine.
              Therefore, if the production environment, Kubernetes cluster, or customer browser catches fire, explodes, or drops connections,
              the developer is hereby granted <strong>complete immunity</strong>.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-200/70 border border-amber-700/40 rounded text-xs font-mono font-semibold text-slate-900">
              <Laptop className="w-3.5 h-3.5 text-amber-800" />
              <span>Certified Env: {machineSpecs}</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-8 pt-4 border-t border-amber-900/30 flex items-end justify-between relative z-10 text-xs text-slate-800 font-sans">
            <div className="text-left space-y-1">
              <div className="font-serif italic text-lg text-slate-900 font-bold border-b border-slate-600 pb-0.5">
                Localhost Administrator
              </div>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">Authorized Local Officer</p>
              <p className="text-[10px] text-slate-600 font-mono">{dateString}</p>
            </div>

            {/* Gold Seal */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 border-4 border-amber-700 shadow-xl flex flex-col items-center justify-center text-center p-2 rotate-[-8deg]">
              <span className="text-[8px] sm:text-[9px] font-black uppercase text-amber-950 leading-tight">
                ★ CERTIFIED ★
              </span>
              <span className="text-[10px] sm:text-[11px] font-black text-slate-950 uppercase leading-none my-0.5">
                WORKS ON
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-amber-950 uppercase leading-tight">
                MACHINE
              </span>
              <span className="text-[7px] text-amber-900 font-mono">0 ERRORS</span>
            </div>

            <div className="text-right space-y-1">
              <div className="font-mono text-sm text-slate-900 font-bold border-b border-slate-600 pb-0.5">
                SHIP_THE_LAPTOP()
              </div>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">DevOps Final Resolution</p>
              <p className="text-[10px] text-emerald-800 font-bold">PROD EXEMPT</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};
