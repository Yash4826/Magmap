import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 sm:right-auto">
      <div className="flex items-center w-full sm:w-[380px] h-14 bg-white rounded-2xl shadow-lg px-4">
        <Search
          size={22}
          className="text-gray-500"
        />

        <input
          type="text"
          placeholder="Search mine, village or location..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="ml-3 flex-1 outline-none text-sm text-gray-700"
        />
      </div>
    </div>
  )
}

export default SearchBar