# Redsky Coding Challenge

A full-stack user management application built with Svelte, TypeScript, Tailwind CSS, Node.js, and Express.

## Features

- Loads an initial user list from ReqRes.
- Creates, edits, and deletes users.
- Stores changes in an in-memory cache while the backend is running.
- Displays user avatars through a backend proxy.
- Shows success and error toast notifications.
- Includes a responsive user table and reusable user modal.

## Tech Stack

### Frontend

- Svelte 5
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- Express
- ReqRes API

## Prerequisites

- Node.js 18 or later
- A ReqRes API key

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
REQRES_API_KEY=your_reqres_api_key
```

The `.env` file is intentionally ignored by Git and must not be committed.

## Run Locally

Install and start the backend:

```bash
cd backend
npm install
npm run dev
```

The backend runs at:

```text
http://localhost:3800
```

In a second terminal, install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/users` | Get cached users |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |
| GET | `/api/users/:id/avatar` | Proxy a user avatar image |

## Notes

- User changes are stored in memory only.
- Restarting the backend reloads the initial data from ReqRes.
- ReqRes is used only for the initial user list.
