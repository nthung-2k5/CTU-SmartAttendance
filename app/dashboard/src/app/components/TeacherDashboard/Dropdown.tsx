import { Check, ChevronDown, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export interface DropdownOption {
  value: string
  label: string
  badge?: string
  sublabel?: string
}

interface DropdownProps {
  value: string
  options: (string | DropdownOption)[]
  open: boolean
  onToggle: () => void
  onSelect: (value: string) => void
  icon?: React.ReactNode
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  className?: string
}

export function Dropdown({
  value,
  options,
  open,
  onToggle,
  onSelect,
  icon,
  placeholder = 'Chọn một tùy chọn...',
  searchable = false,
  disabled = false,
  className = '',
}: DropdownProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Normalize options to DropdownOption format
  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt,
  )

  const selectedOption = normalizedOptions.find((opt) => opt.value === value || opt.label === value)
  const displayLabel = selectedOption ? selectedOption.label : value || placeholder

  // Filter options if searchable
  const filteredOptions = normalizedOptions.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.sublabel?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (open) onToggle()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onToggle])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`w-full flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl border transition-all duration-200 text-left ${
          disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : open
              ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 text-slate-800 shadow-sm'
              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300 text-slate-700'
        }`}
      >
        {icon && <span className="text-blue-600 shrink-0">{icon}</span>}
        <div className="flex-1 truncate">
          <span className="text-sm font-medium text-slate-800 block truncate">{displayLabel}</span>
          {selectedOption?.sublabel && (
            <span className="text-xs text-slate-500 block truncate">{selectedOption.sublabel}</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-blue-600' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {searchable && normalizedOptions.length > 5 && (
            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">Không tìm thấy kết quả</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.value || value === opt.label
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => {
                      onSelect(opt.value)
                      setSearchTerm('')
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 ${
                      isSelected ? 'bg-blue-50/80 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected ? (
                        <Check size={15} className="text-blue-600 shrink-0" />
                      ) : (
                        <span className="w-3.5 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="block truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="block text-xs text-slate-400 font-normal">{opt.sublabel}</span>
                        )}
                      </div>
                    </div>
                    {opt.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">
                        {opt.badge}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
