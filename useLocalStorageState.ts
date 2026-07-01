import React, { useState, useEffect, useRef } from 'react';
import { 
  Hand as HandIcon, 
  RefreshCcw, 
  Activity, 
  Zap, 
  MousePointer2, 
  Target,
  Play,
  CheckCircle2,
  Info
} from 'lucide-react';
import HeaderBack from './HeaderBack';
import TappingPointSVG from './TappingPointSVG';

interface TappingProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

interface PointData {
  id: number;
  name: string;
  pos: string;
  locationText: string;
  techniques: { id: string; name: string; icon: React.ReactNode; desc: string }[];
  tips: string;
  duration: number;
}

export default function TappingExercise({ onBack, logActivity }: TappingProps) {
  // Datos clínicos de los 7 puntos acupresión
  const points: PointData[] = [
    { 
      id: 1, name: 'Entre as sobrancelhas (Yintang)', pos: 'Rostro', 
      locationText: 'Bem no centro entre as sobrancelhas, no ponto inicial de ambas.',
      techniques: [
        { id: 'static', name: 'Pressão Estática', icon: <HandIcon className="w-3.5 h-3.5"/>, desc: 'Aplique a ponta do dedo indicador ou médio com pressão moderada, mantendo sem mover.' },
        { id: 'circular', name: 'Massagem Circular', icon: <RefreshCcw className="w-3.5 h-3.5"/>, desc: 'Faça círculos lentos e contínuos mantendo o dedo em contato.' }
      ],
      tips: 'Excelente para aliviar o fluxo de pensamentos rápidos e a agitação mental.',
      duration: 30,
    },
    { 
      id: 2, name: 'Debaixo do nariz (Renzhong)', pos: 'Rostro', 
      locationText: 'No centro do sulco nasolabial, um terço abaixo da base nasal.',
      techniques: [
        { id: 'static', name: 'Pressão Direta', icon: <HandIcon className="w-3.5 h-3.5"/>, desc: 'Exerça uma pressão constante e moderada apontando levemente em direção ao céu da boca.' },
        { id: 'circular', name: 'Microcírculos', icon: <RefreshCcw className="w-3.5 h-3.5"/>, desc: 'Mova milimetricamente o tecido subcutâneo de forma circular.' }
      ],
      tips: 'Conhecido historicamente como o ponto de ressuscitação para reestabelecer a lucidez sensorial.',
      duration: 30,
    },
    { 
      id: 3, name: 'Queixo inferior (Chengjiang)', pos: 'Rostro', 
      locationText: 'Na depressão central logo abaixo do lábio inferior.',
      techniques: [
        { id: 'static', name: 'Pressão Central', icon: <HandIcon className="w-3.5 h-3.5"/>, desc: 'Coloque o dedo e pressione de forma suave contra a mandíbula.' }
      ],
      tips: 'Ajuda a aliviar a tensão acumulada da mandíbula induzida por estresse noturno (bruxismo).',
      duration: 20,
    },
    { 
      id: 4, name: 'Parte interna do pulso (Neiguan)', pos: 'Brazo', 
      locationText: 'Meça três dedos abaixo da dobra do pulso, bem no centro.',
      techniques: [
        { id: 'static', name: 'Pressão Firme', icon: <Target className="w-3.5 h-3.5"/>, desc: 'Pressione com firmeza em direção ao tendão principal, de forma constante.' },
        { id: 'pulsating', name: 'Pressão Rítmica', icon: <Activity className="w-3.5 h-3.5"/>, desc: 'Pressione firmemente por 3 segundos, solte levemente e repita.' }
      ],
      tips: 'O ponto indispensável para acalmar as náuseas nervosas e batimentos cardíacos acelerados.',
      duration: 60,
    },
    { 
      id: 5, name: 'Centro da palma (Laogong)', pos: 'Mano', 
      locationText: 'No meio da palma da mão, onde a ponta do dedo médio encosta ao fechar o punho.',
      techniques: [
        { id: 'circular', name: 'Pressão circular', icon: <RefreshCcw className="w-3.5 h-3.5"/>, desc: 'Massageie profundamente com movimentos concêntricos usando a mão oposta.' },
        { id: 'friction', name: 'Calor tátil', icon: <Zap className="w-3.5 h-3.5"/>, desc: 'Pressione de forma estática esfregando suavemente para aquecer o ponto.' }
      ],
      tips: 'Eficaz para reduzir o calor corporal e liberar a angústia contida no peito.',
      duration: 30,
    },
    { 
      id: 6, name: 'Trapézio / Ombro (Jianjing)', pos: 'Hombro', 
      locationText: 'No ponto médio entre a base do pescoço e a articulação do ombro.',
      techniques: [
        { id: 'static', name: 'Pressão em pinça', icon: <MousePointer2 className="w-3.5 h-3.5"/>, desc: 'Segure levemente o músculo em formato de pinça com os dedos indicador e polegar.' },
        { id: 'circular', name: 'Descontração', icon: <RefreshCcw className="w-3.5 h-3.5"/>, desc: 'Massageie com pequenos círculos para aliviar o peso do estresse diário.' }
      ],
      tips: 'Libera os canais tensos do pescoço e alivia dores de cabeça provocadas pela rigidez muscular.',
      duration: 30,
    },
    { 
      id: 7, name: 'Abaixo do joelho lateral (Zusanli)', pos: 'Leg', 
      locationText: 'Quatro dedos abaixo da patela (joelho), um dedo de largura para o lado externo.',
      techniques: [
        { id: 'static', name: 'Pressão forte', icon: <HandIcon className="w-3.5 h-3.5"/>, desc: 'Pressione firme com o polegar exercendo força contra a lateral da tíbia.' },
        { id: 'tapping', name: 'Percussão', icon: <Activity className="w-3.5 h-3.5"/>, desc: 'Dê batidinhas suaves e rítmicas usando a mão fechada de forma relaxada.' }
      ],
      tips: 'Ponto restaurador mestre que ancora a energia, diminuindo o turbinhão de pensamentos.',
      duration: 40,
    },
  ];

  const [activePoint, setActivePoint] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(points[0].duration);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedTech, setSelectedTech] = useState('static');
  
  const currentPoint = points[activePoint];
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Reproductor de Campanillas Suaves (Web Audio API) para marcar finalización acústica
  const playTimerChime = (type: 'start' | 'end') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.type = 'sine'; 

      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now); 
        osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.1); 
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'end') {
        osc.frequency.setValueAtTime(554.37, now); 
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.4);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, now + 0.3); 
        gain2.gain.setValueAtTime(0, now + 0.3);
        gain2.gain.linearRampToValueAtTime(0.2, now + 0.35);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        
        osc.start(now);
        osc.stop(now + 0.45);
        osc2.start(now + 0.3);
        osc2.stop(now + 1.5);
      }
    } catch (e) { 
      console.warn("Audio error", e); 
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
             playTimerChime('end'); 
             setIsActive(false);
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStartTimer = () => {
    playTimerChime('start'); 
    setIsActive(true);
  };

  const nextPoint = () => {
    if (activePoint < points.length - 1) {
      const nextIdx = activePoint + 1;
      setActivePoint(nextIdx);
      setIsActive(false);
      setTimeLeft(points[nextIdx].duration);
      setSelectedTech('static'); 
    } else {
      setIsFinished(true);
      logActivity('Acupressão (7 Pontos)');
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-300 px-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold mb-3 text-[#1e293b]">Acupressão Concluída!</h2>
        <p className="text-gray-600 mb-8 text-xs leading-relaxed max-w-xs">
          Você estimulou os 7 canais de acupressão. Sua energia física está balanceada e você liberou grande parte da tensão física provocada pela reação de estresse corporal.
        </p>
        <button 
          onClick={onBack} 
          className="w-full py-4 rounded-xl font-bold text-white bg-[#1e293b] hover:bg-black transition-colors"
        >
          Voltar à Prevenção
        </button>
      </div>
    );
  }

  const isStepComplete = timeLeft === 0;

  return (
    <div className="animate-in fade-in pb-8">
      <HeaderBack onBack={onBack} title="Acupressão: 7 Pontos" />
      
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
        
        {/* Progress header */}
        <div className="flex justify-between items-center mb-5">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PASSO {activePoint + 1} DE {points.length}</span>
           <div className="flex gap-1">
             {points.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activePoint ? 'bg-[#b388c4]' : i < activePoint ? 'bg-[#EAE0F1]' : 'bg-gray-100'}`}></div>
             ))}
           </div>
        </div>

        {/* CONTENIDO INTERACTIVO */}
        <div className="flex flex-col">
           <div className="text-center mb-4">
             <h3 className="text-lg font-black text-[#1e293b] leading-tight">{currentPoint.name}</h3>
             <p className="text-[10px] font-bold text-[#b388c4] bg-[#F5EFFF] inline-block px-3 py-1 rounded-full border border-[#b388c4]/20 mt-1.5 max-w-xs">
               📍 {currentPoint.locationText}
             </p>
           </div>

           {/* Gráfico Corporal en Esfera */}
           <div className="relative w-40 h-40 mx-auto mb-5 bg-emerald-50/50 rounded-full border-4 border-emerald-100/50 flex items-center justify-center shadow-inner overflow-hidden">
              <TappingPointSVG techniqueId={selectedTech} active={isActive} pointId={currentPoint.id} />
              <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#f43f5e] text-white rounded-full flex items-center justify-center font-extrabold text-xs shadow-sm z-10">
                {currentPoint.id}
              </div>
           </div>

           {/* Selección de Técnica de Masaje */}
           <div className="mb-4">
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Técnicas de Massagem:</span>
             <div className="grid grid-cols-2 gap-2">
               {currentPoint.techniques.map(tech => (
                 <button 
                   key={tech.id}
                   onClick={() => setSelectedTech(tech.id)}
                   className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold transition-all border ${
                     selectedTech === tech.id 
                       ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-xs' 
                       : 'bg-gray-50 text-gray-500 border-gray-150 hover:bg-gray-100'
                   }`}
                 >
                   {tech.icon}
                   <span className="text-[10px]">{tech.name}</span>
                 </button>
               ))}
             </div>
           </div>

           {/* Descripción del masaje */}
           <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 mb-4 min-h-[64px] flex items-center">
             <p className="text-xs text-gray-600 leading-normal">
               <strong className="text-[#1e293b] font-extrabold">Instruções:</strong>{' '}
               {currentPoint.techniques.find(t => t.id === selectedTech)?.desc}
             </p>
           </div>

           {/* Tip clínico para potenciar */}
           {!isActive && timeLeft === currentPoint.duration && (
             <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-5 flex gap-2 items-start animate-in zoom-in">
               <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
               <p className="text-[10px] text-amber-800 leading-normal font-medium">
                 <strong className="font-bold">Efeito clínico:</strong> {currentPoint.tips}
               </p>
             </div>
           )}
        </div>

        {/* TEMPORIZADOR */}
        <div className="h-16 flex items-center justify-center mt-1">
          {isStepComplete ? (
            <button 
              onClick={nextPoint}
              className="w-full py-3.5 bg-[#b388c4] text-white rounded-xl font-bold shadow-sm hover:bg-[#9d73ad] transition-all animate-in zoom-in"
            >
              Concluído! Próximo Ponto
            </button>
          ) : (
             !isActive ? (
               <button 
                 onClick={handleStartTimer}
                 className="w-full py-3.5 bg-[#1e293b] text-white rounded-xl font-bold shadow-sm hover:bg-black transition-colors flex justify-center items-center gap-2"
               >
                 <Play className="w-4 h-4 fill-current" /> Iniciar ({currentPoint.duration} s)
               </button>
             ) : (
               <div className="text-4xl font-light text-[#b388c4] tabular-nums animate-pulse flex items-center gap-1.5">
                 {timeLeft}<span className="text-lg text-gray-400">s</span>
               </div>
             )
          )}
        </div>

      </div>
    </div>
  );
}
