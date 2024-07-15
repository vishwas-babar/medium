import { useNavigate } from "react-router-dom"


const BlogCard = ({ authorName, title, content, publishedDate, postid  }: {
    authorName: string,
    title: string,
    content: string,
    publishedDate: string,
    postid: string
}) => {

    const navigate = useNavigate()
    
    return (
        <div
            onClick={() => navigate(`/blog/${postid}`)} 
            className=" w-[600px] border-b  border-slate-300 border-spacing-1 px-5 py-2">
            <div className="flex gap-2 mt-3 items-center">
                <Avatar name={authorName} />
                <div className=" text-[17px] text-slate-700 font-semibold">
                    {authorName}
                </div>
            </div>

            <div className="mt-2">
                <h2 className="text-2xl font-semibold text-slate-900">
                    {title}
                </h2>
            </div>

            <div>
                <p className="text-slate-700">
                    {content.slice(0, 100)} ...
                </p>
            </div>
            <div className="flex justify-between mt-2">
                <p className="text-sm text-slate-500">
                    {publishedDate}
                </p>
                <p className="text-sm text-slate-500">
                    {Math.ceil(content.length / 200)} min read
                </p>
            </div>
        </div>
    )
}

export const Avatar = ({ name, className="" }: { name: string, className?: string }) => {
    return (
        <div className={`rounded-full flex items-center justify-center size-6 text-[18px] font-semibold  bg-amber-700 text-white ${className}`}>
            {name[0]}
        </div>
    )
}

export default BlogCard