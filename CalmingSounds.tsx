import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalmingSoundsProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

type SoundId = 'ocean' | 'rain' | 'forest' | 'bowl' | 'pink';

interface Sound {
  id: SoundId;
  label: string;
  emoji: string;
  description: string;
  color: string;
  bg: string;
}

const SOUNDS: Sound[] = [
  { id: 'ocean', label: 'Oceano', emoji: '🌊', description: 'Ondas lentas que acalmam o sistema nervoso', color: '#0891b2', bg: '#ecfeff' },
  { id: 'rain', label: 'Chuva Suave', emoji: '🌧️', description: 'Gotas irregulares que distraem pensamentos acelerados', color: '#6366f1', bg: '#eef2ff' },
  { id: 'forest', label: 'Floresta', emoji: '🌿', description: 'Ambiente natural com pássaros e folhas ao vento', color: '#16a34a', bg: '#f0fdf4' },
  { id: 'bowl', label: 'Tigela Tibetana', emoji: '🔔', description: 'Ressonância harmônica para meditação profunda', color: '#b388c4', bg: '#faf5ff' },
  { id: 'pink', label: 'Ruído Rosa', emoji: '🎚️', description: 'Mascaramento suave de sons perturbadores', color: '#f59e0b', bg: '#fffbeb' },
];

function startOcean(ctx: AudioContext): (() => void) {
  const srcs: AudioBufferSourceNode[] = [];
  const oscs: OscillatorNode[] = [];
  const others: AudioNode[] = [];

  [0.08, 0.12, 0.17].forEach((rate, i) => {
    const bufSize = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
    for (let k = 0; k < bufSize; k++) {
      const wh = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + wh * 0.0555179;
      b1 = 0.99332 * b1 + wh * 0.0750759;
      b2 = 0.96900 * b2 + wh * 0.1538520;
      b3 = 0.86650 * b3 + wh * 0.3104856;
      b4 = 0.55000 * b4 + wh * 0.5329522;
      b5 = -0.7616 * b5 - wh * 0.0168980;
      data[k] = (b0 + b1 + b2 + b3 + b4 + b5 + wh * 0.5362) * 0.18;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    src.loopStart = 0; src.loopEnd = bufSize / ctx.sampleRate;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 320 + i * 80; filter.Q.value = 0.7;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = rate; lfoGain.gain.value = 0.1;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.08;

    const panner = ctx.createStereoPanner();
    panner.pan.value = (i - 1) * 0.3;

    lfo.connect(lfoGain); lfoGain.connect(masterGain.gain);
    src.connect(filter); filter.connect(masterGain); masterGain.connect(panner); panner.connect(ctx.destination);

    lfo.start(); src.start(0, Math.random() * 2);
    srcs.push(src); oscs.push(lfo);
    others.push(filter, masterGain, panner, lfoGain);
  });

  return () => {
    srcs.forEach(s => { try { s.stop(); s.disconnect(); } catch {} });
    oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch {} });
    others.forEach(n => { try { n.disconnect(); } catch {} });
  };
}

function startRain(ctx: AudioContext): (() => void) {
  let active = true;
  const srcs: AudioNode[] = [];

  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  }

  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;

  const hi = ctx.createBiquadFilter();
  hi.type = 'highpass'; hi.frequency.value = 2200; hi.Q.value = 0.5;

  const lo = ctx.createBiquadFilter();
  lo.type = 'lowpass'; lo.frequency.value = 7000;

  const gain = ctx.createGain();
  gain.gain.value = 0.3;

  src.connect(hi); hi.connect(lo); lo.connect(gain); gain.connect(ctx.destination);
  src.start();
  srcs.push(src, hi, lo, gain);

  const scheduleDrop = () => {
    if (!active) return;
    const delay = 0.15 + Math.random() * 1.0;
    const dropBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    const d = dropBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    const dropSrc = ctx.createBufferSource();
    dropSrc.buffer = dropBuf;

    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 600 + Math.random() * 1400; f.Q.value = 2.5;

    const g = ctx.createGain();
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(0.5 + Math.random() * 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    const pan = ctx.createStereoPanner();
    pan.pan.value = (Math.random() - 0.5) * 1.8;

    dropSrc.connect(f); f.connect(g); g.connect(pan); pan.connect(ctx.destination);
    dropSrc.start(t);
    setTimeout(scheduleDrop, delay * 1000);
  };
  scheduleDrop();

  return () => {
    active = false;
    srcs.forEach(n => { try { (n as any).stop?.(); n.disconnect(); } catch {} });
  };
}

