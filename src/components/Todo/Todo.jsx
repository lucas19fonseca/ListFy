
export default function Todo() {
  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      {/* Sidebar */}
      <div className="flex flex-col bg-[#3A3A3A] text-white p-6 gap-2.5 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8"><i class="fa-solid fa-clipboard"></i> ListFy</h2>
        <nav className="flex flex-col gap-4">
          <button className="text-left hover:opacity-65 transition duration-300"><i class="fa-solid fa-pencil fa-xs"></i> Criar nova lista</button>
          <button className="text-left hover:opacity-65 transition duration-300"><i class="fa-solid fa-tasks"></i>  Buscar Listas</button>
          <button className="text-left hover:opacity-65 transition duration-300"><i class="fa-solid fa-clock"></i>  Incompletas</button>
          <button className="text-left hover:opacity-65 transition duration-300"><i class="fa-solid fa-check"></i>  Concluídas</button>
          <button className="text-left hover:opacity-65 transition duration-300"><i class="fa-solid fa-exclamation-triangle"></i>  Importantes</button>
        </nav>

        <div className="flex flex-col bg-[#3A3A3A] text-white pt-15">
        <span className="text-[17px] font-light opacity-50 mb-3">Listas</span>
        <nav className="flex flex-col gap-4">
          <button className="text-left hover:text-amber-300 ">Exemplo1</button>
          <button className="text-left hover:text-amber-300">Exemplo1</button>
          <button className="text-left hover:text-amber-300">Exemplo1</button>
          <button className="text-left hover:text-amber-300">Exemplo1</button>
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