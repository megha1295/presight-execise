interface SortControlsProps {
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSortByChange: (value: string) => void
  onSortOrderChange: (value: 'asc' | 'desc') => void
}

function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange
}: SortControlsProps) {
  return (
    <div className="mt-4 flex gap-3">
      <select
        value={sortBy}
        onChange={(event) => onSortByChange(event.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
      >
        <option value="first_name">First Name</option>
        <option value="last_name">Last Name</option>
        <option value="age">Age</option>
        <option value="nationality">Nationality</option>
      </select>

      <select
        value={sortOrder}
        onChange={(event) =>
          onSortOrderChange(event.target.value as 'asc' | 'desc')
        }
        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
      >
        <option value="asc">ASC</option>
        <option value="desc">DESC</option>
      </select>
    </div>
  )
}

export default SortControls