import { useState } from "react"
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Send,
  SlidersHorizontal,
  RotateCcw,
  Truck,
  Flame,
  ShieldCheck,
} from "lucide-react"
import type { PrescriptiveAction } from "../../data/mineOperationsData"

interface PrescriptiveActionsProps {
  actions: PrescriptiveAction[]
  onToggleAction: (actionId: string) => void
  onResetActions: () => void
  appliedActions: string[]
  recoveredTons: number
  totalShortfallTons: number
}

export function PrescriptiveActions({
  actions,
  onToggleAction,
  onResetActions,
  appliedActions,
  recoveredTons,
  totalShortfallTons,
}: PrescriptiveActionsProps) {
  const [notification, setNotification] = useState<string | null>(null)

  const handleApply = (action: PrescriptiveAction) => {
    onToggleAction(action.id)
    const isCurrentlyApplied = appliedActions.includes(action.id)

    if (!isCurrentlyApplied) {
      setNotification(`Telemetry Command Dispatched: "${action.title}" transmitted to Field Control.`)
    } else {
      setNotification(`Reverted action: "${action.title}".`)
    }

    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const recoveryProgress = Math.min(100, Math.round((recoveredTons / Math.abs(totalShortfallTons || 1)) * 100))

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-100 text-teal-800 flex items-center gap-1">
              <Sparkles size={13} className="text-teal-700" /> Downstream Optimization
            </span>
            <span className="text-xs text-gray-500 font-medium">Automated Decision Support System</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-1">2. Prescriptive Corrective Actions</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time algorithmic operational adjustments to dynamically bypass bottlenecks and recover missed tonnages.
          </p>
        </div>

        {appliedActions.length > 0 && (
          <button
            onClick={onResetActions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors self-start sm:self-auto"
          >
            <RotateCcw size={14} /> Reset Simulation
          </button>
        )}
      </div>

      {/* RECOVERY STATUS BAR */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">
              Shortfall Recovery Simulation
            </span>
            <div className="text-2xl font-black mt-1 flex items-baseline gap-2">
              <span>+{recoveredTons.toLocaleString()} Tons Recovered</span>
              <span className="text-xs text-teal-300 font-normal">
                (of {Math.abs(totalShortfallTons).toLocaleString()} T projected deficit)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-teal-200 block">Mitigation Progress</span>
              <strong className="text-lg font-bold">{recoveryProgress}% Neutralized</strong>
            </div>
            <div className="w-24 bg-teal-950/60 rounded-full h-3 overflow-hidden border border-teal-700/50">
              <div
                className="bg-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${recoveryProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live notification feedback */}
        {notification && (
          <div className="mt-4 p-2.5 rounded-xl bg-teal-700/60 border border-teal-500/50 text-xs font-semibold text-teal-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* PRESCRIPTIVE ACTIONS LIST */}
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, index) => {
          const isApplied = appliedActions.includes(action.id)

          return (
            <div
              key={action.id}
              className={`rounded-2xl p-5 border transition-all duration-200 ${
                isApplied
                  ? "bg-teal-50/80 border-teal-300 shadow-md ring-1 ring-teal-400"
                  : "bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Content info */}
                <div className="space-y-3 flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 font-mono">REC #{index + 1}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        action.priority === "Urgent"
                          ? "bg-red-100 text-red-700"
                          : action.priority === "High"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {action.priority} Priority
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                      {action.category === "Fleet Dispatch" && <Truck size={12} />}
                      {action.category === "Drill & Blast" && <Flame size={12} />}
                      {action.category === "Geotechnical & Drainage" && <SlidersHorizontal size={12} />}
                      {action.category}
                    </span>
                    {isApplied && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-600 text-white flex items-center gap-1">
                        <CheckCircle2 size={12} /> Active in Fleet Dispatch
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{action.title}</h3>

                  {/* Trigger & Root Cause */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Detected Bottleneck Trigger
                      </span>
                      <p className="text-gray-700 mt-0.5 font-medium">{action.triggerCondition}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Root Cause Diagnosis
                      </span>
                      <p className="text-gray-700 mt-0.5">{action.rootCause}</p>
                    </div>
                  </div>

                  {/* Prescriptive Recommendation */}
                  <div className="text-xs text-gray-800 leading-relaxed bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> Prescribed Operational Adjustment
                    </span>
                    <p className="font-semibold text-gray-900">{action.prescriptiveAction}</p>
                  </div>

                  {/* Target Benches & Fleet Details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                    <div>
                      <span className="text-gray-400">Target Sectors: </span>
                      <strong className="text-gray-800">{action.targetBenches.join(", ")}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400">Allocated Units: </span>
                      <strong className="text-gray-800">{action.assignedFleet.join(", ")}</strong>
                    </div>
                  </div>
                </div>

                {/* Right side: Recovery Metrics & Action Button */}
                <div className="lg:w-60 shrink-0 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5 space-y-4">
                  <div className="w-full text-left lg:text-right space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">Projected Recovery</span>
                      <div className="flex items-baseline lg:justify-end gap-1.5 text-teal-700">
                        <TrendingUp size={16} />
                        <span className="text-2xl font-black">+{action.projectedRecoveryTons}</span>
                        <span className="text-xs font-bold">Tons</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">Cycle Time Benefit</span>
                      <div className="flex items-center lg:justify-end gap-1 text-gray-700 text-xs font-semibold">
                        <Clock size={14} className="text-gray-400" />
                        <span>-{action.cycleTimeBenefitMinutes} min / trip</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApply(action)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                      isApplied
                        ? "bg-teal-700 text-white hover:bg-teal-800 shadow-teal-700/20"
                        : "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/20"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <ShieldCheck size={16} /> Applied (Click to Revert)
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Apply Corrective Action <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
