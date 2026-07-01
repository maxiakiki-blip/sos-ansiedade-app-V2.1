import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Music, Sun, HeartPulse, Moon, Pause, Play, Ear, Info } from 'lucide-react';
import HeaderBack from './HeaderBack';

interface CalmingSoundsProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

export default function CalmingSounds({ onBack, logActivity }: CalmingSoundsProps) {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRefs = useRef<any[]>([]);

  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, []);

  const stopAllSounds = () => {
    sourceRefs.current.forEach(node => {
      try { node.stop(); } catch(e) {}
      try { node.disconnect(); } catch(e) {}
    });
    sourceRefs.current = [];
  };

  const playRealSound = (id: number) => {
    stopAllSounds();
    if (playing === id) {
      setPlaying(null);
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 1); // Fade in liso
      masterGain.connect(ctx.destination);
      sourceRefs.current.push(masterGain);

      if (id === 1) {
        // --- 1. AGUA CORRIENDO (Arroyo suave y orgánico basado en síntesis profunda) ---
        const bufferSize = ctx.sampleRate * 4; 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.45; // Ruido blanco base de agua
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Capa baja del arroyo
        const deepFilter = ctx.createBiquadFilter();
        deepFilter.type = 'lowpass';
        deepFilter.frequency.value = 220; 
        
        const deepGain = ctx.createGain();
        deepGain.gain.value = 1.0;

        // Capa media (flujo principal de burbujeo)
        const midFilter = ctx.createBiquadFilter();
        midFilter.type = 'bandpass';
        midFilter.frequency.value = 550;
        midFilter.Q.value = 0.8;

        const midGain = ctx.createGain();
        midGain.gain.value = 0.4;

        // Capa rítmica de salpicaduras sutiles (LFO para oscilar la frecuencia de banda)
        const surfaceFilter = ctx.createBiquadFilter();
        surfaceFilter.type = 'bandpass';
        surfaceFilter.frequency.value = 950;
        surfaceFilter.Q.value = 1.2;

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.18; // Amplitud ultra-lenta para simular oleaje natural
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 280; // Modula +/- 280Hz

        lfo.connect(lfoGain);
        lfoGain.connect(surfaceFilter.frequency);

        const surfaceGain = ctx.createGain();
        surfaceGain.gain.value = 0.15;

        // Unificar capas al masterGain
        noise.connect(deepFilter);
        deepFilter.connect(deepGain);
        deepGain.connect(masterGain);

        noise.connect(midFilter);
        midFilter.connect(midGain);
        midGain.connect(masterGain);

        noise.connect(surfaceFilter);
        surfaceFilter.connect(surfaceGain);
        surfaceGain.connect(masterGain);

        noise.start();
        lfo.start();
        
        sourceRefs.current.push(noise, lfo, deepFilter, midFilter, surfaceFilter, lfoGain, deepGain, midGain, surfaceGain);

      } else if (id === 2) {
        // --- 2. RUIDO ROSA (Mejor que ruido blanco para adormecer ruidos rápidos) ---
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Algoritmo de Voss-McCartney para recrear un hermoso Ruido Rosa
        let b0 = 0.0, b1 = 0.0, b2 = 0.0, b3 = 0.0, b4 = 0.0, b5 = 0.0, b6 = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          data[i] *= 0.11; // Atenuación normalizada
          b6 = white * 0.115926;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const volumeNode = ctx.createGain();
        volumeNode.gain.value = 0.5;

        noise.connect(volumeNode);
        volumeNode.connect(masterGain);
        
        noise.start();
        sourceRefs.current.push(noise, volumeNode);

      } else if (id === 3 || id === 4) {
        // --- 3. 432Hz (Tono sagrado de relajación estática) | 4. 528Hz (Frecuencia de restauración celular) ---
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = id === 3 ? 432 : 528;

        const volumeNode = ctx.createGain();
        volumeNode.gain.value = 0.15; // Suave y no ensordecedor

        osc.connect(volumeNode);
        volumeNode.connect(masterGain);
        
        osc.start();
        sourceRefs.current.push(osc, volumeNode);

      } else if (id === 5) {
        // --- 5. ONDAS DELTA (Para sincronización cerebral profunda con base armónica) ---
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        
        // Panner binaural intuitivo estimulado con diferencia binaural sutil
        const pannerLeft = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const pannerRight = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        oscLeft.type = 'sine';
        oscLeft.frequency.value = 140; // Frecuencia portadora izquierda

        oscRight.type = 'sine';
        oscRight.frequency.value = 143.5; // Frecuencia con desfase Delta de 3.5Hz

        const volumeNode = ctx.createGain();
        volumeNode.gain.value = 0.35;

        if (pannerLeft && pannerRight) {
          pannerLeft.pan.value = -1; // Enviar al auricular izquierdo
          pannerRight.pan.value = 1; // Enviar al auricular derecho
          
          oscLeft.connect(pannerLeft);
          pannerLeft.connect(volumeNode);
          
          oscRight.connect(pannerRight);
          pannerRight.connect(volumeNode);
        } else {
          oscLeft.connect(volumeNode);
          oscRight.connect(volumeNode);
        }

        volumeNode.connect(masterGain);

        oscLeft.start();
        oscRight.start();
        
        sourceRefs.current.push(oscLeft, oscRight, volumeNode);
        if (pannerLeft) sourceRefs.current.push(pannerLeft);
        if (pannerRight) sourceRefs.current.push(pannerRight);
      }

      setPlaying(id);
      logActivity('Sons Relaxantes');
    } catch (e) { 
      console.warn("Audio error en sonidos calmantes", e); 
    }
  };

  const sounds = [
    { id: 1, name: 'Riacho de Água Corrente', icon: <Droplets className="w-5 h-5" />, color: 'text-blue-400 bg-blue-50/10' },
    { id: 2, name: 'Ruído Rosa Estabilizador', icon: <Music className="w-5 h-5" />, color: 'text-rose-400 bg-rose-50/10' },
    { id: 3, name: 'Tom de Cura 432Hz', icon: <Sun className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50/10' },
    { id: 4, name: 'Tom Regenerador 528Hz', icon: <HeartPulse className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-50/10' },
    { id: 5, name: 'Binaural Delta (3.5Hz)', icon: <Moon className="w-5 h-5" />, color: 'text-indigo-400 bg-indigo-50/10' },
  ];

  return (
    <div className="animate-in fade-in pb-8">
      <HeaderBack onBack={onBack} title="Sons Calmantes" />
      
      <div className="bg-[#1e293b] text-white rounded-3xl p-5 shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 relative">
             {playing && <div className="absolute inset-0 border-2 border-[#b388c4] rounded-full animate-ping opacity-30"></div>}
              <Ear className="w-8 h-8 text-white opacity-90" />
          </div>
          <h3 className="text-lg font-bold">Frequências Neuro-Estabilizadoras</h3>
          <p className="text-xs text-gray-400">Recomendamos usar fones de ouvido para uma imersão completa</p>
        </div>

        <div className="space-y-2.5 relative z-10">
          {sounds.map(sound => (
            <div key={sound.id} className="bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${sound.color}`}>{sound.icon}</div>
                <span className="font-bold text-xs">{sound.name}</span>
              </div>
              <button 
                onClick={() => playRealSound(sound.id)}
                className="w-8 h-8 bg-white text-[#1e293b] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xs"
              >
                {playing === sound.id ? <Pause className="w-4 h-4 fill-current text-purple-700" /> : <Play className="w-4 h-4 fill-current text-[#1e293b] ml-0.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#F5EFFF] p-5 rounded-2xl border border-[#b388c4]/20">
        <div className="flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#b388c4] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-[#1e293b] text-xs mb-1">Fundamentos do Neurotreinamento</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              A estimulação auditiva contínua e a diferença binaural de baixa frequência (Ondas Delta) guiam o córtex cerebral a apaziguar as oscilações neuronais hiperativas, priorizando um estado reparador e ideal para combater a ansiedade física.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
