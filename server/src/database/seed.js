const { faker } = require('@faker-js/faker')
const db = require('./db')

const HOBBIES = [
  'Reading',
  'Coding',
  'Swimming',
  'Cooking',
  'Gaming',
  'Hiking',
  'Photography',
  'Painting',
  'Cycling',
  'Yoga',
  'Dancing',
  'Gardening',
  'Traveling',
  'Writing',
  'Music',
  'Football',
  'Basketball',
  'Tennis',
  'Chess',
  'Fishing',
  'Surfing',
  'Skiing',
  'Running',
  'Meditation',
  'Volunteering'
]

const insertHobby = db.prepare(
  'INSERT OR IGNORE INTO hobbies (name) VALUES (?)'
)

const insertUser = db.prepare(`
  INSERT INTO users (avatar, first_name, last_name, age, nationality)
  VALUES (?, ?, ?, ?, ?)
`)

const insertUserHobby = db.prepare(
  'INSERT OR IGNORE INTO user_hobbies (user_id, hobby_id) VALUES (?, ?)'
)

const getHobbyByName = db.prepare(
  'SELECT id FROM hobbies WHERE name = ?'
)

function seed() {
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get()

  if (existingUsers.count > 0) {
    console.log('Database already seeded. Skipping.')
    return
  }

  console.log('Seeding database...')

  for (const hobby of HOBBIES) {
    insertHobby.run(hobby)
  }

  console.log('Hobbies inserted.')

  const seedUsers = db.transaction(() => {
    for (let i = 0; i < 1000; i++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const age = faker.number.int({ min: 18, max: 65 })
      const nationality = faker.location.country()
      const avatar = faker.image.avatar()

      const result = insertUser.run(
        avatar,
        firstName,
        lastName,
        age,
        nationality
      )

      const userId = result.lastInsertRowid

      const numberOfHobbies = faker.number.int({ min: 0, max: 10 })
      const selectedHobbies = faker.helpers.shuffle(HOBBIES).slice(0, numberOfHobbies)

      for (const hobbyName of selectedHobbies) {
        const hobby = getHobbyByName.get(hobbyName)
        insertUserHobby.run(userId, hobby.id)
      }
    }
  })

  seedUsers()

  console.log('1000 users seeded successfully.')
}

seed()