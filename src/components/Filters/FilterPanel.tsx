interface FilterPanelProps {
  open: boolean
  onClose: () => void
  minimumMn: number
  onMinimumMnChange: (value: number) => void
  maximumMn: number
  onMaximumMnChange: (value: number) => void
  minimumConfidence: number
  onMinimumConfidenceChange: (value: number) => void
  potential: string
  onPotentialChange: (value: string) => void
  source: string
  onSourceChange: (value: string) => void
  onApply: () => void
  onReset: () => void
}

function FilterPanel({
  open,
  onClose,
  minimumMn,
  onMinimumMnChange,
  maximumMn,
  onMaximumMnChange,
  minimumConfidence,
  onMinimumConfidenceChange,
  potential,
  onPotentialChange,
  source,
  onSourceChange,
  onApply,
  onReset,
}: FilterPanelProps) {

  if (!open) return null

  return (
    <div className="absolute top-20 right-4 left-4 z-20 sm:left-auto sm:right-6 w-auto sm:w-80 bg-white rounded-3xl shadow-xl border border-gray-100 p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-lg font-semibold">
          Filters
        </h2>

        <button
          onClick={onClose}
          aria-label="Close filters"
          className="text-gray-500 hover:text-black"
        >
          X
        </button>

      </div>

      <div className="space-y-5">

        <div>
          <p className="text-sm font-medium mb-3">
            Mn Concentration (%)
          </p>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-gray-500">
              Minimum
              <input
                type="range"
                min="0"
                max="55"
                value={minimumMn}
                onChange={(event) => onMinimumMnChange(Number(event.target.value))}
                className="mt-2 w-full"
              />
              <span className="block text-gray-700">{minimumMn}%</span>
            </label>
            <label className="text-xs text-gray-500">
              Maximum
              <input
                type="range"
                min="0"
                max="55"
                value={maximumMn}
                onChange={(event) => onMaximumMnChange(Number(event.target.value))}
                className="mt-2 w-full"
              />
              <span className="block text-gray-700">{maximumMn}%</span>
            </label>
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>55%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Minimum confidence</span>
            <span>{minimumConfidence}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={minimumConfidence}
            onChange={(event) => onMinimumConfidenceChange(Number(event.target.value))}
            className="w-full"
          />
        </div>

        <label className="block text-sm font-medium">
          Potential
          <select
            value={potential}
            onChange={(event) => onPotentialChange(event.target.value)}
            className="mt-2 w-full border border-gray-200 rounded-xl p-3"
          >
            <option>All</option>
            <option>Very High</option>
            <option>High</option>
            <option>Moderate</option>
            <option>Low</option>
            <option>Very Low</option>
          </select>
        </label>

        <label className="block text-sm font-medium">
          Data source
          <select
            value={source}
            onChange={(event) => onSourceChange(event.target.value)}
            className="mt-2 w-full border border-gray-200 rounded-xl p-3"
          >
            <option>All</option>
            <option>Satellite</option>
            <option>Ground Samples</option>
            <option>Borehole Data</option>
          </select>
        </label>

      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onReset}
          className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={onApply}
          className="flex-[1.5] bg-teal-700 text-white py-3 rounded-xl font-medium hover:bg-teal-800"
        >
          Apply Filters
        </button>
      </div>

    </div>
  )
}

export default FilterPanel