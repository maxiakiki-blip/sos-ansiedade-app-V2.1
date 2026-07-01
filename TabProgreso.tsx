import React, { useState, useRef } from 'react';
import {
  UserPlus, Trash2, Mail, Users, Search, AlertCircle, ShieldCheck,
  Download, Upload, Copy, Check, Eye, EyeOff, Key, User, RefreshCw,
  LockKeyhole, Calendar, FileText, Settings, Database
} from 'lucide-react';
import { Buyer } from '../types';

interface TabAdminProps {
  registeredBuyers: Buyer[];
  onAddBuyer: (buyer: Buyer) => void;
  onRemoveBuyer: (email: string) => void;
  superadminEmail: string;
  superadminPassword: string;
  onChangeSuperadminPassword: (password: string) => void;
  onImportBuyers: (buyers: Buyer[]) => void;
}

type AdminTab = 'clientes' | 'ferramentas' | 'config';

export default function TabAdmin({
  registeredBuyers,
  onAddBuyer,
  onRemoveBuyer,
  superadminEmail,
  superadminPassword,
  onChangeSuperadminPassword,
  onImportBuyers,
}: TabAdminProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('clientes');

  // Add buyer form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Buyer list
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Admin password
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Manual kit
  const [customAppName, setCustomAppName] = useState('SOS Ansiedade');
  const [customSupportEmail, setCustomSupportEmail] = useState('maxiakiki@hotmail.com');
  const [customAppUrl, setCustomAppUrl] = useState(typeof window !== 'undefined' ? window.location.origin : 'https://meuapp.vercel.app');
  const [isCopiedManual, setIsCopiedManual] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pass = '';
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setNewPassword(pass);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const email = newEmail.trim().toLowerCase();
    const name = newName.trim() || 'Comprador';
    const password = newPassword.trim();

    if (!email) return setError('Digite o e-mail do comprador.');
    if (!validateEmail(email)) return setError('E-mail com formato inválido.');
    if (email === superadminEmail.toLowerCase()) return setError('E-mail do superadmin já tem acesso vitalício.');
    if (registeredBuyers.some(b => b.email.toLowerCase() === email)) return setError('Este e-mail já está cadastrado.');
    if (!password) return setError('Defina ou gere uma senha.');
    if (password.length < 4) return setError('Senha deve ter no mínimo 4 caracteres.');

    onAddBuyer({ email, name, password, registrationDate: new Date().toLocaleDateString('pt-BR') });
    setNewEmail(''); setNewName(''); setNewPassword('');
    setSuccess(`"${name}" cadastrado com sucesso!`);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleUpdateAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null); setAdminSuccess(null);
    const pass = adminPasswordInput.trim();
    if (!pass) return setAdminError('A nova senha não pode estar vazia.');
    if (pass.length < 4) return setAdminError('Senha deve ter no mínimo 4 caracteres.');
    onChangeSuperadminPassword(pass);
    setAdminPasswordInput('');
    setAdminSuccess('Senha atualizada com sucesso!');
    setTimeout(() => setAdminSuccess(null), 3000);
  };

  const handleCopyCredentials = (buyer: Buyer, index: number) => {
    const msg = `Olá, *${buyer.name}*!\n\nSuas credenciais para acessar o *S.O.S Ansiedade*:\n\n🌐 *Link:* ${window.location.origin}\n📧 *E-mail:* ${buyer.email}\n🔑 *Senha:* ${buyer.password}\n\nBem-vindo(a)! 🌸`;
    navigator.clipboard.writeText(msg).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(registeredBuyers, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_sos_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          const valid: Buyer[] = parsed.filter(i => i && typeof i === 'object' && 'email' in i).map(i => ({
            email: String(i.email).trim().toLowerCase(),
            password: String(i.password || 'sos123_mudar'),
            name: String(i.name || 'Comprador'),
            registrationDate: String(i.registrationDate || new Date().toLocaleDateString('pt-BR')),
          }));
          if (valid.length > 0) { onImportBuyers(valid); alert(`${valid.length} compradores importados!`); }
          else alert('Nenhum comprador válido no arquivo.');
        } else alert('Formato de arquivo inválido.');
      } catch { alert('Erro ao ler o arquivo JSON.'); }
    };
    reader.readAsText(files[0]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadManual = () => {
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Acesso - ${customAppName}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Inter',sans-serif;background:#f8fafc;margin:0;padding:40px 20px;display:flex;justify-content:center}.container{max-width:600px;width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:24px;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,0.06)}.badge{background:#f5f0f9;color:#b388c4;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;padding:6px 14px;border-radius:99px;display:inline-block}h1{font-size:24px;font-weight:900;color:#0f172a;margin:14px 0 6px}.subtitle{font-size:14px;color:#64748b;margin:0}.step{display:flex;gap:14px;margin:16px 0}.step-num{background:#b388c4;color:#fff;width:24px;height:24px;border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}.step-content{font-size:13px;color:#475569;line-height:1.6}.step-title{font-weight:700;color:#1e293b;margin-bottom:4px}.url-box{font-family:monospace;font-size:12px;background:#f1f5f9;border:1px solid #e2e8f0;padding:10px;border-radius:8px;word-break:break-all;color:#475569;margin:8px 0}.btn{display:block;background:#b388c4;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:14px;border-radius:12px;text-align:center;margin-top:24px}.footer{text-align:center;margin-top:32px;font-size:11px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:20px}@media print{body{background:#fff}.no-print{display:none}}</style></head><body><div class="container"><div style="text-align:center;margin-bottom:28px"><div class="badge">Acesso Autorizado</div><h1>Bem-vindo ao ${customAppName}!</h1><p class="subtitle">Siga os passos abaixo para acessar sua conta</p></div><div class="step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Acesse o link oficial</div><div class="url-box">${customAppUrl}</div></div></div><div class="step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Faça seu login</div>Use o e-mail de compra e a senha provisória: <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;font-weight:700">CodE:1243</code></div></div><div class="step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Personalize sua senha</div>Clique em <strong>Senha</strong> no menu superior para criar uma senha pessoal.</div></div><a href="${customAppUrl}" class="btn no-print">Entrar Agora →</a><div class="footer">Suporte: <strong style="color:#b388c4">${customSupportEmail}</strong></div></div></body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `Manual_${customAppName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyTextManual = () => {
    const text = `📋 ACESSO - ${customAppName.toUpperCase()}\n\n1️⃣ Link: ${customAppUrl}\n2️⃣ E-mail: seu e-mail de compra\n3️⃣ Senha provisória: CodE:1243\n\nAlter a senha após o primeiro login.\nSuporte: ${customSupportEmail}`;
    navigator.clipboard.writeText(text);
    setIsCopiedManual(true);
    setTimeout(() => setIsCopiedManual(false), 3000);
  };

  const filteredBuyers = registeredBuyers.filter(b =>
    b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'clientes', label: 'Clientes', icon: <Users className="w-4 h-4" /> },
    { id: 'ferramentas', label: 'Ferramentas', icon: <FileText className="w-4 h-4" /> },
    { id: 'config', label: 'Config', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="animate-in fade-in duration-300 pb-8 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#1e293b] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#b388c4]" /> Painel Admin
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{registeredBuyers.length} cliente{registeredBuyers.length !== 1 ? 's' : ''} cadastrado{registeredBuyers.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-[#1e293b] text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5">
          <LockKeyhole className="w-3.5 h-3.5 text-[#b388c4]" /> Superadmin
        </div>
      </div>

      {/* INTERNAL TABS */}
      <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-2xl">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#b388c4] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: CLIENTES ── */}
      {activeTab === 'clientes' && (
        <div className="space-y-4">

          {/* Add Buyer */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
            <h3 className="font-bold text-sm text-[#1e293b] mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#b388c4]" /> Cadastrar Comprador
            </h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="relative">
                <input type="text" placeholder="Nome do cliente" value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 pr-10 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none" />
                <User className="w-3.5 h-3.5 text-gray-300 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <div className="relative">
                <input type="text" placeholder="E-mail de acesso" value={newEmail}
                  onChange={e => { setNewEmail(e.target.value); setError(null); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 pr-10 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none" />
                <Mail className="w-3.5 h-3.5 text-gray-300 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input type="text" placeholder="Senha de acesso" value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 pr-10 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none" />
                  <Key className="w-3.5 h-3.5 text-gray-300 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <button type="button" onClick={handleGeneratePassword}
                  className="px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl text-[11px] font-bold text-gray-500 transition-colors flex items-center gap-1 whitespace-nowrap">
                  <RefreshCw className="w-3 h-3 text-[#b388c4]" /> Gerar
                </button>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-700 text-[11px] p-3 rounded-xl border border-rose-100 flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 text-emerald-700 text-[11px] p-3 rounded-xl border border-emerald-100 flex gap-2 animate-in zoom-in duration-200">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" /> {success}
                </div>
              )}

              <button type="submit"
                className="w-full py-3 bg-[#b388c4] hover:bg-[#a174b2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
                Cadastrar e Ativar Acesso
              </button>
            </form>
          </div>

          {/* Buyer List */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-[#1e293b]">Compradores</h3>
              <span className="text-[10px] font-extrabold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {filteredBuyers.length}/{registeredBuyers.length}
              </span>
            </div>
            <div className="relative mb-3">
              <input type="text" placeholder="Pesquisar por nome ou e-mail..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none" />
              <Search className="w-3.5 h-3.5 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {filteredBuyers.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <Mail className="w-7 h-7 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Nenhum comprador cadastrado.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-0.5">
                {filteredBuyers.map((buyer, index) => {
                  const showPass = !!showPasswords[buyer.email];
                  return (
                    <div key={buyer.email}
                      className="bg-gray-50 rounded-2xl border border-gray-100 p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#1e293b] truncate">{buyer.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{buyer.email}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <button onClick={() => handleCopyCredentials(buyer, index)}
                            title="Copiar credenciais"
                            className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                            {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => onRemoveBuyer(buyer.email)}
                            title="Remover"
                            className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200/60 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Senha:</span>
                          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-gray-150">
                            <span className="font-mono text-[10px] font-bold text-gray-700">
                              {showPass ? buyer.password : '••••••••'}
                            </span>
                            <button onClick={() => setShowPasswords(p => ({ ...p, [buyer.email]: !p[buyer.email] }))}
                              className="text-gray-400 hover:text-gray-600 ml-0.5">
                              {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <span className="text-[9px] text-gray-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {buyer.registrationDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: FERRAMENTAS ── */}
      {activeTab === 'ferramentas' && (
        <div className="space-y-4">

          {/* Manual Generator */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#1e293b] flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-[#b388c4]" /> Manual de Acesso
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Gere o manual de boas-vindas para enviar aos compradores após o pagamento.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Nome do Aplicativo</label>
                <input type="text" value={customAppName} onChange={e => setCustomAppName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block mb-1">E-mail de Suporte</label>
                <input type="email" value={customSupportEmail} onChange={e => setCustomSupportEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block mb-1">URL do Aplicativo</label>
                <input type="text" value={customAppUrl} onChange={e => setCustomAppUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-mono focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button onClick={handleDownloadManual}
                className="w-full py-3 bg-[#b388c4] hover:bg-[#a174b2] text-white text-xs font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                <Download className="w-4 h-4" /> Baixar Manual (HTML → PDF)
              </button>
              <button onClick={handleCopyTextManual}
                className={`w-full py-2.5 border rounded-xl text-xs font-bold transition-colors flex justify-center items-center gap-2 ${
                  isCopiedManual ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}>
                {isCopiedManual ? <><Check className="w-3.5 h-3.5" /> Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar como Texto</>}
              </button>
            </div>

            <div className="bg-[#FDFBF7] border border-[#EAE0F1] rounded-2xl p-3.5 text-[10px] text-gray-500 leading-relaxed space-y-1">
              <p className="font-bold text-[#1e293b] text-[11px]">Como usar na Hotmart:</p>
              <p>1. Clique em <strong>Baixar Manual</strong> e abra o arquivo no navegador.</p>
              <p>2. Imprima → <strong>Salvar como PDF</strong>.</p>
              <p>3. No painel Hotmart, suba o PDF como conteúdo do produto.</p>
            </div>
          </div>

          {/* Backup */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <div>
              <h3 className="font-bold text-sm text-[#1e293b] flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-[#b388c4]" /> Backup de Dados
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Os dados ficam salvos no navegador. Exporte regularmente para não perder os compradores cadastrados.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleExportBackup}
                className="py-3 border border-gray-200 hover:bg-gray-50 text-[#1e293b] text-xs font-bold rounded-xl transition-colors flex justify-center items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-[#b388c4]" /> Exportar
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                className="py-3 border border-gray-200 hover:bg-gray-50 text-[#1e293b] text-xs font-bold rounded-xl transition-colors flex justify-center items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#b388c4]" /> Importar
              </button>
            </div>
            <input ref={fileInputRef} type="file" onChange={handleImportBackup} accept=".json" className="hidden" />
          </div>
        </div>
      )}

      {/* ── TAB: CONFIG ── */}
      {activeTab === 'config' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#1e293b] flex items-center gap-2 mb-1">
                <LockKeyhole className="w-4 h-4 text-[#b388c4]" /> Senha do Superadmin
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Altere a senha de acesso da conta administradora.
              </p>
            </div>
            <form onSubmit={handleUpdateAdminPassword} className="space-y-3">
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  placeholder="Nova senha do superadmin"
                  value={adminPasswordInput}
                  onChange={e => { setAdminPasswordInput(e.target.value); setAdminError(null); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none"
                />
                <button type="button" onClick={() => setShowAdminPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {adminError && (
                <div className="bg-rose-50 text-rose-700 text-[11px] p-3 rounded-xl border border-rose-100 flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {adminError}
                </div>
              )}
              {adminSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-[11px] p-3 rounded-xl border border-emerald-100 flex gap-2 animate-in zoom-in duration-200">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" /> {adminSuccess}
                </div>
              )}
              <button type="submit"
                className="w-full py-3 bg-[#1e293b] hover:bg-[#2c3d52] text-white text-xs font-bold rounded-xl transition-colors">
                Atualizar Senha
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="bg-[#FDFBF7] border border-[#EAE0F1] p-4 rounded-2xl space-y-2">
            <p className="text-[11px] font-bold text-[#1e293b] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#b388c4]" /> Como testar o acesso?
            </p>
            <div className="text-[10px] text-gray-500 leading-relaxed space-y-1">
              <p>1. Na aba <strong>Clientes</strong>, cadastre um comprador com e-mail e senha.</p>
              <p>2. Clique no ícone <Copy className="w-3 h-3 inline" /> para copiar as credenciais.</p>
              <p>3. Faça <strong>Logout</strong> e entre com a conta do comprador.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
