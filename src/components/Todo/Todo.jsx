import React, { useState } from "react";

export default function Todo() {
  const [tarefas, setTarefas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [novaTarefa, setNovaTarefa] = useState("");
  const [sidebarAberta, setSidebarAberta] = useState(false);

  function adicionarTarefa() {
    const tarefa = novaTarefa.trim();

    if (tarefa === "") {
      setMensagem("Digite uma tarefa para adicioná-la a sua lista!");
    } else {
      setTarefas([...tarefas, tarefa]);
      setMensagem("Tarefa adicionada com sucesso!");
      setNovaTarefa(""); 
    }
  }

  function removerTarefa(index) {
    const novasTarefas = tarefas.filter((_, i) => i !== index);
    setTarefas(novasTarefas);
  }

  function editarTarefa(index) {
    const nova = prompt("Edite a tarefa:", tarefas[index]);
    if (nova && nova.trim() !== "") {
      const novasTarefas = [...tarefas];
      novasTarefas[index] = nova.trim();
      setTarefas(novasTarefas);
    }
  }

  function toggleSidebar() {
    setSidebarAberta(!sidebarAberta);
  }

  return (
    <div className="flex h-screen relative">
      {/* Overlay para mobile */}
      {sidebarAberta && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static top-0 left-0 h-full w-64 bg-[#3A3A3A] text-white p-6 shadow-2xl z-50 transition-transform duration-300 ease-in-out
        ${sidebarAberta ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:w-64 flex flex-col gap-2.5
      `}>
        {/* Botão fechar no mobile */}
        <div className="flex justify-between items-center mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">
            <i className="fa-solid fa-dove"></i> ListFy
          </h2>
          <button 
            className="md:hidden text-white hover:opacity-70"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-4 mt-4">
          <button className="text-left hover:opacity-65 transition duration-200">
            <i className="fa-solid fa-pencil fa-xs mr-2"></i>Criar nova lista
          </button>
          <button className="text-left hover:opacity-65 transition duration-200">
            <i className="fa-solid fa-tasks mr-1"></i> Buscar Listas
          </button>
          <button className="text-left hover:opacity-65 transition duration-200">
            <i className="fa-solid fa-clock mr-1"></i> Incompletas
          </button>
          <button className="text-left hover:opacity-65 transition duration-200">
            <i className="fa-solid fa-check mr-1"></i> Concluídas
          </button>
          <button className="text-left hover:opacity-65 transition duration-200">
            <i className="fa-solid fa-exclamation-triangle mr-1"></i> Importantes
          </button>
        </nav>

        <div className="flex flex-col text-white pt-8 mt-8">
          <span className="text-[17px] font-light opacity-50 mb-3">Listas</span>
          <nav className="flex flex-col gap-4">
            <button className="text-left hover:opacity-65 transition duration-200">Exemplo1</button>
            <button className="text-left hover:opacity-65 transition duration-200">Exemplo2</button>
            <button className="text-left hover:opacity-65 transition duration-200">Exemplo3</button>
            <button className="text-left hover:opacity-65 transition duration-200">Exemplo4</button>
          </nav>
        </div>
      </div>

      {/* Área principal */}
      <div className="flex-1 bg-[#5e5e5e5e] p-4 md:p-8 w-full md:w-auto">
        {/* Header com botão do menu */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            className="md:hidden bg-[#3A3A3A] text-white p-2 rounded hover:bg-[#4e4e4e] transition duration-200"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold">Tarefas</h1>
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
          <button
            onClick={adicionarTarefa}
            className="bg-[#3A3A3A] text-white px-4 py-2 rounded hover:bg-[#4e4e4e] transition duration-400 whitespace-nowrap"
          >
            Adicionar
          </button>
        </div>

        <p className={`mb-4 font-medium text-sm md:text-base ${mensagem.includes("sucesso") ? "text-green-700" : "text-red-500"}`}>
          {mensagem}
        </p>

        {/* Lista de tarefas */}
        <ul className="space-y-3 md:space-y-5 bg-white rounded-lg shadow-sm p-3 md:p-4">
          {tarefas.map((tarefa, index) => (
            <li key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm md:text-base break-words flex-1">{tarefa}</span>
              <div className="flex gap-2 self-end sm:self-center">
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

        {tarefas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma tarefa adicionada ainda.</p>
            <p className="text-sm mt-2">Adicione uma tarefa acima para começar!</p>
          </div>
        )}
      </div>
    </div>
  );
}