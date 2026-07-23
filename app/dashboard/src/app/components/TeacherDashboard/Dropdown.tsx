import { Check, ChevronDown } from 'lucide-react'

export function Dropdown({
  value,
  options,
  open,
  onToggle,
  onSelect,
  icon,
}: {
  value: string
  options: string[]
  open: boolean
  onToggle: () => void
  onSelect: (v: string) => void
  icon: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-50 border border-blue-100 hover:border-blue-300 transition-colors"
      >
        <span className="text-blue-500 shrink-0">{icon}</span>
        <span className="flex-1 text-left text-gray-800 text-sm font-medium truncate">{value}</span>
        <ChevronDown size={18} className={`text-blue-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
          {options.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => onSelect(s)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 ${value === s ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
            >
              {value === s && <Check size={14} className="text-blue-500" />}
              <span className={value === s ? '' : 'ml-5'}>{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
