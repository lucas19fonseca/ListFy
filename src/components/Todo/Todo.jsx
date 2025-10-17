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
  const [modalExcluirListaAberto, setModalExcluirListaAberto] = useState(false);
  const [modalSyncAberto, setModalSyncAberto] = useState(false);
  const [modalConfirmarImportacao, setModalConfirmarImportacao] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [nomeNovaLista, setNomeNovaLista] = useState("");
  const [listaRenomeando, setListaRenomeando] = useState("");
  const [novoNomeLista, setNovoNomeLista] = useState("");
  const [listaExcluindo, setListaExcluindo] = useState("");
  const [codigoSync, setCodigoSync] = useState("");
  const [codigoImportar, setCodigoImportar] = useState("");
  const [abaSyncAtiva, setAbaSyncAtiva] = useState("gerar");
  
  // Novos estados para melhorias
  const [busca, setBusca] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [ordenacao, setOrdenacao] = useState("recente");
  const [menuAberto, setMenuAberto] = useState(null);
  const [listasColapsadas, setListasColapsadas] = useState(false);
  const [categoriasColapsadas, setCategoriasColapsadas] = useState(false);
  const [tarefasExpandidas, setTarefasExpandidas] = useState(new Set());
  
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

      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
      
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .touch-manipulation {
        -webkit-tap-highlight-color: transparent;
      }
      
      button {
        -webkit-user-select: none;
        user-select: none;
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
        setModalExcluirListaAberto(false);
        setModalSyncAberto(false);
        setModalConfirmarImportacao(false);
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

  // Toggle expansão de tarefa
  function toggleExpandirTarefa(tarefaId) {
    setTarefasExpandidas(prev => {
      const novoSet = new Set(prev);
      if (novoSet.has(tarefaId)) {
        novoSet.delete(tarefaId);
      } else {
        novoSet.add(tarefaId);
      }
      return novoSet;
    });
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
  function abrirModalExcluirLista(nome) {
    setListaExcluindo(nome);
    setModalExcluirListaAberto(true);
    setMenuAberto(null);
  }

  function confirmarExclusaoLista() {
    const novasListas = { ...listas };
    delete novasListas[listaExcluindo];

    const nomesRestantes = Object.keys(novasListas);
    setListaAtiva(nomesRestantes[0] || "");
    setListas(novasListas);
    setModalExcluirListaAberto(false);
    setListaExcluindo("");
    setMensagem("Lista excluída com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
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

  // Sincronização - Gerar código
  function gerarCodigoSync() {
    try {
      const dados = {
        listas,
        versao: "1.0",
        geradoEm: new Date().toISOString()
      };
      
      const jsonString = JSON.stringify(dados);
      const codigoBase64 = btoa(unescape(encodeURIComponent(jsonString)));
      
      setCodigoSync(codigoBase64);
      setMensagem("Código gerado com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao gerar código:", error);
      setMensagem("Erro ao gerar código de sincronização");
      setTimeout(() => setMensagem(""), 3000);
    }
  }

  // Sincronização - Importar código
  function importarCodigoSync() {
    if (!codigoImportar.trim()) {
      setMensagem("Cole o código de sincronização!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    try {
      const jsonString = decodeURIComponent(escape(atob(codigoImportar.trim())));
      const dados = JSON.parse(jsonString);
      
      if (!dados.listas || !dados.versao) {
        throw new Error("Código inválido");
      }

      setModalConfirmarImportacao(true);
    } catch (error) {
      console.error("Erro ao importar código:", error);
      setMensagem("Código inválido! Verifique e tente novamente.");
      setTimeout(() => setMensagem(""), 3000);
    }
  }

  // Confirmar importação
  function confirmarImportacao() {
    try {
      const jsonString = decodeURIComponent(escape(atob(codigoImportar.trim())));
      const dados = JSON.parse(jsonString);
      
      setListas(dados.listas);
      const primeiraLista = Object.keys(dados.listas)[0];
      if (primeiraLista) {
        setListaAtiva(primeiraLista);
        setFiltro("lista");
      }
      setModalConfirmarImportacao(false);
      setModalSyncAberto(false);
      setCodigoImportar("");
      setMensagem("Listas importadas com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao importar:", error);
      setMensagem("Erro ao importar dados");
      setTimeout(() => setMensagem(""), 3000);
    }
  }

  // Copiar código
  function copiarCodigo() {
    navigator.clipboard.writeText(codigoSync).then(() => {
      setMensagem("Código copiado para a área de transferência!");
      setTimeout(() => setMensagem(""), 3000);
    }).catch(() => {
      setMensagem("Erro ao copiar código");
      setTimeout(() => setMensagem(""), 3000);
    });
  }

  const temLista = Object.keys(listas).length > 0;
  const tarefasFiltradas = obterTarefasGlobais();

  const bgPrimary = darkMode ? "bg-gray-900" : "bg-[#5e5e5e5e]";
  const bgSecondary = darkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const border = darkMode ? "border-gray-600" : "border-gray-300";

  return (
    <div className={`flex h-screen relative overflow-hidden touch-manipulation ${darkMode ? 'dark bg-gray-900' : 'bg-[#5e5e5e5e]'}`}>
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 w-full sm:w-80 md:w-72 lg:w-80 bg-[#2f2f2f] text-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
          ${sidebarAberta ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col max-w-sm md:max-w-none
        `}
      >
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-600">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-dove text-base sm:text-lg md:text-xl"></i> 
            <span>ListFy</span>
          </h2>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white transition p-2 sm:p-2.5 rounded text-base touch-manipulation"
              title="Toggle Dark Mode"
            >
              <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button
              className="md:hidden text-gray-400 hover:text-white transition p-2 sm:p-2.5 rounded text-base touch-manipulation"
              onClick={toggleSidebar}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-2">
          <button
            onClick={criarLista}
            className="w-full flex items-center gap-3 p-3 sm:p-3.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 text-sm sm:text-base touch-manipulation"
          >
            <i className="fa-solid fa-plus text-base"></i>
            <span>Nova lista</span>
          </button>
          
          <div className="relative">
            <input
              id="busca-input-sidebar"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar tarefas..."
              className="w-full bg-gray-700 text-white placeholder-gray-400 text-sm sm:text-base p-3 sm:p-3.5 pl-10 sm:pl-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
            />
            <i className="fa-solid fa-search absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          <button
            onClick={() => {
              setModalSyncAberto(true);
              setAbaSyncAtiva("gerar");
              setCodigoSync("");
              setCodigoImportar("");
            }}
            className="w-full flex items-center gap-3 p-3 sm:p-3.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 text-sm sm:text-base touch-manipulation"
            title="Sincronizar dispositivos"
          >
            <i className="fa-solid fa-rotate text-base"></i>
            <span>Sincronizar</span>
          </button>

          {temLista && (
            <button
              onClick={exportarDados}
              className="w-full flex items-center gap-3 p-3 sm:p-3.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 text-sm sm:text-base touch-manipulation"
              title="Backup dos dados"
            >
              <i className="fa-solid fa-download text-base"></i>
              <span>Exportar dados</span>
            </button>
          )}
        </div>

        <div className="px-4 sm:px-5 mb-4">
          <button
            onClick={() => setCategoriasColapsadas(!categoriasColapsadas)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors mb-3 touch-manipulation p-1"
          >
            <i className={`fa-solid fa-chevron-${categoriasColapsadas ? 'right' : 'down'} text-xs transition-transform`}></i>
            Categorias
          </button>
          
          {!categoriasColapsadas && (
            <div className="space-y-2">
              <button 
                onClick={() => mudarFiltro("incompletas")} 
                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                  filtro === "incompletas" 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <i className="fa-solid fa-clock text-base"></i>
                <span>Incompletas</span>
              </button>
              
              <button 
                onClick={() => mudarFiltro("concluidas")} 
                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                  filtro === "concluidas" 
                    ? "bg-green-600 text-white shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <i className="fa-solid fa-check text-base"></i>
                <span>Concluídas</span>
              </button>
              
              <button 
                onClick={() => mudarFiltro("importantes")} 
                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                  filtro === "importantes" 
                    ? "bg-yellow-600 text-white shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <i className="fa-solid fa-star text-base"></i>
                <span>Importantes</span>
              </button>
            </div>
          )}
        </div>

        {temLista && (
          <div className="flex-1 px-4 sm:px-5 overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setListasColapsadas(!listasColapsadas)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors touch-manipulation p-1"
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
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 touch-manipulation ${
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
                          className="sm:opacity-0 sm:group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-200 p-1.5 rounded hover:bg-gray-600 touch-manipulation"
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
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-3 touch-manipulation"
                          >
                            <i className="fa-solid fa-pencil text-sm"></i>
                            Renomear
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModalExcluirLista(nome);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 flex items-center gap-3 touch-manipulation"
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
      </div>

      {/* Área principal */}
      <div className={`flex-1 ${bgPrimary} flex flex-col w-full md:w-auto`}>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-24 sm:pb-28">
          <div className="flex justify-center items-start w-full h-full">
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
                  className="bg-[#3A3A3A] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded hover:bg-[#4e4e4e] transition duration-300 text-sm sm:text-base touch-manipulation"
                >
                  Criar lista
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
                <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <button
                        className="md:hidden bg-gray-700 hover:bg-gray-600 text-white p-2 sm:p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 touch-manipulation"
                        onClick={toggleSidebar}
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                      <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textPrimary} truncate leading-tight`}>{obterTituloAtual()}</h1>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                      <span className={`text-xs ${textSecondary} hidden sm:block`}>Ordenar:</span>
                      <div className="relative">
                        <select
                          value={ordenacao}
                          onChange={(e) => setOrdenacao(e.target.value)}
                          className={`appearance-none pl-3 pr-8 py-2 sm:py-2.5 border ${border} rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm ${bgSecondary} ${textPrimary} cursor-pointer min-w-[120px] sm:min-w-[140px] transition-all touch-manipulation`}
                        >
                          <option value="recente">Mais recente</option>
                          <option value="alfabetica">A-Z</option>
                          <option value="prioridade">Prioridade</option>
                          <option value="prazo">Prazo</option>
                        </select>
                        <i className={`fa-solid fa-chevron-down absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-xs ${textSecondary} pointer-events-none`}></i>
                      </div>
                    </div>
                  </div>

                  {filtro !== "lista" && (
                    <div className="relative">
                      <input
                        id="busca-input"
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar tarefas..."
                        className={`w-full p-3 sm:p-3.5 pl-10 sm:pl-11 border ${border} rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base ${bgSecondary} ${textPrimary} transition-all touch-manipulation`}
                      />
                      <i className={`fa-solid fa-search absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-sm ${textSecondary}`}></i>
                    </div>
                  )}
                </div>

                {filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes" ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="text-blue-600 dark:text-blue-400 text-xl sm:text-2xl flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-info-circle"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1 text-sm sm:text-base">
                          Visualização: {obterTituloAtual()}
                        </h3>
                        <p className="text-blue-700 dark:text-blue-400 text-xs sm:text-sm">
                          Selecione uma lista específica na barra lateral para adicionar novas tarefas.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {mensagem && (
                  <div className={`mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium ${
                    mensagem.includes("sucesso") 
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}>
                    <div className="flex items-center gap-2">
                      <i className={`fa-solid ${mensagem.includes("sucesso") ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
                      <span className="break-words">{mensagem}</span>
                    </div>
                  </div>
                )}

                <div className={animando ? "animate-out" : "animate-in"}>
                  {tarefasFiltradas?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
                      <div className={`text-5xl sm:text-6xl mb-3 sm:mb-4 ${textSecondary} opacity-20`}>
                        <i className="fa-solid fa-clipboard-list"></i>
                      </div>
                      <p className={`${textPrimary} text-base sm:text-lg font-medium mb-1`}>
                        {busca.trim() ? "Nenhum resultado encontrado" : "Nenhuma tarefa ainda"}
                      </p>
                      <p className={`text-xs sm:text-sm ${textSecondary} text-center`}>
                        {busca.trim() ? "Tente buscar por outros termos" : "Adicione sua primeira tarefa para começar"}
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2 sm:space-y-2.5 pb-32">
                      {tarefasFiltradas.map((tarefa, index) => {
                        const estaExpandida = tarefasExpandidas.has(tarefa.id);
                        const temDetalhes = tarefa.descricao || tarefa.link || tarefa.prazo;
                        
                        return (
                          <li
                            key={tarefa.id || index}
                            className={`group ${bgSecondary} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 sm:p-4 border ${
                              tarefa.concluida ? 'border-gray-300 dark:border-gray-700 opacity-60' : border
                            } ${
                              tarefa.prioridade === "alta"
                                ? "border-l-4 border-l-red-500"
                                : tarefa.prioridade === "baixa"
                                ? "border-l-4 border-l-green-500"
                                : "border-l-4 border-l-blue-500"
                            } hover:border-gray-400 dark:hover:border-gray-500 touch-manipulation`}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <button
                                onClick={() => toggleConcluida(tarefa)}
                                className={`flex-shrink-0 transition-all duration-200 mt-0.5 touch-manipulation p-1 ${
                                  tarefa.concluida 
                                    ? "text-green-600 scale-110" 
                                    : `${textSecondary} hover:text-green-600 hover:scale-110`
                                }`}
                              >
                                <i className={`fa-${tarefa.concluida ? "solid" : "regular"} fa-circle-check text-lg sm:text-xl`}></i>
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                                  {temDetalhes && (
                                    <button
                                      onClick={() => toggleExpandirTarefa(tarefa.id)}
                                      className={`flex-shrink-0 ${textSecondary} hover:${textPrimary} transition-all duration-200 touch-manipulation p-1`}
                                      title={estaExpandida ? "Colapsar" : "Expandir"}
                                    >
                                      <i className={`fa-solid fa-chevron-${estaExpandida ? 'down' : 'right'} text-xs`}></i>
                                    </button>
                                  )}
                                  
                                  <span
                                    className={`text-sm sm:text-base font-medium break-words ${
                                      tarefa.concluida ? `line-through ${textSecondary}` : textPrimary
                                    }`}
                                  >
                                    {tarefa.texto}
                                  </span>
                                  
                                  {(filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes") && (
                                    <span className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0`}>
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
                                      className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                                        tarefa.prioridade === "alta"
                                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                      }`}
                                    >
                                      {tarefa.prioridade === "alta" ? "Alta" : "Baixa"}
                                    </span>
                                  )}
                                </div>
                                
                                {estaExpandida && (
                                  <>
                                    {tarefa.descricao && (
                                      <p className={`text-xs sm:text-sm ${textSecondary} mb-1.5 sm:mb-2 mt-2`}>{tarefa.descricao}</p>
                                    )}

                                    {(tarefa.link || tarefa.prazo) && (
                                      <div className="flex flex-wrap gap-2 sm:gap-3 text-xs mt-2">
                                        {tarefa.link && (
                                          <a
                                            href={tarefa.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 touch-manipulation"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <i className="fa-solid fa-link"></i>
                                            <span>Link</span>
                                          </a>
                                        )}
                                        {tarefa.prazo && (
                                          <span
                                            className={`flex items-center gap-1 ${
                                              verificarPrazo(tarefa.prazo)
                                                ? "text-red-600 dark:text-red-400 font-semibold"
                                                : textSecondary
                                            }`}
                                          >
                                            <i className="fa-solid fa-calendar"></i>
                                            <span>{new Date(tarefa.prazo).toLocaleDateString('pt-BR')}</span>
                                            {verificarPrazo(tarefa.prazo) && <span className="text-xs">(Urgente!)</span>}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                              <div className="flex sm:opacity-0 sm:group-hover:opacity-100 gap-0.5 sm:gap-1 transition-opacity duration-200 flex-shrink-0">
                                <button
                                  onClick={() => toggleImportante(tarefa)}
                                  className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 touch-manipulation ${
                                    tarefa.importante 
                                      ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" 
                                      : `${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-yellow-500`
                                  }`}
                                  title="Importante"
                                >
                                  <i className="fa-solid fa-star text-xs sm:text-sm"></i>
                                </button>
                                <button
                                  onClick={() => editarTarefa(tarefa)}
                                  className={`p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${textSecondary} hover:text-blue-600 touch-manipulation`}
                                  title="Editar"
                                >
                                  <i className="fa-solid fa-pencil text-xs sm:text-sm"></i>
                                </button>
                                <button
                                  onClick={() => removerTarefa(tarefa)}
                                  className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200 hover:scale-110 touch-manipulation"
                                  title="Remover"
                                >
                                  <i className="fa-solid fa-trash text-xs sm:text-sm"></i>
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {temLista && filtro === "lista" && (
          <>
            <div className={`fixed bottom-0 left-0 right-0 md:left-72 lg:left-80 h-32 sm:h-40 bg-gradient-to-t ${darkMode ? 'from-gray-900 via-gray-900/98' : 'from-[#5e5e5e5e] via-[#5e5e5e5e]/98'} to-transparent pointer-events-none z-10`}></div>
            
            <div className="fixed bottom-0 left-0 right-0 md:left-72 lg:left-80 p-3 sm:p-4 z-20">
              <div className="max-w-3xl mx-auto">
                <div className={`bg-[#2f2f2f] rounded-2xl border transition-all duration-200 ${
                  novaTarefa.trim() ? 'border-blue-500/50' : 'border-gray-700/50'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
                    <button
                      onClick={() => setModalAberto(true)}
                      className="text-gray-500 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 flex-shrink-0 p-1.5 sm:p-2 touch-manipulation"
                      title="Adicionar com detalhes"
                    >
                      <i className="fa-solid fa-plus text-sm sm:text-base"></i>
                    </button>
                    
                    <input
                      type="text"
                      value={novaTarefa}
                      onChange={(e) => setNovaTarefa(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && adicionarTarefaRapida()}
                      placeholder="Adicionar tarefa..."
                      className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base touch-manipulation"
                    />
                    
                    {novaTarefa.trim() && (
                      <button
                        onClick={limparTudo}
                        className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex-shrink-0 p-1.5 sm:p-2 touch-manipulation"
                        title="Limpar lista"
                      >
                        <i className="fa-solid fa-trash text-sm sm:text-base"></i>
                      </button>
                    )}
                    
                    <button
                      onClick={adicionarTarefaRapida}
                      disabled={!novaTarefa.trim()}
                      className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 touch-manipulation ${
                        novaTarefa.trim() 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95' 
                          : 'bg-gray-700/50 text-gray-600 cursor-not-allowed'
                      }`}
                      title="Enviar (Enter)"
                    >
                      <i className="fa-solid fa-arrow-up text-sm sm:text-base"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}