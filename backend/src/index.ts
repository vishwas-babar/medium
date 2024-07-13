import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ name: "vishwas vishnu babar" })
})

app.post('/api/v1/signup', (c) => {
  return c.text('this is the signup route')
})

app.post('/api/v1/login', (c) => {
  return c.text('this is the login route')
})

app.post('/api/v1/blog', (c) => {
  return c.text('this is the blog route')
})

app.put('/api/v1/blog', (c) => {
  return c.text('this is the blog put route')
})

app.get('/api/v1/blog', (c) => {
  return c.text('this is get blog route')
})

export default app
 