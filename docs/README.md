# Redsky Coding Challenge

A full-stack user management application built with Svelte, TypeScript, Tailwind CSS, Node.js, and Express.

## Features

- Load an initial user list from ReqRes.
- Create, edit, and delete users.
- Store user changes in an in-memory cache while the backend is running.
- Display user avatars through a backend proxy.
- Show success and error toast notifications.
- Responsive user table and reusable user modal.

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