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
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [nomeNovaLista, setNomeNovaLista] = useState("");
  const [listaRenomeando, setListaRenomeando] = useState("");
  const [novoNomeLista, setNovoNomeLista] = useState("");
  const [listaExcluindo, setListaExcluindo] = useState("");
  const [codigoSync, setCodigoSync] = useState("");
  const [codigoImportar, setCodigoImportar] = useState("");
  const [abaSyncAtiva, setAbaSyncAtiva] = useState("gerar"); // "gerar" ou "importar"
  
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
      
      /* Line clamp utility */
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
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

      if (window.confirm("Deseja importar as listas? Isso substituirá suas listas atuais.")) {
        setListas(dados.listas);
        const primeiraLista = Object.keys(dados.listas)[0];
        if (primeiraLista) {
          setListaAtiva(primeiraLista);
          setFiltro("lista");
        }
        setModalSyncAberto(false);
        setCodigoImportar("");
        setMensagem("Listas importadas com sucesso!");
        setTimeout(() => setMensagem(""), 3000);
      }
    } catch (error) {
      console.error("Erro ao importar código:", error);
      setMensagem("Código inválido! Verifique e tente novamente.");
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

  // ========== RENDERIZAÇÃO ==========

  const temLista = Object.keys(listas).length > 0;
  const tarefasFiltradas = obterTarefasGlobais();

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

      {/* Modal de sincronização */}
      {modalSyncAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${bgSecondary} ${textPrimary} rounded-xl w-full max-w-2xl shadow-2xl border ${border} animate-in`}>
            <div className={`flex items-center justify-between p-6 border-b ${border}`}>
              <h2 className="text-2xl font-bold">Sincronizar Dispositivos</h2>
              <button
                onClick={() => {
                  setModalSyncAberto(false);
                  setCodigoSync("");
                  setCodigoImportar("");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Abas */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setAbaSyncAtiva("gerar")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                  abaSyncAtiva === "gerar"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : `${textSecondary} hover:text-gray-900 dark:hover:text-white`
                }`}
              >
                <i className="fa-solid fa-qrcode mr-2"></i>
                Gerar Código
              </button>
              <button
                onClick={() => setAbaSyncAtiva("importar")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                  abaSyncAtiva === "importar"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : `${textSecondary} hover:text-gray-900 dark:hover:text-white`
                }`}
              >
                <i className="fa-solid fa-file-import mr-2"></i>
                Importar Código
              </button>
            </div>

            <div className="p-6">
              {/* Aba Gerar Código */}
              {abaSyncAtiva === "gerar" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-info-circle text-blue-600 dark:text-blue-400 text-lg mt-0.5"></i>
                      <div className="text-sm text-blue-800 dark:text-blue-300">
                        <p className="font-medium mb-1">Como funciona:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Clique em "Gerar Código" para criar um código com suas listas</li>
                          <li>Copie o código gerado</li>
                          <li>No outro dispositivo, cole o código na aba "Importar Código"</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {!codigoSync ? (
                    <button
                      onClick={gerarCodigoSync}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-base flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      Gerar Código de Sincronização
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">Código gerado:</label>
                      <div className="relative">
                        <textarea
                          value={codigoSync}
                          readOnly
                          className={`w-full p-3 border ${border} rounded-lg text-xs font-mono ${bgSecondary} ${textPrimary} h-32 resize-none`}
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={copiarCodigo}
                          className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium text-base flex items-center justify-center gap-2"
                        >
                          <i className="fa-solid fa-copy"></i>
                          Copiar Código
                        </button>
                        <button
                          onClick={() => setCodigoSync("")}
                          className={`px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-base`}
                        >
                          Gerar Novo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Aba Importar Código */}
              {abaSyncAtiva === "importar" && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-triangle-exclamation text-yellow-600 dark:text-yellow-400 text-lg mt-0.5"></i>
                      <div className="text-sm text-yellow-800 dark:text-yellow-300">
                        <p className="font-medium mb-1">Atenção:</p>
                        <p className="text-xs">Importar um código substituirá todas as suas listas atuais. Exporte um backup antes se necessário.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cole o código aqui:</label>
                    <textarea
                      value={codigoImportar}
                      onChange={(e) => setCodigoImportar(e.target.value)}
                      placeholder="Cole o código de sincronização..."
                      className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-xs font-mono ${bgSecondary} ${textPrimary} h-32 resize-none`}
                    />
                  </div>

                  <button
                    onClick={importarCodigoSync}
                    disabled={!codigoImportar.trim()}
                    className={`w-full px-6 py-3 rounded-lg transition font-medium text-base flex items-center justify-center gap-2 ${
                      codigoImportar.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <i className="fa-solid fa-file-import"></i>
                    Importar Listas
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de excluir lista */}
      {modalExcluirListaAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border} animate-in`}>
            <div className={`flex items-start gap-4 p-6 border-b ${border}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-red-600 dark:text-red-400 text-xl"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Excluir lista</h2>
                <p className={`text-sm ${textSecondary}`}>
                  Tem certeza que deseja excluir a lista <span className="font-semibold text-red-600 dark:text-red-400">"{listaExcluindo}"</span>?
                </p>
              </div>
              <button
                onClick={() => {
                  setModalExcluirListaAberto(false);
                  setListaExcluindo("");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-info-circle text-red-600 dark:text-red-400 text-sm mt-0.5"></i>
                  <p className="text-sm text-red-800 dark:text-red-300">
                    Esta ação não pode ser desfeita. Todas as tarefas desta lista serão permanentemente excluídas.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setModalExcluirListaAberto(false);
                    setListaExcluindo("");
                  }}
                  className={`flex-1 px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-base`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarExclusaoLista}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium text-base shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                >
                  Sim, excluir lista
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
            <>
              <button
                onClick={() => {
                  setModalSyncAberto(true);
                  setAbaSyncAtiva("gerar");
                  setCodigoSync("");
                  setCodigoImportar("");
                }}
                className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                title="Sincronizar dispositivos"
              >
                <i className="fa-solid fa-rotate text-base"></i>
                <span className="text-base">Sincronizar</span>
              </button>
              
              <button
                onClick={exportarDados}
                className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                title="Backup dos dados"
              >
                <i className="fa-solid fa-download text-base"></i>
                <span className="text-base">Exportar dados</span>
              </button>
            </>
          )}
        </div>

        {/* Filtros/Categorias */}
        <div className="px-4 md:px-5 mb-4">
          <button
            onClick={() => setCategoriasColapsadas(!categoriasColapsadas)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors mb-3"
          >
            <i className={`fa-solid fa-chevron-${categoriasColapsadas ? 'right' : 'down'} text-xs transition-transform`}></i>
            Categorias
          </button>
          
          {!categoriasColapsadas && (
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
              </button>
            </div>
          )}
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
                              abrirModalExcluirLista(nome);
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
      </div>

      {/* Área principal - Padding aumentado em tablet */}
      <div className={`flex-1 ${bgPrimary} flex flex-col w-full md:w-auto`}>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-28">
          <div className="flex justify-center items-start w-full h-full">
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
            {/* Header otimizado */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Linha 1: Menu + Título + Ordenação */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    className="md:hidden bg-gray-700 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-all duration-200 flex-shrink-0"
                    onClick={toggleSidebar}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h1 className={`text-3xl md:text-4xl font-bold ${textPrimary} truncate`}>{obterTituloAtual()}</h1>
                </div>
                
                {/* Controle de ordenação */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs ${textSecondary} hidden sm:block`}>Ordenar:</span>
                  <div className="relative">
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value)}
                      className={`appearance-none pl-3 pr-8 py-2 border ${border} rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${bgSecondary} ${textPrimary} cursor-pointer min-w-[140px] transition-all`}
                    >
                      <option value="recente">Mais recente</option>
                      <option value="alfabetica">A-Z</option>
                      <option value="prioridade">Prioridade</option>
                      <option value="prazo">Prazo</option>
                    </select>
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
                    placeholder="Buscar tarefas..."
                    className={`w-full p-3 pl-10 border ${border} rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-base ${bgSecondary} ${textPrimary} transition-all`}
                  />
                  <i className={`fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-sm ${textSecondary}`}></i>
                </div>
              )}
            </div>

            {/* Área de visualização */}
            {filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes" ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 dark:text-blue-400 text-2xl flex-shrink-0 mt-0.5">
                    <i className="fa-solid fa-info-circle"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1 text-base">
                      Visualização: {obterTituloAtual()}
                    </h3>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                      Selecione uma lista específica na barra lateral para adicionar novas tarefas.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {mensagem && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                mensagem.includes("sucesso") 
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-center gap-2">
                  <i className={`fa-solid ${mensagem.includes("sucesso") ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
                  <span>{mensagem}</span>
                </div>
              </div>
            )}

            {/* Lista de tarefas com espaçamento melhorado em tablet */}
            <div className={animando ? "animate-out" : "animate-in"}>
              {tarefasFiltradas?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                  <div className={`text-6xl mb-4 ${textSecondary} opacity-20`}>
                    <i className="fa-solid fa-clipboard-list"></i>
                  </div>
                  <p className={`${textPrimary} text-lg font-medium mb-1`}>
                    {busca.trim() ? "Nenhum resultado encontrado" : "Nenhuma tarefa ainda"}
                  </p>
                  <p className={`text-sm ${textSecondary}`}>
                    {busca.trim() ? "Tente buscar por outros termos" : "Adicione sua primeira tarefa para começar"}
                  </p>
                </div>
              ) : (
                <ul className="space-y-2.5 pb-32">
                  {tarefasFiltradas.map((tarefa, index) => (
                    <li
                      key={tarefa.id || index}
                      className={`group ${bgSecondary} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 border ${
                        tarefa.concluida ? 'border-gray-300 dark:border-gray-700 opacity-60' : border
                      } ${
                        tarefa.prioridade === "alta"
                          ? "border-l-4 border-l-red-500"
                          : tarefa.prioridade === "baixa"
                          ? "border-l-4 border-l-green-500"
                          : "border-l-4 border-l-blue-500"
                      } hover:border-gray-400 dark:hover:border-gray-500`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleConcluida(tarefa)}
                          className={`flex-shrink-0 transition-all duration-200 ${
                            tarefa.concluida 
                              ? "text-green-600 scale-110" 
                              : `${textSecondary} hover:text-green-600 hover:scale-110`
                          }`}
                        >
                          <i className={`fa-${tarefa.concluida ? "solid" : "regular"} fa-circle-check text-xl`}></i>
                        </button>
                        
                        {/* Conteúdo da tarefa */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className={`text-base font-medium break-words ${
                                tarefa.concluida ? `line-through ${textSecondary}` : textPrimary
                              }`}
                            >
                              {tarefa.texto}
                            </span>
                            
                            {(filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes") && (
                              <span className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full flex-shrink-0`}>
                                {tarefa.nomeLista}
                              </span>
                            )}
                            
                            {tarefa.importante && (
                              <span className="text-yellow-500 text-sm flex-shrink-0">
                                <i className="fa-solid fa-star"></i>
                              </span>
                            )}
                            
                            {tarefa.prioridade && tarefa.prioridade !== "normal" && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                                  tarefa.prioridade === "alta"
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                    : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                }`}
                              >
                                {tarefa.prioridade === "alta" ? "Alta" : "Baixa"}
                              </span>
                            )}
                          </div>
                          
                          {tarefa.descricao && (
                            <p className={`text-sm ${textSecondary} mb-2 line-clamp-2`}>{tarefa.descricao}</p>
                          )}

                          {(tarefa.link || tarefa.prazo) && (
                            <div className="flex flex-wrap gap-3 text-xs">
                              {tarefa.link && (
                                <a
                                  href={tarefa.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <i className="fa-solid fa-link"></i>
                                  <span>Link</span>
                                </a>
                              )}
                              {tarefa.prazo && (
                                <span
                                  className={`flex items-center gap-1.5 ${
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
                        </div>

                        {/* Botões de ação */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                          <button
                            onClick={() => toggleImportante(tarefa)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              tarefa.importante 
                                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" 
                                : `${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-yellow-500`
                            }`}
                            title="Importante"
                          >
                            <i className="fa-solid fa-star text-sm"></i>
                          </button>
                          <button
                            onClick={() => editarTarefa(tarefa)}
                            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${textSecondary} hover:text-blue-600`}
                            title="Editar"
                          >
                            <i className="fa-solid fa-pencil text-sm"></i>
                          </button>
                          <button
                            onClick={() => removerTarefa(tarefa)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200 hover:scale-110"
                            title="Remover"
                          >
                            <i className="fa-solid fa-trash text-sm"></i>
                          </button>
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

        {/* Input fixo na parte inferior - com sombra */}
        {temLista && filtro === "lista" && (
          <>
            {/* Gradiente de fade sem blur */}
            <div className={`fixed bottom-0 left-0 right-0 md:left-72 lg:left-72 h-40 bg-gradient-to-t ${darkMode ? 'from-gray-900 via-gray-900/98' : 'from-[#5e5e5e5e] via-[#5e5e5e5e]/98'} to-transparent pointer-events-none z-10`}></div>
            
            <div className="fixed bottom-0 left-0 right-0 md:left-72 lg:left-72 p-4 z-20">
              <div className="max-w-3xl mx-auto">
                <div className={`bg-[#2f2f2f] rounded-2xl border transition-all duration-200 ${
                  novaTarefa.trim() ? 'border-blue-500/50' : 'border-gray-700/50'
                }`}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      onClick={() => setModalAberto(true)}
                      className="text-gray-500 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 flex-shrink-0 p-2"
                      title="Adicionar com detalhes"
                    >
                      <i className="fa-solid fa-plus text-base"></i>
                    </button>
                    
                    <input
                      type="text"
                      value={novaTarefa}
                      onChange={(e) => setNovaTarefa(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && adicionarTarefaRapida()}
                      placeholder="Adicionar tarefa..."
                      className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base"
                    />
                    
                    {novaTarefa.trim() && (
                      <button
                        onClick={limparTudo}
                        className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex-shrink-0 p-2"
                        title="Limpar lista"
                      >
                        <i className="fa-solid fa-trash text-base"></i>
                      </button>
                    )}
                    
                    <button
                      onClick={adicionarTarefaRapida}
                      disabled={!novaTarefa.trim()}
                      className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
                        novaTarefa.trim() 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95' 
                          : 'bg-gray-700/50 text-gray-600 cursor-not-allowed'
                      }`}
                      title="Enviar (Enter)"
                    >
                      <i className="fa-solid fa-arrow-up text-base"></i>
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