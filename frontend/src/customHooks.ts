import axios from "axios"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "./config"

export interface BlogType {
    title: string;
    content: string;
    id: string;
    authorId: string;
    author: {
        name: string;
    }
}

export const useBlogs = (page: number) => {
    const [blogs, setBlogs] = useState<BlogType[]>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        axios.get(`${BACKEND_URL}/blog/get-blogs/${page}`, {
            headers: {
                authorization: "Bearer " + localStorage.getItem('token')
            }
        })
            .then(res => {
                setBlogs(res.data.blogs)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
                setIsLoading(false)
            })
    }, [page])

    return { blogs, isLoading }
}

export const useBlog = (id: string) => {
    const [blog, setBlog] = useState<BlogType>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        axios.get(`${BACKEND_URL}/blog/${id}`, {
            headers: {
                authorization: "Bearer " + localStorage.getItem('token')
            }
        })
            .then(res => {
                setBlog(res.data.post)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
    }, [id])

    return { blog, isLoading }
}