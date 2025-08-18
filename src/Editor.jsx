import React, { useState, useEffect } from "react";

const defaultRules = [
  {
    reason: "Not enough content",
    planType: "Básico",
    planCategory: "Mensal",
    provider: null,
    suggestion: "Oferecer período de trial em plano superior para testar funcionalidades extras (ex: download de conteúdo)"
  },
  {
    reason: "Not enough content",
    planType: null,
    planCategory: null,
    provider: null,
    suggestion: "Verificar conteúdos assistidos pelo sistema"
  },
  {
    reason: null,
    planType: null,
    planCategory: "Mensal",
    provider: "DTC",
    suggestion: "Oferecer código promocional de acordo com o plano: Básico/Padrão 50%, Platinum 20%"
  }
];

const planTypes = ["Básico", "Padrão", "Platinum"];
const planCategories = ["Mensal", "Anual"];
const providers = ["DTC", "IAP", "Provider"];

const RuleEditor = () => {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    reason: "",
    planType: "",
    planCategory: "",
    provider: "",
    suggestion: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("retentionRules");
    if (stored) setRules(JSON.parse(stored));
    else setRules(defaultRules);
  }, []);

  const saveToLocalStorage = (updatedRules) => {
    localStorage.setItem("retentionRules", JSON.stringify(updatedRules, null, 2));
  };

  const handleAddRule = () => {
    if (!newRule.suggestion.trim()) return;
    const updated = [...rules, {
      reason: newRule.reason || null,
      planType: newRule.planType || null,
      planCategory: newRule.planCategory || null,
      provider: newRule.provider || null,
      suggestion: newRule.suggestion
    }];
    setRules(updated);
    saveToLocalStorage(updated);
    setNewRule({ reason: "", planType: "", planCategory: "", provider: "", suggestion: "" });
  };

  const handleRemoveRule = (index) => {
    const updated = rules.filter((_, i) => i !== index);
    setRules(updated);
    saveToLocalStorage(updated);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(rules, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "retentionRules.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileLoad = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loaded = JSON.parse(event.target.result);
        if (Array.isArray(loaded)) {
          setRules(loaded);
          saveToLocalStorage(loaded);
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
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-4xl text-white space-y-6">
      <h2 className="text-2xl font-bold mb-4">Editor de Regras</h2>

      {/* Formulário de adição */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Motivo (opcional)"
          className="p-2 rounded bg-gray-900 border border-gray-700"
          value={newRule.reason}
          onChange={e => setNewRule({ ...newRule, reason: e.target.value })}
        />
        <select
          className="p-2 rounded bg-gray-900 border border-gray-700"
          value={newRule.planType}
          onChange={e => setNewRule({ ...newRule, planType: e.target.value })}
        >
          <option value="">Tipo de plano (qualquer)</option>
          {planTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
        </select>
        <select
          className="p-2 rounded bg-gray-900 border border-gray-700"
          value={newRule.planCategory}
          onChange={e => setNewRule({ ...newRule, planCategory: e.target.value })}
        >
          <option value="">Categoria (qualquer)</option>
          {planCategories.map(pc => <option key={pc} value={pc}>{pc}</option>)}
        </select>
        <select
          className="p-2 rounded bg-gray-900 border border-gray-700"
          value={newRule.provider}
          onChange={e => setNewRule({ ...newRule, provider: e.target.value })}
        >
          <option value="">Provider (qualquer)</option>
          {providers.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <textarea
        placeholder="Sugestão"
        className="w-full p-3 rounded bg-gray-900 border border-gray-700 mt-3"
        rows={3}
        value={newRule.suggestion}
        onChange={e => setNewRule({ ...newRule, suggestion: e.target.value })}
      />

      <button
        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition font-medium"
        onClick={handleAddRule}
      >
        Adicionar regra
      </button>

      {/* Lista de regras */}
      <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex justify-between items-center bg-gray-900 p-2 rounded border border-gray-700">
            <div>
              <strong>Motivo:</strong> {rule.reason || "Qualquer"} |{" "}
              <strong>Plano:</strong> {rule.planType || "Qualquer"} |{" "}
              <strong>Categoria:</strong> {rule.planCategory || "Qualquer"} |{" "}
              <strong>Provider:</strong> {rule.provider || "Qualquer"} <br />
              <span className="text-gray-300">{rule.suggestion}</span>
            </div>
            <button
              className="text-red-500 hover:text-red-700 font-bold"
              onClick={() => handleRemoveRule(idx)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition font-medium"
          onClick={handleDownload}
        >
          Baixar Regras
        </button>
        <label className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition font-medium cursor-pointer">
          Carregar Regras
          <input type="file" accept=".json" className="hidden" onChange={handleFileLoad} />
        </label>
      </div>
    </div>
  )
}

export default RuleEditor;
