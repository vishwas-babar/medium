import { z } from "zod";

export const signupUserInput = z.object({
    email: z.string().email({ message: "email is not valid!" }),
    name: z.string(),
    password: z.string()
})

export const loginUserInput = z.object({
    email: z.string().email({ message: "email is not valid!" }),
    password: z.string({ message: "password must be string" })
})

export const blogPostInput = z.object({
    title: z.string().min(5),
    content: z.string().min(10),
    published: z.boolean().optional(),
    id: z.string().optional()
})