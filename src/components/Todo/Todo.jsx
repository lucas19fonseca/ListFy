
export default function Todo() {
  function adcTarefa() {
    let inputTarefa = document.getElementById("inputTarefa")
    let tarefa = inputTarefa.value.trim()

    if (tarefa === "") {
      var mensagemErro = "Campo vazio, insira algo!"
      mensagem.textContent = mensagemErro
      mensagem.style.color = "#A34747"
      return;
    }
    else {
      var mensagemSucesso = "Tarefa adicionada com sucesso"
      mensagem.textContent = mensagemSucesso
      mensagem.style.color = "#098f14ff"
    }


    var listaTarefas = document.getElementById("listaTarefas")
    var novaTarefa = document.createElement("li")
    novaTarefa.textContent = tarefa
    listaTarefas.appendChild(novaTarefa)



    inputTarefa.value = ""
  }
  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      {/* Sidebar */}
      <div className="flex flex-col bg-[#3A3A3A] text-white p-6 gap-2.5 shadow-2xl">
        <h2 className="text-2xl font-bold mb-8"><i class="fa-solid fa-dove"></i> ListFy</h2>
        <nav className="flex flex-col gap-4">
          <button className="text-left hover:opacity-65 transition duration-200"><i class="fa-solid fa-pencil fa-xs mr-2"></i>Criar nova lista</button>
          <button className="text-left hover:opacity-65 transition duration-200"><i class="fa-solid fa-tasks mr-1"></i>  Buscar Listas</button>
          <button className="text-left hover:opacity-65 transition duration-200"><i class="fa-solid fa-clock mr-1"></i>  Incompletas</button>
          <button className="text-left hover:opacity-65 transition duration-200"><i class="fa-solid fa-check mr-1"></i>  Concluídas</button>
          <button className="text-left hover:opacity-65 transition duration-200"><i class="fa-solid fa-exclamation-triangle mr-1"></i>  Importantes</button>
        </nav>

        <div className="flex flex-col bg-[#3A3A3A] text-white pt-15">
          <span className="text-[17px] font-light opacity-50 mb-3">Listas</span>
          <nav className="flex flex-col gap-4">
            <button className="text-left hover:opacity-65 transition duration-200 ">Exemplo1</button>
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
            id="inputTarefa"
            placeholder="Nova tarefa..."
            className="flex-1 p-2 rounded border border-gray-300"
          />
          <button onClick={adcTarefa} className="bg-amber-900 text-white px-4 py-2 rounded hover:bg-amber-800">
            Adicionar
          </button>

        </div>
        <p id="mensagem" className="mb-4 font-medium text-md"></p>
        {/* Lista de tarefas */}
        <ul className="space-y-5 bg-white rounded-lg shadow-sm p-4" id="listaTarefas"></ul>
      </div>
    </div>
  );
}