import { forwardRef } from 'react'
import type { FilterOption } from '../types/user'

interface FilterSidebarProps {
  nationalityFilters: FilterOption[]
  hobbyFilters: FilterOption[]
  selectedNationalities: string[]
  selectedHobbies: string[]
  onNationalityToggle: (value: string) => void
  onHobbyToggle: (value: string) => void
  onClose?: () => void
  isMobileDrawer?: boolean
}

const FilterSidebar = forwardRef<HTMLDivElement, FilterSidebarProps>(
  (
    {
      nationalityFilters,
      hobbyFilters,
      selectedNationalities,
      selectedHobbies,
      onNationalityToggle,
      onHobbyToggle,
      onClose,
      isMobileDrawer = false
    },
    ref
  ) => {
    return (
      <aside
        className="min-h-0 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-4 md:h-[89vh]"
      >
        <div className='sm:h-[72vh] md:h-[67vh] lg:h-[90vh] overflow-y-auto' ref={ref}>
        {isMobileDrawer && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-100">Filters</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-100 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-200">
            Nationalities
          </h3>
          <div className="space-y-2">
            {nationalityFilters.map((item) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedNationalities.includes(item.value)}
                    onChange={() => onNationalityToggle(item.value)}
                  />
                  {item.value}
                </span>
                <span className="text-xs text-slate-500">{item.count}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">
            Hobbies
          </h3>
          <div className="space-y-2">
            {hobbyFilters.map((item) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedHobbies.includes(item.value)}
                    onChange={() => onHobbyToggle(item.value)}
                  />
                  {item.value}
                </span>
                <span className="text-xs text-slate-500">{item.count}</span>
              </label>
            ))}
          </div>
        </div>

        </div>

        {isMobileDrawer && (
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply Filters
          </button>
        )}
      </aside>
    )
  }
)

export default FilterSidebar