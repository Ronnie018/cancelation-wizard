import React, { useState, useEffect, useRef } from "react";

const planTypes = ["Básico", "Padrão", "Platinum"];
const planCategories = ["Mensal", "Anual"];
const providers = ["DTC", "IAP", "Provider"];

const ReasonWizard = ({ reason, cleanState }) => {
  const [step, setStep] = useState(0);
  const [planType, setPlanType] = useState("");
  const [planCategory, setPlanCategory] = useState("");
  const [provider, setProvider] = useState("");
  const [rules, setRules] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [reasonDetails, setReasonDetails] = useState("");

  const [inputText, setInputText] = useState("");
  const [ghostText, setGhostText] = useState("");
  const textareaRef = useRef(null);

  // Carregar regras e detalhes do motivo
  useEffect(() => {
    const storedRules = localStorage.getItem("retentionRules");
    if (storedRules) setRules(JSON.parse(storedRules));

    const storedReasons = localStorage.getItem("cancellationReasons");
    if (storedReasons) {
      const parsed = JSON.parse(storedReasons);
      const found = parsed.find((r) => r.reason === reason);
      setReasonDetails(found?.details || "");
    }
  }, [reason]);

  // Filtrar sugestões de acordo com as escolhas
  useEffect(() => {
    if (step === 3) {
      const filtered = rules
        .filter((rule) => {
          const reasonMatch = !rule.reason || rule.reason === reason;
          const typeMatch = !rule.planType || rule.planType === planType;
          const categoryMatch =
            !rule.planCategory || rule.planCategory === planCategory;
          const providerMatch = !rule.provider || rule.provider === provider;
          return reasonMatch && typeMatch && categoryMatch && providerMatch;
        })
        .map((rule) => {
          if (
            rule.suggestion.toLowerCase().includes("código promocional") &&
            provider !== "DTC"
          ) {
            return null;
          }
          return rule.suggestion;
        })
        .filter(Boolean);

      setSuggestions(filtered);
    }
  }, [step, reason, planType, planCategory, provider, rules]);

  const getButtonClasses = (isSelected) =>
    `p-3 rounded-lg border transition font-medium ${
      isSelected
        ? "bg-gray-600 border-white text-white"
        : "bg-black border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white"
    }`;

  const handleInput = (e) => {
    const value = e.target.value;
    setInputText(value);

    if (suggestions.length === 0) {
      setGhostText("");
      return;
    }

    const cursorPos = e.target.selectionStart;
    const textUpToCursor = value.substring(0, cursorPos);
    const lastWord = textUpToCursor.split(/\s+/).pop().toLowerCase();

    const match = suggestions.find((s) =>
      s.toLowerCase().startsWith(lastWord)
    );

    if (match && lastWord.length > 0) {
      setGhostText(value + match.substring(lastWord.length));
    } else {
      setGhostText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && ghostText) {
      e.preventDefault();
      setInputText(ghostText);
      setGhostText("");
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
      }, 0);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-3xl text-white space-y-6">
      <h2 className="text-2xl font-bold text-white">Retention Wizard</h2>

      {reason && (
        <>
          <p className="text-lg font-semibold text-blue-200">
            Motivo: <span className="text-white">{reason}</span>
          </p>

          {reasonDetails && (
            <div className="bg-yellow-200 p-4 rounded-lg text-gray-800 break-words whitespace-pre-wrap max-w-full">
              {reasonDetails.replace(/\\n/g, "\n")}
            </div>
          )}
        </>
      )}

      {/* Etapas */}
      {step === 0 && (
        <div className="space-y-3">
          <p>Selecione o tipo de plano:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {planTypes.map((type) => (
              <button
                key={type}
                className={getButtonClasses(planType === type)}
                onClick={() => {
                  setPlanType(type);
                  setStep(1);
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <p>Selecione a categoria do plano:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {planCategories.map((cat) => (
              <button
                key={cat}
                className={getButtonClasses(planCategory === cat)}
                onClick={() => {
                  setPlanCategory(cat);
                  setStep(2);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p>Selecione o provider:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {providers.map((p) => (
              <button
                key={p}
                className={getButtonClasses(provider === p)}
                onClick={() => setProvider(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            className={`mt-3 px-4 py-2 rounded transition font-medium ${
              provider
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-900 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => setStep(3)}
            disabled={!provider}
          >
            Confirmar Provider
          </button>
        </div>
      )}

      {/* Etapa final */}
      {step === 3 && (
        <div className="space-y-4">
          <p>
            <strong>Motivo:</strong> {reason}
          </p>
          <p>
            <strong>Plano:</strong> {planType} ({planCategory})
          </p>
          <p>
            <strong>Provider:</strong> {provider}
          </p>

          {/* Lista de sugestões pré-carregadas */}
          <div className="bg-gray-900 p-4 rounded-lg space-y-2">
            <p className="font-semibold mb-2">Sugestões de retenção:</p>
            {suggestions.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-300 space-y-1">
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Nenhuma sugestão encontrada.</p>
            )}
          </div>

    

          <button
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 hover:bg-gray-700 transition font-medium"
            onClick={() => {
              cleanState();
              setStep(0);
              setProvider("");
              setInputText("");
              setGhostText("");
            }}
          >
            Reiniciar Wizard
          </button>
        </div>
      )}
    </div>
  );
};

export default ReasonWizard;
    
