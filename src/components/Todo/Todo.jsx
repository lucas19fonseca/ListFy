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
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalCriarListaAberto, setModalCriarListaAberto] = useState(false);
  const [modalRenomearListaAberto, setModalRenomearListaAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [nomeNovaLista, setNomeNovaLista] = useState("");
  const [listaRenomeando, setListaRenomeando] = useState("");
  const [novoNomeLista, setNovoNomeLista] = useState("");
  
  // Novos estados para melhorias
  const [busca, setBusca] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [ordenacao, setOrdenacao] = useState("recente");
  const [menuAberto, setMenuAberto] = useState(null); // Para controlar qual menu está aberto
  const [listasColapsadas, setListasColapsadas] = useState(false); // Para colapsar seção das listas
  
  // Estados para edição de tarefa
  const [tarefaEditandoTexto, setTarefaEditandoTexto] = useState("");
  const [tarefaEditandoLink, setTarefaEditandoLink] = useState("");
  const [tarefaEditandoDescricao, setTarefaEditandoDescricao] = useState("");
  const [tarefaEditandoPrazo, setTarefaEditandoPrazo] = useState("");
  const [tarefaEditandoPrioridade, setTarefaEditandoPrioridade] = useState("normal");

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

  // Atalhos de teclado e fechar menu
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl + N = Nova tarefa
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (filtro !== "incompletas" && filtro !== "concluidas" && filtro !== "importantes") {
          setModalAberto(true);
        }
      }
      // Ctrl + / = Focar busca
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        document.getElementById('busca-input')?.focus();
      }
      // Escape = Fechar modal ou menu
      if (e.key === 'Escape') {
        setModalAberto(false);
        setMenuAberto(null);
      }
    };

    const handleClickOutside = (e) => {
      // Fechar menu ao clicar fora
      if (menuAberto && !e.target.closest('.relative')) {
        setMenuAberto(null);
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboard);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [filtro, menuAberto]);

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
    } else {
      // Quando está em uma lista específica
      tarefas = (listas[listaAtiva] || []).map((tarefa, index) => ({
        ...tarefa,
        nomeLista: listaAtiva,
        indexOriginal: index,
        listaOriginal: listaAtiva
      }));
    }

    // Aplicar busca em todos os contextos
    if (busca.trim()) {
      const termoBusca = busca.toLowerCase().trim();
      tarefas = tarefas.filter(tarefa => 
        tarefa.texto.toLowerCase().includes(termoBusca) ||
        tarefa.descricao?.toLowerCase().includes(termoBusca) ||
        (filtro !== "lista" && tarefa.nomeLista.toLowerCase().includes(termoBusca))
      );
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
    setTarefaEditando(tarefa);
    setTarefaEditandoTexto(tarefa.texto);
    setTarefaEditandoLink(tarefa.link || "");
    setTarefaEditandoDescricao(tarefa.descricao || "");
    setTarefaEditandoPrazo(tarefa.prazo || "");
    setTarefaEditandoPrioridade(tarefa.prioridade || "normal");
    setModalEditarAberto(true);
  }

  function salvarEdicaoTarefa() {
    if (!tarefaEditandoTexto.trim()) {
      setMensagem("Digite um título para a tarefa!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const link = tarefaEditandoLink.trim();
    if (link && !link.match(/^https?:\/\//)) {
      setMensagem("Link inválido! Use http:// ou https://");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const novas = [...listas[tarefaEditando.listaOriginal]];
    novas[tarefaEditando.indexOriginal] = {
      ...novas[tarefaEditando.indexOriginal],
      texto: tarefaEditandoTexto.trim(),
      link: link || "",
      descricao: tarefaEditandoDescricao.trim() || "",
      prazo: tarefaEditandoPrazo || "",
      prioridade: tarefaEditandoPrioridade,
    };

    setListas({
      ...listas,
      [tarefaEditando.listaOriginal]: novas,
    });

    setModalEditarAberto(false);
    setTarefaEditando(null);
    setMensagem("Tarefa editada com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
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
    setNomeNovaLista("");
    setModalCriarListaAberto(true);
  }

  function salvarNovaLista() {
    const nome = nomeNovaLista.trim();
    if (nome === "") {
      setMensagem("Digite um nome para a lista!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    if (listas[nome]) {
      setMensagem("Já existe uma lista com este nome!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    setListas({
      ...listas,
      [nome]: [],
    });
    setListaAtiva(nome);
    setFiltro("lista");
    setModalCriarListaAberto(false);
    setNomeNovaLista("");
    setMensagem("Lista criada com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  }

  // Renomear lista
  function renomearLista(nomeAtual) {
    setListaRenomeando(nomeAtual);
    setNovoNomeLista(nomeAtual);
    setModalRenomearListaAberto(true);
    setMenuAberto(null);
  }

  function salvarRenomeacaoLista() {
    const novoNome = novoNomeLista.trim();
    
    if (novoNome === "") {
      setMensagem("Digite um nome para a lista!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    if (novoNome === listaRenomeando) {
      setModalRenomearListaAberto(false);
      setListaRenomeando("");
      setNovoNomeLista("");
      return;
    }

    if (listas[novoNome]) {
      setMensagem("Já existe uma lista com este nome!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }
    
    const novasListas = { ...listas };
    novasListas[novoNome] = novasListas[listaRenomeando];
    delete novasListas[listaRenomeando];
    
    setListas(novasListas);
    if (listaAtiva === listaRenomeando) {
      setListaAtiva(novoNome);
    }
    
    setModalRenomearListaAberto(false);
    setListaRenomeando("");
    setNovoNomeLista("");
    setMensagem("Lista renomeada com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  }

  // Remover lista
  function removerLista(nome) {
    if (window.confirm(`Tem certeza que deseja excluir a lista "${nome}"?`)) {
      const novasListas = { ...listas };
      delete novasListas[nome];

      const nomesRestantes = Object.keys(novasListas);
      setListaAtiva(nomesRestantes[0] || "");
      setListas(novasListas);
      setMenuAberto(null);
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

      {/* Modal de renomear lista */}
      {modalRenomearListaAberto && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border}`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-4 sm:p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-xl sm:text-2xl font-bold">Renomear Lista</h2>
              <button
                onClick={() => {
                  setModalRenomearListaAberto(false);
                  setListaRenomeando("");
                  setNovoNomeLista("");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Novo nome da lista *</label>
                <input
                  type="text"
                  value={novoNomeLista}
                  onChange={(e) => setNovoNomeLista(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && salvarRenomeacaoLista()}
                  placeholder="Digite o novo nome da lista..."
                  autoFocus
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={salvarRenomeacaoLista}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-base"
                >
                  Renomear Lista
                </button>
                <button
                  onClick={() => {
                    setModalRenomearListaAberto(false);
                    setListaRenomeando("");
                    setNovoNomeLista("");
                  }}
                  className={`w-full px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-base`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de criar lista */}
      {modalCriarListaAberto && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border}`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-4 sm:p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-xl sm:text-2xl font-bold">Nova Lista</h2>
              <button
                onClick={() => {
                  setModalCriarListaAberto(false);
                  setNomeNovaLista("");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da nova lista *</label>
                <input
                  type="text"
                  value={nomeNovaLista}
                  onChange={(e) => setNomeNovaLista(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && salvarNovaLista()}
                  placeholder="Ex: Trabalho, Estudos, Casa..."
                  autoFocus
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={salvarNovaLista}
                  className="w-full bg-[#3A3A3A] text-white px-4 py-3 rounded-lg hover:bg-[#4e4e4e] transition font-medium text-base"
                >
                  Criar Lista
                </button>
                <button
                  onClick={() => {
                    setModalCriarListaAberto(false);
                    setNomeNovaLista("");
                  }}
                  className={`w-full px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-base`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de adicionar tarefa detalhada - Centralizado */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${bgSecondary} ${textPrimary} rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border ${border}`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-4 sm:p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-xl sm:text-2xl font-bold">Nova Tarefa</h2>
              <button
                onClick={() => setModalAberto(false)}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título da tarefa *</label>
                <input
                  type="text"
                  value={novaTarefa}
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  placeholder="Ex: Estudar React"
                  className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa..."
                  className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none h-24 sm:h-24 resize-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <input
                  type="url"
                  value={novoLink}
                  onChange={(e) => setNovoLink(e.target.value)}
                  placeholder="https://exemplo.com"
                  className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prazo</label>
                  <input
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={adicionarTarefa}
                  className="w-full bg-[#3A3A3A] text-white px-4 py-3 rounded-lg hover:bg-[#4e4e4e] transition font-medium text-base"
                >
                  Adicionar Tarefa
                </button>
                <button
                  onClick={() => setModalAberto(false)}
                  className={`w-full px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-base`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de editar tarefa */}
      {modalEditarAberto && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${bgSecondary} ${textPrimary} rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border ${border}`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-4 sm:p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-xl sm:text-2xl font-bold">Editar Tarefa</h2>
              <button
                onClick={() => {
                  setModalEditarAberto(false);
                  setTarefaEditando(null);
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título da tarefa *</label>
                <input
                  type="text"
                  value={tarefaEditandoTexto}
                  onChange={(e) => setTarefaEditandoTexto(e.target.value)}
                  placeholder="Ex: Estudar React"
                  className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={tarefaEditandoDescricao}
                  onChange={(e) => setTarefaEditandoDescricao(e.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa..."
                  className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none h-24 sm:h-24 resize-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <input
                  type="url"
                  value={tarefaEditandoLink}
                  onChange={(e) => setTarefaEditandoLink(e.target.value)}
                  placeholder="https://exemplo.com"
                  className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prazo</label>
                  <input
                    type="date"
                    value={tarefaEditandoPrazo}
                    onChange={(e) => setTarefaEditandoPrazo(e.target.value)}
                    className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prioridade</label>
                  <select
                    value={tarefaEditandoPrioridade}
                    onChange={(e) => setTarefaEditandoPrioridade(e.target.value)}
                    className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={salvarEdicaoTarefa}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-base"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => {
                    setModalEditarAberto(false);
                    setTarefaEditando(null);
                  }}
                  className={`w-full px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-base`}
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
            <i className="fa-solid fa-dove text- text-base sm:text-lg"></i> 
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
          
          {/* Busca sempre visível na sidebar */}
          <div className="relative">
            <input
              id="busca-input-sidebar"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar tarefas..."
              className="w-full bg-gray-700 text-white placeholder-gray-400 text-xs sm:text-sm p-2 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fa-solid fa-search absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
          </div>

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

        {/* Listas - com funcionalidade de colapsar */}
        {temLista && (
          <div className="flex-1 px-4 overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setListasColapsadas(!listasColapsadas)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                <i className={`fa-solid fa-chevron-${listasColapsadas ? 'right' : 'down'} text-xs transition-transform`}></i>
                Minhas Listas
              </button>
            </div>
            
            {!listasColapsadas && (
              <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar pb-4">
                {Object.keys(listas).map((nome) => (
                  <div key={nome} className="group relative">
                    <button
                      onClick={() => {
                        setListaAtiva(nome);
                        setFiltro("lista");
                        setBusca(""); // Limpar busca ao selecionar lista
                        setMenuAberto(null); // Fechar menu ao selecionar lista
                      }}
                      className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-all duration-200 ${
                        listaAtiva === nome && filtro === "lista"
                          ? "bg-gray-700 text-white border-l-4 border-blue-500"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <i className="fa-solid fa-list text-sm"></i>
                        <span className="truncate text-sm">{nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAberto(menuAberto === nome ? null : nome);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-200 p-1 rounded hover:bg-gray-600"
                          title="Opções da lista"
                        >
                          <i className="fa-solid fa-ellipsis text-sm"></i>
                        </button>
                      </div>
                    </button>

                    {/* Menu dropdown */}
                    {menuAberto === nome && (
                      <div className="absolute right-2 top-10 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[140px]">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              renomearLista(nome);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-2"
                          >
                            <i className="fa-solid fa-pencil text-xs"></i>
                            Renomear
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removerLista(nome);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                            Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
            {/* Header otimizado para mobile */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Linha 1: Menu + Título (Mobile) | Título + Ordenação (Desktop) */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    className="md:hidden bg-[#3A3A3A] text-white p-3 rounded-lg hover:bg-[#4e4e4e] transition duration-200 flex-shrink-0"
                    onClick={toggleSidebar}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h1 className={`text-xl sm:text-3xl md:text-4xl font-bold ${textPrimary} truncate`}>{obterTituloAtual()}</h1>
                </div>
                
                {/* Controle de ordenação - Desktop apenas na primeira linha */}
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm ${textSecondary}`}>Ordenar por:</span>
                  <div className="relative">
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value)}
                      className={`appearance-none pl-8 pr-8 py-2.5 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-sm ${bgSecondary} ${textPrimary} cursor-pointer min-w-[140px]`}
                    >
                      <option value="recente">Mais recente</option>
                      <option value="alfabetica">A-Z</option>
                      <option value="prioridade">Prioridade</option>
                      <option value="prazo">Prazo</option>
                    </select>
                    <i className={`fa-solid fa-sort absolute left-2.5 top-1/2 transform -translate-y-1/2 text-xs ${textSecondary} pointer-events-none`}></i>
                    <i className={`fa-solid fa-chevron-down absolute right-2.5 top-1/2 transform -translate-y-1/2 text-xs ${textSecondary} pointer-events-none`}></i>
                  </div>
                </div>
              </div>

              {/* Linha 2 - Mobile: Busca + Ordenação | Desktop: Apenas busca */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Barra de busca */}
                {filtro !== "lista" && (
                  <div className="relative flex-1">
                    <input
                      id="busca-input"
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder={`${window.innerWidth < 640 ? "Buscar..." : "Buscar tarefas... (Ctrl + /)"}`}
                      className={`w-full p-3 sm:p-3 pl-10 sm:pl-10 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                    />
                    <i className={`fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${textSecondary}`}></i>
                  </div>
                )}

                {/* Controle de ordenação - Mobile apenas */}
                <div className="sm:hidden flex-shrink-0">
                  <div className="relative">
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value)}
                      className={`appearance-none pl-10 pr-10 py-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary} cursor-pointer w-full min-w-[140px]`}
                    >
                      <option value="recente">Mais recente</option>
                      <option value="alfabetica">A-Z</option>
                      <option value="prioridade">Prioridade</option>
                      <option value="prazo">Prazo</option>
                    </select>
                    <i className={`fa-solid fa-sort absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${textSecondary} pointer-events-none`}></i>
                    <i className={`fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${textSecondary} pointer-events-none`}></i>
                  </div>
                </div>
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
              <div className={`${bgSecondary} rounded-lg shadow-md p-4 sm:p-4 mb-4 sm:mb-6`}>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={novaTarefa}
                    onChange={(e) => setNovaTarefa(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && adicionarTarefaRapida()}
                    placeholder="Adicionar nova tarefa..."
                    className={`w-full p-3 sm:p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base sm:text-base ${bgSecondary} ${textPrimary}`}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={adicionarTarefaRapida}
                      className="flex-1 bg-[#3A3A3A] text-white px-4 py-3 rounded-lg hover:bg-[#4e4e4e] transition font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                      title="Adicionar tarefa rápida"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span className="hidden sm:inline">Adicionar</span>
                    </button>
                    <button
                      onClick={() => setModalAberto(true)}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base flex items-center justify-center gap-2"
                      title="Adicionar tarefa detalhada (Ctrl + N)"
                    >
                      <i className="fa-solid fa-list-check"></i>
                      <span className="hidden sm:inline">Detalhes</span>
                    </button>
                    <button
                      onClick={limparTudo}
                      className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-medium text-sm sm:text-base flex items-center justify-center"
                      title="Limpar todas as tarefas"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p className={`text-xs sm:text-xs ${textSecondary} mt-3 text-center sm:text-left`}>
                  <i className="fa-solid fa-lightbulb mr-1"></i>
                  <span className="hidden sm:inline">Enter para adicionar • </span>
                  <i className="fa-solid fa-list-check mx-1"></i>
                  <span className="hidden sm:inline">para detalhes • </span>
                  <span className="sm:hidden">Toque para mais opções • </span>
                  Ctrl+N para nova tarefa
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

                          <div className="flex flex-row gap-1 flex-shrink-0">
                            <button
                              onClick={() => toggleImportante(tarefa)}
                              className={`p-2 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                tarefa.importante ? "text-yellow-500" : textSecondary
                              }`}
                              title="Marcar como importante"
                            >
                              <i className="fa-solid fa-star text-base sm:text-sm"></i>
                            </button>
                            <button
                              onClick={() => editarTarefa(tarefa)}
                              className={`p-2 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${textSecondary}`}
                              title="Editar"
                            >
                              <i className="fa-solid fa-pencil text-base sm:text-sm"></i>
                            </button>
                            <button
                              onClick={() => removerTarefa(tarefa)}
                              className="p-2 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                              title="Remover"
                            >
                              <i className="fa-solid fa-trash text-base sm:text-sm"></i>
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