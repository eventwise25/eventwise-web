import React from 'react'

const StepCard: React.FC<{ step: string; title: string; description: string }> = ({ step, title, description }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md w-80 text-center">
    <div className="text-2xl font-bold">{step}</div>
    <h3 className="text-lg font-semibold mt-2">{title}</h3>
    <p className="text-gray-600 mt-1">{description}</p>
  </div>
  )
}

export default StepCard