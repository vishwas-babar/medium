import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@vishwas-babar/medium-common";


export const blogRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        user: {
            id: string,
            name: string,
            email: string
        }
    }
}>();


blogRoute.use('/*', async (c, next) => {

    const header = c.req.header("authorization") || "";

    //Bearer token => ["Bearer", "token"]
    const token = header.split(" ")[1]

    try {
        const verifiedUser: any = await verify(token, c.env.JWT_SECRET)

        if (verifiedUser.id) {
            // c.user = verifiedUser
            console.log(verifiedUser)
            c.set('user', verifiedUser)
            console.log("c.get value: ", c.get('user'))
            return next()
        }

        c.status(403)
        return c.json({ message: "invalid token, login again" })
    } catch (error) {
        c.status(403)
        return c.json({ message: "invalid token, login again" })
    }
})

// api/v1/blog/test
blogRoute.post('/test', (c) => {
    return c.text('test successes')
})

// api/v1/blog/create
blogRoute.post('/create', async (c) => {
    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const { success, data } = createBlogInput.safeParse(body)

    if (!success) {
        c.status(400)
        return c.json({ message: "provide valid data for this" })
    }

    const author = c.get('user')

    try {
        const createdPost = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                authorId: author.id // todo: replace it with original dynamic ids
            }
        })

        if (createdPost?.id) {
            c.status(200)
            return c.json({ message: "post created" })
        }

        c.status(500)
        c.json({ message: "post is not created!" })
    } catch (error) {
        c.status(500)
        return c.json({ message: "failed to create a post!" })
    }
})

// api/v1/blog/update/:id
blogRoute.put('/update', async (c) => {
    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const { success, data } = updateBlogInput.safeParse(body)

    if (!success) {
        c.status(400)
        return c.json({ message: "provide valid data for this" })
    }


    try {
        const updatedPost = await prisma.post.update({
            where: {
                id: data.id
            },
            data: {
                title: data.title,
                content: data.content,
                published: data.published
            }
        })

        c.status(200)
        return c.json({ message: "post updated succesfully" })
    } catch (error) {
        c.status(500)
        return c.json({ message: "failed to create the post" })
    }
})

// api/v1/blog/:id
blogRoute.get('/:id', async (c) => {
    const { id: postId } = c.req.param();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())


    try {
        const post = await prisma.post.findFirst({
            where: {
                id: postId
            },
            select: {
                id: true,
                title: true,
                content: true,
                authorId: true,
            }
        })

        if (!post) {
            c.status(404)
            return c.json({ message: "blog post not exist" })
        }

        c.status(200)
        return c.json({ post })
    } catch (error) {
        c.status(500)
        return c.json({ message: "failed to find the post" })
    }
})

// api/v1/blog/get-all
blogRoute.get('/get-blogs/:page', async (c) => {
    const { page } = c.req.param();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const postsToSkip = (parseInt(page) - 1) * 10;
    const postsToTake = 10;

    try {
        const blogs = await prisma.post.findMany({
            skip: postsToSkip,
            take: postsToTake,
            select: {
                title: true,
                id: true,
                authorId: true,
            }
        })

        c.status(200)
        return c.json({ blogs })
    } catch (error) {
        c.status(500)
        return c.json({ message: "failed to get all posts" })
    }
})
