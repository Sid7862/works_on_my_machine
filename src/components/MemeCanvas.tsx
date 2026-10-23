import React, { useEffect, useRef, useCallback } from 'react';
import { MemeConfig } from '../types/meme';

interface MemeCanvasProps {
  config: MemeConfig;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  onMugClick?: () => void;
  shockwaveActive?: boolean;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({
  config,
  onCanvasReady,
  onMugClick,
  shockwaveActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Persistent particle & matrix state for smooth animation
  const matrixColsRef = useRef<{ y: number; speed: number; chars: string[] }[]>([]);
  const flameParticlesRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[]>([]);
  const sparkParticlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string }[]>([]);
  const smokeParticlesRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Setup matrix columns
  const initMatrix = useCallback((width: number) => {
    const colCount = Math.floor(width / 24);
    const chars = '01{}[]();$!=>/*#NaN404500ERRORgit_push_main_OK_NULL_TRUE_FALSE'.split('');
    const cols = [];
    for (let i = 0; i < colCount; i++) {
      cols.push({
        y: Math.random() * -600,
        speed: 1.5 + Math.random() * 3.5,
        chars: Array.from({ length: 15 }, () => chars[Math.floor(Math.random() * chars.length)]),
      });
    }
    matrixColsRef.current = cols;
  }, []);

  // Get base dimensions based on aspect ratio
  const getCanvasDimensions = useCallback(() => {
    switch (config.aspectRatio) {
      case '1:1':
        return { width: 1080, height: 1080 };
      case '16:9':
        return { width: 1280, height: 720 };
      case '9:16':
        return { width: 720, height: 1280 };
      case '4:3':
      default:
        return { width: 1200, height: 900 };
    }
  }, [config.aspectRatio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    initMatrix(width);
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [config.aspectRatio, getCanvasDimensions, initMatrix, onCanvasReady]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const render = () => {
      if (!isMounted) return;
      const { width, height } = canvas;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const disaster = config.disasterLevel;

      // 1. Dark Studio Room Background
      const bgGrad = ctx.createRadialGradient(
        width * 0.35, height * 0.45, 100,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#111827');
      bgGrad.addColorStop(0.4, '#090d16');
      bgGrad.addColorStop(1, '#020408');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Floor Grid with 3D perspective
      ctx.save();
      const floorY = height * 0.72;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
      ctx.lineWidth = 1;
      for (let y = floorY; y < height; y += 18 + (y - floorY) * 0.35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = -width * 0.2; x < width * 1.2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(width * 0.5 + (x - width * 0.5) * 0.2, floorY);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Green Matrix Rain Effect (Digital Code Cascade)
      ctx.save();
      ctx.font = 'bold 15px "Fira Code", monospace';
      const matrixCols = matrixColsRef.current;
      for (let i = 0; i < matrixCols.length; i++) {
        const col = matrixCols[i];
        const x = i * 24 + 10;
        col.y += col.speed * (0.8 + disaster * 0.3);
        if (col.y > height + 200) {
          col.y = -200 - Math.random() * 200;
        }

        for (let j = 0; j < col.chars.length; j++) {
          const charY = col.y - j * 16;
          if (charY > -20 && charY < height + 20) {
            if (j === 0) {
              ctx.fillStyle = '#86efac';
              ctx.shadowColor = '#22c55e';
              ctx.shadowBlur = 8;
            } else {
              const alpha = Math.max(0.05, (1 - j / col.chars.length) * 0.45);
              ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
              ctx.shadowBlur = 0;
            }
            ctx.fillText(col.chars[j], x, charY);
          }
        }
      }
      ctx.restore();

      // 3. The Exploding Server Rack (Background Left-Center)
      const rackX = width * 0.22;
      const rackY = height * 0.22;
      const rackW = width * 0.28;
      const rackH = height * 0.52;

      // Volumetric Glow from the Server Explosion
      const blastGlow = ctx.createRadialGradient(
        rackX + rackW * 0.5, rackY + rackH * 0.4, 30,
        rackX + rackW * 0.5, rackY + rackH * 0.4, rackW * (1.2 + disaster * 0.4)
      );
      blastGlow.addColorStop(0, `rgba(255, 120, 0, ${0.4 + disaster * 0.12})`);
      blastGlow.addColorStop(0.5, `rgba(220, 38, 38, ${0.25 + disaster * 0.08})`);
      blastGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = blastGlow;
      ctx.fillRect(0, 0, width, height);

      // Server Cabinet Frame (Dell/Supermicro Enterprise Chassis)
      ctx.save();
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 25;
      const cabinetGrad = ctx.createLinearGradient(rackX, rackY, rackX + rackW, rackY);
      cabinetGrad.addColorStop(0, '#1e293b');
      cabinetGrad.addColorStop(0.5, '#0f172a');
      cabinetGrad.addColorStop(1, '#020617');
      ctx.fillStyle = cabinetGrad;
      ctx.fillRect(rackX, rackY, rackW, rackH);

      // Cabinet metallic border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.strokeRect(rackX, rackY, rackW, rackH);

      // Server Blades / Shelves (U-units)
      const uCount = 12;
      const uHeight = rackH / uCount;
      for (let u = 0; u < uCount; u++) {
        const sy = rackY + u * uHeight;
        // Blade faceplate
        ctx.fillStyle = u % 2 === 0 ? '#111827' : '#1f2937';
        ctx.fillRect(rackX + 8, sy + 3, rackW - 16, uHeight - 6);

        // Server rack screw points & ventilation hex grid
        ctx.fillStyle = '#475569';
        ctx.fillRect(rackX + 12, sy + uHeight * 0.4, 4, 4);
        ctx.fillRect(rackX + rackW - 16, sy + uHeight * 0.4, 4, 4);

        // Blinking Status LEDs (Green, Yellow, Flashing Red error)
        for (let led = 0; led < 6; led++) {
          const ledX = rackX + 24 + led * 14;
          const isFailing = disaster >= 3 && (u > 3 && u < 10);
          const isOff = Math.sin(elapsed * 8 + u * 2 + led) > 0.4;
          let ledColor = '#22c55e';
          if (isFailing) {
            ledColor = isOff ? '#ef4444' : '#7f1d1d';
          } else if (u % 3 === 0) {
            ledColor = '#eab308';
          }
          ctx.beginPath();
          ctx.arc(ledX, sy + uHeight * 0.5, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = ledColor;
          ctx.fill();
        }

        // Server blade handles
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rackX + rackW - 55, sy + uHeight * 0.3);
        ctx.lineTo(rackX + rackW - 35, sy + uHeight * 0.3);
        ctx.stroke();
      }

      // Blown-open, tilted cabinet door with dangling cables
      ctx.save();
      ctx.translate(rackX + rackW, rackY + rackH * 0.1);
      ctx.rotate(0.35 + Math.sin(elapsed * 2) * 0.04);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.fillRect(0, 0, rackW * 0.45, rackH * 0.8);
      ctx.strokeRect(0, 0, rackW * 0.45, rackH * 0.8);
      // Perforated mesh on door
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, 12, rackW * 0.45 - 16, rackH * 0.8 - 24);
      ctx.restore();

      // Ruptured dangling cables (sparking)
      const cables = [
        { sx: rackX + rackW * 0.3, sy: rackY + rackH * 0.4, ex: rackX - 20, ey: rackY + rackH * 0.8, color: '#3b82f6' },
        { sx: rackX + rackW * 0.6, sy: rackY + rackH * 0.5, ex: rackX + rackW + 30, ey: rackY + rackH * 0.9, color: '#ef4444' },
        { sx: rackX + rackW * 0.45, sy: rackY + rackH * 0.3, ex: rackX + rackW * 0.5, ey: rackY + rackH * 0.95, color: '#eab308' },
      ];
      cables.forEach((c) => {
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c.sx, c.sy);
        ctx.bezierCurveTo(
          c.sx + Math.sin(elapsed * 4) * 15, c.sy + (c.ey - c.sy) * 0.5,
          c.ex - 20, c.ey - 20,
          c.ex, c.ey
        );
        ctx.stroke();
      });

      // Flashing Emergency Siren Beacon on top of server rack
      const beaconX = rackX + rackW * 0.5;
      const beaconY = rackY - 14;
      const strobeAngle = elapsed * 10 * config.strobeSpeed;
      // Beacon base
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(beaconX - 16, beaconY + 6, 32, 10);
      // Beacon dome
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(beaconX, beaconY + 6, 14, Math.PI, 0);
      ctx.fill();
      // Volumetric rotating light beam
      if (disaster >= 2) {
        ctx.save();
        ctx.translate(beaconX, beaconY);
        ctx.rotate(strobeAngle);
        const lightCone = ctx.createRadialGradient(0, 0, 5, 0, 0, width * 0.6);
        lightCone.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
        lightCone.addColorStop(0.3, 'rgba(239, 68, 68, 0.18)');
        lightCone.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = lightCone;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, width * 0.6, -0.4, 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // 4. Cartoon Fire & Smoke Plumes (Violent server explosion)
      // Dynamic Flame Tongues
      const flameOrigins = [
        { x: rackX + rackW * 0.2, y: rackY + rackH * 0.7, scale: 0.9 + disaster * 0.25 },
        { x: rackX + rackW * 0.5, y: rackY + rackH * 0.45, scale: 1.2 + disaster * 0.35 },
        { x: rackX + rackW * 0.8, y: rackY + rackH * 0.6, scale: 0.85 + disaster * 0.25 },
        { x: rackX + rackW * 0.35, y: rackY + rackH * 0.25, scale: 1.1 + disaster * 0.4 },
        { x: rackX + rackW * 0.65, y: rackY + rackH * 0.15, scale: 1.0 + disaster * 0.3 },
      ];

      flameOrigins.forEach((flame, fIdx) => {
        const timeOffset = elapsed * 6 + fIdx * 1.5;
        const wave1 = Math.sin(timeOffset) * 18 * flame.scale;
        const wave2 = Math.cos(timeOffset * 1.3) * 15 * flame.scale;
        const flameHeight = (90 + Math.sin(timeOffset * 2) * 25) * flame.scale * (disaster / 3);

        ctx.save();
        ctx.translate(flame.x, flame.y);

        // Layer 1: Crimson / Dark Orange Outer Flame
        ctx.beginPath();
        ctx.moveTo(-35 * flame.scale, 0);
        ctx.quadraticCurveTo(-20 * flame.scale + wave1, -flameHeight * 0.5, 0 + wave2, -flameHeight * 1.2);
        ctx.quadraticCurveTo(20 * flame.scale - wave1, -flameHeight * 0.5, 35 * flame.scale, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(220, 38, 38, 0.85)';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 30;
        ctx.fill();

        // Layer 2: Vibrant Orange Body
        ctx.beginPath();
        ctx.moveTo(-22 * flame.scale, 0);
        ctx.quadraticCurveTo(-12 * flame.scale + wave2, -flameHeight * 0.45, 0 + wave1 * 0.7, -flameHeight * 0.95);
        ctx.quadraticCurveTo(12 * flame.scale - wave2, -flameHeight * 0.45, 22 * flame.scale, 0);
        ctx.closePath();
        ctx.fillStyle = '#f97316';
        ctx.fill();

        // Layer 3: Blazing Yellow Pixar Core
        ctx.beginPath();
        ctx.moveTo(-12 * flame.scale, 0);
        ctx.quadraticCurveTo(-6 * flame.scale, -flameHeight * 0.3, 0 + wave1 * 0.4, -flameHeight * 0.6);
        ctx.quadraticCurveTo(6 * flame.scale, -flameHeight * 0.3, 12 * flame.scale, 0);
        ctx.closePath();
        ctx.fillStyle = '#fef08a';
        ctx.fill();

        ctx.restore();
      });

      // Smoke Puffs (Billowing upward with cartoon roundness)
      if (Math.random() < 0.25 * disaster) {
        smokeParticlesRef.current.push({
          x: rackX + Math.random() * rackW,
          y: rackY + rackH * 0.3,
          vx: (Math.random() - 0.4) * 2,
          vy: -2 - Math.random() * 3,
          size: 25 + Math.random() * 30,
          alpha: 0.7,
        });
      }

      for (let s = smokeParticlesRef.current.length - 1; s >= 0; s--) {
        const p = smokeParticlesRef.current[s];
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.8;
        p.alpha -= 0.008;

        if (p.alpha <= 0 || p.y < -50) {
          smokeParticlesRef.current.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = `rgba(30, 41, 59, ${p.alpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.arc(p.x + p.size * 0.4, p.y - p.size * 0.2, p.size * 0.8, 0, Math.PI * 2);
        ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.15, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Flying Sparks & Embers
      if (Math.random() < 0.4 * disaster) {
        sparkParticlesRef.current.push({
          x: rackX + Math.random() * rackW,
          y: rackY + Math.random() * rackH,
          vx: (Math.random() - 0.4) * 8 * (disaster / 2),
          vy: -4 - Math.random() * 8,
          life: 0,
          maxLife: 20 + Math.random() * 30,
          color: Math.random() > 0.3 ? '#fde047' : '#f97316',
        });
      }

      for (let sp = sparkParticlesRef.current.length - 1; sp >= 0; sp--) {
        const spark = sparkParticlesRef.current[sp];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.2; // gravity
        spark.life++;

        if (spark.life > spark.maxLife) {
          sparkParticlesRef.current.splice(sp, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = spark.color;
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(spark.x, spark.y, 3, 3);
        ctx.restore();
      }

      // 5. The Desk & Developer Character (Foreground Right/Center)
      // Perspective Wooden/Matte Desk Surface
      const deskY = height * 0.62;
      const deskLeft = width * 0.25;
      const deskRight = width * 0.98;
      const deskDepth = height * 0.32;

      ctx.save();
      // Desk Drop Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 25;

      // Desk Top Plate
      const deskGrad = ctx.createLinearGradient(deskLeft, deskY, deskRight, deskY + deskDepth);
      deskGrad.addColorStop(0, '#1e293b');
      deskGrad.addColorStop(0.35, '#334155');
      deskGrad.addColorStop(0.8, '#1e293b');
      deskGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = deskGrad;

      ctx.beginPath();
      ctx.moveTo(deskLeft + 50, deskY);
      ctx.lineTo(deskRight, deskY);
      ctx.lineTo(deskRight, deskY + deskDepth);
      ctx.lineTo(deskLeft - 40, deskY + deskDepth);
      ctx.closePath();
      ctx.fill();

      // Desk Front Edge Bevel
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(deskLeft - 40, deskY + deskDepth, deskRight - (deskLeft - 40), 16);

      // Desk Steel Legs
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(deskLeft + 30, deskY + deskDepth + 16, 18, height - (deskY + deskDepth + 16));
      ctx.fillRect(deskRight - 60, deskY + deskDepth + 16, 18, height - (deskY + deskDepth + 16));

      // Desk Warm Orange Backlight Reflection from Fire
      const deskFireReflect = ctx.createRadialGradient(
        rackX + rackW * 0.5, deskY, 40,
        deskLeft + 120, deskY + 60, 260
      );
      deskFireReflect.addColorStop(0, `rgba(249, 115, 22, ${0.45 * (disaster / 3)})`);
      deskFireReflect.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = deskFireReflect;
      ctx.beginPath();
      ctx.moveTo(deskLeft + 50, deskY);
      ctx.lineTo(deskRight, deskY);
      ctx.lineTo(deskRight, deskY + deskDepth);
      ctx.lineTo(deskLeft - 40, deskY + deskDepth);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 6. Desk Props: Open Laptop with Green Code & Rubber Ducky
      // Open Laptop
      const lapX = width * 0.44;
      const lapY = deskY + 25;
      const lapW = 135;
      const lapH = 95;

      ctx.save();
      // Laptop Base
      ctx.fillStyle = '#475569';
      ctx.fillRect(lapX - 10, lapY + lapH - 12, lapW + 20, 10);
      ctx.fillStyle = '#334155';
      ctx.fillRect(lapX - 6, lapY + lapH - 10, lapW + 12, 6);

      // Laptop Screen (Tilted Up)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(lapX, lapY + lapH - 12);
      ctx.lineTo(lapX + lapW, lapY + lapH - 12);
      ctx.lineTo(lapX + lapW - 12, lapY);
      ctx.lineTo(lapX + 12, lapY);
      ctx.closePath();
      ctx.fill();

      // Glowing Green Terminal Display
      ctx.fillStyle = '#052e16';
      ctx.fillRect(lapX + 16, lapY + 5, lapW - 32, lapH - 22);

      // Screen glow onto keyboard
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 7px "Fira Code", monospace';
      ctx.fillText('> npm run test:all', lapX + 20, lapY + 18);
      ctx.fillText('PASS [localhost:3000]', lapX + 20, lapY + 30);
      ctx.fillText('0 errors, 100% tests OK', lapX + 20, lapY + 42);
      ctx.fillStyle = '#facc15';
      ctx.fillText('Status: Ready for Prod', lapX + 20, lapY + 54);
      ctx.shadowBlur = 0;

      // Laptop Stickers on outer bezel
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(lapX + lapW - 22, lapY + 18, 5, 0, Math.PI * 2);
      ctx.fill(); // docker sticker
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(lapX + 20, lapY + lapH - 20, 8, 5); // git sticker
      ctx.restore();

      // Cute Rubber Duck on Desk (Wearing Mini Dev Glasses)
      if (config.showDuck) {
        const duckX = width * 0.38;
        const duckY = deskY + 65;
        ctx.save();
        // Duck Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(duckX, duckY + 14, 18, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Duck Body
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(duckX, duckY + 4, 16, 12, -0.1, 0, Math.PI * 2);
        ctx.fill();

        // Duck Head
        ctx.beginPath();
        ctx.arc(duckX - 8, duckY - 8, 10, 0, Math.PI * 2);
        ctx.fill();

        // Duck Beak
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(duckX - 16, duckY - 6);
        ctx.lineTo(duckX - 25, duckY - 7);
        ctx.lineTo(duckX - 16, duckY - 3);
        ctx.closePath();
        ctx.fill();

        // Mini Glasses
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(duckX - 12, duckY - 8, 3.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(duckX - 8, duckY - 8);
        ctx.lineTo(duckX - 4, duckY - 7);
        ctx.stroke();
        ctx.restore();
      }

      // 7. The Developer Character (Pixar 3D Stylized)
      // Sitting relaxed in chair, feet propped up on desk corner
      const devCenterX = width * 0.72;
      const devCenterY = height * 0.54;

      ctx.save();

      // Ergonomic Mesh Chair Backrest (Behind developer)
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(devCenterX - 20, devCenterY - 40, 55, 95, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Chair Headrest
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.roundRect(devCenterX - 45, devCenterY - 160, 50, 32, 10);
      ctx.fill();
      ctx.stroke();

      // Developer Crossed Legs Propped Up on Desk!
      // Left leg (resting on desk)
      const legDeskX = width * 0.48;
      const legDeskY = deskY + 12;

      // Pants / Jeans (Deep Denim Blue)
      ctx.fillStyle = '#1e3a8a';
      ctx.strokeStyle = '#172554';
      ctx.lineWidth = 3;

      // Leg 1 (Upper thigh to knee)
      ctx.beginPath();
      ctx.moveTo(devCenterX - 40, devCenterY + 45);
      ctx.quadraticCurveTo(devCenterX - 110, devCenterY + 5, legDeskX + 60, legDeskY + 25);
      ctx.lineTo(legDeskX + 75, legDeskY + 8);
      ctx.quadraticCurveTo(devCenterX - 90, devCenterY - 10, devCenterX - 25, devCenterY + 25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Leg 2 (Crossed ankle over ankle)
      ctx.beginPath();
      ctx.moveTo(devCenterX - 35, devCenterY + 50);
      ctx.quadraticCurveTo(devCenterX - 100, devCenterY + 25, legDeskX + 25, legDeskY - 8);
      ctx.lineTo(legDeskX + 45, legDeskY - 22);
      ctx.quadraticCurveTo(devCenterX - 80, devCenterY + 5, devCenterX - 20, devCenterY + 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pixar Style Sneakers / Kicks (Red & White High-Tops)
      // Sneaker 1 (Top crossed foot)
      ctx.save();
      ctx.translate(legDeskX + 15, legDeskY - 22);
      ctx.rotate(-0.25);
      // White Rubber Sole
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-5, 14, 52, 9, 4);
      ctx.fill();
      // Red Upper Shoe Body
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-4, 14);
      ctx.lineTo(44, 14);
      ctx.lineTo(36, -2);
      ctx.lineTo(10, -14);
      ctx.lineTo(-4, -10);
      ctx.closePath();
      ctx.fill();
      // White Toe Cap
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(40, 10, 8, 0, Math.PI * 2);
      ctx.fill();
      // White laces
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, -6); ctx.lineTo(24, -2);
      ctx.moveTo(16, -1); ctx.lineTo(26, 3);
      ctx.stroke();
      ctx.restore();

      // Sneaker 2 (Bottom foot resting on desk)
      ctx.save();
      ctx.translate(legDeskX + 48, legDeskY + 6);
      ctx.rotate(-0.15);
      // Sole
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-5, 12, 48, 8, 4);
      ctx.fill();
      // Upper
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-4, 12);
      ctx.lineTo(40, 12);
      ctx.lineTo(32, -2);
      ctx.lineTo(8, -12);
      ctx.lineTo(-4, -8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Developer Torso & Cozy Hoodie
      const hoodieColor = config.hoodieColor || '#3b82f6';
      ctx.fillStyle = hoodieColor;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;

      // Torso leaning back in chair
      ctx.beginPath();
      ctx.moveTo(devCenterX - 55, devCenterY + 40);
      ctx.quadraticCurveTo(devCenterX - 75, devCenterY - 45, devCenterX - 45, devCenterY - 95);
      ctx.quadraticCurveTo(devCenterX, devCenterY - 110, devCenterX + 45, devCenterY - 90);
      ctx.quadraticCurveTo(devCenterX + 60, devCenterY - 30, devCenterX + 45, devCenterY + 40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Warm Fire Rim-Light on Developer's Back & Left Shoulder!
      const devRimGlow = ctx.createLinearGradient(devCenterX - 75, devCenterY, devCenterX - 20, devCenterY);
      devRimGlow.addColorStop(0, `rgba(249, 115, 22, ${0.75 * (disaster / 3)})`);
      devRimGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = devRimGlow;
      ctx.beginPath();
      ctx.moveTo(devCenterX - 55, devCenterY + 40);
      ctx.quadraticCurveTo(devCenterX - 75, devCenterY - 45, devCenterX - 45, devCenterY - 95);
      ctx.lineTo(devCenterX - 25, devCenterY - 90);
      ctx.quadraticCurveTo(devCenterX - 45, devCenterY - 30, devCenterX - 35, devCenterY + 40);
      ctx.closePath();
      ctx.fill();

      // Hoodie Pocket & Seams
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(devCenterX - 35, devCenterY - 15, 65, 38, 8);
      ctx.stroke();

      // Hoodie Strings
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(devCenterX - 18, devCenterY - 75);
      ctx.quadraticCurveTo(devCenterX - 22, devCenterY - 45, devCenterX - 16, devCenterY - 30);
      ctx.moveTo(devCenterX + 8, devCenterY - 75);
      ctx.quadraticCurveTo(devCenterX + 12, devCenterY - 45, devCenterX + 6, devCenterY - 28);
      ctx.stroke();

      // Over-Ear Studio Headphones around Neck (White/Silver)
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(devCenterX - 5, devCenterY - 92, 38, 0.2, Math.PI - 0.2);
      ctx.stroke();
      // Headphone earcups
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(devCenterX - 48, devCenterY - 96, 16, 26, 6);
      ctx.roundRect(devCenterX + 24, devCenterY - 94, 16, 26, 6);
      ctx.fill();
      ctx.stroke();

      // Neck & Pixar Head
      const headX = devCenterX - 5;
      const headY = devCenterY - 140;

      // Neck
      ctx.fillStyle = '#fbcfe8'; // warm peachy skin tone base
      ctx.fillRect(headX - 14, headY + 22, 28, 26);

      // Head Base (Rounded friendly Pixar shape)
      const skinGrad = ctx.createRadialGradient(headX - 10, headY - 10, 10, headX, headY, 48);
      skinGrad.addColorStop(0, '#fed7aa'); // warm highlight
      skinGrad.addColorStop(0.7, '#fdba74'); // soft skin tone
      skinGrad.addColorStop(1, '#f97316'); // subtle rim shadow
      ctx.fillStyle = skinGrad;

      ctx.beginPath();
      ctx.ellipse(headX, headY, 42, 46, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pixar Ears
      ctx.beginPath();
      ctx.arc(headX - 42, headY + 2, 11, 0, Math.PI * 2);
      ctx.arc(headX + 42, headY + 2, 11, 0, Math.PI * 2);
      ctx.fill();

      // Peaceful, Zen, Unbothered Face:
      // Half-closed happy smiling eyes (The developer is totally relaxed!)
      ctx.strokeStyle = '#431407';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';

      // Left eye curved arc (Happy zen)
      ctx.beginPath();
      ctx.arc(headX - 18, headY - 4, 10, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();

      // Right eye curved arc (Happy zen)
      ctx.beginPath();
      ctx.arc(headX + 16, headY - 4, 10, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();

      // Eyebrows (Relaxed, unconcerned arch)
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(headX - 18, headY - 18, 14, Math.PI * 1.15, Math.PI * 1.75);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(headX + 16, headY - 18, 14, Math.PI * 1.25, Math.PI * 1.85);
      ctx.stroke();

      // Cute Pixar Button Nose
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(headX - 1, headY + 8, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Calm, Confident, Content Smile
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(headX - 1, headY + 12, 16, 0.25, Math.PI - 0.25);
      ctx.stroke();

      // Rosy cheeks (Warm cartoon blush)
      ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      ctx.beginPath();
      ctx.arc(headX - 24, headY + 14, 9, 0, Math.PI * 2);
      ctx.arc(headX + 22, headY + 14, 9, 0, Math.PI * 2);
      ctx.fill();

      // 3D Sculpted Messy Developer Hair (Pixar/Disney 3D locks)
      ctx.fillStyle = '#451a03'; // deep rich brown
      ctx.beginPath();
      // Main hair volume
      ctx.arc(headX, headY - 20, 46, Math.PI, 0);
      ctx.quadraticCurveTo(headX + 50, headY - 40, headX + 38, headY - 58);
      ctx.quadraticCurveTo(headX + 15, headY - 65, headX - 5, headY - 60);
      ctx.quadraticCurveTo(headX - 30, headY - 68, headX - 44, headY - 45);
      ctx.quadraticCurveTo(headX - 54, headY - 20, headX - 46, headY);
      ctx.closePath();
      ctx.fill();

      // Front hair tufts / bangs
      ctx.beginPath();
      ctx.moveTo(headX - 38, headY - 28);
      ctx.quadraticCurveTo(headX - 22, headY - 10, headX - 12, headY - 22);
      ctx.quadraticCurveTo(headX + 6, headY - 8, headX + 18, headY - 20);
      ctx.quadraticCurveTo(headX + 35, headY - 12, headX + 42, headY - 26);
      ctx.closePath();
      ctx.fill();

      // 8. THE GIANT COFFEE MUG & ARMS (Held casually near chest/mouth)
      // Arms wrapped around mug
      const mugCenterX = headX - 12;
      const mugCenterY = devCenterY - 45;
      const mugW = 90;
      const mugH = 80;

      // Developer Arms (Hoodie sleeves)
      ctx.fillStyle = hoodieColor;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;

      // Left Arm coming up to hold mug
      ctx.beginPath();
      ctx.moveTo(devCenterX - 52, devCenterY - 40);
      ctx.quadraticCurveTo(devCenterX - 75, devCenterY - 10, mugCenterX - mugW * 0.45, mugCenterY + 10);
      ctx.lineTo(mugCenterX - mugW * 0.45, mugCenterY - 15);
      ctx.quadraticCurveTo(devCenterX - 60, devCenterY - 35, devCenterX - 45, devCenterY - 65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Arm coming up to hold mug
      ctx.beginPath();
      ctx.moveTo(devCenterX + 45, devCenterY - 40);
      ctx.quadraticCurveTo(devCenterX + 60, devCenterY - 10, mugCenterX + mugW * 0.45, mugCenterY + 10);
      ctx.lineTo(mugCenterX + mugW * 0.45, mugCenterY - 15);
      ctx.quadraticCurveTo(devCenterX + 45, devCenterY - 35, devCenterX + 35, devCenterY - 65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hands (Holding sides of mug)
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.roundRect(mugCenterX - mugW * 0.5 - 6, mugCenterY - 15, 14, 30, 7);
      ctx.roundRect(mugCenterX + mugW * 0.5 - 8, mugCenterY - 15, 14, 30, 7);
      ctx.fill();
      ctx.stroke();

      // Giant Ceramic Coffee Mug Body
      const mugGrad = ctx.createLinearGradient(
        mugCenterX - mugW * 0.5, mugCenterY,
        mugCenterX + mugW * 0.5, mugCenterY
      );
      mugGrad.addColorStop(0, '#f8fafc');
      mugGrad.addColorStop(0.3, '#ffffff');
      mugGrad.addColorStop(0.8, '#e2e8f0');
      mugGrad.addColorStop(1, '#cbd5e1');

      ctx.save();
      // Mug Drop Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;

      // Mug Outer Body (Slightly tapered cylinder)
      ctx.fillStyle = mugGrad;
      ctx.beginPath();
      ctx.moveTo(mugCenterX - mugW * 0.45, mugCenterY - mugH * 0.5);
      ctx.lineTo(mugCenterX + mugW * 0.45, mugCenterY - mugH * 0.5);
      ctx.quadraticCurveTo(mugCenterX + mugW * 0.5, mugCenterY + mugH * 0.5, mugCenterX + mugW * 0.4, mugCenterY + mugH * 0.5);
      ctx.lineTo(mugCenterX - mugW * 0.4, mugCenterY + mugH * 0.5);
      ctx.quadraticCurveTo(mugCenterX - mugW * 0.5, mugCenterY + mugH * 0.5, mugCenterX - mugW * 0.45, mugCenterY - mugH * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Giant Mug Handle (Cartoon chunky handle)
      ctx.beginPath();
      ctx.arc(mugCenterX + mugW * 0.5 + 14, mugCenterY, 20, Math.PI * 1.5, Math.PI * 0.5);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mug Top Opening Ellipse with Steaming Dark Roast Coffee
      ctx.fillStyle = '#26170d'; // rich dark coffee
      ctx.beginPath();
      ctx.ellipse(mugCenterX, mugCenterY - mugH * 0.5, mugW * 0.44, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Golden Crema foam swirl in coffee
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(mugCenterX - 4, mugCenterY - mugH * 0.5 + 2, mugW * 0.28, 7, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Text Printed on Mug (e.g. "IT WORKS", "PROD CAN WAIT")
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 13px "Anton", "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.mugText.toUpperCase(), mugCenterX, mugCenterY + 4);
      ctx.restore();

      // Rising Animated Steam Coils from the giant mug
      ctx.save();
      for (let st = 0; st < 3; st++) {
        const steamPhase = elapsed * 2.5 + st * 1.8;
        const steamX = mugCenterX + (st - 1) * 16 + Math.sin(steamPhase) * 10;
        const steamY = mugCenterY - mugH * 0.5 - 15 - (steamPhase % 4) * 22;
        const steamAlpha = Math.max(0, 0.65 - ((steamPhase % 4) / 4));

        ctx.strokeStyle = `rgba(255, 255, 255, ${steamAlpha})`;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(steamX, steamY);
        ctx.bezierCurveTo(
          steamX - 8, steamY - 14,
          steamX + 8, steamY - 26,
          steamX, steamY - 40
        );
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore(); // Restore developer & chair

      // 9. Shockwave Overlay (If Deploying / Explosion Triggered)
      if (shockwaveActive || config.isDeploying) {
        ctx.save();
        const shockRadius = ((elapsed * 1000) % 1500) / 1500 * width * 0.9;
        ctx.beginPath();
        ctx.arc(rackX + rackW * 0.5, rackY + rackH * 0.4, shockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 146, 60, ${1 - shockRadius / (width * 0.9)})`;
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();
      }

      // 10. TEXT OVERLAYS ON IMAGE (As specified in prompt)
      // Top: "Welcome to @workson.my.machine"
      // Bottom: "Where if it builds locally, it's ready for production."
      ctx.save();
      const baseScale = config.fontSize || 1.0;

      // Font Family selection
      let fontFamily = '"Anton", "Impact", sans-serif';
      if (config.fontStyle === 'impact') fontFamily = '"Impact", "Anton", sans-serif';
      if (config.fontStyle === 'bebas') fontFamily = '"Bebas Neue", sans-serif';
      if (config.fontStyle === 'fira') fontFamily = '"Fira Code", monospace';
      if (config.fontStyle === 'inter') fontFamily = '"Inter", sans-serif';

      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Function to render punchy meme text with bold outline & drop shadow
      const drawMemeText = (
        text: string,
        y: number,
        fontSizePx: number,
        isBottom: boolean = false
      ) => {
        if (!text) return;
        ctx.font = `900 ${fontSizePx}px ${fontFamily}`;
        const maxTextWidth = width * 0.92;
        
        // Wrap or scale down if too long
        let measuredWidth = ctx.measureText(text).width;
        let actualSize = fontSizePx;
        if (measuredWidth > maxTextWidth) {
          actualSize = Math.floor(fontSizePx * (maxTextWidth / measuredWidth));
          ctx.font = `900 ${actualSize}px ${fontFamily}`;
        }

        const textX = width * 0.5;

        // Shadow & Outline
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;

        // Heavy dark drop shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 6;

        // Black stroke outline for classic high-contrast meme readability
        ctx.strokeStyle = config.strokeColor || '#000000';
        ctx.lineWidth = Math.max(6, actualSize * 0.16);
        ctx.strokeText(text, textX, y);

        // Fill color
        ctx.fillStyle = config.textColor || '#FFFFFF';
        ctx.fillText(text, textX, y);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      };

      // Top Text
      const topFontSize = Math.floor(width * 0.046 * baseScale);
      const topY = height * 0.055;
      drawMemeText(config.topText, topY, topFontSize, false);

      // Bottom Text
      const bottomFontSize = Math.floor(width * 0.042 * baseScale);
      const bottomY = height * 0.88 - (bottomFontSize * 0.5);
      drawMemeText(config.bottomText, bottomY, bottomFontSize, true);

      // 11. "CERTIFIED WORKS ON MY MACHINE" Stamp / Badge
      if (config.showBadge) {
        const badgeRadius = Math.min(width, height) * 0.078;
        const badgeX = width * 0.88;
        const badgeY = height * 0.16;

        ctx.save();
        ctx.translate(badgeX, badgeY);
        ctx.rotate(-0.18); // slight playful tilt

        // Gold Seal Sunburst / Starburst teeth
        ctx.fillStyle = config.badgeType === 'danger' ? '#ef4444' : '#eab308';
        ctx.shadowColor = config.badgeType === 'danger' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(234, 179, 8, 0.6)';
        ctx.shadowBlur = 14;

        const points = 24;
        ctx.beginPath();
        for (let p = 0; p < points * 2; p++) {
          const r = p % 2 === 0 ? badgeRadius : badgeRadius * 0.86;
          const a = (p / (points * 2)) * Math.PI * 2;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Inner circle
        ctx.fillStyle = config.badgeType === 'danger' ? '#991b1b' : '#ca8a04';
        ctx.beginPath();
        ctx.arc(0, 0, badgeRadius * 0.78, 0, Math.PI * 2);
        ctx.fill();

        // Inner border dashed
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(0, 0, badgeRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Badge Text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${Math.floor(badgeRadius * 0.22)}px "Anton", sans-serif`;
        ctx.fillText('CERTIFIED', 0, -badgeRadius * 0.35);
        ctx.font = `900 ${Math.floor(badgeRadius * 0.24)}px "Anton", sans-serif`;
        ctx.fillText('WORKS ON', 0, -badgeRadius * 0.08);
        ctx.fillText('MY MACHINE', 0, badgeRadius * 0.2);
        ctx.font = `700 ${Math.floor(badgeRadius * 0.15)}px monospace`;
        ctx.fillStyle = '#fef08a';
        ctx.fillText('★ 100% LOCAL ★', 0, badgeRadius * 0.44);

        ctx.restore();
      }

      ctx.restore(); // Restore text

      // Next frame
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [config, getCanvasDimensions, shockwaveActive]);

  return (
    <div className="relative group w-full flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      <canvas
        ref={canvasRef}
        onClick={onMugClick}
        className="w-full h-auto max-h-[72vh] object-contain cursor-pointer select-none rounded-2xl transition-transform duration-200"
        title="Click developer's coffee mug to take a sip!"
      />

      {/* Floating interactive tooltip hint */}
      <div className="absolute bottom-3 right-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-amber-300 flex items-center gap-1.5 shadow-lg">
        <span>☕ Click coffee mug to sip</span>
      </div>
    </div>
  );
};
