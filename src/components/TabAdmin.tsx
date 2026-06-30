import React, { useState, useRef } from 'react';
import { 
  UserPlus, 
  Trash2, 
  Mail, 
  Users, 
  Search, 
  AlertCircle, 
  ShieldCheck, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Key, 
  User, 
  RefreshCw, 
  LockKeyhole,
  Calendar,
  Cpu,
  Terminal,
  Code,
  Zap,
  Sparkles,
  FileText,
  BookOpen,
  ExternalLink,
  FileArchive
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

export default function TabAdmin({ 
  registeredBuyers, 
  onAddBuyer, 
  onRemoveBuyer, 
  superadminEmail,
  superadminPassword,
  onChangeSuperadminPassword,
  onImportBuyers
}: TabAdminProps) {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPasswordInput, setShowAdminPasswordInput] = useState(false);
  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Webhook Simulation states
  const [selectedPlatform, setSelectedPlatform] = useState<'hotmart' | 'kiwify' | 'stripe'>('hotmart');
  const [sandboxName, setSandboxName] = useState('');
  const [sandboxEmail, setSandboxEmail] = useState('');
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [sandboxSuccess, setSandboxSuccess] = useState(false);

  // Hotmart Delivery Manual Generator
  const [customAppName, setCustomAppName] = useState('SOS Ansiedade');
  const [customSupportEmail, setCustomSupportEmail] = useState('maxiakiki@hotmail.com');
  const [customAppUrl, setCustomAppUrl] = useState('https://app-s-o-s-ansiedad-pt-app.vercel.app/');
  const [isCopiedManual, setIsCopiedManual] = useState(false);

  const handleDownloadManual = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instruções de Acesso - ${customAppName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 40px 20px;
      line-height: 1.6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      max-width: 650px;
      width: 100%;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
      box-sizing: border-box;
    }
    .header {
      text-align: center;
      margin-bottom: 35px;
    }
    .badge {
      background-color: #f5f0f9;
      color: #b388c4;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 6px 14px;
      border-radius: 99px;
      display: inline-block;
    }
    h1 {
      font-size: 26px;
      font-weight: 900;
      color: #0f172a;
      margin: 16px 0 8px 0;
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }
    .card-info {
      background-color: #fdfbf7;
      border: 1px solid #eae0f1;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 30px;
      text-align: center;
    }
    .card-info h3 {
      margin: 0 0 6px 0;
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
    }
    .card-info p {
      margin: 0;
      font-size: 13px;
      color: #475569;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: #b388c4;
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 12px;
      transition: background-color 0.2s;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(179, 136, 196, 0.2);
    }
    .btn-primary:hover {
      background-color: #a174b2;
    }
    .url-box {
      font-family: monospace;
      font-size: 12px;
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 10px;
      border-radius: 8px;
      word-break: break-all;
      color: #475569;
      margin: 12px 0;
    }
    .step {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }
    .step-num {
      background-color: #b388c4;
      color: #ffffff;
      width: 24px;
      height: 24px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .step-content {
      font-size: 13px;
      color: #475569;
    }
    .step-title {
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
    }
    .print-btn-container {
      margin-top: 30px;
      text-align: center;
    }
    .btn-secondary {
      background-color: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      background-color: #e2e8f0;
      color: #1e293b;
    }
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Acesso Autorizado</div>
      <h1>Seu Aplicativo está Pronto!</h1>
      <p class="subtitle">Manual de Acesso do Aluno para o ${customAppName}</p>
    </div>

    <div class="card-info">
      <h3>Parabéns pela sua aquisição!</h3>
      <p>Siga o passo a passo abaixo para acessar imediatamente a sua área de membros exclusiva e todas as ferramentas interativas.</p>
    </div>

    <div class="section-title">Passos para o Acesso</div>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-content">
        <div class="step-title">Acesse o Link Oficial</div>
        Abra o seu navegador de internet no celular, tablet ou computador e acesse o endereço abaixo:
        <div class="url-box">${customAppUrl}</div>
      </div>
    </div>

    <div class="step">
      <div class="step-num">2</div>
      <div class="step-content">
        <div class="step-title">Insira as suas Credenciais</div>
        Utilize o <strong>E-mail</strong> com o qual você realizou a compra na Hotmart para fazer o seu primeiro login.<br>
        Sua senha temporária padrão de acesso é: <code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:700;">CodE:1243</code> (você poderá alterá-la para uma senha pessoal no seu primeiro login).
      </div>
    </div>

    <div class="step">
      <div class="step-num">3</div>
      <div class="step-content">
        <div class="step-title">Personalize sua Senha</div>
        Ao entrar pela primeira vez, toque no botão <strong>Senha</strong> no menu superior para cadastrar uma senha pessoal e segura de sua preferência.
      </div>
    </div>

    <div class="print-btn-container no-print">
      <a href="${customAppUrl}" target="_blank" class="btn-primary" style="margin-bottom: 12px; color: white;">Entrar no Aplicativo Agora</a>
      <button onclick="window.print()" class="btn-secondary" style="width: 100%; justify-content: center;">
        🖨️ Salvar como PDF / Imprimir Manual
      </button>
    </div>

    <div class="footer">
      Dúvidas ou problemas para acessar? Entre em contato com o nosso suporte através do e-mail: <br>
      <strong style="color: #b388c4;">${customSupportEmail}</strong>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Manual_Acesso_${customAppName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyTextManual = () => {
    const text = `📋 MANUAL DE ACESSO - ${customAppName.toUpperCase()}

Parabéns pela sua compra! Siga as instruções abaixo para acessar seu aplicativo de controle de ansiedade:

1️⃣ LINK DE ACESSO:
Acesse o endereço abaixo pelo seu celular, tablet ou computador:
👉 ${customAppUrl}

2️⃣ SEUS DADOS DE ACESSO:
• E-mail: Utilize o mesmo e-mail de compra cadastrado na Hotmart.
• Senha Padrão Provisória: CodE:1243

3️⃣ ALTERAR SENHA:
Para sua segurança, clique no botão "Senha" no canto superior direito dentro da ferramenta e mude para uma senha pessoal de sua preferência!

Suporte técnico pelo e-mail: ${customSupportEmail}`;

    navigator.clipboard.writeText(text);
    setIsCopiedManual(true);
    setTimeout(() => setIsCopiedManual(false), 3000);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSimulateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxEmail.trim()) {
      alert('Por favor, insira um e-mail de teste.');
      return;
    }
    if (!validateEmail(sandboxEmail.trim())) {
      alert('Por favor, insira um e-mail com formato válido.');
      return;
    }

    setIsSimulating(true);
    setSandboxSuccess(false);
    setSandboxLogs([]);

    const email = sandboxEmail.trim().toLowerCase();
    const name = sandboxName.trim() || 'Comprador Automático';

    // Simulated log steps with slight timeout intervals
    const steps = [
      `⏱️ [${new Date().toLocaleTimeString()}] Recebendo requisição POST de webhook da plataforma ${selectedPlatform.toUpperCase()}...`,
      `🔑 [${new Date().toLocaleTimeString()}] Autenticando assinatura do cabeçalho da requisição (Sec-Signature)... Autorizado!`,
      `📦 [${new Date().toLocaleTimeString()}] Extraindo dados do cliente: E-mail: "${email}", Nome: "${name}", Produto ID: "sos_ansiedade_vitalicio"`,
      `⚡ [${new Date().toLocaleTimeString()}] Verificando status da compra... Status recebido: "approved" / "paid"`,
      `🔍 [${new Date().toLocaleTimeString()}] Verificando se o comprador já existe no banco de dados...`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSandboxLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Final action
        if (registeredBuyers.some(b => b.email.toLowerCase() === email) || email === superadminEmail.toLowerCase()) {
          setSandboxLogs(prev => [
            ...prev,
            `⚠️ [${new Date().toLocaleTimeString()}] Conflito: O e-mail "${email}" já está cadastrado no sistema. Pulando criação automática.`
          ]);
          setIsSimulating(false);
        } else {
          // Generate password
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let generatedPass = '';
          for (let i = 0; i < 8; i++) {
            generatedPass += chars.charAt(Math.floor(Math.random() * chars.length));
          }

          const automatedBuyer: Buyer = {
            email,
            name,
            password: generatedPass,
            registrationDate: new Date().toLocaleDateString('pt-BR')
          };

          onAddBuyer(automatedBuyer);

          setSandboxLogs(prev => [
            ...prev,
            `✅ [${new Date().toLocaleTimeString()}] Sucesso: Novo cliente criado automaticamente!`,
            `🔑 [${new Date().toLocaleTimeString()}] Credenciais criadas -> E-mail: "${email}" / Senha provisória: "${generatedPass}"`,
            `✉️ [${new Date().toLocaleTimeString()}] E-mail com credenciais e link de login enviado ao cliente via API de e-mail integrado.`
          ]);
          setIsSimulating(false);
          setSandboxSuccess(true);
        }
      }
    }, 450);
  };

  // Auto-generate a secure random password
  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const email = newEmail.trim().toLowerCase();
    const name = newName.trim() || 'Comprador';
    const password = newPassword.trim();

    if (!email) {
      setError('Por favor, digite o e-mail do comprador.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail com formato válido.');
      return;
    }

    if (email === superadminEmail.toLowerCase()) {
      setError('O e-mail do superadmin já possui acesso vitalício por padrão.');
      return;
    }

    if (registeredBuyers.some(b => b.email.toLowerCase() === email)) {
      setError('Este e-mail já está registrado na lista de compradores.');
      return;
    }

    if (!password) {
      setError('Por favor, defina ou gere uma senha para o comprador.');
      return;
    }

    if (password.length < 4) {
      setError('A senha de segurança deve conter no mínimo 4 caracteres.');
      return;
    }

    const newBuyer: Buyer = {
      email,
      name,
      password,
      registrationDate: new Date().toLocaleDateString('pt-BR')
    };

    onAddBuyer(newBuyer);
    setNewEmail('');
    setNewName('');
    setNewPassword('');
    setSuccess(`Comprador "${name}" registrado com sucesso!`);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleUpdateAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);

    const pass = adminPasswordInput.trim();
    if (!pass) {
      setAdminError('A nova senha não pode estar vazia.');
      return;
    }

    if (pass.length < 4) {
      setAdminError('A senha do superadmin deve conter no mínimo 4 caracteres.');
      return;
    }

    onChangeSuperadminPassword(pass);
    setAdminPasswordInput('');
    setAdminSuccess('Senha do Superadmin atualizada com sucesso!');
    setTimeout(() => setAdminSuccess(null), 3000);
  };

  const togglePasswordVisibility = (email: string) => {
    setShowPasswords(prev => ({ ...prev, [email]: !prev[email] }));
  };

  const handleCopyCredentials = (buyer: Buyer, index: number) => {
    const appUrl = window.location.origin;
    const message = `Olá, *${buyer.name}*!\n\nAqui estão suas credenciais para acessar o aplicativo *S.O.S Ansiedade*:\n\n🌐 *Link de Acesso:* ${appUrl}\n📧 *E-mail:* ${buyer.email}\n🔑 *Senha:* ${buyer.password}\n\nGuarde com segurança e respire fundo! 🌸`;
    
    navigator.clipboard.writeText(message).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Database Export
  const handleExportBackup = () => {
    const dataStr = JSON.stringify(registeredBuyers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_sos_compradores_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Database Import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Validate structure
          const validBuyers: Buyer[] = parsed.filter(item => {
            return item && typeof item === 'object' && 'email' in item;
          }).map(item => ({
            email: String(item.email).trim().toLowerCase(),
            password: String(item.password || 'sos123_mudar'),
            name: String(item.name || 'Comprador'),
            registrationDate: String(item.registrationDate || new Date().toLocaleDateString('pt-BR'))
          }));

          if (validBuyers.length > 0) {
            onImportBuyers(validBuyers);
            alert(`Sucesso! ${validBuyers.length} compradores foram importados e mesclados com o banco de dados local.`);
          } else {
            alert('Erro: Nenhum registro de comprador válido encontrado no arquivo JSON.');
          }
        } else {
          alert('Erro: O arquivo de backup selecionado não está em um formato de lista válido.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo JSON. Certifique-se de que é um arquivo de backup válido gerado por este painel.');
      }
    };
    fileReader.readAsText(files[0]);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredBuyers = registeredBuyers.filter(buyer =>
    buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl font-black text-[#1e293b] mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#b388c4]" /> Painel Administrativo
        </h2>
        <p className="text-gray-400 text-xs font-medium">
          Gerencie o cadastro de compradores, senhas de segurança e realize backups locais do sistema.
        </p>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-[#F5EFFF] text-[#b388c4] rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Clientes</span>
            <span className="text-lg font-black text-[#1e293b]">{registeredBuyers.length}</span>
          </div>
        </div>
        <div className="bg-[#1e293b] p-4 rounded-2xl text-white flex items-center gap-3.5 shadow-sm">
          <div className="p-3 bg-white/15 text-[#b388c4] rounded-xl">
            <LockKeyhole className="w-5 h-5 text-[#b388c4]" />
          </div>
          <div>
            <span className="text-[10px] text-gray-300 font-extrabold uppercase block tracking-wider">Acesso</span>
            <span className="text-xs font-black text-gray-100 block truncate max-w-[120px]">Superadmin</span>
          </div>
        </div>
      </div>

      {/* REGISTER NEW BUYER FORM */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden">
        <h3 className="font-bold text-sm text-[#1e293b] mb-3.5 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-[#b388c4]" /> Cadastrar Novo Comprador
        </h3>
        
        <form onSubmit={handleAdd} className="space-y-3.5">
          {/* Buyer Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Nome do Cliente</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 pr-10 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Buyer Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">E-mail de Acesso</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: joao@gmail.com"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setError(null);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 pr-10 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Buyer Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Senha de Segurança</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Defina uma senha ou gere ao lado"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 pr-10 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Key className="w-4 h-4" />
                </div>
              </div>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl text-[11px] font-bold text-gray-600 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#b388c4]" /> Gerar
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-800 text-[11px] p-3 rounded-xl border border-rose-100 flex gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-800 text-[11px] p-3 rounded-xl border border-emerald-100 flex gap-2 font-medium animate-in zoom-in duration-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#b388c4] hover:bg-[#a174b2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex justify-center items-center gap-2"
          >
            Cadastrar Comprador e Ativar
          </button>
        </form>
      </div>

      {/* REGISTERED BUYERS LIST */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm text-[#1e293b]">Compradores Cadastrados</h3>
          <span className="text-[10px] text-gray-400 font-extrabold">{filteredBuyers.length} de {registeredBuyers.length}</span>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Pesquisar por nome ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* LIST */}
        {filteredBuyers.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400 italic">Nenhum comprador cadastrado.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredBuyers.map((buyer, index) => {
              const isShowingPass = !!showPasswords[buyer.email];
              return (
                <div 
                  key={buyer.email} 
                  className="bg-gray-50 p-3 rounded-2xl border border-gray-150/50 hover:bg-gray-100/30 transition-colors animate-in slide-in-from-bottom-1 duration-150 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="truncate">
                      <h4 className="text-xs font-black text-[#1e293b] truncate">{buyer.name}</h4>
                      <p className="text-[10px] text-gray-500 font-medium truncate">{buyer.email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyCredentials(buyer, index)}
                        title="Copiar mensagem com dados de acesso"
                        className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onRemoveBuyer(buyer.email)}
                        title="Excluir comprador"
                        className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200/60 pt-2 text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-bold uppercase tracking-wider">Senha:</span>
                      <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-md border border-gray-150">
                        <span className="font-mono font-bold text-gray-700">
                          {isShowingPass ? buyer.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(buyer.email)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {isShowingPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-gray-400 font-bold flex items-center gap-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{buyer.registrationDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUPERADMIN PASSWORD CONFIGURATION */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
        <h3 className="font-bold text-sm text-[#1e293b] mb-1.5 flex items-center gap-2">
          <LockKeyhole className="w-4 h-4 text-[#b388c4]" /> Segurança do Superadmin
        </h3>
        <p className="text-[11px] text-gray-400 mb-4 font-medium leading-relaxed">
          Altere a senha de acesso padrão (<span className="font-bold">admin123</span>) para a sua segurança exclusiva.
        </p>

        <form onSubmit={handleUpdateAdminPassword} className="space-y-3.5">
          <div className="relative">
            <input
              type={showAdminPasswordInput ? 'text' : 'password'}
              placeholder="Digite a nova senha do superadmin"
              value={adminPasswordInput}
              onChange={(e) => {
                setAdminPasswordInput(e.target.value);
                setAdminError(null);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowAdminPasswordInput(!showAdminPasswordInput)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showAdminPasswordInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {adminError && (
            <div className="bg-rose-50 text-rose-800 text-[11px] p-2.5 rounded-xl border border-rose-100 flex gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          {adminSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-xl border border-emerald-100 flex gap-2 font-medium animate-in zoom-in duration-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{adminSuccess}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1e293b] hover:bg-[#2c3d52] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Atualizar Senha de Administrador
          </button>
        </form>
      </div>

      {/* DATABASE EXPORT / IMPORT CONTROLS */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3.5">
        <div>
          <h3 className="font-bold text-sm text-[#1e293b] mb-1 flex items-center gap-2">
            Backup & Restauração
          </h3>
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
            Como os dados são salvos de forma offline no seu navegador, exporte backups regularmente para não perder os clientes cadastrados.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExportBackup}
            className="py-2.5 border border-gray-200 hover:bg-gray-50 text-[#1e293b] text-xs font-bold rounded-xl transition-colors flex justify-center items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#b388c4]" /> Exportar Backup
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 border border-gray-200 hover:bg-gray-50 text-[#1e293b] text-xs font-bold rounded-xl transition-colors flex justify-center items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-[#b388c4]" /> Importar Backup
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* WEBHOOK AUTOMATION AND INTEGRATION PLAYGROUND */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-[#1e293b] mb-1 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#b388c4]" /> Automação de Vendas (Webhooks)
          </h3>
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
            Integre seu aplicativo com Hotmart, Kiwify ou Stripe. Quando um cliente compra, a plataforma avisa o aplicativo e cria o acesso instantaneamente.
          </p>
        </div>

        {/* Platform Selection Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-xl border border-gray-150">
          {(['hotmart', 'kiwify', 'stripe'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setSelectedPlatform(p);
                setSandboxSuccess(false);
                setSandboxLogs([]);
              }}
              className={`py-1.5 text-[10px] font-black rounded-lg uppercase tracking-wider transition-all ${
                selectedPlatform === p
                  ? 'bg-white text-[#b388c4] shadow-xs border border-gray-100'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Explanation and Webhook Info */}
        <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-150 text-[10px] space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-gray-400 uppercase tracking-wide">Endpoint de Produção</span>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.2 rounded uppercase">Ativo</span>
          </div>
          <div className="flex gap-2">
            <code className="bg-gray-100 px-2 py-1.5 rounded-lg font-mono text-gray-600 flex-1 break-all select-all border border-gray-150">
              {window.location.origin}/api/webhooks/{selectedPlatform}
            </code>
          </div>
          <p className="text-[9px] text-gray-400 leading-normal">
            *Configure esta URL no painel de desenvolvedor da sua plataforma para automatizar o cadastro de novos membros.
          </p>
        </div>

        {/* Webhook Sandbox Form */}
        <form onSubmit={handleSimulateWebhook} className="space-y-3 pt-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Simulador de Eventos (Sandbox)</span>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase block">Nome do Cliente</label>
              <input
                type="text"
                placeholder="Ex: Clara Lima"
                value={sandboxName}
                onChange={(e) => setSandboxName(e.target.value)}
                disabled={isSimulating}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all disabled:opacity-60"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase block">E-mail do Cliente</label>
              <input
                type="email"
                placeholder="Ex: clara@hotmail.com"
                value={sandboxEmail}
                onChange={(e) => setSandboxEmail(e.target.value)}
                disabled={isSimulating}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSimulating}
            className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors flex justify-center items-center gap-1.5 ${
              isSimulating
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#b388c4] hover:bg-[#a174b2] text-white'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processando Webhook...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Simular Compra Aprovada
              </>
            )}
          </button>
        </form>

        {/* Sandbox Console Output */}
        {sandboxLogs.length > 0 && (
          <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-250">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-gray-400" /> Console do Servidor (Logs de Execução)
            </span>
            <div className="bg-[#1e293b] text-gray-100 font-mono text-[9px] p-3 rounded-2xl border border-gray-800 space-y-1 max-h-[140px] overflow-y-auto leading-relaxed scrollbar-thin">
              {sandboxLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap select-all">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HOTMART PRODUCT CONTENT & ACCESS MANUAL KIT */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-5">
        <div>
          <span className="text-[9px] font-black bg-[#f5f0f9] text-[#b388c4] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Entrega de Conteúdo (Hotmart)
          </span>
          <h3 className="font-bold text-sm text-[#1e293b] mt-2 mb-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#b388c4]" /> Kit de Publicação: Conteúdo do Produto
          </h3>
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
            Configure o que o comprador receberá na Hotmart ao aprovar o pagamento. Você pode gerar o <strong>Manual de Instruções e Acesso (PDF)</strong> com um único clique!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Settings Column */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-gray-400" /> Customizar Manual
            </h4>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Nome do Aplicativo</label>
                <input
                  type="text"
                  value={customAppName}
                  onChange={(e) => setCustomAppName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all"
                  placeholder="Nome do produto"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">E-mail de Suporte ao Aluno</label>
                <input
                  type="email"
                  value={customSupportEmail}
                  onChange={(e) => setCustomSupportEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all"
                  placeholder="E-mail de suporte"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">URL do Aplicativo (Link de Produção)</label>
                <input
                  type="text"
                  value={customAppUrl}
                  onChange={(e) => setCustomAppUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#b388c4] focus:border-[#b388c4] focus:outline-none transition-all font-mono"
                  placeholder="URL de acesso"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadManual}
                className="w-full py-2.5 bg-[#b388c4] hover:bg-[#a174b2] text-white text-xs font-black rounded-xl transition-all shadow-xs flex justify-center items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Baixar Manual em HTML
              </button>

              <button
                type="button"
                onClick={handleCopyTextManual}
                className={`w-full py-2 border rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1.5 ${
                  isCopiedManual
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {isCopiedManual ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Texto Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-400" /> Copiar Manual em Texto
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guidelines & Live Preview Column */}
          <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-150 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#b388c4]" /> Como entregar na Hotmart?
              </h4>
              <ul className="text-[10px] space-y-1.5 text-gray-500 leading-relaxed font-medium">
                <li className="flex gap-1.5">
                  <span className="text-[#b388c4] font-bold">1.</span>
                  <span>Clique em <strong>Baixar Manual em HTML</strong>.</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-[#b388c4] font-bold">2.</span>
                  <span>Abra o arquivo baixado no seu navegador de internet.</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-[#b388c4] font-bold">3.</span>
                  <span>Pressione o botão <strong>Salvar como PDF</strong> para salvá-lo no formato correto exigido pela Hotmart.</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-[#b388c4] font-bold">4.</span>
                  <span>No painel da Hotmart (da imagem), clique em <strong>Selecionar Arquivo</strong> e envie o PDF gerado!</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-3 border border-gray-200/60 shadow-2xs space-y-2">
              <span className="text-[8px] font-black bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit">
                Exportação Alternativa (ZIP)
              </span>
              <p className="text-[9px] text-gray-400 leading-relaxed font-medium">
                Se preferir vender os arquivos para download offline: abra as <strong>Configurações do AI Studio</strong> (menu esquerdo) e selecione <strong>Exportar ZIP</strong>. Note que a autenticação em nuvem e troca de senhas requerem o uso do link online no PDF!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEED/SYSTEM INFO BOX */}
      <div className="bg-[#FDFBF7] border border-[#EAE0F1] p-4.5 rounded-2xl text-xs space-y-1.5 text-gray-600">
        <p className="font-extrabold text-[#1e293b] flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-[#b388c4]" /> Como testar o controle de acesso?
        </p>
        <p className="leading-relaxed">
          1. Preencha o <strong>Nome</strong>, <strong>E-mail</strong> e defina uma senha (ou clique em <strong>Gerar</strong>) para um novo comprador.<br />
          2. Clique em <strong>Cadastrar Comprador e Ativar</strong>.<br />
          3. O cliente aparecerá na lista abaixo, onde você pode copiar uma mensagem pré-formatada para enviar para ele clicando no ícone de cópia (<Copy className="w-3 h-3 inline" />).<br />
          4. Clique no botão de <strong>Sair</strong> no topo superior direito, e use a conta do comprador cadastrado para fazer login!
        </p>
      </div>
    </div>
  );
}
