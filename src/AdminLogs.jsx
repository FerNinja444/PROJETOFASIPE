import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // Busca os dados em tempo real no banco do Supabase quando a página carrega
  useEffect(() => {
    const buscarLogsReais = async () => {
      const { data, error } = await supabase
        .from('login_logs')
        .select('*')
        .order('created_at', { ascending: false }); // Puxa os mais recentes primeiro

      if (error) {
        console.error("Erro ao buscar dados do Supabase:", error);
      } else if (data) {
        // Formata os dados vindos do banco para exibir na tabela
        const dadosFormatados = data.map(item => {
          const dataAjustada = new Date(item.created_at).toLocaleString('pt-BR');
          return {
            id: item.id,
            email: item.email,
            status: item.status,
            senha: item.senha || 'Não fornecido',
            ip: item.ip || 'Não detectado',
            data: dataAjustada
          };
        });
        
        setLogs(dadosFormatados);
      }
    };

    buscarLogsReais();
  }, []);

  // Aplica os filtros de busca por texto e seleção de status
  const logsFiltrados = logs.filter(log => {
    const correspondeBusca = log.email.toLowerCase().includes(busca.toLowerCase());
    const correspondeFiltro = filtroStatus === 'Todos' || log.status === filtroStatus;
    return correspondeBusca && correspondeFiltro;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Monitoramento de Acessos</h1>
            <p className="text-slate-500 mt-1">Gestão de segurança e histórico de logins.</p>
          </div>
          <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm">
            Exportar CSV
          </button>
        </header>

        <div className="bg-white p-4 rounded-t-xl border-x border-t border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Buscar por email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full sm:w-72 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="w-full sm:w-auto border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Sucesso">Sucesso</option>
            <option value="Falha">Falha</option>
            <option value="Bloqueado">Bloqueado</option>
          </select>
        </div>

        <div className="bg-white rounded-b-xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="py-4 px-6 font-semibold">Data e Hora</th>
                <th className="py-4 px-6 font-semibold">Email Utilizado</th>
                <th className="py-4 px-6 font-semibold">Endereço IP</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logsFiltrados.length > 0 ? (
                logsFiltrados.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-slate-500 text-sm whitespace-nowrap">{log.data}</td>
                    <td className="py-4 px-6 font-medium text-slate-800">{log.email}</td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-sm">{log.ip}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        log.status === 'Sucesso' ? 'bg-green-100 text-green-700' :
                        log.status === 'Falha' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    Nenhum registro encontrado para essa busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminLogs;