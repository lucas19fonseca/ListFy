export default function Todo() {
  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      {/* Sidebar */}
      <div className="flex flex-col bg-amber-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Listify</h2>
        <nav className="flex flex-col gap-4">
          <button className="text-left hover:text-amber-300">Todas as Tarefas</button>
          <button className="text-left hover:text-amber-300">Importantes</button>
          <button className="text-left hover:text-amber-300">Concluídas</button>
        </nav>
      </div>

      {/* Área principal */}
      <div className="bg-[#f4f4f4] p-8">
        <h1 className="text-4xl font-bold mb-6">Tarefas</h1>

        {/* Adicionar tarefa */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Nova tarefa..."
            className="flex-1 p-2 rounded border border-gray-300"
          />
          <button className="bg-amber-900 text-white px-4 py-2 rounded hover:bg-amber-800">
            Adicionar
          </button>
        </div>

        {/* Lista de tarefas */}
        <ul className="space-y-4">
          <li className="flex items-center justify-between bg-white p-4 rounded shadow">
            <span>Tarefa de exemplo</span>
            <button className="text-red-500 hover:text-red-700">Remover</button>
          </li>
        </ul>
      </div>
    </div>
      );
}