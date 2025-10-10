import React, { useState, useEffect } from "react";

export default function Todo() {
  // Estado principal com inicialização segura
  const [listas, setListas] = useState(() => {
    try {
      const saved = localStorage.getItem("listas");
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Erro ao carregar listas:", error);
      return {};
    }
  });

  const [listaAtiva, setListaAtiva] = useState(() => {
    const saved = localStorage.getItem("listaAtiva");
    return saved || "";
  });

  const [novaTarefa, setNovaTarefa] = useState("");
  const [novoLink, setNovoLink] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [prioridade, setPrioridade] = useState("normal");
  const [mensagem, setMensagem] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [filtro, setFiltro] = useState("incompletas");
  const [animando, setAnimando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  
  // Novos estados para melhorias
  const [busca, setBusca] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [ordenacao, setOrdenacao] = useState("recente");

  // Adicionar estilo CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      /* Scrollbar customizada suave */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(75, 85, 99, 0.3);
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.5);
        border-radius: 10px;
        transition: background 0.3s ease;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(156, 163, 175, 0.8);
      }
      
      /* Firefox */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) rgba(75, 85, 99, 0.3);
      }
      
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(-20px);
        }
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-out {
        animation: slideOut 0.2s ease-out forwards;
      }
      
      .animate-in {
        animation: slideIn 0.3s ease-out forwards;
      }

      /* Dark mode transitions */
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem("listas", JSON.stringify(listas));
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMensagem("Erro ao salvar dados localmente");
    }
  }, [listas]);

  // Salvar dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Salvar lista ativa
  useEffect(() => {
    if (listaAtiva) {
      localStorage.setItem("listaAtiva", listaAtiva);
    }
  }, [listaAtiva]);

  // Definir lista ativa inicial
  useEffect(() => {
    if (!listaAtiva && Object.keys(listas).length > 0) {
      setListaAtiva(Object.keys(listas)[0]);
      setFiltro("lista");
    }
  }, [listas, listaAtiva]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl + N = Nova tarefa
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (filtro !== "incompletas" && filtro !== "concluidas" && filtro !== "importantes") {
          setModalAberto(true);
        }
      }
      // Ctrl + / = Focar busca (apenas nas categorias globais)
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        if (filtro !== "lista") {
          document.getElementById('busca-input')?.focus();
        }
      }
      // Escape = Fechar modal
      if (e.key === 'Escape') {
        setModalAberto(false);
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [filtro]);

  // Gerar ID único
  function gerarId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Função para calcular estatísticas
  function calcularEstatisticas() {
    const todasTarefas = [];
    Object.keys(listas).forEach(nomeLista => {
      todasTarefas.push(...listas[nomeLista]);
    });

    const hoje = new Date().toDateString();
    return {
      total: todasTarefas.length,
      incompletas: todasTarefas.filter(t => !t.concluida).length,
      concluidas: todasTarefas.filter(t => t.concluida).length,
      importantes: todasTarefas.filter(t => t.importante).length,
      concluidasHoje: todasTarefas.filter(t => 
        t.concluida && new Date(t.criadaEm).toDateString() === hoje
      ).length
    };
  }

  // Nova função para obter tarefas com busca e ordenação
  function obterTarefasGlobais() {
    let tarefas = [];
    
    // Buscar tarefas baseado no contexto
    if (filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes") {
      Object.keys(listas).forEach(nomeLista => {
        listas[nomeLista].forEach((tarefa, index) => {
          tarefas.push({
            ...tarefa,
            nomeLista,
            indexOriginal: index,
            listaOriginal: nomeLista
          });
        });
      });

      tarefas = tarefas.filter((tarefa) => {
        if (filtro === "incompletas") return !tarefa.concluida;
        if (filtro === "concluidas") return tarefa.concluida;
        if (filtro === "importantes") return tarefa.importante;
        return false;
      });
      
      // Aplicar busca APENAS nas categorias globais
      if (busca.trim()) {
        const termoBusca = busca.toLowerCase().trim();
        tarefas = tarefas.filter(tarefa => 
          tarefa.texto.toLowerCase().includes(termoBusca) ||
          tarefa.descricao?.toLowerCase().includes(termoBusca) ||
          tarefa.nomeLista.toLowerCase().includes(termoBusca)
        );
      }
    } else {
      // Quando está em uma lista específica, não aplicar busca
      tarefas = (listas[listaAtiva] || []).map((tarefa, index) => ({
        ...tarefa,
        nomeLista: listaAtiva,
        indexOriginal: index,
        listaOriginal: listaAtiva
      }));
    }

    // Aplicar ordenação
    tarefas.sort((a, b) => {
      switch (ordenacao) {
        case "alfabetica":
          return a.texto.localeCompare(b.texto);
        case "prioridade":
          const prioridades = { alta: 3, normal: 2, baixa: 1 };
          return (prioridades[b.prioridade] || 2) - (prioridades[a.prioridade] || 2);
        case "prazo":
          if (!a.prazo && !b.prazo) return 0;
          if (!a.prazo) return 1;
          if (!b.prazo) return -1;
          return new Date(a.prazo) - new Date(b.prazo);
        case "recente":
        default:
          return new Date(b.criadaEm || 0) - new Date(a.criadaEm || 0);
      }
    });

    return tarefas;
  }

  // Função para obter título
  function obterTituloAtual() {
    if (filtro === "incompletas") return "Incompletas";
    if (filtro === "concluidas") return "Concluídas";
    if (filtro === "importantes") return "Importantes";
    return listaAtiva;
  }

  // Adicionar tarefa
  function adicionarTarefa() {
    const texto = novaTarefa.trim();
    
    if (!listaAtiva) {
      setMensagem("Selecione uma lista primeiro!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    if (texto === "") {
      setMensagem("Digite uma tarefa para adicioná-la a sua lista!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const link = novoLink.trim();
    
    if (link && !link.match(/^https?:\/\//)) {
      setMensagem("Link inválido! Use http:// ou https://");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const nova = {
      id: gerarId(),
      texto,
      link: link || "",
      descricao: novaDescricao.trim() || "",
      prazo: prazo || "",
      prioridade: prioridade,
      concluida: false,
      importante: false,
      criadaEm: new Date().toISOString(),
    };

    setListas({
      ...listas,
      [listaAtiva]: [...(listas[listaAtiva] || []), nova],
    });
    
    setMensagem("Tarefa adicionada com sucesso!");
    setNovaTarefa("");
    setNovoLink("");
    setNovaDescricao("");
    setPrazo("");
    setPrioridade("normal");
    setModalAberto(false);
    setTimeout(() => setMensagem(""), 3000);
  }

  // Adicionar tarefa rápida
  function adicionarTarefaRapida() {
    const texto = novaTarefa.trim();
    
    if (!listaAtiva) {
      setMensagem("Selecione uma lista primeiro!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    if (texto === "") {
      setMensagem("Digite uma tarefa para adicioná-la a sua lista!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const nova = {
      id: gerarId(),
      texto,
      link: "",
      descricao: "",
      prazo: "",
      prioridade: "normal",
      concluida: false,
      importante: false,
      criadaEm: new Date().toISOString(),
    };

    setListas({
      ...listas,
      [listaAtiva]: [...(listas[listaAtiva] || []), nova],
    });
    
    setMensagem("Tarefa adicionada com sucesso!");
    setNovaTarefa("");
    setTimeout(() => setMensagem(""), 3000);
  }

  // Funções para operações em tarefas
  function toggleConcluida(tarefa) {
    const novas = [...listas[tarefa.listaOriginal]];
    novas[tarefa.indexOriginal].concluida = !novas[tarefa.indexOriginal].concluida;
    setListas({
      ...listas,
      [tarefa.listaOriginal]: novas,
    });
  }

  function toggleImportante(tarefa) {
    const novas = [...listas[tarefa.listaOriginal]];
    novas[tarefa.indexOriginal].importante = !novas[tarefa.indexOriginal].importante;
    setListas({
      ...listas,
      [tarefa.listaOriginal]: novas,
    });
  }

  function removerTarefa(tarefa) {
    const novas = [...listas[tarefa.listaOriginal]];
    novas.splice(tarefa.indexOriginal, 1);
    setListas({
      ...listas,
      [tarefa.listaOriginal]: novas,
    });
  }

  function editarTarefa(tarefa) {
    const novoTexto = prompt("Edite a tarefa:", tarefa.texto);
    
    if (novoTexto && novoTexto.trim() !== "") {
      const novas = [...listas[tarefa.listaOriginal]];
      novas[tarefa.indexOriginal] = {
        ...novas[tarefa.indexOriginal],
        texto: novoTexto.trim(),
      };
      setListas({
        ...listas,
        [tarefa.listaOriginal]: novas,
      });
    }
  }

  // Limpar tudo
  function limparTudo() {
    if (!listas[listaAtiva] || listas[listaAtiva].length === 0) {
      setMensagem("Não há nada para limpar!");
    } else {
      if (window.confirm("Deseja limpar todas as tarefas desta lista?")) {
        setListas({
          ...listas,
          [listaAtiva]: [],
        });
        setMensagem("Lista de tarefas limpa com sucesso!");
      }
    }
    setTimeout(() => setMensagem(""), 3000);
  }

  // Criar lista
  function criarLista() {
    const nome = prompt("Nome da nova lista:");
    if (nome && nome.trim() !== "" && !listas[nome.trim()]) {
      setListas({
        ...listas,
        [nome.trim()]: [],
      });
      setListaAtiva(nome.trim());
      setFiltro("lista");
    } else if (listas[nome?.trim()]) {
      setMensagem("Já existe uma lista com este nome!");
      setTimeout(() => setMensagem(""), 3000);
    }
  }

  // Remover lista
  function removerLista(nome) {
    if (window.confirm(`Tem certeza que deseja excluir a lista "${nome}"?`)) {
      const novasListas = { ...listas };
      delete novasListas[nome];

      const nomesRestantes = Object.keys(novasListas);
      setListaAtiva(nomesRestantes[0] || "");
      setListas(novasListas);
    }
  }

  // Toggle sidebar
  function toggleSidebar() {
    setSidebarAberta(!sidebarAberta);
  }

  // Mudar filtro com animação
  function mudarFiltro(novoFiltro) {
    if (novoFiltro === filtro) return;
    
    setAnimando(true);
    setSidebarAberta(false); // Fecha sidebar no mobile ao mudar filtro
    
    // Limpar busca ao entrar em uma lista específica
    if (novoFiltro === "lista") {
      setBusca("");
    }
    
    setTimeout(() => {
      setFiltro(novoFiltro);
      setTimeout(() => {
        setAnimando(false);
      }, 50);
    }, 200);
  }

  // Verificar prazo
  function verificarPrazo(prazo) {
    if (!prazo) return false;
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    const diff = dataPrazo - hoje;
    const dias = diff / (1000 * 60 * 60 * 24);
    return dias <= 2 && dias >= 0;
  }

  // Export de dados
  function exportarDados() {
    const dados = {
      listas,
      exportadoEm: new Date().toISOString(),
      versao: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `listfy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setMensagem("Backup exportado com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  }

  // ========== RENDERIZAÇÃO ==========

  const temLista = Object.keys(listas).length > 0;
  const tarefasFiltradas = obterTarefasGlobais();
  const stats = calcularEstatisticas();

  // Classes para dark mode
  const bgPrimary = darkMode ? "bg-gray-900" : "bg-[#5e5e5e5e]";
  const bgSecondary = darkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const border = darkMode ? "border-gray-600" : "border-gray-300";

  return (
    <div className={`flex h-screen relative overflow-hidden touch-manipulation ${darkMode ? 'dark bg-gray-900' : 'bg-[#5e5e5e5e]'}`}>
      {/* Overlay mobile */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Modal de adicionar tarefa detalhada */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className={`${bgSecondary} ${textPrimary} rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Nova Tarefa</h2>
              <button
                onClick={() => setModalAberto(false)}
                className={`${textSecondary} hover:${textPrimary} text-xl sm:text-2xl p-2`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Título da tarefa *</label>
                <input
                  type="text"
                  value={novaTarefa}
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  placeholder="Ex: Estudar React"
                  className={`w-full p-2 sm:p-3 border ${border} rounded focus:border-blue-500 focus:outline-none text-sm sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa..."
                  className={`w-full p-2 sm:p-3 border ${border} rounded focus:border-blue-500 focus:outline-none h-20 sm:h-24 resize-none text-sm sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Link</label>
                <input
                  type="url"
                  value={novoLink}
                  onChange={(e) => setNovoLink(e.target.value)}
                  placeholder="https://exemplo.com"
                  className={`w-full p-2 sm:p-3 border ${border} rounded focus:border-blue-500 focus:outline-none text-sm sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Prazo</label>
                  <input
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className={`w-full p-2 sm:p-3 border ${border} rounded focus:border-blue-500 focus:outline-none text-sm sm:text-base ${bgSecondary} ${textPrimary}`}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className={`w-full p-2 sm:p-3 border ${border} rounded focus:border-blue-500 focus:outline-none text-sm sm:text-base ${bgSecondary} ${textPrimary}`}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={adicionarTarefa}
                  className="flex-1 bg-[#3A3A3A] text-white px-4 py-2 sm:py-3 rounded hover:bg-[#4e4e4e] transition font-medium text-sm sm:text-base"
                >
                  Adicionar Tarefa
                </button>
                <button
                  onClick={() => setModalAberto(false)}
                  className={`px-4 py-2 sm:py-3 border ${border} rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar estilo Claude */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-64 sm:w-72 md:w-64 bg-[#2f2f2f] text-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
          ${sidebarAberta ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-600">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-dove text-blue-400 text-base sm:text-lg"></i> 
            <span>ListFy</span>
          </h2>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white transition p-1.5 rounded text-sm"
              title="Toggle Dark Mode"
            >
              <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button
              className="md:hidden text-gray-400 hover:text-white transition p-1.5 rounded text-sm"
              onClick={toggleSidebar}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Ações principais */}
        <div className="p-3 space-y-1.5">
          <button
            onClick={criarLista}
            className="w-full flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <i className="fa-solid fa-plus text-sm"></i>
            <span className="text-sm sm:text-base">Nova lista</span>
          </button>
          
          {filtro !== "lista" && (
            <div className="relative">
              <input
                id="busca-input"
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar tarefas..."
                className="w-full bg-gray-700 text-white placeholder-gray-400 text-xs sm:text-sm p-2 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="fa-solid fa-search absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
            </div>
          )}

          {temLista && (
            <button
              onClick={exportarDados}
              className="w-full flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
              title="Backup dos dados"
            >
              <i className="fa-solid fa-download text-sm"></i>
              <span className="text-sm sm:text-base">Exportar dados</span>
            </button>
          )}
        </div>

        {/* Filtros/Categorias */}
        <div className="px-3 mb-3">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Categorias</h3>
          <div className="space-y-1">
            <button 
              onClick={() => mudarFiltro("incompletas")} 
              className={`w-full flex items-center gap-2 p-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                filtro === "incompletas" 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <i className="fa-solid fa-clock text-sm"></i>
              <span>Incompletas</span>
              <span className="ml-auto text-xs bg-gray-600 px-1.5 py-0.5 rounded">{stats.incompletas}</span>
            </button>
            
            <button 
              onClick={() => mudarFiltro("concluidas")} 
              className={`w-full flex items-center gap-2 p-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                filtro === "concluidas" 
                  ? "bg-green-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <i className="fa-solid fa-check text-sm"></i>
              <span>Concluídas</span>
              <span className="ml-auto text-xs bg-gray-600 px-1.5 py-0.5 rounded">{stats.concluidas}</span>
            </button>
            
            <button 
              onClick={() => mudarFiltro("importantes")} 
              className={`w-full flex items-center gap-2 p-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                filtro === "importantes" 
                  ? "bg-yellow-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <i className="fa-solid fa-star text-sm"></i>
              <span>Importantes</span>
              <span className="ml-auto text-xs bg-gray-600 px-1.5 py-0.5 rounded">{stats.importantes}</span>
            </button>
          </div>
        </div>

        {/* Listas - com prioridade */}
        {temLista && (
          <div className="flex-1 px-4 overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Minhas Listas</h3>
              {filtro !== "lista" && (
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="text-xs bg-gray-700 text-gray-300 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="recente">Recente</option>
                  <option value="alfabetica">A-Z</option>
                  <option value="prioridade">Prioridade</option>
                  <option value="prazo">Prazo</option>
                </select>
              )}
            </div>
            
            <div className="space-y-1 overflow-y-auto flex-1 scrollbar-hide pb-4">
              {Object.keys(listas).map((nome) => (
                <div key={nome} className="group">
                  <button
                    onClick={() => {
                      setListaAtiva(nome);
                      setFiltro("lista");
                      setBusca(""); // Limpar busca ao selecionar lista
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      listaAtiva === nome && filtro === "lista"
                        ? "bg-gray-700 text-white border-l-4 border-blue-500"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <i className="fa-solid fa-list text-sm"></i>
                      <span className="truncate">{nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {listas[nome].length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removerLista(nome);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 p-1"
                        title="Excluir lista"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estatísticas no Footer */}
        {temLista && (
          <div className="mt-auto border-t border-gray-600 p-2 sm:p-2.5 bg-gray-800">
            <h3 className="text-[9px] sm:text-[10px] font-semibold mb-1.5 sm:mb-2 text-gray-400 uppercase tracking-wider">Estatísticas</h3>
            <div className="flex justify-between gap-1 sm:gap-2 text-xs">
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-blue-400">{stats.incompletas}</div>
                <div className="text-gray-400 text-[8px] sm:text-[10px]">Pendentes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-green-400">{stats.concluidas}</div>
                <div className="text-gray-400 text-[8px] sm:text-[10px]">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-yellow-400">{stats.importantes}</div>
                <div className="text-gray-400 text-[8px] sm:text-[10px]">Importantes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg sm:text-xl text-purple-400">{stats.concluidasHoje}</div>
                <div className="text-gray-400 text-[8px] sm:text-[10px]">Hoje</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Área principal */}
      <div className={`flex-1 ${bgPrimary} p-3 sm:p-4 md:p-8 w-full md:w-auto flex justify-center items-start md:items-start overflow-y-auto`}>
        {!temLista ? (
          <div className="flex flex-col justify-center items-center text-center w-full h-full px-4">
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>
              Nenhuma lista criada
            </h1>
            <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${textSecondary}`}>
              Crie sua primeira lista para começar a adicionar tarefas!
            </p>
            <button
              onClick={criarLista}
              className="bg-[#3A3A3A] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded hover:bg-[#4e4e4e] transition duration-300 text-sm sm:text-base"
            >
              Criar lista
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
            {/* Header com busca e ordenação */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  className="md:hidden bg-[#3A3A3A] text-white p-2 rounded hover:bg-[#4e4e4e] transition duration-200"
                  onClick={toggleSidebar}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textPrimary}`}>{obterTituloAtual()}</h1>
              </div>
              
              {/* Barra de busca e ordenação */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {filtro !== "lista" && (
                  <div className="flex-1 relative">
                    <input
                      id="busca-input"
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar tarefas... (Ctrl + /)"
                      className={`w-full p-2.5 sm:p-3 pl-9 sm:pl-10 border ${border} rounded focus:border-blue-500 focus:outline-none text-sm sm:text-base ${bgSecondary} ${textPrimary}`}
                    />
                    <i className={`fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${textSecondary}`}></i>
                  </div>
                )}
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className={`p-2.5 sm:p-3 border ${border} rounded focus:border-blue-500 focus:outline-none text-sm sm:text-base ${bgSecondary} ${textPrimary} ${filtro === "lista" ? "w-full sm:w-auto" : ""}`}
                >
                  <option value="recente">Mais recente</option>
                  <option value="alfabetica">A-Z</option>
                  <option value="prioridade">Prioridade</option>
                  <option value="prazo">Prazo</option>
                </select>
              </div>
            </div>

            {/* Área de visualização - mantendo CSS original */}
            {filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes" ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                  <div className="text-blue-600 dark:text-blue-400 text-xl sm:text-2xl flex-shrink-0">
                    <i className="fa-solid fa-info-circle"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1 text-sm sm:text-base">
                      Área de visualização - {obterTituloAtual()}
                    </h3>
                    <p className="text-blue-700 dark:text-blue-400 text-xs sm:text-sm">
                      Para adicionar novas tarefas, selecione uma lista específica na barra lateral.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${bgSecondary} rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6`}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={novaTarefa}
                    onChange={(e) => setNovaTarefa(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && adicionarTarefaRapida()}
                    placeholder="Adicionar nova tarefa..."
                    className={`flex-1 p-2.5 sm:p-3 border ${border} rounded focus:border-blue-500 focus:outline-none text-sm sm:text-base ${bgSecondary} ${textPrimary}`}
                  />
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={adicionarTarefaRapida}
                      className="flex-1 sm:flex-none bg-[#3A3A3A] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded hover:bg-[#4e4e4e] transition whitespace-nowrap text-sm sm:text-base"
                      title="Adicionar tarefa rápida"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    <button
                      onClick={() => setModalAberto(true)}
                      className="flex-1 sm:flex-none bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded hover:bg-blue-700 transition whitespace-nowrap text-sm sm:text-base"
                      title="Adicionar tarefa detalhada (Ctrl + N)"
                    >
                      <i className="fa-solid fa-list-check"></i>
                    </button>
                    <button
                      onClick={limparTudo}
                      className="flex-1 sm:flex-none bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded hover:bg-red-700 transition whitespace-nowrap text-sm sm:text-base"
                      title="Limpar todas as tarefas"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p className={`text-[10px] sm:text-xs ${textSecondary} mt-2`}>
                  <i className="fa-solid fa-lightbulb mr-1"></i>
                  Enter para adicionar • <i className="fa-solid fa-list-check mx-1"></i> para detalhes • Ctrl+N para nova tarefa
                </p>
              </div>
            )}

            <p
              className={`mb-3 sm:mb-4 font-medium text-xs sm:text-sm md:text-base ${
                mensagem.includes("sucesso") ? "text-green-700 dark:text-green-400" : "text-red-500 dark:text-red-400"
              }`}
            >
              {mensagem}
            </p>

            {/* Lista de tarefas */}
            <div className={animando ? "animate-out" : "animate-in"}>
              {tarefasFiltradas?.length === 0 ? (
                <div className="text-center py-12 sm:py-16 px-4">
                  <div className={`text-4xl sm:text-6xl mb-3 sm:mb-4 opacity-20 ${textSecondary}`}>
                    <i className="fa-solid fa-clipboard-list"></i>
                  </div>
                  <p className={`${textSecondary} text-base sm:text-lg mb-2`}>
                    {busca.trim() ? "Nenhuma tarefa encontrada para sua busca" : "Nenhuma tarefa encontrada"}
                  </p>
                  <p className={`text-xs sm:text-sm ${textSecondary} opacity-75`}>
                    {busca.trim() ? "Tente buscar por outros termos" : "Adicione uma nova tarefa ou altere o filtro!"}
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 sm:space-y-3 pb-6 sm:pb-8">
                  {tarefasFiltradas.map((tarefa, index) => (
                    <li
                      key={tarefa.id || index}
                      className={`${bgSecondary} rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 border-l-4 ${
                        tarefa.prioridade === "alta"
                          ? "border-red-500"
                          : tarefa.prioridade === "baixa"
                          ? "border-green-500"
                          : "border-blue-500"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => toggleConcluida(tarefa)}
                              className={`mt-0.5 sm:mt-1 flex-shrink-0 ${
                                tarefa.concluida ? "text-green-600" : `${textSecondary} hover:text-green-600`
                              }`}
                            >
                              <i className={`fa-${tarefa.concluida ? "solid" : "regular"} fa-circle-check text-lg sm:text-xl`}></i>
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <span
                                  className={`text-sm sm:text-base font-medium break-words ${
                                    tarefa.concluida ? `line-through ${textSecondary}` : textPrimary
                                  }`}
                                >
                                  {tarefa.texto}
                                </span>
                                
                                {(filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes") && (
                                  <span className={`text-[10px] sm:text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0`}>
                                    {tarefa.nomeLista}
                                  </span>
                                )}
                                
                                {tarefa.importante && (
                                  <span className="text-yellow-500 text-xs sm:text-sm flex-shrink-0">
                                    <i className="fa-solid fa-star"></i>
                                  </span>
                                )}
                                {tarefa.prioridade && tarefa.prioridade !== "normal" && (
                                  <span
                                    className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ${
                                      tarefa.prioridade === "alta"
                                        ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                                        : "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                                    }`}
                                  >
                                    {tarefa.prioridade === "alta" ? "Alta" : "Baixa"}
                                  </span>
                                )}
                              </div>
                              
                              {tarefa.descricao && (
                                <p className={`text-xs sm:text-sm ${textSecondary} mt-1 break-words`}>{tarefa.descricao}</p>
                              )}

                              <div className="flex flex-wrap gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                                {tarefa.link && (
                                  <a
                                    href={tarefa.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm hover:underline flex items-center gap-1"
                                  >
                                    <i className="fa-solid fa-link"></i> Link anexado
                                  </a>
                                )}
                                {tarefa.prazo && (
                                  <span
                                    className={`text-xs sm:text-sm flex items-center gap-1 ${
                                      verificarPrazo(tarefa.prazo)
                                        ? "text-red-600 dark:text-red-400 font-semibold"
                                        : textSecondary
                                    }`}
                                  >
                                    <i className="fa-solid fa-calendar"></i>
                                    <span className="whitespace-nowrap">{new Date(tarefa.prazo).toLocaleDateString('pt-BR')}</span>
                                    {verificarPrazo(tarefa.prazo) && <span className="hidden sm:inline">(Urgente!)</span>}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-row flex-col gap-0.5 sm:gap-1 flex-shrink-0">
                            <button
                              onClick={() => toggleImportante(tarefa)}
                              className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                tarefa.importante ? "text-yellow-500" : textSecondary
                              }`}
                              title="Marcar como importante"
                            >
                              <i className="fa-solid fa-star text-sm"></i>
                            </button>
                            <button
                              onClick={() => editarTarefa(tarefa)}
                              className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${textSecondary}`}
                              title="Editar"
                            >
                              <i className="fa-solid fa-pencil text-sm"></i>
                            </button>
                            <button
                              onClick={() => removerTarefa(tarefa)}
                              className="p-1.5 sm:p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                              title="Remover"
                            >
                              <i className="fa-solid fa-trash text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}