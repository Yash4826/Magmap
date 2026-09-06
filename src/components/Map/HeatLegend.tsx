function HeatLegend() {
  return (
    <div className="absolute bottom-5 left-5 z-20 w-56 rounded-2xl bg-white/95 backdrop-blur p-4 shadow-xl border border-white">
      <div className="flex items-center justify-between text-xs font-bold text-gray-700">
        <span>Manganese Potential</span>
        <span>Mn %</span>
      </div>
      <div className="mt-3 h-3 rounded-full bg-gradient-to-r from-green-700 via-green-400 via-lime-400 via-yellow-300 via-orange-500 to-red-600" />
      <div className="mt-1 flex justify-between text-[10px] text-gray-500">
        <span>Very Low</span>
        <span>Moderate</span>
        <span>Very High</span>
      </div>
      <p className="mt-2 text-[10px] text-gray-500">Mn Concentration (%)</p>
    </div>
  )
}

export default HeatLegend