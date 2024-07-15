import React, { useState } from 'react'
import BlogCard from '../components/BlogCard'
import { useBlogs } from '../customHooks'
import TopNav from '../components/TopNav'

const Home = () => {

  const [page, setPage] = useState(1)

  const { blogs, isLoading } = useBlogs(page);


  if (isLoading) {
    return <div>Loading...</div>
  }

  return (

    <div className='h-screen pt-28 flex flex-col items-center'>
      {blogs?.map((blog: any) => (
        <BlogCard
          key={blog.id}
          postid={blog.id}
          authorName={blog.author.name}
          title={blog.title}
          content={blog.content}
          publishedDate={getTheDate()}
        />
      ))}
      <TopNav />

    </div>
  )
}

export function getTheDate() {
  const date = new Date();

  const formatedDate = `${date.getDate()} ${getMonthString(date.getMonth())}, ${date.getFullYear()}`
  return formatedDate;
}

export function getMonthString(month: number): string {
  switch (month) {
    case 0:
      return 'Jan'
      break;
    case 1:
      return 'Feb'
      break;
    case 2:
      return 'Mar'
      break;
    case 3:
      return 'Apr'
      break;
    case 4:
      return 'May'
      break;
    case 5:
      return 'Jun'
      break;
    case 6:
      return 'Jul'
      break;
    case 7:
      return 'Aug'
      break;
    case 8:
      return 'Sep'
      break;
    case 9:
      return 'Oct'
      break;
    case 10:
      return 'Nov'
      break;
    case 11:
      return 'Dec'
      break;

    default:
      return ''
  }
}

export default Home