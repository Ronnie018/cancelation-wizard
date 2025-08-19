import './reset.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CancelationTree from './CancelationTree/index'
import Editor from './Editor.jsx'
import ReasonsEditor from './ReasonsEditor.jsx'

function App() {

  const handleFileLoad = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loaded = JSON.parse(event.target.result);
        if (Array.isArray(loaded)) {
          localStorage.setItem("retentionRules", JSON.stringify(loaded, null, 2));
          alert("Arquivo carregado com sucesso!");
        } else {
          alert("Arquivo inválido!");
        }
      } catch {
        alert("Erro ao ler o arquivo!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Router>
      <div className='App min-h-screen bg-black text-white flex flex-col items-center'>
        {/* Cabeçalho */}
        <header
          id="header"
          className="w-full bg-gray-800 shadow-md py-6 flex flex-col items-center"
        >
          <h1 className='text-4xl font-extrabold tracking-wide text-white'>
            Assistente de Cancelamento
          </h1>
          <p className="text-gray-300 mt-2 text-center max-w-xl">
            Ferramenta para auxiliar retenções de clientes e sugerir ações com base no plano e no motivo.
          </p>

          {/* Navegação */}
          <nav className="mt-4 space-x-6">
            <Link
              to="/"
              className="text-white hover:text-gray-300 font-medium transition"
            >
              Início
            </Link>
            <Link
              to="/editor"
              className="text-white hover:text-gray-300 font-medium transition"
            >
              Editor de regras
            </Link>
            <Link
              to="/reasons"
              className="text-white hover:text-gray-300 font-medium transition"
            >
              Editor de motivos
            </Link>
            <label className="text-white hover:text-gray-300 font-medium transition cursor-pointer">
              Carregar arquivo
              <input
                type="file"
                onChange={handleFileLoad}
                accept=".json"
                className="hidden" // esconde o input real
              />
            </label>
          </nav>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-grow w-full flex justify-center items-start p-6">
          <Routes>
            <Route path="/" element={<CancelationTree />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/reasons" element={<ReasonsEditor />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
