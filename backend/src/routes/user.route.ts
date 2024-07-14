import { Hono } from 'hono'
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { setCookie } from "hono/cookie";
import { signupUserInput } from '@vishwas-babar/medium-common';

export const userRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>()

// api/v1/user/signup
userRoute.post('/signup', async (c) => {

    try {

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const body = await c.req.json() // we get the body from this

        const { success, error } = signupUserInput.safeParse(body)

        if (!success) {
            c.status(400)
            return c.json({ message: "validation failed for this", error: error })
        }

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


        const token = await sign(createdUser, c.env.JWT_SECRET)

        setCookie(c, 'token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days expiry
        })

        return c.json({ message: 'signup  successfull!', token })

    } catch (err) {
        console.error(err)
        c.status(500)
        return c.json({ message: "something went wrong", err: err })
    }

})

// api/v1/user/login
userRoute.post('/login', async (c) => {

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
