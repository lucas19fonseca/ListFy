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

  // Adicionar estilo CSS para esconder scrollbar
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Salvar no localStorage com tratamento de erro
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

  // Definir lista ativa inicial se não houver uma
  useEffect(() => {
    if (!listaAtiva && Object.keys(listas).length > 0) {
      setListaAtiva(Object.keys(listas)[0]);
    }
  }, [listas, listaAtiva]);

  // Gerar ID único para tarefas
  function gerarId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Adicionar tarefa com validação melhorada
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
    
    // Validação básica de URL se houver link
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

  // Adicionar tarefa rápida (sem modal)
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

  // Remover tarefa
  function removerTarefa(index) {
    const novas = [...listas[listaAtiva]];
    novas.splice(index, 1);
    setListas({
      ...listas,
      [listaAtiva]: novas,
    });
  }

  // Editar tarefa
  function editarTarefa(index) {
    const tarefaAtual = listas[listaAtiva][index];
    const novoTexto = prompt("Edite a tarefa:", tarefaAtual.texto);
    
    if (novoTexto && novoTexto.trim() !== "") {
      const novas = [...listas[listaAtiva]];
      novas[index] = {
        ...novas[index],
        texto: novoTexto.trim(),
      };
      setListas({
        ...listas,
        [listaAtiva]: novas,
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

  // Toggle concluída
  function toggleConcluida(index) {
    const novas = [...listas[listaAtiva]];
    novas[index].concluida = !novas[index].concluida;
    setListas({
      ...listas,
      [listaAtiva]: novas,
    });
  }

  // Toggle importante
  function toggleImportante(index) {
    const novas = [...listas[listaAtiva]];
    novas[index].importante = !novas[index].importante;
    setListas({
      ...listas,
      [listaAtiva]: novas,
    });
  }

  // Mudar filtro com animação
  function mudarFiltro(novoFiltro) {
    if (novoFiltro === filtro) return;
    
    setAnimando(true);
    setTimeout(() => {
      setFiltro(novoFiltro);
      setTimeout(() => {
        setAnimando(false);
      }, 50);
    }, 200);
  }

  // Verificar se prazo está próximo
  function verificarPrazo(prazo) {
    if (!prazo) return false;
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    const diff = dataPrazo - hoje;
    const dias = diff / (1000 * 60 * 60 * 24);
    return dias <= 2 && dias >= 0;
  }

  // ========== RENDERIZAÇÃO ==========

  const temLista = Object.keys(listas).length > 0;

  const tarefasFiltradas = listas[listaAtiva]?.filter((tarefa) => {
    if (filtro === "incompletas") return !tarefa.concluida;
    if (filtro === "concluidas") return tarefa.concluida;
    if (filtro === "importantes") return tarefa.importante;
    return false;
  });

  return (
    <div className="flex h-screen relative">
      {/* Overlay mobile */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Modal de adicionar tarefa detalhada */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Nova Tarefa</h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título da tarefa *</label>
                <input
                  type="text"
                  value={novaTarefa}
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  placeholder="Ex: Estudar React"
                  className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Adicione detalhes sobre a tarefa..."
                  className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link</label>
                <input
                  type="url"
                  value={novoLink}
                  onChange={(e) => setNovoLink(e.target.value)}
                  placeholder="https://exemplo.com"
                  className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prazo</label>
                  <input
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={adicionarTarefa}
                  className="flex-1 bg-[#3A3A3A] text-white px-4 py-3 rounded hover:bg-[#4e4e4e] transition font-medium"
                >
                  Adicionar Tarefa
                </button>
                <button
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-[#3A3A3A] text-white p-6 shadow-2xl z-50 transition-transform duration-300 ease-in-out
          ${sidebarAberta ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-64 flex flex-col gap-2.5
        `}
      >
        <div className="flex justify-between items-center mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">
            <i className="fa-solid fa-dove"></i> ListFy
          </h2>
          <button
            className="md:hidden text-white hover:opacity-70"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filtros */}
        <nav className="flex flex-col gap-3 mt-4">
          <button 
            onClick={() => mudarFiltro("incompletas")} 
            className={`text-left transition duration-300 p-3 rounded ${
              filtro === "incompletas" 
                ? "bg-white text-[#3A3A3A] font-bold shadow-lg" 
                : "hover:bg-[#4a4a4a]"
            }`}
          >
            <i className="fa-solid fa-clock mr-2"></i> Incompletas
          </button>
          <button 
            onClick={() => mudarFiltro("concluidas")} 
            className={`text-left transition duration-300 p-3 rounded ${
              filtro === "concluidas" 
                ? "bg-white text-[#3A3A3A] font-bold shadow-lg" 
                : "hover:bg-[#4a4a4a]"
            }`}
          >
            <i className="fa-solid fa-check mr-2"></i> Concluídas
          </button>
          <button 
            onClick={() => mudarFiltro("importantes")} 
            className={`text-left transition duration-300 p-3 rounded ${
              filtro === "importantes" 
                ? "bg-white text-[#3A3A3A] font-bold shadow-lg" 
                : "hover:bg-[#4a4a4a]"
            }`}
          >
            <i className="fa-solid fa-exclamation-triangle mr-2"></i> Importantes
          </button>
        </nav>

        {/* Criar lista */}
        <nav className="flex flex-col gap-4 mt-6">
          <button
            onClick={criarLista}
            className="text-left hover:opacity-65 transition duration-200"
          >
            <i className="fa-solid fa-pencil fa-xs mr-2"></i> Criar nova lista
          </button>
        </nav>

        {temLista && (
          <div className="flex flex-col text-white pt-8 mt-8 flex-1 overflow-y-auto">
            <span className="text-[17px] font-light opacity-50 mb-3">
              Listas
            </span>
            <nav className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
              {Object.keys(listas).map((nome) => (
                <div key={nome} className="flex justify-between items-center">
                  <button
                    onClick={() => setListaAtiva(nome)}
                    className={`text-left flex-1 transition duration-200 ${
                      listaAtiva === nome
                        ? "font-bold text-white-500"
                        : "hover:opacity-65"
                    }`}
                  >
                    {nome}
                  </button>
                  <button
                    onClick={() => removerLista(nome)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Excluir lista"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Área principal */}
      <div className="flex-1 bg-[#5e5e5e5e] p-4 md:p-8 w-full md:w-auto flex justify-center items-start md:items-start overflow-y-auto">
        {!temLista ? (
          <div className="flex flex-col justify-center items-center text-center w-full h-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Nenhuma lista criada
            </h1>
            <p className="mb-6 text-gray-700">
              Crie sua primeira lista para começar a adicionar tarefas!
            </p>
            <button
              onClick={criarLista}
              className="bg-[#3A3A3A] text-white px-6 py-3 rounded hover:bg-[#4e4e4e] transition duration-300"
            >
              Criar lista
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                className="md:hidden bg-[#3A3A3A] text-white p-2 rounded hover:bg-[#4e4e4e] transition duration-200"
                onClick={toggleSidebar}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-3xl md:text-4xl font-bold">{listaAtiva}</h1>
            </div>

            {/* Adicionar tarefa - Nova interface */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={novaTarefa}
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && adicionarTarefaRapida()}
                  placeholder="Adicionar nova tarefa..."
                  className="flex-1 p-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-base"
                />
                <button
                  onClick={adicionarTarefaRapida}
                  className="bg-[#3A3A3A] text-white px-6 rounded hover:bg-[#4e4e4e] transition whitespace-nowrap"
                  title="Adicionar tarefa rápida"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
                <button
                  onClick={() => setModalAberto(true)}
                  className="bg-blue-600 text-white px-6 rounded hover:bg-blue-700 transition whitespace-nowrap"
                  title="Adicionar tarefa detalhada"
                >
                  <i className="fa-solid fa-list-check"></i>
                </button>
                <button
                  onClick={limparTudo}
                  className="bg-red-600 text-white px-6 rounded hover:bg-red-700 transition whitespace-nowrap"
                  title="Limpar todas as tarefas"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <i className="fa-solid fa-lightbulb mr-1"></i>
                Pressione Enter para adicionar rapidamente ou clique em <i className="fa-solid fa-list-check mx-1"></i> para adicionar com mais detalhes
              </p>
            </div>

            <p
              className={`mb-4 font-medium text-sm md:text-base ${
                mensagem.includes("sucesso") ? "text-green-700" : "text-red-500"
              }`}
            >
              {mensagem}
            </p>

            {/* Lista de tarefas com animação */}
            <div className={animando ? "animate-out" : "animate-in"}>
              {tarefasFiltradas?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 opacity-20">
                    <i className="fa-solid fa-clipboard-list"></i>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">Nenhuma tarefa encontrada</p>
                  <p className="text-sm text-gray-400">Adicione uma nova tarefa ou altere o filtro!</p>
                </div>
              ) : (
                <ul className="space-y-3 pb-8">
                  {tarefasFiltradas.map((tarefa, index) => (
                    <li
                      key={tarefa.id || index}
                      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 ${
                        tarefa.prioridade === "alta"
                          ? "border-red-500"
                          : tarefa.prioridade === "baixa"
                          ? "border-green-500"
                          : "border-blue-500"
                      }`}
                    >
                      <div className="flex flex-col gap-3">
                        {/* Cabeçalho da tarefa */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleConcluida(index)}
                              className={`mt-1 ${
                                tarefa.concluida ? "text-green-600" : "text-gray-400 hover:text-green-600"
                              }`}
                            >
                              <i className={`fa-${tarefa.concluida ? "solid" : "regular"} fa-circle-check text-xl`}></i>
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-base font-medium ${
                                    tarefa.concluida ? "line-through text-gray-400" : ""
                                  }`}
                                >
                                  {tarefa.texto}
                                </span>
                                {tarefa.importante && (
                                  <span className="text-yellow-500 text-sm">
                                    <i className="fa-solid fa-star"></i>
                                  </span>
                                )}
                                {tarefa.prioridade && tarefa.prioridade !== "normal" && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      tarefa.prioridade === "alta"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {tarefa.prioridade === "alta" ? "Alta" : "Baixa"}
                                  </span>
                                )}
                              </div>
                              
                              {tarefa.descricao && (
                                <p className="text-sm text-gray-600 mt-1">{tarefa.descricao}</p>
                              )}

                              <div className="flex flex-wrap gap-3 mt-2">
                                {tarefa.link && (
                                  <a
                                    href={tarefa.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                                  >
                                    <i className="fa-solid fa-link"></i> Link anexado
                                  </a>
                                )}
                                {tarefa.prazo && (
                                  <span
                                    className={`text-sm flex items-center gap-1 ${
                                      verificarPrazo(tarefa.prazo)
                                        ? "text-red-600 font-semibold"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    <i className="fa-solid fa-calendar"></i>
                                    {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
                                    {verificarPrazo(tarefa.prazo) && " (Urgente!)"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Ações */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => toggleImportante(index)}
                              className={`p-2 rounded hover:bg-gray-100 ${
                                tarefa.importante ? "text-yellow-500" : "text-gray-400"
                              }`}
                              title="Marcar como importante"
                            >
                              <i className="fa-solid fa-star"></i>
                            </button>
                            <button
                              onClick={() => editarTarefa(index)}
                              className="p-2 rounded hover:bg-gray-100 text-gray-600"
                              title="Editar"
                            >
                              <i className="fa-solid fa-pencil"></i>
                            </button>
                            <button
                              onClick={() => removerTarefa(index)}
                              className="p-2 rounded hover:bg-red-50 text-red-600"
                              title="Remover"
                            >
                              <i className="fa-solid fa-trash"></i>
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