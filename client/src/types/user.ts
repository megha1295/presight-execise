export interface User {
  id: number
  avatar: string
  first_name: string
  last_name: string
  age: number
  nationality: string
  hobbies: string[]
}

export interface FilterOption {
  value: string
  count: number
}

export interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
  filters: {
    nationalities: FilterOption[]
    hobbies: FilterOption[]
  }
}
export interface UserParams {
  search: string
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc',
  nationalities?: string[]
  hobbies?: string[]
}