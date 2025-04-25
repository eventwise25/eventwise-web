import React from 'react'

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow-md text-center">
    <div className="text-4xl">{icon}</div>
    <h3 className="text-lg font-semibold mt-2">{title}</h3>
    <p className="text-gray-600 mt-1">{description}</p>
  </div>
  )
}

export default FeatureCard