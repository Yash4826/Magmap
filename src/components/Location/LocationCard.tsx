import { Bookmark, BookmarkCheck, FileDown, MapPin, X } from "lucide-react"
import type { ManganeseLocation } from "../../data/manganesePoints"

interface LocationCardProps {
	location: ManganeseLocation | null
	coordinates: [number, number] | null
	onGenerateReport: () => void
	anchor: { x: number; y: number } | null
	onClose: () => void
	pinned: boolean
	saved: boolean
	onToggleSaved: () => void
}

function LocationCard({ location, coordinates, onGenerateReport, anchor, onClose, pinned, saved, onToggleSaved }: LocationCardProps) {
	if (pinned) {
		return (
			<aside className="absolute right-0 top-0 z-30 flex h-full w-[min(31rem,calc(100vw-1rem))] overflow-hidden bg-white shadow-2xl border-l border-gray-200">
				<div className="min-w-0 flex-1 overflow-y-auto p-5">
					<div className="flex items-center justify-between">
						<div><p className="text-xs font-bold uppercase tracking-wide text-teal-700">Manganese location details</p><h2 className="text-xl font-bold text-gray-900 mt-1">{location?.locationName ?? "Selected location"}</h2></div>
						<button onClick={onClose} aria-label="Close location sidebar" className="text-gray-400 hover:text-gray-900"><X size={20} /></button>
					</div>
					{location && <>
						<button onClick={onToggleSaved} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">{saved ? <BookmarkCheck size={17} className="text-teal-700" /> : <Bookmark size={17} />} {saved ? "Saved location" : "Add to Saved"}</button>
						<div className="grid grid-cols-2 gap-3 mt-4 text-sm"><div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500 block">Mn Grade</span><strong>{location.mnPercent}%</strong></div><div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500 block">Confidence</span><strong>{location.confidence}%</strong></div></div>
						<p className="text-sm text-gray-500 mt-3">{location.potential} potential · {location.source}</p>
						<button onClick={onGenerateReport} className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-700"><FileDown size={17} /> Generate complete report</button>
					</>}
				</div>
			</aside>
		)
	}

	return (
		<aside
			className={`absolute z-30 w-[min(20rem,calc(100vw-2rem))] bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white p-5 ${anchor ? "" : "bottom-5 left-5"}`}
			style={anchor ? { left: Math.min(anchor.x + 14, Math.max(16, window.innerWidth - 336)), top: Math.min(anchor.y + 14, Math.max(16, window.innerHeight - 250)) } : undefined}
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-wide text-teal-700 font-bold">{location ? "Detection point" : "Map selection"}</p>
					<h2 className="text-lg font-bold text-gray-900 mt-1">{location?.locationName ?? "Unclassified location"}</h2>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<MapPin className="text-orange-600" size={22} />
					<button onClick={onClose} aria-label="Close location card" className="text-gray-400 hover:text-gray-900">
						<X size={18} />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 mt-4 text-sm">
				<div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500 block">Mn Grade</span><strong>{location ? `${location.mnPercent}%` : "Pending"}</strong></div>
				<div className="bg-gray-50 rounded-xl p-3"><span className="text-gray-500 block">Confidence</span><strong>{location ? `${location.confidence}%` : "Pending"}</strong></div>
			</div>
			<p className="text-xs text-gray-500 mt-3">
				{location ? `${location.potential} potential · ${location.source}` : `Coordinates: ${coordinates?.[1].toFixed(5)}, ${coordinates?.[0].toFixed(5)}`}
			</p>
			<button onClick={onGenerateReport} className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-700">
				<FileDown size={17} /> View Details
			</button>
		</aside>
	)
}

export default LocationCard
