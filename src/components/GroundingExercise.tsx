import React, { useState } from 'react';
import { Eye, Hand, Ear, Wind, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface GroundingExerciseProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
  onComplete?: () => void;
}

interface GroundingStep {
  number: number;
  sensory: string;
  title: string;
  desc: string;
  placeholder: string;
  icon: React.ReactNode;
  bgHex: string;
  borderHex: string;
  iconBgHex: string;
  iconTextHex: string;
  suggestions: string[];
}

export default function GroundingExercise({ onBack, logActivity, onComplete }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<string[][]>([[], [], [], [], []]);
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const steps: GroundingStep[] = [
    {
      number: 5,
      sensory: 'VISÃO',
      title: '5 Coisas que você pode VER',
      desc: 'Observe atentamente seu entorno. Busque 5 objetos pequenos ou grandes, cores ou detalhes e escreva ou apenas pense neles.',
      placeholder: 'Ex: O brilho do sol, uma planta, minha xícara...',
      icon: <Eye className="w-8 h-8" />,
      bgHex: 'bg-blue-50',
      borderHex: 'border-blue-100',
      iconBgHex: 'bg-blue-100',
      iconTextHex: 'text-blue-600',
      suggestions: ['A textura da parede', 'Uma sombra no chão', 'Seus próprios sapatos', 'Uma caneta ou lápis', 'Um livro por perto']
    },
    {
      number: 4,
      sensory: 'TATO',
      title: '4 Coisas que você pode SENTIR',
      desc: 'Preste atenção ao seu corpo físico. Sinta texturas, pressões ou temperaturas e nomeie-as para se ancorar no presente.',
      placeholder: 'Ex: O toque da minha roupa, o teclado frio...',
      icon: <Hand className="w-8 h-8" />,
      bgHex: 'bg-emerald-50',
      borderHex: 'border-[#B2F5EA]/40',
      iconBgHex: 'bg-emerald-100',
      iconTextHex: 'text-emerald-600',
      suggestions: ['Seus pés tocando o chão firme', 'O vento fresco nos braços', 'A maciez da calça', 'O encosto da sua cadeira']
    },
    {
      number: 3,
      sensory: 'AUDIÇÃO',
      title: '3 Coisas que você pode OUVIR',
      desc: 'Feche os olhos por um segundo. Ouça com atenção e separe o barulho ambiente em 3 sons individuais.',
      placeholder: 'Ex: O cantar de um pássaro, um carro distante...',
      icon: <Ear className="w-8 h-8" />,
      bgHex: 'bg-indigo-50',
      borderHex: 'border-indigo-100',
      iconBgHex: 'bg-indigo-100',
      iconTextHex: 'text-indigo-600',
      suggestions: ['O zumbido do ar-condicionado', 'Os passos distantes de alguém', 'Sua própria batida cardíaca ou respiração']
    },
    {
      number: 2,
      sensory: 'OLFATO',
      title: '2 Coisas que você pode CHEIRAR',
      desc: 'Inhale profundamente pelo nariz. O que você nota? Tente distinguir pelo menos 2 aromas ou cheiros sutis no ambiente.',
      placeholder: 'Ex: Aroma de café, cheirinho de chuva...',
      icon: <Wind className="w-8 h-8" />,
      bgHex: 'bg-amber-50',
      borderHex: 'border-amber-150',
      iconBgHex: 'bg-amber-100',
      iconTextHex: 'text-amber-600',
      suggestions: ['O perfume da sua roupa', 'Cheirinho de casa ou madeira', 'Limpeza ou ar fresco']
    },
    {
      number: 1,
      sensory: 'PALADAR',
      title: '1 Coisa que você pode SABOREAR',
      desc: 'Conecte-se com sua boca. Saboreie a sensação atual ou dê um pequeno gole de água fresca, prestando atenção no sabor.',
      placeholder: 'Ex: O frescor da hortelã, sabor neutro...',
      icon: <HeartPulse className="w-8 h-8" />,
      bgHex: 'bg-rose-50',
      borderHex: 'border-rose-100',
      iconBgHex: 'bg-rose-100',
      iconTextHex: 'text-rose-600',
      suggestions: ['A saliva fresca no paladar', 'Sabor residual de comida ou café', 'Um gole lento de água fresca']
    }
  ];

  const currentStepData = steps[currentStep];
  const stepItems = inputs[currentStep];

  const handleAddValue = (val: string) => {
    if (!val.trim()) return;
    if (stepItems.length >= currentStepData.number) return;

    setInputs(prev => {
      const copy = [...prev];
      copy[currentStep] = [...copy[currentStep], val.trim()];
      return copy;
    });
    setCurrentInputValue('');
  };

  const handleRemoveValue = (index: number) => {
    setInputs(prev => {
      const copy = [...prev];
      copy[currentStep] = copy[currentStep].filter((_, i) => i !== index);
      return copy;
    });
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCurrentInputValue('');
    } else {
      setIsFinished(true);
      logActivity('Conexão Sensorial 5-4-3-2-1');
    }
  };

  const handleSkipStep = () => {
    // Si el usuario no quiere introducir datos por teclado,
    // llenamos ficticiamente el paso para que progrese de forma libre
    setInputs(prev => {
      const copy = [...prev];
      if (copy[currentStep].length === 0) {
        copy[currentStep] = Array.from({ length: currentStepData.number }, (_, i) => `Item #${i + 1}`);
      }
      return copy;
    });
    handleNextStep();
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-purple-100 text-[#b388c4] rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Totalmente Ancorado</h2>
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          Parabéns! Você concluiu o protocolo completo 5-4-3-2-1. Sintonizar seus 5 sentidos acalma diretamente os circuitos da amígdala cerebral, trazendo você de volta para o aqui e o agora.
        </p>
        {onComplete ? (
          <div className="w-full space-y-3">
            <button 
              onClick={onComplete}
              className="w-full py-4 bg-[#b388c4] text-white rounded-xl font-bold hover:bg-[#a174b2] transition-colors shadow-md flex justify-center items-center gap-2"
            >
              Progresso SOS: Abraço de Borboleta 🦋
            </button>
            <button 
              onClick={onBack}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl font-bold transition-all text-sm"
            >
              Voltar ao Resgate
            </button>
          </div>
        ) : (
          <button 
            onClick={onBack}
            className="w-full py-4 bg-[#1e293b] text-white rounded-xl font-bold hover:bg-black transition-colors shadow-md"
          >
            Voltar ao Resgate
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in h-full flex flex-col justify-between pb-8">
      {/* Header with back */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm text-gray-700">Técnica 5-4-3-2-1</span>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold text-gray-400">PASSO {currentStep + 1} DE 5</span>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep 
                      ? 'bg-[#b388c4]' 
                      : i < currentStep 
                        ? 'bg-[#EAE0F1]' 
                        : 'bg-gray-100'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Sensory Heading Card */}
          <div className={`p-5 rounded-2xl border ${currentStepData.bgHex} ${currentStepData.borderHex} flex gap-4 items-center mb-6`}>
            <div className={`p-3 rounded-xl ${currentStepData.iconBgHex} ${currentStepData.iconTextHex} shadow-inner`}>
              {currentStepData.icon}
            </div>
            <div>
              <span className={`text-[10px] font-black tracking-widest ${currentStepData.iconTextHex} uppercase`}>
                Canal Sensorial: {currentStepData.sensory}
              </span>
              <h3 className="text-lg font-black text-[#1e293b] leading-tight">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {currentStepData.desc}
          </p>

          {/* Predefined helpful suggestions */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Sugestões reconfortantes:</span>
            <div className="flex flex-wrap gap-2">
              {currentStepData.suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddValue(sug)}
                  disabled={stepItems.length >= currentStepData.number}
                  className="bg-gray-50 border border-gray-200 hover:bg-gray-100 disabled:opacity-50 text-[11px] text-gray-600 font-medium px-2.5 py-1.5 rounded-lg text-left leading-tight"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Items input */}
          {stepItems.length < currentStepData.number && (
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder={currentStepData.placeholder}
                value={currentInputValue}
                onChange={(e) => setCurrentInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddValue(currentInputValue);
                  }
                }}
                className="flex-1 bg-gray-50 border border-gray-200 focus:border-[#b388c4] focus:ring-1 focus:ring-[#b388c4] focus:outline-none rounded-xl px-4 py-3 text-sm"
              />
              <button 
                onClick={() => handleAddValue(currentInputValue)}
                className="bg-[#1e293b] hover:bg-black text-white text-xs font-bold px-4 rounded-xl shadow-sm transition-colors"
              >
                Adicionar
              </button>
            </div>
          )}

          {/* Items registered */}
          {stepItems.length > 0 && (
            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Sua lista ({stepItems.length} de {currentStepData.number}):</span>
              <div className="grid grid-cols-1 gap-2">
                {stepItems.map((val, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 animate-in slide-in-from-bottom-2 duration-200">
                    <span className="font-medium text-[#1e293b]">✔ {val}</span>
                    {/* Permitir remover solo si no Skip */}
                    {val !== `Item #${idx + 1}` && (
                      <button 
                        onClick={() => handleRemoveValue(idx)} 
                        className="text-gray-400 hover:text-rose-500 font-bold px-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Action Controls */}
        <div className="space-y-2 mt-4">
          {stepItems.length >= currentStepData.number ? (
            <button 
              onClick={handleNextStep}
              className="w-full py-4 bg-[#b388c4] text-white rounded-xl font-bold shadow-md hover:bg-[#9d73ad] transition-all flex items-center justify-center gap-2"
            >
              {currentStep < steps.length - 1 ? 'Próximo Canal' : 'Concluir Exercício'} <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSkipStep}
              className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl font-bold transition-all"
            >
              Fazer mentalmente (Próximo)
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
