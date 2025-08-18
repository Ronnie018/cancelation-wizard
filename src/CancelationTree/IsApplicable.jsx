import React, { useState } from "react";

const cancellationReasons = [
  { reason: "Hardship", isApplicable: false },
  { reason: "Cooling off", isApplicable: false },
  { reason: "Too expensive", isApplicable: true },
  { reason: "No time to watch", isApplicable: true },
  { reason: "Not enough content", isApplicable: true },
  { reason: "Technical issues", isApplicable: true },
  { reason: "Other Streaming services", isApplicable: true },
  { reason: "Other", isApplicable: true },
];

const IsApplicable = ({ setIsAplicable, setReason }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const filteredReasons = cancellationReasons.filter((item) =>
    item.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item) => {
    setSelected(item);
    setSearchTerm(item.reason);
    setIsOpen(false);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (selected) {
      setIsAplicable(selected.isApplicable);
      setReason(selected.reason);
      setConfirmed(true);
    }
  };

  return (
    <div className="relative w-full bg-gray-800 p-6 rounded-2xl shadow-lg text-white space-y-4">
  <label htmlFor="reason" className="block font-semibold text-white">
    Cancellation Reason
  </label>

  <input
    id="reason"
    type="text"
    placeholder="Type to search..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value)
      setIsOpen(true)
    }}
    onFocus={() => setIsOpen(true)}
    className="w-full border border-gray-700 bg-black text-white placeholder-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white"
  />

  {isOpen && filteredReasons.length > 0 && (
    <ul className="absolute z-10 w-full border border-gray-700 rounded-lg bg-gray-800 shadow-lg mt-1 max-h-60 overflow-y-auto">
      {filteredReasons.map((item, idx) => (
        <li
          key={idx}
          onClick={() => handleSelect(item)}
          className={`p-2 cursor-pointer flex justify-between items-center hover:bg-gray-700 ${
            selected?.reason === item.reason ? "bg-gray-700 font-medium" : ""
          }`}
        >
          <span>{item.reason}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              item.isApplicable ? "bg-gray-900 text-white" : "bg-black text-white"
            }`}
          >
            {item.isApplicable ? "Applicable" : "Not applicable"}
          </span>
        </li>
      ))}
    </ul>
  )}

  {selected && (
    <div className="space-y-2 mt-2">
      <p className="text-sm">
        Selected: <strong>{selected.reason}</strong> (
        {selected.isApplicable ? "Applicable ✅" : "Not applicable ❌"})
      </p>

      <button
        onClick={handleConfirm}
        className="w-full px-4 py-2 rounded-lg bg-black text-white border border-gray-700 hover:bg-gray-700 transition font-medium disabled:opacity-50"
        disabled={confirmed}
      >
        {confirmed ? "Confirmed ✔" : "Confirm Selection"}
      </button>
    </div>
  )}
</div>

  );
};

export default IsApplicable;