function startForest(ctx: AudioContext): (() => void) {
  let active = true;
  const srcs: AudioNode[] = [];

  const bufSize = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufSize; i++) {
    const wh = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + wh * 0.0555179;
    b1 = 0.99332 * b1 + wh * 0.0750759;
    b2 = 0.96900 * b2 + wh * 0.1538520;
    data[i] = (b0 + b1 + b2) * 0.15;
  }
  const windSrc = ctx.createBufferSource();
  windSrc.buffer = buf; windSrc.loop = true;

  const windFilter = ctx.createBiquadFilter();
  windFilter.type = 'bandpass'; windFilter.frequency.value = 500; windFilter.Q.value = 0.3;

  const windGain = ctx.createGain();
  windGain.gain.value = 0.18;

  const lfo = ctx.createOscillator();
  const lfoG = ctx.createGain();
  lfo.frequency.value = 0.06; lfoG.gain.value = 0.07;
  lfo.connect(lfoG); lfoG.connect(windGain.gain);

  windSrc.connect(windFilter); windFilter.connect(windGain); windGain.connect(ctx.destination);
  lfo.start(); windSrc.start();
  srcs.push(windSrc, windFilter, windGain, lfo, lfoG);

  const scheduleBird = () => {
    if (!active) return;
    const delay = 2.5 + Math.random() * 8;
    const when = ctx.currentTime + delay;
    const baseFreq = 1600 + Math.random() * 1600;

    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const birdGain = ctx.createGain();
    const pan = ctx.createStereoPanner();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(baseFreq, when);
    carrier.frequency.setValueAtTime(baseFreq * (1.15 + Math.random() * 0.2), when + 0.04);
    carrier.frequency.setValueAtTime(baseFreq, when + 0.1);

    modulator.type = 'sine';
    modulator.frequency.value = baseFreq * 1.98;
    modGain.gain.value = baseFreq * 0.25;

    const dur = 0.08 + Math.random() * 0.1;
    birdGain.gain.setValueAtTime(0, when);
    birdGain.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.05, when + 0.02);
    birdGain.gain.exponentialRampToValueAtTime(0.001, when + dur);
    pan.pan.value = (Math.random() - 0.5) * 1.6;

    modulator.connect(modGain); modGain.connect(carrier.frequency);
    carrier.connect(birdGain); birdGain.connect(pan); pan.connect(ctx.destination);

    modulator.start(when); modulator.stop(when + dur + 0.05);
    carrier.start(when); carrier.stop(when + dur + 0.05);

    const nextDelay = Math.random() < 0.35 ? delay * 0.28 : delay;
    setTimeout(scheduleBird, nextDelay * 1000);
  };
  setTimeout(scheduleBird, 1200);

  return () => {
    active = false;
    srcs.forEach(n => { try { (n as any).stop?.(); n.disconnect(); } catch {} });
  };
}

function startBowl(ctx: AudioContext): (() => void) {
  let active = true;
  const harmonics = [
    { ratio: 1, gain: 0.4, decay: 9 },
    { ratio: 2.756, gain: 0.22, decay: 6 },
    { ratio: 5.404, gain: 0.1, decay: 3.5 },
    { ratio: 8.932, gain: 0.04, decay: 2 },
  ];
  const fundamental = 220;

  const playStrike = (when: number) => {
    harmonics.forEach(({ ratio, gain, decay }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = fundamental * ratio;
      osc.detune.value = (Math.random() - 0.5) * 6;
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(gain, when + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, when + decay);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(when); osc.stop(when + decay + 0.1);
    });
  };

  const scheduleStrike = (when: number) => {
    if (!active) return;
    playStrike(when);
    const next = 11 + Math.random() * 6;
    setTimeout(() => scheduleStrike(ctx.currentTime + 0.1), next * 1000);
  };
  scheduleStrike(ctx.currentTime + 0.3);

  return () => { active = false; };
}

