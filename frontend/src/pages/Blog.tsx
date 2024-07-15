import React from 'react'
import BlogCard from '../components/BlogCard'
import ReadBlog from '../components/ReadBlog'
import { useParams } from 'react-router-dom'
import { useBlog } from '../customHooks'
import { getTheDate } from './Home'

const Blog = () => {

  const id = useParams<{ id: string }>().id || ""

  const { blog, isLoading } = useBlog(id)

  if (isLoading) {
    return <div className='h-screen flex items-center justify-center text-3xl font-semibold'>
      Loading...
    </div>
  } else if (isLoading === false && !blog) {
    return <div className='h-screen flex items-center justify-center text-3xl font-semibold'>Blog not found</div>
  }

  return (
    <div className='h-screen px-40'>

      {blog ? <ReadBlog
        title={blog?.title}
        content={blog?.content}
        authorName={blog?.author.name}
        publishedDate={getTheDate()}
        authorId={blog?.authorId}
        postid={blog?.id}
      /> : <div className='h-screen flex items-center justify-center text-3xl font-semibold'>Blog not found</div>}


    </div>
  )
}

export default Blog