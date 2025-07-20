import React, { useState } from "react";

export default function Todo() {
  const [tarefas, setTarefas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [novaTarefa, setNovaTarefa] = useState("");

  function adicionarTarefa() {
    const tarefa = novaTarefa.trim();

    if (tarefa === "") {
      setMensagem("Digite uma tarefa para adicioná-la a sua lista!");
    } else {
      setTarefas([...tarefas, tarefa]);
      setMensagem("Tarefa adicionada com sucesso!");
      setNovaTarefa(""); // limpa o input
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

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      {/* Sidebar */}
      <div className="flex flex-col bg-[#3A3A3A] text-white p-6 gap-2.5 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8">
          <i className="fa-solid fa-dove"></i> ListFy
        </h2>
        <nav className="flex flex-col gap-4">
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

        <div className="flex flex-col bg-[#3A3A3A] text-white pt-15">
          <span className="text-[17px] font-light opacity-50 mb-3">Listas</span>
          <nav className="flex flex-col gap-4">
            <button className="text-left hover:opacity-65 transition duration-200">Exemplo1</button>
            <button className="text-left hover:opacity-65 transition duration-200">Exemplo1</button>
            <button className="text-left hover:opacity-65 transition duration-200">Exemplo1</button>
            <button className="text-left hover:opacity-65 transition duration-200">Exemplo1</button>
          </nav>
        </div>
      </div>

      {/* Área principal */}
      <div className="bg-[#5e5e5e5e] p-8">
        <h1 className="text-4xl font-bold mb-6">Tarefas</h1>

        {/* Adicionar tarefa */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="Nova tarefa..."
            className="flex-1 p-2 rounded border border-black "
          />
          <button
            onClick={adicionarTarefa}
            className="bg-[#3A3A3A] text-white px-4 py-2 rounded hover:bg-[#4e4e4e] transition duration-400"
          >
            Adicionar
          </button>
        </div>

        <p className={`mb-4 font-medium text-md ${mensagem.includes("sucesso") ? "text-green-500" : "text-red-500"}`}>
          {mensagem}
        </p>

        {/* Lista de tarefas */}
        <ul className="space-y-5 bg-white rounded-lg shadow-sm p-4">
          {tarefas.map((tarefa, index) => (
            <li key={index} className="flex justify-between items-center">
              {tarefa}
              <div className="flex gap-3">
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => editarTarefa(index)}
                >
                  <i className="fa-solid fa-pencil"></i>
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => removerTarefa(index)}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
