# Presight User Directory

A full-stack user directory application with search, filtering, sorting, and infinite scroll.

Built with React, Node.js, SQLite, and Docker.

---

## Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- TanStack Query (infinite scroll and caching)
- react-window (virtualization)

**Backend**
- Node.js with Express 5
- better-sqlite3 (SQLite)
- CommonJS modules

**Infrastructure**
- Docker and Docker Compose
- nginx (serves frontend and proxies API)

---

## Features

- Search users by first name, last name, or full name
- Filter by nationality (OR logic - matches any selected)
- Filter by hobbies (AND logic - must have all selected)
- Sort by first name, last name, age, or nationality
- Virtualized infinite scroll list
- URL-synced filters (reload or share URL restores state)
- Responsive layout with mobile filter drawer
- Loading, empty, and error states

---

## Running Locally

### Prerequisites

- Node.js 20+
- npm

### Setup

**1. Install dependencies**

```bash
npm install
```

**2. Seed the database**

```bash
cd server
node src/database/seed.js
```

This creates `server/users.db` with 1000 seeded users.

**3. Start the server**

```bash
cd server
node src/index.js
```

Server runs on `http://localhost:3001`

**4. Start the client**

Open a new terminal:

```bash
cd client
npm run dev
```

Client runs on `http://localhost:5173`

**5. Open the app**

```
http://localhost:5173
```

---

## Running with Docker Compose

### Prerequisites

- Docker Desktop installed and running

### Setup

**1. Build and start**

```bash
docker-compose up --build
```

This will:
- Build the server and client Docker images
- Start both containers
- Seed the database automatically on first run
- Serve the app at `http://localhost:3000`

**2. Open the app**

```
http://localhost:3000
```

**3. Stop**

```bash
docker-compose down
```

### Subsequent runs

After the first build, start without rebuilding:

```bash
docker-compose up
```

Rebuild only when code changes:

```bash
docker-compose up --build
```

---

## API Endpoints

### GET /api/users

Returns paginated users with filters applied.

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search by first name, last name, or full name |
| nationalities | string | Comma separated list. OR logic. |
| hobbies | string | Comma separated list. AND logic. |
| sortBy | string | first_name, last_name, age, nationality |
| sortDir | string | asc or desc |
| page | number | Page number. Default 1. |
| limit | number | Results per page. Default 20. |

**Example**

```
GET /api/users?search=john&nationalities=British,Indian&sortBy=age&sortDir=desc&page=1
```

**Response**

```json
{
  "users": [
    {
      "id": 1,
      "avatar": "https://...",
      "first_name": "John",
      "last_name": "Smith",
      "age": 25,
      "nationality": "British",
      "hobbies": ["Reading", "Coding"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "hasMore": true
  },
  "filters": {
    "nationalities": [
      { "value": "British", "count": 45 }
    ],
    "hobbies": [
      { "value": "Reading", "count": 89 }
    ]
  }
}
```

---

## Project Structure

```
presight-exercise/
  client/                   React frontend
    src/
      api/                  API call functions
      components/           UI components
      hooks/                Custom hooks
      pages/                Page components
      types/                TypeScript types
    .env.production         Production API URL
    vite.config.ts

  server/                   Node.js backend
    src/
      database/
        db.js               SQLite connection and table setup
        seed.js             Seed 1000 users with faker
      routes/
        users.js            All API endpoints
      index.js              Express server entry point

  Dockerfile.client         Builds and serves React app with nginx
  Dockerfile.server         Builds Node.js server
  docker-compose.yml        Runs both services together
  nginx.conf                nginx reverse proxy configuration
```

---

## Data Model

Three tables in SQLite:

```
users         - user records
hobbies       - master list of 25 hobbies
user_hobbies  - links users to their hobbies (many-to-many)
```

Each user has 0 to 10 randomly assigned hobbies from the master list.

---

## Notes

- Database seeds automatically on first Docker run
- Subsequent runs skip seeding if data already exists
- Database is persisted in a Docker named volume
- All filter state is synced to URL query parameters