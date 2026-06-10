# Presight User Directory

A full-stack user directory application built using React, TypeScript, Node.js, Express, SQLite, TanStack Query, and React Window.

## Features

- Search users by first name and last name
- Sort users by:
  - First Name
  - Last Name
  - Age
  - Nationality
- Filter users by nationality
- Filter users by hobbies
- Top 20 nationality filters with counts
- Top 20 hobby filters with counts
- Infinite scrolling
- Virtualized list rendering using React Window
- URL-synchronized search, sorting, and filters
- Responsive UI for desktop and mobile devices

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Axios
- React Window

### Backend

- Node.js
- Express
- SQLite
- better-sqlite3
- Faker.js

---

## Local Setup

### Install Dependencies

From the project root:

```bash
yarn install
```

### Seed the Database

Run the database seed script:

```bash
yarn workspace presight-server seed
```

This will:

- Create the SQLite database
- Seed users
- Seed hobbies
- Create user-hobby relationships

### Run the Backend

```bash
yarn workspace presight-server start
```

Backend runs on:

```txt
http://localhost:5000
```

### Run the Frontend

Open another terminal:

```bash
yarn workspace presight-client dev
```

Frontend runs on:

```txt
http://localhost:3000
```

---

## API

### Get Users

```http
GET /api/users
```

### Query Parameters

| Parameter | Description |
|------------|-------------|
| search | Search by first name or last name |
| page | Page number |
| limit | Number of records per page |
| sortBy | first_name, last_name, age, nationality |
| sortDir | asc, desc |
| nationalities | Comma-separated list of nationalities |
| hobbies | Comma-separated list of hobbies |

### Example

```http
GET /api/users?search=john&page=1&limit=20&sortBy=age&sortDir=desc
```

---

## Running with Docker Compose

Build and start all services:

```bash
docker compose up --build
```

If database seeding is not automated:

```bash
docker compose exec server yarn seed
```

## Application URLs

Frontend:

```txt
http://localhost:3000
```

Backend:

```txt
http://localhost:5000
```

---

## Implementation Notes

- Server-side filtering, sorting, and pagination
- Infinite scrolling implemented using TanStack Query's `useInfiniteQuery`
- Virtualized rendering using React Window for improved performance
- URL query parameters preserve search, sorting, and filter state
- Responsive layout optimized for desktop and mobile devices