import React, { useState, useEffect, useRef } from "react";

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
  const [modalConfirmarImportacaoJson, setModalConfirmarImportacaoJson] = useState(false);
  const [modalLimparTudoAberto, setModalLimparTudoAberto] = useState(false);
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
  const [ordenacao, setOrdenacao] = useState("recente");
  const [menuAberto, setMenuAberto] = useState(null);
  const [listasColapsadas, setListasColapsadas] = useState(false);
  const [categoriasColapsadas, setCategoriasColapsadas] = useState(false);
  const [modalBackupAberto, setModalBackupAberto] = useState(false);
  const [abaBackupAtiva, setAbaBackupAtiva] = useState("exportar");
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [dadosParaImportar, setDadosParaImportar] = useState(null);

  // Estados para edição de tarefa
  const [tarefaEditandoTexto, setTarefaEditandoTexto] = useState("");
  const [tarefaEditandoLink, setTarefaEditandoLink] = useState("");
  const [tarefaEditandoDescricao, setTarefaEditandoDescricao] = useState("");
  const [tarefaEditandoPrazo, setTarefaEditandoPrazo] = useState("");
  const [tarefaEditandoPrioridade, setTarefaEditandoPrioridade] = useState("normal");

  // Estados para arquivos
  const [arquivos, setArquivos] = useState([]);
  const [arquivosTarefaEditando, setArquivosTarefaEditando] = useState([]);

  // Ref para input de arquivo
  const fileInputRef = useRef(null);
  const fileInputEdicaoRef = useRef(null);

  // Adicionar estilo CSS com correções para mobile
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

      /* Line clamp utility */
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      /* Touch manipulation for better mobile experience */
      .touch-manipulation {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      /* Prevent text selection on buttons */
      button {
        -webkit-user-select: none;
        user-select: none;
      }

      /* CORREÇÃO DO ZOOM NO MOBILE */
      /* Impede zoom automático no iOS */
      @media screen and (max-width: 768px) {
        input, 
        textarea, 
        select {
          font-size: 16px !important; /* Tamanho mínimo para evitar zoom no iOS */
        }
        
        /* Input de busca */
        #busca-input,
        #busca-input-sidebar {
          font-size: 16px !important;
        }
        
        /* Input do modal */
        .modal-center input,
        .modal-center textarea,
        .modal-center select {
          font-size: 16px !important;
        }
      }
      
      /* Desabilita zoom por toque duplo */
      * {
        touch-action: manipulation;
      }
      
      /* Para inputs específicos */
      input[type="text"],
      input[type="url"],
      input[type="date"],
      input[type="search"],
      textarea {
        font-size: 16px !important;
        max-height: none !important;
      }
      
      /* Para iOS Safari específico */
      @supports (-webkit-touch-callout: none) {
        input, 
        textarea, 
        select {
          font-size: 16px !important;
        }
      }

      /* Modal centralizado - correção */
      .modal-center {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) !important;
        z-index: 100;
        margin-left: 0 !important;
        max-width: 95%;
        max-height: 90vh;
        overflow-y: auto;
      }

      @media (min-width: 768px) {
        .modal-center {
          max-width: 32rem;
        }
      }

      /* Estilos específicos para o modal de backup */
      .backup-tab {
        position: relative;
        padding-bottom: 12px;
      }
      
      .backup-tab-active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: #3A3A3A;
        border-radius: 3px 3px 0 0;
      }
      
      .file-dropzone {
        border: 2px dashed #d1d5db;
        border-radius: 8px;
        padding: 40px 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .file-dropzone:hover {
        border-color: #3A3A3A;
        background-color: #f9fafb;
      }
      
      .file-dropzone.dragging {
        border-color: #3A3A3A;
        background-color: #f3f4f6;
      }
      
      .file-dropzone .icon {
        font-size: 48px;
        color: #9ca3af;
        margin-bottom: 16px;
      }
      
      .file-dropzone:hover .icon {
        color: #3A3A3A;
      }
      
      /* Estilos para arquivos */
      .file-preview {
        transition: all 0.3s ease;
      }
      
      .file-preview:hover {
        transform: translateY(-2px);
      }
      
      .file-icon-pdf {
        color: #FF6B6B;
      }
      
      .file-icon-word {
        color: #2B579A;
      }
      
      .file-icon-excel {
        color: #217346;
      }
      
      .file-icon-powerpoint {
        color: #D24726;
      }
      
      /* Adicione responsividade para arquivos */
      @media (max-width: 640px) {
        .file-item {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .file-actions {
          align-self: flex-end;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Adiciona meta tag para viewport corrigida
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    }
    
    return () => {
      document.head.removeChild(style);
    };
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
        setModalConfirmarImportacaoJson(false);
        setModalLimparTudoAberto(false);
        setModalBackupAberto(false);
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

  // Funções para manipular arquivos
  function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    
    // Validar tamanho total (limite de 10MB por arquivo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = files.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      setMensagem("Alguns arquivos excedem o limite de 10MB!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    // Ler cada arquivo como base64
    const filePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: gerarId(),
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            data: e.target.result, // Base64
            criadoEm: new Date().toISOString()
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(arquivosConvertidos => {
      setArquivos(prev => [...prev, ...arquivosConvertidos]);
      setMensagem(`${arquivosConvertidos.length} arquivo(s) adicionado(s)`);
      setTimeout(() => setMensagem(""), 3000);
    }).catch(error => {
      console.error("Erro ao ler arquivos:", error);
      setMensagem("Erro ao carregar arquivos!");
      setTimeout(() => setMensagem(""), 3000);
    });
  }

  function handleFileUploadEdicao(event) {
    const files = Array.from(event.target.files);
    
    const maxSize = 10 * 1024 * 1024;
    const invalidFiles = files.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      setMensagem("Alguns arquivos excedem o limite de 10MB!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const filePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: gerarId(),
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            data: e.target.result,
            criadoEm: new Date().toISOString()
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(arquivosConvertidos => {
      setArquivosTarefaEditando(prev => [...prev, ...arquivosConvertidos]);
      setMensagem(`${arquivosConvertidos.length} arquivo(s) adicionado(s)`);
      setTimeout(() => setMensagem(""), 3000);
    }).catch(error => {
      console.error("Erro ao ler arquivos:", error);
      setMensagem("Erro ao carregar arquivos!");
      setTimeout(() => setMensagem(""), 3000);
    });
  }

  function removerArquivo(id) {
    setArquivos(prev => prev.filter(arquivo => arquivo.id !== id));
  }

  function removerArquivoEdicao(id) {
    setArquivosTarefaEditando(prev => prev.filter(arquivo => arquivo.id !== id));
  }

  function formatarTamanho(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getFileIcon(tipo) {
    if (tipo.includes('pdf')) return 'fa-file-pdf';
    if (tipo.includes('word') || tipo.includes('document')) return 'fa-file-word';
    if (tipo.includes('excel') || tipo.includes('sheet')) return 'fa-file-excel';
    if (tipo.includes('powerpoint') || tipo.includes('presentation')) return 'fa-file-powerpoint';
    if (tipo.includes('image')) return 'fa-file-image';
    return 'fa-file';
  }

  function baixarArquivo(arquivo) {
    const link = document.createElement('a');
    link.href = arquivo.data;
    link.download = arquivo.nome;
    link.click();
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
      arquivos: arquivos || [],
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
    setArquivos([]);
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
      arquivos: [],
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
    setArquivosTarefaEditando(tarefa.arquivos || []);
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
      arquivos: arquivosTarefaEditando || [],
    };

    setListas({
      ...listas,
      [tarefaEditando.listaOriginal]: novas,
    });

    setModalEditarAberto(false);
    setTarefaEditando(null);
    setArquivosTarefaEditando([]);
    setMensagem("Tarefa editada com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  }

  // Limpar tudo
  function limparTudo() {
    if (!listas[listaAtiva] || listas[listaAtiva].length === 0) {
      setMensagem("Não há nada para limpar!");
      setTimeout(() => setMensagem(""), 3000);
    } else {
      setModalLimparTudoAberto(true);
    }
  }

  // Confirmar limpar tudo
  function confirmarLimparTudo() {
    setListas({
      ...listas,
      [listaAtiva]: [],
    });
    setModalLimparTudoAberto(false);
    setMensagem("Lista de tarefas limpa com sucesso!");
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

  // Export de dados (para download direto)
  function exportarDados() {
    const dados = {
      listas,
      exportadoEm: new Date().toISOString(),
      versao: "1.1"
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

  // Função para lidar com seleção de arquivo
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar se é um arquivo JSON
    if (!file.name.toLowerCase().endsWith('.json')) {
      setMensagem("Por favor, selecione um arquivo JSON válido.");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    setArquivoSelecionado(file);

    // Ler o arquivo
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const conteudo = e.target.result;
        const dados = JSON.parse(conteudo);

        // Validar estrutura básica
        if (!dados.listas || !dados.versao) {
          setMensagem("Arquivo JSON inválido. Certifique-se de que foi exportado do ListFy.");
          setTimeout(() => setMensagem(""), 3000);
          setArquivoSelecionado(null);
          return;
        }

        // Armazena os dados para confirmação
        setDadosParaImportar(dados);
        setModalConfirmarImportacaoJson(true);
        
      } catch (error) {
        console.error("Erro ao ler arquivo:", error);
        setMensagem("Erro ao ler o arquivo. Certifique-se de que é um JSON válido.");
        setTimeout(() => setMensagem(""), 3000);
        setArquivoSelecionado(null);
      }
    };
    reader.readAsText(file);
  }

  // Função para confirmar importação JSON (adiciona em vez de substituir)
  function confirmarImportacaoJson() {
    try {
      const novasListas = { ...listas };
      
      // Adiciona as listas importadas às listas existentes
      Object.keys(dadosParaImportar.listas).forEach(nomeLista => {
        // Se a lista já existe, adiciona as tarefas ao final
        if (novasListas[nomeLista]) {
          novasListas[nomeLista] = [...novasListas[nomeLista], ...dadosParaImportar.listas[nomeLista]];
        } else {
          // Se não existe, cria a lista
          novasListas[nomeLista] = dadosParaImportar.listas[nomeLista];
        }
      });

      setListas(novasListas);
      
      // Se não há lista ativa, definir a primeira lista importada
      if (!listaAtiva && Object.keys(dadosParaImportar.listas).length > 0) {
        setListaAtiva(Object.keys(dadosParaImportar.listas)[0]);
        setFiltro("lista");
      }

      setModalConfirmarImportacaoJson(false);
      setModalBackupAberto(false);
      setArquivoSelecionado(null);
      setDadosParaImportar(null);
      setMensagem("Backup importado com sucesso! As listas foram adicionadas às suas listas atuais.");
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      console.error("Erro ao importar backup:", error);
      setMensagem("Erro ao importar backup.");
      setTimeout(() => setMensagem(""), 3000);
    }
  }

  // Função para abrir seletor de arquivos
  function abrirSeletorArquivos() {
    fileInputRef.current?.click();
  }

  // Função para arrastar e soltar arquivos
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragging');
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragging');
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragging');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const event = { target: { files: [file] } };
      handleFileSelect(event);
    }
  }

  // Sincronização - Gerar código
  function gerarCodigoSync() {
    try {
      const dados = {
        listas,
        versao: "1.1",
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

  // Sincronização - Importar código (modificada para adicionar)
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

      // Armazena os dados para confirmação
      setDadosParaImportar(dados);
      setModalConfirmarImportacao(true);
    } catch (error) {
      console.error("Erro ao importar código:", error);
      setMensagem("Código inválido! Verifique e tente novamente.");
      setTimeout(() => setMensagem(""), 3000);
    }
  }

  // Confirmar importação (modificada para adicionar)
  function confirmarImportacao() {
    try {
      const novasListas = { ...listas };
      
      // Adiciona as listas importadas às listas existentes
      Object.keys(dadosParaImportar.listas).forEach(nomeLista => {
        // Se a lista já existe, adiciona as tarefas ao final
        if (novasListas[nomeLista]) {
          novasListas[nomeLista] = [...novasListas[nomeLista], ...dadosParaImportar.listas[nomeLista]];
        } else {
          // Se não existe, cria a lista
          novasListas[nomeLista] = dadosParaImportar.listas[nomeLista];
        }
      });

      setListas(novasListas);
      
      // Se não há lista ativa, definir a primeira lista importada
      if (!listaAtiva && Object.keys(dadosParaImportar.listas).length > 0) {
        setListaAtiva(Object.keys(dadosParaImportar.listas)[0]);
        setFiltro("lista");
      }
      
      setModalConfirmarImportacao(false);
      setModalSyncAberto(false);
      setCodigoImportar("");
      setDadosParaImportar(null);
      setMensagem("Listas importadas com sucesso! Os dados foram adicionados aos seus atuais.");
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

  // ========== RENDERIZAÇÃO ==========

  const temLista = Object.keys(listas).length > 0;
  const tarefasFiltradas = obterTarefasGlobais();

  // Classes para cores
  const bgPrimary = "bg-[#5e5e5e5e]";
  const bgSecondary = "bg-white";
  const textPrimary = "text-gray-900";
  const textSecondary = "text-gray-600";
  const border = "border-gray-300";

  return (
    <div className={`flex h-screen min-w-[315px] relative overflow-hidden touch-manipulation bg-[#5e5e5e5e]`}>
      {/* Overlay mobile */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Modal de Backup de Dados */}
      {modalBackupAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-2xl shadow-2xl border ${border} mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className={`flex items-center justify-between p-6 border-b ${border}`}>
              <h1 className="text-2xl font-bold">Backup de Dados</h1>
              <button
                onClick={() => {
                  setModalBackupAberto(false);
                  setArquivoSelecionado(null);
                  setAbaBackupAtiva("exportar");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b ${border}">
              <button
                onClick={() => setAbaBackupAtiva("exportar")}
                className={`flex-1 backup-tab ${abaBackupAtiva === "exportar" ? "backup-tab-active font-semibold" : "text-gray-500 hover:text-gray-700"}`}
              >
                <div className="py-4 text-center">
                  <h2 className="text-lg font-medium">Exportar</h2>
                </div>
              </button>
              <button
                onClick={() => setAbaBackupAtiva("importar")}
                className={`flex-1 backup-tab ${abaBackupAtiva === "importar" ? "backup-tab-active font-semibold" : "text-gray-500 hover:text-gray-700"}`}
              >
                <div className="py-4 text-center">
                  <h2 className="text-lg font-medium">Importar</h2>
                </div>
              </button>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="p-6">
              {abaBackupAtiva === "exportar" ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <i className="fa-solid fa-database text-blue-600 text-xl"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Exportar Backup</h3>
                        <p className="text-blue-800">
                          Crie um backup completo de todas as suas listas e tarefas em formato JSON.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold mb-3">Baixar JSON</h4>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <i className="fa-solid fa-file-code text-gray-600"></i>
                        <span className="font-medium">Formato:</span>
                        <span className="text-gray-600">JSON (.json)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-shield-alt text-gray-600"></i>
                        <span className="font-medium">Uso:</span>
                        <span className="text-gray-600">Guarde em local seguro para restaurar depois</span>
                      </div>
                    </div>

                    <button
                      onClick={exportarDados}
                      className="w-full bg-[#3A3A3A] text-white px-6 py-4 rounded-lg hover:bg-[#4e4e4e] transition font-medium text-lg flex items-center justify-center gap-3 shadow-lg"
                    >
                      <i className="fa-solid fa-download"></i>
                      Baixar Backup
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <i className="fa-solid fa-info-circle text-yellow-600 text-xl"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-yellow-900 mb-2">Informação Importante</h3>
                        <p className="text-yellow-800">
                          As listas e tarefas importadas serão <strong>adicionadas</strong> às suas atuais. 
                          Se houver listas com nomes iguais, as tarefas serão combinadas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">Selecione um arquivo JSON</h4>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".json"
                      className="hidden"
                    />

                    <div
                      className="file-dropzone"
                      onClick={abrirSeletorArquivos}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="icon">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {arquivoSelecionado ? arquivoSelecionado.name : "Clique para selecionar ou arraste um arquivo"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Arquivos .json
                      </p>
                    </div>

                    {arquivoSelecionado && (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <i className="fa-solid fa-circle-check text-green-600"></i>
                          <div>
                            <p className="font-medium text-green-900">Arquivo selecionado:</p>
                            <p className="text-sm text-green-700">{arquivoSelecionado.name}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold mb-2">Requisitos:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-check text-green-600"></i>
                          Arquivo JSON válido
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-check text-green-600"></i>
                          Estrutura compatível com ListFy
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-check text-green-600"></i>
                          Exportado do próprio ListFy
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => arquivoSelecionado && confirmarImportacaoJson()}
                    disabled={!arquivoSelecionado}
                    className={`w-full px-6 py-4 rounded-lg transition font-medium text-lg flex items-center justify-center gap-3 ${arquivoSelecionado
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    <i className="fa-solid fa-file-import"></i>
                    Importar Backup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para limpar tudo */}
      {modalLimparTudoAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border} mx-4 animate-in`}>
            <div className={`flex items-start gap-4 p-6 border-b ${border}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fa-solid fa-broom text-red-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Limpar lista completa</h2>
                <p className={`text-sm ${textSecondary}`}>
                  Tem certeza que deseja limpar todas as tarefas da lista <span className="font-semibold text-red-600">"{listaAtiva}"</span>?
                </p>
              </div>
              <button
                onClick={() => setModalLimparTudoAberto(false)}
                className={`${textSecondary} hover:${textPrimary} text-xl p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 text-sm mt-0.5"></i>
                  <p className="text-sm text-red-900">
                    Esta ação irá remover <strong className="font-bold">{listas[listaAtiva]?.length || 0} tarefas</strong> permanentemente e não pode ser desfeita.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => setModalLimparTudoAberto(false)}
                  className={`flex-1 px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-base`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarLimparTudo}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium text-base shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                >
                  Sim, limpar tudo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renomear lista */}
      {modalRenomearListaAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border} mx-4`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-2xl font-bold">Renomear Lista</h2>
              <button
                onClick={() => {
                  setModalRenomearListaAberto(false);
                  setListaRenomeando("");
                  setNovoNomeLista("");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors`}
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
                  style={{ fontSize: '16px' }}
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
                  className={`w-full px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition text-base`}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border} mx-4`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-2xl font-bold">Nova Lista</h2>
              <button
                onClick={() => {
                  setModalCriarListaAberto(false);
                  setNomeNovaLista("");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors`}
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
                  style={{ fontSize: '16px' }}
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
                  className={`w-full px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition text-base`}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border ${border} mx-4`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-2xl font-bold">Nova Tarefa</h2>
              <button
                onClick={() => {
                  setModalAberto(false);
                  setArquivos([]);
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors`}
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
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa..."
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none h-24 resize-none text-base ${bgSecondary} ${textPrimary}`}
                  style={{ fontSize: '16px' }}
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
                  style={{ fontSize: '16px' }}
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
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                    style={{ fontSize: '16px' }}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              {/* Seção de Arquivos */}
              <div>
                <label className="block text-sm font-medium mb-2">Arquivos Anexados</label>
                
                {/* Área de upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-4xl text-gray-400 mb-2">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Clique para enviar</span> ou arraste os arquivos
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, Word, Excel, PowerPoint, Imagens (até 10MB cada)
                    </p>
                  </label>
                </div>

                {/* Lista de arquivos anexados */}
                {arquivos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Arquivos selecionados:</h4>
                    <div className="max-h-40 overflow-y-auto">
                      {arquivos.map(arquivo => (
                        <div
                          key={arquivo.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${arquivo.tipo.includes('pdf') ? 'bg-red-100 text-red-600' :
                              arquivo.tipo.includes('word') ? 'bg-blue-100 text-blue-600' :
                                arquivo.tipo.includes('excel') ? 'bg-green-100 text-green-600' :
                                  arquivo.tipo.includes('powerpoint') ? 'bg-orange-100 text-orange-600' :
                                    'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <i className={`fa-solid ${getFileIcon(arquivo.tipo)} text-lg`}></i>
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs">{arquivo.nome}</p>
                              <p className="text-xs text-gray-500">{formatarTamanho(arquivo.tamanho)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removerArquivo(arquivo.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={adicionarTarefa}
                  className="w-full bg-[#3A3A3A] text-white px-4 py-3 rounded-lg hover:bg-[#4e4e4e] transition font-medium text-base"
                >
                  Adicionar Tarefa
                </button>
                <button
                  onClick={() => {
                    setModalAberto(false);
                    setArquivos([]);
                  }}
                  className={`w-full px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition text-base`}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full !max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border ${border} mx-4`}>
            <div className={`sticky top-0 ${bgSecondary} flex justify-between items-center p-6 border-b ${border} rounded-t-xl`}>
              <h2 className="text-2xl font-bold">Editar Tarefa</h2>
              <button
                onClick={() => {
                  setModalEditarAberto(false);
                  setTarefaEditando(null);
                  setArquivosTarefaEditando([]);
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors`}
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
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={tarefaEditandoDescricao}
                  onChange={(e) => setTarefaEditandoDescricao(e.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa..."
                  className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none h-24 resize-none text-base ${bgSecondary} ${textPrimary}`}
                  style={{ fontSize: '16px' }}
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
                  style={{ fontSize: '16px' }}
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
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prioridade</label>
                  <select
                    value={tarefaEditandoPrioridade}
                    onChange={(e) => setTarefaEditandoPrioridade(e.target.value)}
                    className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-base ${bgSecondary} ${textPrimary}`}
                    style={{ fontSize: '16px' }}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              {/* Seção de Arquivos */}
              <div>
                <label className="block text-sm font-medium mb-2">Arquivos Anexados</label>
                
                {/* Área de upload */}
                <div className="mb-4">
                  <input
                    type="file"
                    id="file-upload-edicao"
                    ref={fileInputEdicaoRef}
                    multiple
                    onChange={handleFileUploadEdicao}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload-edicao"
                    className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-4xl text-gray-400 mb-2">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Clique para enviar</span> ou arraste os arquivos
                    </p>
                    <p className="text-xs text-gray-500">
                      Adicionar mais arquivos
                    </p>
                  </label>
                </div>

                {/* Lista de arquivos anexados */}
                {arquivosTarefaEditando.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Arquivos anexados:</h4>
                    <div className="max-h-40 overflow-y-auto">
                      {arquivosTarefaEditando.map(arquivo => (
                        <div
                          key={arquivo.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${arquivo.tipo.includes('pdf') ? 'bg-red-100 text-red-600' :
                              arquivo.tipo.includes('word') ? 'bg-blue-100 text-blue-600' :
                                arquivo.tipo.includes('excel') ? 'bg-green-100 text-green-600' :
                                  arquivo.tipo.includes('powerpoint') ? 'bg-orange-100 text-orange-600' :
                                    'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <i className={`fa-solid ${getFileIcon(arquivo.tipo)} text-lg`}></i>
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs">{arquivo.nome}</p>
                              <p className="text-xs text-gray-500">{formatarTamanho(arquivo.tamanho)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => baixarArquivo(arquivo)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Baixar arquivo"
                            >
                              <i className="fa-solid fa-download"></i>
                            </button>
                            <button
                              onClick={() => removerArquivoEdicao(arquivo.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remover arquivo"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    setArquivosTarefaEditando([]);
                  }}
                  className={`w-full px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition text-base`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de importação JSON */}
      {modalConfirmarImportacaoJson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border} mx-4 animate-in`}>
            <div className={`flex items-start gap-4 p-6 border-b ${border}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="fa-solid fa-file-import text-blue-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Importar Backup</h2>
                <p className={`text-sm ${textPrimary}`}>
                  Deseja importar o backup do arquivo?
                </p>
              </div>
              <button
                onClick={() => {
                  setModalConfirmarImportacaoJson(false);
                  setDadosParaImportar(null);
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-info-circle text-blue-600 text-sm mt-0.5"></i>
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Resumo da importação:</p>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li className="flex items-center justify-between">
                        <span>Listas importadas:</span>
                        <span className="font-semibold">{Object.keys(dadosParaImportar?.listas || {}).length}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Tarefas totais:</span>
                        <span className="font-semibold">
                          {Object.values(dadosParaImportar?.listas || {}).reduce((acc, lista) => acc + lista.length, 0)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-triangle-exclamation text-yellow-600 text-sm mt-0.5"></i>
                  <p className="text-sm text-yellow-900">
                    <strong>Importante:</strong> As listas importadas serão <strong>adicionadas</strong> às suas listas atuais. Se houver listas com nomes iguais, as tarefas serão combinadas.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setModalConfirmarImportacaoJson(false);
                    setDadosParaImportar(null);
                  }}
                  className={`flex-1 px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-base`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarImportacaoJson}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                >
                  Sim, importar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de importação (SINCRONIZAÇÃO) */}
      {modalConfirmarImportacao && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border} mx-4 animate-in`}>
            <div className={`flex items-start gap-4 p-6 border-b ${border}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="fa-solid fa-file-import text-blue-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Importar Listas</h2>
                <p className={`text-sm ${textPrimary}`}>
                  Deseja importar as listas do código?
                </p>
              </div>
              <button
                onClick={() => {
                  setModalConfirmarImportacao(false);
                  setDadosParaImportar(null);
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-info-circle text-blue-600 text-sm mt-0.5"></i>
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Resumo da importação:</p>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li className="flex items-center justify-between">
                        <span>Listas importadas:</span>
                        <span className="font-semibold">{Object.keys(dadosParaImportar?.listas || {}).length}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Tarefas totais:</span>
                        <span className="font-semibold">
                          {Object.values(dadosParaImportar?.listas || {}).reduce((acc, lista) => acc + lista.length, 0)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-triangle-exclamation text-yellow-600 text-sm mt-0.5"></i>
                  <p className="text-sm text-yellow-900">
                    <strong>Importante:</strong> As listas importadas serão <strong>adicionadas</strong> às suas listas atuais. Se houver listas com nomes iguais, as tarefas serão combinadas.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setModalConfirmarImportacao(false);
                    setDadosParaImportar(null);
                  }}
                  className={`flex-1 px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-base`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarImportacao}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                >
                  Sim, importar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sincronização */}
      {modalSyncAberto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-2xl shadow-2xl border ${border} mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className={`flex items-center justify-between p-6 border-b ${border}`}>
              <h2 className="text-2xl font-bold">Sincronizar Dispositivos</h2>
              <button
                onClick={() => {
                  setModalSyncAberto(false);
                  setCodigoSync("");
                  setCodigoImportar("");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setAbaSyncAtiva("gerar")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${abaSyncAtiva === "gerar"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : `${textSecondary} hover:text-gray-900`
                  }`}
              >
                <i className="fa-solid fa-qrcode mr-2"></i>
                Gerar Código
              </button>
              <button
                onClick={() => setAbaSyncAtiva("importar")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${abaSyncAtiva === "importar"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : `${textSecondary} hover:text-gray-900`
                  }`}
              >
                <i className="fa-solid fa-file-import mr-2"></i>
                Importar Código
              </button>
            </div>

            <div className="p-6">
              {abaSyncAtiva === "gerar" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-info-circle text-blue-600 text-lg mt-0.5"></i>
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Como funciona:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-blue-800">
                          <li>Clique em "Gerar Código" abaixo</li>
                          <li>Copie o código completo que aparecer</li>
                          <li>No outro dispositivo, cole na aba "Importar Código"</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {!codigoSync ? (
                    <button
                      onClick={gerarCodigoSync}
                      className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition font-medium text-base flex items-center justify-center gap-2 shadow-lg"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      Gerar Código de Sincronização
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Dados a sincronizar:</p>
                        <div className="flex items-center justify-around">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{Object.keys(listas).length}</div>
                            <div className="text-xs text-gray-600 mt-1">Listas</div>
                          </div>
                          <div className="w-px h-12 bg-gray-300"></div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {Object.values(listas).reduce((acc, lista) => acc + lista.length, 0)}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Tarefas</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Código gerado:</label>
                        <textarea
                          value={codigoSync}
                          readOnly
                          className={`w-full p-3 border ${border} rounded-lg text-xs font-mono ${bgSecondary} ${textPrimary} h-32 resize-none`}
                          style={{ fontSize: '14px' }}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={copiarCodigo}
                          className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium text-base flex items-center justify-center gap-2 shadow-lg"
                        >
                          <i className="fa-solid fa-copy"></i>
                          Copiar Código
                        </button>
                        <button
                          onClick={() => setCodigoSync("")}
                          className={`px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition text-base`}
                          title="Gerar novo código"
                        >
                          <i className="fa-solid fa-rotate-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {abaSyncAtiva === "importar" && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-triangle-exclamation text-yellow-600 text-lg mt-0.5"></i>
                      <div className="text-sm text-yellow-900">
                        <p className="font-medium mb-1">Atenção:</p>
                        <p className="text-xs text-yellow-800">As listas importadas serão adicionadas às suas listas atuais.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cole o código completo aqui:</label>
                    <textarea
                      value={codigoImportar}
                      onChange={(e) => setCodigoImportar(e.target.value)}
                      placeholder="Cole o código de sincronização completo aqui..."
                      className={`w-full p-3 border ${border} rounded-lg focus:border-blue-500 focus:outline-none text-xs font-mono ${bgSecondary} ${textPrimary} h-32 resize-none`}
                      style={{ fontSize: '14px' }}
                    />
                  </div>

                  <button
                    onClick={importarCodigoSync}
                    disabled={!codigoImportar.trim()}
                    className={`w-full px-6 py-3 rounded-lg transition font-medium text-base flex items-center justify-center gap-2 ${codigoImportar.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className={`modal-center ${bgSecondary} ${textPrimary} rounded-xl w-full max-w-md shadow-2xl border ${border} mx-4 animate-in`}>
            <div className={`flex items-start gap-4 p-6 border-b ${border}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Excluir lista</h2>
                <p className={`text-sm ${textSecondary}`}>
                  Tem certeza que deseja excluir a lista <span className="font-semibold text-red-600">"{listaExcluindo}"</span>?
                </p>
              </div>
              <button
                onClick={() => {
                  setModalExcluirListaAberto(false);
                  setListaExcluindo("");
                }}
                className={`${textSecondary} hover:${textPrimary} text-xl p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0`}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-info-circle text-red-600 text-sm mt-0.5"></i>
                  <p className="text-sm text-red-900">
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
                  className={`flex-1 px-4 py-3 border ${border} rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-base`}
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

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 w-full sm:w-80 md:w-72 lg:w-80 bg-[#2f2f2f] text-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
          ${sidebarAberta ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col max-w-sm md:max-w-none
        `}
      >
        {/* Header fixo */}
        <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-600">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-dove text-base sm:text-lg md:text-xl"></i>
            <span>ListFy</span>
          </h2>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              className="md:hidden text-gray-400 hover:text-white transition p-2 sm:p-2.5 rounded text-base touch-manipulation"
              onClick={toggleSidebar}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-5 space-y-2">
            <button
              onClick={criarLista}
              className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 text-sm touch-manipulation"
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
                className="w-full bg-gray-700 text-white placeholder-gray-400 text-sm p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                style={{ fontSize: '16px' }}
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>

            <button
              onClick={() => {
                setModalBackupAberto(true);
                setAbaBackupAtiva("exportar");
                setArquivoSelecionado(null);
              }}
              className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 text-sm touch-manipulation"
              title="Backup de dados"
            >
              <i className="fa-solid fa-database text-base"></i>
              <span>Backup de Dados</span>
            </button>

            <button
              onClick={() => {
                setModalSyncAberto(true);
                setAbaSyncAtiva("gerar");
                setCodigoSync("");
                setCodigoImportar("");
              }}
              className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 text-sm touch-manipulation"
              title="Sincronizar dispositivos"
            >
              <i className="fa-solid fa-rotate text-base"></i>
              <span>Sincronizar</span>
            </button>
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
                  className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${filtro === "incompletas"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                >
                  <i className="fa-solid fa-clock text-base"></i>
                  <span>Incompletas</span>
                </button>

                <button
                  onClick={() => mudarFiltro("concluidas")}
                  className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${filtro === "concluidas"
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                >
                  <i className="fa-solid fa-check text-base"></i>
                  <span>Concluídas</span>
                </button>

                <button
                  onClick={() => mudarFiltro("importantes")}
                  className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${filtro === "importantes"
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
            <div className="px-4 sm:px-5 pb-6">
              <button
                onClick={() => setListasColapsadas(!listasColapsadas)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors mb-3 touch-manipulation p-1"
              >
                <i className={`fa-solid fa-chevron-${listasColapsadas ? 'right' : 'down'} text-xs transition-transform`}></i>
                Minhas Listas
              </button>

              {!listasColapsadas && (
                <div className="space-y-1.5">
                  {Object.keys(listas).map((nome) => (
                    <div key={nome} className="group relative">
                      <button
                        onClick={() => {
                          setListaAtiva(nome);
                          setFiltro("lista");
                          setBusca("");
                          setMenuAberto(null);
                        }}
                        className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 touch-manipulation ${listaAtiva === nome && filtro === "lista"
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
              <div className="w-full h-full flex flex-col max-w-6xl mx-auto">
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
                          style={{ fontSize: '16px' }}
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
                        style={{ fontSize: '16px' }}
                      />
                      <i className={`fa-solid fa-search absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-sm ${textSecondary}`}></i>
                    </div>
                  )}
                </div>

                {filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes" ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="text-blue-600 text-xl sm:text-2xl flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-info-circle"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
                          Visualização: {obterTituloAtual()}
                        </h3>
                        <p className="text-blue-800 text-xs sm:text-sm">
                          Selecione uma lista específica na barra lateral para adicionar novas tarefas.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {mensagem && (
                  <div className={`mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium ${mensagem.includes("sucesso")
                    ? "bg-green-50 text-green-900 border border-green-200"
                    : "bg-red-50 text-red-900 border border-red-200"
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
                      {tarefasFiltradas.map((tarefa, index) => (
                        <li
                          key={tarefa.id || index}
                          className={`group ${bgSecondary} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 sm:p-4 border ${tarefa.concluida ? 'border-gray-300 opacity-60' : border
                            } ${tarefa.prioridade === "alta"
                              ? "border-l-4 border-l-red-500"
                              : tarefa.prioridade === "baixa"
                                ? "border-l-4 border-l-green-500"
                                : "border-l-4 border-l-blue-500"
                            } hover:border-gray-400 touch-manipulation`}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <button
                              onClick={() => toggleConcluida(tarefa)}
                              className={`flex-shrink-0 transition-all duration-200 mt-0.5 touch-manipulation p-1 ${tarefa.concluida
                                ? "text-green-600 scale-110"
                                : `${textSecondary} hover:text-green-600 hover:scale-110`
                                }`}
                            >
                              <i className={`fa-${tarefa.concluida ? "solid" : "regular"} fa-circle-check pt-1 text-xl sm:text-2xl`}></i>
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                                <span
                                  className={`!text-xl pt-2 sm:text-base font-medium break-words ${tarefa.concluida ? `line-through ${textSecondary}` : textPrimary
                                    }`}
                                >
                                  {tarefa.texto}
                                </span>

                                {(filtro === "incompletas" || filtro === "concluidas" || filtro === "importantes") && (
                                  <span className={`text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0`}>
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
                                    className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${tarefa.prioridade === "alta"
                                      ? "bg-red-100 text-black"
                                      : "bg-green-100 text-green-700"
                                      }`}
                                  >
                                    {tarefa.prioridade === "alta" ? "Alta" : "Baixa"}
                                  </span>
                                )}
                              </div>

                              {tarefa.descricao && (
                                <p className={`text-xs sm:text-sm ${textSecondary} mb-1.5 sm:mb-2 line-clamp-2`}>{tarefa.descricao}</p>
                              )}

                              {(tarefa.link || tarefa.prazo) && (
                                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
                                  {tarefa.link && (
                                    <a
                                      href={tarefa.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center gap-1 touch-manipulation"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <i className="fa-solid fa-link"></i>
                                      <span>Link</span>
                                    </a>
                                  )}
                                  {tarefa.prazo && (
                                    <span
                                      className={`flex items-center gap-1 ${verificarPrazo(tarefa.prazo)
                                        ? "text-red-600 font-semibold"
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

                              {/* Seção de arquivos anexados */}
                              {tarefa.arquivos && tarefa.arquivos.length > 0 && (
                                <div className="mt-2">
                                  <div className="flex flex-wrap gap-1.5">
                                    {tarefa.arquivos.map(arquivo => (
                                      <button
                                        key={arquivo.id}
                                        onClick={() => baixarArquivo(arquivo)}
                                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors touch-manipulation"
                                        title={`Baixar ${arquivo.nome}`}
                                      >
                                        <i className={`fa-solid ${getFileIcon(arquivo.tipo)} ${arquivo.tipo.includes('pdf') ? 'text-red-500' :
                                          arquivo.tipo.includes('word') ? 'text-blue-500' :
                                            arquivo.tipo.includes('excel') ? 'text-green-500' :
                                              arquivo.tipo.includes('powerpoint') ? 'text-orange-500' :
                                                'text-gray-500'
                                          }`}
                                        ></i>
                                        <span className="truncate max-w-[100px]">{arquivo.nome.split('.')[0]}</span>
                                        <span className="text-gray-500">.{arquivo.nome.split('.').pop()}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-0.5 sm:gap-1 transition-opacity duration-200 flex-shrink-0">
                              <button
                                onClick={() => toggleImportante(tarefa)}
                                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 touch-manipulation ${tarefa.importante
                                  ? "text-yellow-500 bg-yellow-50"
                                  : `${textSecondary} hover:bg-gray-100 hover:text-yellow-500`
                                  }`}
                                title="Importante"
                              >
                                <i className="fa-solid fa-star !text-xl sm:text-sm"></i>
                              </button>
                              <button
                                onClick={() => editarTarefa(tarefa)}
                                className={`p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ${textSecondary} hover:text-blue-600 touch-manipulation`}
                                title="Editar"
                              >
                                <i className="fa-solid fa-pencil !text-xl sm:text-base"></i>
                              </button>
                              <button
                                onClick={() => removerTarefa(tarefa)}
                                className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 touch-manipulation"
                                title="Remover"
                              >
                                <i className="fa-solid fa-trash !text-xl sm:text-sm"></i>
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

        {temLista && filtro === "lista" && (
          <>
            <div className={`fixed bottom-0 left-0 right-0 md:left-72 lg:left-80 h-32 sm:h-40 bg-gradient-to-t from-[#5e5e5e5e] via-[#5e5e5e5e]/98 to-transparent pointer-events-none z-10`}></div>

            <div className="fixed bottom-0 left-0 right-0 md:left-72 lg:left-80 p-3 sm:p-4 z-20">
              <div className="max-w-6xl mx-auto">
                <div className={`bg-[#2f2f2f] rounded-2xl border transition-all duration-200 ${novaTarefa.trim() ? 'border-blue-500/50' : 'border-gray-700/50'
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
                      className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base touch-manipulation"
                      style={{ fontSize: '16px' }}
                    />

                    <button
                      onClick={() => setModalLimparTudoAberto(true)}
                      className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex-shrink-0 p-1.5 sm:p-2 touch-manipulation"
                      title="Limpar lista"
                    >
                      <i className="fa-solid fa-trash text-sm sm:text-base"></i>
                    </button>

                    <button
                      onClick={adicionarTarefaRapida}
                      disabled={!novaTarefa.trim()}
                      className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 touch-manipulation ${novaTarefa.trim()
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