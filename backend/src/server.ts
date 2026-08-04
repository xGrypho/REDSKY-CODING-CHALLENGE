import express, { type Request, type Response } from 'express';
import cors from 'cors';
import 'dotenv/config'

import type { User } from './types/user.js'

let users: User[] = []
const app = express();
const port = process.env.PORT || 3800;

async function loadInitialUsers(): Promise<void> {
  try {
    const apiKey = process.env.REQRES_API_KEY

    if (!apiKey) {
      throw new Error('REQRES_API_KEY is not configured')
    }

    const response = await fetch('https://reqres.in/api/users', {
      headers: {
        'x-api-key': apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const data = (await response.json()) as { data: User[] }

    users = data.data

    console.log(`${users.length} users loaded from ReqRes`)
  } catch (error) {
    console.error('Failed to fetch users from ReqRes:', error)
    throw error
  }
}

app.use(cors());
app.use(express.json());

app.get('/api/users', (req: Request, res: Response) => {
  res.json(users);
});

app.post('/api/users', (req: Request, res: Response) => {
  const { first_name, last_name, email, avatar } = req.body

  if (!first_name || !last_name || !email || !avatar) {
    return res.status(400).json({ message: 'All user fields are required' })
  }

let nextId: number

    if (users.length > 0) {
        nextId = Math.max(...users.map((user) => user.id)) + 1
    } else {
        nextId = 1
    }

  const newUser: User = {
    id: nextId,
    first_name,
    last_name,
    email,
    avatar,
  }

  users.push(newUser)

  res.status(201).json(newUser)
})

app.put('/api/users/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { first_name, last_name, email, avatar } = req.body

  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (!first_name || !last_name || !email || !avatar) {
    return res.status(400).json({ message: 'All user fields are required' })
  }

  const updatedUser: User = {
    id,
    first_name,
    last_name,
    email,
    avatar,
  }

  users[userIndex] = updatedUser

  res.json(updatedUser)
})

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' })
  }

  users.splice(userIndex, 1)

  res.status(204).send()
})

app.get('/api/users/:id/avatar', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const user = users.find((user) => user.id === id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  try {
    const avatarResponse = await fetch(user.avatar)

    if (!avatarResponse.ok) {
      return res.status(502).json({ message: 'Failed to fetch avatar image' })
    }

    const imageBuffer = Buffer.from(await avatarResponse.arrayBuffer())
    const contentType = avatarResponse.headers.get('content-type') ?? 'image/jpeg'

    res.setHeader('Content-Type', contentType)
    res.send(imageBuffer)
  } catch (error) {
    console.error('Failed to proxy avatar image:', error)
    res.status(502).json({ message: 'Failed to fetch avatar image' })
  }
})


async function startServer() {
    await loadInitialUsers()
    app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})