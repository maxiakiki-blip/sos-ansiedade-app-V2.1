import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import HeaderBack from './HeaderBack';

interface MotivationalProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

const QUOTES = [
  { text: "A ansiedade é como uma onda forte do mar. O melhor é não lutar diretamente contra ela; deixe-se flutuar até que a maré baixe naturalmente.", author: "Aceitação Radical", emoji: "🌊" },
  { text: "Você não tem a obrigação de resolver toda a sua vida neste exato segundo. Concentre-se exclusivamente em sua próxima respiração suave.", author: "Presença Plena", emoji: "🌬️" },
  { text: "Esta tempestade também passará. As emoções são como nuvens que cruzam o céu; você é o céu imenso de fundo, inalterável.", author: "Perspectiva", emoji: "⛅" },
  { text: "A paz não consiste na ausência de tempestades ao seu redor, mas sim em cultivar o silêncio e a segurança no seu interior.", author: "Sabedoria Interior", emoji: "🕊️" },
  { text: "Você está seguro aqui e agora. Não deixe que as fantasias temerosas do futuro roubem o aconchego do momento presente.", author: "Ancoragem", emoji: "⚓" },
  { text: "Cada respiração profunda que você dá é um ato de coragem e de amor próprio. Seu corpo sabe o caminho de volta à calma.", author: "Autocompaixão", emoji: "💚" },
  { text: "Você já superou 100% dos dias difíceis que achou que não conseguiria. Isso é uma prova extraordinária da sua força.", author: "Resiliência", emoji: "💪" },
  { text: "Ansiar pelo futuro é uma ilusão. O único momento real que existe é este — e neste momento, você está bem.", author: "Eckhart Tolle", emoji: "✨" },
  { text: "O cérebro ansioso está tentando te proteger. Agradeça por sua tentativa e gentilmente, conduza-o de volta à segurança do presente.", author: "Neurociência Compassiva", emoji: "🧠" },
  { text: "Não é necessário controlar seus pensamentos. É necessário parar de deixar que eles controlem você.", author: "Dan Millman", emoji: "🌀" },
  { text: "A coragem não é a ausência de medo. É decidir que algo é mais importante do que o medo.", author: "Ambrose Redmoon", emoji: "🦁" },
  { text: "Seja gentil com você mesmo. Você é uma criança do universo, não menos do que as árvores e as estrelas.", author: "Desiderata", emoji: "🌟" },
  { text: "Em meio ao caos, há uma oportunidade extraordinária de encontrar clareza. Respire. Pause. Observe.", author: "Mindfulness", emoji: "🏔️" },
  { text: "Os pensamentos não são fatos. Eles são apenas histórias que sua mente conta. Você pode escolher não acreditar em todas elas.", author: "TCC", emoji: "💭" },
  { text: "A prática diária de 5 minutos de consciência plena tem o poder de mudar a estrutura do seu cérebro em semanas.", author: "Neuroplasticidade", emoji: "🔬" },
  { text: "Você é mais forte do que imagina, mais amado do que acredita e mais capaz do que pensa.", author: "Christopher Robin", emoji: "🐻" },
  { text: "O futuro não está aqui ainda e o passado já se foi. Só existe este momento — e nele, você é capaz.", author: "Presente", emoji: "⏳" },
  { text: "Quando a ansiedade bater, lembre-se: seu corpo está do seu lado, não contra você. Ele está tentando te ajudar.", author: "Corporalidade", emoji: "🫀" },
  { text: "Cada dia que você pratica o autocuidado, você investe na versão mais calma, mais forte e mais feliz de você mesmo.", author: "Investimento Pessoal", emoji: "🌱" },
  { text: "A cura não é linear. Haverá dias difíceis e dias fáceis. O que importa é que você continue escolhendo se cuidar.", author: "Processo", emoji: "🛤️" },
];

export default function MotivationalQuotes({ onBack, logActivity }: MotivationalProps) {
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [isFlipping, setIsFlipping] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  useEffect(() => { logActivity('Leitura Motivacional'); }, []);

  const goTo = (idx: number) => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIdx(idx);
      setIsFlipping(false);
    }, 200);
  };

  const next = () => goTo((currentIdx + 1) % QUOTES.length);
  const prev = () => goTo((currentIdx - 1 + QUOTES.length) % QUOTES.length);
  const toggleLike = () => setLiked(prev => { const s = new Set(prev); s.has(currentIdx) ? s.delete(currentIdx) : s.add(currentIdx); return s; });

  const quote = QUOTES[currentIdx];
  const isLiked = liked.has(currentIdx);

  return (
    <div className="animate-in fade-in min-h-[70vh] flex flex-col">
      <style>{`
        @keyframes card-in { 0% { opacity: 0; transform: translateY(8px) scale(0.97); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .quote-card { animation: card-in 0.3s ease-out forwards; }
      `}</style>

      <HeaderBack onBack={onBack} title="Dose de Motivação" />

      {/* Counter */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          {currentIdx + 1} / {QUOTES.length}
        </span>
        <div className="flex gap-1">
          {QUOTES.slice(Math.max(0, currentIdx - 2), currentIdx + 3).map((_, i) => {
            const realIdx = Math.max(0, currentIdx - 2) + i;
            return (
              <button key={realIdx} onClick={() => goTo(realIdx)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: realIdx === currentIdx ? '#b388c4' : '#e5e7eb', width: realIdx === currentIdx ? '20px' : '8px' }} />
            );
          })}
        </div>
      </div>

      {/* Quote card */}
      <div className="flex-1 flex flex-col">
        <div key={currentIdx} className={`quote-card flex-1 rounded-3xl p-7 flex flex-col justify-between border border-[#EAE0F1]/60 shadow-md ${isFlipping ? 'opacity-0' : ''}`}
          style={{ background: 'linear-gradient(145deg, #FDFBF7, #F5EFFF)' }}>

          {/* Emoji + sparkle */}
          <div className="flex justify-between items-start">
            <span className="text-5xl leading-none">{quote.emoji}</span>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>

          {/* Quote text */}
          <div className="flex-1 flex items-center py-6">
            <p className="text-lg font-serif italic text-[#1e293b] leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
          </div>

          {/* Author + actions */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{quote.author}</p>
            </div>
            <button onClick={toggleLike}
              className="p-2.5 rounded-xl transition-all active:scale-90"
              style={{ background: isLiked ? '#fee2e2' : '#f8fafc', border: `1px solid ${isLiked ? '#fca5a5' : '#e5e7eb'}` }}>
              <Heart className="w-5 h-5 transition-colors" style={{ color: isLiked ? '#ef4444' : '#94a3b8', fill: isLiked ? '#ef4444' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          <button onClick={prev}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: 'white', border: '1.5px solid #e5e7eb', color: '#64748b' }}>
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <button onClick={next}
            className="flex-1 py-3.5 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)', boxShadow: '0 4px 16px rgba(179,136,196,0.4)' }}>
            Próxima <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {liked.size > 0 && (
          <p className="text-center text-[11px] text-[#b388c4] font-bold mt-3">
            ❤️ {liked.size} frase{liked.size > 1 ? 's' : ''} salva{liked.size > 1 ? 's' : ''} com carinho
          </p>
        )}
      </div>
    </div>
  );
}
