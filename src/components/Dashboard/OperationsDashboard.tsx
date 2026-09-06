import { useState, useMemo } from "react"
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  RefreshCw,
  Sparkles,
  TrendingDown,
} from "lucide-react"
import {
  getMineOperationsData,
  AVAILABLE_MINES,
  type MineOperationsData,
} from "../../data/mineOperationsData"
import { ShortfallPredictor } from "./ShortfallPredictor"
import { PrescriptiveActions } from "./PrescriptiveActions"

interface OperationsDashboardProps {
  mineSlug: string
  onNavigate: (path: string) => void
}

export function OperationsDashboard({ mineSlug, onNavigate }: OperationsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "midstream" | "downstream">("all")
  const [appliedActionIds, setAppliedActionIds] = useState<string[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  // Retrieve data for current mine slug
  const mineData: MineOperationsData = useMemo(() => {
    return getMineOperationsData(mineSlug)
  }, [mineSlug])

  // Calculate recovered tons from applied prescriptive actions
  const recoveredTons = useMemo(() => {
    return mineData.prescriptiveActions
      .filter((action) => appliedActionIds.includes(action.id))
      .reduce((sum, action) => sum + action.projectedRecoveryTons, 0)
  }, [mineData, appliedActionIds])

  const handleToggleAction = (actionId: string) => {
    setAppliedActionIds((prev) =>
      prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId],
    )
  }

  const handleResetActions = () => {
    setAppliedActionIds([])
  }

  const handleRefreshTelemetry = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
    }, 800)
  }

  const baseShortfall = mineData.projectedOutputTons - mineData.dailyTargetTons

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Back link and Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("/")}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to GIS Mineral Map"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Map View</span>
            </button>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                  MOIL Operations Intelligence
                </span>
                <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                  Endpoint: /{mineData.slug}/dash
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-tight flex items-center gap-2 mt-0.5">
                <Building2 className="text-teal-700 shrink-0" size={22} />
                <span>{mineData.mineName}</span>
              </h1>
            </div>
          </div>

          {/* Right: Mine Switcher & Telemetry Ticker */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Telemetry Pulse */}
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-xl text-[11px] text-gray-600 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600" />
              </span>
              <span className="hidden lg:inline">Telemetry Synced</span>
              <button
                onClick={handleRefreshTelemetry}
                className="hover:text-black ml-1 text-gray-400 hover:rotate-180 transition-transform"
                title="Sync live telematics"
              >
                <RefreshCw size={12} className={isSyncing ? "animate-spin text-teal-700" : ""} />
              </button>
            </div>

            {/* Mine Switcher Dropdown */}
            <div className="relative">
              <select
                value={mineData.slug}
                onChange={(e) => onNavigate(`/${e.target.value}/dash`)}
                aria-label="Select Mine Operations Dashboard"
                className="appearance-none bg-gray-900 text-white text-xs font-bold pl-3.5 pr-8 py-2.5 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors outline-none shadow-sm"
              >
                {AVAILABLE_MINES.map((mine) => (
                  <option key={mine.slug} value={mine.slug}>
                    {mine.name} ({mine.district})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* SUB-HEADER & TAB BAR */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-gray-600">
            <span>
              District: <strong className="text-gray-900">{mineData.district}</strong>
            </span>
            <span>·</span>
            <span>
              Grade: <strong className="text-gray-900">{mineData.avgMnGradePercent}% Mn</strong>
            </span>
            <span>·</span>
            <span>
              Type: <strong className="text-gray-900">{mineData.extractionType}</strong>
            </span>
          </div>

          {/* View Filter Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 font-semibold">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Full Operations Overview
            </button>
            <button
              onClick={() => setActiveTab("midstream")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "midstream"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <TrendingDown size={13} className="text-red-500" /> 1. Shortfall Prediction
            </button>
            <button
              onClick={() => setActiveTab("downstream")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "downstream"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Sparkles size={13} className="text-teal-600" /> 2. Prescriptive Actions
            </button>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-10">
        {/* PILLAR 1: MIDSTREAM OPERATIONS */}
        {(activeTab === "all" || activeTab === "midstream") && (
          <section id="midstream-operations" className="scroll-mt-24">
            <ShortfallPredictor data={mineData} recoveredTons={recoveredTons} />
          </section>
        )}

        {/* PILLAR 2: DOWNSTREAM OPTIMIZATION */}
        {(activeTab === "all" || activeTab === "downstream") && (
          <section id="downstream-optimization" className="scroll-mt-24">
            <PrescriptiveActions
              actions={mineData.prescriptiveActions}
              onToggleAction={handleToggleAction}
              onResetActions={handleResetActions}
              appliedActions={appliedActionIds}
              recoveredTons={recoveredTons}
              totalShortfallTons={baseShortfall}
            />
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-6 px-4 text-center text-xs text-gray-400">
        <p>
          MOIL Limited — Integrated Operations Center · Real-Time Telematics & Downstream Optimization
        </p>
      </footer>
    </div>
  )
}
