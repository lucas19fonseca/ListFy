import React, { useState, useEffect } from "react";

export default function Todo() {
  const [listas, setListas] = useState(() => {
    return JSON.parse(localStorage.getItem("listas")) || {};
  });
  const [listaAtiva, setListaAtiva] = useState("");
  const [novaTarefa, setNovaTarefa] = useState("");
  const [novoLink, setNovoLink] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    localStorage.setItem("listas", JSON.stringify(listas));
  }, [listas]);

  function adicionarTarefa() {
    const texto = novaTarefa.trim();
    if (texto === "") {
      setMensagem("Digite uma tarefa para adicioná-la a sua lista!");
    } else {
      const nova = {
        texto,
        link: novoLink.trim() || "",
        concluida: false,
        importante: false,
      };
      setListas({
        ...listas,
        [listaAtiva]: [...listas[listaAtiva], nova],
      });
      setMensagem("Tarefa adicionada com sucesso!");
      setNovaTarefa("");
      setNovoLink("");
    }
    setTimeout(() => setMensagem(""), 3000);
  }

  function removerTarefa(index) {
    const novas = [...listas[listaAtiva]];
    novas.splice(index, 1);
    setListas({
      ...listas,
      [listaAtiva]: novas,
    });
  }

  function editarTarefa(index) {
    const tarefaAtual = listas[listaAtiva][index];
    const novoTexto = prompt("Edite a tarefa:", tarefaAtual.texto);
    const novoLink = prompt("Edite o link (opcional):", tarefaAtual.link || "");
    if (novoTexto && novoTexto.trim() !== "") {
      const novas = [...listas[listaAtiva]];
      novas[index] = {
        ...novas[index],
        texto: novoTexto.trim(),
        link: novoLink.trim() || "",
      };
      setListas({
        ...listas,
        [listaAtiva]: novas,
      });
    }
  }

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

  function criarLista() {
    const nome = prompt("Nome da nova lista:");
    if (nome && nome.trim() !== "" && !listas[nome.trim()]) {
      setListas({
        ...listas,
        [nome.trim()]: [],
      });
      setListaAtiva(nome.trim());
    }
  }

  function removerLista(nome) {
    if (window.confirm(`Tem certeza que deseja excluir a lista "${nome}"?`)) {
      const novasListas = { ...listas };
      delete novasListas[nome];

      const nomesRestantes = Object.keys(novasListas);
      setListaAtiva(nomesRestantes[0] || "");
      setListas(novasListas);
    }
  }

  function toggleSidebar() {
    setSidebarAberta(!sidebarAberta);
  }

  function toggleConcluida(index) {
    const novas = [...listas[listaAtiva]];
    novas[index].concluida = !novas[index].concluida;
    setListas({
      ...listas,
      [listaAtiva]: novas,
    });
  }

  function toggleImportante(index) {
    const novas = [...listas[listaAtiva]];
    novas[index].importante = !novas[index].importante;
    setListas({
      ...listas,
      [listaAtiva]: novas,
    });
  }

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
            <nav className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
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
          // Se não tiver lista, mostrar aviso no centro
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
            <ul className="space-y-3 md:space-y-5 bg-white rounded-lg shadow-sm p-3 md:p-4 
                           max-h-[400px] overflow-y-auto flex-1">
              {tarefasFiltradas?.map((tarefa, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-2 border-b border-gray-100 last:border-b-0"
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

            {tarefasFiltradas?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma tarefa encontrada.</p>
                <p className="text-sm mt-2">Adicione ou altere o filtro!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
