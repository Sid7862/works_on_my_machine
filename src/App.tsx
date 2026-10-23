import React, { useState, useRef, useCallback } from 'react';
import { MemeCanvas } from './components/MemeCanvas';
import { MemeControls } from './components/MemeControls';
import { ProductionModal } from './components/ProductionModal';
import { CertificateModal } from './components/CertificateModal';
import { FooterExcuseGenerator } from './components/FooterExcuseGenerator';
import { MemeConfig } from './types/meme';
import { sound } from './utils/audio';
import {
  Flame,
  Coffee,
  CheckCircle2,
  Terminal,
  Laptop,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<MemeConfig>({
    topText: 'Welcome to @workson.my.machine',
    bottomText: "Where if it builds locally, it's ready for production.",
    fontStyle: 'anton',
    fontSize: 1.0,
    textColor: '#FFFFFF',
    strokeColor: '#000000',
    showBadge: true,
    badgeType: 'gold',
    disasterLevel: 4,
    hoodieColor: '#2563eb',
    mugText: 'IT WORKS',
    showDuck: true,
    aspectRatio: '4:3',
    matrixRainSpeed: 1.0,
    particlesCount: 50,
    isDeploying: false,
    strobeSpeed: 1.0,
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [shockwaveActive, setShockwaveActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasInstanceRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasInstanceRef.current = canvas;
  }, []);

  const handleMugClick = () => {
    sound.playCoffeeSlurp();
    showToast('☕ Slurp! Fresh coffee consumed. Zero prod anxiety detected.');
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) {
      sound.playSuccessDing();
    }
  };

  const handleDeployClick = () => {
    sound.playSiren();
    setIsProductionModalOpen(true);
  };

  const handleDeployBlast = () => {
    setShockwaveActive(true);
    setConfig((prev) => ({ ...prev, disasterLevel: 5 }));
    setTimeout(() => setShockwaveActive(false), 2000);
  };

  const handleDownloadImage = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    sound.playSuccessDing();
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `works-on-my-machine-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('📥 Meme downloaded as high-resolution PNG!');
    }, 'image/png');
  };

  const handleCopyImage = async () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          sound.playSuccessDing();
          setIsCopied(true);
          showToast('📋 Image copied directly to clipboard!');
          setTimeout(() => setIsCopied(false), 2500);
        } else {
          handleDownloadImage();
        }
      }, 'image/png');
    } catch {
      handleDownloadImage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-xl font-black">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 font-mono">
                @workson.my.machine
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                localhost:3000 [PASS]
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Where if it builds locally, it's ready for production.
            </p>
          </div>
        </div>

        {/* Quick Actions in Navbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMugClick}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-amber-300 font-semibold flex items-center gap-1.5 transition active:scale-95"
            title="Take a sip of coffee"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sip Coffee</span>
          </button>

          <button
            onClick={() => setIsCertificateOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-400 font-bold flex items-center gap-1.5 transition active:scale-95"
            title="Open immunity certificate"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Immunity Cert</span>
          </button>

          <button
            onClick={handleDeployClick}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-red-900/40 active:scale-95"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Deploy</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Scenario Banner */}
        <div className="bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-red-950/30 border border-amber-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>The Golden Rule of Engineering</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Universal Standard
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                "A 3D character illustration of a developer sitting casually at a desk with feet up, drinking from a giant coffee mug while the server rack violently explodes with cartoon fire, smoke, and green matrix rain."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playCoffeeSlurp();
                setConfig((prev) => ({
                  ...prev,
                  topText: 'Welcome to @workson.my.machine',
                  bottomText: "Where if it builds locally, it's ready for production.",
                  disasterLevel: 4,
                  mugText: 'IT WORKS',
                  fontStyle: 'anton',
                }));
                showToast('✨ Restored original prompt meme specification!');
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold transition"
            >
              Reset to Prompt Default
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <MemeCanvas
              config={config}
              onCanvasReady={handleCanvasReady}
              onMugClick={handleMugClick}
              shockwaveActive={shockwaveActive}
            />

            {/* Canvas Subtitle Bar */}
            <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Pixar 3D Render Engine • 60 FPS
              </span>
              <span>Aspect: {config.aspectRatio}</span>
            </div>
          </div>

          {/* Right Column: Customization & Chaos Controls */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <MemeControls
              config={config}
              onChange={setConfig}
              onDeploy={handleDeployClick}
              onDownload={handleDownloadImage}
              onCopyImage={handleCopyImage}
              onOpenCertificate={() => setIsCertificateOpen(true)}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              isCopied={isCopied}
            />
          </div>
        </div>

        {/* Humorous Dev Quotes & Blame Bar */}
        <section className="mt-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Current Local Status:</span>{' '}
              <span className="text-emerald-400 font-mono font-bold">exit code 0 (clean build)</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                If production is having trouble, please check if AWS has tried turning it off and on again.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
              git blame: <strong className="text-slate-200">someone_else</strong>
            </span>
          </div>
        </section>
      </main>

      {/* Footer with Random Dev Excuse Generator */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/70 pt-8 pb-10 px-4 flex flex-col items-center gap-6">
        <FooterExcuseGenerator
          onApplyToMeme={(excuseText) => {
            setConfig((prev) => ({
              ...prev,
              bottomText: excuseText,
            }));
          }}
          onShowToast={showToast}
        />

        <div className="text-center space-y-1 text-xs text-slate-500 font-mono">
          <p>
            @workson.my.machine — Where if it builds locally, it's ready for production. ☕🔥
          </p>
          <p className="text-[11px] text-slate-600">
            Powered by localhost:3000 • 100% immune to Kubernetes cluster fires
          </p>
        </div>
      </footer>

      {/* Production Deployment Simulator Modal */}
      <ProductionModal
        isOpen={isProductionModalOpen}
        onClose={() => setIsProductionModalOpen(false)}
        onDeployBlast={handleDeployBlast}
      />

      {/* Certificate of Immunity Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
