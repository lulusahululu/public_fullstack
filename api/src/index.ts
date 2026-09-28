import { Hono } from 'hono'

const app = new Hono()

type Book = {
  id: number
  title: string
  author: string
}

let nextBookId = 3
const books: Book[] = [
  { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin' },
]

app.get('/', (c) => {
  return c.html('<h1 style="text-align: center;">Hello Hono!</h1>')
})

app.get('/api/helth', (c) => {
  return c.json({ status: 'ok',date: new Date().toLocaleString() })
})

app.get('/api/books', (c) => {
  return c.json(books)
})

app.post('/api/books', async (c) => {
  const body = await c.req.json<Partial<Book>>()

  if (!body.title || !body.author) {
    return c.json({ error: 'title and author are required' }, 400)
  }

  const book: Book = {
    id: nextBookId++,
    title: body.title,
    author: body.author,
  }

  books.push(book)
  return c.json(book, 201)
})

app.put('/api/books/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const book = books.find((item) => item.id === id)

  if (!book) {
    return c.json({ error: 'book not found' }, 404)
  }

  const body = await c.req.json<Partial<Book>>()
  book.title = body.title ?? book.title
  book.author = body.author ?? book.author

  return c.json(book)
})

app.delete('/api/books/:id', (c) => {
  const id = Number(c.req.param('id'))
  const bookIndex = books.findIndex((item) => item.id === id)

  if (bookIndex === -1) {
    return c.json({ error: 'book not found' }, 404)
  }

  const [book] = books.splice(bookIndex, 1)
  return c.json({ message: 'book deleted', book })
})

app.get('/api/env', (c) => {
  return c.json({
    NODE_ENV: process.env.NODE_ENV ?? 'not set',
    API_MESSAGE: process.env.API_MESSAGE ?? 'not set',
  })
})





export default app
