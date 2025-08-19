import React, { useState, useEffect } from "react";

const ReasonsEditor = () => {
  const [reasons, setReasons] = useState([]);
  const [newReason, setNewReason] = useState("");
  const [isApplicable, setIsApplicable] = useState(false);
  const [details, setDetails] = useState("");

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem("cancellationReasons");
    if (stored) {
      try {
        setReasons(JSON.parse(stored));
      } catch {
        setReasons([]);
      }
    }
  }, []);

  // Função para salvar no localStorage
  const saveToLocalStorage = (updatedReasons) => {
    setReasons(updatedReasons);
    localStorage.setItem("cancellationReasons", JSON.stringify(updatedReasons, null, 2));
  };

  const handleAddReason = () => {
    if (!newReason.trim()) return;

    const newEntry = {
      reason: newReason,
      isApplicable,
      details: details.trim() || null, // campo opcional
    };

    const updatedReasons = [...reasons, newEntry];
    saveToLocalStorage(updatedReasons);

    // Resetar form
    setNewReason("");
    setIsApplicable(false);
    setDetails("");
  };

  return (
    <div className="w-full bg-gray-800 p-6 rounded-2xl shadow-lg text-white space-y-4">
      <h2 className="text-xl font-bold">Editor de Motivos</h2>

      <div className="space-y-2">
        <label className="block font-semibold">Motivo</label>
        <input
          type="text"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          className="w-full border border-gray-700 bg-black text-white rounded-lg p-2"
          placeholder="Digite o motivo..."
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isApplicable}
            onChange={(e) => setIsApplicable(e.target.checked)}
          />
          <span>Aplicável</span>
        </label>

        <label className="block font-semibold">Detalhes (opcional)</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full border border-gray-700 bg-black text-white rounded-lg p-2"
          placeholder="Insira detalhes adicionais..."
        />
      </div>

      <button
        onClick={handleAddReason}
        className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 hover:bg-gray-700 transition font-medium"
      >
        Adicionar Motivo
      </button>

      {/* Listagem local para feedback imediato */}
      {reasons.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Motivos Salvos:</h3>
          <ul className="space-y-1">
            {reasons.map((item, idx) => (
              <li
                key={idx}
                className="border border-gray-700 p-2 rounded-lg flex flex-col"
              >
                <span>
                  <strong>{item.reason}</strong> –{" "}
                  {item.isApplicable ? "Aplicável ✅" : "Não aplicável ❌"}
                </span>
                {item.details && (
                  <small className="text-gray-400">Detalhes: {item.details}</small>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReasonsEditor;
