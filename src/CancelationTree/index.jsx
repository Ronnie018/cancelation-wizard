import React, { useState } from 'react'
import IsApplicable from './IsApplicable'
import ReasonWizard from './ReasonWizard'

export default () => {
  const [isAplicable, setIsAplicable] = useState(null)
  const [reason, setReason] = useState(null)

  const cleanState = () => {
    setIsAplicable(null)
    setReason(null)
  }
  // Estado "não aplicável"
  if (isAplicable === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center w-full max-w-lg">
          <p className="text-white text-lg font-medium">
            Não é necessário realizar retenção para{" "}
            <span className="font-bold text-white">{reason}</span>
          </p>

          <button
            className="mt-6 px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 hover:bg-gray-700 transition font-medium focus:outline-none"
            onClick={() => {
              setIsAplicable(null)
              setReason(null)
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  // Estado inicial / aplicável
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <div className="w-full max-w-3xl">
        {isAplicable === null ? (
          <IsApplicable
            setIsAplicable={setIsAplicable}
            setReason={setReason}
          />
        ) : (
          <ReasonWizard reason={reason} cleanState={cleanState} />
        )}
      </div>
    </div>
  )
}
