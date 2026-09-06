import { Bookmark, Clock3, Library, X } from "lucide-react"
import { useState } from "react"
import type { ManganeseLocation } from "../../data/manganesePoints"

interface LibraryMenuProps {
  savedLocations: ManganeseLocation[]
  recentLocations: ManganeseLocation[]
  onChooseLocation: (location: ManganeseLocation) => void
}

function LibraryMenu({ savedLocations, recentLocations, onChooseLocation }: LibraryMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute top-6 right-24 z-20">
      {open && (
        <div className="absolute right-0 top-16 w-80 max-h-[min(32rem,calc(100vh-6rem))] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-gray-800"><Library size={18} /> Library</div>
            <button onClick={() => setOpen(false)} aria-label="Close library menu" className="text-gray-400 hover:text-gray-900"><X size={18} /></button>
          </div>
          <section className="mt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-teal-700"><Bookmark size={16} /> Saved <span className="text-xs font-normal text-gray-500">{savedLocations.length}</span></div>
            <div className="mt-2 space-y-2">{savedLocations.length ? savedLocations.map((location) => <button key={`saved-${location.id}`} onClick={() => onChooseLocation(location)} className="w-full rounded-xl bg-gray-50 p-3 text-left hover:bg-teal-50"><strong className="block text-sm">{location.locationName}</strong><span className="text-xs text-gray-500">{location.mnPercent}% Mn · {location.potential}</span></button>) : <p className="py-2 text-xs text-gray-500">No saved locations yet.</p>}</div>
          </section>
          <section className="mt-5 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><Clock3 size={16} /> Recent <span className="text-xs font-normal text-gray-500">{recentLocations.length}</span></div>
            <div className="mt-2 space-y-2">{recentLocations.length ? recentLocations.map((location) => <button key={`recent-${location.id}`} onClick={() => onChooseLocation(location)} className="w-full rounded-xl border border-gray-100 p-3 text-left hover:bg-gray-50"><strong className="block text-sm">{location.locationName}</strong><span className="text-xs text-gray-500">{location.mnPercent}% Mn · {location.source}</span></button>) : <p className="py-2 text-xs text-gray-500">No recent locations yet.</p>}</div>
          </section>
        </div>
      )}
      <button onClick={() => setOpen((isOpen) => !isOpen)} aria-label="Open saved and recent locations" className="flex h-14 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-gray-700 shadow-lg hover:bg-gray-50"><Library size={20} /> <span className="hidden sm:inline">Library</span></button>
    </div>
  )
}

export default LibraryMenu