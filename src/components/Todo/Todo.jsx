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
  const [menuAberto, setMenuAberto] = useState(null);
  const [listasColapsadas, setListasColapsadas] = useState(false);
  
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
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (filtro !== "incompletas" && filtro !== "concluidas" && filtro !== "importantes") {
          setModalAberto(true);
        }
      }
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        document.getElementById('busca-input')?.focus();
      }
      if (e.key === 'Escape') {
        setModalAberto(false);
        setMenuAberto(null);
      }
    };

    const handleClickOutside = (e) => {
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
      tarefas = (listas[listaAtiva] || []).map((tarefa, index) => ({
        ...tarefa,
        nomeLista: listaAtiva,
        indexOriginal: index,
        listaOriginal: listaAtiva
      }));
    }

    if (busca.trim()) {
      const termoBusca = busca.toLowerCase().trim();
      tarefas = tarefas.filter(tarefa => 
        tarefa.texto.toLowerCase().includes(termoBusca) ||
        tarefa.descricao?.toLowerCase().includes(termoBusca) ||
        (filtro !== "lista" && tarefa.nomeLista.toLowerCase().includes(termoBusca))
      );
    }

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
    setSidebarAberta(false);
    
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
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-2xl font-bold">Renomear Lista</h2>
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

            <div className="p-6 space-y-4">
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
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-2xl font-bold">Nova Lista</h2>
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

            <div className="p-6 space-y-4">
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

      {/* Modal de adicionar tarefa detalhada */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${bgSecondary} ${textPrimary} rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border ${border}`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-2xl font-bold">Nova Tarefa</h2>
              <button
                onClick={() => setModalAberto(false)}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título da tarefa *</label>
                <input
                  type="text"
                  value={novaTarefa}
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  placeholder="Ex: Estudar React"
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa..."
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none h-24 resize-none text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <input
                  type="url"
                  value={novoLink}
                  onChange={(e) => setNovoLink(e.target.value)}
                  placeholder="https://exemplo.com"
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prazo</label>
                  <input
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
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
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-2xl font-bold">Editar Tarefa</h2>
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

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título da tarefa *</label>
                <input
                  type="text"
                  value={tarefaEditandoTexto}
                  onChange={(e) => setTarefaEditandoTexto(e.target.value)}
                  placeholder="Ex: Estudar React"
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={tarefaEditandoDescricao}
                  onChange={(e) => setTarefaEditandoDescricao(e.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa..."
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none h-24 resize-none text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <input
                  type="url"
                  value={tarefaEditandoLink}
                  onChange={(e) => setTarefaEditandoLink(e.target.value)}
                  placeholder="https://exemplo.com"
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prazo</label>
                  <input
                    type="date"
                    value={tarefaEditandoPrazo}
                    onChange={(e) => setTarefaEditandoPrazo(e.target.value)}
                    className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prioridade</label>
                  <select
                    value={tarefaEditandoPrioridade}
                    onChange={(e) => setTarefaEditandoPrioridade(e.target.value)}
                    className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
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

      {/* Sidebar - Largura aumentada em tablet */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-72 md:w-80 lg:w-72 bg-[#2f2f2f] text-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
          ${sidebarAberta ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-600">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-dove text-lg md:text-xl"></i> 
            <span>ListFy</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white transition p-2 rounded text-base"
              title="Toggle Dark Mode"
            >
              <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button
              className="md:hidden text-gray-400 hover:text-white transition p-2 rounded text-base"
              onClick={toggleSidebar}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Ações principais */}
        <div className="p-4 md:p-5 space-y-2">
          <button
            onClick={criarLista}
            className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <i className="fa-solid fa-plus text-base"></i>
            <span className="text-base">Nova lista</span>
          </button>
          
          <div className="relative">
            <input
              id="busca-input-sidebar"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar tarefas..."
              className="w-full bg-gray-700 text-white placeholder-gray-400 text-sm p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          {temLista && (
            <button
              onClick={exportarDados}
              className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
              title="Backup dos dados"
            >
              <i className="fa-solid fa-download text-base"></i>
              <span className="text-base">Exportar dados</span>
            </button>
          )}
        </div>

        {/* Filtros/Categorias */}
        <div className="px-4 md:px-5 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorias</h3>
          <div className="space-y-2">
            <button 
              onClick={() => mudarFiltro("incompletas")} 
              className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 ${
                filtro === "incompletas" 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <i className="fa-solid fa-clock text-base"></i>
              <span>Incompletas</span>
              <span className="ml-auto text-xs bg-gray-600 px-2 py-1 rounded">{stats.incompletas}</span>
            </button>
            
            <button 
              onClick={() => mudarFiltro("concluidas")} 
              className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 ${
                filtro === "concluidas" 
                  ? "bg-green-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <i className="fa-solid fa-check text-base"></i>
              <span>Concluídas</span>
              <span className="ml-auto text-xs bg-gray-600 px-2 py-1 rounded">{stats.concluidas}</span>
            </button>
            
            <button 
              onClick={() => mudarFiltro("importantes")} 
              className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 ${
                filtro === "importantes" 
                  ? "bg-yellow-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <i className="fa-solid fa-star text-base"></i>
              <span>Importantes</span>
              <span className="ml-auto text-xs bg-gray-600 px-2 py-1 rounded">{stats.importantes}</span>
            </button>
          </div>
        </div>

        {/* Listas */}
        {temLista && (
          <div className="flex-1 px-4 md:px-5 overflow-hidden flex flex-col min-h-0">
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
              <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pb-4">
                {Object.keys(listas).map((nome) => (
                  <div key={nome} className="group relative">
                    <button
                      onClick={() => {
                        setListaAtiva(nome);
                        setFiltro("lista");
                        setBusca("");
                        setMenuAberto(null);
                      }}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 ${
                        listaAtiva === nome && filtro === "lista"
                          ? "bg-gray-700 text-white border-l-4 border-blue-500"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <i className="fa-solid fa-list text-base"></i>
                        <span className="truncate text-sm">{nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAberto(menuAberto === nome ? null : nome);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-200 p-1.5 rounded hover:bg-gray-600"
                          title="Opções da lista"
                        >
                          <i className="fa-solid fa-ellipsis text-base"></i>
                        </button>
                      </div>
                    </button>

                    {menuAberto === nome && (
                      <div className="absolute right-2 top-12 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[150px]">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              renomearLista(nome);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-3"
                          >
                            <i className="fa-solid fa-pencil text-sm"></i>
                            Renomear
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removerLista(nome);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 flex items-center gap-3"
                          >
                            <i className="fa-solid fa-trash text-sm"></i>
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
          <div className="mt-auto border-t border-gray-600 p-3 md:p-4 bg-gray-800">
            <h3 className="text-xs font-semibold mb-2 text-gray-400 uppercase tracking-wider">Estatísticas</h3>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="font-bold text-xl text-blue-400">{stats.incompletas}</div>
                <div className="text-gray-400 text-[10px]">Pendentes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-green-400">{stats.concluidas}</div>
                <div className="text-gray-400 text-[10px]">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-yellow-400">{stats.importantes}</div>
                <div className="text-gray-400 text-[10px]">Importantes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-purple-400">{stats.concluidasHoje}</div>
                <div className="text-gray-400 text-[10px]">Hoje</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Área principal - Padding aumentado em tablet */}
      <div className={`flex-1 ${bgPrimary} p-4 md:p-6 lg:p-8 w-full md:w-auto flex justify-center items-start overflow-y-auto`}>
        {!temLista ? (
          <div className="flex flex-col justify-center items-center text-center w-full h-full px-4">
            <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${textPrimary}`}>
              Nenhuma lista criada
            </h1>
            <p className={`mb-6 text-base ${textSecondary}`}>
              Crie sua primeira lista para começar a adicionar tarefas!
            </p>
            <button
              onClick={criarLista}
              className="bg-[#3A3A3A] text-white px-6 py-3 rounded hover:bg-[#4e4e4e] transition duration-300 text-base"
            >
              Criar lista
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
            {/* Header otimizado para tablet */}
            <div className="flex flex-col gap-4 md:gap-5 mb-6">
              {/* Linha 1: Menu + Título + Ordenação */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    className="md:hidden bg-[#3A3A3A] text-white p-3 rounded-lg hover:bg-[#4e4e4e] transition duration-200 flex-shrink-0"
                    onClick={toggleSidebar}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h1 className={`text-2xl md:text-4xl lg:text-4xl font-bold ${textPrimary} truncate`}>{obterTituloAtual()}</h1>
                </div>
                
                {/* Controle de ordenação - Sempre visível */}
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <span className={`text-xs md:text-sm ${textSecondary} hidden sm:block`}>Ordenar:</span>
                  <div className="relative">
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value)}
                      className={`appearance-none pl-9 pr-9 py-2.5 md:py-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-sm md:text-base ${bgSecondary} ${textPrimary} cursor-pointer min-w-[150px] md:min-w-[170px]`}
                    >
                      <option value="recente">Mais recente</option>
                      <option value="alfabetica">A-Z</option>
                      <option value="prioridade">Prioridade</option>
                      <option value="prazo">Prazo</option>
                    </select>
                    <i className={`fa-solid fa-sort absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${textSecondary} pointer-events-none`}></i>
                    <i className={`fa-solid fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${textSecondary} pointer-events-none`}></i>
                  </div>
                </div>
              </div>

              {/* Linha 2 - Busca */}
              {filtro !== "lista" && (
                <div className="relative">
                  <input
                    id="busca-input"
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar tarefas... (Ctrl + /)"
                    className={`w-full p-3 md:p-4 pl-11 md:pl-12 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base md:text-lg ${bgSecondary} ${textPrimary}`}
                  />
                  <i className={`fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-base ${textSecondary}`}></i>
                </div>
              )}
            </div>

            {/* Área de visualização */}
            {filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes" ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 md:p-5 mb-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="text-blue-600 dark:text-blue-400 text-2xl md:text-3xl flex-shrink-0">
                    <i className="fa-solid fa-info-circle"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-base md:text-lg">
                      Área de visualização - {obterTituloAtual()}
                    </h3>
                    <p className="text-blue-700 dark:text-blue-400 text-sm md:text-base">
                      Para adicionar novas tarefas, selecione uma lista específica na barra lateral.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${bgSecondary} rounded-lg shadow-md p-5 md:p-6 mb-6`}>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={novaTarefa}
                    onChange={(e) => setNovaTarefa(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && adicionarTarefaRapida()}
                    placeholder="Adicionar nova tarefa..."
                    className={`w-full p-3 md:p-4 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base md:text-lg ${bgSecondary} ${textPrimary}`}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={adicionarTarefaRapida}
                      className="flex-1 bg-[#3A3A3A] text-white px-4 py-3 md:py-3.5 rounded-lg hover:bg-[#4e4e4e] transition font-medium text-sm md:text-base flex items-center justify-center gap-2"
                      title="Adicionar tarefa rápida"
                    >
                      <i className="fa-solid fa-plus text-sm md:text-base"></i>
                      <span>Adicionar</span>
                    </button>
                    <button
                      onClick={() => setModalAberto(true)}
                      className="flex-1 bg-blue-600 text-white px-4 py-3 md:py-3.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm md:text-base flex items-center justify-center gap-2"
                      title="Adicionar tarefa detalhada (Ctrl + N)"
                    >
                      <i className="fa-solid fa-list-check text-sm md:text-base"></i>
                      <span>Detalhes</span>
                    </button>
                    <button
                      onClick={limparTudo}
                      className="bg-red-600 text-white px-4 py-3 md:py-3.5 rounded-lg hover:bg-red-700 transition font-medium text-sm md:text-base flex items-center justify-center"
                      title="Limpar todas as tarefas"
                    >
                      <i className="fa-solid fa-trash text-sm md:text-base"></i>
                    </button>
                  </div>
                </div>
                <p className={`text-xs md:text-sm ${textSecondary} mt-3 text-center`}>
                  <i className="fa-solid fa-lightbulb mr-1"></i>
                  Enter para adicionar • <i className="fa-solid fa-list-check mx-1"></i> para detalhes • Ctrl+N para nova tarefa
                </p>
              </div>
            )}

            <p
              className={`mb-4 font-medium text-sm md:text-base ${
                mensagem.includes("sucesso") ? "text-green-700 dark:text-green-400" : "text-red-500 dark:text-red-400"
              }`}
            >
              {mensagem}
            </p>

            {/* Lista de tarefas com espaçamento melhorado em tablet */}
            <div className={animando ? "animate-out" : "animate-in"}>
              {tarefasFiltradas?.length === 0 ? (
                <div className="text-center py-16 md:py-20 px-4">
                  <div className={`text-5xl md:text-7xl mb-4 opacity-20 ${textSecondary}`}>
                    <i className="fa-solid fa-clipboard-list"></i>
                  </div>
                  <p className={`${textSecondary} text-lg md:text-xl mb-2`}>
                    {busca.trim() ? "Nenhuma tarefa encontrada para sua busca" : "Nenhuma tarefa encontrada"}
                  </p>
                  <p className={`text-sm md:text-base ${textSecondary} opacity-75`}>
                    {busca.trim() ? "Tente buscar por outros termos" : "Adicione uma nova tarefa ou altere o filtro!"}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3 md:space-y-4 pb-8">
                  {tarefasFiltradas.map((tarefa, index) => (
                    <li
                      key={tarefa.id || index}
                      className={`${bgSecondary} rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-5 border-l-4 ${
                        tarefa.prioridade === "alta"
                          ? "border-red-500"
                          : tarefa.prioridade === "baixa"
                          ? "border-green-500"
                          : "border-blue-500"
                      }`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3 md:gap-4">
                          <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                            <button
                              onClick={() => toggleConcluida(tarefa)}
                              className={`mt-1 flex-shrink-0 ${
                                tarefa.concluida ? "text-green-600" : `${textSecondary} hover:text-green-600`
                              }`}
                            >
                              <i className={`fa-${tarefa.concluida ? "solid" : "regular"} fa-circle-check text-xl md:text-2xl`}></i>
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-base md:text-lg font-medium break-words ${
                                    tarefa.concluida ? `line-through ${textSecondary}` : textPrimary
                                  }`}
                                >
                                  {tarefa.texto}
                                </span>
                                
                                {(filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes") && (
                                  <span className={`text-xs md:text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded flex-shrink-0`}>
                                    {tarefa.nomeLista}
                                  </span>
                                )}
                                
                                {tarefa.importante && (
                                  <span className="text-yellow-500 text-sm md:text-base flex-shrink-0">
                                    <i className="fa-solid fa-star"></i>
                                  </span>
                                )}
                                {tarefa.prioridade && tarefa.prioridade !== "normal" && (
                                  <span
                                    className={`text-xs md:text-sm px-2 py-1 rounded flex-shrink-0 ${
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
                                <p className={`text-sm md:text-base ${textSecondary} mt-2 break-words`}>{tarefa.descricao}</p>
                              )}

                              <div className="flex flex-wrap gap-3 md:gap-4 mt-2">
                                {tarefa.link && (
                                  <a
                                    href={tarefa.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 text-sm md:text-base hover:underline flex items-center gap-1.5"
                                  >
                                    <i className="fa-solid fa-link"></i> Link anexado
                                  </a>
                                )}
                                {tarefa.prazo && (
                                  <span
                                    className={`text-sm md:text-base flex items-center gap-1.5 ${
                                      verificarPrazo(tarefa.prazo)
                                        ? "text-red-600 dark:text-red-400 font-semibold"
                                        : textSecondary
                                    }`}
                                  >
                                    <i className="fa-solid fa-calendar"></i>
                                    <span className="whitespace-nowrap">{new Date(tarefa.prazo).toLocaleDateString('pt-BR')}</span>
                                    {verificarPrazo(tarefa.prazo) && <span>(Urgente!)</span>}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row gap-1.5 md:gap-2 flex-shrink-0">
                            <button
                              onClick={() => toggleImportante(tarefa)}
                              className={`p-2 md:p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                tarefa.importante ? "text-yellow-500" : textSecondary
                              }`}
                              title="Marcar como importante"
                            >
                              <i className="fa-solid fa-star text-base md:text-lg"></i>
                            </button>
                            <button
                              onClick={() => editarTarefa(tarefa)}
                              className={`p-2 md:p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${textSecondary}`}
                              title="Editar"
                            >
                              <i className="fa-solid fa-pencil text-base md:text-lg"></i>
                            </button>
                            <button
                              onClick={() => removerTarefa(tarefa)}
                              className="p-2 md:p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                              title="Remover"
                            >
                              <i className="fa-solid fa-trash text-base md:text-lg"></i>
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