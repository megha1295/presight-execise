const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const search = req.query.search || ''
  const offset = (page - 1) * limit

  const whereConditions = [];
  const queryParams = [];
  const nationalityFilterConditions = [];
  const nationalityFilterParams = [];

  const nationalities = req.query.nationalities
    ? req.query.nationalities.split(',')
    : []

  const hobbies = req.query.hobbies
    ? req.query.hobbies.split(',')
    : []

  const availableSortOptions = [
    'first_name',
    'last_name',
    'nationality',
    'age'
  ]

  const sortBy = availableSortOptions.includes(req.query.sortBy)
    ? req.query.sortBy
    : 'first_name'

  const sortOrder = req.query.sortDir === 'desc' ? 'DESC' : 'ASC'

  if (search) {
    whereConditions.push(`(
      first_name LIKE ? OR 
      last_name LIKE ? OR
      first_name || ' ' || last_name LIKE ?)`)
    nationalityFilterConditions.push(`(
      first_name LIKE ? OR 
      last_name LIKE ? OR
      first_name || ' ' || last_name LIKE ?)`)
    
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    nationalityFilterParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (nationalities.length > 0) {
    const placeholders = nationalities.map(() => '?').join(',')

    whereConditions.push(`nationality IN (${placeholders})`)
    queryParams.push(...nationalities)
  }

  if (hobbies.length > 0) {
    const placeholders = hobbies.map(() => '?').join(',')

    whereConditions.push(`
      users.id IN (
        SELECT uh.user_id FROM user_hobbies uh JOIN hobbies h ON h.id = uh.hobby_id
        WHERE h.name IN (${placeholders})
        GROUP BY uh.user_id
        HAVING COUNT(DISTINCT h.name) = ?
      )
    `)
    nationalityFilterConditions.push(`
      users.id IN (
        SELECT uh.user_id FROM user_hobbies uh JOIN hobbies h ON h.id = uh.hobby_id
        WHERE h.name IN (${placeholders})
        GROUP BY uh.user_id
        HAVING COUNT(DISTINCT h.name) = ?
      )
    `)

    queryParams.push(...hobbies, hobbies.length);
    nationalityFilterParams.push(...hobbies, hobbies.length);
  }

  const whereSql = whereConditions.length > 0
    ? `WHERE ${whereConditions.join(' AND ')}`
    : ''
    const whereNationalityFilterSql = nationalityFilterConditions.length > 0
    ? `WHERE ${nationalityFilterConditions.join(' AND ')}`
    : ''

  const users = db.prepare(`
  SELECT
    users.id,
    users.avatar,
    users.first_name,
    users.last_name,
    users.age,
    users.nationality,
    COALESCE(GROUP_CONCAT(DISTINCT hobbies.name), '') as hobbies
  FROM users
  LEFT JOIN user_hobbies ON user_hobbies.user_id = users.id
  LEFT JOIN hobbies ON hobbies.id = user_hobbies.hobby_id
  ${whereSql}
  GROUP BY users.id
  ORDER BY users.${sortBy} ${sortOrder}, users.id ASC
  LIMIT ? OFFSET ?
`).all(...queryParams, limit, offset)

const usersWithHobbies = users.map(user => ({
  ...user,
  hobbies: user.hobbies ? user.hobbies.split(',') : []
}))

  const totalResult = db.prepare(`
    SELECT COUNT(*) as total
    FROM users
    ${whereSql}
  `).get(...queryParams)

  const total = totalResult.total
  const hasMore = offset + limit < total

  const nationalityFilters = db.prepare(`
    SELECT
      nationality as value,
      COUNT(*) as count
    FROM users
    ${whereNationalityFilterSql}
    GROUP BY nationality
    ORDER BY count DESC, nationality ASC
    LIMIT 20
  `).all(...nationalityFilterParams)
  const hobbyFilters = db.prepare(`
    SELECT
      h.name as value,
      COUNT(DISTINCT users.id) as count
    FROM users
    JOIN user_hobbies uh
      ON uh.user_id = users.id
    JOIN hobbies h
      ON h.id = uh.hobby_id
    ${whereSql}
    GROUP BY h.name
    ORDER BY count DESC, h.name ASC
    LIMIT 20
  `).all(...queryParams)

  res.json({
    users: usersWithHobbies,
    pagination: {
    page,
    limit,
    total,
    hasMore
  },
    filters: {
      nationalities: nationalityFilters,
      hobbies: hobbyFilters
    }
  })
})

module.exports = router