import axios from 'axios'
import type { UserParams, UsersResponse } from '../types/user'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function fetchUsers(
  params: UserParams
): Promise<UsersResponse> {
  const response = await axios.get(`${BASE_URL}/users`, {
    params: {
      search: params.search,
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      sortDir: params.sortOrder,
      nationalities: params.nationalities?.join(','),
      hobbies: params.hobbies?.join(',')
    }
  })

  return response.data
}