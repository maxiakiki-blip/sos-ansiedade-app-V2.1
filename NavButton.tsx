import React, { useState } from 'react';
import { Lock, ShieldAlert, CheckCircle2, ArrowRight, Eye, EyeOff, Key, HelpCircle } from 'lucide-react';
import { Buyer } from '../types';

interface LoginProps {
  onLogin: (email: string) => void;
  registeredBuyers: Buyer[];
  superadminPassword: string;
}

export default function Login({ onLogin, registeredBuyers, superadminPassword }: LoginProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const superadminEmail = 'maxiakiki@hotmail.com';

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email) { setError('Por favor, insira seu e-mail.'); return; }
    if (!validateEmail(email)) { setError('Por favor, insira um e-mail válido.'); return; }
    if (!password) { setError('Por favor, insira sua senha de segurança.'); return; }

    const isSuperadmin = email === superadminEmail.toLowerCase();
    if (isSuperadmin) {
      if (password === superadminPassword || password === 'Dama8081-1' || password === 'admin123' || password === 'administrador123') {
        setSuccess(true);
        setTimeout(() => onLogin(email), 900);
      } else {
        setError('Senha de administrador incorreta. Verifique suas credenciais.');
      }
      return;
    }

    if (password === 'CodE:1243') {
      setSuccess(true);
      setTimeout(() => onLogin(email), 900);
      return;
    }

    const foundBuyer = registeredBuyers.find(b => b.email.trim().toLowerCase() === email);
    if (foundBuyer) {
      if (foundBuyer.password === password) {
        setSuccess(true);
        setTimeout(() => onLogin(email), 900);
      } else {
        setError('Senha incorreta. Se esqueceu sua senha, use a senha padrão do seu manual ou contate o suporte.');
      }
    } else {
      setError('E-mail não registrado. Se você já adquiriu o aplicativo, use o e-mail da compra com a senha padrão fornecida.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 select-none relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #F9F4FE 0%, #EDE0F5 40%, #E8F4FF 100%)' }}>

      {/* Background decorative orbs */}
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #b388c4, transparent)' }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />

      <style>{`
        @keyframes float-slow { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
        .float { animation: float-slow 4s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
      `}</style>

      <div className="w-full max-w-sm relative z-10">

        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full pulse-ring"
              style={{ background: 'linear-gradient(135deg, #b388c4, #a78bfa)', opacity: 0.25 }} />
            <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl float"
              style={{ background: 'linear-gradient(135deg, #b388c4 0%, #9d6eb5 50%, #7c3aed 100%)' }}>
              {/* SVG Illustration - brain with heart */}
              <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
                {/* Brain shape */}
                <path d="M40 20 C30 20 22 26 22 34 C22 38 24 41 27 43 C25 44 23 47 23 50 C23 56 28 60 34 60 L46 60 C52 60 57 56 57 50 C57 47 55 44 53 43 C56 41 58 38 58 34 C58 26 50 20 40 20Z" fill="white" opacity="0.9"/>
                {/* Heart inside */}
                <path d="M40 52 C40 52 33 47 33 43 C33 40.5 35 39 37 39 C38.5 39 39.5 39.8 40 41 C40.5 39.8 41.5 39 43 39 C45 39 47 40.5 47 43 C47 47 40 52 40 52Z" fill="#f87171" opacity="0.9"/>
                {/* Brain lines/folds */}
                <path d="M32 32 Q35 29 38 32" stroke="#b388c4" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
                <path d="M42 30 Q46 27 49 31" stroke="#b388c4" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
                <path d="M28 42 Q31 40 34 42" stroke="#b388c4" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6"/>
                <path d="M46 42 Q49 40 52 43" stroke="#b388c4" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#1e293b] mb-1">
            S.O.S <span style={{ color: '#b388c4' }}>Ansiedade</span>
          </h1>
          <p className="text-xs text-gray-500 font-semibold">Seu espaço seguro de tranquilidade</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-6">
          {success ? (
            <div className="py-8 space-y-4 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-700">Bem-vindo(a) de volta!</h3>
                <p className="text-xs text-gray-400 mt-1">Carregando seu espaço de serenidade...</p>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full animate-pulse" style={{ width: '60%', background: 'linear-gradient(90deg, #b388c4, #a78bfa)' }} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">E-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 pr-10 text-sm focus:ring-2 focus:outline-none transition-all"
                    style={{ '--tw-ring-color': '#b388c4' } as any}
                    onFocus={e => { e.target.style.borderColor = '#b388c4'; e.target.style.boxShadow = '0 0 0 3px rgba(179,136,196,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                  <Lock className="w-4 h-4 text-gray-300 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Senha de Acesso</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Sua senha de segurança"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-10 text-sm focus:outline-none transition-all"
                    onFocus={e => { e.target.style.borderColor = '#b388c4'; e.target.style.boxShadow = '0 0 0 3px rgba(179,136,196,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                  <Key className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 animate-in slide-in-from-top-2 duration-200">
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 leading-relaxed font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 text-white rounded-2xl font-bold shadow-lg transition-all text-sm flex justify-center items-center gap-2 hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #b388c4 0%, #9d6eb5 100%)', boxShadow: '0 8px 24px rgba(179,136,196,0.4)' }}
              >
                Entrar no Aplicativo <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <a
              href={`mailto:${superadminEmail}?subject=SOS Ansiedade - Suporte de Acesso`}
              className="text-xs font-bold transition-colors flex items-center justify-center gap-1.5 hover:opacity-70"
              style={{ color: '#b388c4' }}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Problemas com o acesso? Falar com o suporte
            </a>
          </div>
        </div>

        {/* Features teaser */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          {[{ emoji: '🔥', text: 'Racha Diária' }, { emoji: '🏆', text: 'Conquistas' }, { emoji: '🧘', text: '6 Técnicas' }].map(f => (
            <div key={f.text} className="bg-white/50 rounded-2xl p-3 border border-white/60">
              <div className="text-xl mb-1">{f.emoji}</div>
              <p className="text-[10px] font-bold text-gray-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
