# ListFy - Gerenciador de Tarefas Avançado

## 📋 Sobre o Projeto

ListFy é um aplicativo web moderno e responsivo para gerenciamento de tarefas com múltiplas listas, desenvolvido em React. Oferece uma experiência completa para organização pessoal e profissional com recursos avançados de gerenciamento de arquivos, sincronização e backup.

## ✨ Funcionalidades Principais

### 📝 Gerenciamento de Tarefas
- **Múltiplas listas** personalizáveis
- **Tarefas detalhadas** com título, descrição, link, prazo e prioridade
- **Marcação de tarefas** como concluídas ou importantes
- **Sistema de prioridades** (Alta, Normal, Baixa)
- **Filtros inteligentes** (Incompletas, Concluídas, Importantes)
- **Busca global** em todas as listas

### 📁 Gerenciamento de Arquivos
- **Upload de arquivos** para anexar às tarefas
- **Suporte a múltiplos formatos** (PDF, Word, Excel, PowerPoint, imagens)
- **Limite de 10MB por arquivo**
- **Visualização e download** dos arquivos anexados
- **Ícones específicos** por tipo de arquivo

### 🔄 Sincronização e Backup
- **Exportação/Importação** de dados em formato JSON
- **Sincronização entre dispositivos** via código base64
- **Backup completo** com preservação de todas as listas e tarefas
- **Arrastar e soltar** para importação de arquivos

### 🎨 Interface Moderna
- **Design responsivo** para desktop e mobile
- **Modo escuro** com temas elegantes
- **Animações suaves** e transições
- **Sidebar colapsável** para mobile
- **Ordenação personalizável** (recente, alfabética, prioridade, prazo)

### ⚙️ Recursos Técnicos
- **Persistência local** com localStorage
- **Atalhos de teclado** (Ctrl+N para nova tarefa, Ctrl+/ para busca)
- **Validação de URLs** e datas
- **Menu de contexto** para ações rápidas
- **Responsividade otimizada** para touch

## 📱 Uso

### Criando sua Primeira Lista
1. Clique em "Nova lista" na sidebar
2. Digite um nome para a lista
3. Selecione a lista para começar a adicionar tarefas

### Adicionando Tarefas
- **Tarefa rápida**: Digite no campo inferior e pressione Enter
- **Tarefa detalhada**: Clique no botão "+" para abrir o modal completo
- **Anexar arquivos**: Arraste ou selecione arquivos no modal de edição

### Gerenciando Tarefas
- **Concluir**: Clique no círculo ao lado da tarefa
- **Marcar como importante**: Clique na estrela
- **Editar**: Clique no ícone de lápis
- **Excluir**: Clique no ícone de lixeira

### Organização
- Use **filtros** para visualizar tarefas específicas
- **Ordene** por data, prioridade ou nome
- **Busque** tarefas em todas as listas

### Backup e Sincronização
1. Vá para "Backup de Dados" na sidebar
2. **Exporte** para fazer backup local
3. **Importe** para restaurar de um arquivo JSON
4. Use "Sincronizar" para compartilhar entre dispositivos

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca principal
- **Hooks** (useState, useEffect, useRef) - Gerenciamento de estado
- **localStorage** - Persistência de dados
- **Tailwind CSS** - Estilização (classes utilitárias)
- **Font Awesome** - Ícones
- **Vanilla JavaScript** - Lógica e manipulação de arquivos

## 🔧 Arquitetura

### Estados Principais
- `listas` - Objeto contendo todas as listas e suas tarefas
- `listaAtiva` - Lista atualmente selecionada
- `filtro` - Filtro de visualização atual
- `mensagem` - Mensagens de feedback para o usuário

### Sistema de Persistência
- **Armazenamento local** automático
- **Recuperação segura** com tratamento de erros
- **Estrutura de dados** versionada

### Manipulação de Arquivos
- **Conversão para base64**
- **Validação de tamanho** (10MB máximo)
- **Metadados** preservados (nome, tipo, tamanho)

## 📱 Responsividade

O aplicativo é totalmente responsivo com:
- **Layout adaptativo** para desktop, tablet e mobile
- **Touch-friendly** com áreas de toque ampliadas
- **Sidebar móvel** com gesto de deslizar
- **Font-size fixo** para evitar zoom em iOS

## 🔒 Segurança e Privacidade

- **Dados locais** - Tudo fica no seu navegador
- **Sem servidor** - Nenhum dado é enviado para a nuvem
- **Backup opcional** - Você controla quando exportar

