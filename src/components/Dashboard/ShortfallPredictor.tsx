import {
  AlertTriangle,
  CloudRain,
  Gauge,
  HardHat,
  Truck,
  TrendingDown,
  Clock,
  Activity,
  Zap,
} from "lucide-react"
import type { MineOperationsData } from "../../data/mineOperationsData"

interface ShortfallPredictorProps {
  data: MineOperationsData
  recoveredTons: number
}

export function ShortfallPredictor({ data, recoveredTons }: ShortfallPredictorProps) {
  const currentProjected = Math.min(data.dailyTargetTons, data.projectedOutputTons + recoveredTons)
  const currentShortfall = currentProjected - data.dailyTargetTons
  const shortfallPercent = Number(((currentShortfall / data.dailyTargetTons) * 100).toFixed(1))
  const isRecovered = currentShortfall >= 0

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-100 text-red-800 flex items-center gap-1">
              <Activity size={13} className="animate-pulse text-red-600" /> Midstream Operations
            </span>
            <span className="text-xs text-gray-500 font-medium">Predictive Telematics Engine</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-1">1. Early Production Shortfall Prediction</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Fusing live telematics, weather radar, equipment sensor feeds, and shift output models to preempt bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700">
          <Clock size={15} className="text-teal-700" />
          <span>Active: {data.activeShift}</span>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Target */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Daily Planned Target</span>
            <span className="p-2 bg-gray-50 rounded-xl text-gray-700">
              <HardHat size={16} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{data.dailyTargetTons.toLocaleString()}</span>
            <span className="text-xs font-bold text-gray-500">Tons / day</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-400">Baseline budget target for 3-shift cycle</p>
        </div>

        {/* Projected Output */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>AI Projected Output</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Gauge size={16} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{currentProjected.toLocaleString()}</span>
            <span className="text-xs font-bold text-gray-500">Tons</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            {recoveredTons > 0 ? (
              <span className="text-teal-700 font-bold">+{recoveredTons} T recovered via applied actions</span>
            ) : (
              <span className="text-gray-400">Unmitigated shift forecast</span>
            )}
          </div>
        </div>

        {/* Predicted Shortfall */}
        <div
          className={`rounded-2xl p-5 border shadow-sm ${
            isRecovered
              ? "bg-teal-50/70 border-teal-200"
              : "bg-red-50/70 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={isRecovered ? "text-teal-900" : "text-red-900"}>
              {isRecovered ? "Target Re-achieved" : "Predicted Production Shortfall"}
            </span>
            <span
              className={`p-2 rounded-xl ${
                isRecovered ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-700"
              }`}
            >
              <TrendingDown size={16} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black ${isRecovered ? "text-teal-700" : "text-red-600"}`}>
              {isRecovered ? "+0 T" : `${currentShortfall.toLocaleString()} T`}
            </span>
            <span className={`text-xs font-bold ${isRecovered ? "text-teal-800" : "text-red-700"}`}>
              ({shortfallPercent}%)
            </span>
          </div>
          <p className={`mt-2 text-[11px] ${isRecovered ? "text-teal-800" : "text-red-700"}`}>
            {isRecovered ? "Shortfall neutralized via optimization" : "Missed target trajectory without mitigation"}
          </p>
        </div>

        {/* Shortfall Probability / Risk Level */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Shortfall Probability</span>
            <span
              className={`p-2 rounded-xl font-bold text-xs ${
                data.riskLevel === "Critical"
                  ? "bg-red-100 text-red-700"
                  : data.riskLevel === "High"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {data.riskLevel}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">
              {isRecovered ? "12%" : `${data.shortfallProbabilityPercent}%`}
            </span>
            <span className="text-xs font-bold text-gray-500">Confidence: 94%</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1 truncate" title={data.primaryBottleneck}>
            <AlertTriangle size={13} className="text-orange-500 shrink-0" />
            <span className="truncate">{data.primaryBottleneck}</span>
          </div>
        </div>
      </div>

      {/* MULTI-FACTOR TELEMETRY RISK MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Factor 1: Weather & Sump Inundation */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <CloudRain size={16} />
              </span>
              <span>Weather & Pit Flooding</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              {data.weather.inundationRiskLevel} Risk
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Rainfall Rate:</span>
              <strong className="text-gray-900">{data.weather.rainfallMmPerHour} mm/hr</strong>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>3-Hour Total:</span>
              <strong className="text-gray-900">{data.weather.rainfallLast3HoursMm} mm</strong>
            </div>
            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Pit Sump Capacity:</span>
                <strong className="text-red-700 font-bold">{data.weather.pitSumpCapacityPercent}%</strong>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    data.weather.pitSumpCapacityPercent > 80 ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${data.weather.pitSumpCapacityPercent}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Active Sump Pumps:</span>
              <strong className="text-gray-900">
                {data.weather.activeSumpPumps} of {data.weather.totalSumpPumps} online
              </strong>
            </div>
          </div>

          {data.weather.floodedBenches.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[10px] font-bold text-red-700 block mb-1">Inundated Benches:</span>
              <div className="flex flex-wrap gap-1">
                {data.weather.floodedBenches.map((bench) => (
                  <span key={bench} className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-800 rounded text-[10px]">
                    {bench}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Factor 2: Haul Road Degradation */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Truck size={16} />
              </span>
              <span>Haul Road Degradation</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              High Resistance
            </span>
          </div>

          <div className="space-y-2.5">
            {data.haulRoads.map((road) => (
              <div key={road.roadName} className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 truncate max-w-[150px]">{road.roadName}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      road.status === "Blocked"
                        ? "bg-red-100 text-red-700"
                        : road.status === "Degraded"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {road.status}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Rolling Resistance:</span>
                  <strong className="text-gray-800">{road.rollingResistancePercent}% (norm 2.5%)</strong>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Avg Speed / Delay:</span>
                  <strong className="text-gray-800">
                    {road.averageSpeedKmh} km/h (+{road.cycleTimeDelayMinutes} min)
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Factor 3: Fleet Telematics & Equipment Health */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                <Zap size={16} />
              </span>
              <span>Fleet Telematics & MTBF</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Telemetry Live
            </span>
          </div>

          <div className="space-y-2">
            {data.equipment.slice(0, 3).map((eq) => (
              <div key={eq.id} className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {eq.id} <span className="text-[10px] text-gray-500 font-normal">({eq.model})</span>
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      eq.status === "Operational"
                        ? "bg-teal-100 text-teal-700"
                        : eq.status === "Degraded"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>{eq.metricName}:</span>
                  <strong className="text-gray-900">{eq.metricValue}</strong>
                </div>
                {eq.alert && (
                  <p className="text-[10px] text-red-600 font-medium leading-tight truncate" title={eq.alert}>
                    {eq.alert}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Factor 4: Drill & Blast Constraints */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <span className="p-1.5 bg-orange-100 text-orange-700 rounded-lg">
                <HardHat size={16} />
              </span>
              <span>Blasting & Rock Hardness</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                data.blasting.actualStatus.includes("Delayed")
                  ? "bg-red-100 text-red-800"
                  : "bg-teal-100 text-teal-800"
              }`}
            >
              {data.blasting.actualStatus}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Formation:</span>
              <strong className="text-gray-900 truncate max-w-[140px]" title={data.blasting.formation}>
                {data.blasting.formation}
              </strong>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Rock Mass Rating (RMR):</span>
              <strong className="text-gray-900">{data.blasting.rockMassRating} / 100</strong>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Rock Hardness (UCS):</span>
              <strong className="text-red-700 font-bold">{data.blasting.rockHardnessMpa} MPa</strong>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Fragmentation Yield:</span>
              <strong className="text-amber-700 font-bold">{data.blasting.fragmentationYieldPercent}% (Goal &gt;85%)</strong>
            </div>
            <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-100">
              <span>Muckpile Delay:</span>
              <strong className="text-red-600">+{data.blasting.delayMinutes} min</strong>
            </div>
          </div>
        </div>
      </div>

      {/* SHIFT OUTPUT TRAJECTORY CHART */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Shift Hourly Output Trajectory (Target vs Projected)</h3>
            <p className="text-xs text-gray-500">Live hourly extraction rate tracking across primary face loaders</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-gray-600">Scheduled Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-600">AI Predicted Rate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-600" />
              <span className="text-gray-600">Actual Mined</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-2 pt-4">
          {data.hourlyOutputs.map((item) => {
            const maxVal = 600
            const targetHeight = (item.targetTons / maxVal) * 100
            const projectedHeight = (item.projectedTons / maxVal) * 100
            const actualHeight = item.actualTons ? (item.actualTons / maxVal) * 100 : null
            const hasShortfall = item.projectedTons < item.targetTons

            return (
              <div key={item.hour} className="flex flex-col items-center">
                <div className="h-36 w-full flex items-end justify-center gap-1 px-1 bg-gray-50/50 rounded-xl pb-2">
                  {/* Target Bar */}
                  <div
                    className="w-2.5 bg-gray-300 rounded-t-sm"
                    style={{ height: `${targetHeight}%` }}
                    title={`Target: ${item.targetTons} T`}
                  />

                  {/* Projected Bar */}
                  <div
                    className={`w-2.5 rounded-t-sm ${hasShortfall ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ height: `${projectedHeight}%` }}
                    title={`Projected: ${item.projectedTons} T`}
                  />

                  {/* Actual Bar (if available) */}
                  {actualHeight !== null && (
                    <div
                      className="w-2.5 bg-teal-600 rounded-t-sm"
                      style={{ height: `${actualHeight}%` }}
                      title={`Actual: ${item.actualTons} T`}
                    />
                  )}
                </div>
                <span className="text-[10px] font-mono text-gray-500 mt-2">{item.hour}</span>
                <span className={`text-[10px] font-bold ${hasShortfall ? "text-red-600" : "text-gray-700"}`}>
                  {item.actualTons ?? item.projectedTons} T
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
