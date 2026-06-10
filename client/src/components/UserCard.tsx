import type { User } from '../types/user'

interface UserCardProps {
  user: User
}

function UserCard({ user }: UserCardProps) {
  const visibleHobbies = user.hobbies.slice(0, 2)
  const remainingCount = user.hobbies.length - visibleHobbies.length

  return (
    <article className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 sm:gap-4 sm:p-4">
      <img
        src={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
        className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
      />

      <div className="flex-1 min-w-0">
        <h2 className="truncate text-base font-semibold text-slate-100 sm:text-lg">
          {user.first_name} {user.last_name}
        </h2>

        <div className="mt-1 flex justify-between text-xs text-slate-400 sm:text-sm">
          <span className="truncate">{user.nationality}</span>
          <span className="ml-2 shrink-0">{user.age}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-2">
          {visibleHobbies.map((hobby) => (
            <span
              key={hobby}
              className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300 sm:px-3 sm:py-1"
            >
              {hobby}
            </span>
          ))}

          {remainingCount > 0 && (
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300 sm:px-3 sm:py-1">
              +{remainingCount}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default UserCard