import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode, sign, verify, jwt } from 'hono/jwt';
import { getCookie, setCookie } from "hono/cookie";
import { Context } from "hono";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>()

interface CustomContext extends Context{
  user?: tokenCookiePayload;
}

interface tokenCookiePayload  {
  email?: string,
  name?: string,
  id?: string,
}

app.use('/api/v1/blog/*', async (c: CustomContext, next) => {

  const header = c.req.header("authorization") || "";

  //Bearer token => ["Bearer", "token"]
  const token = header.split(" ")[1]

  const verifiedUser: any = await verify(token, c.env.JWT_SECRET)

  if (verifiedUser.id) {
    // c.user = verifiedUser
    c.set('user', verifiedUser)
    return next()
  }
  
  c.status(403)
  return c.json({ message: "invalid token, login again" })
})

app.get('/', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const user = await prisma.user.create({
    data: {
      email: "test@gmail.com",
      password: "test@pass",
      name: "test name"
    }
  })

  if (!user) {
    return c.json({ message: "failed to create a user" })
  }
  console.log(user)
  return c.json({ message: 'user created' })
})

app.post('/api/v1/signup', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())
  await prisma.$connect()

  interface signupUser {
    email: string,
    password: string,
    name?: string
  }

  const body: signupUser | any = await c.req.json() // we get the body from this

  const createdUser = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
      name: body.name
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  if (!createdUser) {
    c.status(500)
    return c.json({ message: "internal server error" })
  }

  if (createdUser) {
    const token = await sign(createdUser, c.env.JWT_SECRET)

    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days expiry
    })

    return c.json({ message: 'signup  successfull!', token })
  }

})

app.post('/api/v1/login', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const body: any = c.req.json();

  // first check the email exist or not
  const foundUser = await prisma.user.findUnique({
    where: {
      email: body.email
    },
    select: {
      email: true,
      password: true,
      name: true,
      id: true,
    }
  })

  if (!foundUser) {
    c.status(404)
    return c.json({ message: "user with this email id not exist!" })
  }

  // check the provided password for the provided email id 
  const isPasswordMatch: boolean = foundUser.password === body.password

  if (isPasswordMatch) {
    const token = await sign({
      name: foundUser.name,
      email: foundUser.email,
      id: foundUser.id,
    }, c.env.JWT_SECRET)

    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days expiry
    })

    c.status(202)
    return c.json({ message: 'login successfull!', token })
  } else {
    c.status(401)
    return c.json({ message: "wrong password" })
  }

})

app.post('/api/v1/blog/create', (c) => {
  return c.text('this is the blog route')
})

app.put('/api/v1/blog/update/:id', (c) => {
  return c.text('this is the blog put route')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('this is get blog route')
})

export default app
