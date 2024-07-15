import React from 'react'
import { Avatar } from './BlogCard'

const ReadBlog = ({
    title,
    content,
    authorName,
    publishedDate,
    authorId,
    postid
}: {
    title: string,
    content: string,
    authorName: string,
    publishedDate: string,
    authorId: string,
    postid: string
}) => {
    return (
        <div className='flex gap-5 mt-28'>
            <div className='w-full'>
                <h1 className='text-6xl font-bold'>
                    {title}
                </h1>
                <p className=' text-slate-500'>Posted on {publishedDate}</p>

                <div className='mt-5'>
                    <p className='text-slate-700 text-base'>
                        {content}
                    </p>
                </div>
            </div>
            <div className='w-1/3'>
                <p className='font-semibold'>Author</p>
                <div className='flex mt-5 items-center'>

                    <div>
                    <Avatar name={authorName} />
                    </div>
                    <div className='ml-6 overflow-hidden '>
                        <p className='text-2xl font-bold '>{authorName}</p>
                        <p className='text-base text-slate-500'>this is the user bio that tells us about the author of this</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ReadBlog