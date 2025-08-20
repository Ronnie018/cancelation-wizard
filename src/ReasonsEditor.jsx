import React, { useState, useEffect } from "react";
import { FiUpload, FiDownload, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

const ReasonsEditor = () => {
  const [reasons, setReasons] = useState([]);
  const [newReason, setNewReason] = useState("");
  const [isApplicable, setIsApplicable] = useState(false);
  const [details, setDetails] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem("cancellationReasons");
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((item) => ({
          ...item,
          details: item.details ? item.details.replace(/\\n/g, "\n") : null,
        }));
        setReasons(parsed);
      } catch {
        setReasons([]);
      }
    }
  }, []);

  // Função para salvar no localStorage
  const saveToLocalStorage = (updatedReasons) => {
    const normalized = updatedReasons.map((item) => ({
      ...item,
      details: item.details ? item.details.replace(/\n/g, "\\n") : null,
    }));
    setReasons(updatedReasons);
    localStorage.setItem("cancellationReasons", JSON.stringify(normalized, null, 2));
  };

  const handleAddReason = () => {
    if (!newReason.trim()) return;

    const newEntry = {
      reason: newReason,
      isApplicable,
      details: details.trim() || null,
    };

    const updatedReasons = [...reasons, newEntry];
    saveToLocalStorage(updatedReasons);

    setNewReason("");
    setIsApplicable(false);
    setDetails("");
  };

  const handleDelete = (idx) => {
    const updated = reasons.filter((_, i) => i !== idx);
    saveToLocalStorage(updated);
  };

  const handleEdit = (idx) => {
    const item = reasons[idx];
    setEditingIndex(idx);
    setNewReason(item.reason);
    setIsApplicable(item.isApplicable);
    setDetails(item.details || "");
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...reasons];
    updated[editingIndex] = {
      reason: newReason,
      isApplicable,
      details: details.trim() || null,
    };
    saveToLocalStorage(updated);
    setEditingIndex(null);
    setNewReason("");
    setIsApplicable(false);
    setDetails("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewReason("");
    setIsApplicable(false);
    setDetails("");
  };

  const handleExport = () => {
    const blob = new Blob([localStorage.getItem("cancellationReasons")], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cancellationReasons.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result).map((item) => ({
          ...item,
          details: item.details ? item.details.replace(/\\n/g, "\n") : null,
        }));
        saveToLocalStorage(parsed);
      } catch (err) {
        alert("Arquivo inválido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full bg-gray-800 p-6 rounded-2xl shadow-lg text-white space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Editor de Motivos</h2>
        <div className="flex items-center space-x-3">
          <label className="cursor-pointer">
            <FiUpload className="w-5 h-5 hover:text-yellow-400" />
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button onClick={handleExport}>
            <FiDownload className="w-5 h-5 hover:text-yellow-400" />
          </button>
        </div>
      </div>

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

      {editingIndex !== null ? (
        <div className="flex space-x-2">
          <button
            onClick={handleSaveEdit}
            className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition font-medium"
          >
            <FiSave className="inline mr-1" /> Salvar
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition font-medium"
          >
            <FiX className="inline mr-1" /> Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddReason}
          className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 hover:bg-gray-700 transition font-medium"
        >
          Adicionar Motivo
        </button>
      )}

      {reasons.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Motivos Salvos:</h3>
          <ul className="space-y-1">
            {reasons.map((item, idx) => (
              <li
                key={idx}
                className="border border-gray-700 p-2 rounded-lg flex flex-col"
              >
                <div className="flex justify-between items-center">
                  <span>
                    <strong>{item.reason}</strong> –{" "}
                    {item.isApplicable ? "Aplicável ✅" : "Não aplicável ❌"}
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(idx)}>
                      <FiEdit2 className="w-4 h-4 hover:text-yellow-400" />
                    </button>
                    <button onClick={() => handleDelete(idx)}>
                      <FiTrash2 className="w-4 h-4 hover:text-red-400" />
                    </button>
                  </div>
                </div>
                {item.details && (
                  <small className="text-gray-400 whitespace-pre-line">
                    Detalhes: {item.details}
                  </small>
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