function startPink(ctx: AudioContext): (() => void) {
  const bufSize = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
    for (let i = 0; i < bufSize; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
      b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
      b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980;
      b6 = w * 0.115926;
      data[i] = Math.max(-1, Math.min(1, (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11));
    }
  }
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const gain = ctx.createGain();
  gain.gain.value = 0.65;
  src.connect(gain); gain.connect(ctx.destination);
  src.start();
  return () => { try { src.stop(); src.disconnect(); gain.disconnect(); } catch {} };
}

export default function CalmingSounds({ onBack, logActivity }: CalmingSoundsProps) {
  const [activeId, setActiveId] = useState<SoundId | null>(null);
  const [volume, setVolume] = useState(0.75);
  const stopFnRef = useRef<(() => void) | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const getCtx = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const stopCurrent = () => {
    if (stopFnRef.current) { stopFnRef.current(); stopFnRef.current = null; }
  };

  const play = (id: SoundId) => {
    stopCurrent();
    setActiveId(id);
    logActivity('Sons Calmantes');
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = volume;
    masterRef.current = master;

    let stop: () => void;
    if (id === 'ocean')  stop = startOcean(ctx);
    else if (id === 'rain')   stop = startRain(ctx);
    else if (id === 'forest') stop = startForest(ctx);
    else if (id === 'bowl')   stop = startBowl(ctx);
    else                      stop = startPink(ctx);

    stopFnRef.current = stop;
  };

  const stop = () => { stopCurrent(); setActiveId(null); };

  useEffect(() => () => stopCurrent(), []);

  const activeSound = SOUNDS.find(s => s.id === activeId);

  return (
    <div className="flex flex-col pb-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { stop(); onBack(); }} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block">PREVENÇÃO</span>
          <span className="font-bold text-sm text-[#1e293b]">Sons Calmantes</span>
        </div>
        <div className="w-10" />
      </div>

      <AnimatePresence>
        {activeSound && (
          <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} className="overflow-hidden mb-4">
            <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: activeSound.bg, border: `1.5px solid ${activeSound.color}44` }}>
              <div className="flex items-end gap-[3px] h-5">
                {[0.5, 1, 0.65, 1, 0.55].map((h, i) => (
                  <motion.div key={i} className="w-1 rounded-full" style={{ background: activeSound.color, height: 20 }}
                    animate={{ scaleY: [h, 1, h * 0.55, 1, h] }}
                    transition={{ duration: 0.8 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }} />
                ))}
              </div>
              <span className="flex-1 text-xs font-black" style={{ color: activeSound.color }}>
                {activeSound.emoji} {activeSound.label} — tocando
              </span>
              <button onClick={stop} className="p-1.5 rounded-full bg-white/70">
                <VolumeX className="w-4 h-4" style={{ color: activeSound.color }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl px-5 py-3.5 border border-gray-100 shadow-sm mb-5">
        <div className="flex items-center gap-3">
          <VolumeX className="w-4 h-4 text-gray-300 flex-shrink-0" />
          <input type="range" min={0} max={1} step={0.02} value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-[#b388c4]" />
          <Volume2 className="w-4 h-4 text-[#b388c4] flex-shrink-0" />
        </div>
      </div>

      <div className="space-y-3">
        {SOUNDS.map((sound, i) => {
          const isActive = activeId === sound.id;
          return (
            <motion.button key={sound.id}
              onClick={() => isActive ? stop() : play(sound.id)}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26, delay: 0.05 + i * 0.06 }}
              className="w-full text-left rounded-2xl border-2 p-4 flex items-center gap-4"
              style={isActive ? { background: sound.bg, borderColor: sound.color, boxShadow: `0 4px 20px ${sound.color}2a` } : { background: '#fff', borderColor: '#f1f5f9' }}>
              <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                animate={isActive ? { background: sound.bg } : { background: '#f8fafc' }}>
                {sound.emoji}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1e293b] text-sm">{sound.label}</span>
                  {isActive && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="text-[9px] font-black px-2 py-0.5 rounded-full text-white"
                      style={{ background: sound.color }}>
                      ● AO VIVO
                    </motion.span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{sound.description}</p>
              </div>
              <div className="flex-shrink-0">
                {isActive ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: sound.color }}>
                    <div className="flex gap-0.5 items-center">
                      <div className="w-1 h-3 bg-white rounded-full" />
                      <div className="w-1 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-0 h-0 ml-0.5" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '9px solid #94a3b8' }} />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-5">
        Use fones de ouvido para melhor experiência.
      </p>
    </div>
  );
                                          }
