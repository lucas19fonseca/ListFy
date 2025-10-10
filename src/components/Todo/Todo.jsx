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
  const [mensagem, setMensagem] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [filtro, setFiltro] = useState("todas");
  const [modalSyncAberto, setModalSyncAberto] = useState(false);
  const [codigoSync, setCodigoSync] = useState("");
  const [modoSync, setModoSync] = useState("exportar");
  const [ultimaSync, setUltimaSync] = useState(() => {
    return localStorage.getItem("ultimaSync") || null;
  });

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
    const novoLinkInput = prompt("Edite o link (opcional):", tarefaAtual.link || "");
    
    if (novoTexto && novoTexto.trim() !== "") {
      const link = novoLinkInput?.trim() || "";
      
      // Validação de URL
      if (link && !link.match(/^https?:\/\//)) {
        setMensagem("Link inválido! Use http:// ou https://");
        setTimeout(() => setMensagem(""), 3000);
        return;
      }

      const novas = [...listas[listaAtiva]];
      novas[index] = {
        ...novas[index],
        texto: novoTexto.trim(),
        link: link,
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
      setListas({
        ...listas,
        [listaAtiva]: [],
      });
      setMensagem("Lista de tarefas limpa com sucesso!");
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

  // ========== FUNÇÕES DE SINCRONIZAÇÃO ==========

  // Exportar dados para sincronização
  function exportarDados() {
    try {
      const dados = {
        listas,
        versao: "1.0",
        exportadoEm: new Date().toISOString(),
      };
      
      const codigo = btoa(JSON.stringify(dados));
      setCodigoSync(codigo);
      
      // Copiar para clipboard
      navigator.clipboard.writeText(codigo).then(() => {
        setMensagem("Código copiado para a área de transferência!");
        setTimeout(() => setMensagem(""), 3000);
      });

      // Atualizar última sync
      const agora = new Date().toLocaleString('pt-BR');
      localStorage.setItem("ultimaSync", agora);
      setUltimaSync(agora);
      
    } catch (error) {
      setMensagem("Erro ao exportar dados!");
      setTimeout(() => setMensagem(""), 3000);
      console.error(error);
    }
  }

  // Importar dados de outro dispositivo
  function importarDados() {
    if (!codigoSync.trim()) {
      setMensagem("Cole o código de sincronização!");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    try {
      const dadosDecodificados = JSON.parse(atob(codigoSync));
      
      if (!dadosDecodificados.listas) {
        setMensagem("Código inválido!");
        setTimeout(() => setMensagem(""), 3000);
        return;
      }

      // Merge inteligente: mesclar com dados existentes
      const listasImportadas = dadosDecodificados.listas;
      const listasMescladas = { ...listas };

      Object.keys(listasImportadas).forEach(nomeLista => {
        if (listasMescladas[nomeLista]) {
          // Lista já existe: mesclar tarefas sem duplicatas
          const tarefasExistentes = listasMescladas[nomeLista];
          const tarefasImportadas = listasImportadas[nomeLista];
          
          const idsExistentes = new Set(tarefasExistentes.map(t => t.id));
          const tarefasNovas = tarefasImportadas.filter(t => !idsExistentes.has(t.id));
          
          listasMescladas[nomeLista] = [...tarefasExistentes, ...tarefasNovas];
        } else {
          // Nova lista: adicionar diretamente
          listasMescladas[nomeLista] = listasImportadas[nomeLista];
        }
      });

      setListas(listasMescladas);
      
      const agora = new Date().toLocaleString('pt-BR');
      localStorage.setItem("ultimaSync", agora);
      setUltimaSync(agora);
      
      setCodigoSync("");
      setModalSyncAberto(false);
      setMensagem("Dados importados e mesclados com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
      
    } catch (error) {
      setMensagem("Código inválido ou corrompido!");
      setTimeout(() => setMensagem(""), 3000);
      console.error(error);
    }
  }

  // Baixar backup em arquivo JSON
  function baixarBackup() {
    try {
      const dados = {
        listas,
        versao: "1.0",
        exportadoEm: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `listfy-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setMensagem("Backup baixado com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      setMensagem("Erro ao baixar backup!");
      setTimeout(() => setMensagem(""), 3000);
    }
  }

  // Carregar backup de arquivo
  function carregarBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result);
        
        if (!dados.listas) {
          setMensagem("Arquivo de backup inválido!");
          setTimeout(() => setMensagem(""), 3000);
          return;
        }

        if (window.confirm("Deseja substituir todos os dados atuais pelo backup?")) {
          setListas(dados.listas);
          
          const agora = new Date().toLocaleString('pt-BR');
          localStorage.setItem("ultimaSync", agora);
          setUltimaSync(agora);
          
          setMensagem("Backup restaurado com sucesso!");
          setTimeout(() => setMensagem(""), 3000);
        }
      } catch (error) {
        setMensagem("Erro ao ler arquivo de backup!");
        setTimeout(() => setMensagem(""), 3000);
        console.error(error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  // ========== RENDERIZAÇÃO ==========

  const temLista = Object.keys(listas).length > 0;

  const tarefasFiltradas = listas[listaAtiva]?.filter((tarefa) => {
    if (filtro === "incompletas") return !tarefa.concluida;
    if (filtro === "concluidas") return tarefa.concluida;
    if (filtro === "importantes") return tarefa.importante;
    return true;
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

      {/* Modal de Sincronização */}
      {modalSyncAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sincronização</h2>
              <button
                onClick={() => {
                  setModalSyncAberto(false);
                  setCodigoSync("");
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {ultimaSync && (
              <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
                <strong>Última sincronização:</strong> {ultimaSync}
              </div>
            )}

            <div className="mb-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setModoSync("exportar")}
                  className={`flex-1 px-4 py-2 rounded transition ${
                    modoSync === "exportar"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Exportar
                </button>
                <button
                  onClick={() => setModoSync("importar")}
                  className={`flex-1 px-4 py-2 rounded transition ${
                    modoSync === "importar"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Importar
                </button>
                <button
                  onClick={() => setModoSync("backup")}
                  className={`flex-1 px-4 py-2 rounded transition ${
                    modoSync === "backup"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Backup
                </button>
              </div>
            </div>

            {modoSync === "exportar" && (
              <div>
                <h3 className="font-semibold mb-2">Exportar Dados</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Gere um código para sincronizar suas tarefas em outro dispositivo
                </p>
                <button
                  onClick={exportarDados}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full mb-3"
                >
                  Gerar Código de Sincronização
                </button>
                {codigoSync && (
                  <div>
                    <textarea
                      readOnly
                      value={codigoSync}
                      className="w-full p-2 border rounded text-xs h-32 font-mono mb-2"
                      onClick={(e) => e.target.select()}
                    />
                    <p className="text-xs text-green-600">
                      Código copiado! Cole no outro dispositivo.
                    </p>
                  </div>
                )}
              </div>
            )}

            {modoSync === "importar" && (
              <div>
                <h3 className="font-semibold mb-2">Importar Dados</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Cole o código de sincronização de outro dispositivo
                </p>
                <textarea
                  value={codigoSync}
                  onChange={(e) => setCodigoSync(e.target.value)}
                  placeholder="Cole o código aqui..."
                  className="w-full p-2 border rounded text-xs h-32 font-mono mb-3"
                />
                <button
                  onClick={importarDados}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
                >
                  Importar e Mesclar Dados
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  As tarefas serão mescladas sem duplicatas
                </p>
              </div>
            )}

            {modoSync === "backup" && (
              <div>
                <h3 className="font-semibold mb-2">Backup em Arquivo</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Baixe ou carregue um arquivo de backup (.json)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={baixarBackup}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Baixar Backup
                  </button>
                  <label className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition cursor-pointer text-center">
                    Carregar Backup
                    <input
                      type="file"
                      accept=".json"
                      onChange={carregarBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
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

        {/* Botão de Sincronização */}
        <button
          onClick={() => setModalSyncAberto(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition mb-4"
        >
          <i className="fa-solid fa-cloud"></i> Sincronizar
        </button>

        {/* Botões de filtro */}
        <nav className="flex flex-col gap-3 mt-4">
          <button onClick={() => setFiltro("todas")} className="text-left hover:opacity-65 transition duration-300">
            <i className="fa-solid fa-tasks"></i> Todas
          </button>
          <button onClick={() => setFiltro("incompletas")} className="text-left hover:opacity-65 transition duration-300">
            <i className="fa-solid fa-clock"></i> Incompletas
          </button>
          <button onClick={() => setFiltro("concluidas")} className="text-left hover:opacity-65 transition duration-300">
            <i className="fa-solid fa-check"></i> Concluídas
          </button>
          <button onClick={() => setFiltro("importantes")} className="text-left hover:opacity-65 transition duration-300">
            <i className="fa-solid fa-exclamation-triangle"></i> Importantes
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
      <div className="flex-1 bg-[#5e5e5e5e] p-4 md:p-8 w-full md:w-auto flex justify-center items-start md:items-start overflow-hidden">
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
          <div className="w-full h-full flex flex-col">
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

            {/* Adicionar tarefa */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={novaTarefa}
                onChange={(e) => setNovaTarefa(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && adicionarTarefa()}
                placeholder="Nova tarefa..."
                className="flex-1 p-2 rounded border border-black text-base"
              />
              <input
                type="url"
                value={novoLink}
                onChange={(e) => setNovoLink(e.target.value)}
                placeholder="Link (opcional)..."
                className="flex-1 p-2 rounded border border-black text-base"
              />
              <button
                onClick={adicionarTarefa}
                className="bg-[#3A3A3A] text-white px-4 py-2 rounded hover:bg-[#4e4e4e] transition duration-400 whitespace-nowrap"
              >
                Adicionar
              </button>
              <button
                onClick={limparTudo}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-400 whitespace-nowrap"
              >
                Limpar Tudo
              </button>
            </div>

            <p
              className={`mb-4 font-medium text-sm md:text-base ${
                mensagem.includes("sucesso") ? "text-green-700" : "text-red-500"
              }`}
            >
              {mensagem}
            </p>

            {/* Lista de tarefas */}
            {tarefasFiltradas?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma tarefa encontrada.</p>
                <p className="text-sm mt-2">Adicione ou altere o filtro!</p>
              </div>
            ) : (
              <ul className="space-y-3 md:space-y-5">
                {tarefasFiltradas.map((tarefa, index) => (
                  <li
                    key={tarefa.id || index}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-b border-gray-100 last:border-b-0 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex-1">
                      <span
                        className={`text-sm md:text-base break-words font-medium ${
                          tarefa.concluida ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {tarefa.texto}
                      </span>
                      {tarefa.link && (
                        <a
                          href={tarefa.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 text-sm underline mt-1"
                        >
                          Acessar link
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <button
                        onClick={() => toggleConcluida(index)}
                        className={`p-2 ${
                          tarefa.concluida
                            ? "text-green-700"
                            : "text-gray-600 hover:text-green-800"
                        }`}
                        title="Concluir"
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button
                        onClick={() => toggleImportante(index)}
                        className={`p-2 ${
                          tarefa.importante
                            ? "text-yellow-500"
                            : "text-gray-600 hover:text-yellow-600"
                        }`}
                        title="Importante"
                      >
                        <i className="fa-solid fa-exclamation-triangle"></i>
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 p-2"
                        onClick={() => editarTarefa(index)}
                        title="Editar"
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        onClick={() => removerTarefa(index)}
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}